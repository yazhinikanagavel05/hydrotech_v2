/**
 * Centralised image configuration.
 *
 * Every photograph used anywhere on the site is declared here so the whole
 * visual library can be swapped for HydroTech's own photography in one place.
 *
 * HOW THE IMAGE PIPELINE WORKS
 * 1. Put the full-size masters in `assets/photos/` (outside `public/`, so the
 *    originals are never uploaded).
 * 2. `npm run images` resizes them into `public/assets/photos/gen/`, one file per
 *    width, and regenerates `images.generated.js`.
 * 3. Every `vite` and `vite build` runs step 2 automatically (from the
 *    `responsiveImages` plugin in `vite.config.js`), so the published variants
 *    can never fall out of sync with the manifest — and the build does not
 *    depend on the host choosing a particular npm script.
 *
 * HOW TO REPLACE WITH REAL HYDROTECH PHOTOGRAPHY
 * 1. Add the new masters to `assets/photos/` and remove the demo ones.
 * 2. Point the matching `withPhoto()` name at the new file.
 * 3. Remove the `demo: true` flag for that entry so the "demo imagery" notice
 *    stops appearing in the UI for that slot.
 *
 * Current imagery is licensed demonstration photography (see
 * `public/assets/photos/CREDITS.md`) and is clearly flagged as such on the
 * Projects and Products pages. It is NOT photography of HydroTech installations.
 */

import { asset } from "../lib/asset.js";
import { photo } from "./images.generated.js";

/** Published variant directory. Never points at the un-resized masters. */
const PHOTO = "/assets/photos/gen/";

/**
 * Shown when an image fails to load — reuses a real photograph so a broken path
 * degrades into a branded still rather than a broken-image icon.
 */
export const IMAGE_FALLBACK = {
  src: asset(photo("about-main").src),
  alt: "HydroTech Irrigation — placeholder image while photography loads",
};

/**
 * Builds an image descriptor from the generated variants.
 *
 * `src` is the widest variant and `srcSet` lets the browser pick a smaller file
 * for phones, so a card on a 390px screen does not download a 1800px photo.
 * `lqip` is a ~20px blurred copy inlined as the loading background.
 */
const withPhoto = (file, alt, { demo = false, focal = "50% 50%" } = {}) => {
  const gen = photo(file);
  return {
    src: asset(gen.src),
    // Re-prefix every candidate so the srcset works under any configured base.
    srcSet: gen.srcSet
      .split(", ")
      .map((entry) => {
        const [url, width] = entry.split(" ");
        return `${asset(url)} ${width}`;
      })
      .join(", "),
    lqip: gen.lqip,
    width: gen.width,
    height: gen.height,
    alt,
    demo,
    focal,
  };
};

export const images = {
  /* --- brand -------------------------------------------------- */
  brand: {
    logoDark: asset("/assets/brand/logo-dark.png"),
    logoLight: asset("/assets/brand/logo-light.png"),
    mark: asset("/assets/brand/logo-mark.png"),
  },

  /* --- home hero ---------------------------------------------- */
  hero: [
    withPhoto(
      "hero-drip",
      "Drip irrigation lines carrying water to the root zone of a farm field in India",
      { focal: "50% 58%" }
    ),
    withPhoto(
      "hero-sprinkler",
      "Sprinkler irrigation watering a newly planted field in the Nilgiris, Tamil Nadu",
      { focal: "50% 55%" }
    ),
    withPhoto(
      "hero-automation",
      "Polyhouse cultivation under a managed irrigation system in Himachal Pradesh",
      { focal: "50% 50%" }
    ),
  ],

  /* --- home / shared editorial -------------------------------- */
  intro: withPhoto(
    "intro-land",
    "Farmer working across a field with a tractor, preparing land for the season"
  ),
  aboutMain: withPhoto("about-main", "Cultivated farm land in India, seen from above the field edge"),
  aboutFields: withPhoto("about-fields", "Green agricultural landscape near Pondicherry, Tamil Nadu"),
  aboutCauvery: withPhoto("about-cauvery", "Irrigated green landscape at Mettur, Tamil Nadu"),
  aboutFamily: withPhoto("about-family", "Family working together on a small farm"),
  aboutKarur: withPhoto(
    "about-karur",
    "Flame-of-the-forest tree in full flower in Karur, Tamil Nadu"
  ),

  /* --- solutions ---------------------------------------------- */
  solutions: {
    drip: withPhoto("sol-drip", "Drip irrigation line running along a row of plants"),
    sprinkler: withPhoto(
      "sol-sprinkler",
      "Sprinkler irrigation covering a field of crops in Raichur, Karnataka",
      { focal: "50% 55%" }
    ),
    automation: withPhoto(
      "sol-automation",
      "Managed polyhouse cultivation prepared for scheduled irrigation"
    ),
  },

  /* --- broader service areas ---------------------------------- */
  services: {
    nursery: withPhoto("svc-nursery", "Rows of flowering plants ready at a plant nursery"),
    plantation: withPhoto("svc-plantation", "Coconut plantation in Kerala, South India"),
    landscaping: withPhoto("svc-landscape", "Established garden planted with a mix of trees and shrubs"),
    landscapeEstate: withPhoto(
      "svc-landscape2",
      "Formal garden landscape with maintained planting beds"
    ),
    equipment: withPhoto(
      "svc-equipment",
      "Irrigation pipes running across a cotton field with a borewell pump, India"
    ),
    water: withPhoto("svc-water", "Groundwater tubewell used to irrigate a field in Gujarat"),
  },

  /* --- products ----------------------------------------------- */
  products: {
    emitters: withPhoto("prod-drip-emitter", "Drip irrigation emitter releasing water onto the growing medium"),
    dripLine: withPhoto("prod-drip-line", "Drip irrigation tape laid out ready for field installation"),
    dripper: withPhoto("prod-accessory", "Close view of a drip irrigation dripper at work"),
    sprinkler: withPhoto("prod-sprinkler", "Sprinkler head fitted to an irrigation line in a field"),
    sprinklerLawn: withPhoto("prod-sprinkler-lawn", "Sprinkler watering an open landscaped area"),
    control: withPhoto("prod-control", "Field irrigation in operation, water being delivered to a crop row"),
    filtration: withPhoto(
      "prod-filter",
      "Slow sand filter basin used to clean water before it enters an irrigation system"
    ),
    pipes: withPhoto(
      "prod-pipes",
      "Irrigation pipework laid across a field, connected to a borewell pump",
      { demo: true }
    ),
  },

  /* --- applications ------------------------------------------- */
  applications: {
    fieldCrops: withPhoto("app-field", "Paddy fields in Cuddalore district, Tamil Nadu"),
    vegetables: withPhoto("app-vegetable", "Creeper vegetable cultivation on raised beds"),
    fruit: withPhoto("app-fruit", "Mango orchard in Poovankurichi, Tamil Nadu"),
    banana: withPhoto("app-fruit2", "Banana plantation with evenly spaced rows"),
    plantation: withPhoto("app-plantation", "Coconut trees planted across a South Indian estate"),
    nursery: withPhoto("app-nursery", "Plant nursery with young saplings arranged for dispatch"),
    greenhouse: withPhoto("app-greenhouse", "Polyhouse structure used for protected cultivation"),
    garden: withPhoto("app-garden", "Maintained green lawn and planting in a garden"),
    landscape: withPhoto("app-landscape", "Rural landscape near Tirunelveli, Tamil Nadu"),
  },

  /* --- project showcase (DEMO — replace with HydroTech photos) --- */
  projects: {
    a: withPhoto("proj-field-pipes", "Irrigation pipes running through a cultivated field in the Nilgiris", { demo: true }),
    b: withPhoto("proj-vineyard", "Vineyard laid out in rows at Cumbum, Tamil Nadu", { demo: true }),
    c: withPhoto("proj-seedlings", "Irrigated seedling beds being raised in Kerala", { demo: true }),
    d: withPhoto("proj-tubewell", "Tubewell irrigation supporting horticulture in Gujarat", { demo: true }),
    e: withPhoto("proj-spraying", "Sprinklers watering a field, water reaching across the crop", { demo: true }),
    f: withPhoto("proj-peanut", "Groundnut field receiving irrigation in India", { demo: true }),
  },

  /* --- contact ------------------------------------------------ */
  contact: {
    field: withPhoto("contact-field", "Green agricultural land around Karur, Tamil Nadu"),
    region: withPhoto(
      "contact-karur",
      "Palm-lined agricultural landscape in the Tamil Nadu delta",
      { focal: "50% 50%" }
    ),
  },
};

/**
 * Flat list of every image path declared here, used by the build-time audit in
 * `scripts/verify-build.mjs`. Includes the `src` of each descriptor and every
 * candidate in its `srcSet`.
 */
export const allImagePaths = (() => {
  const out = new Set();
  const walk = (v) => {
    if (!v) return;
    if (typeof v === "string") {
      if (/\.(jpg|png)$/.test(v)) out.add(v);
      return;
    }
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      if (typeof v.srcSet === "string") {
        v.srcSet.split(", ").forEach((entry) => out.add(entry.split(" ")[0]));
      }
      Object.values(v).forEach(walk);
    }
  };
  walk(images);
  return [...out];
})();