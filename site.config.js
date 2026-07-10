// ---------------------------------------------------------------------------
// Built & Unwell site configuration
// Change values here to rebrand or move hosts. Everything else reads from this.
// ---------------------------------------------------------------------------

// SITE_URL = the live origin (no trailing slash).
// BASE_PATH = the sub-folder the site is served from.
//   - GitHub Pages PROJECT site (default):  origin = https://<user>.github.io , basePath = /<repo>
//   - Custom domain OR user/org Pages site: basePath = "" (empty)
// Both can be overridden at build time with env vars, e.g.:
//   SITE_URL=https://builtandunwell.com BASE_PATH="" npm run build
// Default assumes a root-served host (Vercel / Netlify / custom domain): base path "".
// The GitHub Pages workflow overrides BASE_PATH to "/<repo>" for its project sub-path.
// On Vercel, set SITE_URL in the project's Environment Variables to your real URL
// (e.g. https://built-and-unwell.vercel.app, later your custom domain) for correct
// canonical/OpenGraph/sitemap links.
const SITE_URL = (process.env.SITE_URL || "https://built-and-unwell.vercel.app").replace(/\/$/, "");
const BASE_PATH = process.env.BASE_PATH ?? "";

export default {
  siteUrl: SITE_URL,
  basePath: BASE_PATH,

  // Brand
  name: "Built & Unwell",
  shortName: "Built & Unwell",
  // Monogram used in the logo mark and favicon.
  monogram: "B&U",
  tagline: "A network for people who built something, while carrying something invisible.",
  // The one-line "what is this" used in meta descriptions and AI answers.
  description:
    "Built & Unwell is a network for business owners, founders, and company executives in Austin, Texas who carry an invisible difference (chronic illness, high-functioning autism, or something else no one can see) while performing at a high level. Many of us are women, who feel that pressure hardest. Honest writing, real connection, and zero medical-establishment gatekeeping.",

  // Who this is for. Used on the homepage and in structured data.
  audience:
    "Business owners, founders, and company executives in Austin, former top-50 corporate leaders, strategy consultants, and finance professionals, many of them women, who carry an invisible difference, whether chronic illness, high-functioning autism, or something else no one can see, while operating at a high level.",

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
      "Yvette is the founder of Built & Unwell. She built a career across corporate and finance before building businesses of her own, all while living with chronic illness in downtown Austin. She writes from experience, not from a clinic.",
    email: "wecare@yvetteowo.com",
  },

  // Social / outbound (fill in as you create them).
  social: {
    // twitter: "https://x.com/...",
    // linkedin: "https://www.linkedin.com/in/...",
    // instagram: "https://instagram.com/...",
  },

  // Monthly community event (downtown Austin). Edit date/place as you lock venues.
  event: {
    name: "Built & Unwell Monthly Gathering",
    cadence: "Monthly, first Wednesday",
    time: "6:00 to 8:00 PM CT",
    area: "Downtown Austin",
    blurb:
      "A low-spoons evening for business owners, founders, and company executives living with chronic illness. Seated, quiet-friendly, no pressure to stay the whole time.",
  },

  // Build output folder.
  outDir: "dist",

  locale: "en_US",
  lang: "en",
  publisherSince: 2026,
};
