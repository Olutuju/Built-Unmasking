# Built & Unseen

A peer network for business owners, founders, and company executives in Austin who carry an invisible difference — chronic illness, high-functioning autism, or something else no one can see. Based in **downtown Austin, Texas**.

This repository is the whole website: a fast, static, SEO/GEO/GAIO-optimized blog and community site. Every blog post centers Austin (and downtown Austin) on purpose. It is a **peer community, not a medical resource.**

**Round two.** Round one's content and structure were right; the process wasn't — pages got rewritten five times chasing CTA wording, tone, and contact-info changes mid-build. This round starts from that already-settled direction (see `../built-and-unwell-summary.md` for the full brief) instead of re-litigating it. The one open item carried over: **the venue address in `src/pages/events.md` is still a placeholder** — fill it in before treating the "no RSVP, just show up" model as live.

---

## Quick start

```bash
npm install         # one time
npm run build       # builds the site into ./dist
npm run serve       # builds, then preview at http://localhost:4321/
```

## Writing a new post (do this daily)

The whole point is a fresh post regularly. It takes two commands:

```bash
npm run new -- "Your Post Title About Austin"   # creates a dated markdown file in src/posts/
# ...open the new file, write the post, save...
npm run build                                    # rebuild
```

### What goes in a post

The scaffolder pre-fills the front matter. Fill in:

- **title / description** — the description is your meta text (Google + AI engines show it). ~150 chars, mention Austin.
- **tags** — reuse existing tags where you can (they build topic pages).
- **takeaways** — 2–4 quotable one-liners. These render as a "Key takeaways" box and help AI engines cite you.
- **faq** — 2–3 real questions + direct answers. These become an on-page FAQ **and** FAQ structured data (huge for SEO/GEO).
- **body** — your voice. Keep Austin concrete. Link out to **high-authority business/finance sources** (HBR, First Round, Inc., Forbes) — **never medical sites**. Internal-link to related posts: `[text](/blog/some-slug/)`.

Set `draft: true` in front matter while writing; remove it to publish.

---

## What's optimized, and where it lives

Everything below is generated automatically by `build.js` on every build:

| Optimization | Where |
|---|---|
| Per-page `<title>`, meta description, canonical | every page |
| Open Graph + Twitter cards (social previews) | every page |
| **SEO** structured data: `Organization`, `WebSite`, `Blog`, `BlogPosting`, `BreadcrumbList` | JSON-LD in `<head>` |
| **GEO/GAIO** FAQ structured data (`FAQPage`) + on-page FAQ | posts & key pages |
| **GEO/GAIO** `llms.txt` + `llms-full.txt` (AI-engine feeds) | site root |
| `sitemap.xml` | site root |
| `robots.txt` (explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) | site root |
| RSS `feed.xml` | site root |
| Local/geo signals (`geo.*` meta, Austin `Place` schema) | every page |
| "Key takeaways" / TL;DR blocks (AI engines quote these) | posts |
| Fast, mobile-first, accessible, zero external requests | whole site |

---

## Deploying (Vercel — recommended, free, works with a private repo)

1. Go to [vercel.com](https://vercel.com), sign in with GitHub, **Add New… → Project**, and import this repo.
2. Vercel reads `vercel.json` automatically — build command `npm run build`, output `dist`. Just click **Deploy**.
3. You get a free `*.vercel.app` URL. Every push to the production branch auto-deploys.
4. **Set `SITE_URL`** in Project → Settings → Environment Variables to your live URL (your `*.vercel.app`, later your custom domain) so canonical/OpenGraph/sitemap links are correct, then redeploy.
5. **Custom domain later:** Project → Settings → Domains → add your domain. No rebuild needed.

Netlify and Cloudflare Pages work identically (same build command / output dir).

## Deploying (GitHub Pages)

There's no auto-deploy workflow in this repo yet — add a `.github/workflows/deploy.yml` that runs `npm run build` and publishes `dist/` if you want that path. Otherwise the `dist/` folder is a plain static site and can be pushed to any static host by hand.

---

## Rebranding (name, colors, event details)

Everything reads from **`site.config.js`**. Change the `name`, `tagline`, `description`, `event` details, author info, or social links there and the entire site updates on the next `build`. Colors live at the top of `src/assets/styles.css` (the `:root` variables).

---

## Project structure

```
site.config.js          # brand, audience, location, author, event — edit here
build.js                # the static site generator (SEO/GEO/GAIO lives here)
src/
  posts/*.md            # blog posts (one file = one post)
  pages/*.md            # about, community, events
  assets/               # styles.css, favicon, social card
scripts/
  new-post.js           # `npm run new -- "Title"`
  serve.js              # local preview server
dist/                   # build output (gitignored)
```

---

*Built & Unseen — community and lived experience. Not medical advice.*
