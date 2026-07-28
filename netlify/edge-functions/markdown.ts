// Markdown content negotiation for agents.
//
// When a client asks for markdown (`Accept: text/markdown`), serve the pre-built
// index.md sibling that scripts/agent-files.mjs wrote next to the page, as
// text/markdown. Browsers (which ask for text/html) are untouched and still get
// the HTML. Pages without a markdown variant fall through to the normal handler.
import type { Context } from "https://edge.netlify.com"

export default async (request: Request, context: Context) => {
  const accept = request.headers.get("accept") ?? ""
  // Only intervene when markdown is explicitly acceptable. `*/*` (curl, most
  // fetch defaults) is NOT a request for markdown — leave those as HTML.
  if (!/(^|,|\s)text\/markdown(\s*;|\s*,|$)/.test(accept)) return

  const url = new URL(request.url)
  let path = url.pathname
  if (path.endsWith(".md")) return // never negotiate the asset onto itself
  if (!path.endsWith("/")) path += "/"

  const res = await context.rewrite(new URL(`${path}index.md`, url.origin))
  if (res.status !== 200) return // no markdown variant here — serve HTML

  const headers = new Headers(res.headers)
  headers.set("content-type", "text/markdown; charset=utf-8")
  headers.set("vary", "Accept")
  return new Response(res.body, { status: 200, headers })
}
