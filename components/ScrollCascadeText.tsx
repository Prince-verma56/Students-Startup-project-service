"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export interface ScrollCascadeTextProps {
  eyebrow?:   string
  words:      [string, string, string]
  paragraph?: string
  sub?:       string
  id?:        string
  className?: string
}

// ── 6 ambient shapes ──────────────────────────────────────────────────────────
const FLOATS = [
  { l:"5vw",  t:"9vh",  bob:16, bobD:2.8, rotD:14, ir:-22,
    s:<svg width="52" height="52" viewBox="0 0 56 56" fill="none" aria-hidden key="f0">
      <defs><linearGradient id="sct_A" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#67E8F9"/><stop offset="100%" stopColor="#818CF8"/>
      </linearGradient></defs>
      <circle cx="28" cy="28" r="23" stroke="url(#sct_A)" strokeWidth="9" fill="none"/>
      <path d="M12 20 A18 18 0 0 1 38 9" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg> },
  { l:"87vw", t:"7vh",  bob:12, bobD:3.2, rotD:10, ir:18,
    s:<svg width="36" height="36" viewBox="0 0 42 42" fill="none" aria-hidden key="f1">
      <defs><radialGradient id="sct_B" cx="35%" cy="25%" r="70%">
        <stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/>
      </radialGradient></defs>
      <rect x="6" y="6" width="30" height="30" rx="4" fill="url(#sct_B)" transform="rotate(45 21 21)"/>
      <ellipse cx="16" cy="13" rx="6" ry="3" fill="rgba(255,255,255,0.3)" transform="rotate(45 16 13)"/>
    </svg> },
  { l:"3vw",  t:"50vh", bob:20, bobD:3.8, rotD:18, ir:-26,
    s:<svg width="60" height="60" viewBox="0 0 68 68" fill="none" aria-hidden key="f2">
      <defs>
        <radialGradient id="sct_C1" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#FDA4AF"/><stop offset="100%" stopColor="#FB7185"/></radialGradient>
        <radialGradient id="sct_C2" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#8B5CF6"/></radialGradient>
      </defs>
      <path d="M34 34 Q34 8 60 8 Q60 34 34 34 Z" fill="url(#sct_C1)"/>
      <path d="M34 34 Q60 34 60 60 Q34 60 34 34 Z" fill="url(#sct_C2)"/>
      <path d="M34 34 Q34 60 8 60 Q8 34 34 34 Z" fill="url(#sct_C1)"/>
      <path d="M34 34 Q8 34 8 8 Q34 8 34 34 Z" fill="url(#sct_C2)"/>
    </svg> },
  { l:"88vw", t:"50vh", bob:10, bobD:2.4, rotD:0,  ir:0,
    s:<svg width="52" height="26" viewBox="0 0 58 30" fill="none" aria-hidden key="f3">
      <defs><linearGradient id="sct_D" x1="0" y1="0" x2="58" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#059669"/>
      </linearGradient></defs>
      <path d="M4 26 A24 24 0 0 1 54 26" stroke="url(#sct_D)" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <circle cx="4"  cy="26" r="5" fill="#34D399"/>
      <circle cx="54" cy="26" r="5" fill="#059669"/>
    </svg> },
  { l:"7vw",  t:"78vh", bob:14, bobD:3.4, rotD:12, ir:18,
    s:<svg width="38" height="44" viewBox="0 0 42 50" fill="none" aria-hidden key="f4">
      <defs><linearGradient id="sct_E" x1="0" y1="0" x2="42" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient></defs>
      <polygon points="21,25 3,4 39,4"  fill="url(#sct_E)" opacity="0.95"/>
      <polygon points="21,25 3,46 39,46" fill="url(#sct_E)" opacity="0.95"/>
      <circle cx="21" cy="25" r="4" fill="rgba(255,255,255,0.5)"/>
    </svg> },
  { l:"86vw", t:"76vh", bob:15, bobD:2.6, rotD:15, ir:-14,
    s:<svg width="46" height="46" viewBox="0 0 50 50" fill="none" aria-hidden key="f5">
      <defs><radialGradient id="sct_F" cx="50%" cy="50%" r="50%">
        <stop offset="38%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/>
      </radialGradient></defs>
      <circle cx="25" cy="25" r="20" fill="url(#sct_F)"/>
      <circle cx="25" cy="25" r="10" fill="white" opacity="0.88"/>
    </svg> },
]

export default function ScrollCascadeText({
  eyebrow, words, paragraph, sub, id, className = "",
}: ScrollCascadeTextProps) {

  const sectionRef = useRef<HTMLElement>(null)
  const word0Ref   = useRef<HTMLDivElement>(null)
  const word1Ref   = useRef<HTMLDivElement>(null)
  const word2Ref   = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const paraRef    = useRef<HTMLParagraphElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const floatRefs  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {

      // ─────────────────────────────────────────────────────────────────────
      // TIMELINE APPROACH — one ScrollTrigger drives a single timeline.
      //
      // KEY FIXES vs broken version:
      //   1. scrub: 2     → was 0.8.  Higher = more lag = silkier feel
      //   2. end: "+=220%" → was 150%. More scroll room = slower/smoother
      //   3. NO contentRef y lift during scroll (removed — it fought text)
      //   4. NO float y parallax during scroll (removed — fought bob anim)
      //   5. All timeline positions spaced so nothing overlaps/rushes
      //   6. ease: "none" on scrubbed tweens (scrub handles the ease)
      // ─────────────────────────────────────────────────────────────────────

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:            el,
          start:              "top top",
          end:                "+=220%",   // 220% = slow, smooth scroll window
          pin:                true,
          pinSpacing:         true,
          scrub:              2,          // 2s lag = silky, momentum feel
          anticipatePin:      1,
          invalidateOnRefresh: true,
        },
      })

      // ── SET initial states BEFORE timeline ─────────────────────────────
      // Must be set outside the timeline so they're immediate on mount
      floatRefs.current.forEach((shape, i) => {
        if (!shape) return
        gsap.set(shape, { opacity:0, scale:0.45, rotation: FLOATS[i].ir })
      })
      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity:0, y:16 })
      gsap.set(word0Ref.current,  { x:"-90vw", opacity:0, skewX:-8,  filter:"blur(10px)" })
      gsap.set(word1Ref.current,  { scale:0.06, opacity:0, y:50, rotationX:60, filter:"blur(28px)" })
      gsap.set(word2Ref.current,  { x:"90vw",  opacity:0, skewX:8,   filter:"blur(10px)" })
      gsap.set(lineRef.current,   { scaleX:0, opacity:0 })
      if (paraRef.current) gsap.set(paraRef.current, { opacity:0, y:28 })
      if (subRef.current)  gsap.set(subRef.current,  { opacity:0, y:18 })

      // ── TIMELINE positions (0–1 = full scroll range) ───────────────────
      //
      // 0.00–0.15  shapes fade in
      // 0.08–0.18  eyebrow appears
      // 0.10–0.52  word0 flies from left     (long travel = feels physical)
      // 0.10–0.52  word2 flies from right    (mirror, same timing)
      // 0.22–0.62  word1 punches from z      (starts & ends after 0&2)
      // 0.58–0.68  glow appears on word1
      // 0.62–0.74  line draws
      // 0.72–0.84  paragraph fades up
      // 0.82–0.94  sub fades up

      const D = 10  // timeline total "duration" units (arbitrary, scrub ignores real time)

      // Shapes fade in
      floatRefs.current.forEach((shape) => {
        if (!shape) return
        tl.to(shape,
          { opacity:0.62, scale:1, rotation:0, ease:"none" },
          `<`   // all at t=0
        )
      })

      // Eyebrow
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current,
          { opacity:1, y:0, ease:"none", duration: D*0.12 },
          D * 0.08
        )
      }

      // Word 0 — from left
      tl.to(word0Ref.current,
        { x:0, opacity:1, skewX:0, filter:"blur(0px)", ease:"none", duration: D*0.42 },
        D * 0.10
      )

      // Word 2 — from right (same timing as word 0)
      tl.to(word2Ref.current,
        { x:0, opacity:1, skewX:0, filter:"blur(0px)", ease:"none", duration: D*0.42 },
        D * 0.10
      )

      // Word 1 — z-axis punch (starts later, so it lands AFTER left/right)
      tl.to(word1Ref.current,
        {
          scale:1, opacity:1, y:0, rotationX:0,
          filter:"blur(0px)", ease:"none", duration: D*0.40,
        },
        D * 0.22
      )

      // Word 1 glow — fires after word1 has landed
      tl.to(word1Ref.current,
        { textShadow:"0 0 80px rgba(99,102,241,0.18)", ease:"none", duration: D*0.10 },
        D * 0.58
      )

      // Line
      tl.to(lineRef.current,
        { scaleX:1, opacity:1, ease:"none", duration: D*0.12 },
        D * 0.62
      )

      // Paragraph
      if (paraRef.current) {
        tl.to(paraRef.current,
          { opacity:1, y:0, ease:"none", duration: D*0.12 },
          D * 0.72
        )
      }

      // Sub
      if (subRef.current) {
        tl.to(subRef.current,
          { opacity:1, y:0, ease:"none", duration: D*0.12 },
          D * 0.82
        )
      }

      // ── Independent bobs — NOT part of the scroll timeline ─────────────
      // These run on their own clock so they never fight the scroll anim
      floatRefs.current.forEach((shape, i) => {
        if (!shape) return
        gsap.to(shape, {
          y:`-=${FLOATS[i].bob}`, ease:"sine.inOut",
          yoyo:true, repeat:-1, duration: FLOATS[i].bobD,
          delay: i * 0.28,
        })
        if (FLOATS[i].rotD > 0) {
          gsap.to(shape, {
            rotation:360, ease:"none", repeat:-1, duration: FLOATS[i].rotD,
          })
        }
      })

    }, el)

    // Refresh after mount so offsetHeight is correct
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)

    return () => {
      clearTimeout(t)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      try { ctx.revert() } catch (_) {}
    }
  }, [words])

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={eyebrow ?? words.join(" ")}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ background:"#F9FBFF" }}
    >
      {/* SEO */}
      <h2 className="sr-only">{words.join(" ")}</h2>

      {/* Grain */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:"180px", opacity:0.028, zIndex:0,
        }}/>

      {/* Glow */}
      <div aria-hidden className="absolute pointer-events-none" style={{
        bottom:"-20%", left:"50%", transform:"translateX(-50%)",
        width:"80vw", height:"50vw", borderRadius:"50%",
        background:"radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 65%)",
        filter:"blur(60px)", zIndex:0,
      }}/>

      {/* Floating shapes */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex:1 }}>
        {FLOATS.map((f, i) => (
          <div key={i} ref={el => { floatRefs.current[i] = el }}
            className="absolute"
            style={{ left:f.l, top:f.t, willChange:"transform,opacity",
              filter:"drop-shadow(2px 8px 14px rgba(0,0,0,0.09))" }}>
            {f.s}
          </div>
        ))}
      </div>

      {/* ── Main content — full viewport height ─────────────────────────── */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          height:       "100vh",
          zIndex:       2,
          paddingLeft:  "clamp(20px,5vw,80px)",
          paddingRight: "clamp(20px,5vw,80px)",
          perspective:  "1200px",  // required for word1 rotationX
        }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <span ref={eyebrowRef}
            className="font-robert font-bold uppercase text-zinc-400 mb-7 block"
            style={{ fontSize:"11px", letterSpacing:"0.32em",
              opacity:0, willChange:"transform,opacity" }}>
            [ {eyebrow} ]
          </span>
        )}

        {/* Words */}
        <div className="flex flex-col" style={{ gap:"0.04em" }}>

          {/* Word 0 — LEFT → flies from left */}
          <div ref={word0Ref}
            className="font-neulis font-black uppercase leading-[0.86] select-none"
            aria-hidden
            style={{
              fontSize:"clamp(3.6rem,10.5vw,10rem)",
              color:"#1A1823", letterSpacing:"-0.03em",
              willChange:"transform,opacity,filter", opacity:0,
            }}>
            {words[0]}
          </div>

          {/* Word 1 — CENTRE → punches from z-axis */}
          <div ref={word1Ref}
            className="font-neulis font-black uppercase leading-[0.86] select-none"
            aria-hidden
            style={{
              fontSize:"clamp(4rem,12.5vw,12rem)",
              color:"#1A1823", letterSpacing:"-0.04em",
              textAlign:"center",
              willChange:"transform,opacity,filter",
              transformStyle:"preserve-3d",
              opacity:0,
            }}>
            {words[1]}
          </div>

          {/* Word 2 — RIGHT → flies from right */}
          <div ref={word2Ref}
            className="font-neulis font-black uppercase leading-[0.86] select-none self-end"
            aria-hidden
            style={{
              fontSize:"clamp(3.6rem,10.5vw,10rem)",
              color:"#1A1823", letterSpacing:"-0.03em",
              textAlign:"right",
              willChange:"transform,opacity,filter", opacity:0,
            }}>
            {words[2]}
          </div>
        </div>

        {/* Divider */}
        <div ref={lineRef} style={{
          height:"1.5px",
          marginTop:"clamp(18px,3vh,40px)",
          marginBottom:"clamp(14px,2.5vh,32px)",
          background:"linear-gradient(90deg,#1A1823 0%,rgba(99,102,241,0.45) 55%,transparent 100%)",
          transformOrigin:"left center",
          opacity:0, willChange:"transform,opacity",
        }}/>

        {/* Text block */}
        <div style={{ maxWidth:"560px" }}>
          {paragraph && (
            <p ref={paraRef}
              className="font-robert text-zinc-500 leading-relaxed font-medium"
              style={{ fontSize:"clamp(0.92rem,1.3vw,1.1rem)",
                opacity:0, willChange:"transform,opacity",
                marginBottom: sub ? "0.5rem" : 0 }}>
              {paragraph}
            </p>
          )}
          {sub && (
            <p ref={subRef}
              className="font-robert text-zinc-400 leading-relaxed"
              style={{ fontSize:"clamp(0.76rem,1vw,0.9rem)",
                opacity:0, willChange:"transform,opacity" }}>
              {sub}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}