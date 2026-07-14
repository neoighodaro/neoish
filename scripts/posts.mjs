// Front-matter facts about src/content/blog, read straight off disk.
//
// astro.config.mjs (sitemap filter) and scripts/seo-check.mjs (post-build SEO
// assertions) both need to know which posts are translated and which defer to an
// external canonical. Neither can use astro:content — the config is evaluated
// before the content layer exists, and the check runs against dist/ in a plain
// node process — so both read the front-matter directly, and they read it
// through here so they can never disagree about it.
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const BLOG_DIR = "src/content/blog"

// "de/foo.md" -> "de/foo": the same id the glob loader builds (see
// content.config.ts), so these keys line up with entry ids.
function postIds() {
  return (
    readdirSync(BLOG_DIR, { recursive: true })
      // recursive: true joins nested entries with the platform separator, so on
      // Windows a nested file would key as "de\foo" and never match a "de/foo"
      // lookup — normalise to "/" so the ids are platform-independent.
      .map((f) => f.replaceAll("\\", "/"))
      .filter((f) => f.endsWith(".md"))
      // Stray build output has a habit of landing under here (an .astro/, dist/ or
      // node_modules/ from a command run in the wrong cwd). None of it is content.
      .filter((f) => !/(^|\/)(\.[^/]+|dist|node_modules)\//.test(f))
      .map((f) => f.replace(/\.md$/, ""))
  )
}

const frontmatterOf = (id) => readFileSync(join(BLOG_DIR, `${id}.md`), "utf8").split(/^---$/m)[1] ?? ""

// YAML (js-yaml 4, core schema) parses draft as boolean true for any of these
// three casings — match them all, not just lowercase "true".
const isDraft = (fm) => /^draft:\s*(true|True|TRUE)\s*$/m.test(fm)

// A plain one-line scalar, optionally quoted. Zod's .url() has already rejected
// anything that isn't a real URL by the time a build gets this far.
const canonicalOf = (fm) => fm.match(/^canonical:\s*["']?(\S+?)["']?\s*$/m)?.[1] ?? null

const ids = postIds()

/** Slugs with a REAL (non-draft) German translation. */
export const translatedSlugs = new Set(
  ids.filter((id) => id.startsWith("de/") && !isDraft(frontmatterOf(id))).map((id) => id.slice(3)),
)

/**
 * Post id -> the external URL it was first published at. These posts are copies:
 * they canonical off-site, so they must stay out of the sitemap (Google's
 * guidance is to list only canonical URLs, and scripts/indexnow.mjs scrapes
 * <loc> straight out of the sitemap).
 */
export const externalCanonicals = new Map(
  ids.map((id) => [id, canonicalOf(frontmatterOf(id))]).filter(([, url]) => url !== null),
)

/**
 * The post id rendered at a given site path, or null if the path isn't a post.
 * A /de/blog/<slug>/ URL with no real translation serves the ENGLISH entry as a
 * fallback (see src/pages/de/blog/[...slug].astro), so it maps to the English id.
 */
export function postIdForPath(pathname) {
  const m = pathname.match(/^\/(de\/)?blog\/(.+?)\/?$/)
  if (!m) return null
  const [, de, slug] = m
  return de && translatedSlugs.has(slug) ? `de/${slug}` : slug
}
