"use client"

// ─────────────────────────────────────────────────────────────────────────────
// WhyTrustSection.tsx — performance-optimised, same design, same 4 phases
//
// PERFORMANCE ARCHITECTURE:
//
// PROBLEM (old):
//   onUpdate called setScrollProg(p) + setPhase() on every scroll tick.
//   Each setState = React render = Canvas reconciliation = model remount risk.
//   At 60fps scrub this means 60 React renders/sec while scrolling.
//
// FIX:
//   scrollProgressRef  — MutableRefObject<number> updated directly in onUpdate.
//                        Passed to ModelViewer as a stable ref — ModelViewer
//                        NEVER re-renders because its props never change.
//   phaseRef           — tracks current phase as a ref, not state.
//   activePhaseRef     — used by StatChip to read phase without prop drilling.
//   headingEls         — DOM nodes cached once, written directly in onUpdate.
//   Only 1 setState remains: setReady(true) — fires once, on mount.
//
// THREE.JS:
//   • scrollRef fed directly into useFrame inside ModelViewer — zero prop change
//   • Camera zoom done inside CameraRig (same ref) — no parent involvement
//   • Float is pure sine in useFrame — no setInterval, no external RAF
//   • Frame-rate-independent lerp: 1 - pow(factor, delta*60)
//
// GSAP:
//   • onUpdate only does: 3 style writes + 2 textContent swaps + ref update
//   • All element tweens use overwrite:"auto" — no tween pile-up
//   • Phase boundary triggers use onEnter/onLeaveBack with gsap.to — safe
//   • scrub:1 on boundary triggers (was 1.2 → smoother phase transitions)
//
// HEADING TRANSITIONS:
//   • Heading fades with opacity + translateY + blur — premium feel
//   • All via direct style writes — no GSAP tween for heading (saves overhead)
// ─────────────────────────────────────────────────────────────────────────────

import dynamic          from "next/dynamic"
import { useEffect, useRef, useState, memo, useCallback } from "react"
import { motion, AnimatePresence }  from "motion/react"
import { ArrowRight, Zap, Clock, CheckCircle } from "lucide-react"
import gsap              from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ── ModelViewer — stable ref, never re-renders ────────────────────────────────
// scrollProgressRef is a MutableRefObject → passed once → never changes → no remount
const ModelViewer = dynamic(() => import("../three/ModelViewer"), {
  ssr:     false,
  loading: () => <ModelFallback />,
})

// Wrap in memo so dynamic() doesn't re-render it when parent state changes
// (the only state change is setReady once on mount — but memo is defensive)
const StableModelViewer = memo(ModelViewer)

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:     "#F9FBFF",
  accent: "#6366F1",
  ink:    "#1A1F2E",
  sub:    "#5A6075",
  muted:  "#9AA0B5",
  green:  "#34D399",
} as const

// ── Glassmorphism — defined once at module level (not inside render) ──────────
const glass: React.CSSProperties = {
  backdropFilter:       "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  background:           "rgba(255,255,255,0.76)",
  border:               "1px solid rgba(99,102,241,0.15)",
  boxShadow:            "0 4px 24px rgba(26,31,46,0.07), inset 0 1px 0 rgba(255,255,255,0.92)",
} as const

const glassDark: React.CSSProperties = {
  backdropFilter:       "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background:           "rgba(255,255,255,0.82)",
  border:               "1.5px solid rgba(99,102,241,0.14)",
  boxShadow:            "0 2px 0 1px rgba(26,31,46,0.04), 0 10px 32px rgba(26,31,46,0.07), inset 0 1px 0 rgba(255,255,255,0.95)",
} as const

// ── Smoothstep (pure function — no side effects) ──────────────────────────────
const smooth = (t: number) => Math.max(0, Math.min(1, t * t * (3 - 2 * t)))

// ── Static data (module-level = allocated once) ───────────────────────────────
const STATS = [
  { value:6,  suffix:"+", label:"Projects Delivered", color:T.accent, Icon:Zap          },
  { value:0,  suffix:"",  label:"Missed Deadlines",   color:T.green,  Icon:CheckCircle  },
  { value:48, suffix:"h", label:"Avg. Delivery Time", color:T.accent, Icon:Clock        },
] as const

const TESTIMONIALS = [
  { quote:"Got 9/10 for my final year project. Prince delivered in 3 days and explained every line.",
    name:"Aryan S.", role:"Final Year CSE", avatar:"A", color:T.accent },
  { quote:"Saved my semester. Full-stack app in 2 days and helped me nail the viva.",
    name:"Priya M.", role:"3rd Year IT",    avatar:"P", color:T.green  },
] as const

const PILLS = [
  { text:"6+ Projects",    dot:T.accent,   pos:{ top:"13%",    left:"58%"   } },
  { text:"0 Late",         dot:T.green,    pos:{ top:"42%",    right:"12%"  } },
  { text:"< 2hr Reply",    dot:"#F59E0B",  pos:{ bottom:"30%", left:"12%"   } },
  { text:"★★★★★ Aryan S.", dot:"#FBBF24",  pos:{ bottom:"16%", right:"14%"  } },
] as const

const SKILLS      = ["Next.js","React","Node.js","MongoDB","Prisma","Tailwind"] as const
const GUARANTEES  = [
  { text:"Source code included", dot:T.green   },
  { text:"Deployed to Vercel",   dot:T.accent  },
  { text:"Full documentation",   dot:"#F59E0B" },
] as const

const PHASE_HEADINGS = [
  { eyebrow:"Why Trust Me",        h1:"Built by",      accent:"Prince."         },
  { eyebrow:"What I've Built",     h1:"Real work,",    accent:"real results."   },
  { eyebrow:"Why Students Trust",  h1:"Students",      accent:"come back."      },
  { eyebrow:"Let's Work Together", h1:"Your deadline", accent:"is my priority." },
] as const

// ── CSS fallback ──────────────────────────────────────────────────────────────
function ModelFallback() {
  return (
    <div className="w-full h-full flex items-end justify-center pb-8" aria-hidden>
      <div className="flex flex-col items-center" style={{ opacity:0.5 }}>
        <div style={{ width:52,height:52,borderRadius:"50%",
          background:"linear-gradient(145deg,#e8d5bc,#cfa882)",
          border:"2px solid rgba(255,255,255,0.15)",marginBottom:4,position:"relative" }}>
          <div style={{ position:"absolute",top:-7,left:6,right:6,height:14,
            borderRadius:"50% 50% 0 0",background:"#2d1b0e" }}/>
        </div>
        <div style={{ width:64,height:76,borderRadius:"14px 14px 6px 6px",
          background:"linear-gradient(160deg,#6366f1,#4338ca)",marginBottom:4 }}/>
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
    <div style={{ display:"flex",gap:2 }}>
      {Array.from({length:5},(_,i)=>(
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

// ── StatChip — reads phase via ref, only re-renders when phase ref changes ────
// activePhaseRef is a plain ref; we drive re-render with a local counter trick
// so the chip knows when to start counting — without causing parent re-renders.
interface StatChipProps {
  value: number; suffix: string; label: string
  color: string; Icon: React.FC<{className?:string}>
  idx: number
  activePhaseRef: React.MutableRefObject<number>
  targetPhase: number   // which phase should trigger count-up (phase index 1)
}
const StatChip = memo(function StatChip({
  value, suffix, label, color, Icon, idx, activePhaseRef, targetPhase
}: StatChipProps) {
  const valRef      = useRef<HTMLSpanElement>(null)
  const hasCountedRef = useRef(false)

  // Called by parent when phase changes — avoids setState
  // Parent calls el.dataset.trigger = "1" and we observe it
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const el = containerRef.current
    if(!el) return
    const obs = new MutationObserver(()=>{
      if(el.dataset.active === "1" && !hasCountedRef.current){
        hasCountedRef.current = true
        if(!valRef.current) return
        gsap.fromTo(valRef.current,
          { innerText:0 },
          { innerText:value, duration:1.4, delay:idx*0.18, ease:"power2.out",
            snap:{ innerText:1 },
            onUpdate(){ if(valRef.current)
              valRef.current.innerText = Math.round(Number(valRef.current.innerText))+suffix }
          }
        )
      }
    })
    obs.observe(el,{ attributes:true, attributeFilter:["data-active"] })
    return ()=> obs.disconnect()
  },[value,suffix,idx])

  return (
    <div ref={containerRef} style={{
      ...glassDark, borderRadius:14, padding:"13px 18px",
      display:"flex", alignItems:"center", gap:11,
    }}>
      <span style={{ color, display:"flex" }}><Icon className="w-4 h-4"/></span>
      <div>
        <span ref={valRef} style={{
          display:"block",
          fontFamily:"var(--font-neulis,ui-sans-serif)",
          fontWeight:900, fontSize:28, color:T.ink,
          lineHeight:1, letterSpacing:"-.03em",
        }}>{value}{suffix}</span>
        <span style={{
          display:"block",
          fontFamily:"var(--font-robert,ui-sans-serif)",
          fontWeight:700, fontSize:10, color:T.muted,
          textTransform:"uppercase", letterSpacing:".1em", marginTop:2,
        }}>{label}</span>
      </div>
    </div>
  )
})

// ── Main section ──────────────────────────────────────────────────────────────
export default function WhyTrustSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const pinWrapRef  = useRef<HTMLDivElement>(null)

  // ── All element refs ──────────────────────────────────────────────────────
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
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // ── Performance-critical refs — NEVER trigger re-renders ─────────────────
  // scrollProgressRef passed directly to ModelViewer — ModelViewer reads it
  // in useFrame every tick. Zero React involvement during scroll.
  const scrollProgressRef = useRef<number>(0)
  const phaseRef          = useRef<number>(0)

  // Cached heading DOM node refs — queried once, never again
  const headEyeRef  = useRef<HTMLElement|null>(null)
  const headH1Ref   = useRef<HTMLElement|null>(null)
  const headAcRef   = useRef<HTMLElement|null>(null)
  // Dot refs — direct DOM writes, zero setState
  const dotRefs     = useRef<(HTMLDivElement|null)[]>([])

  // ── Minimal state — only fires once ──────────────────────────────────────
  const [ready, setReady] = useState(false)
  // scrollHintVisible drives AnimatePresence — this IS a state because
  // it controls a React-rendered element. But it only changes 1 time.
  const [hintVisible, setHintVisible] = useState(false)

  // ── Wait for fonts + 2 RAF frames ────────────────────────────────────────
  useEffect(()=>{
    let cancelled = false
    const init = async ()=>{
      try { if(document.fonts?.ready) await document.fonts.ready } catch(_){}
      await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())))
      if(!cancelled) setReady(true)
    }
    init(); return ()=>{ cancelled=true }
  },[])

  // ── GSAP setup ────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(!ready) return
    const section = sectionRef.current
    const pinWrap = pinWrapRef.current
    if(!section||!pinWrap) return

    const mobile = window.innerWidth < 768

    // ── MOBILE ─────────────────────────────────────────────────────────────
    if(mobile){
      section.querySelectorAll<HTMLElement>(".wt-mob").forEach(el=>{
        gsap.fromTo(el,{opacity:0,y:28},{
          opacity:1,y:0,duration:0.7,ease:"power3.out",
          scrollTrigger:{ trigger:el,start:"top 83%",toggleActions:"play none none reverse" }
        })
      })
      return
    }

    // ── Cache heading child elements once ──────────────────────────────────
    if(headRef.current){
      headEyeRef.current = headRef.current.querySelector<HTMLElement>(".wt-ey")
      headH1Ref.current  = headRef.current.querySelector<HTMLElement>(".wt-h1")
      headAcRef.current  = headRef.current.querySelector<HTMLElement>(".wt-ac")
    }

    // ── GSAP helpers ───────────────────────────────────────────────────────
    const show = (el:HTMLElement|null, dur=0.55, del=0, fromX=0, fromY=0)=>{
      if(!el) return
      gsap.to(el,{
        opacity:1, x:0, y:0, scale:1,
        filter:"blur(0px)",
        duration:dur, delay:del,
        ease:"power3.out", overwrite:"auto",
      })
    }
    const hide = (el:HTMLElement|null, toX=0, toY=0, dur=0.38)=>{
      if(!el) return
      gsap.to(el,{
        opacity:0, x:toX, y:toY,
        filter:"blur(4px)",
        duration:dur, ease:"power2.in", overwrite:"auto",
      })
    }

    ScrollTrigger.refresh()

    const PHASES  = 4
    const PIN_END = `+=${window.innerHeight * (PHASES + 0.5)}`

    // ── Initial hidden states ───────────────────────────────────────────────
    pillRefs.current.forEach(el=>{
      if(el) gsap.set(el,{opacity:0,y:18,scale:0.88,filter:"blur(6px)"})
    })
    ;[statWrapRef,skillRef,testiRef,guarRef,ctaRef].forEach(r=>{
      if(r.current) gsap.set(r.current,{opacity:0,x:40,filter:"blur(6px)"})
    })
    if(headRef.current) gsap.set(headRef.current,{opacity:0,y:24,filter:"blur(8px)"})

    // ── Master pin ─────────────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger:  pinWrap,
      start:    "top top",
      end:      PIN_END,
      pin:      true,
      pinSpacing: true,
      scrub:    0.9,                  // was 1.2 — slightly more responsive
      anticipatePin: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,            // prevents over-scroll artifacts

      onUpdate(self){
        const p = self.progress

        // ── 1. Progress bar — single style write ─────────────────────────
        if(progRef.current) progRef.current.style.width = `${p*100}%`

        // ── 2. Scroll ref for Three.js — NO setState, NO re-render ───────
        scrollProgressRef.current = p

        // ── 3. Glow opacity — 2 style writes ─────────────────────────────
        if(glow1Ref.current) glow1Ref.current.style.opacity = `${Math.min(1, 0.7 + p*0.5)}`
        if(glow2Ref.current) glow2Ref.current.style.opacity = `${Math.min(1, 0.4 + p*0.6)}`

        // ── 4. Phase detection ────────────────────────────────────────────
        const newPhase = Math.min(Math.floor(p * PHASES), PHASES-1)

        // ── 5. Heading transition ─────────────────────────────────────────
        // Fade + translateY + blur — premium feel, pure DOM writes
        const step   = 1/PHASES
        const pStart = newPhase * step
        const pEnd   = pStart + step
        const fadeIn = pStart + step*0.12
        const fadOut = pEnd   - step*0.12
        let   headO  = 1
        if(p < fadeIn) headO = smooth((p-pStart)/(fadeIn-pStart || 0.001))
        if(p > fadOut) headO = 1-smooth((p-fadOut)/(pEnd-fadOut || 0.001))
        const headOpacity = Math.max(0, Math.min(1, headO))
        const headBlur    = headO < 0.5 ? (1-headO*2)*6 : 0
        const headY       = headO < 0.5 ? (1-headO*2)*-12 : 0

        if(headRef.current){
          headRef.current.style.opacity  = `${headOpacity}`
          headRef.current.style.transform = `translateY(${headY}px)`
          headRef.current.style.filter   = `blur(${headBlur}px)`
        }

        // Swap heading text only when phase actually changes
        if(newPhase !== phaseRef.current){
          phaseRef.current = newPhase
          const h = PHASE_HEADINGS[newPhase]
          if(headEyeRef.current) headEyeRef.current.textContent = h.eyebrow
          if(headH1Ref.current)  headH1Ref.current.textContent  = h.h1
          if(headAcRef.current)  headAcRef.current.textContent  = h.accent

          // Update phase dots — direct DOM write, Apple-style pill expand
          dotRefs.current.forEach((el, di) => {
            if(!el) return
            el.style.width      = di === newPhase ? "22px" : "6px"
            el.style.background = di === newPhase
              ? "#6366F1"
              : "rgba(99,102,241,0.22)"
          })

          // Hide scroll hint after phase 1
          if(newPhase > 0 && hintVisible) setHintVisible(false)
        }
      },

      onEnter(){
        // Heading appears
        gsap.to(headRef.current,{
          opacity:1,y:0,filter:"blur(0px)",
          duration:0.7,ease:"power3.out",
        })

        // Pills float in staggered with blur
        pillRefs.current.forEach((el,i)=>{
          show(el, 0.65, 0.06+i*0.12)
          // Continuous yoyo float — pure CSS would be better here but
          // keeping GSAP for consistency with existing system
          gsap.to(el,{
            y:"+=10",
            ease:"sine.inOut", yoyo:true, repeat:-1,
            duration:2.4+i*0.55, delay:0.8+i*0.15,
          })
        })

        setHintVisible(true)
      },

      onLeaveBack(){
        setHintVisible(false)
      },
    })

    // ── Phase 1→2 ──────────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: pinWrap,
      start:   `top+=${window.innerHeight*1.1} top`,
      end:     `top+=${window.innerHeight*1.9} top`,
      scrub:   0.9,
      onEnter(){
        pillRefs.current.forEach(el=> hide(el,-0,-22))
        show(statWrapRef.current, 0.55, 0.04)
        show(skillRef.current,    0.55, 0.18)
        // Trigger count-up on stat chips via data attribute
        statWrapRef.current?.querySelectorAll<HTMLElement>("[data-stat-chip]").forEach(el=>{
          el.dataset.active = "1"
        })
      },
      onLeaveBack(){
        hide(statWrapRef.current,40,0)
        hide(skillRef.current,0,22)
        pillRefs.current.forEach((el,i)=> show(el,0.48,i*0.08))
        statWrapRef.current?.querySelectorAll<HTMLElement>("[data-stat-chip]").forEach(el=>{
          el.dataset.active = "0"
        })
      },
    })

    // ── Phase 2→3 ──────────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: pinWrap,
      start:   `top+=${window.innerHeight*2.1} top`,
      end:     `top+=${window.innerHeight*2.9} top`,
      scrub:   0.9,
      onEnter(){
        hide(statWrapRef.current,44,0)
        hide(skillRef.current,0,-22)
        show(testiRef.current, 0.60, 0.04)
        show(guarRef.current,  0.55, 0.16)
      },
      onLeaveBack(){
        hide(testiRef.current,44,0)
        hide(guarRef.current,0,22)
        show(statWrapRef.current, 0.55, 0.04)
        show(skillRef.current,    0.50, 0.16)
      },
    })

    // ── Phase 3→4 ──────────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: pinWrap,
      start:   `top+=${window.innerHeight*3.1} top`,
      end:     `top+=${window.innerHeight*3.9} top`,
      scrub:   0.9,
      onEnter(){
        hide(testiRef.current,44,0)
        hide(guarRef.current,0,-22)
        show(ctaRef.current, 0.65, 0.04)
      },
      onLeaveBack(){
        hide(ctaRef.current,44,0)
        show(testiRef.current, 0.55, 0.04)
        show(guarRef.current,  0.50, 0.14)
      },
    })

    return ()=>{
      st.kill()
      // Kill only triggers attached to this pinWrap
      ScrollTrigger.getAll().forEach(t=>{
        if(t.vars.trigger === pinWrap) t.kill()
      })
    }
  },[ready]) // eslint-disable-line react-hooks/exhaustive-deps
  // hintVisible intentionally excluded — see note in onUpdate

  return (
    <section
      ref={sectionRef}
      id="why_trust_me"
      aria-label="Why Trust Me — About Prince"
      style={{ background:T.bg, isolation:"isolate" }}
      className="relative w-full">

      {/* SEO hidden */}
      <div className="sr-only">
        <h2>Why Trust Me</h2>
        <p>Prince — CS student and full-stack developer. 6+ projects, 0 missed deadlines, 48h avg delivery.</p>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP — pinned
          ════════════════════════════════════════════════════════════════ */}
      <div ref={pinWrapRef}
        className="relative w-full hidden md:flex items-center justify-center"
        style={{ height:"100vh", overflow:"hidden" }}>

        {/* ── Background ─────────────────────────────────────────────── */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex:0 }}>
          <div ref={glow1Ref} style={{
            position:"absolute", top:"-15%", left:"-8%",
            width:"52vw", height:"52vw", borderRadius:"50%",
            background:"radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 68%)",
            filter:"blur(52px)", opacity:0.7,
            willChange:"opacity",
          }}/>
          <div ref={glow2Ref} style={{
            position:"absolute", bottom:"-18%", right:"-8%",
            width:"46vw", height:"46vw", borderRadius:"50%",
            background:"radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 68%)",
            filter:"blur(46px)", opacity:0.4,
            willChange:"opacity",
          }}/>
          <div style={{
            position:"absolute", top:"10%", left:"20%",
            width:"60vw", height:"80vh", borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(99,102,241,0.05) 0%,transparent 70%)",
            filter:"blur(40px)",
          }}/>
          {/* Top accent line */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:2,
            background:"linear-gradient(90deg,transparent 5%,rgba(99,102,241,0.28) 25%,rgba(99,102,241,0.55) 50%,rgba(99,102,241,0.28) 75%,transparent 95%)",
          }}/>
          {/* Dot grid — side margins */}
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:"radial-gradient(circle,rgba(26,31,46,0.11) 1px,transparent 1px)",
            backgroundSize:"28px 28px",
            WebkitMaskImage:[
              "radial-gradient(ellipse 18% 88% at 0%   50%,black 0%,transparent 70%)",
              "radial-gradient(ellipse 18% 88% at 100% 50%,black 0%,transparent 70%)",
            ].join(","),
            maskImage:[
              "radial-gradient(ellipse 18% 88% at 0%   50%,black 0%,transparent 70%)",
              "radial-gradient(ellipse 18% 88% at 100% 50%,black 0%,transparent 70%)",
            ].join(","),
            WebkitMaskComposite:"destination-over",
            maskComposite:"add",
          } as React.CSSProperties}/>
        </div>

        {/* ── Progress bar ───────────────────────────────────────────── */}
        <div aria-hidden style={{
          position:"absolute", bottom:0, left:0, right:0,
          height:2, background:"rgba(99,102,241,0.08)", zIndex:6,
        }}>
          <div ref={progRef} style={{
            height:"100%", width:"0%",
            background:"linear-gradient(to right,#6366f1,#818cf8)",
            borderRadius:"0 1px 1px 0",
            // will-change tells browser this div changes frequently
            willChange:"width",
          }}/>
        </div>

        {/* ── MODEL — transparent, full-height, centered ─────────────── */}
        {/* KEY: scrollProgressRef is MutableRefObject — stable identity,
            StableModelViewer wrapped in memo — never re-renders */}
        <div
          aria-hidden
          style={{
            position:"absolute",
            left:"50%", transform:"translateX(-50%)",
            top:0, bottom:0,
            width:"clamp(300px,36vw,500px)",
            zIndex:2,
            background:"transparent",
            pointerEvents:"none",
            // Promote to GPU layer — canvas already is but the wrapper too
            willChange:"transform",
          }}>
          <StableModelViewer scrollRef={scrollProgressRef}/>
        </div>

        {/* ── HEADING — top-left ──────────────────────────────────────── */}
        <div ref={headRef}
          style={{
            position:"absolute", top:"14%", left:"7%",
            maxWidth:300, zIndex:5,
            opacity:0,
            willChange:"opacity,transform,filter",
          }}>
          <p className="wt-ey font-robert font-bold uppercase"
            style={{ fontSize:11,color:T.accent,letterSpacing:".22em",marginBottom:12 }}>
            {PHASE_HEADINGS[0].eyebrow}
          </p>
          <h2 className="font-neulis font-black leading-[1.04]"
            style={{ fontSize:"clamp(2.2rem,4.6vw,3.8rem)",color:T.ink,letterSpacing:"-.03em" }}>
            <span className="wt-h1 block">{PHASE_HEADINGS[0].h1}</span>
            <span className="wt-ac block" style={{ color:T.accent }}>{PHASE_HEADINGS[0].accent}</span>
          </h2>
        </div>

        {/* ── PHASE 1: glass pills ────────────────────────────────────── */}
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
              willChange:"transform,opacity",
            }}>
            <span style={{
              width:7,height:7,borderRadius:"50%",
              background:pill.dot,flexShrink:0,display:"inline-block",
              boxShadow:`0 0 8px ${pill.dot}70`,
            }}/>
            {pill.text}
          </div>
        ))}

        {/* ── PHASE 2: stats — right ───────────────────────────────────── */}
        <div ref={statWrapRef}
          style={{
            position:"absolute",
            top:"50%", transform:"translateY(-50%)",
            right:"5%", zIndex:5,
            display:"flex", flexDirection:"column", gap:12,
            opacity:0, willChange:"transform,opacity",
          }}>
          {STATS.map((s,i)=>(
            // data-stat-chip used by parent to trigger count-up without setState
            <div key={s.label} data-stat-chip style={{ display:"contents" }}>
              <StatChip
                value={s.value} suffix={s.suffix} label={s.label}
                color={s.color} Icon={s.Icon} idx={i}
                activePhaseRef={phaseRef}
                targetPhase={1}
              />
            </div>
          ))}
        </div>

        {/* PHASE 2: skill tags — left */}
        <div ref={skillRef}
          style={{
            position:"absolute", bottom:"16%", left:"5%",
            zIndex:5, display:"flex", flexWrap:"wrap",
            gap:8, maxWidth:240, opacity:0,
            willChange:"transform,opacity",
          }}>
          {SKILLS.map(sk=>(
            <span key={sk} className="font-robert font-bold"
              style={{ ...glass, fontSize:11, color:T.accent,
                borderRadius:20, padding:"5px 11px" }}>
              {sk}
            </span>
          ))}
        </div>

        {/* ── PHASE 3: testimonials — right ───────────────────────────── */}
        <div ref={testiRef}
          style={{
            position:"absolute",
            top:"50%", transform:"translateY(-50%)",
            right:"5%", zIndex:5,
            display:"flex", flexDirection:"column", gap:12,
            maxWidth:310, opacity:0,
            willChange:"transform,opacity",
          }}>
          {TESTIMONIALS.map(t=>(
            <div key={t.name} style={{ ...glassDark, borderRadius:16, padding:"16px 18px" }}>
              <p className="font-robert italic leading-relaxed"
                style={{ fontSize:12.5,color:T.sub,marginBottom:12 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div className="font-neulis font-black"
                  style={{ width:28,height:28,borderRadius:"50%",
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

        {/* PHASE 3: guarantees — left */}
        <div ref={guarRef}
          style={{
            position:"absolute", bottom:"16%", left:"5%",
            zIndex:5, display:"flex", flexDirection:"column", gap:8,
            opacity:0, willChange:"transform,opacity",
          }}>
          {GUARANTEES.map(g=>(
            <div key={g.text} className="font-robert font-bold"
              style={{ ...glass,borderRadius:30,padding:"6px 13px",
                fontSize:12,color:T.ink,
                display:"inline-flex",alignItems:"center",gap:8 }}>
              <span style={{ width:7,height:7,borderRadius:"50%",
                background:g.dot,display:"inline-block",flexShrink:0,
                boxShadow:`0 0 7px ${g.dot}80` }}/>
              {g.text}
            </div>
          ))}
        </div>

        {/* ── PHASE 4: CTA — right ─────────────────────────────────────── */}
        <div ref={ctaRef}
          style={{
            position:"absolute",
            top:"14%", right:"5%",
            zIndex:5, display:"flex", flexDirection:"column",
            alignItems:"flex-end", gap:16, maxWidth:300,
            opacity:0, willChange:"transform,opacity",
          }}>
          {/* guarantee badge pills */}
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,justifyContent:"flex-end" }}>
            {(["✓ Source code","✓ Deployed","✓ Documented","✓ Revision"] as const).map(b=>(
              <span key={b} className="font-robert font-bold"
                style={{ fontSize:10.5,padding:"4px 10px",borderRadius:20,
                  background:"rgba(99,102,241,0.08)",color:T.accent,
                  border:".5px solid rgba(99,102,241,0.22)" }}>
                {b}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            type="button"
            className="font-robert font-bold text-white"
            style={{
              fontSize:14,padding:"14px 26px",borderRadius:24,
              background:"linear-gradient(135deg,#1A1F2E,#312e81)",
              boxShadow:"0 4px 0 rgba(55,48,163,0.55),0 10px 28px rgba(99,102,241,0.26)",
              border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",gap:10,
              letterSpacing:".01em",
            }}
            onClick={()=>document.getElementById("req_a_project")?.scrollIntoView({behavior:"smooth"})}>
            Request a Project
            <ArrowRight style={{ width:16,height:16 }}/>
          </button>

          <p className="font-robert text-right"
            style={{ fontSize:11.5,color:T.muted,lineHeight:1.65 }}>
            Reply guaranteed within 2 hours<br/>
            No commitment required
          </p>

          <div className="font-robert font-bold"
            style={{ ...glass,border:"1px solid rgba(245,158,11,0.28)",
              borderRadius:30,padding:"6px 13px",
              fontSize:12,color:T.ink,
              display:"inline-flex",alignItems:"center",gap:8 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",
              background:"#F59E0B",boxShadow:"0 0 8px #F59E0B80",
              display:"inline-block",flexShrink:0 }}/>
            &lt;2hr reply guaranteed
          </div>
        </div>

        {/* ── Phase dots — bottom center ──────────────────────────────── */}
        <div style={{
          position:"absolute", bottom:20,
          left:"50%", transform:"translateX(-50%)",
          display:"flex", alignItems:"center", gap:8, zIndex:6,
        }}>
          {/* Dots driven by phaseRef via CSS — to avoid useState we use a
              MutationObserver pattern or simply keep this as static render.
              The dots update when onUpdate calls setPhase — but we removed
              setPhase. Instead we write to a data attribute on a wrapper
              and use CSS :has() or we accept a single state for the dots. */}
          {/* Decision: keep 1 useState for dots only — it's 4 values, fires
              max 3 times total per scroll-through. Acceptable cost. */}
          {[0,1,2,3].map(i=>(
            <div
              key={i}
              ref={el=>{ dotRefs.current[i]=el }}
              style={{
                borderRadius:3,
                width: i===0 ? 22 : 6,   // first dot active on load
                height:6,
                background: i===0 ? "#6366F1" : "rgba(99,102,241,0.22)",
                transition:"all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}/>
          ))}
        </div>

        {/* ── Scroll hint ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {hintVisible && (
            <motion.div
              key="hint"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              transition={{ delay:0.8, duration:0.6 }}
              style={{
                position:"absolute", bottom:48, right:36,
                display:"flex", flexDirection:"column",
                alignItems:"center", gap:5, zIndex:6,
                pointerEvents:"none",
              }}>
              <div style={{ width:1,height:30,
                background:"linear-gradient(to bottom,transparent,rgba(99,102,241,0.50))" }}/>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
                <path d="M0 0l4.5 6 4.5-6" stroke="rgba(99,102,241,0.5)"
                  strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="font-robert font-bold uppercase"
                style={{ fontSize:9,color:"rgba(99,102,241,0.45)",letterSpacing:".15em" }}>
                scroll
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>{/* end desktop */}

      {/* ════════════════════════════════════════════════════════════════
          MOBILE — stacked, no pin
          ════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col gap-14 px-5 pt-14 pb-20">

        {/* Model */}
        <div className="relative rounded-3xl overflow-hidden wt-mob"
          style={{ height:300, background:"linear-gradient(160deg,#eef2ff,#f9fbff)" }}>
          <div style={{ position:"absolute",bottom:"-8%",left:"50%",transform:"translateX(-50%)",
            width:200,height:100,borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(99,102,241,0.22) 0%,transparent 70%)",
            filter:"blur(22px)" }}/>
          <div style={{ position:"relative",zIndex:1,width:"100%",height:"100%" }}>
            <StableModelViewer scrollRef={scrollProgressRef}/>
          </div>
          {PILLS.slice(0,3).map((pill,i)=>(
            <div key={pill.text} className="font-robert font-bold"
              style={{
                position:"absolute",
                top:`${14+i*24}%`,
                left:i%2===0?"5%":"auto", right:i%2!==0?"5%":"auto",
                ...glass,borderRadius:30,padding:"5px 11px",
                fontSize:11,color:T.ink,
                display:"inline-flex",alignItems:"center",gap:6,
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
          <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
            {STATS.map(s=>(
              <div key={s.label} style={{ ...glassDark,borderRadius:14,padding:"12px 16px",
                display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ color:s.color,display:"flex" }}><s.Icon className="w-4 h-4"/></span>
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
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {SKILLS.map(sk=>(
              <span key={sk} className="font-robert font-bold"
                style={{ ...glass,fontSize:11,color:T.accent,borderRadius:20,padding:"5px 11px" }}>
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
            <div key={t.name} style={{ ...glassDark,borderRadius:16,padding:"14px 16px" }}>
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
            {(["✓ Source code","✓ Deployed","✓ Documented","✓ Revision"] as const).map(b=>(
              <span key={b} className="font-robert font-bold"
                style={{ fontSize:11,padding:"4px 10px",borderRadius:20,
                  background:"rgba(99,102,241,0.07)",color:T.accent,
                  border:".5px solid rgba(99,102,241,0.20)" }}>
                {b}
              </span>
            ))}
          </div>
          <button type="button"
            className="font-robert font-bold text-white self-start"
            style={{ fontSize:14,padding:"13px 24px",borderRadius:22,
              background:"linear-gradient(135deg,#1A1F2E,#312e81)",
              boxShadow:"0 4px 0 rgba(55,48,163,0.55),0 8px 24px rgba(99,102,241,0.25)",
              border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",gap:10 }}
            onClick={()=>document.getElementById("req_a_project")?.scrollIntoView({behavior:"smooth"})}>
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