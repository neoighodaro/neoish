import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"
import { externalCanonicals, lastmodById, latestLastmod, postIdForPath } from "./scripts/posts.mjs"

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
      //
      // A sitemap must list only canonical URLs, so drop every post page whose
      // canonical points somewhere else. Two ways that happens; scripts/seo-check.mjs
      // fails the build if this filter and the emitted <link rel="canonical"> ever
      // drift apart.
      filter: (page) => {
        const pathname = new URL(page).pathname
        const id = postIdForPath(pathname)
        if (!id) return true
        // A German URL serving the English entry as a fallback: canonicals to English.
        if (pathname.startsWith("/de/") && !id.startsWith("de/")) return false
        // First published elsewhere: canonicals off-site.
        return !externalCanonicals.has(id)
      },
      // Stamp <lastmod> so Google has an explicit freshness signal (the default
      // sitemap carries none). A post uses its own updated/date; the listing and
      // landing pages, whose content turns over as posts publish, use the newest
      // post date. Only URLs that survived the filter reach here, so the de
      // English-fallback pages never get a (misleading) lastmod.
      serialize: (item) => {
        const id = postIdForPath(new URL(item.url).pathname)
        const lastmod = id ? lastmodById.get(id) : latestLastmod
        if (lastmod) item.lastmod = lastmod
        return item
      },
    }),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      // Background pinned to --ink-2 in blog.css. github-dark is chosen for high
      // contrast: every token color is light and reads clearly on near-black, so
      // even mostly-plain shell blocks show visible comment/string/number colors.
      theme: "github-dark",
    },
  },
})
