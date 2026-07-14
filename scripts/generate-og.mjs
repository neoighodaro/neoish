// Regenerates public/img/og.png — the default OpenGraph card (1200×630, the
// 1.91:1 ratio link previews expect). Reuses the landing masthead's design
// language: Anton display lines on ink, one outlined, the amber "(kinda.)" in
// Instrument Serif, and an explicit CTA row so link-preview scrapers detect a
// headline and call to action.
//
// Fonts are resolved through fontconfig, so Anton, Instrument Serif and Inter
// must be installed locally (e.g. in ~/.fonts) before running:
//   node scripts/generate-og.mjs
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

// sharp ships as a transitive dependency of astro; resolve it from astro's real
// location inside the pnpm store instead of adding a direct dependency for a
// one-off script. (The node_modules/astro symlink can't see astro's deps.)
const require = createRequire(import.meta.url)
const astroReal = require.resolve("astro/package.json", {
  paths: [fileURLToPath(new URL("../node_modules", import.meta.url))],
})
const sharp = createRequire(require("node:fs").realpathSync(astroReal))("sharp")

const W = 1200
const H = 630
const INK = "#0a0a0c"
const BONE = "#f2ede4"
const DIM = "rgba(242, 237, 228, 0.55)"
const SIGNAL = "#FFAF00"

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${INK}"/>

  <!-- top hairline labels, mirroring the site header -->
  <circle cx="72" cy="78" r="5" fill="${SIGNAL}"/>
  <text x="92" y="84" font-family="Inter" font-size="17" font-weight="500" letter-spacing="4" fill="${DIM}">NEO IGHODARO</text>
  <text x="${W - 72}" y="84" text-anchor="end" font-family="Inter" font-size="17" font-weight="500" letter-spacing="4" fill="${DIM}">HAMBURG, DE</text>

  <!-- masthead -->
  <text x="66" y="253" font-family="Anton" font-size="132" fill="${BONE}" letter-spacing="2">FOUNDER.</text>
  <text x="66" y="388" font-family="Anton" font-size="132" fill="none" stroke="${BONE}" stroke-width="2.5" letter-spacing="2">ENGINEER.</text>
  <text x="66" y="523" font-family="Anton" font-size="132" fill="${BONE}" letter-spacing="2">MUSIC MAKER</text>
  <text x="920" y="523" font-family="Instrument Serif" font-style="italic" font-size="72" fill="${SIGNAL}">(kinda.)</text>

  <!-- CTA row -->
  <rect x="72" y="571" width="10" height="10" fill="${SIGNAL}"/>
  <text x="98" y="581" font-family="Inter" font-size="17" font-weight="500" letter-spacing="4" fill="${BONE}">READ THE BLOG</text>
  <text x="${W - 72}" y="581" text-anchor="end" font-family="Inter" font-size="17" font-weight="500" letter-spacing="4" fill="${DIM}">NEOIGHODARO.COM</text>
</svg>`

const out = fileURLToPath(new URL("../public/img/og.png", import.meta.url))
await sharp(Buffer.from(svg), { density: 72 }).png().toFile(out)
const meta = await sharp(out).metadata()
console.log(`wrote ${out} — ${meta.width}x${meta.height}`)
