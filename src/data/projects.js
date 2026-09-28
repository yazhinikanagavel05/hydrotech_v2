import { images } from "./images.js";

/**
 * Project showcase — PLACEHOLDER CONTENT.
 *
 * HydroTech has not supplied project records, so nothing here is presented as a
 * real HydroTech installation. Every entry is flagged `demo: true`, which makes
 * the ProjectCard render a visible "Demo image" tag, and each entry carries a
 * `status` line instead of a client name, acreage, water-saving figure or date.
 *
 * TO GO LIVE: replace the array below with real project records, for example
 *
 *   {
 *     id: "tamilnadu-cotton-farm",
 *     title: "Cotton field irrigation, Karur district",
 *     application: "Field crop",
 *     solution: "Sprinkler irrigation",
 *     location: "Karur, Tamil Nadu",   // only if verified
 *     year: "2025",                     // only if verified
 *     overview: "Short factual description of what was supplied and installed.",
 *     image: { src: "/assets/photos/your-photo.jpg", alt: "…", demo: false },
 *   }
 *
 * `demo: true` is what the UI uses to decide whether to show the demo notice,
 * so leave it off for real projects.
 */

export const projects = [
  {
    id: "demo-sprinkler-field",
    title: "Field irrigation — sprinkler layout",
    application: "Field crop",
    solution: "Sprinkler irrigation",
    overview:
      "A layout example showing how an open field is divided into zones so each part receives an even share of water.",
    image: images.projects.a,
    demo: true,
  },
  {
    id: "demo-vineyard-drip",
    title: "Orchard planting — row irrigation",
    application: "Fruit crop",
    solution: "Drip irrigation",
    overview:
      "A row-by-row planting example for orchards, where water is placed close to each tree instead of across the field.",
    image: images.projects.b,
    demo: true,
  },
  {
    id: "demo-nursery-beds",
    title: "Nursery beds — seedling irrigation",
    application: "Nursery",
    solution: "Micro sprinkler irrigation",
    overview:
      "A nursery-scale example showing how small planting areas are zoned so young plants get frequent, gentle water.",
    image: images.projects.c,
    demo: true,
  },
  {
    id: "demo-horticulture-source",
    title: "Water source and pumping to field",
    application: "Horticulture",
    solution: "Water management",
    overview:
      "An example of the supply side of a system — filtration and pumping that carry water from the source to the crop.",
    image: images.projects.d,
    demo: true,
  },
  {
    id: "demo-sprinkler-coverage",
    title: "Open area coverage",
    application: "Fodder / open field",
    solution: "Sprinkler irrigation",
    overview:
      "A coverage example showing how sprinklers spread water across an area that is not planted in neat rows.",
    image: images.projects.e,
    demo: true,
  },
  {
    id: "demo-groundnut-drip",
    title: "Groundnut field irrigation",
    application: "Field crop",
    solution: "Drip irrigation",
    overview:
      "A field-scale example showing drip lines running between crop rows in a widely spaced crop.",
    image: images.projects.f,
    demo: true,
  },
];

/** Shown instead of the gallery if every entry is later removed. */
export const projectsEmptyState = {
  title: "Project showcase coming soon",
  text: "HydroTech project photography and case notes are being prepared. Please contact us for references relevant to your crop and land.",
};
