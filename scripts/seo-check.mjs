// Asserts SEO invariants against the built site in dist/.
// Run after `astro build`. Exits non-zero with one line per violation.
import { readdirSync, readFileSync, statSync } from "node:fs"
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
