import { images } from "./images.js";

/**
 * Primary navigation. Order here is the order shown on desktop and mobile.
 */
export const navItems = [
  { label: "Home", to: "/" },
  { label: "Irrigation", to: "/irrigation" },
  { label: "Products", to: "/products" },
  { label: "Applications", to: "/applications" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** The three irrigation approaches HydroTech works with. */
export const solutions = [
  {
    id: "drip",
    name: "Drip Irrigation",
    kicker: "Water to the root",
    summary: "Water is delivered close to the plant roots, helping reduce water lost between rows.",
    image: images.solutions.drip,
    href: "/irrigation#drip",
    cta: "Explore Drip Irrigation",
    whatItIs:
      "A network of small pipes and drippers that release water gently, right next to each plant.",
    usedFor: [
      "Row crops and vegetable cultivation",
      "Fruit orchards such as mango and banana",
      "Flower beds and high-value horticulture",
      "Greenhouse and polyhouse growing",
    ],
    benefits: [
      "Water reaches the root zone instead of the whole field",
      "Less water is lost to evaporation and surface runoff",
      "Weeds between rows receive far less water",
      "Feeding can be combined with irrigation where a crop requires it",
    ],
  },
  {
    id: "sprinkler",
    name: "Sprinkler Irrigation",
    kicker: "Even coverage",
    summary: "Sprinklers spread water across an area, giving reasonably even coverage over larger spaces.",
    image: images.solutions.sprinkler,
    href: "/irrigation#sprinkler",
    cta: "Explore Sprinkler Irrigation",
    whatItIs:
      "Sprinkler heads mounted on a pipe line throw water into the air so it falls like gentle rain.",
    usedFor: [
      "Field crops such as cotton, sorghum and millets",
      "Fodder and pasture areas",
      "Lawns, gardens and open landscaped areas",
      "Nurseries and seedling areas",
    ],
    benefits: [
      "Covers larger areas with fewer pipe runs",
      "Useful where planting is not in neat, regular rows",
      "Can be zoned so different areas are watered separately",
      "Pop-up heads keep lawns and gardens looking tidy",
    ],
  },
  {
    id: "automation",
    name: "Irrigation Automation",
    kicker: "Less daily work",
    summary: "Timers and controllers start and stop irrigation for you, so watering becomes routine.",
    image: images.solutions.automation,
    href: "/irrigation#automation",
    cta: "Explore Irrigation Automation",
    whatItIs:
      "A controller, valves and a clock that run the system on a schedule you set, instead of a person turning it on.",
    usedFor: [
      "Farms where the farmer cannot be in the field daily",
      "Nurseries and greenhouses with many small zones",
      "Hotels, institutions and apartment landscapes",
      "Any system where a missed watering would cause damage",
    ],
    benefits: [
      "Watering continues even when nobody is on site",
      "Different areas can be watered on separate schedules",
      "Less chance of over-watering or leaving a block dry",
      "Easier to manage a larger total area",
    ],
  },
];

/** Broader agriculture and gardening areas HydroTech supports. */
export const additionalServices = [
  {
    title: "Nursery & Plantation",
    description:
      "Irrigation for nurseries and long-term plantations, where young plants need steady, gentle water while they establish.",
    image: images.services.nursery,
  },
  {
    title: "Landscaping & Gardening",
    description:
      "Planned watering for lawns, gardens, parks and commercial landscapes, including pop-up sprinklers and drip beds.",
    image: images.services.landscaping,
  },
  {
    title: "Irrigation Equipment",
    description:
      "Pipe, fittings and pumping equipment that connects the water source to the field and carries it to the crop.",
    image: images.services.equipment,
  },
  {
    title: "Water Management",
    description:
      "Filtration, valves and flow control that keep water clean and pressure steady so the system keeps working well.",
    image: images.services.water,
  },
];

/** The four steps shown on the home page. */
export const gettingStarted = [
  {
    step: "01",
    title: "Tell us your crop",
    text: "What you are growing, and what stage it is at. The crop decides how the water should arrive.",
  },
  {
    step: "02",
    title: "Tell us about your land",
    text: "How big the area is, whether it is flat or sloped, and how you are planting.",
  },
  {
    step: "03",
    title: "Tell us about your water",
    text: "Where the water comes from, how much is available and what pressure you have.",
  },
  {
    step: "04",
    title: "Get irrigation guidance",
    text: "We suggest an approach and a product mix that suits your land, then help you install it.",
  },
];

/** The six things good irrigation planning considers. */
export const planningFactors = [
  { title: "Crop", text: "Root depth, spacing and how often the plant actually needs water." },
  { title: "Soil", text: "How quickly the soil takes in water and how much it holds before it drains." },
  { title: "Land", text: "Area, shape and slope — these decide how the system is laid out." },
  { title: "Water availability", text: "Borewell, canal, tank or municipal supply, and how much is dependable." },
  { title: "Coverage", text: "Every corner reached, without overlapping zones that waste water." },
  { title: "Maintenance", text: "Filters to clean, lines to check, and a system you can live with daily." },
];

/** What HydroTech focuses on, shown on the About page. */
export const focusAreas = [
  {
    title: "Practical solutions",
    text: "Systems chosen for what farmers and land owners actually work with day to day, not for how they read on paper.",
  },
  {
    title: "Water-conscious irrigation",
    text: "Getting the right amount of water to the plant, and not spending it on the space between plants.",
  },
  {
    title: "Understanding the crop",
    text: "The crop, the soil and the season decide the design. Different crops need different watering.",
  },
  {
    title: "Ease of use",
    text: "A system you can run, understand and repair yourself, with controls that are not complicated.",
  },
  {
    title: "Long-term usability",
    text: "Products and layouts that stay serviceable for years instead of needing constant attention.",
  },
  {
    title: "Customer support",
    text: "Straight answers, on-site help when it is needed, and a contact you can actually reach.",
  },
];

/** Working method, shown on the About page. */
export const approach = [
  {
    step: "01",
    title: "Listen to the land",
    text: "We start by understanding the crop, the area and the water source before suggesting anything.",
  },
  {
    step: "02",
    title: "Plan the system",
    text: "Layout, spacing, pipe runs and zones are decided together so the whole area is covered properly.",
  },
  {
    step: "03",
    title: "Install and hand over",
    text: "The system is installed, run and checked with you, and explained in plain language.",
  },
  {
    step: "04",
    title: "Support afterwards",
    text: "Questions about filters, pressure or scheduling are answered by the same people who built it.",
  },
];
