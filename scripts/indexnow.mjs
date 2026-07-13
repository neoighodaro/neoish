// Pings IndexNow (Bing, Yandex, et al.) with every URL in the built sitemap so
// search engines re-crawl changed pages fast. Runs after `astro build`; guarded
// to Netlify CI so local builds don't submit, and never fails the deploy.
import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

const SITE = "https://neoighodaro.com"
const HOST = "neoighodaro.com"
const KEY = "5d3a9e4f8e51d688ea7117babbe13f08"
const DIST = "dist"

if (!process.env.NETLIFY) {
  console.log("[indexnow] skipped (not a Netlify build)")
  process.exit(0)
}

const locs = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())

try {
  const files = (await readdir(DIST)).filter(
    (f) => f.startsWith("sitemap") && f.endsWith(".xml"),
  )
  const urls = new Set()
  for (const f of files) {
    const xml = await readFile(join(DIST, f), "utf8")
    for (const loc of locs(xml)) {
      if (loc.startsWith(SITE)) urls.add(loc)
    }
  }

  const urlList = [...urls]
  if (urlList.length === 0) {
    console.log("[indexnow] no URLs found in sitemap — nothing to submit")
    process.exit(0)
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  })
  console.log(`[indexnow] submitted ${urlList.length} URLs — HTTP ${res.status}`)
} catch (err) {
  console.warn(`[indexnow] submission skipped: ${err.message}`)
}
