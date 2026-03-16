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

// ── 6 floating shape SVGs ─────────────────────────────────────────────────────
const FLOATS = [
  { l:"5vw",  t:"9vh",  bob:18, bobD:2.8, rotD:14, ir:-22,
    s:<svg width="52" height="52" viewBox="0 0 56 56" fill="none" aria-hidden key="f0">
        <defs><linearGradient id="fcA" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67E8F9"/><stop offset="100%" stopColor="#818CF8"/>
        </linearGradient></defs>
        <circle cx="28" cy="28" r="23" stroke="url(#fcA)" strokeWidth="9" fill="none"/>
        <path d="M12 20 A18 18 0 0 1 38 9" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg> },
  { l:"87vw", t:"7vh",  bob:14, bobD:3.2, rotD:10, ir:18,
    s:<svg width="36" height="36" viewBox="0 0 42 42" fill="none" aria-hidden key="f1">
        <defs><radialGradient id="fcB" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/>
        </radialGradient></defs>
        <rect x="6" y="6" width="30" height="30" rx="4" fill="url(#fcB)" transform="rotate(45 21 21)"/>
        <ellipse cx="16" cy="13" rx="6" ry="3" fill="rgba(255,255,255,0.3)" transform="rotate(45 16 13)"/>
      </svg> },
  { l:"3vw",  t:"52vh", bob:20, bobD:3.8, rotD:20, ir:-28,
    s:<svg width="60" height="60" viewBox="0 0 68 68" fill="none" aria-hidden key="f2">
        <defs>
          <radialGradient id="fcC1" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#FDA4AF"/><stop offset="100%" stopColor="#FB7185"/></radialGradient>
          <radialGradient id="fcC2" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#8B5CF6"/></radialGradient>
        </defs>
        <path d="M34 34 Q34 8 60 8 Q60 34 34 34 Z" fill="url(#fcC1)"/>
        <path d="M34 34 Q60 34 60 60 Q34 60 34 34 Z" fill="url(#fcC2)"/>
        <path d="M34 34 Q34 60 8 60 Q8 34 34 34 Z" fill="url(#fcC1)"/>
        <path d="M34 34 Q8 34 8 8 Q34 8 34 34 Z" fill="url(#fcC2)"/>
      </svg> },
  { l:"88vw", t:"50vh", bob:12, bobD:2.4, rotD:0,  ir:0,
    s:<svg width="52" height="28" viewBox="0 0 58 32" fill="none" aria-hidden key="f3">
        <defs><linearGradient id="fcD" x1="0" y1="0" x2="58" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#059669"/>
        </linearGradient></defs>
        <path d="M4 28 A24 24 0 0 1 54 28" stroke="url(#fcD)" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <circle cx="4" cy="28" r="5" fill="#34D399"/>
        <circle cx="54" cy="28" r="5" fill="#059669"/>
      </svg> },
  { l:"7vw",  t:"79vh", bob:16, bobD:3.4, rotD:13, ir:20,
    s:<svg width="38" height="46" viewBox="0 0 42 52" fill="none" aria-hidden key="f4">
        <defs><linearGradient id="fcE" x1="0" y1="0" x2="42" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient></defs>
        <polygon points="21,26 3,4 39,4" fill="url(#fcE)" opacity="0.95"/>
        <polygon points="21,26 3,48 39,48" fill="url(#fcE)" opacity="0.95"/>
        <circle cx="21" cy="26" r="4" fill="rgba(255,255,255,0.5)"/>
      </svg> },
  { l:"86vw", t:"77vh", bob:16, bobD:2.6, rotD:17, ir:-14,
    s:<svg width="48" height="48" viewBox="0 0 52 52" fill="none" aria-hidden key="f5">
        <defs><radialGradient id="fcF" cx="50%" cy="50%" r="50%">
          <stop offset="38%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/>
        </radialGradient></defs>
        <circle cx="26" cy="26" r="21" fill="url(#fcF)"/>
        <circle cx="26" cy="26" r="10" fill="white" opacity="0.88"/>
        <path d="M10 22 A17 17 0 0 1 36 12" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
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

    // Total px the scroll travels while section is pinned
    // At average scroll speed ~500px/s → 800px ≈ 1.6s feel
    // With scrub lag it feels like ~2.5–3s of natural scrolling
    const DIST = 800

    const ctx = gsap.context(() => {

      // ── 1. PIN THE SECTION ──────────────────────────────────────────────
      // Section pins when its top hits the viewport top.
      // It stays pinned for DIST px of scroll, then releases.
      ScrollTrigger.create({
        trigger:    el,
        start:      "top top",
        end:        `+=${DIST}`,
        pin:        true,
        pinSpacing: true,
        anticipatePin: 1,
      })

      // Shared base for all child animations
      // They all use the same trigger/start/end as the pin.
      const ST = (startFrac: number, endFrac: number) => ({
        trigger: el,
        start:   `top+=${DIST * startFrac} top`,
        end:     `top+=${DIST * endFrac} top`,
        scrub:   1.8,
      })

      // ── 2. FLOATING SHAPES ──────────────────────────────────────────────
      floatRefs.current.forEach((shape, i) => {
        if (!shape) return
        const f = FLOATS[i]

        // Hidden at start
        gsap.set(shape, { opacity:0, scale:0.4, rotation: f.ir })

        // Fade in during first 35% of pin scroll
        gsap.to(shape, {
          opacity: 0.62, scale: 1, rotation: 0, ease: "none",
          scrollTrigger: ST(0, 0.35),
        })

        // Independent bob — runs forever, not scroll-driven
        gsap.to(shape, {
          y: `-=${f.bob}`, ease:"sine.inOut",
          yoyo:true, repeat:-1, duration: f.bobD, delay: i * 0.28,
        })

        // Slow spin
        if (f.rotD > 0) {
          gsap.to(shape, {
            rotation: 360, ease:"none", repeat:-1, duration: f.rotD,
          })
        }
      })

      // ── 3. EYEBROW ──────────────────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { opacity:0, y:16 })
        gsap.to(eyebrowRef.current, {
          opacity:1, y:0, ease:"none",
          scrollTrigger: ST(0, 0.18),
        })
      }

      // ── 4. WORD 0 — from FAR LEFT ────────────────────────────────────────
      // Slides from -100vw, slight skew, blur clears on arrival
      // Arrives at ~60% of pin scroll
      gsap.set(word0Ref.current, {
        x:"-100vw", opacity:0, skewX:-8, filter:"blur(10px)",
      })
      gsap.to(word0Ref.current, {
        x:0, opacity:1, skewX:0, filter:"blur(0px)", ease:"none",
        scrollTrigger: ST(0.05, 0.60),
      })

      // ── 5. WORD 1 — from Z-AXIS (punches through screen) ────────────────
      // Starts tiny (scale 0.05), deep in z (rotationX), blurred
      // Arrives slightly AFTER words 0 & 2 for dramatic centre-pop effect
      gsap.set(word1Ref.current, {
        scale:0.05, opacity:0, y:40,
        rotationX:60, filter:"blur(28px)",
      })
      gsap.to(word1Ref.current, {
        scale:1, opacity:1, y:0,
        rotationX:0, filter:"blur(0px)", ease:"none",
        scrollTrigger: ST(0.18, 0.68),
      })

      // Glow pulse once fully arrived
      gsap.fromTo(word1Ref.current,
        { textShadow:"0 0 0px rgba(99,102,241,0)" },
        { textShadow:"0 0 80px rgba(99,102,241,0.18)", ease:"none",
          scrollTrigger: ST(0.62, 0.80) }
      )

      // ── 6. WORD 2 — from FAR RIGHT ───────────────────────────────────────
      // Mirror of word 0 — arrives same time
      gsap.set(word2Ref.current, {
        x:"100vw", opacity:0, skewX:8, filter:"blur(10px)",
      })
      gsap.to(word2Ref.current, {
        x:0, opacity:1, skewX:0, filter:"blur(0px)", ease:"none",
        scrollTrigger: ST(0.05, 0.60),
      })

      // ── 7. DIVIDER LINE ─────────────────────────────────────────────────
      gsap.set(lineRef.current, { scaleX:0, opacity:0 })
      gsap.to(lineRef.current, {
        scaleX:1, opacity:1, ease:"none",
        scrollTrigger: ST(0.65, 0.80),
      })

      // ── 8. PARAGRAPH ────────────────────────────────────────────────────
      if (paraRef.current) {
        gsap.set(paraRef.current, { opacity:0, y:28 })
        gsap.to(paraRef.current, {
          opacity:1, y:0, ease:"none",
          scrollTrigger: ST(0.74, 0.90),
        })
      }

      // ── 9. SUB ──────────────────────────────────────────────────────────
      if (subRef.current) {
        gsap.set(subRef.current, { opacity:0, y:18 })
        gsap.to(subRef.current, {
          opacity:1, y:0, ease:"none",
          scrollTrigger: ST(0.82, 0.97),
        })
      }

    }, el)

    return () => { try { ctx.revert() } catch (_) {} }
  }, [words])

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={eyebrow ?? words.join(" ")}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ background:"#F5F4F0" }}
    >
      {/* SEO */}
      <h2 className="sr-only">{words.join(" ")}</h2>

      {/* Grain */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:"180px", opacity:0.028, zIndex:0,
        }}/>

      {/* Radial glow */}
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

      {/* Content — full viewport height, flex-col centred */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          zIndex:      2,
          height:      "100vh",
          paddingLeft: "clamp(20px,5vw,80px)",
          paddingRight:"clamp(20px,5vw,80px)",
          perspective: "1200px",   // needed for word1 z-axis punch
        }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <span ref={eyebrowRef}
            className="font-robert font-bold uppercase text-zinc-400 mb-7 md:mb-9 block"
            style={{ fontSize:"11px", letterSpacing:"0.32em",
              opacity:0, willChange:"transform,opacity" }}>
            [ {eyebrow} ]
          </span>
        )}

        {/* ── THREE WORDS ─────────────────────────────────────────────────── */}
        <div className="flex flex-col" style={{ gap:"0.04em" }}>

          {/* WORD 0 — LEFT-ALIGNED, comes from left */}
          <div ref={word0Ref}
            className="font-neulis font-black uppercase leading-[0.86] select-none"
            aria-hidden
            style={{
              fontSize:      "clamp(3.8rem,11vw,10rem)",
              color:         "#1A1823",
              letterSpacing: "-0.03em",
              willChange:    "transform,opacity,filter",
              opacity:       0,
            }}>
            {words[0]}
          </div>

          {/* WORD 1 — CENTRED, punches from z-axis */}
          <div ref={word1Ref}
            className="font-neulis font-black uppercase leading-[0.86] select-none"
            aria-hidden
            style={{
              fontSize:       "clamp(4.2rem,13vw,12rem)",
              color:          "#1A1823",
              letterSpacing:  "-0.04em",
              textAlign:      "center",
              willChange:     "transform,opacity,filter",
              transformStyle: "preserve-3d",
              opacity:        0,
            }}>
            {words[1]}
          </div>

          {/* WORD 2 — RIGHT-ALIGNED, comes from right */}
          <div ref={word2Ref}
            className="font-neulis font-black uppercase leading-[0.86] select-none self-end"
            aria-hidden
            style={{
              fontSize:      "clamp(3.8rem,11vw,10rem)",
              color:         "#1A1823",
              letterSpacing: "-0.03em",
              textAlign:     "right",
              willChange:    "transform,opacity,filter",
              opacity:       0,
            }}>
            {words[2]}
          </div>
        </div>

        {/* Divider */}
        <div ref={lineRef} style={{
          height:"1.5px",
          marginTop:"clamp(20px,3.5vh,44px)",
          marginBottom:"clamp(16px,2.8vh,36px)",
          background:"linear-gradient(90deg,#1A1823 0%,rgba(99,102,241,0.45) 55%,transparent 100%)",
          transformOrigin:"left center",
          opacity:0, willChange:"transform,opacity",
        }}/>

        {/* Text */}
        <div style={{ maxWidth:"580px" }}>
          {paragraph && (
            <p ref={paraRef}
              className="font-robert text-zinc-500 leading-relaxed font-medium"
              style={{ fontSize:"clamp(0.95rem,1.35vw,1.15rem)",
                opacity:0, willChange:"transform,opacity",
                marginBottom: sub ? "0.55rem" : 0 }}>
              {paragraph}
            </p>
          )}
          {sub && (
            <p ref={subRef}
              className="font-robert text-zinc-400 leading-relaxed"
              style={{ fontSize:"clamp(0.78rem,1.05vw,0.92rem)",
                opacity:0, willChange:"transform,opacity" }}>
              {sub}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}