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

    const ctx = gsap.context(() => {
      // Create a timeline for the entire sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=150%", // Reduced from 200% for faster completion
          pin: true,
          scrub: 0.8, // Slightly tighter scrub
          invalidateOnRefresh: true,
        }
      })

      // 1. Floating Shapes - Fade in early
      floatRefs.current.forEach((shape, i) => {
        if (!shape) return
        const f = FLOATS[i]
        
        gsap.set(shape, { opacity: 0, scale: 0.4, rotation: f.ir })
        
        tl.to(shape, {
          opacity: 0.62, scale: 1, rotation: 0, ease: "power2.out",
        }, 0)

        // Independent bob — runs forever
        gsap.to(shape, {
          y: `-=${f.bob}`, ease: "sine.inOut",
          yoyo: true, repeat: -1, duration: f.bobD, delay: i * 0.28,
        })

        if (f.rotD > 0) {
          gsap.to(shape, {
            rotation: 360, ease: "none", repeat: -1, duration: f.rotD,
          })
        }
      })

      // 2. Eyebrow
      if (eyebrowRef.current) {
        tl.fromTo(eyebrowRef.current, 
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "power2.out" }, 
          0.1
        )
      }

      // 3. Words 0 & 2
      tl.fromTo([word0Ref.current, word2Ref.current],
        { opacity: 0, filter: "blur(10px)" },
        { opacity: 1, filter: "blur(0px)", ease: "power2.inOut" },
        0.2
      )
      tl.fromTo(word0Ref.current, { x: "-50vw" }, { x: 0, ease: "power3.out" }, 0.2)
      tl.fromTo(word2Ref.current, { x: "50vw" }, { x: 0, ease: "power3.out" }, 0.2)

      // 4. Word 1
      if (word1Ref.current) {
        tl.fromTo(word1Ref.current,
          { scale: 0.05, opacity: 0, y: 40, rotationX: 60, filter: "blur(28px)" },
          { scale: 1, opacity: 1, y: 0, rotationX: 0, filter: "blur(0px)", ease: "back.out(1.2)" },
          0.4
        )
        
        tl.to(word1Ref.current, {
          textShadow: "0 0 80px rgba(99,102,241,0.18)",
          ease: "none",
        }, 0.8)
      }

      // 5. Divider Line
      if (lineRef.current) {
        tl.fromTo(lineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: "power2.inOut" },
          0.7
        )
      }

      // 6. Paragraph & Sub
      if (paraRef.current) {
        tl.fromTo(paraRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, ease: "power2.out" },
          0.85
        )
      }
      if (subRef.current) {
        tl.fromTo(subRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: "power2.out" },
          0.95
        )
      }

    }, el)

    const timer = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(timer)
      try { ctx.revert() } catch (_) {}
    }
  }, [words])

  return (
    <div
      ref={sectionRef}
      id={id}
      style={{ background: "#F5F4F0" }}
      className={`relative w-full overflow-hidden ${className}`}
    >
      <div
        className="relative h-screen w-full flex flex-col justify-center"
        aria-label={eyebrow ?? words.join(" ")}
      >
        {/* SEO */}
        <h2 className="sr-only">{words.join(" ")}</h2>

        {/* Grain */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px", opacity: 0.028, zIndex: 0,
          }} />

        {/* Radial glow */}
        <div aria-hidden className="absolute pointer-events-none" style={{
          bottom: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "80vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 65%)",
          filter: "blur(60px)", zIndex: 0,
        }} />

        {/* Floating shapes */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {FLOATS.map((f, i) => (
            <div key={i} ref={el => { floatRefs.current[i] = el }}
              className="absolute"
              style={{
                left: f.l, top: f.t, willChange: "transform,opacity",
                filter: "drop-shadow(2px 8px 14px rgba(0,0,0,0.09))"
              }}>
              {f.s}
            </div>
          ))}
        </div>

        {/* Content — flex-col centred */}
        <div
          className="relative flex flex-col justify-center w-full"
          style={{
            zIndex: 2,
            paddingLeft: "clamp(20px,5vw,80px)",
            paddingRight: "clamp(20px,5vw,80px)",
            perspective: "1200px",   // needed for word1 z-axis punch
          }}
        >
          {/* Eyebrow */}
          {eyebrow && (
            <span ref={eyebrowRef}
              className="font-robert font-bold uppercase text-zinc-400 mb-7 md:mb-9 block"
              style={{
                fontSize: "11px", letterSpacing: "0.32em",
                opacity: 0, willChange: "transform,opacity"
              }}>
              [ {eyebrow} ]
            </span>
          )}

          {/* ── THREE WORDS ─────────────────────────────────────────────────── */}
          <div className="flex flex-col" style={{ gap: "0.04em" }}>

            {/* WORD 0 — LEFT-ALIGNED, comes from left */}
            <div ref={word0Ref}
              className="font-neulis font-black uppercase leading-[0.86] select-none"
              aria-hidden
              style={{
                fontSize: "clamp(3.8rem,11vw,10rem)",
                color: "#1A1823",
                letterSpacing: "-0.03em",
                willChange: "transform,opacity,filter",
                opacity: 0,
              }}>
              {words[0]}
            </div>

            {/* WORD 1 — CENTRED, punches from z-axis */}
            <div ref={word1Ref}
              className="font-neulis font-black uppercase leading-[0.86] select-none"
              aria-hidden
              style={{
                fontSize: "clamp(4.2rem,13vw,12rem)",
                color: "#1A1823",
                letterSpacing: "-0.04em",
                textAlign: "center",
                willChange: "transform,opacity,filter",
                transformStyle: "preserve-3d",
                opacity: 0,
              }}>
              {words[1]}
            </div>

            {/* WORD 2 — RIGHT-ALIGNED, comes from right */}
            <div ref={word2Ref}
              className="font-neulis font-black uppercase leading-[0.86] select-none self-end"
              aria-hidden
              style={{
                fontSize: "clamp(3.8rem,11vw,10rem)",
                color: "#1A1823",
                letterSpacing: "-0.03em",
                textAlign: "right",
                willChange: "transform,opacity,filter",
                opacity: 0,
              }}>
              {words[2]}
            </div>
          </div>

          {/* Divider */}
          <div ref={lineRef} style={{
            height: "1.5px",
            marginTop: "clamp(20px,3.5vh,44px)",
            marginBottom: "clamp(16px,2.8vh,36px)",
            background: "linear-gradient(90deg,#1A1823 0%,rgba(99,102,241,0.45) 55%,transparent 100%)",
            transformOrigin: "left center",
            opacity: 0, willChange: "transform,opacity",
          }} />

          {/* Text */}
          <div style={{ maxWidth: "580px" }}>
            {paragraph && (
              <p ref={paraRef}
                className="font-robert text-zinc-500 leading-relaxed font-medium"
                style={{
                  fontSize: "clamp(0.95rem,1.35vw,1.15rem)",
                  opacity: 0, willChange: "transform,opacity",
                  marginBottom: sub ? "0.55rem" : 0
                }}>
                {paragraph}
              </p>
            )}
            {sub && (
              <p ref={subRef}
                className="font-robert text-zinc-400 leading-relaxed"
                style={{
                  fontSize: "clamp(0.78rem,1.05vw,0.92rem)",
                  opacity: 0, willChange: "transform,opacity"
                }}>
                {sub}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}