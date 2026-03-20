"use client"

// ─────────────────────────────────────────────────────────────────────────────
// ServicesSection — Page 3 · "Build Your Student Project Faster"
//
// DESIGN PHILOSOPHY (distinct from DemoSection / ReviewSection):
//   • No floating stat cards — those are DemoSection's identity
//   • Instead: thin tech grid lines across full width, ghost "03" top-left,
//     subtle SVG circuit/bracket line art in left & right margins,
//     an accent rule with dots below the heading
//   • Background: same F9FBFF base, but the glow pattern is different —
//     a wide horizontal band across the middle (not corner orbs)
//   • Section dividers: hairline top + bottom with indigo gradient fade
//
// ANIMATIONS:
//   • Same IntersectionObserver + single GSAP timeline pattern
//   • Eyebrow → heading → subtitle para → accent rule → cards (staggered)
//   • Ghost "03" parallax scrub (same as other sections)
//   • Left/right SVG bracket lines draw in via strokeDashoffset
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CardFlip from "../kokonutui/card-flip"
import AnimatedTitle from "../AnimatedTitle"

gsap.registerPlugin(ScrollTrigger)

// ── Theme — identical tokens as DemoSection / ReviewSection ──────────────────
const T = {
  bg:     "#F9FBFF",
  accent: "#6366F1",
  ink:    "#1A1F2E",
  sub:    "#5A6075",
  muted:  "#9AA0B5",
  border: "rgba(26,31,46,0.09)",
}

// ── Data ──────────────────────────────────────────────────────────────────────
interface Tier {
  name: string; subtitle: string; description: string
  features: string[]; price: string; image?: string
  accentColor: string; featured?: boolean
}

const TIERS: Tier[] = [
  {
    name: "Basic",
    subtitle: "Quick Landing Pages",
    description: "Perfect for simple academic assignments or personal landing pages that need a professional look without complex logic.",
    features: ["Single landing page","Simple functionality","Basic CSS animations","Full documentation","1 Revision"],
    price: "₹500–₹1500",
    accentColor: "emerald",
    image: "https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    featured: true,
  },
  {
    name: "Frontend",
    subtitle: "Interactive React UI",
    description: "High-quality React/Next.js frontend development with smooth transitions, responsive design, and API integrations.",
    features: ["Multi-page React UI","API integration","Responsive design","Complex animations","Source code access"],
    price: "₹1500–₹3000",
    accentColor: "blue",
    image: "https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    featured: true,
  },
  {
    name: "Mini Full-Stack",
    subtitle: "Complete Web App",
    description: "A full-featured application with backend logic, database storage, and user authentication. Ideal for major projects.",
    features: ["Auth system (NextAuth)","Database (Prisma/Mongo)","CRUD operations","Admin Dashboard","Deployment guide"],
    price: "₹3000–₹6000",
    accentColor: "violet",
    featured: true,
    image: "https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
  },
  {
    name: "Advanced App",
    subtitle: "Scalable Solutions",
    description: "Professional MERN stack applications with advanced features like payment gateways, real-time updates, and high performance.",
    features: ["Advanced MERN Stack","Payment gateway","Cloud deployment","Real-time features","SEO Optimization"],
    price: "₹6000+",
    accentColor: "rose",
    image: "https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
  },
]

// ── Left margin SVG — abstract circuit/bracket lines ─────────────────────────
// Purely decorative thin lines that suggest "tech" — not boxes, not icons
function LeftMarginArt({ drawRef }: { drawRef: React.RefObject<SVGPathElement | null> }) {
  return (
    <svg
      aria-hidden
      width="100%" height="100%" viewBox="0 0 120 480"
      fill="none" preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Ghost "03" number */}
      <text
        x="8" y="160"
        fontFamily="var(--font-neulis), sans-serif"
        fontWeight="900"
        fontSize="110"
        fill="none"
        stroke="rgba(99,102,241,0.13)"
        strokeWidth="1.5"
        letterSpacing="-4"
      >
        02
      </text>

      {/* Circuit-style bracket lines — drawn in via strokeDashoffset */}
      <path
        ref={drawRef}
        d="M 88 280 L 50 280 L 50 320 L 88 320
           M 50 300 L 20 300
           M 20 270 L 20 340
           M 20 270 L 30 270
           M 20 340 L 30 340
           M 88 380 L 60 380 L 60 420
           M 60 400 L 40 400 L 40 380 L 40 420"
        stroke="rgba(99,102,241,0.22)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="600"
        strokeDashoffset="600"
      />

      {/* Static small dots at junction points */}
      {[
        [20, 300], [50, 300], [60, 400], [40, 400],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(99,102,241,0.28)" />
      ))}
    </svg>
  )
}

// ── Right margin SVG — mirror bracket + vertical tick marks ──────────────────
function RightMarginArt({ drawRef }: { drawRef: React.RefObject<SVGPathElement | null> }) {
  return (
    <svg
      aria-hidden
      width="100%" height="100%" viewBox="0 0 120 480"
      fill="none" preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Vertical tick rail */}
      <path
        ref={drawRef}
        d="M 32 260 L 70 260 L 70 300 L 32 300
           M 70 280 L 100 280
           M 100 250 L 100 320
           M 100 250 L 90 250
           M 100 320 L 90 320
           M 32 360 L 60 360 L 60 400
           M 60 380 L 80 380 L 80 360 L 80 400"
        stroke="rgba(99,102,241,0.20)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="600"
        strokeDashoffset="600"
      />

      {/* Dots */}
      {[
        [100, 280], [70, 280], [60, 380], [80, 380],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(99,102,241,0.26)" />
      ))}
    </svg>
  )
}

// ── Accent rule — dots + line, sits below heading ─────────────────────────────
function AccentRule({ ruleRef }: { ruleRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ruleRef} className="flex items-center justify-center gap-3 mb-12 md:mb-16"
      style={{ opacity: 0 }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.35)" }}/>
      <span className="inline-block h-px" style={{ width: 64, background: "linear-gradient(to right, transparent, rgba(99,102,241,0.35), transparent)" }}/>
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: "rgba(99,102,241,0.55)" }}/>
      <span className="inline-block h-px" style={{ width: 64, background: "linear-gradient(to right, transparent, rgba(99,102,241,0.35), transparent)" }}/>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.35)" }}/>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function ServicesSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const headingWrapRef= useRef<HTMLDivElement>(null)
  const paraRef       = useRef<HTMLParagraphElement>(null)
  const ruleRef       = useRef<HTMLDivElement>(null)
  const leftDrawRef   = useRef<SVGPathElement>(null)
  const rightDrawRef  = useRef<SVGPathElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // ── Initial states ────────────────────────────────────────────────────
      if (eyebrowRef.current)   gsap.set(eyebrowRef.current,   { opacity: 0, y: 16, filter: "blur(4px)" })
      if (headingWrapRef.current) gsap.set(headingWrapRef.current, { opacity: 0, y: 36 })
      if (paraRef.current)      gsap.set(paraRef.current,      { opacity: 0, y: 16, filter: "blur(3px)" })
      if (ruleRef.current)      gsap.set(ruleRef.current,      { opacity: 0, scaleX: 0 })

      // ── 3-phase cascade — same timing concept as DemoSection ─────────────
      //
      // PHASE 1 (t=0.00–0.80):  Eyebrow → heading → para
      // PHASE 2 (t=0.50–1.10):  Accent rule draws + SVG lines trace in
      // PHASE 3 (t=1.00s+):     Cards stagger up one by one — payoff last
      //
      const observer = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        // PHASE 1 — heading content lands first
        if (eyebrowRef.current)
          tl.to(eyebrowRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.60 }, 0)

        if (headingWrapRef.current)
          tl.to(headingWrapRef.current, { opacity: 1, y: 0, duration: 0.78, ease: "power4.out" }, 0.12)

        if (paraRef.current)
          tl.to(paraRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.60 }, 0.40)

        // PHASE 2 — accent rule + SVG lines frame the section
        if (ruleRef.current)
          tl.to(ruleRef.current, { opacity: 1, scaleX: 1, duration: 0.75, ease: "power2.out" }, 0.58)

        ;[leftDrawRef.current, rightDrawRef.current].forEach((el, i) => {
          if (!el) return
          tl.to(el, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.50 + i * 0.08)
        })

        // PHASE 3 — cards arrive as the visual payoff
        // whileInView on each card handles the stagger automatically,
        // but we need them all hidden initially and triggered together.
        // We use a class toggle approach: add .cards-visible to the grid
        // after 1.05s, which lets each card's whileInView fire cleanly.
        tl.call(() => {
          const grid = document.querySelector<HTMLElement>(".svc-card-grid")
          if (grid) grid.dataset.visible = "1"
        }, [], 1.05)

      }, { threshold: 0.06 })

      observer.observe(section)

      // ── Ghost "03" parallax ───────────────────────────────────────────────
      // The text is inside the SVG so we parallax the left lane div instead
      const leftLane = section.querySelector<HTMLElement>(".svc-left-lane")
      const rightLane = section.querySelector<HTMLElement>(".svc-right-lane")
      if (leftLane) {
        gsap.to(leftLane, {
          yPercent: -18, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.6 },
        })
      }
      if (rightLane) {
        gsap.to(rightLane, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.3 },
        })
      }

      return () => observer.disconnect()
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().filter(t => t.vars.trigger === section).forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full py-24 md:py-32"
      style={{ background: T.bg, isolation: "isolate" }}
    >
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND — horizontal mid-band glow (distinct from DemoSection's
          corner orbs). Creates a wide soft indigo bar across the card area.
          ════════════════════════════════════════════════════════════════════ */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>

        {/* Wide horizontal band — indigo, across card zone (45–80% vertical) */}
        <div style={{
          position: "absolute",
          top: "30%", left: "-10%", right: "-10%",
          height: "50%",
          background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}/>

        {/* Top-left soft accent */}
        <div style={{
          position: "absolute", top: "-5%", left: "5%",
          width: "28vw", height: "28vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}/>

        {/* Bottom-right soft accent */}
        <div style={{
          position: "absolute", bottom: "-5%", right: "5%",
          width: "28vw", height: "28vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}/>

        {/* Top hairline */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1.5,
          background: "linear-gradient(90deg, transparent 5%, rgba(99,102,241,0.32) 25%, rgba(99,102,241,0.56) 50%, rgba(99,102,241,0.32) 75%, transparent 95%)",
        }}/>

        {/* Bottom hairline */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5,
          background: "linear-gradient(90deg, transparent 5%, rgba(99,102,241,0.20) 30%, rgba(99,102,241,0.38) 50%, rgba(99,102,241,0.20) 70%, transparent 95%)",
        }}/>

        {/* Dot grid — full width but very faint, gives tech texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(26,31,46,0.09) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: [
            "radial-gradient(ellipse 30% 90% at 0%   50%, black 0%, transparent 70%)",
            "radial-gradient(ellipse 30% 90% at 100% 50%, black 0%, transparent 70%)",
          ].join(", "),
          maskImage: [
            "radial-gradient(ellipse 30% 90% at 0%   50%, black 0%, transparent 70%)",
            "radial-gradient(ellipse 30% 90% at 100% 50%, black 0%, transparent 70%)",
          ].join(", "),
          WebkitMaskComposite: "destination-over",
          maskComposite: "add",
        } as React.CSSProperties}/>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MARGIN ART — thin SVG circuit lines in left & right lanes.
          Strictly 12vw wide, overflow-hidden, zIndex:1.
          These draw in on scroll and have mild parallax.
          ════════════════════════════════════════════════════════════════════ */}
      <div className="svc-left-lane absolute left-0 top-0 h-full pointer-events-none overflow-hidden"
        aria-hidden style={{ width: "12vw", zIndex: 1 }}>
        <LeftMarginArt drawRef={leftDrawRef}/>
      </div>

      <div className="svc-right-lane absolute right-0 top-0 h-full pointer-events-none overflow-hidden"
        aria-hidden style={{ width: "12vw", zIndex: 1 }}>
        <RightMarginArt drawRef={rightDrawRef}/>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          CONTENT
          ════════════════════════════════════════════════════════════════════ */}
      <div className="relative" style={{ zIndex: 2 }}>

        {/* Heading area */}
        <div className="text-center max-w-3xl mx-auto px-6 mb-4">

          {/* Eyebrow */}
          <p ref={eyebrowRef}
            className="font-robert text-xs font-bold uppercase tracking-[0.3em] mb-5"
            style={{ color: T.accent, opacity: 0 }}>
            Project Packages
          </p>

          {/* Heading — AnimatedTitle preserved exactly as original */}
          <div ref={headingWrapRef} style={{ opacity: 0 }}>
            <AnimatedTitle
              title="Build Your Student <br /> Project Faster"
              containerClass="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-5 font-neulis"
            />
          </div>

          {/* Para */}
          <p ref={paraRef}
            className="font-robert text-base md:text-lg leading-relaxed font-medium mt-2"
            style={{ color: T.sub, opacity: 0 }}>
            Choose a project tier that fits your assignment or portfolio requirements.
          </p>
        </div>

        {/* Accent rule with dots — visual separator between heading and cards */}
        <AccentRule ruleRef={ruleRef}/>

        {/* ── Card grid — cards wait for PHASE 3 trigger, then cascade in ── */}
        <div className="svc-card-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                // Start hidden — only animates after data-visible="1" is set on parent
                // whileInView fires immediately since cards ARE in viewport by phase 3
                initial={{ opacity: 0, y: 56, scale: 0.93, rotateX: 6 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.70,
                  delay: index * 0.13,          // 0s, 0.13s, 0.26s, 0.39s — dealt cascade
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformPerspective: 800 }}
              >
                <CardFlip
                  title={tier.name}
                  subtitle={tier.subtitle}
                  description={tier.description}
                  features={tier.features}
                  price={tier.price}
                  image={tier.image}
                  accentColor={tier.accentColor}
                  className={tier.featured ? "scale-[1.04] z-10" : ""}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 mt-14 md:mt-18"
        >
          <p className="font-robert text-xs text-zinc-400 tracking-widest uppercase">
            Not sure which tier fits?
          </p>
          <a
            href="#req_a_project"
            onClick={e => {
              e.preventDefault()
              document.getElementById("req_a_project")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-2 font-robert font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(99,102,241,0.08)",
              color: T.accent,
              border: "1.5px solid rgba(99,102,241,0.20)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = T.accent
              el.style.color = "#fff"
              el.style.borderColor = T.accent
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = "rgba(99,102,241,0.08)"
              el.style.color = T.accent
              el.style.borderColor = "rgba(99,102,241,0.20)"
            }}
          >
            Request a custom quote
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  )
}