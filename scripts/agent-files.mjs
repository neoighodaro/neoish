// Generates agent-facing artefacts into dist/ after `astro build`:
//   - a markdown variant (index.md) next to every built page we can represent
//     faithfully in markdown: each blog post (en + de), the blog indexes, and
//     the home pages. netlify/edge-functions/markdown.ts serves these when a
//     client sends `Accept: text/markdown`; a direct GET works too.
//   - /llms.txt, the machine-readable index of the site (https://llmstxt.org).
//
// Post markdown is the ORIGINAL source markdown (src/content/blog/<id>.md), not
// a re-render of the HTML — the source is already clean markdown, so agents get
// exactly what was written. postIdForPath() maps a built URL back to its source
// id, and it's the single source of truth for the en/de fallback rule (see
// scripts/posts.mjs), so this can never disagree with the sitemap or canonicals.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { externalCanonicals, postIdForPath } from "./posts.mjs"

const DIST = "dist"
const BLOG_DIR = "src/content/blog"
const SITE = "https://neoighodaro.com"

// dist/blog/foo/index.html -> https://neoighodaro.com/blog/foo/
const urlFor = (file) => `${SITE}${file.slice(DIST.length).replace(/index\.html$/, "")}`
const pathOf = (url) => url.slice(SITE.length)

// Every index.html under dist/, recursively.
function pageFiles(dir) {
  const out = []
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) out.push(...pageFiles(path))
    else if (name.name === "index.html") out.push(path)
  }
  return out
}

// Split a post's source file into { data, body }. Only the handful of fields we
// surface are pulled out; values are plain one-line scalars, optionally quoted.
function readPost(id) {
  const raw = readFileSync(join(BLOG_DIR, `${id}.md`), "utf8")
  const parts = raw.split(/^---$/m)
  const fm = parts[1] ?? ""
  const body = parts.slice(2).join("---").trim()
  const field = (name) => fm.match(new RegExp(`^${name}:\\s*["']?(.+?)["']?\\s*$`, "m"))?.[1] ?? null
  return {
    title: field("title") ?? id,
    description: field("description"),
    date: field("date")?.slice(0, 10) ?? null,
    readingMinutes: field("reading_minutes"),
    body,
  }
}

// Markdown document for a single post, from its source.
function postMarkdown(url, id) {
  const p = readPost(id)
  const meta = [p.date, p.readingMinutes && `${p.readingMinutes} min read`].filter(Boolean).join(" · ")
  const external = externalCanonicals.get(id)
  const lines = [`# ${p.title}`, ""]
  if (meta) lines.push(`*${meta}*`, "")
  if (p.description) lines.push(`> ${p.description}`, "")
  lines.push(external ? `_Originally published at ${external}_` : `_${url}_`, "", "---", "", p.body, "")
  return lines.join("\n")
}

// A `- [title](url): description` line for a post, for indexes and llms.txt.
function postLink(url, id) {
  const p = readPost(id)
  return `- [${p.title}](${url})${p.description ? `: ${p.description}` : ""}`
}

// The posts that render at each built URL, newest first, so every index agrees
// on ordering. Keyed by whether the URL lives under /de/.
function collectPosts(pages) {
  const posts = []
  for (const file of pages) {
    const url = urlFor(file)
    const m = pathOf(url).match(/^\/(de\/)?blog\/[^/]+\/$/)
    if (!m) continue
    const id = postIdForPath(pathOf(url))
    if (!id) continue
    posts.push({ file, url, id, de: Boolean(m[1]), date: readPost(id).date ?? "" })
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

const write = (file, contents) => {
  writeFileSync(file, contents)
  return file
}
const mdSibling = (htmlFile, contents) => write(join(dirname(htmlFile), "index.md"), contents)

const pages = pageFiles(DIST)
const posts = collectPosts(pages)
const written = []

// 1. Markdown for every post.
for (const { file, url, id } of posts) written.push(mdSibling(file, postMarkdown(url, id)))

// 2. Markdown for the blog indexes (en + de), each listing its own posts.
for (const de of [false, true]) {
  const indexHtml = join(DIST, de ? "de/blog" : "blog", "index.html")
  if (!pages.includes(indexHtml)) continue
  const list = posts.filter((p) => p.de === de).map((p) => postLink(p.url, p.id))
  const heading = de ? "# Blog\n\n> Beiträge von Neo Ighodaro." : "# Blog\n\n> Writing by Neo Ighodaro."
  written.push(mdSibling(indexHtml, `${heading}\n\n${list.join("\n")}\n`))
}

// 3. Markdown for the home pages (en + de). Concise, faithful to the landing copy.
const recent = (de) =>
  posts
    .filter((p) => p.de === de)
    .slice(0, 6)
    .map((p) => postLink(p.url, p.id))
    .join("\n")

const ALBUM = {
  apple: "https://music.apple.com/us/album/xoxo-black-sheep-feat-gamah-gammah-beyta-delta/6812189101",
  spotify: "https://open.spotify.com/album/3UgtUMSWtxw7wyJKPO8CeN",
  youtube: "https://music.youtube.com/playlist?list=OLAK5uy_k3uN-vkiBmIAW1ad_usI0lgAihMo9QcBA",
}

const homeEn = `# Neo Ighodaro

> Founder, tech lead and music maker based in Berlin.

I've been making things on the internet since 2004 — I started in design, fell in
love with code, and never really picked a lane. These days I lead software
engineering teams, build products end to end, draw on my iPad, and make music.
My latest album is **xoxo, black sheep**.

## Explore

- [Blog](${SITE}/blog/) — Laravel, PHP, JavaScript/TypeScript, AI agents, Docker and developer tooling
- [llms.txt](${SITE}/llms.txt) — machine-readable index of this site
- [Sitemap](${SITE}/sitemap.xml)

## Music
- **xoxo, black sheep** (2026): [Apple Music](${ALBUM.apple}) · [Spotify](${ALBUM.spotify}) · [YouTube Music](${ALBUM.youtube})

## Software
- **yulo** — AI practice for the Telc B1 German exam
- **mnml** — a beautifully simple audiobook player
- **void** — Pi-hole management from your iPhone

## Open source
- **little-sail** — a smaller runtime image for Laravel Sail
- **blvckhole** — declarative sandboxes for AI agents
- **early-access** — add an early-access mode to your Laravel app

## Recent writing
${recent(false)}
`

const homeDe = `# Neo Ighodaro

> Gründer, Tech Lead und Musikmacher mit Sitz in Berlin.

Ich baue seit 2004 Dinge im Internet — angefangen habe ich mit Design, habe mich
in Code verliebt und mich nie wirklich für eine Richtung entschieden. Heute leite
ich Software-Engineering-Teams, baue Produkte von A bis Z, zeichne auf meinem
iPad und mache Musik. Mein neuestes Album ist **xoxo, black sheep**.

## Entdecken

- [Blog](${SITE}/de/blog/) — Laravel, PHP, JavaScript/TypeScript, KI-Agenten, Docker und Entwickler-Tooling
- [llms.txt](${SITE}/llms.txt) — maschinenlesbarer Index dieser Website
- [Sitemap](${SITE}/sitemap.xml)

## Musik
- **xoxo, black sheep** (2026): [Apple Music](${ALBUM.apple}) · [Spotify](${ALBUM.spotify}) · [YouTube Music](${ALBUM.youtube})

## Aktuelle Beiträge
${recent(true)}
`

for (const [dir, contents] of [
  ["", homeEn],
  ["de", homeDe],
]) {
  const indexHtml = join(DIST, dir, "index.html")
  if (pages.includes(indexHtml)) written.push(mdSibling(indexHtml, contents))
}

// 4. /llms.txt — the machine-readable index of the whole site (English canon).
const llms = `# Neo Ighodaro

> Founder, tech lead and music maker based in Berlin. Writing on Laravel, PHP,
> JavaScript/TypeScript, AI agents, Docker and developer tooling. A German (de)
> translation of most content lives under /de/.

## Pages

- [Home](${SITE}/): who I am and what I build
- [Blog](${SITE}/blog/): all posts

## Posts

${posts
  .filter((p) => !p.de)
  .map((p) => postLink(p.url, p.id))
  .join("\n")}

## Optional

- [Sitemap](${SITE}/sitemap.xml)
- [German site](${SITE}/de/)
`
written.push(write(join(DIST, "llms.txt"), llms))

console.log(`Agent files written — ${written.length} file(s): llms.txt + ${written.length - 1} markdown variant(s).`)
