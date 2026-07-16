// ---------------------------------------------------------------------------
// Built & Unmasked site configuration
// Change values here to rebrand or move hosts. Everything else reads from this.
// ---------------------------------------------------------------------------

// SITE_URL = the live origin (no trailing slash). Vercel is the only deploy
// target (GitHub Pages was tried and dropped — see README), so this is always
// root-served: no BASE_PATH sub-folder to account for.
// On Vercel, set SITE_URL in the project's Environment Variables to the real
// URL (e.g. https://built-and-unmasked.vercel.app, later a custom domain)
// for correct canonical/OpenGraph/sitemap links.
const SITE_URL = (process.env.SITE_URL || "https://built-and-unmasked.vercel.app").replace(/\/$/, "");
const BASE_PATH = "";

export default {
  siteUrl: SITE_URL,
  basePath: BASE_PATH,

  // Brand
  name: "Built & Unmasked",
  shortName: "Built & Unmasked",
  // Monogram used in the logo mark and favicon.
  monogram: "B&U",
  tagline: "A room in Austin where people believe you. Share your unique perspective and brainstorm solutions with people who get it.",
  // The one-line "what is this" used in meta descriptions and AI answers.
  description:
    "Built & Unmasked is a peer network in Austin, Texas for business owners, founders, company executives, private equity professionals, and management consultants who carry an invisible difference (chronic illness, high-functioning autism, or something else no one can see). You don't have to explain yourself here. Everyone in the room already gets it, so you can skip the part where you justify what's going on and just talk to people who understand.",

  // Who this is for. Used on the homepage and in structured data.
  audience:
    "Business owners, founders, company executives, private equity professionals, and management consultants in Austin, former top-50 corporate leaders (including corporate strategy backgrounds like Accenture), strategy consultants, and finance professionals, many of them women, who carry an invisible difference, whether chronic illness, high-functioning autism, or something else no one can see, while operating at a high level.",

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
      "Yvette is the founder of Built & Unmasked. She came up doing corporate strategy at Accenture, then built a career across corporate and finance before building businesses of her own. She learned she had autism at 41 and had her first fully unmasked week at nearly 42, all while living with chronic illness in downtown Austin. She writes from experience, not from a clinic.",
  },

  // Social / outbound (fill in as you create them).
  social: {
    // twitter: "https://x.com/...",
    // linkedin: "https://www.linkedin.com/in/...",
    // instagram: "https://instagram.com/...",
  },

  // Monthly community event (downtown Austin). Edit date/place as you lock venues.
  event: {
    name: "Built & Unmasked Monthly Gathering",
    cadence: "Monthly, first Wednesday",
    time: "6:00 to 8:00 PM CT",
    area: "Downtown Austin",
    seats: 20,
    blurb:
      "A low-spoons evening for business owners, founders, and company executives living with chronic illness or high-functioning autism. Seated, quiet-friendly, no pressure to stay the whole time.",
  },

  // Formspree endpoint for the RSVP form on the events page.
  // Create a free form at formspree.io, paste the endpoint below (looks like
  // https://formspree.io/f/xxxxxxxx), then rebuild. Leave blank and the form
  // won't submit anywhere yet.
  formspreeEndpoint: "https://formspree.io/f/mkodnwwe",

  // Formspree endpoint for the lighter-weight "email me the blog + gathering
  // announcements" signup (a low-friction alternative to RSVPing for people
  // not ready to commit yet). Create a SECOND, separate free form at
  // formspree.io for this (keeps notify-list signups from mixing with RSVP
  // data), paste the endpoint below, then rebuild. Leave blank and the form
  // won't submit anywhere yet.
  notifyFormspreeEndpoint: "",

  // Build output folder.
  outDir: "dist",

  locale: "en_US",
  lang: "en",
  publisherSince: 2026,
};
