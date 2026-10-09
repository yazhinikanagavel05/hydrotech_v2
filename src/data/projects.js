import { images } from "./images.js";

/**
 * Showcase entries.
 */

export const projects = [
  {
    id: "sprinkler-field",
    title: "Field irrigation — sprinkler layout",
    application: "Field crop",
    solution: "Sprinkler irrigation",
    overview:
      "A layout example showing how an open field is divided into zones so each part receives an even share of water.",
    image: images.projects.a,
  },
  {
    id: "vineyard-drip",
    title: "Orchard planting — row irrigation",
    application: "Fruit crop",
    solution: "Drip irrigation",
    overview:
      "A row-by-row planting example for orchards, where water is placed close to each tree instead of across the field.",
    image: images.projects.b,
  },
  {
    id: "nursery-beds",
    title: "Nursery beds — seedling irrigation",
    application: "Nursery",
    solution: "Micro sprinkler irrigation",
    overview:
      "A nursery-scale example showing how small planting areas are zoned so young plants get frequent, gentle water.",
    image: images.projects.c,
  },
  {
    id: "horticulture-source",
    title: "Water source and pumping to field",
    application: "Horticulture",
    solution: "Water management",
    overview:
      "An example of the supply side of a system — filtration and pumping that carry water from the source to the crop.",
    image: images.projects.d,
  },
  {
    id: "sprinkler-coverage",
    title: "Open area coverage",
    application: "Fodder / open field",
    solution: "Sprinkler irrigation",
    overview:
      "A coverage example showing how sprinklers spread water across an area that is not planted in neat rows.",
    image: images.projects.e,
  },
  {
    id: "groundnut-drip",
    title: "Groundnut field irrigation",
    application: "Field crop",
    solution: "Drip irrigation",
    overview:
      "A field-scale example showing drip lines running between crop rows in a widely spaced crop.",
    image: images.projects.f,
  },
];

/** Shown instead of the gallery if every entry is later removed. */
export const projectsEmptyState = {
  title: "Project showcase coming soon",
  text: "Project case notes are being prepared. Please contact us to discuss a layout suitable for your crop and land.",
};
