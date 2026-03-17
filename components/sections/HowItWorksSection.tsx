"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedTitle from "../AnimatedTitle"
import ClayAirplane from "../Airplane"
import FloatingShapes from "../FloatingShapes"

gsap.registerPlugin(ScrollTrigger)

interface TechItem { icon: string; label: string; color: string }

const TECH: TechItem[] = [
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",           label: "Next.js",   color: "#000000" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",              label: "React",     color: "#61DAFB" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",             label: "Node.js",   color: "#339933" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",  label: "Tailwind",  color: "#06B6D4" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",           label: "MongoDB",   color: "#47A248" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",     label: "Prisma",    color: "#2D3748" },
]

const PARTICLES = [
  { w: 10, h: 10, top: "18%", left: "12%", bg: "#6366f1" },
  { w: 7,  h: 7,  top: "70%", left: "20%", bg: "#f59e0b" },
  { w: 12, h: 12, top: "30%", left: "55%", bg: "#10b981" },
  { w: 8,  h: 8,  top: "75%", left: "62%", bg: "#f43f5e" },
  { w: 6,  h: 6,  top: "20%", left: "75%", bg: "#6366f1" },
  { w: 9,  h: 9,  top: "60%", left: "80%", bg: "#f59e0b" },
  { w: 7,  h: 7,  top: "45%", left: "38%", bg: "#10b981" },
  { w: 11, h: 11, top: "82%", left: "45%", bg: "#6366f1" },
]

function SplitWord({ word, style = {} }: { word: string; style?: React.CSSProperties }) {
  return (
    <span className="inline-block overflow-hidden leading-none align-bottom">
      <span className="word-inner inline-block" style={style}>{word}</span>
    </span>
  )
}

function Orb({ size, top, left, right, bottom, color, blur, anim }: {
  size: string; top?: string; left?: string; right?: string
  bottom?: string; color: string; blur: number; anim: string
}) {
  return (
    <div aria-hidden className="absolute rounded-full pointer-events-none" style={{
      width: size, height: size, top, left, right, bottom,
      background: `radial-gradient(circle, ${color} 30%, transparent 70%)`,
      filter: `blur(${blur}px)`, animation: anim, willChange: "transform",
    }} />
  )
}

function TiltCard({ children, className = "", style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 16
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 16
    el.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.04)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)" }
  return (
    <div ref={ref} className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

function StepGap({ stepNum, children }: { stepNum: string; children?: React.ReactNode }) {
  return (
    // ✅ z-20 so gap content sits above FloatingShapes (z-5)
    <div className="progress-arrow relative z-20 shrink-0 flex flex-col items-center justify-center gap-4 px-6"
      style={{ width: "18vw" }}>
      <span className="font-neulis font-black leading-none select-none"
        style={{ fontSize: "clamp(4rem,7vw,6.5rem)", color: "transparent", WebkitTextStroke: "2px #c7d2fe" }}>
        {stepNum}
      </span>
      {children}
      <div className="flex items-center gap-2 mt-1">
        <div className="h-px bg-linear-to-r from-transparent via-indigo-300 to-indigo-400" style={{ width: 48 }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 8h12M9 3l5 5-5 5" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-indigo-100/60 bg-linear-to-br from-indigo-50/90 to-white/95 shadow-sm">
      <CardContent className="px-4 py-3 text-center">
        <p className="text-[10px] text-indigo-400 font-robert font-bold tracking-wider uppercase mb-0.5">{label}</p>
        <p className="text-xl font-black text-zinc-900 font-neulis leading-none">{value}</p>
      </CardContent>
    </Card>
  )
}

export default function HowItWorksSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const airplaneRef  = useRef<HTMLDivElement>(null)
  const trackWrapRef  = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [shapesReady, setShapesReady] = useState<{
    hTween: gsap.core.Tween;
    trackWidth: number;
    totalScroll: number;
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready
      } catch (_) {}
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      if (!cancelled) setReady(true)
    }
    init()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!ready) return
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    ScrollTrigger.refresh()
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      const els = gsap.utils.toArray<HTMLElement>(".scene-mobile")
      gsap.set(els, { opacity: 0, y: 60 })
      els.forEach(el => gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
      }))
      return
    }

    const totalScroll = track.scrollWidth - window.innerWidth

    // Pin at the trackWrap div so heading scrolls past first
    const pinTrigger = trackWrapRef.current ?? section
    
    // Smooth heading transition — fades out as we hit the pin
    gsap.fromTo(".howitworks-heading", 
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: pinTrigger,
          start: "top 25%", // Start fading earlier
          end: "top top",
          scrub: true,
        }
      }
    )

    const hTween = gsap.to(track, {
      x: -totalScroll, ease: "none",
      scrollTrigger: {
        trigger: pinTrigger,
        start: "top top", // Reverting to top top for cleaner alignment
        end: () => `+=${totalScroll}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        // Ensure the section is fully visible when pinned
        onEnter:     () => gsap.set(section, { opacity: 1, visibility: "visible" }),
        onLeave:     () => gsap.to(section, { opacity: 0, duration: 0.2 }),
        onEnterBack: () => gsap.to(section, { opacity: 1, duration: 0.2 }),
      },
    })

    setShapesReady({ hTween, trackWidth: track.scrollWidth, totalScroll })

    gsap.to(section, {
      backgroundColor: "#eef2ff", ease: "none",
      scrollTrigger: { trigger: pinTrigger, start: "top+=1 top", end: () => `+=${totalScroll * 0.65}`, scrub: 1 },
    })
    gsap.to(section, {
      backgroundColor: "#ffffff", ease: "none",
      scrollTrigger: { trigger: ".scene-4", containerAnimation: hTween, start: "left 60%", end: "left 10%", scrub: 1 },
    })

    // Airplane
    const planeEl = airplaneRef.current
    if (planeEl) {
      // 1. Horizontal movement synchronized with the horizontal scroll
      gsap.to(planeEl, {
        x: track.scrollWidth - 180, 
        ease: "none",
        scrollTrigger: { 
          trigger: pinTrigger, 
          start: "top top", 
          end: () => `+=${totalScroll}`, 
          scrub: 1, // Matches track scrub for perfect sync
          invalidateOnRefresh: true,
        },
      })

      // 2. Idle animations (independent of scroll)
      gsap.to(planeEl, { 
        y: "-=25", 
        ease: "sine.inOut", 
        yoyo: true, 
        repeat: -1, 
        duration: 2.2 
      })
      gsap.to(planeEl, { 
        rotation: -4, 
        ease: "sine.inOut", 
        yoyo: true, 
        repeat: -1, 
        duration: 3.1 
      })

      // 3. Scene-specific altitude and rotation changes
      // These will be additive to the base horizontal movement
      ;[
        { trigger: ".scene-1", y: -15, rot:  4 },
        { trigger: ".scene-2", y: -50, rot: -10 },
        { trigger: ".scene-3", y: -25, rot:  6 },
        { trigger: ".scene-4", y: -70, rot: -15 },
      ].forEach(({ trigger, y, rot }) => {
        gsap.to(planeEl, {
          y, 
          rotation: rot, 
          ease: "power2.inOut",
          scrollTrigger: { 
            trigger, 
            containerAnimation: hTween, 
            start: "left 85%", 
            end: "left 15%", 
            scrub: 1.2 
          },
        })
      })
    }

    const ct = (trigger: string) => ({ trigger, containerAnimation: hTween })

    function words(sel: string, scene: string) {
      const els = gsap.utils.toArray<HTMLElement>(sel)
      if (!els.length) return
      gsap.set(els, { opacity: 0, y: 70, filter: "blur(8px)" })
      gsap.to(els, { opacity: 1, y: 0, filter: "blur(0px)", ease: "power3.out", stagger: 0.06,
        scrollTrigger: { ...ct(scene), start: "left 85%", end: "left 30%", scrub: 0.5 } })
    }

    function fade(sel: string, from: gsap.TweenVars, scene: string, start = "left 80%", end = "left 25%") {
      const els = gsap.utils.toArray<HTMLElement>(sel)
      if (!els.length) return
      gsap.set(els, { opacity: 0, ...from })
      gsap.to(els, { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", ease: "power3.out",
        stagger: (from.stagger as number) ?? 0,
        scrollTrigger: { ...ct(scene), start, end, scrub: 1 } })
    }

    words(".s1-words .word-inner", ".scene-1")
    fade(".s1-para",   { y: 24 },             ".scene-1", "left 70%", "left 20%")
    fade(".s1-card",   { y: 40, scale: 0.92 }, ".scene-1", "left 65%", "left 15%")
    gsap.set(".svg-path", { strokeDashoffset: 320 })
    gsap.to(".svg-path",  { strokeDashoffset: 0, ease: "power2.inOut",
      scrollTrigger: { ...ct(".scene-1"), start: "left 75%", end: "left 25%", scrub: 1 } })

    words(".s2-words .word-inner", ".scene-2")
    const badges = gsap.utils.toArray<HTMLElement>(".tech-badge")
    gsap.set(badges, { opacity: 0, scale: 0.7, y: 20 })
    gsap.to(badges, { opacity: 1, scale: 1, y: 0, stagger: 0.06, ease: "back.out(1.7)",
      scrollTrigger: { ...ct(".scene-2"), start: "left 70%", end: "left 15%", scrub: 1 } })
    fade(".mockup-card", { x: 80, scale: 0.9 }, ".scene-2", "left 72%", "left 22%")
    fade(".s2-quote",    { y: 20 },              ".scene-2", "left 60%", "left 15%")

    const arrows = gsap.utils.toArray<HTMLElement>(".progress-arrow")
    gsap.set(arrows, { opacity: 0, x: -20 })
    arrows.forEach(a => gsap.to(a, { opacity: 1, x: 0,
      scrollTrigger: { trigger: a, containerAnimation: hTween, start: "left 88%", end: "left 48%", scrub: 1 } }))

    gsap.set(".s3-heading", { opacity: 0, filter: "blur(12px)" })
    gsap.to(".s3-heading",  { opacity: 1, filter: "blur(0px)",
      scrollTrigger: { ...ct(".scene-3"), start: "left 80%", end: "left 35%", scrub: 1 } })
    const checks = gsap.utils.toArray<HTMLElement>(".check-item")
    gsap.set(checks, { opacity: 0, x: -30 })
    checks.forEach((el, i) => gsap.to(el, { opacity: 1, x: 0,
      scrollTrigger: { ...ct(".scene-3"), start: `left ${75 - i * 5}%`, end: `left ${30 - i * 5}%`, scrub: 1 } }))
    fade(".s3-side", { x: 60, scale: 0.94 }, ".scene-3", "left 72%", "left 20%")

    gsap.set(".delivered-text", { opacity: 0, scale: 0.82 })
    gsap.to(".delivered-text",  { opacity: 1, scale: 1,
      scrollTrigger: { ...ct(".scene-4"), start: "left 85%", end: "left 30%", scrub: 1 } })
    gsap.set(".cta-btn",  { opacity: 0, scale: 0.75 })
    gsap.to(".cta-btn",   { opacity: 1, scale: 1, ease: "elastic.out(1,0.5)",
      scrollTrigger: { ...ct(".scene-4"), start: "left 60%", end: "left 20%", scrub: 1 } })
    const parts = gsap.utils.toArray<HTMLElement>(".particle")
    gsap.set(parts, { opacity: 0, scale: 0, y: 40 })
    parts.forEach((p, i) => gsap.to(p, { opacity: 0.7, scale: 1, y: 0,
      scrollTrigger: { ...ct(".scene-4"), start: `left ${58 - i * 3}%`, end: `left ${20 - i * 2}%`, scrub: 1 } }))
    fade(".s4-badge", { y: 20 }, ".scene-4", "left 50%", "left 15%")

    ScrollTrigger.refresh()
    return () => {
      // Safe cleanup — kill only triggers we created, not all global ones
      // Revert instead of kill to properly restore pinned DOM state
      ScrollTrigger.getAll().forEach(t => {
        try { t.kill(true) } catch (_) {}
      })
      // Let GSAP clean up any lingering pin spacers
      try { ScrollTrigger.clearScrollMemory() } catch (_) {}
    }
  }, [ready])

  return (
    <section
      ref={sectionRef}
      id="how_it_works"
      className="relative w-full bg-white"
      style={{ willChange: "background-color" }}
    >
      <h2 className="sr-only">How It Works — 4 Steps to Your Project</h2>

      {/* ── Orbs: z-0 — furthest back ──────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <Orb size="55vw" top="-15%" left="-10%"    color="rgba(99,102,241,0.10)"  blur={90}  anim="orbA 16s ease-in-out infinite" />
        <Orb size="45vw" bottom="-12%" right="-8%"  color="rgba(139,92,246,0.08)"  blur={80}  anim="orbB 20s ease-in-out infinite" />
        <Orb size="35vw" top="25%"  left="38%"     color="rgba(56,189,248,0.06)"  blur={100} anim="orbC 24s ease-in-out infinite" />
        <Orb size="30vw" top="-5%"  right="8%"     color="rgba(244,114,182,0.05)" blur={75}  anim="orbD 18s ease-in-out infinite" />
        <Orb size="25vw" bottom="5%" left="20%"    color="rgba(16,185,129,0.05)"  blur={85}  anim="orbE 22s ease-in-out infinite" />
      </div>



      <style>{`
        @keyframes orbA{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-20px) scale(1.07)}66%{transform:translate(-16px,14px) scale(0.95)}}
        @keyframes orbB{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-22px,24px) scale(1.09)}70%{transform:translate(18px,-12px) scale(0.93)}}
        @keyframes orbC{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(20px,18px) scale(1.06)}75%{transform:translate(-24px,-9px) scale(0.96)}}
        @keyframes orbD{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,22px) scale(1.08)}}
        @keyframes orbE{0%,100%{transform:translate(0,0) scale(1)}45%{transform:translate(16px,-14px) scale(1.05)}80%{transform:translate(-10px,10px) scale(0.97)}}
        @keyframes bobFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.2);opacity:0}}
      `}</style>

      {/* ── MOBILE ─────────────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col gap-20 py-20 px-6 relative z-10">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 bg-indigo-50 text-indigo-600 border-indigo-100 font-robert text-[10px] tracking-widest uppercase">
            The Process
          </Badge>
          <AnimatedTitle title="How it Works"
            containerClass="text-[clamp(2.4rem,10vw,4rem)] font-black text-zinc-900 leading-tight font-neulis" />
          <p className="text-zinc-400 text-sm font-robert mt-3 max-w-xs mx-auto leading-relaxed">
            From rough idea to working product — in 4 clear steps.
          </p>
        </div>
        {[
          { step:"01", title:"Tell me what you need", desc:"Share your idea or brief. No jargon needed.",          icon:"💬" },
          { step:"02", title:"I build it for you",     desc:"Right stack, clean code, modern tools.",                icon:"⚡" },
          { step:"03", title:"You review & approve",   desc:"Live preview. Request changes. Sign off.",              icon:"✅" },
          { step:"04", title:"Delivered. Done.",        desc:"Code + deployment + docs. Handed over clean.",         icon:"🚀" },
        ].map((s) => (
          <div key={s.step} className="scene-mobile flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl">{s.icon}</div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step {s.step}</span>
              <h3 className="text-xl font-black text-zinc-900 leading-tight font-neulis">{s.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-robert">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP heading: sits in normal flow ABOVE the pinned track ─────── */}
      {/* This div is the scroll trigger anchor — GSAP pins the section */}
      {/* The heading scrolls away naturally before the pin kicks in */}
      <div className="howitworks-heading hidden md:flex flex-col items-center gap-3 pt-16 pb-8 relative z-50 pointer-events-none">
        <Badge variant="secondary" className="bg-indigo-50 text-indigo-500 border-indigo-100 font-robert text-[10px] tracking-[0.2em] uppercase pointer-events-auto">
          The Process
        </Badge>
        <AnimatedTitle title="How it Works"
          containerClass="text-center text-[clamp(2.8rem,5vw,5rem)] font-black text-zinc-900 leading-none tracking-tight font-neulis" />
        <p className="text-zinc-400 text-xs font-robert tracking-wide">Scroll to travel through the journey →</p>
      </div>

      {/* ── DESKTOP track wrapper — pin trigger ────────────────────────────── */}
      <div ref={trackWrapRef} className="hidden md:block relative">
        {/* FloatingShapes inside pinned wrapper — absolute positioning = viewport during pin */}
        {shapesReady && (
          <FloatingShapes
            hTween={shapesReady.hTween}
            sectionEl={trackWrapRef.current}
            trackWidth={shapesReady.trackWidth}
            totalScroll={shapesReady.totalScroll}
          />
        )}
      <div ref={trackRef} className="flex h-screen items-center relative z-10"
        style={{ width: "460vw", willChange: "transform" }}>

        {/* Airplane: z-30 — above scenes (z-20) and shapes (z-5) */}
        <div
          ref={airplaneRef}
          className="absolute z-30 pointer-events-none"
          style={{ 
            top: "55%", 
            left: 0, 
            transform: "translateX(32px)", 
            willChange: "transform",
            filter: "drop-shadow(4px 8px 12px rgba(0,0,0,0.18))" 
          }}
        >
          <div className="absolute right-full top-1/2 -translate-y-1/2 flex items-center" style={{ width: 80 }}>
            <div className="h-px w-full bg-linear-to-l from-indigo-300/60 via-indigo-200/30 to-transparent" />
            <div className="absolute top-1 h-px w-3/4 bg-linear-to-l from-indigo-200/40 to-transparent translate-y-2" />
          </div>
          {[0,1,2].map(i => (
            <div key={i} className="absolute rounded-full bg-white/50"
              style={{ width: 6-i, height: 6-i, right:`${32+i*22}px`, top:"50%",
                transform:"translateY(-50%)", animation:`pulse-ring ${0.8+i*0.3}s ease-out infinite`,
                animationDelay:`${i*0.15}s` }} />
          ))}
          <ClayAirplane style={{ width: 160, height: "auto" }} />
        </div>



        {/* SCENE 1: z-20 */}
        <div className="scene scene-1 relative z-20 shrink-0 w-screen h-screen flex items-center px-[8vw] gap-12">
          <div className="flex flex-col gap-5 max-w-[48vw]">
            <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 01</span>
            <div className="s1-words flex flex-wrap items-end gap-x-4 gap-y-1 leading-none">
              <SplitWord word="Tell"  style={{ fontSize:"clamp(3.5rem,8vw,8rem)",     fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="me"    style={{ fontSize:"clamp(1.5rem,3vw,3rem)",     fontWeight:700, color:"#6366f1", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="what"  style={{ fontSize:"clamp(3rem,6.5vw,7rem)",     fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="you"   style={{ fontSize:"clamp(1.2rem,2.5vw,2.5rem)", fontWeight:700, color:"#a1a1aa", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="need." style={{ fontSize:"clamp(3.5rem,7.5vw,8rem)",   fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
            </div>
            <p className="s1-para text-zinc-500 text-lg leading-relaxed max-w-sm font-robert">
              Share your idea, assignment brief, or project goal. No tech jargon — just tell me what you want.
            </p>
            <svg width="140" height="50" viewBox="0 0 140 50" fill="none" aria-hidden>
              <path className="svg-path" d="M8 25 Q35 5 60 25 Q85 45 110 25 Q125 12 136 25"
                stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" fill="none"
                strokeDasharray="320" strokeDashoffset="0" />
            </svg>
          </div>
          <div className="s1-card flex flex-col gap-3 max-w-[22vw]">
            <Badge className="self-start bg-indigo-50 text-indigo-600 border-indigo-100 font-robert text-[10px] tracking-wider">💬 Your message</Badge>
            {[
              { msg:"I need a project management app", mine:true  },
              { msg:"Got it — MERN stack with auth?",  mine:false },
              { msg:"Yes, + kanban board please",       mine:true  },
              { msg:"On it. ETA 48 hrs ⚡",             mine:false },
            ].map((b,i) => (
              <div key={i} className={`flex ${b.mine?"justify-end":"justify-start"}`}>
                <div className="rounded-2xl px-4 py-2.5 max-w-[90%] font-robert text-xs leading-relaxed"
                  style={{
                    background: b.mine ? "linear-gradient(135deg,#6366f1,#818cf8)" : "linear-gradient(135deg,rgba(255,255,255,0.95),rgba(238,242,255,0.90))",
                    color: b.mine ? "#fff" : "#3f3f46",
                    border: b.mine ? "none" : "1px solid rgba(199,210,254,0.5)",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.10)",
                    borderRadius: b.mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  }}>{b.msg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GAP 1→2 */}
        <StepGap stepNum="02">
          <Card className="w-full border-indigo-100/60 bg-linear-to-br from-indigo-50/90 to-white shadow-sm">
            <CardContent className="px-4 py-3 text-center">
              <p className="text-[10px] text-indigo-400 font-robert font-bold tracking-wider uppercase mb-1">Response time</p>
              <p className="text-2xl font-black text-zinc-900 font-neulis leading-none">{"< 2 hrs"}</p>
            </CardContent>
          </Card>
        </StepGap>

        {/* SCENE 2: z-20 */}
        <div className="scene scene-2 relative z-20 shrink-0 w-screen h-screen flex items-center px-[8vw] gap-10">
          <div className="flex flex-col gap-5 max-w-[44vw]">
            <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 02</span>
            <div className="s2-words flex flex-wrap items-end gap-x-3 gap-y-1 leading-none">
              <SplitWord word="I"      style={{ fontSize:"clamp(1.5rem,3vw,3rem)",     fontWeight:700, color:"#a1a1aa", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="Build"  style={{ fontSize:"clamp(3.5rem,8vw,8.5rem)",   fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="it"     style={{ fontSize:"clamp(1.5rem,2.8vw,3rem)",   fontWeight:700, color:"#6366f1", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="for"    style={{ fontSize:"clamp(1.2rem,2.2vw,2.2rem)", fontWeight:600, color:"#a1a1aa", fontFamily:"var(--font-neulis)" }} />
              <SplitWord word="you."   style={{ fontSize:"clamp(3rem,7vw,7.5rem)",     fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {TECH.map(t => (
                <span key={t.label} className="tech-badge inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border font-robert"
                  style={{ background:`${t.color}12`, color:t.color==="#000000"?"#18181b":t.color, borderColor:`${t.color}25` }}>
                  <img src={t.icon} alt={t.label} width={13} height={13} className="shrink-0" loading="lazy" />
                  {t.label}
                </span>
              ))}
            </div>
            <Badge variant="outline" className="s2-quote self-start font-robert text-xs text-zinc-500 border-zinc-200 mt-1">
              ✦ Clean code. Real-world patterns.
            </Badge>
          </div>
          <TiltCard className="mockup-card shrink-0 w-60 rounded-3xl overflow-hidden border border-white/90"
            style={{ background:"linear-gradient(150deg,rgba(255,255,255,0.92),rgba(238,242,255,0.85))",
              backdropFilter:"blur(20px)", boxShadow:"0 2px 0 1px rgba(0,0,0,0.03),0 12px 32px rgba(99,102,241,0.12),0 28px 56px rgba(0,0,0,0.08)" } as React.CSSProperties}>
            <div className="h-32 bg-linear-to-br from-indigo-100 to-violet-100 flex items-center justify-center relative overflow-hidden">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="" width={40} height={40} className="opacity-20 absolute left-3 bottom-2" loading="lazy" />
              <span className="text-3xl relative z-10">⚡</span>
            </div>
            <div className="p-4 flex flex-col gap-1.5">
              <div className="h-2.5 rounded-full bg-zinc-200 w-3/4" />
              <div className="h-2 rounded-full bg-zinc-100 w-1/2" />
              <div className="h-2 rounded-full bg-zinc-100 w-2/3 mt-1" />
              <div className="mt-3 h-7 rounded-xl bg-zinc-900 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold tracking-wider">VIEW PROJECT</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* GAP 2→3 */}
        <StepGap stepNum="03">
          <div className="flex flex-col gap-2 w-full">
            <StatCard label="Avg. turnaround" value="48 hrs" />
            <StatCard label="Revisions"        value="Unlimited" />
          </div>
        </StepGap>

        {/* SCENE 3: z-20 */}
        <div className="scene scene-3 relative z-20 shrink-0 w-screen h-screen flex items-center px-[8vw] gap-14">
          <div className="flex flex-col gap-7 max-w-[50vw]">
            <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 03</span>
            <h2 className="s3-heading font-neulis font-black text-zinc-900 leading-[1.0] tracking-tight"
              style={{ fontSize:"clamp(3.5rem,7.5vw,8rem)" }}>
              You review<br /><span className="text-indigo-500">&amp;</span> approve.
            </h2>
            <div className="flex flex-col gap-3">
              {["Live preview link shared instantly","Request unlimited revisions","Changes made within 24 hours","Sign off when it's perfect"].map((item,i) => (
                <div key={i} className="check-item flex items-center gap-3 group cursor-default">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-200">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-zinc-600 text-base font-robert group-hover:text-zinc-900 transition-colors duration-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <TiltCard className="s3-side shrink-0 w-56 rounded-3xl overflow-hidden border border-indigo-100/60"
            style={{ background:"linear-gradient(150deg,rgba(238,242,255,0.95),rgba(255,255,255,0.90))", boxShadow:"0 8px 32px rgba(99,102,241,0.10)" } as React.CSSProperties}>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 font-robert">Preview Ready</span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="rounded-xl overflow-hidden border border-zinc-100">
                <div className="bg-zinc-50 flex items-center gap-1.5 px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-red-300" />
                  <span className="w-2 h-2 rounded-full bg-yellow-300" />
                  <span className="w-2 h-2 rounded-full bg-green-300" />
                  <span className="ml-2 flex-1 h-2 rounded bg-zinc-200 text-[7px] text-zinc-400 flex items-center px-1.5 font-robert">yourproject.vercel.app</span>
                </div>
                <div className="bg-white p-3 space-y-1.5">
                  <div className="h-2 rounded bg-zinc-100 w-full" />
                  <div className="h-2 rounded bg-indigo-100 w-3/4" />
                  <div className="h-2 rounded bg-zinc-100 w-1/2" />
                </div>
              </div>
              <Badge variant="secondary" className="self-center bg-green-50 text-green-600 border-green-100 text-[10px] font-robert">✓ Approved</Badge>
            </div>
          </TiltCard>
        </div>

        {/* GAP 3→4 */}
        <StepGap stepNum="04">
          <Card className="w-full border-indigo-100/60 bg-linear-to-br from-indigo-50/90 to-white shadow-sm">
            <CardContent className="px-4 py-3 text-center">
              <p className="text-[10px] text-indigo-400 font-robert font-bold tracking-wider uppercase mb-1">Final step</p>
              <p className="text-base font-black text-zinc-900 font-neulis leading-snug">Almost<br />there 🎉</p>
            </CardContent>
          </Card>
        </StepGap>

        {/* SCENE 4: z-20 */}
        <div className="scene scene-4 relative z-20 shrink-0 w-screen h-screen flex items-center px-[8vw] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {PARTICLES.map((p,i) => (
              <span key={i} className="particle absolute rounded-full"
                style={{ width:p.w, height:p.h, top:p.top, left:p.left, backgroundColor:p.bg }} />
            ))}
          </div>
          <div className="flex flex-col gap-7 relative z-10">
            <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 04</span>
            <div className="delivered-text leading-none">
              <span className="font-neulis font-black block"
                style={{ fontSize:"clamp(4rem,10vw,11rem)", color:"transparent", WebkitTextStroke:"3px #18181b", letterSpacing:"-0.03em" }}>
                DELIVERED.
              </span>
              <span className="font-neulis font-black block"
                style={{ fontSize:"clamp(4rem,10vw,11rem)", color:"#18181b", letterSpacing:"-0.03em" }}>
                DONE.
              </span>
            </div>
            <p className="text-zinc-500 text-lg max-w-sm leading-relaxed font-robert">
              Source code, deployment guide, and documentation — all handed over clean and ready.
            </p>
            <div className="s4-badge flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 font-robert text-xs">✓ Source Code</Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-robert text-xs">✓ Deployed</Badge>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 font-robert text-xs">✓ Documented</Badge>
            </div>
            <Button
              className="cta-btn self-start font-robert font-bold text-sm px-8 py-4 rounded-2xl bg-zinc-900 text-white tracking-wide hover:bg-indigo-600 transition-colors duration-300 h-auto"
              style={{ boxShadow:"0 4px 0 #3730a3, 0 8px 24px rgba(99,102,241,0.25)" }}
              onClick={() => document.getElementById("req_a_project")?.scrollIntoView({ behavior:"smooth" })}
            >
              Request a Project →
            </Button>
          </div>
        </div>

      </div>
      </div>{/* end trackWrap */}
    </section>
  )
}