/**
 * Verified company details.
 *
 * Every value in this file comes from HydroTech's own documents and confirmed
 * contact details. Nothing here is invented. If a fact is not available, it is
 * left out rather than guessed.
 */

export const company = {
  name: "HydroTech Irrigation",
  shortName: "HydroTech",
  legalNote: "Irrigation systems, products and support for agriculture and landscaping.",
  tagline: "Grow more. Save water.",
  region: "Karur, Tamil Nadu, India",
  // Kept deliberately broad. Narrow this only once HydroTech confirms the
  // districts it actually travels to.
  serviceArea: "Tamil Nadu",
};

/** E.164 values — the links use these, the display text stays human readable. */
export const phoneNumbers = [
  { display: "90809 80339", tel: "+919080980339", label: "Phone" },
  { display: "95853 75343", tel: "+919585375343", label: "Phone" },
];

export const email = {
  address: "tvhydrotechirrigations@gmail.com",
  mailto: "mailto:tvhydrotechirrigations@gmail.com",
};

export const address = {
  line1: "No.18, P Vellalapatti, Puliyur",
  line2: "Karur",
  region: "Tamil Nadu",
  pin: "639114",
  pincode: "639114",
  country: "India",
  get full() {
    return `${this.line1}, ${this.line2}, ${this.region} — ${this.pin}.`;
  },
  get singleLine() {
    return `${this.line1}, ${this.line2}, ${this.region} ${this.pin}`;
  },
  /**
   * OpenStreetMap search — no API key needed, no fabricated coordinates.
   */
  mapQuery: encodeURIComponent("P Vellalapatti, Puliyur, Karur, Tamil Nadu 639114, India"),
  /**
   * Embedded map centred on the Karur area.
   *
   * The bounding box is a coarse area view, NOT a pin at the premises. No
   * `marker=` parameter is set on purpose: the exact lat/long of
   * P Vellalapatti is not in the records this site was built from, and dropping
   * a marker at a guessed coordinate would put it on the wrong plot. Visitors
   * who need directions use `mapLink`, which runs a live OpenStreetMap search
   * for the written address.
   *
   * To show the actual premises, replace the bbox with a tight one and add
   * `&marker=<lat>%2C<lon>` using verified coordinates.
   */
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=77.98%2C10.88%2C78.16%2C11.04&layer=mapnik",
  mapLink: `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    "P Vellalapatti, Puliyur, Karur, Tamil Nadu 639114, India"
  )}`,
  mapNote:
    "Map shows the Karur area. The map is approximate — use the search link below for turn-by-turn directions.",
};

/** Primary call to action used across the site. */
export const primaryCta = {
  label: "Get Irrigation Advice",
  to: "/contact",
};

/**
 * Shown wherever a project detail, statistic or testimonial would otherwise
 * require information HydroTech has not published. Keeping this in one place
 * makes it obvious in review that the gap is intentional.
 */
export const demoNotice = {
  projects:
    "Project showcase coming soon. The images below are demonstration photography and not photographs of HydroTech installations.",
  products:
    "Product photography is being prepared. Images below are demonstration photography; product names describe categories, not specific models.",
  applications:
    "Images are demonstration photography. Application notes describe typical irrigation needs, not HydroTech case studies.",
};
