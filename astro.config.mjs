import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"
import { externalCanonicals, postIdForPath } from "./scripts/posts.mjs"

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
    }),
  ],
  markdown: {
    syntaxHighlight: false,
  },
})
