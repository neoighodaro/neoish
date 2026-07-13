  const L = (typeof window !== "undefined" && window.__LANDING_I18N__) || {}

  document.documentElement.classList.add("js", "is-loading")

  // preview clip for "schrödingers immigrant" (runs in every mode)
  const clipBtn = document.getElementById("clip-btn")
  const clipAudio = document.getElementById("clip-audio")
  if (clipBtn && clipAudio) {
    const PLAY = "▶", PAUSE = "⏸"
    const artWindow = document.querySelector(".tracklist .art-window")
    const disc = artWindow && artWindow.querySelector(".disc")
    const canSpin = disc && window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches
    let spinTween = null

    const spinUp = () => {
      if (!artWindow) return
      artWindow.classList.add("spinning")
      if (!canSpin) return
      if (spinTween) spinTween.kill()
      // ease the platter up to speed, then hold a steady infinite spin
      spinTween = gsap.timeline()
      spinTween.fromTo(disc, { rotation: 0 }, { rotation: 360, duration: 2.4, ease: "power1.in" })
        .to(disc, { rotation: "+=360", duration: 3.2, ease: "none", repeat: -1 })
    }
    const spinDown = () => {
      if (!artWindow) return
      if (!canSpin) { artWindow.classList.remove("spinning"); return }
      if (spinTween) { spinTween.kill(); spinTween = null }
      const cur = Number(gsap.getProperty(disc, "rotation")) || 0
      const settle = Math.ceil(cur / 360) * 360
      gsap.to(disc, {
        rotation: settle, duration: 0.9, ease: "power2.out",
        onComplete() { artWindow.classList.remove("spinning"); gsap.set(disc, { rotation: 0 }) },
      })
    }

    clipBtn.addEventListener("click", () => {
      if (clipAudio.paused) { clipAudio.currentTime = 0; clipAudio.play() }
      else { clipAudio.pause() }
    })
    clipAudio.addEventListener("play", () => {
      clipBtn.textContent = PAUSE
      clipBtn.classList.add("is-playing")
      clipBtn.setAttribute("aria-label", L.clipAriaPause || "Pause preview of schrödingers immigrant")
      spinUp()
    })
    const reset = () => {
      clipBtn.textContent = PLAY
      clipBtn.classList.remove("is-playing")
      clipBtn.setAttribute("aria-label", L.clipAriaPlay || "Play a preview of schrödingers immigrant")
      spinDown()
    }
    clipAudio.addEventListener("pause", reset)
    clipAudio.addEventListener("ended", reset)
  }

  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches

  // ---------- matrix decode on hover over the "engineer" jumbo line (from v0.x) ----------
  ;(function () {
    const el = document.querySelector("[data-scramble]")
    if (!el || REDUCED) return
    const target = el.dataset.scramble
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&*<>/\\{}[]"
    const rand = (n) => (Math.random() * n) | 0
    let running = false
    el.addEventListener("mouseenter", () => {
      if (running) return
      running = true
      el.classList.add("is-decoding")
      let frame = 0
      const step = () => {
        let out = "", locked = 0
        for (let i = 0; i < target.length; i++) {
          if (target[i] === " ") { out += " "; locked++; continue }
          const settleAt = i * 3 + 9 // each letter locks a few frames after the one before it
          if (frame >= settleAt) { out += target[i]; locked++ }
          else out += glyphs[rand(glyphs.length)]
        }
        el.textContent = out
        frame++
        if (locked < target.length) requestAnimationFrame(step)
        else { el.textContent = target; el.classList.remove("is-decoding"); running = false }
      }
      step()
    })
  })()

  // ---------- full-screen katakana matrix rain, shown behind the "engineering" card on hover (from v0.x) ----------
  const matrixRain = (function () {
    const canvas = document.querySelector(".brain-matrix")
    const ctx = canvas && canvas.getContext("2d")
    if (!ctx || REDUCED) return { start() {}, stop() {} }
    const glyphs =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const STEP = 20 // px between columns / glyph drop
    let cols = [], cssW = 0, cssH = 0, raf = 0, last = 0, running = false

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect() // fills the pinned screen
      cssW = r.width; cssH = r.height
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = "15pt monospace"
      const n = Math.floor(cssW / STEP) + 1
      cols = Array.from({ length: n }, () => (Math.random() * cssH) | 0)
    }
    function frame(t) {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (t - last < 33) return // ~30fps, matches the original
      last = t
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)" // trailing fade
      ctx.fillRect(0, 0, cssW, cssH)
      ctx.fillStyle = "#00ff41"
      for (let i = 0; i < cols.length; i++) {
        ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * STEP, cols[i])
        cols[i] = cols[i] > cssH && Math.random() > 0.975 ? 0 : cols[i] + STEP
      }
    }
    window.addEventListener("resize", () => { if (running) size() })
    return {
      start() {
        if (running) return
        size(); running = true; last = 0
        raf = requestAnimationFrame(frame)
      },
      stop() {
        running = false
        cancelAnimationFrame(raf)
      },
    }
  })()

  if (REDUCED || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("static")
  } else {
    gsap.registerPlugin(ScrollTrigger)

    // ---------- cursor ----------
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const cursor = document.querySelector(".cursor")
      const cx = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" })
      const cy = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" })
      addEventListener("pointermove", (e) => { cx(e.clientX); cy(e.clientY) })
      document.querySelectorAll("a, button").forEach((el) => {
        if (el.classList.contains("repo-card")) return
        el.addEventListener("pointerenter", () => gsap.to(cursor, { scale: 3.2, duration: 0.3 }))
        el.addEventListener("pointerleave", () => gsap.to(cursor, { scale: 1, duration: 0.3 }))
      })

      // iPad-style pointer: cursor melts into the repo card, card tracks the pointer
      document.querySelectorAll(".repo-card").forEach((card) => {
        let rect = null
        card.addEventListener("pointerenter", () => {
          rect = card.getBoundingClientRect()
          gsap.to(cursor, { scale: 0, duration: 0.25, ease: "power2.out" })
          gsap.to(card, { scale: 1.02, duration: 0.35, ease: "power3.out" })
        })
        card.addEventListener("pointermove", (e) => {
          if (!rect) rect = card.getBoundingClientRect()
          gsap.to(card, {
            x: (e.clientX - rect.left - rect.width / 2) * 0.05,
            y: (e.clientY - rect.top - rect.height / 2) * 0.08,
            duration: 0.4,
            ease: "power3.out",
          })
        })
        card.addEventListener("pointerleave", () => {
          rect = null
          gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power2.out" })
          gsap.to(card, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" })
        })
      })

      // magnetic elements
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        const mx = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3.out" })
        const my = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3.out" })
        el.addEventListener("pointermove", (e) => {
          const r = el.getBoundingClientRect()
          mx((e.clientX - r.left - r.width / 2) * 0.35)
          my((e.clientY - r.top - r.height / 2) * 0.35)
        })
        el.addEventListener("pointerleave", () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" })
        })
      })
    }

    // ---------- preloader → hero ----------
    const counter = { v: 0 }
    const countEl = document.querySelector(".preloader-count")
    const intro = gsap.timeline()
    intro
      .to(counter, {
        v: 47, duration: 0.7, ease: "power2.in", snap: { v: 1 },
        onUpdate: () => { countEl.textContent = String(Math.round(counter.v)).padStart(3, "0") },
      })
      .to(counter, {
        v: 100, duration: 0.9, ease: "power3.inOut", snap: { v: 1 }, delay: 0.18,
        onUpdate: () => { countEl.textContent = String(Math.round(counter.v)).padStart(3, "0") },
      })
      .to(".preloader-count", { opacity: 0, duration: 0.3 })
      .to(".preloader-panel", { yPercent: -100, duration: 1.05, ease: "power4.inOut", stagger: 0.09 }, "<")
      .set(".preloader", { display: "none" })
      .add(() => document.documentElement.classList.remove("is-loading"))
      .to(".hero-line", { y: 0, duration: 1.15, ease: "power4.out", stagger: 0.12 }, "-=0.75")
      .fromTo(".hero-kinda", { opacity: 0, scale: 0.6, rotate: -18 }, { opacity: 1, scale: 1, rotate: -6, duration: 0.6, ease: "back.out(2.2)" }, "-=0.4")
      .to(".hero [data-fade], .site-head [data-fade]", { opacity: 1, duration: 0.7, stagger: 0.07 }, "-=0.5")

    // hero exit drift
    gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    })
      .to(".hero-mask:nth-child(1) .hero-line", { xPercent: -6, ease: "none" }, 0)
      .to(".hero-mask:nth-child(2) .hero-line", { xPercent: 5, ease: "none" }, 0)
      .to(".hero-mask:nth-child(3) .hero-line", { xPercent: -4, ease: "none" }, 0)
      .to(".hero", { opacity: 0.3, ease: "none" }, 0)

    // scroll-velocity skew on hero type
    const skewProxy = { skew: 0 }
    const skewSetter = gsap.quickSetter(".hero-line", "skewY", "deg")
    ScrollTrigger.create({
      onUpdate(self) {
        const velocity = gsap.utils.clamp(-7, 7, self.getVelocity() / -350)
        if (Math.abs(velocity) > Math.abs(skewProxy.skew)) {
          skewProxy.skew = velocity
          gsap.to(skewProxy, {
            skew: 0, duration: 0.8, ease: "power3.out", overwrite: true,
            onUpdate: () => skewSetter(skewProxy.skew),
          })
        }
      },
    })

    // ---------- marquee (velocity-reactive parallax rows) ----------
    const marqueeWrapX = gsap.utils.wrap(-25, 0)
    const marqueeRows = Array.from(document.querySelectorAll("[data-marquee]")).map((row) => ({
      track: row.querySelector(".marquee-track"),
      base: parseFloat(row.dataset.marquee),
      x: -12.5,
    }))
    let marqueeDirection = 1
    let marqueeVelocity = 0
    let marqueeLastScroll = window.scrollY
    gsap.ticker.add((time, deltaMs) => {
      const delta = Math.min(deltaMs, 100) / 1000
      if (delta <= 0) return
      const scrollNow = window.scrollY
      const instantVelocity = (scrollNow - marqueeLastScroll) / delta
      marqueeLastScroll = scrollNow
      marqueeVelocity += (instantVelocity - marqueeVelocity) * Math.min(1, delta * 8)
      const velocityFactor = marqueeVelocity / 200
      if (velocityFactor < -0.02) marqueeDirection = -1
      else if (velocityFactor > 0.02) marqueeDirection = 1
      marqueeRows.forEach((row) => {
        let moveBy = marqueeDirection * row.base * delta
        moveBy += marqueeDirection * moveBy * velocityFactor
        row.x = marqueeWrapX(row.x + moveBy)
        gsap.set(row.track, { xPercent: row.x })
      })
    })

    // ---------- manifesto (pinned ink-in) ----------
    const manifestoCopy = document.querySelector(".manifesto-copy")
    const wordWalker = document.createTreeWalker(manifestoCopy, NodeFilter.SHOW_TEXT)
    const manifestoTextNodes = []
    while (wordWalker.nextNode()) manifestoTextNodes.push(wordWalker.currentNode)
    manifestoTextNodes.forEach((node) => {
      const frag = document.createDocumentFragment()
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return }
        const word = document.createElement("span")
        word.dataset.word = ""
        word.textContent = part
        frag.appendChild(word)
      })
      node.parentNode.replaceChild(frag, node)
    })
    gsap.to(".manifesto-copy [data-word]", {
      opacity: 1, stagger: 0.6, ease: "none",
      scrollTrigger: { trigger: ".manifesto", start: "top top", end: "bottom bottom", scrub: true },
    })
    gsap.fromTo(".manifesto-note", { opacity: 0, scale: 0.8 }, {
      opacity: 1, scale: 1, ease: "back.out(2)",
      scrollTrigger: { trigger: ".manifesto", start: "30% bottom" },
    })
    // ---------- brain (v0.x hover-video cards) ----------
    const brainCards = gsap.utils.toArray(".brain-card")
    const brainFades = [[0, 0.05], [0.04, 0.09], [0.08, 0.13], [0.12, 0.17]]
    const brainDrifts = [-100, 70, -100, 70]
    const brainRise = 60
    const brainPinned = window.matchMedia("(min-width: 640px)")
    ScrollTrigger.create({
      trigger: ".brain",
      start: "top 65%",
      end: "bottom top",
      onUpdate(self) {
        brainCards.forEach((card, i) => {
          const [from, to] = brainFades[i]
          const fade = gsap.utils.clamp(0, 1, (self.progress - from) / (to - from))
          const drift = brainPinned.matches
            ? gsap.utils.clamp(0, 1, (self.progress - 0.42) / 0.58) * brainDrifts[i]
            : 0
          gsap.set(card, { opacity: fade, y: (1 - fade) * brainRise + drift })
          card.classList.toggle("is-in", fade >= 1)
        })
        if (brainActive) setBrainHover(null)
      },
    })

    const brainViz = document.querySelector(".brain-viz")
    for (let i = 0; i < 56; i++) brainViz.appendChild(document.createElement("span"))
    const brainVizBars = Array.from(brainViz.children)
    const brainVizSeeds = brainVizBars.map(() => ({
      phase: Math.random() * Math.PI * 2,
      freq: 2.5 + Math.random() * 3.5,
      weight: 0.5 + Math.random() * 0.5,
    }))
    const brainWaveAmp = { value: 0 }
    function drawBrainWave() {
      const t = gsap.ticker.time
      brainVizBars.forEach((bar, i) => {
        const s = brainVizSeeds[i]
        const travel = Math.abs(Math.sin(i * 0.32 + t * 3)) * 0.35
        const flutter = Math.abs(Math.sin(t * s.freq + s.phase)) * 0.45 * s.weight
        const pulse = 0.12 + travel + flutter
        bar.style.transform = `scaleY(${(Math.max(0.06, pulse * brainWaveAmp.value) + 0.04).toFixed(3)})`
      })
    }
    const brainGamerBg = document.querySelector(".brain-bg")
    const brainDancer = document.querySelector(".brain-dancer")
    const brainMatrix = document.querySelector(".brain-matrix")
    const brainArtBg = document.querySelector(".brain-artbg")

    let brainActive = null
    function setBrainHover(item) {
      brainActive = item
      gsap.killTweensOf([brainGamerBg, brainDancer, brainMatrix, brainArtBg, brainViz, brainWaveAmp])
      if (item === "gaming") {
        gsap.to(brainGamerBg, { opacity: 1, scale: 1.05, duration: 0.6, ease: "power2.out" })
      } else {
        gsap.to(brainGamerBg, { opacity: 0, scale: 1, duration: 0.3, ease: "power2.in" })
      }
      if (item === "engineering") {
        matrixRain.start()
        gsap.to(brainMatrix, { opacity: 1, duration: 0.6, ease: "power2.out" })
      } else {
        gsap.to(brainMatrix, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => matrixRain.stop() })
      }
      if (item === "design") {
        gsap.to(brainArtBg, { opacity: 1, scale: 1.05, duration: 0.6, ease: "power2.out" })
      } else {
        gsap.to(brainArtBg, { opacity: 0, scale: 1, duration: 0.3, ease: "power2.in" })
      }
      if (item === "music") {
        gsap.to(brainDancer, { opacity: 0.25, scale: 1.05, duration: 0.6, ease: "power2.out" })
        gsap.fromTo(brainViz, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1)" })
        gsap.to(brainWaveAmp, { value: 1, duration: 0.6, ease: "power2.out" })
        gsap.ticker.add(drawBrainWave)
      } else {
        gsap.to(brainDancer, { opacity: 0, scale: 1, duration: 0.3, ease: "power2.in" })
        gsap.to(brainViz, { y: 50, opacity: 0, duration: 0.2, ease: "power2.inOut" })
        gsap.to(brainWaveAmp, {
          value: 0, duration: 0.2, ease: "power2.inOut",
          onComplete: () => gsap.ticker.remove(drawBrainWave),
        })
      }
    }
    brainCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        if (brainPinned.matches && card.classList.contains("is-in")) setBrainHover(card.dataset.brain)
      })
      card.addEventListener("mousemove", () => {
        if (brainPinned.matches && card.classList.contains("is-in") && brainActive !== card.dataset.brain) {
          setBrainHover(card.dataset.brain)
        }
      })
      card.addEventListener("mouseleave", () => {
        if (card.classList.contains("is-in")) setBrainHover(null)
      })
    })

    // ---------- generic reveals ----------
    document.querySelectorAll("main [data-fade]:not(.hero [data-fade])").forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      })
    })
    document.querySelectorAll(".sw-clip").forEach((el) => {
      gsap.to(el, {
        clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      })
    })

    // ---------- the flip: side A → side B ----------
    gsap.timeline({
      scrollTrigger: { trigger: "#flip", start: "top top", end: "+=180%", pin: true, scrub: 1 },
    })
      .fromTo("#cassette3d", { rotationY: 0, scale: 0.92 }, { rotationY: 180, scale: 1, duration: 3, ease: "power1.inOut" }, 0)
      .to(".flip-stage", { backgroundColor: "#FFAF00", duration: 3, ease: "none" }, 0)
      .to(".flip-caption", { color: "rgba(10, 10, 12, 0.9)", duration: 3, ease: "none" }, 0)

    // header flips to solid ink once the flood has mostly turned yellow, stays dark through the reel
    const siteHead = document.querySelector(".site-head")

    // caption text swaps at the halfway point
    ScrollTrigger.create({
      trigger: "#flip", start: "top top", end: "+=180%", scrub: true,
      onUpdate(self) {
        document.querySelector(".flip-caption").textContent =
          self.progress > 0.5 ? (L.flipAfter || "…now for the good part") : (L.flipBefore || "flip the tape →")
        siteHead.classList.toggle("on-light", self.progress > 0.5)
      },
    })

    // ---------- tracklist (Side B): pin the screen, swap schrödingers → undone on scroll ----------
    // Desktop only. Below the two-column breakpoint the pin + overlapping tracks
    // squeezes the tracklist off-screen, so there we fall back to normal stacked
    // flow (see the max-width: 959px block in landing.css).
    gsap.matchMedia().add("(min-width: 960px)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: "#tracklist", start: "top top", end: "+=130%",
          pin: true, scrub: 1, anticipatePin: 1,
        },
      })
        .to("#trk-0", { autoAlpha: 0, y: -40, duration: 0.7 }, 0.2)
        .fromTo("#trk-1", { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
    })

    // darken the fixed header the whole time the yellow expanse is on screen
    ScrollTrigger.create({
      trigger: "#tracklist", start: "top 55%",
      endTrigger: "footer", end: "bottom 40%",
      onToggle(self) { siteHead.classList.toggle("on-light", self.isActive) },
    })

    // ---------- ambient b l v c k loop (Side A flip → end), ducks under the preview clip ----------
    const bgAudio = document.getElementById("bg-audio")
    const muteBtn = document.getElementById("mute-btn")
    if (bgAudio && muteBtn) {
      const muteLabel = muteBtn.querySelector(".mute-label")
      let activated = false // reached the flip once — loop + button then persist page-wide
      let ducked = false    // the preview clip is currently playing
      let soundOn = false   // user has unmuted

      const sync = () => {
        bgAudio.muted = !soundOn
        if (activated && !ducked) {
          const p = bgAudio.play()
          if (p && p.catch) p.catch(() => {}) // ignore autoplay rejections (muted is allowed)
        } else {
          bgAudio.pause()
        }
      }
      const setSound = (on) => {
        soundOn = on
        muteBtn.classList.toggle("is-on", on)
        muteBtn.setAttribute("aria-pressed", String(on))
        muteBtn.setAttribute("aria-label", on ? (L.ariaMute || "Mute the b l v c k loop") : (L.ariaUnmute || "Unmute the b l v c k loop"))
        muteLabel.textContent = on ? (L.soundOn || "sound on") : (L.soundOff || "sound off")
        sync()
      }
      muteBtn.addEventListener("click", () => setSound(!soundOn))

      // the flip is the entry point: wait until the tape has actually turned to side B,
      // then spring the control in so the motion draws the eye. once armed, the loop +
      // button stay for the rest of the session, even scrolling back up
      const reveal = () => {
        if (activated) return
        activated = true
        muteBtn.classList.add("is-visible")
        sync()
      }
      ScrollTrigger.create({
        trigger: "#flip", start: "top top", end: "+=180%",
        onUpdate(self) { if (self.progress > 0.62) reveal() },
        onLeave: reveal, // fallback if the flip range is skipped in one jump
      })

      // duck: whenever the schrödingers immigrant preview plays, hold the loop so nothing overlaps
      const clipAudio = document.getElementById("clip-audio")
      if (clipAudio) {
        clipAudio.addEventListener("play", () => { ducked = true; sync() })
        const unduck = () => { ducked = false; sync() }
        clipAudio.addEventListener("pause", unduck)
        clipAudio.addEventListener("ended", unduck)
      }

      setSound(false) // default: present but muted until the visitor opts in
    }
  }
