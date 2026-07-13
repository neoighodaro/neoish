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

const isPost = (file) => /^dist\/(de\/)?blog\/.+\/index\.html$/.test(file)

// Given a page URL, the URL of its cross-language counterpart (same content,
// other language), or null if the URL isn't a page under this site at all
// (e.g. dist/404.html -> SITE/404.html has no /de/ counterpart worth pairing).
// General mapping: "/de/<rest>" <-> "/<rest>" — covers "/" <-> "/de/",
// "/blog/" <-> "/de/blog/", "/blog/<slug>/" <-> "/de/blog/<slug>/" (including
// nested slugs), and any future translated page type for free.
function counterpartUrl(loc) {
  const path = loc.slice(SITE.length)
  if (!path.endsWith("/")) return null
  return path.startsWith("/de/") ? `${SITE}${path.slice(3)}` : `${SITE}/de${path}`
}

const pages = htmlFiles(DIST)
const byUrl = new Map()
const htmlByUrl = new Map()

for (const file of pages) {
  const html = readFileSync(file, "utf8")
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1])

  if (canonicals.length !== 1) {
    fail(file, `expected exactly 1 canonical, found ${canonicals.length}`)
    continue
  }
  const canonical = canonicals[0]
  byUrl.set(urlFor(file), canonical)
  htmlByUrl.set(urlFor(file), html)

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

const locSet = new Set(locs)

for (const loc of locs) {
  const canonical = byUrl.get(loc)
  if (!canonical) {
    fail("sitemap-0.xml", `<loc> has no corresponding page in dist: ${loc}`)
  } else if (canonical !== loc) {
    fail("sitemap-0.xml", `non-canonical URL listed: ${loc} canonicals to ${canonical}`)
  }

  // If a page and its cross-language counterpart are BOTH in the sitemap, both
  // are genuinely translated and both must emit the full en/de/x-default
  // hreflang set, each pointing at the RIGHT target — presence alone isn't
  // enough, an inverted pair (en tag pointing at the German URL, or vice
  // versa) would still pass a presence-only check.
  const partner = counterpartUrl(loc)
  if (partner && locSet.has(partner)) {
    const html = htmlByUrl.get(loc) ?? ""
    const alts = new Map(
      [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    )
    const en = loc.includes("/de/") ? partner : loc
    const de = loc.includes("/de/") ? loc : partner
    for (const [hreflang, want] of [
      ["en", en],
      ["de", de],
      ["x-default", en],
    ]) {
      if (alts.get(hreflang) !== want) {
        fail(loc, `hreflang="${hreflang}" is ${alts.get(hreflang) ?? "missing"}, want ${want}`)
      }
    }
  }
}

// The inverse of the sitemap-canonical check above: every page that canonicals
// to itself must appear in the sitemap, so an over-broad filter (or any other
// bug) can't silently drop a real, canonical page out of the sitemap without
// failing the build. Pages that canonical elsewhere (the /de/ English-fallback
// pages) correctly canonical !== url and are skipped. 404.html is excluded
// explicitly — it is intentionally not part of the sitemap.
for (const [url, canonical] of byUrl) {
  if (url === `${SITE}/404.html`) continue
  if (canonical === url && !locSet.has(url)) {
    fail(url, "canonicals to itself but is missing from the sitemap")
  }
}

// Sitemap must not reference filtered-out URLs via hreflang alternates either.
for (const [, href] of sitemap.matchAll(/<xhtml:link[^>]+href="([^"]+)"/g)) {
  if (!locSet.has(href)) fail("sitemap-0.xml", `xhtml:link alternate points at a URL absent from the sitemap: ${href}`)
}

if (errors.length) {
  console.error(`\nSEO check failed — ${errors.length} violation(s):\n`)
  for (const e of errors) console.error(e)
  process.exit(1)
}
console.log(`SEO check passed — ${pages.length} pages, ${locs.length} sitemap URLs.`)
