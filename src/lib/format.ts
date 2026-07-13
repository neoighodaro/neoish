const PRETTY: Record<string, string> = {
  ipad: "iPad",
  vuejs: "VueJS",
  reactjs: "ReactJS",
  nextjs: "Next.js",
  inertiajs: "InertiaJS",
  javascript: "JavaScript",
  json: "JSON",
  api: "API",
  sql: "SQL",
  m1: "M1",
  mac: "Mac",
  macos: "macOS",
  "oh-my-zsh": "oh-my-zsh",
  zsh: "Zsh",
  xcode: "Xcode",
  fileheader: "FileHeader",
  "xcode templates": "Xcode Templates",
  laravel: "Laravel",
  eloquent: "Eloquent",
  macros: "Macros",
  docker: "Docker",
  alpine: "Alpine",
  sail: "Sail",
  git: "Git",
  bash: "Bash",
  jira: "Jira",
  swift: "Swift",
  "raspberry pi": "Raspberry Pi",
  server: "Server",
  terminal: "Terminal",
  automation: "Automation",
  deployment: "Deployment",
  development: "Development",
  components: "Components",
  "dynamic loading": "Dynamic Loading",
  conference: "Conference",
  speaking: "Speaking",
  optimisation: "Optimisation",
}

export function prettyTag(tag: string): string {
  const key = tag.trim().toLowerCase()
  return PRETTY[key] ?? tag.trim().replace(/\b\w/g, (c) => c.toUpperCase())
}

export function tagList(tags?: string): string[] {
  return (tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

export function categoryFor(data: { category?: string; tags?: string }): string {
  if (data.category) return data.category
  const first = tagList(data.tags)[0]
  return first ? prettyTag(first) : "Writing"
}

import type { Lang } from "./i18n"

const LOCALE_TAG: Record<Lang, string> = { en: "en-US", de: "de-DE" }

export function fmtDate(d: Date, lang: Lang, opts: Intl.DateTimeFormatOptions): string {
  return d.toLocaleDateString(LOCALE_TAG[lang], opts)
}
