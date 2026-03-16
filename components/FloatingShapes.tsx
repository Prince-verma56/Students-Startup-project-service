"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface FloatingShapesProps {
  hTween: gsap.core.Tween
  sectionEl: HTMLElement | null
  trackWidth: number
  totalScroll: number
}

// ─────────────────────────────────────────────────────────────────────────────
// SHAPE REGISTRY
// Each shape: scene it belongs to, viewport position, motion params, SVG render
// Inspired by GSAP.com: bezier curves, overlapping pills, pinwheels, arcs
// Positions kept in RIGHT half of viewport (55-92vw) so they never overlap
// the left-aligned text columns. Bottom area (60-85vh) is free for all scenes.
// ─────────────────────────────────────────────────────────────────────────────
const SHAPES = [

  // ══ SCENE 1 — 4 shapes ══════════════════════════════════════════════════

  // Pinwheel / 4-petal clover (GSAP reference image 3)
  {
    id: "s1_pinwheel", scene: 1, left: "74vw", top: "8vh",
    bobDur: 4.0, bobAmt: 22, rotDur: 8, rotAmt: 360, opacity: 0.72,
    render: (id: string) => (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <defs>
          <radialGradient id={`${id}a`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FDA4AF"/>
            <stop offset="100%" stopColor="#FB7185"/>
          </radialGradient>
          <radialGradient id={`${id}b`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FCA5A5"/>
            <stop offset="100%" stopColor="#C4B5FD"/>
          </radialGradient>
        </defs>
        {/* 4 quarter-circles making a pinwheel */}
        <path d="M40 40 Q40 8 72 8 Q72 40 40 40 Z"   fill={`url(#${id}a)`}/>
        <path d="M40 40 Q72 40 72 72 Q40 72 40 40 Z"  fill={`url(#${id}b)`}/>
        <path d="M40 40 Q40 72 8 72 Q8 40 40 40 Z"    fill={`url(#${id}a)`}/>
        <path d="M40 40 Q8 40 8 8 Q40 8 40 40 Z"      fill={`url(#${id}b)`}/>
      </svg>
    ),
  },

  // Hollow ring gradient (cyan-violet)
  {
    id: "s1_ring", scene: 1, left: "86vw", top: "55vh",
    bobDur: 3.2, bobAmt: 18, rotDur: 6, rotAmt: -360, opacity: 0.7,
    render: (id: string) => (
      <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9"/>
            <stop offset="40%" stopColor="#818CF8"/>
            <stop offset="100%" stopColor="#C084FC"/>
          </linearGradient>
        </defs>
        <circle cx="29" cy="29" r="24" stroke={`url(#${id})`} strokeWidth="10" fill="none"/>
        <path d="M12 20 A20 20 0 0 1 38 8" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },

  // Bezier S-curve shape (GSAP reference image 1 — the white S curve)
  {
    id: "s1_scurve", scene: 1, left: "62vw", top: "66vh",
    bobDur: 2.8, bobAmt: 14, rotDur: 0, rotAmt: 0, opacity: 0.6,
    render: (id: string) => (
      <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="90" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7"/>
            <stop offset="100%" stopColor="#3B82F6"/>
          </linearGradient>
        </defs>
        {/* Thick bezier S curve */}
        <path d="M10 55 C10 35, 40 35, 45 18 C50 2, 80 2, 80 18"
          stroke={`url(#${id})`} strokeWidth="6" strokeLinecap="round" fill="none"/>
        {/* Control point dots */}
        <circle cx="10" cy="55" r="6" fill="#34D399"/>
        <circle cx="80" cy="18" r="6" fill="#60A5FA"/>
        <circle cx="45" cy="18" r="4" fill="rgba(255,255,255,0.6)"/>
        {/* Dashed guide lines */}
        <line x1="10" y1="55" x2="45" y2="35" stroke="rgba(110,231,183,0.35)" strokeWidth="1.5" strokeDasharray="4,4"/>
        <line x1="80" y1="18" x2="45" y2="18" stroke="rgba(96,165,250,0.35)" strokeWidth="1.5" strokeDasharray="4,4"/>
      </svg>
    ),
  },

  // Gold diamond
  {
    id: "s1_diamond", scene: 1, left: "78vw", top: "78vh",
    bobDur: 2.1, bobAmt: 12, rotDur: 7, rotAmt: 180, opacity: 0.6,
    render: (id: string) => (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <defs>
          <radialGradient id={id} cx="35%" cy="25%" r="70%">
            <stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/>
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="30" height="30" rx="5" fill={`url(#${id})`} transform="rotate(45 20 20)"/>
        <ellipse cx="15" cy="13" rx="6" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(45 15 13)"/>
      </svg>
    ),
  },

  // ══ SCENE 2 — 4 shapes ══════════════════════════════════════════════════

  // Overlapping pill labels (GSAP reference image 2)
  {
    id: "s2_pills", scene: 2, left: "68vw", top: "9vh",
    bobDur: 3.0, bobAmt: 16, rotDur: 0, rotAmt: 0, opacity: 0.75,
    render: (id: string) => (
      <svg width="130" height="70" viewBox="0 0 130 70" fill="none">
        <defs>
          <linearGradient id={`${id}1`} x1="0" y1="0" x2="110" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9A8D4"/>
            <stop offset="100%" stopColor="#E879F9"/>
          </linearGradient>
          <linearGradient id={`${id}2`} x1="20" y1="0" x2="130" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB923C"/>
            <stop offset="100%" stopColor="#FBBF24"/>
          </linearGradient>
        </defs>
        {/* Top pill (pink) */}
        <rect x="0" y="2" width="108" height="34" rx="17" fill={`url(#${id}1)`}/>
        {/* Bottom pill (orange) — offset right, overlapping */}
        <rect x="22" y="34" width="108" height="34" rx="17" fill={`url(#${id}2)`}/>
      </svg>
    ),
  },

  // 3D isometric cube
  {
    id: "s2_cube", scene: 2, left: "87vw", top: "52vh",
    bobDur: 3.4, bobAmt: 18, rotDur: 12, rotAmt: 180, opacity: 0.65,
    render: (id: string) => (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <defs>
          <linearGradient id={`${id}t`} x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BAE6FD"/><stop offset="100%" stopColor="#38BDF8"/>
          </linearGradient>
          <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8"/><stop offset="100%" stopColor="#0284C7"/>
          </linearGradient>
          <linearGradient id={`${id}l`} x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7DD3FC"/><stop offset="100%" stopColor="#38BDF8"/>
          </linearGradient>
        </defs>
        <polygon points="26,4 46,15 26,26 6,15"  fill={`url(#${id}t)`}/>
        <polygon points="46,15 46,35 26,46 26,26" fill={`url(#${id}r)`}/>
        <polygon points="6,15 26,26 26,46 6,35"  fill={`url(#${id}l)`}/>
        <line x1="26" y1="4" x2="26" y2="26" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      </svg>
    ),
  },

  // Blob / organic shape (rose)
  {
    id: "s2_blob", scene: 2, left: "60vw", top: "68vh",
    bobDur: 3.8, bobAmt: 16, rotDur: 14, rotAmt: 90, opacity: 0.55,
    render: (id: string) => (
      <svg width="56" height="56" viewBox="0 0 60 60" fill="none">
        <defs>
          <radialGradient id={id} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FCA5A5"/><stop offset="100%" stopColor="#F43F5E"/>
          </radialGradient>
        </defs>
        <path d="M30 6 C44 4,54 14,54 28 C54 44,44 56,30 56 C14 56,4 46,4 30 C4 14,16 8,30 6 Z" fill={`url(#${id})`}/>
        <path d="M18 16 C22 11,34 12,40 20" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },

  // Arc / half-ring (emerald)
  {
    id: "s2_arc", scene: 2, left: "76vw", top: "80vh",
    bobDur: 2.6, bobAmt: 14, rotDur: 10, rotAmt: -270, opacity: 0.6,
    render: (id: string) => (
      <svg width="54" height="30" viewBox="0 0 60 34" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
        </defs>
        <path d="M4 30 A26 26 0 0 1 56 30" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" fill="none"/>
        <circle cx="4" cy="30" r="5" fill="#34D399"/>
        <circle cx="56" cy="30" r="5" fill="#059669"/>
      </svg>
    ),
  },

  // ══ SCENE 3 — 4 shapes ══════════════════════════════════════════════════

  // Hourglass (violet)
  {
    id: "s3_hourglass", scene: 3, left: "78vw", top: "10vh",
    bobDur: 3.6, bobAmt: 20, rotDur: 8, rotAmt: -180, opacity: 0.7,
    render: (id: string) => (
      <svg width="42" height="52" viewBox="0 0 42 52" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="42" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#7C3AED"/>
          </linearGradient>
        </defs>
        <polygon points="21,26 3,4 39,4" fill={`url(#${id})`} opacity="0.95"/>
        <polygon points="21,26 3,48 39,48" fill={`url(#${id})`} opacity="0.95"/>
        <circle cx="21" cy="26" r="4" fill="rgba(255,255,255,0.5)"/>
        {/* Tiny sand particles */}
        <circle cx="18" cy="22" r="1.5" fill="rgba(255,255,255,0.4)"/>
        <circle cx="24" cy="24" r="1" fill="rgba(255,255,255,0.3)"/>
      </svg>
    ),
  },

  // Donut / ring amber
  {
    id: "s3_donut", scene: 3, left: "65vw", top: "62vh",
    bobDur: 2.4, bobAmt: 16, rotDur: 13, rotAmt: 270, opacity: 0.6,
    render: (id: string) => (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <defs>
          <radialGradient id={id} cx="50%" cy="50%" r="50%">
            <stop offset="38%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/>
          </radialGradient>
        </defs>
        <circle cx="26" cy="26" r="22" fill={`url(#${id})`}/>
        <circle cx="26" cy="26" r="11" fill="white" opacity="0.9"/>
        <path d="M10 22 A18 18 0 0 1 36 12" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },

  // Triangle indigo
  {
    id: "s3_triangle", scene: 3, left: "88vw", top: "36vh",
    bobDur: 2.9, bobAmt: 14, rotDur: 9, rotAmt: -360, opacity: 0.65,
    render: (id: string) => (
      <svg width="44" height="40" viewBox="0 0 48 44" fill="none">
        <defs>
          <linearGradient id={id} x1="24" y1="0" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A5B4FC"/><stop offset="100%" stopColor="#4F46E5"/>
          </linearGradient>
        </defs>
        <polygon points="24,3 45,41 3,41" fill={`url(#${id})`}/>
        <polygon points="24,10 37,37 11,37" fill="rgba(255,255,255,0.12)"/>
        <line x1="24" y1="6" x2="24" y2="14" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },

  // Star / asterisk emerald
  {
    id: "s3_star", scene: 3, left: "75vw", top: "80vh",
    bobDur: 1.9, bobAmt: 18, rotDur: 4, rotAmt: 360, opacity: 0.6,
    render: (id: string) => (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <defs>
          <radialGradient id={id} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#10B981"/>
          </radialGradient>
        </defs>
        {[0,40,80,120,160].map(a => (
          <rect key={a} x="18" y="2" width="4" height="36" rx="2"
            fill={`url(#${id})`} transform={`rotate(${a} 20 20)`}/>
        ))}
        <circle cx="20" cy="20" r="6" fill={`url(#${id})`}/>
        <circle cx="17" cy="16" r="2.5" fill="rgba(255,255,255,0.4)"/>
      </svg>
    ),
  },

  // ══ SCENE 4 — 4 shapes ══════════════════════════════════════════════════

  // Pill / capsule green
  {
    id: "s4_pill", scene: 4, left: "68vw", top: "12vh",
    bobDur: 2.5, bobAmt: 14, rotDur: 0, rotAmt: 0, opacity: 0.65,
    render: (id: string) => (
      <svg width="72" height="32" viewBox="0 0 76 34" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="76" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86EFAC"/><stop offset="100%" stopColor="#22C55E"/>
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="74" height="32" rx="16" fill={`url(#${id})`}/>
        <ellipse cx="22" cy="13" rx="11" ry="5" fill="rgba(255,255,255,0.35)"/>
      </svg>
    ),
  },

  // Pink ring
  {
    id: "s4_ring2", scene: 4, left: "83vw", top: "58vh",
    bobDur: 3.1, bobAmt: 16, rotDur: 8, rotAmt: 360, opacity: 0.65,
    render: (id: string) => (
      <svg width="54" height="54" viewBox="0 0 58 58" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FCA5A5"/>
            <stop offset="50%" stopColor="#F472B6"/>
            <stop offset="100%" stopColor="#E879F9"/>
          </linearGradient>
        </defs>
        <circle cx="29" cy="29" r="24" stroke={`url(#${id})`} strokeWidth="10" fill="none"/>
        <path d="M13 22 A18 18 0 0 1 38 10" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },

  // Violet diamond
  {
    id: "s4_diamond2", scene: 4, left: "74vw", top: "38vh",
    bobDur: 2.3, bobAmt: 12, rotDur: 6, rotAmt: -180, opacity: 0.55,
    render: (id: string) => (
      <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
        <defs>
          <radialGradient id={id} cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#DDD6FE"/><stop offset="100%" stopColor="#7C3AED"/>
          </radialGradient>
        </defs>
        <rect x="6" y="6" width="32" height="32" rx="5" fill={`url(#${id})`} transform="rotate(45 22 22)"/>
        <ellipse cx="17" cy="14" rx="6" ry="3.5" fill="rgba(255,255,255,0.32)" transform="rotate(45 17 14)"/>
      </svg>
    ),
  },

  // Winged arc / flow element (reference: wings from GSAP clover)
  {
    id: "s4_wings", scene: 4, left: "62vw", top: "72vh",
    bobDur: 3.4, bobAmt: 18, rotDur: 16, rotAmt: 360, opacity: 0.6,
    render: (id: string) => (
      <svg width="64" height="40" viewBox="0 0 68 44" fill="none">
        <defs>
          <radialGradient id={`${id}L`} cx="30%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#7C3AED"/>
          </radialGradient>
          <radialGradient id={`${id}R`} cx="70%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#F9A8D4"/><stop offset="100%" stopColor="#EC4899"/>
          </radialGradient>
        </defs>
        {/* Left wing */}
        <path d="M34 22 Q14 4 4 22 Q14 40 34 22 Z" fill={`url(#${id}L)`}/>
        {/* Right wing */}
        <path d="M34 22 Q54 4 64 22 Q54 40 34 22 Z" fill={`url(#${id}R)`}/>
        {/* Centre dot */}
        <circle cx="34" cy="22" r="5" fill="white" opacity="0.7"/>
      </svg>
    ),
  },
]

// Parallax speeds — stagger so shapes feel independent
const SPEEDS = [
  0.78, 0.92, 0.65, 0.88,   // scene 1
  0.82, 1.05, 0.72, 0.95,   // scene 2
  0.88, 0.78, 1.08, 0.70,   // scene 3
  0.85, 0.98, 0.68, 0.92,   // scene 4
]

export default function FloatingShapes({
  hTween,
  sectionEl,
  totalScroll,
}: FloatingShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !sectionEl || !hTween) return

    const els = container.querySelectorAll<HTMLElement>(".shape-item")

    els.forEach((el, i) => {
      const s = SHAPES[i]
      if (!s) return
      const speed = SPEEDS[i] ?? 0.85

      // ── Initial state ─────────────────────────────────────────────────────
      gsap.set(el, { opacity: 0, scale: 0.55, y: 24 })

      // ── Fade IN: when scene enters (containerAnimation) ───────────────────
      gsap.to(el, {
        opacity: s.opacity,
        scale: 1,
        y: 0,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: `.scene-${s.scene}`,
          containerAnimation: hTween,
          start: "left 88%",
          end:   "left 42%",
          scrub: 0.9,
        },
      })

      // ── Fade OUT: as NEXT scene arrives (except scene 4) ──────────────────
      if (s.scene < 4) {
        gsap.to(el, {
          opacity: 0,
          scale: 0.65,
          y: -18,
          ease: "power2.in",
          scrollTrigger: {
            trigger: `.scene-${s.scene + 1}`,
            containerAnimation: hTween,
            start: "left 72%",
            end:   "left 18%",
            scrub: 0.9,
          },
        })
      }

      // ── Scene 4 shapes: exit at very end ──────────────────────────────────
      if (s.scene === 4) {
        gsap.to(el, {
          opacity: 0,
          scale: 0.3,
          ease: "power3.in",
          scrollTrigger: {
            trigger: ".scene-4",
            containerAnimation: hTween,
            start: "left 12%",
            end:   "left -10%",
            scrub: 1,
          },
        })
      }

      // ── Continuous bob (each shape its own rhythm) ────────────────────────
      gsap.to(el, {
        y: `-=${s.bobAmt}`,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        duration: s.bobDur,
        delay: i * 0.14,
      })

      // ── Continuous rotation ───────────────────────────────────────────────
      if (s.rotAmt !== 0 && s.rotDur > 0) {
        gsap.to(el, {
          rotation: s.rotAmt,
          ease: "none",
          repeat: -1,
          duration: s.rotDur,
        })
      }

      // ── Horizontal parallax travel ────────────────────────────────────────
      // Each shape moves left at its own speed relative to totalScroll.
      // This creates depth: slower shapes feel farther away.
      gsap.to(el, {
        x: -(totalScroll * speed),
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end:   () => `+=${totalScroll}`,
          scrub: 0.5,
        },
      })
    })

    return () => {}
  }, [hTween, sectionEl, totalScroll])

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none"
      style={{
        zIndex: 18,
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "visible",
      }}
      aria-hidden
    >
      {SHAPES.map(s => (
        <div
          key={s.id}
          className="shape-item absolute"
          style={{
            left:         s.left,
            top:          s.top,
            willChange:   "transform, opacity",
            filter:       "drop-shadow(2px 8px 14px rgba(0,0,0,0.13))",
          }}
        >
          {s.render(s.id)}
        </div>
      ))}
    </div>
  )
}