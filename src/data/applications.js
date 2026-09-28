import { images } from "./images.js";

/**
 * Where irrigation is used.
 *
 * Descriptions describe the watering need of the application. They are not
 * HydroTech case studies and no customer, location or result is claimed.
 */

export const applications = [
  {
    id: "field-crops",
    title: "Field Crops",
    kicker: "Paddy, cotton, sorghum, millets, groundnut",
    description:
      "Large open fields are usually planned zone by zone. The layout has to match the crop spacing and the shape of the land.",
    points: [
      "Long pipe runs with sprinklers for broad coverage",
      "Drip where crops are planted in regular rows",
      "Zoning so each part of the field gets its share",
    ],
    image: images.applications.fieldCrops,
  },
  {
    id: "vegetables",
    title: "Vegetable Farming",
    kicker: "Tomato, chilli, brinjal, onion, leafy greens",
    description:
      "Vegetable crops change often and need water close to the plant. Drip is usually the most practical approach here.",
    points: [
      "Drip lines laid along each bed or row",
      "Short cycles repeated through the day",
      "Easy to adjust when a new crop is planted",
    ],
    image: images.applications.vegetables,
  },
  {
    id: "fruit-crops",
    title: "Fruit Crops",
    kicker: "Mango, banana, guava, papaya, citrus",
    description:
      "Orchards need steady water across the root zone for years, without disturbing the soil between trees.",
    points: [
      "Ring or line layouts around each tree",
      "Careful pressure so young trees are not damaged",
      "Scheduled watering through dry and wet seasons",
    ],
    image: images.applications.fruit,
  },
  {
    id: "plantations",
    title: "Plantations",
    kicker: "Coconut, banana, areca, rubber",
    description:
      "Large permanent plantings are usually sprinkler or drip zoned across the estate so watering stays manageable.",
    points: [
      "Wide coverage across long, even rows",
      "Separate zones for younger and older plants",
      "Filtration to protect emitters from well water",
    ],
    image: images.applications.plantation,
  },
  {
    id: "nursery",
    title: "Nursery",
    kicker: "Flower, fruit and vegetable saplings",
    description:
      "Nursery plants are small and easily damaged. Water has to be gentle, frequent and even across every tray or bed.",
    points: [
      "Mist or low-pressure micro sprinklers",
      "Many small zones for different batches",
      "Automation so watering continues over weekends",
    ],
    image: images.applications.nursery,
  },
  {
    id: "greenhouse",
    title: "Greenhouse & Polyhouse",
    kicker: "Protected cultivation",
    description:
      "Inside a polyhouse every litre counts, so water is usually delivered directly to the plant and never to the path.",
    points: [
      "Drip lines hung along the growing benches",
      "Scheduling by time of day to limit heat loss",
      "Feeding combined with irrigation where required",
    ],
    image: images.applications.greenhouse,
  },
  {
    id: "gardens",
    title: "Gardens",
    kicker: "Home gardens, kitchen gardens, farmyard planting",
    description:
      "Mixed planting means mixed watering needs, so gardens work best when they are split into separate zones.",
    points: [
      "Drip for beds, borders and pots",
      "Pop-up sprinklers for lawns",
      "Separate zones for thirsty and light-needing plants",
    ],
    image: images.applications.garden,
  },
  {
    id: "landscaping",
    title: "Landscaping",
    kicker: "Hotels, institutions, parks, apartment grounds",
    description:
      "Grounds that have to look presentable every day are usually run on a timer, with the system hidden out of sight.",
    points: [
      "Scheduled zones for lawns, hedges and trees",
      "Pop-up heads that disappear into the lawn",
      "Controller-based operation with minimal daily work",
    ],
    image: images.applications.landscape,
  },
];

/** Options used by the contact form. */
export const applicationOptions = [
  "Field crop (paddy, cotton, sorghum…)",
  "Vegetable farming",
  "Fruit crop / orchard",
  "Plantation (coconut, banana, areca…)",
  "Nursery",
  "Greenhouse / polyhouse",
  "Garden / kitchen garden",
  "Landscaping / institutional grounds",
  "Something else",
];

export const cropOptions = [
  "Paddy",
  "Cotton",
  "Sorghum / millet",
  "Groundnut",
  "Sugarcane",
  "Tomato / chilli / brinjal",
  "Onion / leafy vegetables",
  "Mango",
  "Banana",
  "Coconut / areca",
  "Flower crops",
  "Not decided yet",
];
