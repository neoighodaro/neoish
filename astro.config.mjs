import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"

const DE_DIR = "./src/content/blog/de"

// Slugs that have a REAL (non-draft) German translation. Any other /de/blog/<slug>/
// route serves English fallback content and canonicals back to English, so it must
// not appear in the sitemap — Google's guidance is to list only canonical URLs, and
// scripts/indexnow.mjs scrapes <loc> straight out of the sitemap.
const translatedSlugs = new Set(
  readdirSync(DE_DIR, { recursive: true })
    .filter((f) => f.endsWith(".md"))
    .filter((f) => {
      const frontmatter = readFileSync(join(DE_DIR, f), "utf8").split(/^---$/m)[1] ?? ""
      // YAML (js-yaml 4, core schema) parses draft as boolean true for any of
      // these three casings — match them all, not just lowercase "true".
      return !/^draft:\s*(true|True|TRUE)\s*$/m.test(frontmatter)
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
        const m = new URL(page).pathname.match(/^\/de\/blog\/(.+?)\/?$/)
        return !m || translatedSlugs.has(m[1])
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
  },
})
