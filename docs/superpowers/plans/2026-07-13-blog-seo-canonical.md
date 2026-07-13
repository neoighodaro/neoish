# Blog SEO: Canonical, hreflang, OG & JSON-LD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every blog page assert exactly one correct canonical URL, so a post published without a German translation cannot split its ranking signals (or its outbound links) across two competing URLs.

**Architecture:** `BlogLayout.astro` grows an SEO head driven by optional props, defaulting to a self-referencing canonical. `PostLayout.astro` resolves the correct canonical per route by asking the content collection whether a German translation exists — when it doesn't, the `/de/` fallback page canonicals back to the English original. `astro.config.mjs` filters those fallback URLs out of the sitemap, which also removes them from IndexNow (the script scrapes the sitemap). A new `scripts/seo-check.mjs` asserts these invariants against `dist/` and is the test harness for every task.

**Tech Stack:** Astro 7.0.6 (static, directory build format), `@astrojs/sitemap` 3.7.3, TypeScript, Biome, pnpm 11.12.0.

## Global Constraints

- Site origin is `https://neoighodaro.com` (`astro.config.mjs:5`). Never hardcode it in `src/` — derive from `Astro.site`.
- **All canonical and hreflang URLs MUST end in a trailing slash.** The build uses Astro's default directory format and the sitemap emits `<loc>https://neoighodaro.com/blog/<slug>/</loc>`. A canonical without the trailing slash will not match its own sitemap entry.
- Locales are `en` (unprefixed) and `de` (under `/de/`). `x-default` points at the English URL, matching `LandingLayout.astro:35`.
- Post IDs carry the locale as a path prefix: `de/<slug>` for German, bare `<slug>` for English. Use `parsePostId` from `src/lib/i18n.ts` — never string-slice IDs by hand.
- A German post with `draft: true` does **not** count as a translation. `getStaticPaths` already filters drafts, so a draft translation means the `/de/` route serves English fallback content.
- There is no test runner in this repo. `scripts/seo-check.mjs` is the test harness; "run the tests" always means `pnpm build && node scripts/seo-check.mjs`.
- Lint with Biome (`pnpm lint`) and typecheck with `pnpm check` before every commit.

## File Structure

| File | Responsibility |
|---|---|
| `scripts/seo-check.mjs` | **Create.** Asserts SEO invariants against `dist/`. The test harness. |
| `src/layouts/BlogLayout.astro` | **Modify.** Emits canonical, hreflang, OG, Twitter, JSON-LD from optional props. |
| `src/layouts/PostLayout.astro` | **Modify.** Resolves the correct canonical/alternates per route; builds the `BlogPosting` object. |
| `astro.config.mjs` | **Modify.** Filters fallback `/de/blog/*` URLs out of the sitemap; drops sitemap-level `i18n`. |
| `package.json` | **Modify.** Adds the `seo:check` script. |

---

### Task 1: SEO check harness (fails against current build)

Write the harness first. It must go **red** against the current `dist/`, proving it actually detects the missing canonicals rather than vacuously passing.

**Files:**
- Create: `scripts/seo-check.mjs`
- Modify: `package.json` (scripts block)

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm seo:check` — exits `0` on pass, exits `1` and prints one `✗ <message>` line per violation on failure. Every later task is verified by this command.

- [ ] **Step 1: Write the failing test**

Create `scripts/seo-check.mjs`:

```js
// Asserts SEO invariants against the built site in dist/.
// Run after `astro build`. Exits non-zero with one line per violation.
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const DIST = "dist"
const SITE = "https://neoighodaro.com"
const errors = []
const fail = (file, msg) => errors.push(`✗ ${file}: ${msg}`)

// Every .html file under dist/, recursively.
function htmlFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) out.push(...htmlFiles(path))
    else if (name.endsWith(".html")) out.push(path)
  }
  return out
}

// dist/blog/foo/index.html -> https://neoighodaro.com/blog/foo/
const urlFor = (file) => `${SITE}${file.slice(DIST.length).replace(/index\.html$/, "")}`

const isPost = (file) => /^dist\/(de\/)?blog\/[^/]+\/index\.html$/.test(file)

const pages = htmlFiles(DIST)
const byUrl = new Map()

for (const file of pages) {
  const html = readFileSync(file, "utf8")
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1])

  if (canonicals.length !== 1) {
    fail(file, `expected exactly 1 canonical, found ${canonicals.length}`)
    continue
  }
  const canonical = canonicals[0]
  byUrl.set(urlFor(file), canonical)

  if (!canonical.startsWith(SITE)) fail(file, `canonical is not absolute on ${SITE}: ${canonical}`)
  if (!canonical.endsWith("/")) fail(file, `canonical must end in a trailing slash: ${canonical}`)

  if (!isPost(file)) continue

  for (const tag of ['property="og:title"', 'property="og:image"', 'name="twitter:card"']) {
    if (!html.includes(tag)) fail(file, `missing ${tag}`)
  }

  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!ld) {
    fail(file, "missing JSON-LD block")
  } else {
    try {
      const data = JSON.parse(ld[1])
      if (data["@type"] !== "BlogPosting") fail(file, `JSON-LD @type is ${data["@type"]}, want BlogPosting`)
      if (data.mainEntityOfPage !== canonical) {
        fail(file, `JSON-LD mainEntityOfPage (${data.mainEntityOfPage}) disagrees with canonical (${canonical})`)
      }
    } catch {
      fail(file, "JSON-LD does not parse as JSON")
    }
  }

  // hreflang must be self-consistent: if a de alternate is advertised, it must be a real page.
  for (const [, href] of html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)) {
    if (!byUrl.has(href) && !pages.some((p) => urlFor(p) === href)) {
      fail(file, `hreflang points at a URL that does not exist in dist: ${href}`)
    }
  }
}

// THE key invariant: the sitemap must never advertise a URL that canonicals elsewhere.
// This is what catches an English-only post duplicating at /de/blog/<slug>/, and it also
// guards IndexNow, which scrapes <loc> straight out of the sitemap.
const sitemap = readFileSync(join(DIST, "sitemap-0.xml"), "utf8")
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

for (const loc of locs) {
  const canonical = byUrl.get(loc)
  if (!canonical) {
    fail("sitemap-0.xml", `<loc> has no corresponding page in dist: ${loc}`)
  } else if (canonical !== loc) {
    fail("sitemap-0.xml", `non-canonical URL listed: ${loc} canonicals to ${canonical}`)
  }
}

// Sitemap must not reference filtered-out URLs via hreflang alternates either.
const locSet = new Set(locs)
for (const [, href] of sitemap.matchAll(/<xhtml:link[^>]+href="([^"]+)"/g)) {
  if (!locSet.has(href)) fail("sitemap-0.xml", `xhtml:link alternate points at a URL absent from the sitemap: ${href}`)
}

if (errors.length) {
  console.error(`\nSEO check failed — ${errors.length} violation(s):\n`)
  for (const e of errors) console.error(e)
  process.exit(1)
}
console.log(`SEO check passed — ${pages.length} pages, ${locs.length} sitemap URLs.`)
```

Add the script to `package.json`:

```json
"seo:check": "node scripts/seo-check.mjs"
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build && pnpm seo:check`

Expected: **FAIL**, exit 1, with a long list of `expected exactly 1 canonical, found 0` — one for every blog page. This is the bug, reproduced. (`dist/index.html` and `dist/de/index.html` should NOT appear; the landing pages already emit canonicals.)

- [ ] **Step 3: Commit the failing harness**

```bash
git add scripts/seo-check.mjs package.json
git commit -m "test: add SEO invariant check (currently failing)"
```

---

### Task 2: SEO head in `BlogLayout`

**Files:**
- Modify: `src/layouts/BlogLayout.astro:7-17` (props + frontmatter) and `:21-37` (head)

**Interfaces:**
- Consumes: nothing.
- Produces: `BlogLayout` accepts these new optional props, used by Task 3:
  - `canonical?: URL` — defaults to the current path with a trailing slash.
  - `alternates?: { en: URL; de: URL } | null` — `null` (default) emits no hreflang.
  - `image?: URL` — defaults to `/img/og.png`.
  - `ogType?: "website" | "article"` — defaults to `"website"`.
  - `publishedTime?: Date` — emits `article:published_time` when present.
  - `jsonLd?: object` — serialized into a `<script type="application/ld+json">` when present.

- [ ] **Step 1: Replace the props block and frontmatter**

Replace `src/layouts/BlogLayout.astro` lines 7-17 with:

```astro
interface Props {
  title: string
  description?: string
  progress?: boolean
  lang?: Lang
  canonical?: URL
  alternates?: { en: URL; de: URL } | null
  image?: URL
  ogType?: "website" | "article"
  publishedTime?: Date
  jsonLd?: object
}

// The build uses Astro's directory format and the sitemap emits trailing slashes,
// so the canonical has to carry one too or it won't match its own <loc>.
const withSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`)

const {
  title,
  description = "",
  progress = false,
  lang = "en",
  canonical = new URL(withSlash(Astro.url.pathname), Astro.site),
  alternates = null,
  image = new URL("/img/og.png", Astro.site),
  ogType = "website",
  publishedTime,
  jsonLd,
} = Astro.props
const t = useTranslations(lang)
const pathname = Astro.url.pathname
---
```

- [ ] **Step 2: Add the tags to `<head>`**

In `src/layouts/BlogLayout.astro`, immediately after `<meta name="description" content={description} />`, insert:

```astro
    <link rel="canonical" href={canonical} />
    {alternates && (
      <>
        <link rel="alternate" hreflang="en" href={alternates.en} />
        <link rel="alternate" hreflang="de" href={alternates.de} />
        <link rel="alternate" hreflang="x-default" href={alternates.en} />
      </>
    )}

    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:locale" content={lang === "de" ? "de_DE" : "en_US"} />
    {publishedTime && <meta property="article:published_time" content={publishedTime.toISOString()} />}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    {jsonLd && <script type="application/ld+json" is:inline set:html={JSON.stringify(jsonLd)} />}
```

- [ ] **Step 3: Run the check — expect partial progress**

Run: `pnpm build && pnpm seo:check`

Expected: **FAIL**, but the `found 0` canonical errors are gone. Remaining failures are on post pages only: `missing JSON-LD block`, and `non-canonical URL listed` is *not* yet expected (all 12 posts are translated, so no fallback exists yet). Post pages will still fail on JSON-LD until Task 3.

- [ ] **Step 4: Typecheck, lint, commit**

```bash
pnpm check && pnpm lint
git add src/layouts/BlogLayout.astro
git commit -m "feat: add canonical, hreflang, OG and Twitter tags to BlogLayout"
```

---

### Task 3: Canonical resolution + JSON-LD in `PostLayout`

This is the task that closes the duplicate-content hole.

**Files:**
- Modify: `src/layouts/PostLayout.astro:1-24`

**Interfaces:**
- Consumes: the `BlogLayout` props from Task 2.
- Produces: correct per-route canonical/alternates. Table of intended output:

| Route | German translation? | canonical | hreflang |
|---|---|---|---|
| `/blog/<slug>/` | yes | `/blog/<slug>/` | en + de + x-default |
| `/blog/<slug>/` | no | `/blog/<slug>/` | none |
| `/de/blog/<slug>/` | yes | `/de/blog/<slug>/` | en + de + x-default |
| `/de/blog/<slug>/` | **no** (English fallback) | **`/blog/<slug>/`** | none |

- [ ] **Step 1: Extend the frontmatter**

Replace `src/layouts/PostLayout.astro` lines 1-22 with:

```astro
---
import { type CollectionEntry, getEntry } from "astro:content"
import { useTranslations } from "../i18n/ui"
import { categoryFor, fmtDate, prettyTag, tagList } from "../lib/format"
import { type Lang, parsePostId } from "../lib/i18n"
import BlogLayout from "./BlogLayout.astro"

interface Props {
  post: CollectionEntry<"blog">
  lang?: Lang
}

const { post, lang = "en" } = Astro.props
const t = useTranslations(lang)
const d = post.data

const dateStr = fmtDate(d.date, lang, { year: "numeric", month: "short", day: "numeric" })
const tags = tagList(d.tags)
const category = categoryFor(d)
const blogHref = lang === "de" ? "/de/blog" : "/blog"
const homeHref = lang === "de" ? "/de/" : "/"

// On the /de/ fallback route, `post` is the ENGLISH entry while `lang` is "de".
// That mismatch is exactly what we key off: it means we are serving English content
// at a German URL, so all signals must point back at the English original.
// A draft German translation does not count — getStaticPaths filters drafts, so the
// /de/ route falls back to English in that case too.
const { slug } = parsePostId(post.id)
const deEntry = await getEntry("blog", `de/${slug}`)
const hasDe = Boolean(deEntry && !deEntry.data.draft)

const enUrl = new URL(`/blog/${slug}/`, Astro.site)
const deUrl = new URL(`/de/blog/${slug}/`, Astro.site)
const canonical = lang === "de" && hasDe ? deUrl : enUrl
const alternates = hasDe ? { en: enUrl, de: deUrl } : null

const seoTitle = d.seo_title ?? `${d.title} — Neo Ighodaro`
// Frontmatter carries both absolute S3 URLs and site-relative paths; URL() handles both.
const ogImage = d.image ? new URL(d.image, Astro.site) : new URL("/img/og.png", Astro.site)

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: d.title,
  description: d.description,
  datePublished: d.date.toISOString(),
  author: { "@type": "Person", name: "Neo Ighodaro", url: "https://neoighodaro.com" },
  // The resolved canonical, not the current URL — otherwise the fallback page's
  // structured data would contradict its own canonical tag.
  mainEntityOfPage: canonical.href,
  ...(d.image && { image: ogImage.href }),
}
---
```

- [ ] **Step 2: Pass the props to `BlogLayout`**

Replace the opening `<BlogLayout ...>` tag (was line 24):

```astro
<BlogLayout
  title={seoTitle}
  description={d.description}
  progress={true}
  lang={lang}
  canonical={canonical}
  alternates={alternates}
  image={ogImage}
  ogType="article"
  publishedTime={d.date}
  jsonLd={jsonLd}
>
```

- [ ] **Step 3: Run the check — expect green**

Run: `pnpm build && pnpm seo:check`

Expected: **PASS.** `SEO check passed — N pages, 28 sitemap URLs.` All 12 posts are translated, so every page canonicals to itself and every pair cross-references.

If `xhtml:link alternate points at a URL absent from the sitemap` appears, that is Task 4's problem — proceed.

- [ ] **Step 4: Typecheck, lint, commit**

```bash
pnpm check && pnpm lint
git add src/layouts/PostLayout.astro
git commit -m "fix: canonical /de/ fallback posts back to their English original"
```

---

### Task 4: Keep fallback URLs out of the sitemap and IndexNow

Task 3 fixed the page. The sitemap still *advertises* the fallback URL, and `scripts/indexnow.mjs` scrapes `<loc>` values straight out of it — so without this task, a duplicate URL is actively pushed to Bing on every deploy.

Also drop the sitemap integration's `i18n` option. It emits its own `xhtml:link` hreflang pairs (confirmed in the current `dist/sitemap-0.xml`), which would contradict the filter below by advertising a de alternate for a URL we just removed. Page-level hreflang from Task 2 is a complete and sufficient signal on its own, and it has one source of truth.

**Files:**
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: a sitemap containing only canonical URLs. `scripts/indexnow.mjs` needs no change — it inherits the fix.

- [ ] **Step 1: Write the failing test — add a temporary English-only post**

Create `src/content/blog/zz-seo-fixture.md` (deliberately no German counterpart):

```markdown
---
title: "SEO Fixture"
description: "Temporary fixture proving an untranslated post does not duplicate. Delete me."
date: "2026-07-13 00:00:00"
tags: test
---

Temporary fixture. This post exists only to prove the /de/ fallback does not duplicate.
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `pnpm build && pnpm seo:check`

Expected: **FAIL** with exactly this class of error, proving the bug is real and the harness catches it:

```
✗ sitemap-0.xml: non-canonical URL listed: https://neoighodaro.com/de/blog/zz-seo-fixture/ canonicals to https://neoighodaro.com/blog/zz-seo-fixture/
```

(Task 3 means the page itself now canonicals correctly. This failure is purely the sitemap still listing it.)

- [ ] **Step 3: Add the filter and drop sitemap i18n**

Replace `astro.config.mjs` in full:

```js
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"

const DE_DIR = "./src/content/blog/de"

// Slugs that have a REAL (non-draft) German translation. Any other /de/blog/<slug>/
// route serves English fallback content and canonicals back to English, so it must
// not appear in the sitemap — Google's guidance is to list only canonical URLs, and
// scripts/indexnow.mjs scrapes <loc> straight out of the sitemap.
const translatedSlugs = new Set(
  readdirSync(DE_DIR)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => {
      const frontmatter = readFileSync(join(DE_DIR, f), "utf8").split(/^---$/m)[1] ?? ""
      return !/^draft:\s*true\s*$/m.test(frontmatter)
    })
    .map((f) => f.replace(/\.md$/, "")),
)

export default defineConfig({
  site: "https://neoighodaro.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // No `i18n` option here on purpose: it would emit its own xhtml:link hreflang
      // pairs, including for the fallback URLs this filter removes. Page-level
      // hreflang in BlogLayout is the single source of truth.
      filter: (page) => {
        const m = new URL(page).pathname.match(/^\/de\/blog\/([^/]+)\/?$/)
        return !m || translatedSlugs.has(m[1])
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
  },
})
```

- [ ] **Step 4: Run the check to verify it passes**

Run: `pnpm build && pnpm seo:check`

Expected: **PASS.** Then confirm the fixture's German URL is gone from the sitemap but its English URL is present:

```bash
grep -c 'de/blog/zz-seo-fixture' dist/sitemap-0.xml   # expect 0
grep -c '/blog/zz-seo-fixture'    dist/sitemap-0.xml   # expect 1
```

The page `dist/de/blog/zz-seo-fixture/index.html` must still exist (the `Language=de` 302 in `public/_redirects` needs a live target) — it is simply not advertised:

```bash
test -f dist/de/blog/zz-seo-fixture/index.html && echo "fallback page still served"
```

- [ ] **Step 5: Remove the fixture and re-verify**

```bash
rm src/content/blog/zz-seo-fixture.md
pnpm build && pnpm seo:check
```

Expected: **PASS**, back to the 12 real posts.

- [ ] **Step 6: Typecheck, lint, commit**

```bash
pnpm check && pnpm lint
git add astro.config.mjs
git commit -m "fix: exclude untranslated /de/ fallback URLs from sitemap and IndexNow"
```

---

### Task 5: Wire the check into the build

Make the regression permanent. `scripts/indexnow.mjs` is gated on `process.env.NETLIFY` and wrapped in try/catch so it never fails a deploy; the SEO check is the opposite — it *should* fail the deploy, because shipping a duplicate URL is worse than shipping nothing.

**Files:**
- Modify: `package.json` (build script)

**Interfaces:**
- Consumes: `pnpm seo:check` from Task 1.
- Produces: a build that refuses to publish a non-canonical URL.

- [ ] **Step 1: Chain the check into `build`**

In `package.json`, change the `build` script so the check runs after the build but before IndexNow submission — there is no point telling Bing about URLs that just failed validation:

```json
"build": "astro build && node scripts/seo-check.mjs && node scripts/indexnow.mjs"
```

- [ ] **Step 2: Verify the full build passes**

Run: `pnpm build`

Expected: build succeeds, `SEO check passed — N pages, 28 sitemap URLs.` printed before the IndexNow step. (IndexNow is skipped locally — it is gated on `process.env.NETLIFY`.)

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "build: fail the build on SEO invariant violations"
```

---

## Verification

Full green run from a clean tree:

```bash
pnpm install
pnpm build      # runs astro build -> seo-check -> indexnow(skipped locally)
pnpm check
pnpm lint
```

Then spot-check one post by eye:

```bash
grep -oE '<link rel="(canonical|alternate)"[^>]*>' dist/blog/6-reorganising-inertia-js-pages/index.html
```

Expected: one canonical to `https://neoighodaro.com/blog/6-reorganising-inertia-js-pages/`, plus `en`, `de`, and `x-default` alternates.

## Out of scope

Keyword strategy and the Yulo cross-link post. Tracked separately — see the follow-up section of `docs/superpowers/specs/2026-07-13-blog-seo-canonical-design.md`. This plan is the prerequisite: it guarantees the linking post publishes as exactly one indexable URL, so the outbound link to yulo.app is not split across two.
