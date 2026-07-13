// ---------------------------------------------------------------------------
// Built & Unmasking static site generator
// Reads markdown from src/posts + src/pages and emits a fully SEO/GEO/GAIO
// optimized static site into ./dist. No framework; just marked + gray-matter.
// ---------------------------------------------------------------------------
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import site from "./site.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, site.outDir);

// ---- helpers --------------------------------------------------------------
const BASE = site.basePath.replace(/\/$/, ""); // "" or "/repo"
const url = (p = "/") => `${BASE}${p.startsWith("/") ? p : "/" + p}`; // root-relative
const abs = (p = "/") => `${site.siteUrl}${url(p)}`; // absolute
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const stripTags = (s = "") => s.replace(/<[^>]*>/g, "");
const rmReadtime = (text) => Math.max(1, Math.round(stripTags(text).split(/\s+/).length / 200));
const fmtDate = (d) =>
  new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
const iso = (d) => new Date(d + "T12:00:00Z").toISOString();

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function write(rel, content) {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  // Swap in config-driven tokens any page's raw markdown/HTML may reference,
  // e.g. the events page's signup form action.
  const resolved = typeof content === "string"
    ? content.replaceAll("__FORMSPREE_ENDPOINT__", site.formspreeEndpoint || "")
    : content;
  fs.writeFileSync(full, resolved);
}
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ---- markdown configuration ----------------------------------------------
marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    heading(text, level) {
      const slug = stripTags(text)
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return `<h${level} id="${slug}">${text}</h${level}>\n`;
    },
    // external links open in a new tab + rel for safety/SEO
    link(href, title, text) {
      const external = /^https?:\/\//.test(href);
      const t = title ? ` title="${esc(title)}"` : "";
      const rel = external ? ' rel="noopener nofollow"' : "";
      const tgt = external ? ' target="_blank"' : "";
      return `<a href="${href}"${t}${rel}${tgt}>${text}</a>`;
    },
  },
});

// ---- load content ---------------------------------------------------------
function loadCollection(dir) {
  const d = path.join(SRC, dir);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(d, f), "utf8");
      const { data, content } = matter(raw);
      // YAML auto-parses `date: 2026-07-03` into a Date; normalize to YYYY-MM-DD string.
      if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
      if (data.updated instanceof Date) data.updated = data.updated.toISOString().slice(0, 10);
      const slug = data.slug || f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const html = marked.parse(content);
      return {
        ...data,
        slug,
        bodyMarkdown: content,
        html,
        readingTime: rmReadtime(html),
        excerpt: data.description || stripTags(html).slice(0, 155).trim() + "…",
      };
    });
}

const posts = loadCollection("posts")
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));
const pages = loadCollection("pages");

// tag index
const tagMap = {};
for (const p of posts) (p.tags || []).forEach((t) => (tagMap[t] ||= []).push(p));

// ---- shared layout --------------------------------------------------------
function head({ title, description, canonical, image, type = "website", jsonld = [], extraMeta = "" }) {
  const fullTitle = title === site.name ? title : `${title} · ${site.name}`;
  const desc = esc(description || site.description);
  const img = abs(image || "/assets/social-card.svg");
  const ld = jsonld
    .filter(Boolean)
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="author" content="${esc(site.author.name)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#1f2933">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="${site.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${img}">
<meta name="geo.region" content="US-${site.regionCode}">
<meta name="geo.placename" content="${esc(site.neighborhood)}, ${esc(site.city)}">
<meta name="geo.position" content="${site.geo.lat};${site.geo.lng}">
<meta name="ICBM" content="${site.geo.lat}, ${site.geo.lng}">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} RSS" href="${abs("/feed.xml")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="${url("/assets/styles.css")}">
<link rel="icon" href="${url("/assets/favicon.svg")}" type="image/svg+xml">
${extraMeta}
${ld}
</head>`;
}

function nav(active = "") {
  const link = (href, label, key) =>
    `<a href="${url(href)}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${url("/")}">
      <span class="brand-mark" role="img" aria-label="${esc(site.name)} mark">
        <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#c1502e"/>
          <circle cx="29" cy="32" r="16" fill="#2a160c"/>
          <circle cx="38" cy="25" r="14" fill="#c1502e"/>
        </svg>
      </span>
      <span class="brand-name">${site.name}</span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      ${link("/", "Home", "home")}
      ${link("/blog/", "Blog", "blog")}
      ${link("/events/", "Events", "events")}
      ${link("/about/", "About", "about")}
      ${link("/community/", "Join", "community")}
    </nav>
  </div>
</header>`;
}

function footer() {
  const yr = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="wrap">
    <div>
      <strong>${site.name}</strong>
      <p>${esc(site.tagline)}</p>
      <p class="muted">Based in ${esc(site.neighborhood)}, ${esc(site.region)}.</p>
    </div>
    <nav aria-label="Footer">
      <a href="${url("/blog/")}">All posts</a>
      <a href="${url("/events/")}">Monthly meetup</a>
      <a href="${url("/about/")}">About</a>
      <a href="${url("/community/")}">Join the network</a>
      <a href="${abs("/feed.xml")}">RSS</a>
    </nav>
  </div>
  <div class="wrap fineprint muted">
    <span>© ${site.publisherSince} to ${yr} ${esc(site.name)}.</span>
    <span>Community &amp; lived experience, not medical advice.</span>
  </div>
</footer>`;
}

function shell(opts, body) {
  return `${head(opts)}
<body>
<a class="skip" href="#main">Skip to content</a>
${nav(opts.active)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>`;
}

// ---- structured data ------------------------------------------------------
const orgLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": abs("/#org"),
  name: site.name,
  url: abs("/"),
  description: site.description,
  founder: { "@type": "Person", name: site.author.name },
  areaServed: { "@type": "City", name: site.city },
  knowsAbout: ["chronic illness", "entrepreneurship", "small business", "founder community", "Austin Texas"],
  sameAs: Object.values(site.social),
};

function articleLD(p) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: iso(p.date),
    dateModified: iso(p.updated || p.date),
    author: { "@type": "Person", name: site.author.name, description: site.author.bio },
    publisher: { "@id": abs("/#org") },
    mainEntityOfPage: abs(`/blog/${p.slug}/`),
    image: abs(p.image || "/assets/social-card.svg"),
    keywords: (p.tags || []).join(", "),
    articleSection: "Austin",
    about: [
      { "@type": "Thing", name: "Chronic illness and entrepreneurship" },
      { "@type": "Place", name: `${site.neighborhood}, ${site.region}` },
    ],
  };
}

function faqLD(faq) {
  if (!faq || !faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function breadcrumbLD(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.href),
    })),
  };
}

// ---- rendering blocks -----------------------------------------------------
function postCard(p) {
  return `<article class="card">
  <div class="card-meta">
    <time datetime="${iso(p.date)}">${fmtDate(p.date)}</time>
    <span class="dot">·</span><span>${p.readingTime} min</span>
    <span class="pin">📍 ${esc(p.place || site.city)}</span>
  </div>
  <h3><a href="${url(`/blog/${p.slug}/`)}">${esc(p.title)}</a></h3>
  <p>${esc(p.description)}</p>
  <div class="tags">${(p.tags || []).map((t) => `<a class="tag" href="${url(`/tags/${slugify(t)}/`)}">#${esc(t)}</a>`).join("")}</div>
</article>`;
}

const slugify = (t) => t.toLowerCase().replace(/[^\w]+/g, "-").replace(/(^-|-$)/g, "");

function faqBlock(faq) {
  if (!faq || !faq.length) return "";
  return `<section class="faq" aria-labelledby="faq-h">
  <h2 id="faq-h">Frequently asked questions</h2>
  ${faq
    .map(
      (f) => `<details>
    <summary>${esc(f.q)}</summary>
    <div>${marked.parseInline(f.a)}</div>
  </details>`
    )
    .join("\n")}
</section>`;
}

function takeawaysBlock(items) {
  if (!items || !items.length) return "";
  return `<aside class="tldr" aria-labelledby="tldr-h">
  <h2 id="tldr-h">Key takeaways</h2>
  <ul>${items.map((i) => `<li>${marked.parseInline(i)}</li>`).join("")}</ul>
</aside>`;
}

// ===========================================================================
// BUILD
// ===========================================================================
rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"));

// ---- blog posts -----------------------------------------------------------
for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const canonical = abs(`/blog/${p.slug}/`);
  const related = posts.filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, score: (x.tags || []).filter((t) => (p.tags || []).includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.x);

  const body = `
<article class="post wrap-narrow">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="${url("/")}">Home</a> › <a href="${url("/blog/")}">Blog</a> › <span>${esc(p.title)}</span>
  </nav>
  <header class="post-head">
    <div class="card-meta">
      <time datetime="${iso(p.date)}">${fmtDate(p.date)}</time>
      <span class="dot">·</span><span>${p.readingTime} min read</span>
      <span class="pin">📍 ${esc(p.place || site.neighborhood)}</span>
    </div>
    <h1>${esc(p.title)}</h1>
    <p class="lede">${esc(p.description)}</p>
    <div class="byline">By ${esc(site.author.name)}, ${esc(site.author.role)}</div>
    <div class="tags">${(p.tags || []).map((t) => `<a class="tag" href="${url(`/tags/${slugify(t)}/`)}">#${esc(t)}</a>`).join("")}</div>
  </header>
  ${takeawaysBlock(p.takeaways)}
  <div class="prose">
    ${p.html}
  </div>
  ${faqBlock(p.faq)}
  <div class="post-cta">
    <h2>Nobody here needs it explained</h2>
    <p>Built &amp; Unmasking is for accomplished founders and operators living with chronic illness. If that's you, you belong here, and you won't have to justify a single word of it.</p>
    <a class="btn" href="${url("/events/")}">See the next ${esc(site.neighborhood)} meetup</a>
    <a class="btn ghost" href="${url("/community/")}">How it works</a>
  </div>
</article>
${related.length ? `<section class="wrap related"><h2>Keep reading</h2><div class="grid">${related.map(postCard).join("")}</div></section>` : ""}`;

  write(`blog/${p.slug}/index.html`, shell(
    {
      title: p.title,
      description: p.description,
      canonical,
      image: p.image,
      type: "article",
      active: "blog",
      jsonld: [articleLD(p), faqLD(p.faq), breadcrumbLD([
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog/" },
        { name: p.title, href: `/blog/${p.slug}/` },
      ])],
    },
    body
  ));
}

// ---- blog index -----------------------------------------------------------
{
  const [latest, ...rest] = posts;
  const body = `
<section class="hero hero-sub wrap">
  <h1>The Blog</h1>
  <p class="lede">${posts.length} essays and field notes on building a business while unmasking, every one of them rooted in ${esc(site.city)}, ${esc(site.region)}. A new post goes up regularly.</p>
</section>
<section class="wrap">
  ${latest ? `<a class="feature" href="${url(`/blog/${latest.slug}/`)}">
    <span class="kicker">Latest from ${esc(site.neighborhood)}</span>
    <h2>${esc(latest.title)}</h2>
    <p>${esc(latest.description)}</p>
    <span class="readmore">Read the post →</span>
  </a>` : ""}
  <div class="grid">${rest.map(postCard).join("")}</div>
</section>`;
  write("blog/index.html", shell(
    {
      title: "Blog",
      description: `Essays on entrepreneurship and chronic illness in ${site.city}, ${site.region}, from ${site.name}.`,
      canonical: abs("/blog/"),
      active: "blog",
      jsonld: [
        breadcrumbLD([{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }]),
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${site.name} Blog`,
          url: abs("/blog/"),
          publisher: { "@id": abs("/#org") },
          blogPost: posts.slice(0, 10).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: abs(`/blog/${p.slug}/`),
            datePublished: iso(p.date),
          })),
        },
      ],
    },
    body
  ));
}

// ---- tag pages ------------------------------------------------------------
for (const [tag, list] of Object.entries(tagMap)) {
  const s = slugify(tag);
  const body = `
<section class="hero hero-sub wrap">
  <span class="kicker">Topic</span>
  <h1>#${esc(tag)}</h1>
  <p class="lede">${list.length} post${list.length === 1 ? "" : "s"} on ${esc(tag)}, all set in ${esc(site.city)}.</p>
</section>
<section class="wrap"><div class="grid">${list.map(postCard).join("")}</div></section>`;
  write(`tags/${s}/index.html`, shell(
    {
      title: `#${tag}`,
      description: `${site.name} posts tagged ${tag}, focused on ${site.city}, ${site.region}.`,
      canonical: abs(`/tags/${s}/`),
      active: "blog",
      jsonld: [breadcrumbLD([{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }, { name: `#${tag}`, href: `/tags/${s}/` }])],
    },
    body
  ));
}

// ---- static pages (markdown in src/pages) ---------------------------------
for (const pg of pages) {
  const canonical = abs(`/${pg.slug}/`);
  const body = `
<article class="page wrap-narrow">
  <header class="post-head">
    <h1>${esc(pg.title)}</h1>
    ${pg.description ? `<p class="lede">${esc(pg.description)}</p>` : ""}
  </header>
  ${takeawaysBlock(pg.takeaways)}
  <div class="prose">${pg.html}</div>
  ${faqBlock(pg.faq)}
</article>`;
  write(`${pg.slug}/index.html`, shell(
    {
      title: pg.title,
      description: pg.description,
      canonical,
      active: pg.slug,
      jsonld: [faqLD(pg.faq), breadcrumbLD([{ name: "Home", href: "/" }, { name: pg.title, href: `/${pg.slug}/` }])],
    },
    body
  ));
}

// ---- homepage -------------------------------------------------------------
{
  const featured = posts.slice(0, 6);
  const body = `
<section class="hero wrap">
  <span class="kicker">${esc(site.neighborhood)}, ${esc(site.region)}</span>
  <h1>Take off the mask. Be you. The full you is welcome here.</h1>
  <p class="lede">${esc(site.description)}</p>
  <div class="hero-actions">
    <a class="btn" href="${url("/events/")}">Come to the next gathering</a>
    <a class="btn ghost" href="${url("/community/")}">How it works</a>
  </div>
  <p class="hero-note">I built things I'm proud of. I'm also chronically ill. I got tired of picking which one to talk about. So once a month, downtown, I sit at a table with people who don't make me pick.</p>
</section>

<section class="wrap band">
  <div class="band-single">
    <h2>Two rooms, and neither fits</h2>
    <p>Walk into a typical entrepreneur room and the unspoken assumption is a body that always shows up: early mornings, late networking, just push through. Walk into a typical chronic illness space and you're a patient first, symptoms and coping, and the ambitious part of you is beside the point.</p>
    <p>So you pick a room and hide the other half. Every day you do, it costs something: the energy of performing fine, the isolation of thinking you're the only one, the exhaustion of masking so well that even you stop noticing what it's taking.</p>
  </div>
</section>

<section class="wrap band">
  <div class="band-single">
    <h2>I know, because I live it</h2>
    <p>I came up through corporate and finance, then built my own businesses, all while living with chronic illness. I never found the room that let both be true at once, so I started sitting down with people once a month instead.</p>
    <p>Nearly 80% of autoimmune disease patients are women, and high-functioning autism follows a similar pattern: people don't expect it to look like a woman running a company, so a lot of us mask for years before anyone, including ourselves, notices. This isn't a medical site and it never will be. What happens at the table is peer to peer, lived experience only, nothing prescribed.</p>
  </div>
</section>

<section class="wrap band">
  <div class="band-single">
    <h2>What's different here</h2>
    <ul class="ticks">
      <li>Nobody makes you explain why you're tired, why you left corporate, or why today's a bad day</li>
      <li>Say the real thing instead of the polished version, discretion is the price of entry for everyone</li>
      <li>Trade tactics that actually cut the load, not just sympathy</li>
      <li>Seated, quiet, come and go freely, built for a body that doesn't always cooperate</li>
    </ul>
  </div>
</section>

<section class="wrap band">
  <h2>How to come</h2>
  <ol class="steps">
    <li><span class="step-num">1</span><div><h3>RSVP</h3><p>Save one of ${esc(String(site.event.seats))} seats. No application, nothing reviewed.</p></div></li>
    <li><span class="step-num">2</span><div><h3>Get the address</h3><p>Sent the moment the venue's locked in, nothing else.</p></div></li>
    <li><span class="step-num">3</span><div><h3>Show up</h3><p>Seated, quiet, say the real thing. Leave whenever you need to.</p></div></li>
  </ol>
</section>

<section class="wrap event-strip">
  <div>
    <span class="kicker">Monthly · ${esc(site.neighborhood)}</span>
    <h2>${esc(site.event.name)}</h2>
    <p>${esc(site.event.blurb)} Capped at ${esc(String(site.event.seats))} seats, RSVP to save yours. ${esc(site.event.cadence)}, ${esc(site.event.time)}.</p>
  </div>
  <a class="btn" href="${url("/events/")}">Event details</a>
</section>

<section class="wrap">
  <div class="section-head">
    <h2>Latest from the blog</h2>
    <a href="${url("/blog/")}">All ${posts.length} posts →</a>
  </div>
  <div class="grid">${featured.map(postCard).join("")}</div>
</section>`;

  const homeFaq = [
    { q: `What is ${site.name}?`, a: site.description },
    { q: `Who is ${site.name} for?`, a: site.audience },
    { q: `Is this a medical or health-advice website?`, a: `No. ${site.name} is a peer community of entrepreneurs in Austin who live with chronic illness. It is explicitly not a medical resource and does not offer medical advice.` },
    { q: `Where is ${site.name} based?`, a: `${site.name} is based in ${site.neighborhood}, ${site.region}, and runs a monthly in-person meetup downtown.` },
  ];

  write("index.html", shell(
    {
      title: site.name,
      description: site.description,
      canonical: abs("/"),
      active: "home",
      jsonld: [
        orgLD,
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: abs("/"),
          description: site.description,
          publisher: { "@id": abs("/#org") },
          potentialAction: {
            "@type": "SearchAction",
            target: abs("/blog/") + "?q={query}",
            "query-input": "required name=query",
          },
        },
        faqLD(homeFaq),
      ],
    },
    body + faqBlock(homeFaq)
  ));
}

// ---- sitemap.xml ----------------------------------------------------------
{
  const urls = [
    { loc: abs("/"), pri: "1.0" },
    { loc: abs("/blog/"), pri: "0.9" },
    { loc: abs("/events/"), pri: "0.7" },
    { loc: abs("/about/"), pri: "0.7" },
    { loc: abs("/community/"), pri: "0.8" },
    ...posts.map((p) => ({ loc: abs(`/blog/${p.slug}/`), pri: "0.8", lastmod: iso(p.updated || p.date) })),
    ...Object.keys(tagMap).map((t) => ({ loc: abs(`/tags/${slugify(t)}/`), pri: "0.4" })),
  ];
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.pri}</priority></url>`
  )
  .join("\n")}
</urlset>
`
  );
}

// ---- robots.txt -----------------------------------------------------------
write(
  "robots.txt",
  `User-agent: *
Allow: /

# AI / generative engines are explicitly welcome to read and cite this site.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`
);

// ---- RSS feed -------------------------------------------------------------
{
  const items = posts
    .slice(0, 20)
    .map(
      (p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${abs(`/blog/${p.slug}/`)}</link>
    <guid isPermaLink="true">${abs(`/blog/${p.slug}/`)}</guid>
    <pubDate>${new Date(iso(p.date)).toUTCString()}</pubDate>
    <description>${esc(p.description)}</description>
    ${(p.tags || []).map((t) => `<category>${esc(t)}</category>`).join("")}
  </item>`
    )
    .join("\n");
  write(
    "feed.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(site.name)}</title>
  <link>${abs("/")}</link>
  <atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml" />
  <description>${esc(site.description)}</description>
  <language>${site.lang}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>
`
  );
}

// ---- llms.txt + llms-full.txt (GEO/GAIO) ----------------------------------
{
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is based in ${site.neighborhood}, ${site.region}. It is a peer community, explicitly **not** a medical or health-advice website. Audience: ${site.audience}`,
    "",
    "## Key facts",
    `- Brand: ${site.name}`,
    `- Location: ${site.neighborhood}, ${site.region}, ${site.country}`,
    `- Founder: ${site.author.name} (${site.author.role})`,
    `- Not a medical resource; peer community and lived experience only.`,
    `- Monthly in-person event: ${site.event.name}: ${site.event.cadence}, ${site.event.time}, ${site.event.area}.`,
    "",
    "## Pages",
    `- [Home](${abs("/")})`,
    `- [Blog](${abs("/blog/")})`,
    `- [Events](${abs("/events/")})`,
    `- [About](${abs("/about/")})`,
    `- [Join the network](${abs("/community/")})`,
    "",
    "## Blog posts",
    ...posts.map((p) => `- [${p.title}](${abs(`/blog/${p.slug}/`)}): ${p.description}`),
  ];
  write("llms.txt", lines.join("\n") + "\n");

  const full = [
    `# ${site.name}: full content export for AI engines`,
    "",
    `> ${site.description}`,
    "",
    ...posts.flatMap((p) => [
      `\n\n---\n\n# ${p.title}`,
      `URL: ${abs(`/blog/${p.slug}/`)}`,
      `Published: ${fmtDate(p.date)} | Location focus: ${p.place || site.city}`,
      `Summary: ${p.description}`,
      "",
      p.bodyMarkdown.trim(),
      p.faq && p.faq.length ? "\n## FAQ\n" + p.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n") : "",
    ]),
  ];
  write("llms-full.txt", full.join("\n") + "\n");
}

// ---- 404 ------------------------------------------------------------------
write(
  "404.html",
  shell(
    { title: "Page not found", description: "That page doesn't exist.", canonical: abs("/404.html"), active: "" },
    `<section class="hero wrap"><h1>This page took a sick day.</h1><p class="lede">We couldn't find what you were looking for.</p><a class="btn" href="${url("/")}">Back home</a> <a class="btn ghost" href="${url("/blog/")}">Read the blog</a></section>`
  )
);

// ---- .nojekyll (so GitHub Pages serves _ files etc. untouched) -------------
write(".nojekyll", "");

console.log(`✓ Built ${posts.length} posts, ${pages.length} pages, ${Object.keys(tagMap).length} tags → ${site.outDir}/`);
console.log(`  Site URL: ${abs("/")}`);
