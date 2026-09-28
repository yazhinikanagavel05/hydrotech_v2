/**
 * Runtime smoke test: mounts every route in a real DOM and fails on any
 * console error, unhandled rejection or React error.
 *
 * A production build can succeed while a route throws on mount ? a bad
 * `sizes` value, a missing image descriptor, a hook ordering mistake. This
 * renders all eight routes through the same entry point the browser uses and
 * asserts the shell actually appeared.
 *
 * Run with:  npm run smoke
 */
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ */
/* 1. Compile a tiny entry that imports the real app                    */
/* ------------------------------------------------------------------ */
const dir = await mkdtemp(join(tmpdir(), "hydrotech-smoke-"));
const entry = join(dir, "entry.jsx");
const bundle = join(dir, "bundle.mjs");

await writeFile(
  entry,
  `
import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from ${JSON.stringify(join(root, "src", "App.jsx"))};

export function mount(path) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(
    <React.StrictMode>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </React.StrictMode>
  );
  return { host, root };
}
`,
  "utf8"
);

await build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: bundle,
  jsx: "automatic",
  loader: { ".js": "jsx", ".css": "empty" },
  define: {
    "process.env.NODE_ENV": '"development"',
    // Mirror what Vite injects, so import.meta.env reads work outside Vite.
    "import.meta.env.BASE_URL": '"/"',
    "import.meta.env.MODE": '"development"',
    "import.meta.env.DEV": "true",
    "import.meta.env.PROD": "false",
    "import.meta.env.SSR": "false",
    "import.meta.env.VITE_SITE_URL": '""',
  },
  logLevel: "silent",
  absWorkingDir: root,
  // The entry lives in a temp dir, so it cannot find node_modules by walking up.
  nodePaths: [join(root, "node_modules")],
});

/* ------------------------------------------------------------------ */
/* 2. A DOM with the browser APIs the site actually uses                */
/* ------------------------------------------------------------------ */
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
  url: "https://hydrotech.test/",
  pretendToBeVisual: true,
});

const { window } = dom;

// Only what the site touches. Anything else failing is worth knowing about.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});

const liveObservers = new Set();

class Observer {
  constructor(cb) {
    this.cb = cb;
    liveObservers.add(this);
  }
  observe(target) {
    // Report the target as visible, as it would be on load.
    this.cb([{ target, isIntersecting: true, intersectionRatio: 1 }], this);
  }
  unobserve() {}
  disconnect() {
    liveObservers.delete(this);
  }
  takeRecords() {
    return [];
  }
}

const ObserverShim = Observer;

// Expose the DOM globals before anything else touches the prototype.
for (const key of [
  "window",
  "document",
  "location",
  "history",
  "HTMLElement",
  "Element",
  "Node",
  "Event",
  "CustomEvent",
  "MouseEvent",
  "KeyboardEvent",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "sessionStorage",
  "localStorage",
  "DOMParser",
  "SVGElement",
  "Image",
  "fetch",
]) {
  if (window[key] === undefined) continue;
  try {
    globalThis[key] = window[key];
  } catch {
    // Some globals (navigator in recent Node) are getter-only. The app reads
    // them off `window`, so leaving Node's own in place is harmless.
    Object.defineProperty(globalThis, key, {
      value: window[key],
      configurable: true,
      writable: true,
    });
  }
}

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});

window.IntersectionObserver = ObserverShim;
window.ResizeObserver = ObserverShim;
window.scrollTo = () => {};

// jsdom has no layout, so a ResizeObserver can never fire on its own. A real
// one does fire whenever a box changes size, so let the tests ask for a
// delivery by hand after they have given an element a believable geometry.
window.__resize = {
  flush() {
    for (const o of [...liveObservers]) o.cb([], o);
    return liveObservers.size;
  },
  count: () => liveObservers.size,
};
globalThis.IntersectionObserver = ObserverShim;
globalThis.ResizeObserver = ObserverShim;

if (window.Element) {
  window.Element.prototype.scrollIntoView = () => {};
  window.Element.prototype.scrollBy = () => {};
  window.Element.prototype.setPointerCapture = () => {};
  window.Element.prototype.releasePointerCapture = () => {};
}

// jsdom has no sessionStorage in some versions; the splash uses it.
if (!window.sessionStorage) {
  const store = new Map();
  const shim = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
  window.sessionStorage = shim;
  globalThis.sessionStorage = shim;
}
globalThis.self = window;
globalThis.IS_REACT_ACT_ENVIRONMENT = false;

/* ------------------------------------------------------------------ */
/* 3. Fail loudly on anything React or the page logs                    */
/* ------------------------------------------------------------------ */
const problems = [];
const ignore = [/Not implemented: HTMLCanvasElement/, /Download the React DevTools/];

const record = (kind) => (msg) => {
  const text = typeof msg === "string" ? msg : msg?.message || String(msg);
  if (ignore.some((re) => re.test(text))) return;
  problems.push(`${kind}: ${text}`);
};

const realError = console.error;
const realWarn = console.warn;
console.error = (...args) => {
  record("console.error")(args.map(String).join(" "));
  realError(...args);
};
console.warn = (...args) => {
  record("console.warn")(args.map(String).join(" "));
  realWarn(...args);
};

process.on("unhandledRejection", (reason) => record("unhandledRejection")(reason));

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Poll until `fn()` is truthy, so a test never depends on a fixed sleep. */
async function waitFor(label, fn, timeout = 1500) {
  const started = Date.now();
  for (;;) {
    const value = fn();
    if (value) return value;
    if (Date.now() - started > timeout) return value;
    await wait(25);
  }
}

function click(el) {
  el.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  el.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  el.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
}

/* Give every rail a believable tablet geometry ? two cards and a peek, so a
   rail with three or more cards genuinely overflows. jsdom has no layout
   engine, so a correct carousel measures zero and correctly refuses to move;
   without this the arrows would stay disabled and nothing would be tested. */
function giveRailsAGeometry(rails, { slide = 300, gap = 20, view = 620 } = {}) {
  for (const rail of rails) {
    const vp = rail.querySelector(".carousel__viewport");
    const tr = rail.querySelector(".carousel__track");
    const slides = [...tr.children];
    tr.style.columnGap = `${gap}px`;
    Object.defineProperty(vp, "clientWidth", { value: view, configurable: true });
    Object.defineProperty(tr, "scrollWidth", {
      value: slides.length * slide + (slides.length - 1) * gap,
      configurable: true,
    });
    for (const s of slides) {
      s.getBoundingClientRect = () => ({ width: slide, height: 400, top: 0, left: 0, right: slide, bottom: 400 });
    }
  }
  // Ask every observer for a delivery, exactly as a real browser does when
  // the boxes above change size, then nudge the window listener too.
  window.__resize.flush();
  window.dispatchEvent(new window.Event("resize"));
}

const nextArrow = (rail) =>
  [...rail.querySelectorAll(".carousel__btns button")].find(
    (b) => !b.disabled && !/Previous/i.test(b.getAttribute("aria-label") || "")
  );
const prevArrow = (rail) =>
  [...rail.querySelectorAll(".carousel__btns button")].find((b) =>
    /Previous/i.test(b.getAttribute("aria-label") || "")
  );

/* Drive every rail: each one must move on its own, and moving one must leave
   the others exactly where they were. */
async function exerciseRails(host, label, rails) {
  const tracks = new Set(rails.map((r) => r.querySelector(".carousel__track")));
  check(`${label}: each rail has its own track`, tracks.size === rails.length, `rails=${rails.length}`);

  giveRailsAGeometry(rails);

  for (const rail of rails) {
    const track = rail.querySelector(".carousel__track");
    const next = await waitFor("next arrow", () => nextArrow(rail));
    check(`${label}: a rail that overflows offers a next arrow`, Boolean(next), `slides=${track.children.length}`);
    const before = track.style.transform || "";
    if (next) {
      click(next);
      await waitFor("track movement", () => (track.style.transform || "") !== before);
    }
    check(
      `${label}: the next arrow moved this rail's track`,
      (track.style.transform || "") !== before,
      `${before} -> ${track.style.transform}`
    );

    const prev = prevArrow(rail);
    if (prev) {
      click(prev);
      await waitFor("return to the first card", () => (track.style.transform || "") === before);
    }
    check(`${label}: the previous arrow brought it back`, (track.style.transform || "") === before);
  }

  const settled = rails.map((r) => r.querySelector(".carousel__track").style.transform);
  const target = rails[0];
  const next = nextArrow(target);
  if (next) {
    click(next);
    await waitFor("track movement", () => (target.querySelector(".carousel__track").style.transform || "") !== settled[0]);
  }
  check(
    `${label}: moving one rail leaves the others alone`,
    rails.slice(1).every((r, i) => r.querySelector(".carousel__track").style.transform === settled[i])
  );
}

/* ------------------------------------------------------------------ */
/* 4. Mount every route                                                */
/* ------------------------------------------------------------------ */
const ROUTES = [
  "/",
  "/irrigation",
  "/products",
  "/applications",
  "/projects",
  "/about",
  "/contact",
  "/this-route-does-not-exist",
];

const EXPECT = {
  "/": "hydrotech",
  "/irrigation": "irrigation",
  "/products": "products",
  "/applications": "applications",
  "/projects": "projects",
  "/about": "about",
  "/contact": "contact",
  "/this-route-does-not-exist": "404",
};

const { mount } = await import(pathToFileURL(bundle).href);

let failures = 0;

for (const path of ROUTES) {
  problems.length = 0;
  const { host, root } = mount(path);
  await wait(120);

  const text = host.textContent || "";
  const heading = host.querySelector("h1")?.textContent?.trim() || "";
  const imgs = [...host.querySelectorAll("img")];
  const badImgs = imgs.filter((i) => !i.getAttribute("alt") && i.getAttribute("alt") !== "");
  const noSizes = imgs.filter((i) => i.getAttribute("srcset") && !i.getAttribute("sizes"));
  const main = host.querySelector("#main");

  const issues = [...problems];
  if (!heading) issues.push("render error: no <h1> on the page");
  if (!text.toLowerCase().includes(EXPECT[path])) {
    issues.push(`missing expected copy "${EXPECT[path]}"`);
  }
  if (!main) issues.push('no element with id="main" ? the skip link has no target');
  if (badImgs.length) issues.push(`${badImgs.length} <img> without an alt attribute`);
  if (noSizes.length) issues.push(`${noSizes.length} <img> with srcset but no sizes`);

  if (issues.length) {
    failures += 1;
    console.log(`  FAIL  ${path}`);
    for (const i of [...new Set(issues)]) console.log(`          ${i}`);
  } else {
    console.log(
      `  ok    ${path.padEnd(28)} h1="${heading.slice(0, 46)}"  imgs=${imgs.length}`
    );
  }

  root.unmount();
  host.remove();
}

/* ------------------------------------------------------------------ */
/* 5. Interaction pass                                                 */
/*                                                                     */
/* Rendering is only half of it. These drive the controls a visitor is  */
/* most likely to use and assert the visible result changed, so a       */
/* regression like "the filter button no longer filters" fails the run  */
/* instead of being found by eye months later.                          */
/* ------------------------------------------------------------------ */
const checks = [];
function check(name, condition, detail = "") {
  checks.push({ name, ok: Boolean(condition), detail });
}

const withPage = async (path, fn) => {
  const { host, root } = mount(path);
  await wait(150);
  try {
    await fn(host);
  } catch (err) {
    check(`${path} interaction`, false, err.message);
  }
  root.unmount();
  host.remove();
  await wait(30);
};

// Mobile navigation: open, focus moves into the drawer, Escape closes it,
// and focus returns to the toggle.
await withPage("/", async (host) => {
  const burger = host.querySelector(".hdr__burger");
  check("home: menu button exists", burger);
  if (!burger) return;

  // The burger is re-queried immediately before the click. The header
  // re-renders on mount (useScrolled fires a rAF, useReveal arms elements) and
  // React can swap the node out from under a reference captured earlier ? a
  // click dispatched on a detached node never reaches the root listener, which
  // made this assertion fail intermittently.
  const liveBurger = () => host.querySelector(".hdr__burger");
  click(liveBurger());
  await waitFor("drawer open", () => host.querySelector(".hdr")?.classList.contains("is-open"));
  const header = host.querySelector(".hdr");
  const drawer = host.querySelector(".mnav");
  check("home: drawer opens", header?.classList.contains("is-open"));
  check("home: drawer is in the DOM", drawer);
  check(
    "home: focus moves into the drawer",
    drawer?.contains(document.activeElement),
    `activeElement=${document.activeElement?.className || document.activeElement?.tagName}`
  );
  check("home: drawer marked aria-modal", drawer?.getAttribute("aria-modal") === "true");

  // The focus trap: Tab on the last control and Shift+Tab on the first must both
  // be intercepted, otherwise Tab would walk out into the page behind.
  const focusable = drawer
    ? [...drawer.querySelectorAll("a[href], button:not([disabled])")]
    : [];
  if (focusable.length > 1) {
    focusable[focusable.length - 1].focus();
    const forward = new window.KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    focusable[focusable.length - 1].dispatchEvent(forward);
    check("home: Tab is trapped at the end of the drawer", forward.defaultPrevented);

    focusable[0].focus();
    const back = new window.KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    focusable[0].dispatchEvent(back);
    check("home: Shift+Tab is trapped at the start of the drawer", back.defaultPrevented);
  }

  // Dispatched on document so it bubbles to the window-level Escape listener.
  document.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })
  );
  await wait(80);
  check("home: Escape closes the drawer", !header?.classList.contains("is-open"));
  check(
    "home: focus returns to the toggle",
    document.activeElement === liveBurger(),
    `activeElement=${document.activeElement?.className}`
  );
});

// Hero slider: next / previous and arrow-key navigation change the slide.
await withPage("/", async (host) => {
  const counter = host.querySelector(".hero__counter b");
  const next = [...host.querySelectorAll(".sbtn")].find((b) =>
    /next slide/i.test(b.getAttribute("aria-label") || "")
  );
  const first = counter?.textContent;
  click(next);
  await wait(60);
  check("home: hero advances on Next", counter?.textContent !== first, `${first} -> ${counter?.textContent}`);

  const stage = host.querySelector(".hero__stage");
  stage.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true })
  );
  await wait(60);
  check("home: hero responds to ArrowLeft", counter?.textContent === first);

  const hidden = [...stage.querySelectorAll(".hero__slide")].filter((n) =>
    n.hasAttribute("inert")
  );
  check(
    "home: off-screen slides are inert",
    hidden.length === 2,
    `inert=${hidden.length}`
  );

  const pause = [...host.querySelectorAll(".sbtn")].find((b) =>
    /pause slideshow/i.test(b.getAttribute("aria-label") || "")
  );
  click(pause);
  await wait(40);
  check(
    "home: pause button reports its state",
    pause?.getAttribute("aria-pressed") === "true"
  );
});

// Products: the filter actually filters, and the pressed state follows.
await withPage("/products", async (host) => {
  const tabs = [...host.querySelectorAll(".tab")];
  check("products: filter buttons exist", tabs.length > 1, `${tabs.length} buttons`);
  if (tabs.length < 2) return;

  const cards = () => host.querySelectorAll(".pgrid .pcard").length;
  const before = cards();
  const beforePressed = tabs.filter((t) => t.getAttribute("aria-pressed") === "true").length;

  click(tabs[1]);
  await wait(80);
  check("products: filter changes the card count", cards() !== before, `${before} -> ${cards()}`);
  check(
    "products: exactly one filter stays pressed",
    tabs.filter((t) => t.getAttribute("aria-pressed") === "true").length === 1
  );
  check(
    "products: no invalid tab semantics remain",
    !host.querySelector('[role="tablist"], [role="tab"]')
  );
  check("products: one pressed filter to begin with", beforePressed === 1, `${beforePressed}`);
});

// Projects: a gallery is a grid. It must offer no layout toggle and carry no
// slider controls, so there is only ever one way to read the section.
await withPage("/projects", async (host) => {
  const tabs = [...host.querySelectorAll(".tab")];
  check(
    "projects: there is no Grid/Swipe layout toggle",
    tabs.length === 0,
    `layout toggles found=${tabs.length}`
  );
  check(
    "projects: the gallery is a grid, not a slider",
    Boolean(host.querySelector(".pgrid")) && !host.querySelector(".carousel"),
    `grid=${Boolean(host.querySelector(".pgrid"))} carousel=${Boolean(host.querySelector(".carousel"))}`
  );
  check(
    "projects: the grid carries no slider arrows",
    host.querySelectorAll(".carousel__btns button").length === 0,
    "a grid must not present previous/next controls"
  );
  const cards = [...host.querySelectorAll(".pgrid > *")];
  check("projects: the gallery has cards", cards.length > 0, `cards=${cards.length}`);
  check(
    "projects: every gallery card is a link to the project",
    cards.every((c) => c.querySelector("a[href]")),
    "cards should be reachable"
  );
});

// Contact: the form blocks an empty submit and never claims a false success.
await withPage("/contact", async (host) => {
  const form = host.querySelector("form");
  check("contact: form exists", form);
  if (!form) return;

  const submit = form.querySelector('button[type="submit"]');
  click(submit);
  await wait(80);

  const invalid = form.querySelectorAll('[aria-invalid="true"], .field--error, [role="alert"]');
  check("contact: empty submit is rejected with feedback", invalid.length > 0, `${invalid.length} error nodes`);
  check(
    "contact: no success message after an empty submit",
    !/thank you|we.ll be in touch|received/i.test(host.textContent || "")
  );

  const fill = (field) => {
    const proto =
      field instanceof window.HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : field instanceof window.HTMLInputElement
          ? window.HTMLInputElement.prototype
          : null;
    if (!proto) return;
    const value =
      field.type === "email"
        ? "farmer@example.com"
        : field.type === "tel"
          ? "90809 80339"
          : field.tagName === "SELECT"
            ? field.options[field.options.length - 1].value
            : "Two acres of paddy, Karur.";
    // Assign through the prototype setter so React's value tracker sees a change.
    Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(field, value);
    field.dispatchEvent(new window.Event("input", { bubbles: true }));
    field.dispatchEvent(new window.Event("change", { bubbles: true }));
  };

  form.querySelectorAll("input, textarea, select").forEach((field) => {
    if (field.type === "submit" || field.type === "button") return;
    fill(field);
  });
  await wait(60);
  click(submit);
  await wait(100);

  const body = host.textContent || "";
  check(
    "contact: the honest no-backend message is shown",
    /not (been )?(transmitted|sent|received|stored)|no (server|backend)|we (haven't|have not) received/i.test(
      body
    ),
    "the form must not imply the enquiry was delivered"
  );
  check(
    "contact: a tel: link is offered as the real alternative",
    Boolean(host.querySelector('a[href^="tel:"]'))
  );
});

/* ------------------------------------------------------------------ */
/* 5b. Nested interactive elements                                     */
/*                                                                     */
/* An <a> inside a <button>, a <button> inside a <Link>, or any        */
/* interactive node inside another one produces the exact routing bug  */
/* this site had: the inner element's click lands on the outer         */
/* element's target. These are illegal in HTML and must never appear.   */
/* ------------------------------------------------------------------ */
for (const path of ROUTES) {
  await withPage(path, async (host) => {
    const nested = [
      ...host.querySelectorAll("a button, a a, button a, button button, button [role='button']"),
    ];
    check(
      `${path}: no interactive element nested inside another`,
      nested.length === 0,
      nested.length ? nested.map((n) => n.outerHTML.slice(0, 90)).join(" | ") : "a > button, button > a, a > a"
    );
  });
}

/* ------------------------------------------------------------------ */
/* 5b. Header logo and the CTA eyebrow must be legible                  */
/*                                                                     */
/* Two silent-failure classes are checked here, both invisible to a    */
/* structural test:                                                    */
/*   - the logo is chosen in markup from the header's on-photo state,  */
/*     so a mismatch shows a white logo on a paper header;              */
/*   - the CTA eyebrow colour comes from `.on-dark .eyebrow`, so a     */
/*     dark section missing that class renders navy text on a dark     */
/*     photograph.                                                      */
/* ------------------------------------------------------------------ */
for (const path of ROUTES) {
  await withPage(path, async (host) => {
    const logo = host.querySelector(".hdr__logo img");
    check(
      `${path}: the header logo is present with a real source`,
      Boolean(logo) && typeof logo.getAttribute("src") === "string" && logo.getAttribute("src").length > 0,
      logo ? `src=${logo.getAttribute("src")}` : "no .hdr__logo img"
    );
    check(
      `${path}: the header logo has alt text`,
      Boolean(logo?.getAttribute("alt")),
      `alt=${JSON.stringify(logo?.getAttribute("alt"))}`
    );

    // The logo must match the header treatment: light over a photo, dark on paper.
    const overHero = host.querySelector(".hdr")?.classList.contains("is-overHero");
    const src = logo?.getAttribute("src") ?? "";
    const wantsLight = Boolean(overHero);
    check(
      `${path}: the header uses the ${wantsLight ? "light" : "dark"} logo for its ${
        wantsLight ? "photo" : "solid"
      } header`,
      wantsLight ? src.includes("logo-light") : src.includes("logo-dark"),
      `is-overHero=${overHero} src=${src}`
    );

    // The closing call to action: the eyebrow sits above the heading and is
    // the one line that must not fall back to the navy-on-dark default.
    const ctas = [...host.querySelectorAll(".cta")];
    for (const cta of ctas) {
      const eyebrow = cta.querySelector(".eyebrow");
      check(
        `${path}: the CTA shows its eyebrow above the heading`,
        Boolean(eyebrow) && eyebrow.textContent.trim().length > 0,
        eyebrow ? `"${eyebrow.textContent.trim()}"` : "no .eyebrow in .cta"
      );
      check(
        `${path}: the CTA section carries on-dark so its text is not navy on a photo`,
        cta.classList.contains("on-dark"),
        `class="${cta.className}"`
      );
      // Ordering: the eyebrow must precede the heading, not follow it.
      const heading = cta.querySelector(".section-head__title, h2");
      if (eyebrow && heading) {
        check(
          `${path}: the CTA eyebrow comes before the heading`,
          eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
          `"${eyebrow.textContent.trim()}" is not above the heading`
        );
      }
    }
  });
}

/* ------------------------------------------------------------------ */
/* 5c. Every navbar item, from every page                              */
/* ------------------------------------------------------------------ */
const NAV = [
  ["Home", "/"],
  ["Irrigation", "/irrigation"],
  ["Products", "/products"],
  ["Applications", "/applications"],
  ["Projects", "/projects"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
const NAV_ROUTES = NAV.map(([, to]) => to);

for (const from of NAV_ROUTES) {
  await withPage(from, async () => {
    const header = document.querySelector(".hdr");
    const links = [...(header?.querySelectorAll(".hdr__nav a") ?? [])];

    check(
      `${from}: the navbar has all ${NAV.length} items`,
      links.length === NAV.length,
      `found=${links.map((l) => l.textContent.trim()).join(", ")}`
    );

    // Each item points at the right route, in order.
    for (const [i, [label, to]] of NAV.entries()) {
      const link = links[i];
      if (!link) {
        check(`${from}: navbar item ${label} exists`, false, "missing");
        continue;
      }
      check(
        `${from}: navbar "${label}" points at ${to}`,
        link.getAttribute("href") === to && link.textContent.trim() === label,
        `href=${link.getAttribute("href")} label=${link.textContent.trim()}`
      );
    }

    // Exactly one item is marked active, and it is the one for this route.
    const active = links.filter((l) => l.classList.contains("is-active"));
    check(
      `${from}: exactly one navbar item is active`,
      active.length === 1,
      `active=${active.map((l) => l.textContent.trim()).join(", ") || "none"}`
    );
    check(
      `${from}: the active navbar item is the current page`,
      active.length === 1 && active[0].getAttribute("href") === from,
      `expected ${from}, got ${active[0]?.getAttribute("href")}`
    );

    // Now click through the whole matrix from this page: every item, in turn.
    // After each successful click we are on a known route, and we navigate
    // back by clicking the item for `from` ? so if any link is broken the
    // first failure stops the run instead of cascading.
    //
    // The route is read from the router's own active NavLink, not from
    // window.location: the harness mounts a MemoryRouter, so an in-app
    // navigation never touches the JSDOM URL and window.location would stay
    // frozen on the route we started from.
    const currentRoute = () =>
      document.querySelector(".hdr__nav a.is-active")?.getAttribute("href") ?? null;

    for (const [label, to] of NAV) {
      // Re-query every time: a navigation re-renders the header, and a click
      // on a detached node never reaches React's listener.
      const link = [...document.querySelectorAll(".hdr__nav a")].find(
        (l) => l.textContent.trim() === label
      );
      if (!link) {
        check(`${from}: navbar "${label}" is present`, false, "missing from the header");
        break;
      }
      click(link);
      await waitFor("navigation", () => currentRoute() === to);
      if (currentRoute() !== to) {
        check(`${from}: clicking "${label}" opens ${to}`, false, `landed on ${currentRoute()}`);
        break;
      }
      // The destination must actually render, not just change the URL.
      const rendered = document.querySelector("#main");
      check(
        `${from}: clicking "${label}" opens ${to}`,
        Boolean(rendered) && rendered.textContent.trim().length > 40,
        `landed on ${currentRoute()} with ${rendered?.textContent.trim().length ?? 0} characters`
      );

      // Let the router finish before the next click. Clicking twice inside one
      // tick interleaves the two history writes and the route disagrees with
      // the page, which no user can reproduce but would fail the assertion.
      await wait(40);

      if (to !== from) {
        const back = [...document.querySelectorAll(".hdr__nav a")].find(
          (l) => l.getAttribute("href") === from
        );
        if (!back) break;
        click(back);
        await waitFor("return", () => currentRoute() === from);
        if (currentRoute() !== from) break;
      }
    }
  });
}

/* ------------------------------------------------------------------ */
/* 6. Carousel controls must never navigate                            */
/*                                                                     */
/* A carousel arrow that is an anchor, or that sits inside one, is the  */
/* bug that sends a visitor to another page instead of moving the      */
/* cards. These assert the structure and the behaviour, on every rail   */
/* on every route, so it cannot come back unnoticed.                    */
/* ------------------------------------------------------------------ */
const CAROUSEL_ROUTES = ["/", "/applications"];

for (const path of CAROUSEL_ROUTES) {
  await withPage(path, async (host) => {
    const rails = [...host.querySelectorAll(".carousel")];
    if (!rails.length) return;

    // Structure: every control is a real button, and none of them is inside
    // a link. A <button> has no href and no router target, so there is no
    // route for it to change.
    const controls = rails.flatMap((rail) => [...rail.querySelectorAll(".carousel__btns button")]);
    check(
      `${path}: carousel arrows are buttons, not links`,
      controls.length > 0 && controls.every((b) => b.tagName === "BUTTON" && b.type === "button" && !b.hasAttribute("href")),
      `controls=${controls.length}`
    );
    check(
      `${path}: no carousel control is nested inside a link`,
      controls.every((b) => !b.closest("a")),
      "an arrow inside an <a> navigates no matter what its onClick does"
    );

    // A carousel click must not change the page it is on.
    const heading = host.querySelector("h1")?.textContent || "";
    const linkCount = host.querySelectorAll("a").length;
    const firstNext = nextArrow(rails[0]) || rails[0].querySelector(".carousel__btns button");
    if (firstNext) click(firstNext);
    await wait(120);
    check(
      `${path}: a carousel click does not change the page`,
      (host.querySelector("h1")?.textContent || "") === heading && host.querySelectorAll("a").length === linkCount,
      "the route and its links must be identical after a carousel click"
    );

    await exerciseRails(host, path, rails);
  });
}

/* ------------------------------------------------------------------ */
/* 5d. Source-level scan for routing and layering anti-patterns         */
/*                                                                     */
/* Some of these cannot be seen in the DOM: a router <Link> renders a  */
/* plain <a href>, so the only way to catch a hand-written anchor that */
/* bypasses the router is to read the source. Same for `navigate()` on  */
/* a carousel control, and for a stray `overflow-x: hidden` that hides */
/* an overflow bug instead of fixing it.                                */
/* ------------------------------------------------------------------ */
const sourceFiles = [];
async function collectSources(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await collectSources(full);
    else if (/\.jsx?$/.test(entry.name)) sourceFiles.push(full);
  }
}
await collectSources(join(root, "src"));

const rel = (f) => f.slice(root.length + 1).replace(/\\/g, "/");
const readAll = async () => {
  const out = [];
  for (const file of sourceFiles) {
    out.push({ file, text: await readFile(file, "utf8") });
  }
  return out;
};
const sources = await readAll();

// Every in-app link must point at a route that actually exists, otherwise a
// CTA lands on the 404 page.
const deadLinks = sources.flatMap(({ file, text }) =>
  [...text.matchAll(/\bto="(\/[^"]*)"/g)]
    .map((m) => ({ file, to: m[1] }))
    .filter(({ to }) => {
      const [path] = to.split("#");
      return path !== "/" && !NAV_ROUTES.includes(path);
    })
    .map(({ file, to }) => `${rel(file)}: to="${to}"`)
);
check(
  "source: every to=\"...\" points at a real route",
  deadLinks.length === 0,
  deadLinks.join(" | ") || `all links resolve to one of ${NAV_ROUTES.length} routes`
);

// A router <Link> renders a plain <a href>, so the only way to catch a
// hand-written anchor to another page is to read the source. A pure `#hash`
// anchor is a legitimate in-page target (the skip link) and is left alone.
const rawAnchors = sources.flatMap(({ file, text }) =>
  [...text.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])([^"']*)\1/g)]
    .filter((m) => m[2].startsWith("/"))
    .map((m) => `${rel(file)}: <a href="${m[2]}">`)
);
check(
  "source: no hand-written <a href=\"/?\"> links to other pages",
  rawAnchors.length === 0,
  rawAnchors.join(" | ") || "use <Link to> so navigation stays client-side"
);

// Carousel/hero controls must never reach for the router.
check(
  "source: no navigate() or window.location beside a carousel arrow",
  !/(ChevronLeft|ChevronRight)[^]{0,400}?(navigate\(|window\.location)/s.test(
    sources.map((s) => s.text).join("\n")
  ),
  "an arrow that navigates is the bug this suite exists to prevent"
);

// A document-level assignment would defeat client-side routing everywhere.
const hardNav = sources.flatMap(({ file, text }) =>
  [...text.matchAll(/window\.location\.(href|assign|replace)\s*=/g)].map((m) => `${rel(file)}: ${m[0]}`)
);
check(
  "source: no window.location assignments",
  hardNav.length === 0,
  hardNav.join(" | ") || "a hard navigation discards the SPA and reloads the document"
);

console.error = realError;
console.warn = realWarn;

const failedChecks = checks.filter((c) => !c.ok);
for (const c of checks) {
  console.log(
    `  ${c.ok ? "ok   " : "FAIL "} ${c.name}${c.detail ? `  (${c.detail})` : ""}`
  );
}
console.log(
  `  ${checks.length - failedChecks.length}/${checks.length} interaction checks passed`
);

failures += failedChecks.length;

await rm(dir, { recursive: true, force: true });

if (failures) {
  console.log(`\n  ${failures} check(s) failed.\n`);
  process.exit(1);
}
console.log(`\n  all ${ROUTES.length} routes rendered cleanly and all interactions behaved.\n`);
