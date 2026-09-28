/**
 * Post-build verification.
 *
 * Checks the generated `dist/` output for the things that break silently:
 * missing image/font files, absolute paths that will not resolve on a static
 * host, and oversized payloads.
 *
 * Run with:  node scripts/verify-build.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const src = join(root, "src");

const errors = [];
const warnings = [];
const notes = [];

/* ------------------------------------------------------------------ */
/* 1. dist exists                                                      */
/* ------------------------------------------------------------------ */
if (!existsSync(dist)) {
  console.error("FAIL  dist/ not found — run `npm run build` first.");
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* 2. Every /assets path referenced in the build must exist in dist      */
/* ------------------------------------------------------------------ */
const referenced = new Set();

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const distFiles = await walk(dist);
const textFiles = distFiles.filter((f) => /\.(html|js|css|json|txt|xml|webmanifest)$/.test(f));

for (const file of textFiles) {
  const content = await readFile(file, "utf8");
  // Absolute public paths in built output.
  for (const m of content.matchAll(/["'(](\/assets\/[^"')\s]+)["')]/g)) {
    referenced.add(m[1]);
  }
  // Relative asset references produced by the bundler.
  for (const m of content.matchAll(/["'(](\.{1,2}\/assets\/[^"')\s]+)["')]/g)) {
    referenced.add(m[1]);
  }
}

for (const ref of referenced) {
  const clean = ref.split("?")[0];
  const onDisk = join(dist, clean.replace(/^\//, "").replace(/^\.\//, ""));
  if (!existsSync(onDisk)) {
    errors.push(`referenced asset not in dist: ${ref}`);
  }
}

/* ------------------------------------------------------------------ */
/* 3. Source image paths must exist in public/                          */
/* ------------------------------------------------------------------ */
const imageModule = await readFile(join(src, "data", "images.js"), "utf8");

// Read the manifest through the module itself rather than regexing it again, so
// the audit and the app can never disagree about what is published.
const manifestFile = join(src, "data", "images.generated.js");
if (!existsSync(manifestFile)) {
  errors.push("src/data/images.generated.js is missing — run `npm run images`");
}
const { generatedImages } = existsSync(manifestFile)
  ? await import(`file://${manifestFile.replace(/\\/g, "/")}`)
  : { generatedImages: {} };
const lookup = { generated: generatedImages };

// Every declared photo must have a master, and every published variant must
// exist. The masters live outside public/ so they are never uploaded.
const withPhotoNames = [...imageModule.matchAll(/withPhoto\(\s*"([^"]+)"/g)].map((m) => m[1]);

for (const name of withPhotoNames) {
  if (!existsSync(join(root, "assets", "photos", `${name}.jpg`))) {
    errors.push(`images.js has no source master for: ${name}.jpg`);
  }
  if (!lookup.generated[name]) {
    errors.push(`images.generated.js is missing variants for: ${name}.jpg`);
  }
}

for (const [name, entry] of Object.entries(lookup.generated)) {
  for (const url of [entry.src, ...entry.srcSet.split(", ").map((s) => s.split(" ")[0])]) {
    if (!existsSync(join(root, "public", url.replace(/^\//, "")))) {
      errors.push(`images.generated.js points at a missing published file: ${url}`);
    }
  }
  if (!existsSync(join(root, "assets", "photos", `${name}.jpg`))) {
    errors.push(`images.generated.js has variants with no source master: ${name}.jpg`);
  }
}

for (const m of imageModule.matchAll(/`\/assets\/[^`]+\.(?:jpg|png)`/g)) {
  const raw = m[0].replace(/`/g, "");
  if (!existsSync(join(root, "public", raw.replace(/^\//, "")))) {
    errors.push(`images.js references a missing file: ${raw}`);
  }
}

// The unpublished masters must not have leaked into the build output.
for (const file of distFiles) {
  if (/\/photos\/[^/]+\.jpg$/.test(file.replace(/\\/g, "/")) && !file.includes(`${sep}gen${sep}`)) {
    errors.push(`un-resized master published to dist: ${file.slice(dist.length + 1)}`);
  }
}

/* ------------------------------------------------------------------ */
/* 4. Fonts referenced by CSS must be present                           */
/* ------------------------------------------------------------------ */
const cssFiles = distFiles.filter((f) => f.endsWith(".css"));
for (const file of cssFiles) {
  const content = await readFile(file, "utf8");
  for (const m of content.matchAll(/url\(["']?(\/[^)"']+\.woff2)["']?\)/g)) {
    const onDisk = join(dist, m[1].replace(/^\//, ""));
    if (!existsSync(onDisk)) errors.push(`CSS references a missing font: ${m[1]}`);
  }
}

/* ------------------------------------------------------------------ */
/* 5. No absolute paths left behind in built HTML that would 404        */
/* ------------------------------------------------------------------ */
for (const file of distFiles.filter((f) => f.endsWith(".html"))) {
  const content = await readFile(file, "utf8");
  for (const m of content.matchAll(/(?:href|src)="(\/(?!\/)[^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith("/assets/") || url.startsWith("/src/")) continue;
    warnings.push(`absolute URL in HTML that will 404 on a static host: ${url}`);
  }
}

/* ------------------------------------------------------------------ */
/* 6. Payload report                                                   */
/* ------------------------------------------------------------------ */
const KB = 1024;
let total = 0;
const biggest = [];

for (const file of distFiles) {
  const s = await stat(file);
  total += s.size;
  biggest.push({ file: file.slice(dist.length + 1), size: s.size });
}
biggest.sort((a, b) => b.size - a.size);

/* ------------------------------------------------------------------ */
/* 7. Basic accessibility / SEO sanity on the built HTML               */
/* ------------------------------------------------------------------ */
const html = await readFile(join(dist, "index.html"), "utf8");
const checks = [
  ['<html lang="en">', "html has a lang attribute"],
  ['name="description"', "meta description present"],
  ['rel="canonical"', "canonical link present"],
  ["application/ld+json", "structured data present"],
  ['property="og:title"', "Open Graph title present"],
  ["<noscript>", "noscript fallback present"],
];
for (const [needle, label] of checks) {
  if (!html.includes(needle)) errors.push(`index.html: ${label} is missing`);
}

/* ------------------------------------------------------------------ */
/* 8. Source-level rules that must not regress                          */
/* ------------------------------------------------------------------ */
const srcFiles = (await walk(src)).filter((f) => /\.(jsx?|css)$/.test(f));
const readSrc = async (rel) => readFile(join(src, rel), "utf8");

// No placeholder or unfinished copy.
for (const file of srcFiles) {
  const content = await readFile(file, "utf8");
  if (/lorem ipsum|TODO|FIXME|XXX/i.test(content)) {
    errors.push(`placeholder text in ${file.slice(root.length + 1)}`);
  }
}

// Accessibility patterns that were deliberately moved away from.
const banned = [
  ['role="tablist"', 'use role="group" — these are filters, not tab panels'],
  ['role="tab"', 'use aria-pressed toggle buttons instead'],
  ["inert: \"\"", "React 18 expects an object; set the attribute in an effect"],
  ["inert: ''", "React 18 expects an object; set the attribute in an effect"],
];
for (const file of srcFiles) {
  const content = await readFile(file, "utf8");
  for (const [needle, why] of banned) {
    if (content.includes(needle)) {
      errors.push(`${file.slice(root.length + 1)} uses ${needle} — ${why}`);
    }
  }
}

// Internal navigation must go through the router, not a full page load.
for (const file of srcFiles.filter((f) => f.endsWith(".jsx"))) {
  const content = await readFile(file, "utf8");
  for (const m of content.matchAll(/<a\s[^>]*href=\{?"(\/[^"]*)"?/g)) {
    errors.push(
      `${file.slice(root.length + 1)}: plain <a href="${m[1]}"> forces a full page load — use <Link to="${m[1]}">`
    );
  }
}

// Verified contact details, and nothing else, in the site data.
const siteSrc = await readSrc("data/site.js");
for (const [label, needle] of [
  ["primary phone", "90809 80339"],
  ["secondary phone", "95853 75343"],
  ["email", "tvhydrotechirrigations@gmail.com"],
  ["PIN code", "639114"],
]) {
  if (!siteSrc.includes(needle)) errors.push(`site.js is missing the ${label} (${needle})`);
}
// A map pin at unverified coordinates would point visitors at the wrong plot.
// Check the actual URL, not the comment that explains why the marker is absent.
const mapEmbed = siteSrc.match(/mapEmbed:\s*\n?\s*"([^"]+)"/);
if (!mapEmbed) {
  errors.push("site.js: address.mapEmbed is missing");
} else if (/marker=/.test(mapEmbed[1])) {
  errors.push("site.js: map embed sets a marker — the premises coordinates are not verified");
}
// Copy that would be an invented claim.
for (const claim of [
  /GST/i,
  /\b\d+\+?\s*years of experience/i,
  /\b\d{2,}\+?\s*(?:projects|installations|customers)\s*(?:completed|delivered)/i,
]) {
  if (claim.test(siteSrc)) errors.push(`site.js contains an unverified claim: ${claim}`);
}

// Reveal animations must never be able to hide content without JavaScript.
const baseCss = await readSrc("styles/base.css");
const hideRules = baseCss.match(/^\.reveal[^{]*\{[^}]*opacity:\s*0/gm) || [];
for (const rule of hideRules) {
  errors.push(`base.css hides content outside .js scope: ${rule.trim()}`);
}
if (!/\.js \.reveal\.is-armed/.test(baseCss)) {
  errors.push("base.css: reveal hiding rules are not scoped to .js .is-armed");
}

// Comments are stripped before the CSS rules below are scanned, so a report
// names the selector that is actually wrong rather than the comment above it.
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const cssSources = new Map();
for (const file of srcFiles.filter((f) => f.endsWith(".css"))) {
  cssSources.set(file, stripCssComments(await readFile(file, "utf8")));
}

// `overflow-x: hidden` on the page element clips overflow instead of fixing
// it, and it makes a real overflow bug invisible while testing. Nothing in this
// layout overflows, so it must not be used as a blanket.
for (const [file, content] of cssSources) {
  for (const m of content.matchAll(/(^|[};])\s*(html|body)\s*(,[^{]*)?\{([^}]*)\}/g)) {
    if (/overflow-x\s*:\s*hidden/.test(m[4])) {
      errors.push(
        `${file.slice(root.length + 1)}: ${m[2].trim()} uses overflow-x: hidden — fix the element that overflows instead of clipping it`
      );
    }
  }
}

// A full-bleed decorative layer is a hit target unless it is told otherwise,
// and that is how an overlay ends up swallowing a click meant for the button
// underneath it. Every absolute ::after/::before stretched over its parent
// must opt out of hit testing.
for (const [file, content] of cssSources) {
  for (const m of content.matchAll(/([^{}]+)::(after|before)\s*\{([^}]*)\}/g)) {
    const body = m[3];
    if (!/position\s*:\s*absolute/.test(body)) continue;
    if (!/inset\s*:\s*0/.test(body) && !/inset\s*:\s*0\s+0/.test(body)) continue;
    if (/pointer-events\s*:\s*none/.test(body)) continue;
    errors.push(
      `${file.slice(root.length + 1)}: ${m[1].trim()}::${m[2]} is a full-bleed overlay without pointer-events: none`
    );
  }
}

// A component hidden with the `hidden` attribute is only hidden while the
// author stylesheet has no competing `display`. Without `[hidden] {
// display: none !important }` a rule like `.mnav { display: flex }` wins over
// the user agent sheet, leaving an invisible panel covering the page and eating
// every click behind it. This is invisible to a DOM test, so it is asserted
// here against the built CSS.
const builtCss = await Promise.all(
  distFiles.filter((f) => f.endsWith(".css")).map((f) => readFile(f, "utf8"))
);
const hasHiddenGuard = builtCss.some((css) =>
  /\[hidden\]\s*\{[^}]*display\s*:\s*none\s*!important/.test(css)
);
if (!hasHiddenGuard) {
  errors.push(
    "built CSS has no `[hidden] { display: none !important }` rule — the `hidden` attribute is overridden by any author `display`, which leaves hidden full-screen panels covering the page"
  );
}

// Any rule that closes a fixed, full-viewport element must take it out of the
// layout or out of hit testing. `opacity: 0` alone leaves a full-screen panel
// covering the page, which is invisible to a DOM test and eats every click
// aimed at the header underneath.
for (const [file, content] of cssSources) {
  for (const m of content.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selector = m[1].trim();
    const body = m[2];
    if (!/position\s*:\s*fixed/.test(body)) continue;
    if (!/inset\s*:\s*0\b/.test(body) && !/top\s*:\s*0/.test(body)) continue;
    if (!/opacity\s*:\s*0\b/.test(body)) continue;
    const inert =
      /pointer-events\s*:\s*none/.test(body) ||
      /visibility\s*:\s*hidden/.test(body) ||
      /display\s*:\s*none/.test(body);
    if (inert) continue;
    errors.push(
      `${file.slice(root.length + 1)}: ${selector} is a fixed full-viewport overlay closed only by opacity — add pointer-events: none, visibility: hidden or display: none, or it covers the page and swallows clicks`
    );
  }
}

// The header logo and the favicon are both generated from logo-mark.png. If
// that mark is missing, or the square favicons were never generated, the tab
// shows a broken image and the header has no logo at all.
const brandDir = join(root, "public", "assets", "brand");
for (const file of [
  "logo-mark.png",
  "logo-dark.png",
  "logo-light.png",
  "favicon-512.png",
  "favicon-192.png",
  "favicon-32.png",
  "apple-touch-icon.png",
]) {
  if (!existsSync(join(brandDir, file))) {
    errors.push(`public/assets/brand/${file} is missing — run \`npm run images\``);
  }
}

// A favicon must be square. A non-square PNG is letterboxed by the browser and
// the symbol shrinks to a sliver in the tab.
for (const file of ["favicon-512.png", "favicon-192.png", "favicon-32.png", "apple-touch-icon.png"]) {
  const onDisk = join(brandDir, file);
  if (!existsSync(onDisk)) continue;
  const meta = await sharp(onDisk).metadata();
  if (meta.width !== meta.height) {
    errors.push(
      `public/assets/brand/${file} is ${meta.width}x${meta.height}, not square — a favicon must be square or the browser letterboxes it`
    );
  }
}

// The built HTML must actually reference a favicon, or the tab falls back to
// the browser's default globe even though the asset is on disk.
const builtHtml = distFiles.filter((f) => f.endsWith(".html"));
let faviconLinks = 0;
for (const file of builtHtml) {
  faviconLinks += [...(await readFile(file, "utf8")).matchAll(/<link[^>]+rel="(?:icon|apple-touch-icon|mask-icon)"/g)].length;
}
if (!faviconLinks) errors.push("no <link rel=\"icon\"> in the built HTML — the tab will show a default globe");

// The favicon must stay the symbol alone on a transparent tile. Two ways it
// silently regresses: someone points the <link> back at the full lockup, or a
// background gets flattened in. Both are checked against the built output.
const faviconHrefs = new Set();
for (const file of builtHtml) {
  const html = await readFile(file, "utf8");
  for (const m of html.matchAll(/<link[^>]+rel="icon"[^>]*href="([^"]+)"/g)) faviconHrefs.add(m[1]);
  for (const m of html.matchAll(/<link[^>]+href="([^"]+)"[^>]*rel="icon"/g)) faviconHrefs.add(m[1]);
}
for (const href of faviconHrefs) {
  if (/logo-(dark|light)\.png|logo\.png/.test(href)) {
    errors.push(
      `favicon points at ${href}, which is the full logo lockup — the wordmark is illegible below 32px, use the generated favicon-*.png`
    );
  }
  if (!existsSync(join(dist, href.replace(/^\//, "")))) {
    errors.push(`favicon ${href} is referenced but missing from dist/`);
  }
}

// Every tab icon must have a transparent corner; an opaque one is a white box.
for (const file of ["favicon-512.png", "favicon-192.png", "favicon-32.png"]) {
  const onDisk = join(brandDir, file);
  if (!existsSync(onDisk)) continue;
  const probe = await sharp(onDisk)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cornerAlpha = probe.data[3];
  if (cornerAlpha > 8) {
    errors.push(
      `public/assets/brand/${file} has an opaque corner (alpha ${cornerAlpha}) — a tab icon must be transparent, not a filled rectangle`
    );
  }
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */
const pad = (s) => String(s).padEnd(52, " ");

console.log("\nHydroTech build verification\n");
console.log("  files:      ", distFiles.length);
console.log("  total size: ", (total / KB / KB).toFixed(2), "MB");
console.log("  js (gz est):", (biggest.filter((b) => b.file.endsWith(".js")).reduce((a, b) => a + b.size, 0) / KB).toFixed(1), "KB raw");
console.log("  css:        ", (biggest.filter((b) => b.file.endsWith(".css")).reduce((a, b) => a + b.size, 0) / KB).toFixed(1), "KB raw");
console.log("\n  largest files:");
for (const b of biggest.slice(0, 8)) {
  console.log(`    ${pad(b.file)} ${(b.size / KB).toFixed(0).padStart(6)} KB`);
}

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`    WARN  ${w}`));
}
if (errors.length) {
  console.log(`\n  ${errors.length} error(s):`);
  errors.forEach((e) => console.log(`    FAIL  ${e}`));
  process.exit(1);
}

notes.push(`\nOK  ${referenced.size} asset references resolved in dist/`);
notes.forEach((n) => console.log(n));
if (!warnings.length) console.log("OK  no warnings");
console.log("\nBuild verification passed.\n");
