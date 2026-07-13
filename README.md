<p align="center">
  <a href="https://neoi.sh" target="_blank">
    <img src="https://user-images.githubusercontent.com/807318/109376537-6ac33300-78c5-11eb-854f-eaa130114161.png">
  </a>
</p>

<h1 align="center">Neo</h1>

<p align="center">
  <i>Source for my website, <a href="https://neoi.sh">neoi.sh</a>. See <a href="./LICENSE.md">LICENSE</a> for usage.</i>
</p>

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # -> ./dist
pnpm preview    # serve the build

pnpm check      # astro type-check
pnpm lint       # biome
```

## Structure

Astro site with a landing page and a blog, in English (`/`) and German (`/de`).

- `src/pages/` — routes: landing (`index.astro`), blog index and posts (`blog/`), German mirror (`de/`).
- `src/layouts/` — page shells: `LandingLayout`, `BlogLayout`, `PostLayout`.
- `src/components/` — `Landing`, `BlogIndex`, `LangSwitcher`.
- `src/content/blog/*.md` — one file per post; filename = URL slug.
- `src/i18n/` — UI and landing copy per locale.
- `src/styles/blog.css` — blog design system.
- `public/` — static assets served as-is.

## Writing a post

Add a `.md` file to `src/content/blog/`. Only `title`, `description`, and `date` are required:

```yaml
---
title: Post Title
description: One-line summary, shown under the headline and on the index.
date: 2026-07-02
category: Engineering        # optional eyebrow; falls back to first tag
tags: laravel, optimisation  # optional, comma-separated
reading_minutes: 9           # optional
image: /img/header.jpg       # optional header (URL or /public path)
image_caption: Optional caption.
featured: true               # optional — pins it as the index hero
draft: true                  # optional — omit from build
---
```

The first paragraph becomes the serif lead with a drop cap. Code blocks render plain — set `syntaxHighlight` in `astro.config.mjs` to change that. For a German post, mirror the file under `src/content/blog/de/`.
