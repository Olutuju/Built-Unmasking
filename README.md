# Built & Unmasked

A peer network for business owners, founders, and company executives in Austin who carry an invisible difference — chronic illness, high-functioning autism, or something else no one can see. Based in **downtown Austin, Texas**.

This repository is the whole website: a fast, static, SEO/GEO/GAIO-optimized blog and community site. Every blog post centers Austin (and downtown Austin) on purpose. It is a **peer community, not a medical resource.**

**Round two.** Round one's content and structure were right; the process wasn't — pages got rewritten five times chasing CTA wording, tone, and contact-info changes mid-build. This round starts from that already-settled direction (see `../built-and-unmasked-summary.md` for the full brief) instead of re-litigating it.

**Status:** live at [built-unseen.vercel.app](https://built-unseen.vercel.app/), auto-deploying on every push to `main`. GitHub Pages was tried first and dropped, it served the page with no CSS/fonts applied (a base-path mismatch not worth chasing down) — Vercel renders correctly, so it's the only deployment target now.

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

## Deploying (Vercel — the only deployment target)

Already connected: the GitHub repo is linked to a Vercel project, so every push to `main` auto-deploys to [built-unseen.vercel.app](https://built-unseen.vercel.app/). Nothing to run manually.

For reference, this is how it was connected (only needed again if the link ever breaks):

1. [vercel.com](https://vercel.com) → sign in with GitHub → **Add New… → Project** → import this repo.
2. Vercel reads `vercel.json` automatically — build command `npm run build`, output `dist`.
3. **Set `SITE_URL`** in Project → Settings → Environment Variables to the live URL, so canonical/OpenGraph/sitemap links are correct, then redeploy.
4. **Custom domain later:** Project → Settings → Domains → add the domain. No rebuild needed.

GitHub Pages was tried and dropped — it served the site with no CSS or fonts loading, and rather than debug a second deploy target for a static site that already works on Vercel, Pages is just disabled. There's no `.github/workflows/deploy.yml` anymore for the same reason.

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

*Built & Unmasked — community and lived experience. Not medical advice.*
