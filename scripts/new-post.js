// Scaffold a new blog post:  npm run new -- "My Post Title About Austin"
// Creates src/posts/<date>-<slug>.md pre-filled with front matter + a structure
// that's already SEO/GEO/GAIO-friendly (takeaways + FAQ + Austin focus).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS = path.join(__dirname, "..", "src", "posts");

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "Your Post Title"');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = title.toLowerCase().replace(/[^\w]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
const file = path.join(POSTS, `${today}-${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

const template = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${today}
description: "One or two sentences, ~150 chars, that mention Austin and what the reader gets. This is the meta description AI engines and Google show."
place: "Downtown Austin"
tags: [austin, chronic-illness, entrepreneurship]
# image: /assets/social-card.svg   # optional custom social image
# draft: true                      # set while writing; remove to publish
takeaways:
  - "A punchy one-line takeaway (Austin-specific where possible)."
  - "Another takeaway someone could quote."
  - "A third."
faq:
  - q: "A real question someone in Austin would type or ask an AI?"
    a: "A direct, 2–4 sentence answer. Lead with the answer. Mention Austin."
  - q: "Second question?"
    a: "Second answer."
---

Open with your voice. Say the true thing first — the one most blogs won't.

## A clear, question-shaped H2 (helps Google + AI engines)

Write the body. Keep Austin and downtown Austin concrete: name a neighborhood,
a kind of venue, a real local rhythm. Link out to **high-authority business,
finance, or operator sources** (HBR, Inc., First Round Review, etc.) — never
medical sites.

## Another H2

Internal-link to a related post like [this](/blog/some-existing-slug/).

> A short pull quote that captures the post in one line.

Close with a turn toward the community — this is about building the room, in Austin.
`;

fs.writeFileSync(file, template);
console.log(`✓ Created ${path.relative(path.join(__dirname, ".."), file)}`);
console.log("  Edit it, then run: npm run build");
