export type Lang = "en" | "de"

export function parsePostId(id: string): { lang: Lang; slug: string } {
  if (id.startsWith("de/")) return { lang: "de", slug: id.slice(3) }
  return { lang: "en", slug: id }
}

export function toLocalePath(pathname: string, target: Lang): string {
  const isDe = pathname === "/de" || pathname.startsWith("/de/")
  const bare = isDe ? pathname.replace(/^\/de/, "") || "/" : pathname
  if (target === "en") return bare
  return bare === "/" ? "/de/" : `/de${bare}`
}
