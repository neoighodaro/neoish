import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://neoighodaro.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    syntaxHighlight: false,
  },
})
