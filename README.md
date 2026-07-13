<p align="center">
  <a href="https://neoi.sh" target="_blank">
    <img src="https://user-images.githubusercontent.com/807318/109376537-6ac33300-78c5-11eb-854f-eaa130114161.png">
  </a>
  <p align="center">
    <h1 align="center">Neo</h1>
    <p align="center">
      <i>This is the source code to my website, <a href="https://neoi.sh">neoi.sh</a>. Look at the LICENSE page for information on usage.</i>
    </p>
  </p>
  <p>&nbsp;</p>
</p>

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # -> ./dist
pnpm preview    # serve the built output

pnpm check      # astro type-check
pnpm lint       # biome
```

> Note: the landing page (`/`) is a `public/` passthrough, so it only resolves
> under `pnpm build` + `pnpm preview` (or any static server), not `pnpm dev`.
> The blog routes (`/blog`, posts) work under `pnpm dev` with hot reload.

## Structure

- `public/index.html` — the landing page, served **verbatim**. It's the
  hand-tuned `redesign/01-cinematic.html` prototype (self-contained styles +
  inline GSAP via CDN). It lives in `public/` rather than `src/pages/` so
  Astro's compiler never touches the art direction; it's a static passthrough.
  Edit it directly. Migrate it into a `.astro` page later only if you want to
  share the blog's layout components.
- `src/pages/blog/index.astro` — the Writing index (featured post + archive grid).
- `src/pages/blog/[...slug].astro` — renders each post through `PostLayout`.
- `src/content/blog/*.md` — one markdown file per post. Filename = URL slug.
- `src/layouts/` — `BlogLayout` (shared chrome: grain, cursor, fonts, GSAP
  reveal) and `PostLayout` (the article shell around rendered markdown).
- `src/styles/blog.css` — the blog design system.
- `public/` — static assets (`/img`, `/audio`, `/vids`) served as-is.

## Writing a post

Drop a `.md` file in `src/content/blog/`. Front-matter (see `src/content.config.ts`):

```yaml
---
title: Post Title
description: One-line dek, shown under the headline and on the index.
date: 2026-07-02
category: Engineering        # eyebrow above the headline
tags: Laravel, Optimisation  # comma-separated
reading_minutes: 9
image: /img/header.jpg       # optional header image (URL or /public path)
image_caption: Optional caption.
featured: true               # optional — pins it as the index hero
draft: false                 # optional — omit from build
---
```

The first paragraph automatically becomes the serif lead with a drop cap.
Code blocks render plain (single signal accent, no full syntax highlighting) —
flip `syntaxHighlight` in `astro.config.mjs` to change that.
