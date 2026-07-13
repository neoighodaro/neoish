import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://neoighodaro.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", de: "de" },
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
  },
})
