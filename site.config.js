// ---------------------------------------------------------------------------
// Built & Unwell — site configuration
// Change values here to rebrand or move hosts. Everything else reads from this.
// ---------------------------------------------------------------------------

// SITE_URL = the live origin (no trailing slash).
// BASE_PATH = the sub-folder the site is served from.
//   - GitHub Pages PROJECT site (default):  origin = https://<user>.github.io , basePath = /<repo>
//   - Custom domain OR user/org Pages site: basePath = "" (empty)
// Both can be overridden at build time with env vars, e.g.:
//   SITE_URL=https://builtandunwell.com BASE_PATH="" npm run build
const SITE_URL = (process.env.SITE_URL || "https://yvetteo-ybo.github.io").replace(/\/$/, "");
const BASE_PATH = process.env.BASE_PATH ?? "/yetunde-reminders";

export default {
  siteUrl: SITE_URL,
  basePath: BASE_PATH,

  // Brand
  name: "The Understory",
  shortName: "Understory",
  // Monogram used in the logo mark and favicon.
  monogram: "U",
  tagline: "An Austin network for people who've built something — and live with chronic illness.",
  // The one-line "what is this" used in meta descriptions and AI answers.
  description:
    "The Understory is a private-feeling network for accomplished founders and operators in Austin, Texas — many of them women out of corporate, consulting, and finance — who build businesses while living with chronic illness. Honest writing, real connection, and zero medical-establishment gatekeeping.",

  // Who this is for — used on the homepage and in structured data.
  audience:
    "Experienced founders and ex-operators in Austin — former top-50 corporate leaders, strategy consultants, and finance professionals, many of them women — who are building businesses while managing chronic illness.",

  // Place focus (every post centers Austin; downtown Austin is the home base).
  city: "Austin",
  region: "Texas",
  regionCode: "TX",
  neighborhood: "Downtown Austin",
  country: "USA",
  geo: { lat: 30.2672, lng: -97.7431 }, // downtown Austin

  // Author / founder (E-E-A-T signals).
  author: {
    name: "Yvette O.",
    role: "Founder",
    bio:
      "Yvette is the founder of Built & Unwell. She built a career across corporate and finance before building businesses of her own — all while living with chronic illness in downtown Austin. She writes from experience, not from a clinic.",
    email: "yvetteo@yolonumbers.com",
  },

  // Social / outbound (fill in as you create them).
  social: {
    // twitter: "https://x.com/...",
    // linkedin: "https://www.linkedin.com/in/...",
    // instagram: "https://instagram.com/...",
  },

  // Monthly community event (downtown Austin). Edit date/place as you lock venues.
  event: {
    name: "The Understory Monthly Gathering",
    cadence: "Monthly, first Wednesday",
    time: "6:00–8:00 PM CT",
    area: "Downtown Austin",
    blurb:
      "A low-spoons evening for accomplished founders living with chronic illness. Seated, quiet-friendly, no pressure to stay the whole time.",
  },

  // Build output folder.
  outDir: "dist",

  locale: "en_US",
  lang: "en",
  publisherSince: 2026,
};
