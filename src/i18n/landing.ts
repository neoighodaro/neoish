// All human-readable copy on the landing page, per locale. Branded and
// technical strings (names, tech stacks, track titles) are identical across
// locales and live in the markup, not here. Values ending in `Html` contain
// trusted inline markup and are rendered with set:html.

export interface LandingCopy {
  meta: { title: string; description: string }
  nav: { blog: string }
  audio: { soundOff: string; soundOn: string; ariaMute: string; ariaUnmute: string; ariaInitial: string }
  hero: {
    srHeading: string
    founder: string
    engineer: string
    musicMaker: string
    kinda: string
    status: string
    scroll: string
  }
  manifesto: { note: string; copyHtml: string }
  brain: {
    engineering: { title: string; sub: string; body: string }
    design: { title: string; sub: string; body: string }
    gaming: { title: string; sub: string; body: string }
    music: { title: string; sub: string; body: string }
  }
  software: { reelNo: string; title: string; note: string; yulo: string; mnml: string; voidApp: string }
  oss: {
    reelNo: string
    title: string
    note: string
    dotfiles: string
    littleSail: string
    blvckhole: string
    earlyAccess: string
    zellijBookmarks: string
    zjstatusHints: string
  }
  flip: {
    captionBefore: string
    captionAfter: string
    frontLabel: string
    frontFoot: string
    backLabel: string
    backFoot: string
  }
  tracklist: {
    heading: string
    sub: string
    note: string
    albumAlt: string
    storySummary: string
    trk0Story: string
    trk0AriaPlay: string
    trk0AriaPause: string
    trk1AriaDisabled: string
    trk1TitleDisabled: string
    spotify: string
  }
  footer: { sayHi: string; madeWithHtml: string }
}

export type LandingRuntime = {
  soundOff: string
  soundOn: string
  ariaMute: string
  ariaUnmute: string
  flipBefore: string
  flipAfter: string
  clipAriaPlay: string
  clipAriaPause: string
}

const en: LandingCopy = {
  meta: {
    title: "Neo Ighodaro — Midnight Pressing",
    description: "Neo Ighodaro — founder, engineer and music maker. Software, open source and the b l v c k record.",
  },
  nav: { blog: "Blog" },
  audio: {
    soundOff: "sound off",
    soundOn: "sound on",
    ariaMute: "Mute the b l v c k loop",
    ariaUnmute: "Unmute the b l v c k loop",
    ariaInitial: "Unmute the b l v c k loop",
  },
  hero: {
    srHeading: "Neo Ighodaro — founder, engineer and music maker based in Berlin",
    founder: "Founder",
    engineer: "Engineer",
    musicMaker: "Music Maker",
    kinda: "(kinda.)",
    status: "Open to select projects",
    scroll: "(scroll)",
  },
  manifesto: {
    note: "&darr; over two decades of this",
    copyHtml:
      'I&rsquo;ve been making things on the internet since <span class="hl">2004</span>. I started with <span class="hl">design,</span> fell in love with <span class="hl">code,</span> and never really picked a lane. These days I lead <span class="hl">software engineering</span> teams, build products end-to-end, draw on my iPad, lose at FIFA, and make <span class="hand">music.</span>',
  },
  brain: {
    engineering: {
      title: "Engineering",
      sub: "Architecting solutions",
      body: "With over 22 years of experience, I enjoy solving problems using software.",
    },
    design: {
      title: "Art &amp; Design",
      sub: "Art &bull; UX &bull; UI",
      body: "Coming from a family full of artists, and starting my tech journey in design, I enjoy creating art, user experiences and designs.",
    },
    gaming: {
      title: "Couch Gamer",
      sub: "PS5 &bull; Steam Deck",
      body: "I just enjoy playing games in my spare time. Some of my favorites: Ghost of Tsushima, Horizon Forbidden West, and FIFA.",
    },
    music: {
      title: "Music!",
      sub: "Music gives me life",
      body: "Deep down, I want to retire early, listen to music, and sip champagne on a Yatch (aspiring house husband) &#x1F6E5;&#xFE0F;.",
    },
  },
  software: {
    reelNo: "Reel 01",
    title: "Software",
    note: "— some things I&rsquo;ve shipped",
    yulo: "AI practice for the Telc B1 German exam.",
    mnml: "A beautifully simple audiobook player.",
    voidApp: "Pi-hole management from your iPhone.",
  },
  oss: {
    reelNo: "Reel 02",
    title: "Open source",
    note: "— code left open on purpose",
    dotfiles: "My dotfiles.",
    littleSail: "A smaller runtime image for Laravel Sail.",
    blvckhole: "Declarative sandboxes for AI agents.",
    earlyAccess: "Add early access mode to your Laravel application.",
    zellijBookmarks: "Command bookmarks for the Zellij terminal.",
    zjstatusHints: "Key binding hints for zjstatus.",
  },
  flip: {
    captionBefore: "flip the tape →",
    captionAfter: "…now for the good part",
    frontLabel: "neo &mdash; the work",
    frontFoot: "low noise &middot; high output",
    backLabel: "b l v c k &mdash; 2026",
    backFoot: "play loud &middot; rewind often",
  },
  tracklist: {
    heading: "Side B",
    sub: "the music",
    note: "The b l v c k sessions, recorded 2026.",
    albumAlt: "Album art for b l v c k by Neo",
    storySummary: "the story",
    trk0Story:
      "This song encompasses the feelings I had moving from my hometown in Lagos to an entirely new country in Hamburg, and how I held conflicting feelings about it all at once.",
    trk0AriaPlay: "Play a preview of schrödingers immigrant",
    trk0AriaPause: "Pause preview of schrödingers immigrant",
    trk1AriaDisabled: "Preview of undone isn't available yet",
    trk1TitleDisabled: "No preview yet — listen on Spotify",
    spotify: "Play on Spotify",
  },
  footer: {
    sayHi: "Say Hi",
    madeWithHtml: 'Made with &hearts; at <a href="http://ck.team" target="_blank" rel="noreferrer">CreativityKills</a>',
  },
}

const de: LandingCopy = {
  meta: {
    title: "Neo Ighodaro — Midnight Pressing",
    description: "Neo Ighodaro — Gründer, Ingenieur und Musikmacher. Software, Open Source und die b l v c k Platte.",
  },
  nav: { blog: "Blog" },
  audio: {
    soundOff: "Ton aus",
    soundOn: "Ton an",
    ariaMute: "Den b l v c k Loop stummschalten",
    ariaUnmute: "Den b l v c k Loop einschalten",
    ariaInitial: "Den b l v c k Loop einschalten",
  },
  hero: {
    srHeading: "Neo Ighodaro — Gründer, Ingenieur und Musikmacher mit Sitz in Berlin",
    founder: "Gründer",
    engineer: "Ingenieur",
    musicMaker: "Musikmacher",
    kinda: "(so halb.)",
    status: "Offen für ausgewählte Projekte",
    scroll: "(scrollen)",
  },
  manifesto: {
    note: "&darr; seit über zwei Jahrzehnten",
    copyHtml:
      'Ich baue seit <span class="hl">2004</span> Dinge im Internet. Angefangen habe ich mit <span class="hl">Design,</span> habe mich in <span class="hl">Code</span> verliebt und mich nie wirklich für eine Richtung entschieden. Heute leite ich <span class="hl">Software-Engineering</span>-Teams, baue Produkte von A bis Z, zeichne auf meinem iPad, verliere bei FIFA und mache <span class="hand">Musik.</span>',
  },
  brain: {
    engineering: {
      title: "Engineering",
      sub: "Lösungen entwerfen",
      body: "Mit über 22 Jahren Erfahrung löse ich Probleme am liebsten mit Software.",
    },
    design: {
      title: "Kunst &amp; Design",
      sub: "Kunst &bull; UX &bull; UI",
      body: "Ich komme aus einer Familie voller Künstler und habe meine Tech-Reise im Design begonnen — ich gestalte gerne Kunst, User Experiences und Designs.",
    },
    gaming: {
      title: "Couch-Gamer",
      sub: "PS5 &bull; Steam Deck",
      body: "Ich spiele in meiner Freizeit einfach gerne. Einige meiner Favoriten: Ghost of Tsushima, Horizon Forbidden West und FIFA.",
    },
    music: {
      title: "Musik!",
      sub: "Musik gibt mir Leben",
      body: "Tief im Inneren will ich früh in Rente gehen, Musik hören und auf einer Yacht Champagner schlürfen (angehender Hausmann) &#x1F6E5;&#xFE0F;.",
    },
  },
  software: {
    reelNo: "Reel 01",
    title: "Software",
    note: "— ein paar Dinge, die ich veröffentlicht habe",
    yulo: "KI-Übungen für die Telc-B1-Deutschprüfung.",
    mnml: "Ein wunderbar einfacher Hörbuch-Player.",
    voidApp: "Pi-hole-Verwaltung von deinem iPhone aus.",
  },
  oss: {
    reelNo: "Reel 02",
    title: "Open Source",
    note: "— Code, absichtlich offen gelassen",
    dotfiles: "Meine Dotfiles.",
    littleSail: "Ein kleineres Runtime-Image für Laravel Sail.",
    blvckhole: "Deklarative Sandboxes für KI-Agenten.",
    earlyAccess: "Füge deiner Laravel-Anwendung einen Early-Access-Modus hinzu.",
    zellijBookmarks: "Befehls-Lesezeichen für das Zellij-Terminal.",
    zjstatusHints: "Tastenkürzel-Hinweise für zjstatus.",
  },
  flip: {
    captionBefore: "dreh die Kassette →",
    captionAfter: "…jetzt kommt der gute Teil",
    frontLabel: "neo &mdash; die Arbeit",
    frontFoot: "wenig Rauschen &middot; hohe Leistung",
    backLabel: "b l v c k &mdash; 2026",
    backFoot: "laut spielen &middot; oft zurückspulen",
  },
  tracklist: {
    heading: "Side B",
    sub: "die Musik",
    note: "Die b l v c k Sessions, aufgenommen 2026.",
    albumAlt: "Albumcover für b l v c k von Neo",
    storySummary: "die Geschichte",
    trk0Story:
      "Dieser Song fängt die Gefühle ein, die ich beim Umzug aus meiner Heimatstadt Lagos in ein völlig neues Land nach Hamburg hatte — und wie ich all diese widersprüchlichen Gefühle gleichzeitig empfand.",
    trk0AriaPlay: "Eine Vorschau von schrödingers immigrant abspielen",
    trk0AriaPause: "Vorschau von schrödingers immigrant pausieren",
    trk1AriaDisabled: "Vorschau von undone ist noch nicht verfügbar",
    trk1TitleDisabled: "Noch keine Vorschau — auf Spotify anhören",
    spotify: "Auf Spotify anhören",
  },
  footer: {
    sayHi: "Sag Hallo",
    madeWithHtml:
      'Mit &hearts; erstellt bei <a href="http://ck.team" target="_blank" rel="noreferrer">CreativityKills</a>',
  },
}

export const landing = { en, de }

export function landingRuntime(lang: "en" | "de"): LandingRuntime {
  const c = landing[lang]
  return {
    soundOff: c.audio.soundOff,
    soundOn: c.audio.soundOn,
    ariaMute: c.audio.ariaMute,
    ariaUnmute: c.audio.ariaUnmute,
    flipBefore: c.flip.captionBefore,
    flipAfter: c.flip.captionAfter,
    clipAriaPlay: c.tracklist.trk0AriaPlay,
    clipAriaPause: c.tracklist.trk0AriaPause,
  }
}
