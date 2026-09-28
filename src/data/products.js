import { images } from "./images.js";

/**
 * Product categories.
 *
 * These are CATEGORIES, not specific models. HydroTech's product literature has
 * not been supplied, so no model numbers, flow rates, thread sizes, prices or
 * certifications are listed. Add those in `specs` only when a real datasheet is
 * available — the product card renders them automatically.
 *
 * `demo: true` marks a slot whose photography is still a stand-in.
 */

export const productCategories = [
  { id: "all", label: "All" },
  { id: "drip", label: "Drip" },
  { id: "sprinkler", label: "Sprinkler" },
  { id: "control", label: "Control" },
  { id: "filtration", label: "Filtration" },
  { id: "accessories", label: "Accessories" },
];

export const products = [
  {
    id: "drip-emitters",
    name: "Drip Lines & Emitters",
    group: "Drip",
    category: "Water delivery",
    description:
      "Drippers and drip lines that release a measured amount of water beside each plant.",
    image: images.products.emitters,
  },
  {
    id: "drip-tubing",
    name: "Drip Tubing",
    group: "Drip",
    category: "Water delivery",
    description:
      "Thin wall and thick wall drip tubing used to carry water along each crop row.",
    image: images.products.dripLine,
  },
  {
    id: "drip-fittings",
    name: "Drip Fittings",
    group: "Drip",
    category: "Accessories",
    description: "Connectors and fittings used to join drip lines and branch them off the main line.",
    image: images.products.dripper,
  },
  {
    id: "sprinkler-heads",
    name: "Sprinkler Heads",
    group: "Sprinkler",
    category: "Water coverage",
    description: "Heads that throw water over an area, sized for the field, lawn or garden being covered.",
    image: images.products.sprinkler,
  },
  {
    id: "sprinkler-lawn",
    name: "Pop-Up Sprinklers",
    group: "Sprinkler",
    category: "Lawn & landscape",
    description: "Sprinklers set into the ground so lawns and gardens stay tidy while they water.",
    image: images.products.sprinklerLawn,
  },
  {
    id: "valves",
    name: "Valves & Controllers",
    group: "Control",
    category: "System control",
    description: "Valves and controllers that decide which zone runs, for how long, and when.",
    image: images.products.control,
    demo: true,
  },
  {
    id: "filters",
    name: "Filters",
    group: "Filtration",
    category: "System protection",
    description: "Filters that keep sand, algae and particles out of the lines and emitters.",
    image: images.products.filtration,
    demo: true,
  },
  {
    id: "pipes-fittings",
    name: "Pipes & Fittings",
    group: "Accessories",
    category: "System protection",
    description: "Mainline pipe, connectors and clamps that carry water from source to field.",
    image: images.products.pipes,
    demo: true,
  },
];

/** Short categories shown on the home page slider. */
export const productShowcase = products.slice(0, 8);

export const getProductsByGroup = (group) =>
  group === "all" ? products : products.filter((p) => p.group.toLowerCase() === group);
