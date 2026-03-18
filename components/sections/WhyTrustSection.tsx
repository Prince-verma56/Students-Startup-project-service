"use client"

// ─────────────────────────────────────────────────────────────────────────────
// WhyTrustSection.tsx — "Why Trust Me"
//
// LAYOUT: Your 3D model fills the center of the viewport. Content orbits it.
//
// MODEL CONTAINER:
//   • Absolutely positioned, full viewport height, centered horizontally
//   • Width: 42vw, max 560px — wide enough to show full body
//   • NO background color, NO border-radius clip — pure transparent Canvas
//   • scroll progress (0→1) passed to ModelViewer → drives Y rotation
//   • Apple-style: model slowly rotates as user scrolls through 4 phases
//
// 4 SCROLL PHASES (GSAP pin + boundary triggers):
//   Phase 1 — "Built by Prince."      → 4 glass pills float around model
//   Phase 2 — "Real work, results."   → 3 stat chips right + skill tags left
//   Phase 3 — "Students come back."   → 2 testimonial cards right + guarantees left
//   Phase 4 — "Your deadline = mine." → CTA block right + reply badge
//
// GLASSMORPHISM: pills, stat chips, testi cards all use:
//   backdrop-filter:blur(16px), rgba(255,255,255,0.76), border rgba(99,102,241,0.15)
//
// PILL POSITIONS: scattered around the model organically — not at screen edge
//   Placed relative to the section (not the model div) at roughly:
//   top-center, mid-left, mid-right, bottom-center — visually balanced
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Zap, Clock, CheckCircle } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ── ModelViewer — ssr:false ───────────────────────────────────────────────────
const ModelViewer = dynamic(() => import("../three/ModelViewer"), {
  ssr: false,
  loading: () => <ModelFallback />,
})

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:     "#F9FBFF",
  accent: "#6366F1",
  ink:    "#1A1F2E",
  sub:    "#5A6075",
  muted:  "#9AA0B5",
  green:  "#34D399",
}

// ── Glassmorphism base style ──────────────────────────────────────────────────
const glass: React.CSSProperties = {
  backdropFilter:         "blur(16px)",
  WebkitBackdropFilter:   "blur(16px)",
  background:             "rgba(255,255,255,0.76)",
  border:                 "1px solid rgba(99,102,241,0.15)",
  boxShadow:              "0 4px 24px rgba(26,31,46,0.08), inset 0 1px 0 rgba(255,255,255,0.92)",
}

const glassDark: React.CSSProperties = {
  backdropFilter:         "blur(20px)",
  WebkitBackdropFilter:   "blur(20px)",
  background:             "rgba(255,255,255,0.82)",
  border:                 "1.5px solid rgba(99,102,241,0.14)",
  boxShadow:              "0 2px 0 1px rgba(26,31,46,0.04), 0 10px 32px rgba(26,31,46,0.08), inset 0 1px 0 rgba(255,255,255,0.96)",
}

// ── Smoothstep ────────────────────────────────────────────────────────────────
function smooth(t: number) { return Math.max(0, Math.min(1, t * t * (3 - 2 * t))) }

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value:6,   suffix:"+",  label:"Projects Delivered", color:T.accent, icon:<Zap className="w-4 h-4"/>          },
  { value:0,   suffix:"",   label:"Missed Deadlines",   color:T.green,  icon:<CheckCircle className="w-4 h-4"/>   },
  { value:48,  suffix:"h",  label:"Avg. Delivery Time", color:T.accent, icon:<Clock className="w-4 h-4"/>         },
]

const TESTIMONIALS = [
  {
    quote:  "Got 9/10 for my final year project. Prince delivered in 3 days and explained every line.",
    name:   "Aryan S.", role: "Final Year CSE", avatar: "A", color: T.accent,
  },
  {
    quote:  "Saved my semester. Full-stack app in 2 days and helped me nail the viva.",
    name:   "Priya M.", role: "3rd Year IT",    avatar: "P", color: T.green,
  },
]

// Pills scattered organically — positions are relative to the section viewport
// Left/right roughly 18–28% from center, top/bottom 14–72%
const PILLS = [
  { text:"6+ Projects",    dot:T.accent,   pos:{ top:"13%",  left:"58%" } },
  { text:"0 Late",         dot:T.green,    pos:{ top:"42%",  right:"12%" } },
  { text:"< 2hr Reply",    dot:"#F59E0B",  pos:{ bottom:"30%", left:"12%" } },
  { text:"★★★★★ Aryan S.", dot:"#FBBF24",  pos:{ bottom:"16%", right:"14%" } },
]

const SKILLS = ["Next.js","React","Node.js","MongoDB","Prisma","Tailwind"]

const GUARANTEES = [
  { text:"Source code included",  dot:T.green   },
  { text:"Deployed to Vercel",    dot:T.accent  },
  { text:"Full documentation",    dot:"#F59E0B" },
]

const PHASE_HEADINGS = [
  { eyebrow:"Why Trust Me",        h1:"Built by",        accent:"Prince."            },
  { eyebrow:"What I've Built",     h1:"Real work,",      accent:"real results."      },
  { eyebrow:"Why Students Trust",  h1:"Students",        accent:"come back."         },
  { eyebrow:"Let's Work Together", h1:"Your deadline",   accent:"is my priority."    },
]

// ── CSS fallback model ────────────────────────────────────────────────────────
function ModelFallback() {
  return (
    <div className="w-full h-full flex items-end justify-center pb-8" aria-hidden>
      <div className="flex flex-col items-center" style={{ opacity:0.55 }}>
        <div style={{ width:52,height:52,borderRadius:"50%",
          background:"linear-gradient(145deg,#e8d5bc,#cfa882)",
          border:"2px solid rgba(255,255,255,0.15)",marginBottom:4,position:"relative" }}>
          <div style={{ position:"absolute",top:-7,left:6,right:6,height:14,
            borderRadius:"50% 50% 0 0",background:"#2d1b0e" }}/>
        </div>
        <div style={{ width:64,height:76,borderRadius:"14px 14px 6px 6px",
          background:"linear-gradient(160deg,#6366f1,#4338ca)",
          border:"1.5px solid rgba(255,255,255,0.18)",marginBottom:4 }}/>
        <div style={{ display:"flex",gap:6 }}>
          {[0,1].map(i=>(
            <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
              <div style={{ width:24,height:48,borderRadius:"6px 6px 8px 8px",
                background:"linear-gradient(160deg,#1e1b4b,#312e81)" }}/>
              <div style={{ width:28,height:10,borderRadius:"3px 3px 5px 5px",
                background:"#18181b",marginTop:-2 }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Star row ──────────────────────────────────────────────────────────────────
function Stars() {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {Array.from({length:5},(_,i)=>(
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

// ── Animated stat chip ────────────────────────────────────────────────────────
function StatChip({ s, i, active }: { s:typeof STATS[0]; i:number; active:boolean }) {
  const valRef = useRef<HTMLSpanElement>(null)
  useEffect(()=>{
    if(!active || !valRef.current) return
    gsap.fromTo(valRef.current,
      { innerText:0 },
      { innerText:s.value, duration:1.4, delay:i*0.18, ease:"power2.out",
        snap:{ innerText:1 },
        onUpdate(){ if(valRef.current) valRef.current.innerText = Math.round(Number(valRef.current.innerText))+s.suffix }
      }
    )
  },[active,s.value,s.suffix,i])

  return (
    <div style={{ ...glassDark, borderRadius:14, padding:"13px 18px",
      display:"flex", alignItems:"center", gap:11 }}>
      <span style={{ color:s.color }}>{s.icon}</span>
      <div>
        <span ref={valRef} style={{
          display:"block", fontFamily:"var(--font-neulis,sans-serif)",
          fontWeight:900, fontSize:28, color:T.ink, lineHeight:1, letterSpacing:"-.03em"
        }}>{s.value}{s.suffix}</span>
        <span style={{ display:"block", fontFamily:"var(--font-robert,sans-serif)",
          fontWeight:700, fontSize:10, color:T.muted,
          textTransform:"uppercase", letterSpacing:".1em", marginTop:2 }}>
          {s.label}
        </span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function WhyTrustSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const pinWrapRef  = useRef<HTMLDivElement>(null)

  // element refs for GSAP
  const pillRefs    = useRef<(HTMLDivElement|null)[]>([])
  const statWrapRef = useRef<HTMLDivElement>(null)
  const skillRef    = useRef<HTMLDivElement>(null)
  const testiRef    = useRef<HTMLDivElement>(null)
  const guarRef     = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const headRef     = useRef<HTMLDivElement>(null)
  const progRef     = useRef<HTMLDivElement>(null)
  const glow1Ref    = useRef<HTMLDivElement>(null)
  const glow2Ref    = useRef<HTMLDivElement>(null)

  const [phase,        setPhase]        = useState(0)
  const [scrollProg,   setScrollProg]   = useState(0.5)  // for model rotation
  const [ready,        setReady]        = useState(false)

  // Wait for fonts + 2 RAF
  useEffect(()=>{
    let cancelled = false
    const init = async ()=>{
      try { if(document.fonts?.ready) await document.fonts.ready } catch(_){}
      await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())))
      if(!cancelled) setReady(true)
    }
    init(); return ()=>{ cancelled=true }
  },[])

  useEffect(()=>{
    if(!ready) return
    const section = sectionRef.current
    const pinWrap = pinWrapRef.current
    if(!section || !pinWrap) return

    const mobile = window.innerWidth < 768

    // ── MOBILE ─────────────────────────────────────────────────────────────
    if(mobile){
      section.querySelectorAll<HTMLElement>(".wt-mob").forEach(el=>{
        gsap.fromTo(el,{opacity:0,y:28},{
          opacity:1,y:0,duration:0.7,ease:"power3.out",
          scrollTrigger:{ trigger:el, start:"top 83%", toggleActions:"play none none reverse" }
        })
      })
      return
    }

    // ── DESKTOP ─────────────────────────────────────────────────────────────
    ScrollTrigger.refresh()
    const PHASES  = 4
    const PIN_END = `+=${window.innerHeight * (PHASES + 0.6)}`

    // ── helpers ──────────────────────────────────────────────────────────────
    const show = (el:HTMLElement|null, from:gsap.TweenVars={}, dur=0.55, del=0)=>{
      if(!el) return
      gsap.to(el,{ opacity:1, x:0, y:0, scale:1, duration:dur, delay:del,
        ease:"power3.out", overwrite:"auto" })
    }
    const hide = (el:HTMLElement|null, to:gsap.TweenVars={}, dur=0.38)=>{
      if(!el) return
      gsap.to(el,{ opacity:0, ...to, duration:dur, ease:"power2.in", overwrite:"auto" })
    }

    // initial states
    pillRefs.current.forEach(el=>{ if(el) gsap.set(el,{opacity:0,y:18,scale:0.88}) })
    if(statWrapRef.current) gsap.set(statWrapRef.current,{opacity:0,x:44})
    if(skillRef.current)    gsap.set(skillRef.current,   {opacity:0,y:22})
    if(testiRef.current)    gsap.set(testiRef.current,   {opacity:0,x:44})
    if(guarRef.current)     gsap.set(guarRef.current,    {opacity:0,y:22})
    if(ctaRef.current)      gsap.set(ctaRef.current,     {opacity:0,x:44})

    // ── Master pin trigger ──────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger:  pinWrap,
      start:    "top top",
      end:      PIN_END,
      pin:      true,
      pinSpacing: true,
      scrub:    1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate(self){
        const p = self.progress

        // Progress bar
        if(progRef.current) progRef.current.style.width = `${p*100}%`

        // Model rotation: 0.5 at rest, 0→1 across full scroll
        setScrollProg(p)

        // Phase detection
        const newPhase = Math.min(Math.floor(p * PHASES), PHASES-1)

        // Heading swap + fade
        const step   = 1/PHASES
        const pStart = newPhase * step
        const pEnd   = pStart + step
        let   headO  = 1
        const fadeIn = pStart + step*0.12
        const fadOut = pEnd   - step*0.12
        if(p < fadeIn) headO = smooth((p-pStart)/(fadeIn-pStart))
        if(p > fadOut) headO = 1 - smooth((p-fadOut)/(pEnd-fadOut))

        if(headRef.current){
          const h = PHASE_HEADINGS[newPhase]
          const e = headRef.current.querySelector<HTMLElement>(".wt-ey")
          const l = headRef.current.querySelector<HTMLElement>(".wt-h1")
          const a = headRef.current.querySelector<HTMLElement>(".wt-ac")
          if(e && e.textContent!==h.eyebrow) e.textContent = h.eyebrow
          if(l && l.textContent!==h.h1)      l.textContent = h.h1
          if(a && a.textContent!==h.accent)  a.textContent = h.accent
          headRef.current.style.opacity = String(Math.max(0, headO))
        }

        // Glow intensifies as user goes deeper
        if(glow1Ref.current) glow1Ref.current.style.opacity = String(0.7 + p*0.5)
        if(glow2Ref.current) glow2Ref.current.style.opacity = String(0.4 + p*0.6)

        setPhase(prev => prev !== newPhase ? newPhase : prev)
      },

      onEnter(){
        // Phase 1 pills float in on section enter
        pillRefs.current.forEach((el,i)=>{
          show(el,{y:18,scale:0.88}, 0.60, 0.06+i*0.12)
          // continuous yoyo bob
          gsap.to(el,{
            y:"+=10", ease:"sine.inOut", yoyo:true, repeat:-1,
            duration:2.4+i*0.55, delay:0.7+i*0.15,
          })
        })
      },
    })

    // ── Phase 1→2 (scroll 1.0×vh) ──────────────────────────────────────────
    ScrollTrigger.create({
      trigger: pinWrap,
      start: `top+=${window.innerHeight*1.1} top`,
      end:   `top+=${window.innerHeight*1.9} top`,
      scrub: 1.0,
      onEnter(){
        pillRefs.current.forEach(el=> hide(el,{y:-22,scale:0.90}))
        show(statWrapRef.current,{x:44},0.55,0.05)
        show(skillRef.current,   {y:22},0.55,0.20)
      },
      onLeaveBack(){
        hide(statWrapRef.current,{x:44})
        hide(skillRef.current,   {y:22})
        pillRefs.current.forEach((el,i)=> show(el,{y:18,scale:0.88},0.48,i*0.08))
      },
    })

    // ── Phase 2→3 (scroll 2.1×vh) ──────────────────────────────────────────
    ScrollTrigger.create({
      trigger: pinWrap,
      start: `top+=${window.innerHeight*2.1} top`,
      end:   `top+=${window.innerHeight*2.9} top`,
      scrub: 1.0,
      onEnter(){
        hide(statWrapRef.current,{x:44})
        hide(skillRef.current,   {y:-22})
        show(testiRef.current,{x:44},0.60,0.05)
        show(guarRef.current, {y:22},0.55,0.18)
      },
      onLeaveBack(){
        hide(testiRef.current,{x:44})
        hide(guarRef.current, {y:22})
        show(statWrapRef.current,{x:44},0.55,0.05)
        show(skillRef.current,   {y:22},0.50,0.18)
      },
    })

    // ── Phase 3→4 (scroll 3.1×vh) ──────────────────────────────────────────
    ScrollTrigger.create({
      trigger: pinWrap,
      start: `top+=${window.innerHeight*3.1} top`,
      end:   `top+=${window.innerHeight*3.9} top`,
      scrub: 1.0,
      onEnter(){
        hide(testiRef.current,{x:44})
        hide(guarRef.current, {y:-22})
        show(ctaRef.current,{x:44},0.65,0.05)
      },
      onLeaveBack(){
        hide(ctaRef.current,{x:44})
        show(testiRef.current,{x:44},0.55,0.05)
        show(guarRef.current, {y:22},0.50,0.15)
      },
    })

    return ()=>{
      st.kill()
      ScrollTrigger.getAll().forEach(t=>{ try{ t.kill() }catch(_){} })
    }
  },[ready])

  return (
    <section
      ref={sectionRef}
      id="why_trust_me"
      aria-label="Why Trust Me — About Prince"
      style={{ background:T.bg, isolation:"isolate" }}
      className="relative w-full">

      {/* SEO */}
      <div className="sr-only">
        <h2>Why Trust Me</h2>
        <p>Prince — CS student and full-stack developer. 6+ projects, 0 missed deadlines, 48h average delivery.</p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP
          ════════════════════════════════════════════════════════════════════ */}
      <div ref={pinWrapRef}
        className="relative w-full hidden md:flex items-center justify-center overflow-hidden"
        style={{ height:"100vh" }}>

        {/* ── Background ───────────────────────────────────────────────── */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex:0 }}>
          {/* Glow top-left */}
          <div ref={glow1Ref} style={{
            position:"absolute", top:"-15%", left:"-8%",
            width:"52vw", height:"52vw", borderRadius:"50%",
            background:"radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 68%)",
            filter:"blur(52px)", opacity:0.7,
          }}/>
          {/* Glow bottom-right */}
          <div ref={glow2Ref} style={{
            position:"absolute", bottom:"-18%", right:"-8%",
            width:"46vw", height:"46vw", borderRadius:"50%",
            background:"radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 68%)",
            filter:"blur(46px)", opacity:0.4,
          }}/>
          {/* Center ambient */}
          <div style={{
            position:"absolute", top:"15%", left:"25%",
            width:"50vw", height:"70vh", borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(99,102,241,0.055) 0%,transparent 70%)",
            filter:"blur(40px)",
          }}/>
          {/* Top accent line */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:2,
            background:"linear-gradient(90deg,transparent 5%,rgba(99,102,241,0.30) 25%,rgba(99,102,241,0.58) 50%,rgba(99,102,241,0.30) 75%,transparent 95%)",
          }}/>
          {/* Dot grid — side margins */}
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:"radial-gradient(circle,rgba(26,31,46,0.12) 1px,transparent 1px)",
            backgroundSize:"28px 28px",
            WebkitMaskImage:[
              "radial-gradient(ellipse 18% 88% at 0%   50%,black 0%,transparent 70%)",
              "radial-gradient(ellipse 18% 88% at 100% 50%,black 0%,transparent 70%)",
            ].join(", "),
            maskImage:[
              "radial-gradient(ellipse 18% 88% at 0%   50%,black 0%,transparent 70%)",
              "radial-gradient(ellipse 18% 88% at 100% 50%,black 0%,transparent 70%)",
            ].join(", "),
            WebkitMaskComposite:"destination-over",
            maskComposite:"add",
          } as React.CSSProperties}/>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────── */}
        <div aria-hidden className="absolute bottom-0 left-0 right-0"
          style={{ height:2, background:"rgba(99,102,241,0.08)", zIndex:6 }}>
          <div ref={progRef}
            style={{ height:"100%", width:"0%",
              background:"linear-gradient(to right,#6366f1,#818cf8)",
              borderRadius:"0 1px 1px 0" }}/>
        </div>

        {/* ── MODEL — centered, full height, transparent ───────────────── */}
        {/* Key fix: no borderRadius clip, no bg, sufficient height for full body */}
        <div
          aria-hidden
          style={{
            position:"absolute",
            // Centered horizontally, occupies most of viewport height
            left:"50%", transform:"translateX(-50%)",
            top:0, bottom:0,
            // Wide enough for full body — the canvas handles transparent bg
            width:"clamp(320px,38vw,520px)",
            zIndex:2,
            // NO background, NO borderRadius that clips
            background:"transparent",
            pointerEvents:"none",
          }}>
          <ModelViewer scrollProgress={scrollProg}/>
        </div>

        {/* ── HEADING — top-left ────────────────────────────────────────── */}
        <div ref={headRef}
          style={{
            position:"absolute", top:"14%", left:"7%",
            maxWidth:300, zIndex:5,
          }}>
          <p className="wt-ey font-robert font-bold uppercase"
            style={{ fontSize:11, color:T.accent, letterSpacing:".22em", marginBottom:12 }}>
            {PHASE_HEADINGS[0].eyebrow}
          </p>
          <h2 className="font-neulis font-black leading-[1.04]"
            style={{ fontSize:"clamp(2.2rem,4.8vw,4rem)", color:T.ink, letterSpacing:"-.03em" }}>
            <span className="wt-h1 block">{PHASE_HEADINGS[0].h1}</span>
            <span className="wt-ac block" style={{ color:T.accent }}>
              {PHASE_HEADINGS[0].accent}
            </span>
          </h2>
        </div>

        {/* ── PHASE 1: glass pills ─────────────────────────────────────── */}
        {PILLS.map((pill,i)=>(
          <div
            key={pill.text}
            ref={el=>{ pillRefs.current[i]=el }}
            className="font-robert font-bold"
            style={{
              position:"absolute", ...pill.pos,
              zIndex:5, opacity:0,
              ...glass,
              borderRadius:30, padding:"7px 14px",
              fontSize:12, color:T.ink,
              display:"flex", alignItems:"center", gap:7,
              whiteSpace:"nowrap",
            }}>
            <span style={{
              width:7, height:7, borderRadius:"50%",
              background:pill.dot, flexShrink:0,
              display:"inline-block",
              boxShadow:`0 0 8px ${pill.dot}80`,
            }}/>
            {pill.text}
          </div>
        ))}

        {/* ── PHASE 2: stat chips — right side ─────────────────────────── */}
        <div ref={statWrapRef}
          style={{
            position:"absolute",
            top:"50%", transform:"translateY(-50%)",
            right:"5%", zIndex:5,
            display:"flex", flexDirection:"column", gap:12,
          }}>
          {STATS.map((s,i)=>(
            <StatChip key={s.label} s={s} i={i} active={phase===1}/>
          ))}
        </div>

        {/* PHASE 2: skill tags — left side */}
        <div ref={skillRef}
          style={{
            position:"absolute",
            bottom:"16%", left:"5%",
            zIndex:5, display:"flex", flexWrap:"wrap",
            gap:8, maxWidth:240,
          }}>
          {SKILLS.map(sk=>(
            <span key={sk} className="font-robert font-bold"
              style={{
                ...glass,
                fontSize:11, color:T.accent,
                borderRadius:20, padding:"5px 11px",
              }}>
              {sk}
            </span>
          ))}
        </div>

        {/* ── PHASE 3: testimonial cards — right side ──────────────────── */}
        <div ref={testiRef}
          style={{
            position:"absolute",
            top:"50%", transform:"translateY(-50%)",
            right:"5%", zIndex:5,
            display:"flex", flexDirection:"column", gap:12,
            maxWidth:310,
          }}>
          {TESTIMONIALS.map(t=>(
            <div key={t.name} style={{ ...glassDark, borderRadius:16, padding:"16px 18px" }}>
              <p className="font-robert italic leading-relaxed"
                style={{ fontSize:12.5, color:T.sub, marginBottom:12 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div className="font-neulis font-black"
                  style={{
                    width:28, height:28, borderRadius:"50%",
                    background:`linear-gradient(135deg,${t.color},${t.color}88)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, color:"#fff", flexShrink:0,
                  }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-robert font-bold"
                    style={{ fontSize:11.5, color:T.ink }}>
                    {t.name}{" "}
                    <span style={{ color:T.muted, fontWeight:400 }}>· {t.role}</span>
                  </p>
                  <Stars/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PHASE 3: guarantee pills — left side */}
        <div ref={guarRef}
          style={{
            position:"absolute",
            bottom:"16%", left:"5%",
            zIndex:5, display:"flex", flexDirection:"column", gap:8,
          }}>
          {GUARANTEES.map(g=>(
            <div key={g.text} className="font-robert font-bold"
              style={{
                ...glass, borderRadius:30,
                padding:"6px 13px", fontSize:12, color:T.ink,
                display:"inline-flex", alignItems:"center", gap:8,
              }}>
              <span style={{
                width:7, height:7, borderRadius:"50%",
                background:g.dot, display:"inline-block", flexShrink:0,
                boxShadow:`0 0 7px ${g.dot}80`,
              }}/>
              {g.text}
            </div>
          ))}
        </div>

        {/* ── PHASE 4: CTA — right side ────────────────────────────────── */}
        <div ref={ctaRef}
          style={{
            position:"absolute",
            top:"14%", right:"5%",
            zIndex:5, display:"flex", flexDirection:"column",
            alignItems:"flex-end", gap:16, maxWidth:300,
          }}>
          {/* guarantee badges row */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"flex-end" }}>
            {["✓ Source code","✓ Deployed","✓ Documented","✓ Revision"].map(b=>(
              <span key={b} className="font-robert font-bold"
                style={{
                  fontSize:10.5, padding:"4px 10px", borderRadius:20,
                  background:"rgba(99,102,241,0.08)", color:T.accent,
                  border:".5px solid rgba(99,102,241,0.22)",
                }}>
                {b}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            className="font-robert font-bold text-white"
            style={{
              fontSize:14, padding:"14px 26px", borderRadius:24,
              background:"linear-gradient(135deg,#1A1F2E,#312e81)",
              boxShadow:"0 4px 0 rgba(55,48,163,0.55),0 10px 28px rgba(99,102,241,0.28)",
              border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:10,
              letterSpacing:".01em",
            }}
            onClick={()=>document.getElementById("req_a_project")
              ?.scrollIntoView({behavior:"smooth"})}>
            Request a Project
            <ArrowRight style={{ width:16,height:16 }}/>
          </button>

          <p className="font-robert text-right"
            style={{ fontSize:11.5, color:T.muted, lineHeight:1.65 }}>
            Reply guaranteed within 2 hours<br/>
            No commitment required
          </p>

          {/* reply pill */}
          <div className="font-robert font-bold"
            style={{
              ...glass,
              border:"1px solid rgba(245,158,11,0.28)",
              borderRadius:30, padding:"6px 13px",
              fontSize:12, color:T.ink,
              display:"inline-flex", alignItems:"center", gap:8,
            }}>
            <span style={{ width:7,height:7,borderRadius:"50%",
              background:"#F59E0B",boxShadow:"0 0 8px #F59E0B80",
              display:"inline-block",flexShrink:0 }}/>
            &lt;2hr reply guaranteed
          </div>
        </div>

        {/* ── Phase progress dots — bottom center ──────────────────────── */}
        <div style={{
          position:"absolute", bottom:20,
          left:"50%", transform:"translateX(-50%)",
          display:"flex", alignItems:"center", gap:8,
          zIndex:6,
        }}>
          {[0,1,2,3].map(i=>(
            <div key={i}
              style={{
                borderRadius:3,
                width:  i===phase ? 22 : 6,
                height: 6,
                background: i===phase ? T.accent : "rgba(99,102,241,0.22)",
                transition:"all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}/>
          ))}
        </div>

        {/* ── Scroll hint (phase 0 only) ───────────────────────────────── */}
        <AnimatePresence>
          {phase===0 && (
            <motion.div
              key="sh"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              transition={{ delay:1.2, duration:0.6 }}
              style={{
                position:"absolute", bottom:48, right:36,
                display:"flex", flexDirection:"column",
                alignItems:"center", gap:5, zIndex:6,
              }}>
              <div style={{ width:1,height:30,
                background:"linear-gradient(to bottom,transparent,rgba(99,102,241,0.50))" }}/>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M0 0l4.5 6 4.5-6" stroke="rgba(99,102,241,0.5)"
                  strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="font-robert font-bold uppercase"
                style={{ fontSize:9, color:"rgba(99,102,241,0.45)", letterSpacing:".15em" }}>
                scroll
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>{/* end desktop pinWrap */}

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE — stacked
          ════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col gap-14 px-5 pt-14 pb-20">

        {/* Model */}
        <div className="relative rounded-3xl overflow-hidden wt-mob"
          style={{ height:300, background:"linear-gradient(160deg,#eef2ff,#f9fbff)" }}>
          <div style={{
            position:"absolute", bottom:"-8%", left:"50%", transform:"translateX(-50%)",
            width:200, height:100, borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(99,102,241,0.22) 0%,transparent 70%)",
            filter:"blur(22px)",
          }}/>
          <div style={{ position:"relative", zIndex:1, width:"100%", height:"100%" }}>
            <ModelViewer scrollProgress={0.5}/>
          </div>
          {/* floating pills mobile */}
          {PILLS.slice(0,3).map((pill,i)=>(
            <div key={pill.text}
              className="font-robert font-bold"
              style={{
                position:"absolute",
                top:`${14+i*24}%`,
                left:  i%2===0 ? "5%" : "auto",
                right: i%2!==0 ? "5%" : "auto",
                ...glass, borderRadius:30, padding:"5px 11px",
                fontSize:11, color:T.ink,
                display:"inline-flex", alignItems:"center", gap:6,
              }}>
              <span style={{ width:6,height:6,borderRadius:"50%",
                background:pill.dot,display:"inline-block" }}/>
              {pill.text}
            </div>
          ))}
        </div>

        {/* Phase 1 */}
        <div className="wt-mob flex flex-col gap-4">
          <p className="font-robert font-bold uppercase"
            style={{ fontSize:10,color:T.accent,letterSpacing:".22em" }}>Why Trust Me</p>
          <h2 className="font-neulis font-black leading-[1.05]"
            style={{ fontSize:"clamp(2rem,8vw,3rem)",color:T.ink,letterSpacing:"-.03em" }}>
            Built by<br/><span style={{ color:T.accent }}>Prince.</span>
          </h2>
          <p className="font-robert leading-relaxed"
            style={{ fontSize:14,color:T.sub }}>
            CS student. Building real projects since age 16. I know what professors look for — right stack, clean code, proper docs.
          </p>
        </div>

        {/* Phase 2 */}
        <div className="wt-mob flex flex-col gap-5">
          <p className="font-robert font-bold uppercase"
            style={{ fontSize:10,color:T.accent,letterSpacing:".22em" }}>What I've Built</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {STATS.map(s=>(
              <div key={s.label}
                style={{ ...glassDark, borderRadius:14, padding:"12px 16px",
                  display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:s.color }}>{s.icon}</span>
                <div>
                  <span className="font-neulis font-black block"
                    style={{ fontSize:26,color:T.ink,lineHeight:1,letterSpacing:"-.03em" }}>
                    {s.value}{s.suffix}
                  </span>
                  <span className="font-robert font-bold block"
                    style={{ fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".1em" }}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {SKILLS.map(sk=>(
              <span key={sk} className="font-robert font-bold"
                style={{ ...glass, fontSize:11,color:T.accent,borderRadius:20,padding:"5px 11px" }}>
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Phase 3 */}
        <div className="wt-mob flex flex-col gap-4">
          <p className="font-robert font-bold uppercase"
            style={{ fontSize:10,color:T.accent,letterSpacing:".22em" }}>Why Trust Me</p>
          {TESTIMONIALS.map(t=>(
            <div key={t.name} style={{ ...glassDark, borderRadius:16, padding:"14px 16px" }}>
              <p className="font-robert italic leading-relaxed"
                style={{ fontSize:13,color:T.sub,marginBottom:10 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div className="font-neulis font-black"
                  style={{ width:26,height:26,borderRadius:"50%",
                    background:`linear-gradient(135deg,${t.color},${t.color}88)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,color:"#fff",flexShrink:0 }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-robert font-bold" style={{ fontSize:11.5,color:T.ink }}>
                    {t.name}{" "}
                    <span style={{ color:T.muted,fontWeight:400 }}>· {t.role}</span>
                  </p>
                  <Stars/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 4 */}
        <div className="wt-mob flex flex-col gap-5">
          <p className="font-robert font-bold uppercase"
            style={{ fontSize:10,color:T.accent,letterSpacing:".22em" }}>Let's Work Together</p>
          <h3 className="font-neulis font-black leading-[1.06]"
            style={{ fontSize:"clamp(1.6rem,6vw,2.4rem)",color:T.ink,letterSpacing:"-.03em" }}>
            Your deadline is<br/><span style={{ color:T.accent }}>my priority.</span>
          </h3>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {["✓ Source code","✓ Deployed","✓ Documented","✓ Revision"].map(b=>(
              <span key={b} className="font-robert font-bold"
                style={{ fontSize:11,padding:"4px 10px",borderRadius:20,
                  background:"rgba(99,102,241,0.07)",color:T.accent,
                  border:".5px solid rgba(99,102,241,0.20)" }}>
                {b}
              </span>
            ))}
          </div>
          <button
            className="font-robert font-bold text-white self-start"
            style={{
              fontSize:14,padding:"13px 24px",borderRadius:22,
              background:"linear-gradient(135deg,#1A1F2E,#312e81)",
              boxShadow:"0 4px 0 rgba(55,48,163,0.55),0 8px 24px rgba(99,102,241,0.25)",
              border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",gap:10,
            }}
            onClick={()=>document.getElementById("req_a_project")
              ?.scrollIntoView({behavior:"smooth"})}>
            Request a Project
            <ArrowRight style={{ width:16,height:16 }}/>
          </button>
          <p className="font-robert" style={{ fontSize:12,color:T.muted,lineHeight:1.65 }}>
            Reply guaranteed within 2 hours · No commitment required
          </p>
        </div>

      </div>

    </section>
  )
}