import type { Lang } from "../lib/i18n"

export const defaultLang: Lang = "en"
export const languages: Record<Lang, string> = { en: "English", de: "Deutsch" }

export const ui = {
  en: {
    "nav.writing": "Writing",
    "nav.home": "Home",
    "head.writing": "Writing",
    "masthead.eyebrow": "Notes & essays",
    "masthead.title": "Writing",
    "runtime.post": "post",
    "runtime.posts": "posts",
    "runtime.updated": "Updated",
    "runtime.tagline": "Engineering · Building · Speaking",
    "feature.latest": "Latest",
    "feature.read": "Read the post",
    "index.archive": "The archive",
    "card.minRead": "min read",
    "card.min": "min",
    "archive.empty": "More on the way. This is where the back catalogue lands.",
    "foot.mark": "Writing",
    "foot.line": "Essays and notes by Neo Ighodaro — founder and engineer, building software for over two decades.",
    "foot.say": "Say hi",
    "foot.made": "Made at",
    "post.back": "Back to Writing",
    "post.backShort": "Writing",
    "post.minRead": "min read",
  },
  de: {
    "nav.writing": "Schreiben",
    "nav.home": "Start",
    "head.writing": "Schreiben",
    "masthead.eyebrow": "Notizen & Essays",
    "masthead.title": "Schreiben",
    "runtime.post": "Beitrag",
    "runtime.posts": "Beiträge",
    "runtime.updated": "Aktualisiert",
    "runtime.tagline": "Engineering · Aufbau · Vorträge",
    "feature.latest": "Neueste",
    "feature.read": "Beitrag lesen",
    "index.archive": "Das Archiv",
    "card.minRead": "Min. Lesezeit",
    "card.min": "Min.",
    "archive.empty": "Mehr ist unterwegs. Hier landet der Backkatalog.",
    "foot.mark": "Schreiben",
    "foot.line":
      "Essays und Notizen von Neo Ighodaro — Gründer und Ingenieur, der seit über zwei Jahrzehnten Software baut.",
    "foot.say": "Hallo sagen",
    "foot.made": "Gemacht bei",
    "post.back": "Zurück zum Schreiben",
    "post.backShort": "Schreiben",
    "post.minRead": "Min. Lesezeit",
  },
} as const

export type UIKey = keyof (typeof ui)["en"]

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui[defaultLang][key]
}
