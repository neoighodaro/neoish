import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

// One markdown file per post in src/content/blog/. The filename (minus .md)
// becomes the URL slug, e.g. using-laravel-at-scale.md -> /blog/using-laravel-at-scale
//
// Front-matter mirrors the shape of the real _posts on github.com/neoighodaro/neoish
// so existing posts can be dropped in with minimal editing.
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
    // Preserve the subdirectory in the id so English "foo" and German
    // "de/foo" stay distinct (parsePostId keys off the "de/" prefix). The
    // default generateId slugifies away the directory, collapsing both to
    // the same id and silently dropping one.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    // Optional override for the <title> tag; falls back to "<title> — Neo Ighodaro"
    seo_title: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    // Small eyebrow above the headline, e.g. "Engineering · Speaking".
    // Optional — templates fall back to the first tag when it's absent.
    category: z.string().optional(),
    // Comma-separated, as in the source posts: "laravel, optimisation"
    tags: z.string().optional(),
    reading_minutes: z.coerce.number().optional(),
    // Header image: absolute URL or a path under /public
    image: z.string().optional(),
    image_alt: z.string().optional(),
    image_caption: z.string().optional(),
    image_width: z.coerce.number().optional(),
    image_height: z.coerce.number().optional(),
    // Original URL slug from the source posts (kept for reference; the
    // filename is what actually drives the route).
    slug: z.string().optional(),
    // Set when the post was first published somewhere else (a client blog, a
    // publication) and this is the copy. That URL becomes the page's canonical,
    // so the post drops out of the sitemap and stops advertising hreflang —
    // search engines credit the original. scripts/posts.mjs parses this same
    // field out of the raw front-matter for the sitemap filter and SEO check,
    // and that parser only understands a plain one-line scalar.
    canonical: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
