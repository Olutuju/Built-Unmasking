# The Understory

A network for accomplished people who've built something — and live with chronic illness. Based in **downtown Austin, Texas**.

This repository is the whole website: a fast, static, SEO/GEO/GAIO-optimized blog and community site. Every blog post centers Austin (and downtown Austin) on purpose. It is a **peer community, not a medical resource.**

---

## Quick start

```bash
npm install         # one time
npm run build       # builds the site into ./dist
npm run serve       # builds, then previews at http://localhost:4321/yetunde-reminders/
```

## Writing a new post (do this daily)

The whole point is a fresh post regularly. It takes two commands:

```bash
npm run new -- "Your Post Title About Austin"   # creates a dated markdown file in src/posts/
# ...open the new file, write the post, save...
npm run build                                    # rebuild
git add . && git commit -m "New post" && git push
```

That's it. On push to `main`, GitHub Pages rebuilds and publishes automatically (see below). A post is live within a couple of minutes of pushing.

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

> **Naming vs. Austin:** the brand name (`The Understory`) deliberately does *not* say "Austin," while every post and all the metadata is saturated with "Austin" / "downtown Austin." That's intentional — aspirational brand, locally-optimized content.

---

## Deploying (Vercel — recommended, free, works with a private repo)

1. Go to [vercel.com](https://vercel.com), sign in with GitHub, **Add New… → Project**, and import this repo.
2. Vercel reads `vercel.json` automatically — build command `npm run build`, output `dist`. Just click **Deploy**.
3. You get a free `*.vercel.app` URL. Every push to the production branch auto-deploys.
4. **Set `SITE_URL`** in Project → Settings → Environment Variables to your live URL (your `*.vercel.app`, later your custom domain) so canonical/OpenGraph/sitemap links are correct, then redeploy.
5. **Custom domain later:** Project → Settings → Domains → add your domain. No rebuild needed.

Netlify and Cloudflare Pages work identically (same build command / output dir).

## Deploying (GitHub Pages)

Deployment is automated via `.github/workflows/deploy.yml`. One-time setup:

1. Push this repo to GitHub (branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` now builds and publishes automatically.

Your site will be at: `https://<your-username>.github.io/yetunde-reminders/`

### Using a custom domain later

1. Add your domain in **Settings → Pages → Custom domain**.
2. In `.github/workflows/deploy.yml`, set `BASE_PATH: ""` and `SITE_URL: https://yourdomain.com`.

Or change hosts entirely — the `dist/` folder is a plain static site that works on Netlify, Vercel, Cloudflare Pages, or any static host.

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
.github/workflows/      # auto-deploy to GitHub Pages
dist/                   # build output (gitignored)
```

---

## 30 post ideas to keep the daily habit going

All Austin-focused, all for the accomplished-but-chronically-ill audience:

1. The Austin coffee shops with the best "sit and stay a while" energy for low-spoons work
2. How I handle a flare the week of a big Austin pitch
3. A downtown Austin walking-meeting route for the days standing is hard
4. What I wish investors understood about capacity
5. Building a personal board of advisors in Austin when you can't do the lunch circuit
6. The email templates I use to reschedule without over-explaining
7. Chronic illness and imposter syndrome: the double bind for accomplished women
8. How to vet an Austin cofounder when reliability matters more than usual
9. The case for a 4-day workweek as an Austin founder with chronic illness
10. Austin's quietest coworking floors, ranked by sensory load
11. What corporate taught me about running meetings that don't drain me
12. Money and medical debt: a finance person's honest take
13. How to build referral relationships in Austin without the happy-hour circuit
14. The "good day" trap: why I stopped scheduling from my best self
15. Hiring your first employee when you might be offline unpredictably
16. Downtown Austin restaurants with private rooms for a chronic-friendly dinner
17. Saying no to a great opportunity because it would cost too much health
18. The productivity systems that actually survive a flare
19. What a sustainable launch calendar looks like for us
20. Building an audience online so networking doesn't depend on your body
21. The Austin founder resources I actually recommend (none of them medical)
22. How to talk to your team about capacity without oversharing
23. Business travel when your body is unpredictable: an Austin-based playbook
24. The identity grief of building smaller than you once planned
25. Why I moved my most important work to mornings
26. Finding a coach who gets high-achievers (the business kind of support)
27. The one-page "how I work" doc I share with new collaborators
28. Community over hustle: the year I stopped going to everything in Austin
29. What "success" looks like at year five if I do this right
30. Profiles: the women quietly building serious things in Austin (with permission)

---

*The Understory — community and lived experience. Not medical advice.*
