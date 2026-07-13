# Blog SEO: canonical, hreflang, and the `/de/` duplicate-content hole

**Date:** 2026-07-13
**Status:** Approved, not yet implemented

## Problem

Blog posts ship with no `<link rel="canonical">`, no Open Graph tags, no Twitter card, and
no `hreflang`. `src/layouts/LandingLayout.astro` already does all of this correctly, but the
treatment was never carried across to `src/layouts/BlogLayout.astro`, which every blog page
renders through.

That omission is latent today and load-bearing tomorrow, because of a second issue.
`src/pages/de/blog/[...slug].astro` generates a German route for *every* English post and
falls back to the English entry when no translation exists:

```ts
const entry = deBySlug.get(slug) ?? enPost   // English content served at /de/blog/<slug>
```

All 12 current posts have German translations, so nothing duplicates right now. The moment an
English-only post ships, byte-identical content publishes at both `/blog/<slug>` and
`/de/blog/<slug>`, with:

- no canonical to say which is the original,
- no `hreflang` to disambiguate,
- **both URLs in the sitemap**, and
- `scripts/indexnow.mjs` actively pushing both to Bing on every deploy.

Google then picks a winner on its own, and it may not pick the one we want.

## Goals

1. Every blog page asserts a correct canonical URL.
2. An untranslated post can never publish as two competing indexable URLs.
3. Non-canonical URLs stay out of the sitemap and out of IndexNow.
4. Blog posts get the social and structured-data treatment the landing pages already have.

## Non-goals

- Changing routing or redirect behaviour. `/de/blog/<slug>` keeps resolving for
  German-preferring visitors (the `Language=de` 302 in `public/_redirects` still needs a live
  target); it simply stops competing in the index.
- Any content or keyword work. Tracked separately.

## Design

### 1. `BlogLayout.astro` — SEO head

Extend `Props` with optional SEO inputs, mirroring the pattern in `LandingLayout.astro:32-47`:

```ts
interface Props {
  title: string
  description?: string
  progress?: boolean
  lang?: Lang
  canonical?: URL                                   // defaults to self
  alternates?: { en: URL; de: URL } | null          // null = emit no hreflang
  image?: URL
  ogType?: "website" | "article"
  publishedTime?: Date
  jsonLd?: object
}
```

Default `canonical` to `new URL(Astro.url.pathname, Astro.site)` so the blog index and any
other consumer of this layout get a correct self-referencing canonical with no caller changes.

Emit: `<link rel="canonical">`; `hreflang` `en`/`de`/`x-default` when `alternates` is non-null;
`og:type|url|title|description|image|locale`; `twitter:card|title|description|image`;
`article:published_time` when `ogType === "article"`; and a `<script type="application/ld+json">`
when `jsonLd` is provided.

`x-default` points at the English URL, consistent with `LandingLayout.astro:35`.

### 2. `PostLayout.astro` — resolve the right canonical

`PostLayout` receives `post` and `lang`. Note that on the fallback route, `post` is the *English*
entry while `lang` is `"de"` — that mismatch is exactly what we key off.

```ts
const { slug } = parsePostId(post.id)
const hasDe = Boolean(await getEntry("blog", `de/${slug}`))
const enUrl = new URL(`/blog/${slug}`, Astro.site)
const deUrl = new URL(`/de/blog/${slug}`, Astro.site)

// German route + no German entry => we are serving English content; canonical back to English.
const canonical = lang === "de" && hasDe ? deUrl : enUrl
const alternates = hasDe ? { en: enUrl, de: deUrl } : null
```

Resulting signals:

| Route | German translation? | canonical | hreflang |
|---|---|---|---|
| `/blog/<slug>` | yes | `/blog/<slug>` | en + de + x-default |
| `/blog/<slug>` | no | `/blog/<slug>` | none |
| `/de/blog/<slug>` | yes | `/de/blog/<slug>` | en + de + x-default |
| `/de/blog/<slug>` | no (English fallback) | **`/blog/<slug>`** | none |

The bolded row closes the hole: the fallback URL points all ranking signals at the English
original instead of splitting them.

Pass `image` (absolutised via `new URL(d.image, Astro.site)`, since frontmatter carries both
absolute S3 URLs and site-relative paths), `ogType: "article"`, and `publishedTime: d.date`.

### 3. `PostLayout.astro` — JSON-LD

Build a `BlogPosting` object and hand it to `BlogLayout` as `jsonLd`:

```ts
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: d.title,
  description: d.description,
  datePublished: d.date.toISOString(),
  author: { "@type": "Person", name: "Neo Ighodaro", url: "https://neoighodaro.com" },
  mainEntityOfPage: canonical.href,   // canonical, not the current URL
  ...(d.image && { image: new URL(d.image, Astro.site).href }),
}
```

`mainEntityOfPage` uses the resolved canonical so the fallback page's structured data agrees with
its canonical tag rather than contradicting it.

### 4. `astro.config.mjs` — sitemap filter

Drop fallback German URLs from the sitemap. Google's guidance is not to list non-canonical URLs,
and `scripts/indexnow.mjs` scrapes `<loc>` values straight out of `dist/sitemap*.xml`, so this
one filter fixes both surfaces.

```js
import { readdirSync } from "node:fs"

const deSlugs = new Set(
  readdirSync("./src/content/blog/de")
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, "")),
)

sitemap({
  filter: (page) => {
    const m = new URL(page).pathname.match(/^\/de\/blog\/([^/]+)\/?$/)
    return !m || deSlugs.has(m[1])
  },
  i18n: { defaultLocale: "en", locales: { en: "en", de: "de" } },
})
```

Draft posts are already excluded upstream by `getStaticPaths`, so they never reach the sitemap and
need no handling here.

Config runs at build time in Node, so `readdirSync` is safe. The directory is guaranteed to exist
(12 posts live there); if that ever changes, the build should fail loudly rather than silently
publish duplicates.

## Verification

1. `pnpm build`, then confirm against `dist/`:
   - every `dist/blog/*.html` and `dist/de/blog/*.html` contains exactly one `rel="canonical"`;
   - each translated pair cross-references via `hreflang`.
2. Add a temporary English-only post, rebuild, and assert:
   - `dist/de/blog/<slug>/index.html` canonicals to `https://neoighodaro.com/blog/<slug>`;
   - `dist/sitemap-0.xml` contains `/blog/<slug>` but **not** `/de/blog/<slug>`.
   Then delete the temporary post.
3. `pnpm check` and `pnpm lint` clean.

## Follow-up (out of scope)

Keyword strategy for the Yulo cross-link: which queries neoighodaro.com should target so it
supports yulo.app rather than cannibalising it. Separate spec.
