"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import AnimatedTitle from "../AnimatedTitle"
import ClayAirplane from "../Airplane"
import FloatingShapes from "../FloatingShapes"

gsap.registerPlugin(ScrollTrigger)

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  pageBg:   "#F2F5FE",   // matches page.tsx main bg
  bg:       "#ECEDF8",
  bgMid:    "#E8E8F5",
  sky0:     "#7BB8D4",   // deep sky blue at top
  sky1:     "#A8D5EA",   // mid sky
  sky2:     "#C9E8F5",   // horizon
  sky3:     "#DCF0FA",   // near-horizon
  accent:   "#6366F1",
  accentLt: "#EEF2FF",
  ink:      "#1A1F2E",
  sub:      "#5A6075",
  muted:    "#9AA0B5",
  border:   "rgba(26,31,46,0.08)",
  white:    "#FFFFFF",
  exitBg:   "#F9FBFF",   // ReqProjectSection bg — seamless transition
}

const clayCard = ():React.CSSProperties=>({
  background: C.white, borderRadius:18,
  border:`1.5px solid rgba(99,102,241,0.12)`,
  boxShadow:"0 2px 0 1px rgba(99,102,241,0.05),0 10px 28px rgba(99,102,241,0.09),inset 0 1px 0 rgba(255,255,255,1)",
})

// ── Data ──────────────────────────────────────────────────────────────────────
const TECH=[
  {icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",label:"Next.js",color:"#000000"},
  {icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",label:"React",color:"#61DAFB"},
  {icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",label:"Node.js",color:"#339933"},
  {icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",label:"Tailwind",color:"#06B6D4"},
  {icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",label:"MongoDB",color:"#47A248"},
  {icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",label:"Prisma",color:"#2D3748"},
]
const PARTICLES=[
  {w:10,h:10,top:"18%",left:"12%",bg:"#6366f1"},{w:7,h:7,top:"70%",left:"20%",bg:"#f59e0b"},
  {w:12,h:12,top:"30%",left:"55%",bg:"#10b981"},{w:8,h:8,top:"75%",left:"62%",bg:"#f43f5e"},
  {w:6,h:6,top:"20%",left:"75%",bg:"#6366f1"},{w:9,h:9,top:"60%",left:"80%",bg:"#f59e0b"},
  {w:7,h:7,top:"45%",left:"38%",bg:"#10b981"},{w:11,h:11,top:"82%",left:"45%",bg:"#6366f1"},
]
const CHAT=[
  {text:"Hey! I need a task management app",mine:true},
  {text:"On it — MERN stack with Kanban?",mine:false},
  {text:"Yes! + drag-and-drop please 🙏",mine:true},
  {text:"Perfect. Starting now — ETA 48 hrs ⚡",mine:false},
]

// ──────────────────────────────────────────────────────────────────────────────
// REALISTIC CLOUD — inspired by reference image with proper depth layering
// ──────────────────────────────────────────────────────────────────────────────
interface CloudProps{
  w?:number; variant?:1|2|3|4; opacity?:number; className?:string; style?:React.CSSProperties
}
function RealisticCloud({w=320,variant=1,opacity=1,className="",style}:CloudProps){
  const h=Math.round(w*0.48)

  // Each variant has different ellipse arrangements — modelled after the ref photo
  const variants={
    // Large dominant cumulus (centre-heavy, reference style)
    1:(
      <svg width={w} height={h} viewBox="0 0 320 154" xmlns="http://www.w3.org/2000/svg"
        className={className} style={style} aria-hidden>
        {/* Soft ground shadow */}
        <ellipse cx="160" cy="142" rx="130" ry="12" fill="rgba(100,155,195,0.18)"/>
        {/* Back/shadow tint layer */}
        <ellipse cx="80"  cy="105" rx="62"  ry="38" fill="rgba(195,222,240,0.75)"/>
        <ellipse cx="240" cy="102" rx="68"  ry="42" fill="rgba(195,222,240,0.75)"/>
        <ellipse cx="160" cy="98"  rx="110" ry="44" fill="rgba(210,232,245,0.80)"/>
        {/* Main white body */}
        <ellipse cx="160" cy="110" rx="128" ry="36" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="82"  cy="88"  rx="70"  ry="52" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="238" cy="86"  rx="74"  ry="54" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="160" cy="72"  rx="60"  ry="48" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="108" cy="60"  rx="44"  ry="38" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="212" cy="58"  rx="48"  ry="40" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="158" cy="44"  rx="38"  ry="32" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="128" cy="36"  rx="28"  ry="22" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="190" cy="34"  rx="30"  ry="24" fill={`rgba(255,255,255,${opacity})`}/>
        {/* Bright highlights */}
        <ellipse cx="130" cy="46"  rx="18"  ry="11" fill={`rgba(255,255,255,${Math.min(1,opacity*1.05)})`} opacity="0.7"/>
        <ellipse cx="186" cy="42"  rx="16"  ry="10" fill={`rgba(255,255,255,${Math.min(1,opacity*1.05)})`} opacity="0.6"/>
        <ellipse cx="158" cy="30"  rx="14"  ry="8"  fill={`rgba(255,255,255,${Math.min(1,opacity*1.05)})`} opacity="0.5"/>
      </svg>
    ),
    // Smaller rounder puff cloud
    2:(
      <svg width={w} height={h} viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg"
        className={className} style={style} aria-hidden>
        <ellipse cx="110" cy="98" rx="88" ry="10" fill="rgba(100,155,195,0.15)"/>
        <ellipse cx="70"  cy="72" rx="52" ry="36" fill="rgba(200,228,244,0.7)"/>
        <ellipse cx="150" cy="68" rx="56" ry="38" fill="rgba(200,228,244,0.7)"/>
        <ellipse cx="110" cy="82" rx="96" ry="26" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="68"  cy="62" rx="56" ry="40" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="152" cy="60" rx="60" ry="44" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="110" cy="48" rx="44" ry="36" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="85"  cy="40" rx="30" ry="24" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="136" cy="38" rx="32" ry="26" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="110" cy="28" rx="22" ry="18" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="102" cy="34" rx="14" ry="8"  fill="rgba(255,255,255,0.65)" opacity="0.7"/>
        <ellipse cx="124" cy="32" rx="12" ry="7"  fill="rgba(255,255,255,0.60)" opacity="0.6"/>
      </svg>
    ),
    // Wide flat stratocumulus
    3:(
      <svg width={w} height={h} viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg"
        className={className} style={style} aria-hidden>
        <ellipse cx="200" cy="110" rx="178" ry="10" fill="rgba(100,155,195,0.13)"/>
        <ellipse cx="100" cy="80"  rx="80"  ry="32" fill="rgba(205,230,245,0.68)"/>
        <ellipse cx="200" cy="76"  rx="90"  ry="30" fill="rgba(205,230,245,0.68)"/>
        <ellipse cx="300" cy="78"  rx="84"  ry="32" fill="rgba(205,230,245,0.68)"/>
        <ellipse cx="200" cy="90"  rx="178" ry="24" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="90"  cy="70"  rx="84"  ry="36" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="200" cy="64"  rx="90"  ry="40" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="308" cy="68"  rx="86"  ry="36" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="150" cy="50"  rx="50"  ry="30" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="252" cy="48"  rx="52"  ry="32" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="200" cy="38"  rx="38"  ry="22" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="165" cy="40"  rx="18"  ry="10" fill="rgba(255,255,255,0.65)" opacity="0.6"/>
        <ellipse cx="238" cy="38"  rx="20"  ry="10" fill="rgba(255,255,255,0.60)" opacity="0.5"/>
      </svg>
    ),
    // Small wispy cloud (distant, background)
    4:(
      <svg width={w} height={h} viewBox="0 0 180 80" xmlns="http://www.w3.org/2000/svg"
        className={className} style={style} aria-hidden>
        <ellipse cx="90"  cy="72" rx="72" ry="8"  fill="rgba(100,155,195,0.10)"/>
        <ellipse cx="55"  cy="52" rx="40" ry="26" fill="rgba(215,235,248,0.60)"/>
        <ellipse cx="125" cy="50" rx="44" ry="28" fill="rgba(215,235,248,0.60)"/>
        <ellipse cx="90"  cy="60" rx="78" ry="18" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="52"  cy="46" rx="44" ry="30" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="128" cy="44" rx="46" ry="32" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="90"  cy="34" rx="32" ry="24" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="72"  cy="26" rx="20" ry="14" fill={`rgba(255,255,255,${opacity})`}/>
        <ellipse cx="110" cy="24" rx="22" ry="16" fill={`rgba(255,255,255,${opacity})`}/>
      </svg>
    ),
  }

  return variants[variant]
}

// ──────────────────────────────────────────────────────────────────────────────
// JOURNEY ARROW — single continuous flowing path spanning the FULL 570vw track
// Sits at ~58% height, flowing gently between all scenes
// ──────────────────────────────────────────────────────────────────────────────
function JourneyArrow(){
  return(
    <div aria-hidden className="journey-arrow absolute pointer-events-none"
      style={{
        // Full track width — inside the track container
        left:0, top:"58%", width:"570vw", height:120,
        zIndex:3, opacity:0, transform:"translateY(-50%)",
      }}>
      {/*
        viewBox matches 570vw → use 5700 units wide (1vw = 10 units)
        Height 120 units.  Path flows as a gentle sine wave.
        We use stroke-dasharray + GSAP animates dashoffset to draw progressively.
      */}
      <svg width="100%" height="120" viewBox="0 0 5700 120"
        preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366F1" stopOpacity="0.0"/>
            <stop offset="8%"   stopColor="#6366F1" stopOpacity="0.5"/>
            <stop offset="50%"  stopColor="#818CF8" stopOpacity="0.45"/>
            <stop offset="90%"  stopColor="#34D399" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.0"/>
          </linearGradient>
          <linearGradient id="journeyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366F1" stopOpacity="0.0"/>
            <stop offset="8%"   stopColor="#6366F1" stopOpacity="0.18"/>
            <stop offset="50%"  stopColor="#818CF8" stopOpacity="0.16"/>
            <stop offset="90%"  stopColor="#34D399" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.0"/>
          </linearGradient>
          {/* Arrow marker */}
          <marker id="jArr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M1 1L9 5L1 9" stroke="#818CF8" strokeWidth="1.5"
              fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
          </marker>
        </defs>

        {/* Glow shadow path */}
        <path
          className="journey-path"
          d="M 0 60
             C 350 60, 550 30, 850 45
             S 1350 80, 1700 60
             S 2250 30, 2600 50
             S 3150 80, 3500 58
             S 4050 28, 4400 48
             S 4950 82, 5300 58
             S 5550 40, 5700 60"
          fill="none" stroke="url(#journeyGlow)"
          strokeWidth="16" strokeLinecap="round"
        />
        {/* Main arrow path */}
        <path
          className="journey-path"
          d="M 0 60
             C 350 60, 550 30, 850 45
             S 1350 80, 1700 60
             S 2250 30, 2600 50
             S 3150 80, 3500 58
             S 4050 28, 4400 48
             S 4950 82, 5300 58
             S 5550 40, 5700 60"
          fill="none"
          stroke="url(#journeyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="18 10"
          markerMid="url(#jArr)"
        />
      </svg>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SKY OVERLAY — covers the pinned section, fades in as scroll progresses
// ──────────────────────────────────────────────────────────────────────────────
function SkyOverlay(){
  return(
    <div className="sky-overlay absolute inset-0 pointer-events-none"
      style={{zIndex:0, opacity:0}}>
      {/* Sky gradient background */}
      <div className="absolute inset-0" style={{
        background:`linear-gradient(180deg,
          ${C.sky0} 0%,
          ${C.sky1} 28%,
          ${C.sky2} 55%,
          ${C.sky3} 75%,
          rgba(220,240,252,1) 100%)`,
      }}/>

      {/* ── Background cloud layer (distant, translucent, slow drift) ── */}
      <div className="sky-cloud-bg1 absolute pointer-events-none" style={{top:"5%",left:"8%"}}>
        <RealisticCloud w={340} variant={3} opacity={0.55}/>
      </div>
      <div className="sky-cloud-bg2 absolute pointer-events-none" style={{top:"8%",left:"38%"}}>
        <RealisticCloud w={260} variant={4} opacity={0.48}/>
      </div>
      <div className="sky-cloud-bg3 absolute pointer-events-none" style={{top:"3%",left:"68%"}}>
        <RealisticCloud w={310} variant={3} opacity={0.50}/>
      </div>
      <div className="sky-cloud-bg4 absolute pointer-events-none" style={{top:"12%",left:"82%"}}>
        <RealisticCloud w={200} variant={4} opacity={0.42}/>
      </div>
      <div className="sky-cloud-bg5 absolute pointer-events-none" style={{top:"6%",left:"92%"}}>
        <RealisticCloud w={280} variant={3} opacity={0.45}/>
      </div>

      {/* ── Midground cloud layer ── */}
      <div className="sky-cloud-mid1 absolute pointer-events-none" style={{top:"18%",left:"2%"}}>
        <RealisticCloud w={280} variant={2} opacity={0.72}/>
      </div>
      <div className="sky-cloud-mid2 absolute pointer-events-none" style={{top:"14%",left:"28%"}}>
        <RealisticCloud w={360} variant={1} opacity={0.78}/>
      </div>
      <div className="sky-cloud-mid3 absolute pointer-events-none" style={{top:"20%",left:"58%"}}>
        <RealisticCloud w={300} variant={2} opacity={0.68}/>
      </div>
      <div className="sky-cloud-mid4 absolute pointer-events-none" style={{top:"10%",left:"76%"}}>
        <RealisticCloud w={340} variant={1} opacity={0.70}/>
      </div>

      {/* ── Foreground cloud layer (larger, opaque, drifts faster) ── */}
      <div className="sky-cloud-fg1 absolute pointer-events-none" style={{bottom:"18%",left:"-2%"}}>
        <RealisticCloud w={420} variant={1} opacity={0.92}/>
      </div>
      <div className="sky-cloud-fg2 absolute pointer-events-none" style={{bottom:"22%",left:"25%"}}>
        <RealisticCloud w={360} variant={2} opacity={0.88}/>
      </div>
      <div className="sky-cloud-fg3 absolute pointer-events-none" style={{bottom:"14%",left:"55%"}}>
        <RealisticCloud w={440} variant={1} opacity={0.90}/>
      </div>
      <div className="sky-cloud-fg4 absolute pointer-events-none" style={{bottom:"20%",left:"82%"}}>
        <RealisticCloud w={380} variant={3} opacity={0.85}/>
      </div>

      {/* Bottom fade → blends into page bg */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height:"35%",
        background:`linear-gradient(to bottom, transparent 0%, rgba(249,251,255,0.65) 70%, ${C.exitBg} 100%)`,
      }}/>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// EXIT SCENE — sky + clouds + "Ready to start?" + smooth blend to F9FBFF
// ──────────────────────────────────────────────────────────────────────────────
function ExitScene(){
  return(
    <div className="exit-scene relative z-20 shrink-0 w-screen overflow-hidden"
      style={{height:"100vh",background:"transparent"}}> {/* sky comes from overlay */}

      {/* ── Extra foreground clouds specific to exit scene ── */}
      <div className="exit-bg-cloud-1 absolute pointer-events-none" style={{top:"6%",left:"-4%",opacity:0,zIndex:1}}>
        <RealisticCloud w={380} variant={1} opacity={0.65}/>
      </div>
      <div className="exit-bg-cloud-2 absolute pointer-events-none" style={{top:"2%",right:"-3%",opacity:0,zIndex:1}}>
        <RealisticCloud w={320} variant={3} opacity={0.58}/>
      </div>
      <div className="exit-bg-cloud-3 absolute pointer-events-none" style={{top:"60%",left:"-2%",opacity:0,zIndex:1}}>
        <RealisticCloud w={280} variant={2} opacity={0.60}/>
      </div>
      <div className="exit-bg-cloud-4 absolute pointer-events-none" style={{top:"55%",right:"-4%",opacity:0,zIndex:1}}>
        <RealisticCloud w={300} variant={4} opacity={0.55}/>
      </div>
      <div className="exit-bg-cloud-5 absolute pointer-events-none" style={{top:"28%",left:"18%",opacity:0,zIndex:1}}>
        <RealisticCloud w={180} variant={4} opacity={0.45}/>
      </div>
      <div className="exit-bg-cloud-6 absolute pointer-events-none" style={{top:"32%",right:"15%",opacity:0,zIndex:1}}>
        <RealisticCloud w={160} variant={4} opacity={0.40}/>
      </div>

      {/* ── Left card column ── */}
      <div className="exit-cloud-l absolute pointer-events-none"
        style={{left:"4vw",top:"50%",transform:"translateY(-50%)",opacity:0,zIndex:5}}>
        <div className="relative flex flex-col gap-3">
          {[
            {rot:-6,w:172,bg:"linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,242,255,0.92))",content:(
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2 h-2 rounded-full" style={{background:"#60A5FA"}}/>
                  <span className="font-robert text-[10px] font-bold" style={{color:C.ink}}>Basic Static</span>
                </div>
                <div className="h-1.5 rounded-full mb-1.5" style={{background:"rgba(99,102,241,0.14)",width:"82%"}}/>
                <div className="h-1.5 rounded-full" style={{background:"rgba(99,102,241,0.10)",width:"60%"}}/>
                <div className="mt-2 font-robert text-[9px] font-semibold" style={{color:C.accent}}>₹500–₹1,500</div>
              </div>
            )},
            {rot:3,w:182,bg:"linear-gradient(135deg,rgba(240,253,244,0.96),rgba(255,255,255,0.94))",content:(
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2 h-2 rounded-full" style={{background:"#34D399"}}/>
                  <span className="font-robert text-[10px] font-bold" style={{color:C.ink}}>Frontend Project</span>
                </div>
                <div className="h-1.5 rounded-full mb-1.5" style={{background:"rgba(52,211,153,0.18)",width:"88%"}}/>
                <div className="h-1.5 rounded-full" style={{background:"rgba(52,211,153,0.12)",width:"65%"}}/>
                <div className="mt-2 font-robert text-[9px] font-semibold" style={{color:"#059669"}}>₹1,500–₹3k</div>
              </div>
            )},
            {rot:-3,w:192,bg:"linear-gradient(135deg,#1e1b4b,#312e81)",content:(
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2 h-2 rounded-full" style={{background:"#818cf8"}}/>
                  <span className="font-robert text-[10px] font-bold text-white">Full-Stack App</span>
                </div>
                <div className="h-1.5 rounded-full mb-1.5" style={{background:"rgba(129,140,248,0.4)",width:"78%"}}/>
                <div className="h-1.5 rounded-full" style={{background:"rgba(129,140,248,0.25)",width:"55%"}}/>
                <div className="mt-2 font-robert text-[9px] font-semibold" style={{color:"#a5b4fc"}}>₹3k–₹6k</div>
              </div>
            )},
          ].map((card,i)=>(
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{width:card.w,background:card.bg,
                border:"1.5px solid rgba(99,102,241,0.15)",
                boxShadow:"0 4px 0 1px rgba(99,102,241,0.08),0 12px 32px rgba(99,102,241,0.16),inset 0 1px 0 rgba(255,255,255,0.9)",
                transform:`rotate(${card.rot}deg)`,marginLeft:i*6}}>
              {card.content}
            </div>
          ))}
          {/* Cloud tuft behind cards */}
          <div className="absolute -z-10" style={{bottom:"-30px",left:"-40px"}}>
            <RealisticCloud w={280} variant={2} opacity={0.75}/>
          </div>
        </div>
      </div>

      {/* ── Right card column ── */}
      <div className="exit-cloud-r absolute pointer-events-none"
        style={{right:"4vw",top:"50%",transform:"translateY(-50%)",opacity:0,zIndex:5}}>
        <div className="relative flex flex-col gap-3">
          {[
            {rot:5,w:182,bg:"linear-gradient(135deg,rgba(255,247,237,0.96),rgba(255,255,255,0.94))",content:(
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">🚀</span>
                  <span className="font-robert text-[10px] font-bold" style={{color:"#047857"}}>Deployed</span>
                  <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#34d399"}}/>
                </div>
                <div className="h-1.5 rounded-full mb-1" style={{background:"rgba(52,211,153,0.20)",width:"84%"}}/>
                <div className="h-1.5 rounded-full" style={{background:"rgba(52,211,153,0.14)",width:"64%"}}/>
              </div>
            )},
            {rot:-4,w:190,bg:"#0f0c29",content:(
              <div className="px-3.5 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 opacity-70"/>
                  <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-70"/>
                  <div className="w-2 h-2 rounded-full bg-green-400 opacity-70"/>
                  <span className="ml-1.5 font-robert text-[8px]" style={{color:"rgba(255,255,255,0.38)"}}>Dashboard.tsx</span>
                  <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#818cf8"}}/>
                </div>
                {[70,54,80,45].map((w,i)=>(
                  <div key={i} className="h-1 rounded mb-1"
                    style={{background:["rgba(129,140,248,0.45)","rgba(251,191,36,0.38)","rgba(134,239,172,0.38)","rgba(252,165,165,0.38)"][i],width:`${w}%`}}/>
                ))}
              </div>
            )},
            {rot:2,w:174,bg:"linear-gradient(135deg,rgba(245,243,255,0.96),rgba(238,242,255,0.94))",content:(
              <div className="px-4 py-3.5">
                <p className="font-robert text-[8px] font-bold tracking-widest uppercase mb-2" style={{color:C.accent}}>Delivered ✓</p>
                <div className="flex flex-wrap gap-1">
                  {["Code","Docs","Deploy"].map(t=>(
                    <span key={t} className="text-[8px] font-robert font-semibold px-2 py-0.5 rounded-full"
                      style={{background:C.accentLt,color:C.accent,border:`1px solid rgba(99,102,241,0.2)`}}>✓ {t}</span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:"#34d399"}}/>
                  <span className="font-robert text-[8px]" style={{color:C.sub}}>Live on production</span>
                </div>
              </div>
            )},
          ].map((card,i)=>(
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{width:card.w,background:card.bg,
                border:"1.5px solid rgba(99,102,241,0.14)",
                boxShadow:"0 4px 0 1px rgba(99,102,241,0.08),0 12px 32px rgba(99,102,241,0.16),inset 0 1px 0 rgba(255,255,255,0.9)",
                transform:`rotate(${card.rot}deg)`,marginRight:i*6}}>
              {card.content}
            </div>
          ))}
          {/* Cloud tuft behind cards */}
          <div className="absolute -z-10" style={{bottom:"-30px",right:"-40px"}}>
            <RealisticCloud w={260} variant={2} opacity={0.72}/>
          </div>
        </div>
      </div>

      {/* ── Centre content ── */}
      <div className="exit-center absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
        style={{opacity:0}}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-robert font-bold text-[10px] tracking-[0.22em] uppercase"
          style={{background:"rgba(255,255,255,0.82)",color:C.accent,
            border:`1px solid rgba(99,102,241,0.20)`,
            backdropFilter:"blur(16px)",
            boxShadow:"0 2px 0 1px rgba(99,102,241,0.07),0 6px 20px rgba(99,102,241,0.10)"}}>
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <circle cx="3.5" cy="3.5" r="2.5" stroke={C.accent} strokeWidth="1.5"/>
            <circle cx="3.5" cy="3.5" r="1.2" fill={C.accent}/>
          </svg>
          End of journey
        </div>

        <div className="text-center">
          <p className="font-neulis font-black tracking-tight leading-none"
            style={{fontSize:"clamp(2.8rem,5.5vw,5rem)",color:C.ink,
              textShadow:"0 2px 20px rgba(255,255,255,0.6)"}}>
            Ready to{" "}
            <span style={{color:C.accent,textShadow:"0 0 32px rgba(99,102,241,0.22)"}}>start?</span>
          </p>
          <p className="font-robert text-sm mt-3" style={{color:C.sub}}>
            Your project is one scroll away
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          {[{val:"< 2hrs",lbl:"First reply"},{val:"₹500+",lbl:"Starting price"},{val:"48hrs",lbl:"Turnaround"}].map((s,i)=>(
            <div key={i} className="px-4 py-2.5 rounded-2xl text-center"
              style={{background:"rgba(255,255,255,0.78)",backdropFilter:"blur(12px)",
                border:"1.5px solid rgba(99,102,241,0.14)",
                boxShadow:"0 2px 0 1px rgba(99,102,241,0.05),0 6px 18px rgba(99,102,241,0.09)"}}>
              <p className="font-neulis font-black leading-none"
                style={{fontSize:"clamp(1rem,1.7vw,1.4rem)",color:C.ink}}>{s.val}</p>
              <p className="font-robert text-[9px] mt-0.5 font-semibold" style={{color:C.muted}}>{s.lbl}</p>
            </div>
          ))}
        </div>

        {/* Scroll-down chevrons */}
        <div className="flex flex-col items-center gap-0.5" style={{marginTop:4}}>
          {[0.30,0.58,0.88].map((op,i)=>(
            <svg key={i} width="24" height="15" viewBox="0 0 24 15" fill="none"
              style={{animation:`exitBounce 1.5s ease-in-out infinite`,animationDelay:`${i*0.2}s`,
                opacity:op,marginBottom:i<2?-2:0}}>
              <path d="M2 2L12 12L22 2" stroke={C.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ))}
          <div style={{width:9,height:9,borderRadius:"50%",background:C.accent,marginTop:5,
            boxShadow:`0 0 0 4px rgba(99,102,241,0.16),0 0 0 8px rgba(99,102,241,0.07)`,
            animation:"exitPulse 2s ease-in-out infinite"}}/>
        </div>
      </div>

      {/* Foreground clouds that drift across the bottom */}
      <div className="exit-fg-cloud-l absolute pointer-events-none" style={{bottom:"2%",left:"-6%",zIndex:6,opacity:0}}>
        <RealisticCloud w={420} variant={1} opacity={0.94}/>
      </div>
      <div className="exit-fg-cloud-c absolute pointer-events-none" style={{bottom:"0%",left:"26%",zIndex:6,opacity:0}}>
        <RealisticCloud w={340} variant={2} opacity={0.88}/>
      </div>
      <div className="exit-fg-cloud-r absolute pointer-events-none" style={{bottom:"1%",right:"-5%",zIndex:6,opacity:0}}>
        <RealisticCloud w={380} variant={3} opacity={0.90}/>
      </div>

      {/* Bottom seamless fade into ReqProjectSection (#F9FBFF) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height:"50%",zIndex:7,
        background:`linear-gradient(to bottom,transparent 0%,rgba(249,251,255,0.4) 40%,rgba(249,251,255,0.85) 70%,${C.exitBg} 100%)`,
      }}/>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP CONNECTOR
// ──────────────────────────────────────────────────────────────────────────────
function StepConnector({stepNum,stat,statVal}:{stepNum:string;stat:string;statVal:string}){
  return(
    <div className="connector relative z-20 shrink-0 flex flex-col items-center justify-center gap-3"
      style={{width:"10vw",padding:"0 5px"}}>
      <span className="font-neulis font-black select-none leading-none"
        style={{fontSize:"clamp(2.2rem,3.8vw,3.8rem)",color:"transparent",
          WebkitTextStroke:"1.5px rgba(99,102,241,0.20)",letterSpacing:"-0.05em"}}>
        {stepNum}
      </span>
      <div className="w-full rounded-2xl text-center relative overflow-hidden"
        style={{padding:"10px 12px",
          background:"linear-gradient(135deg,rgba(238,242,255,0.96),rgba(255,255,255,0.94))",
          border:"1.5px solid rgba(99,102,241,0.15)",
          boxShadow:"0 3px 0 1px rgba(99,102,241,0.06),0 10px 28px rgba(99,102,241,0.10),inset 0 1px 0 rgba(255,255,255,1)"}}>
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)"}}/>
        <p className="font-robert text-[8px] font-bold tracking-[0.2em] uppercase mb-0.5"
          style={{color:C.accent}}>{stat}</p>
        <p className="font-neulis font-black leading-none"
          style={{fontSize:"clamp(0.78rem,1.2vw,1.05rem)",color:C.ink}}>{statVal}</p>
      </div>
    </div>
  )
}

// ── SpeedLines ────────────────────────────────────────────────────────────────
function SpeedLines({corner="tr",color="#6366f1"}:{corner?:"tr"|"br"|"tl"|"bl";color?:string}){
  const isRight=corner==="tr"||corner==="br",isTop=corner==="tr"||corner==="tl"
  return(
    <div aria-hidden className="absolute pointer-events-none"
      style={{top:isTop?24:"auto",bottom:isTop?"auto":24,right:isRight?20:"auto",left:isRight?"auto":20,zIndex:3}}>
      <div className="flex flex-col gap-1.5" style={{alignItems:isRight?"flex-end":"flex-start"}}>
        {[60,44,30,18].map((w,i)=>(
          <div key={i} className="rounded-full"
            style={{width:w,height:2,
              background:`linear-gradient(${isRight?"to left":"to right"},transparent,${color})`,
              opacity:0.18-i*0.03}}/>
        ))}
      </div>
    </div>
  )
}

// ── Scene orbs ────────────────────────────────────────────────────────────────
function SceneOrbs({scene}:{scene:2|3|4}){
  type Cfg={cls:string;top:string;left:string;size:number;color:string;shape:"circle"|"ring"|"square"}
  const map:Record<2|3|4,Cfg[]>={
    2:[
      {cls:"s2d0",top:"14%",left:"52%",size:10,color:"#818cf8",shape:"circle"},
      {cls:"s2d1",top:"80%",left:"44%",size:7,color:"#fbbf24",shape:"circle"},
      {cls:"s2d2",top:"28%",left:"85%",size:12,color:"#818cf8",shape:"ring"},
      {cls:"s2d3",top:"66%",left:"80%",size:8,color:"#34d399",shape:"circle"},
      {cls:"s2d4",top:"48%",left:"58%",size:6,color:"#c4b5fd",shape:"square"},
      {cls:"s2d5",top:"18%",left:"72%",size:14,color:"#6366f1",shape:"ring"},
    ],
    3:[
      {cls:"s3d0",top:"16%",left:"50%",size:10,color:"#34d399",shape:"circle"},
      {cls:"s3d1",top:"78%",left:"42%",size:7,color:"#818cf8",shape:"circle"},
      {cls:"s3d2",top:"30%",left:"84%",size:12,color:"#10b981",shape:"ring"},
      {cls:"s3d3",top:"62%",left:"78%",size:8,color:"#6366f1",shape:"circle"},
      {cls:"s3d4",top:"50%",left:"57%",size:6,color:"#34d399",shape:"square"},
      {cls:"s3d5",top:"20%",left:"70%",size:14,color:"#34d399",shape:"ring"},
    ],
    4:[
      {cls:"s4fd0",top:"12%",left:"55%",size:10,color:"#f59e0b",shape:"circle"},
      {cls:"s4fd1",top:"82%",left:"48%",size:7,color:"#6366f1",shape:"circle"},
      {cls:"s4fd2",top:"32%",left:"78%",size:12,color:"#f43f5e",shape:"ring"},
      {cls:"s4fd3",top:"64%",left:"70%",size:8,color:"#10b981",shape:"circle"},
    ],
  }
  return(
    <>
      {map[scene].map(c=>(
        <div key={c.cls} aria-hidden className={`${c.cls} absolute pointer-events-none`}
          style={{top:c.top,left:c.left,opacity:0,zIndex:2}}>
          {c.shape==="circle"&&<div style={{width:c.size,height:c.size,borderRadius:"50%",background:c.color,opacity:0.65}}/>}
          {c.shape==="ring"&&<div style={{width:c.size,height:c.size,borderRadius:"50%",border:`2px solid ${c.color}`,opacity:0.5}}/>}
          {c.shape==="square"&&<div style={{width:c.size,height:c.size,borderRadius:3,background:c.color,opacity:0.55,transform:"rotate(45deg)"}}/>}
        </div>
      ))}
    </>
  )
}

// ── SplitWord / TiltCard ──────────────────────────────────────────────────────
function SplitWord({word,style={}}:{word:string;style?:React.CSSProperties}){
  return(
    <span className="inline-block overflow-hidden leading-none align-bottom">
      <span className="word-inner inline-block" style={style}>{word}</span>
    </span>
  )
}
function TiltCard({children,className="",style}:{children:React.ReactNode;className?:string;style?:React.CSSProperties}){
  const ref=useRef<HTMLDivElement>(null)
  const mv=(e:React.MouseEvent<HTMLDivElement>)=>{
    const el=ref.current;if(!el) return
    const r=el.getBoundingClientRect()
    el.style.transform=`perspective(700px) rotateX(${-((e.clientY-r.top)/r.height-0.5)*13}deg) rotateY(${((e.clientX-r.left)/r.width-0.5)*13}deg) scale(1.03)`
  }
  const ml=()=>{if(ref.current) ref.current.style.transform="perspective(700px) rotateX(0) rotateY(0) scale(1)"}
  return(
    <div ref={ref} className={`transition-transform duration-200 ease-out ${className}`}
      style={{transformStyle:"preserve-3d",willChange:"transform",...style}}
      onMouseMove={mv} onMouseLeave={ml}>{children}</div>
  )
}

// ══════════════════════════
// MOCKUPS (unchanged structure, enforced opacity:0)
// ══════════════════════════
function PhoneChat(){
  return(
    <div className="s1-phone shrink-0" style={{width:260,opacity:0,
      filter:"drop-shadow(0 24px 48px rgba(99,102,241,0.22)) drop-shadow(0 8px 16px rgba(0,0,0,0.12))"}}>
      <div className="relative rounded-[36px] overflow-hidden"
        style={{background:"linear-gradient(160deg,#1e1b4b 0%,#312e81 40%,#1e1b4b 100%)",padding:"10px",
          boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.12),inset 0 1px 0 rgba(255,255,255,0.2)"}}>
        <div className="rounded-[28px] overflow-hidden relative" style={{background:"#f8faff",minHeight:380}}>
          <div className="flex items-center justify-between px-4 pt-3 pb-2"
            style={{background:"linear-gradient(135deg,#6366f1,#818cf8)"}}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl"
              style={{background:"linear-gradient(160deg,#1e1b4b,#312e81)"}}/>
            <span className="font-robert text-[9px] font-bold text-white/80 mt-1">9:41</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-3"
            style={{background:"linear-gradient(135deg,#6366f1,#818cf8)",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
              style={{background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.35)"}}>P</div>
            <div className="flex-1 min-w-0">
              <p className="font-robert text-[11px] font-bold text-white leading-none">Prince Dev</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"/>
                <p className="font-robert text-[9px] text-white/70">Online · replies in &lt;2 hrs</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 px-3 py-4" style={{minHeight:260}}>
            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px" style={{background:"rgba(99,102,241,0.12)"}}/>
              <span className="font-robert text-[8.5px] font-medium" style={{color:"#9AA0B5"}}>Today</span>
              <div className="flex-1 h-px" style={{background:"rgba(99,102,241,0.12)"}}/>
            </div>
            {CHAT.map((msg,i)=>(
              <div key={i} className={`chat-bubble-${i} flex ${msg.mine?"justify-end":"justify-start"}`}
                style={{opacity:0,transform:`translateY(${msg.mine?"8px":"-8px"})`}}>
                {!msg.mine&&(
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-1.5 mt-auto text-[8px] font-bold text-white"
                    style={{background:"linear-gradient(135deg,#6366f1,#818cf8)"}}>P</div>
                )}
                <div className="max-w-[78%] font-robert text-[10.5px] leading-relaxed px-3 py-2"
                  style={{borderRadius:msg.mine?"16px 16px 4px 16px":"16px 16px 16px 4px",
                    background:msg.mine?"linear-gradient(135deg,#6366f1,#818cf8)":"#FFFFFF",
                    color:msg.mine?"#fff":"#1A1F2E",
                    boxShadow:msg.mine?"0 3px 12px rgba(99,102,241,0.35)":"0 2px 8px rgba(26,31,46,0.08),0 0 0 1px rgba(26,31,46,0.06)"
                  }}>{msg.text}</div>
              </div>
            ))}
            <div className="typing-indicator flex justify-start" style={{opacity:0}}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-1.5 text-[8px] font-bold text-white"
                style={{background:"linear-gradient(135deg,#6366f1,#818cf8)"}}>P</div>
              <div className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl"
                style={{background:"#FFFFFF",boxShadow:"0 2px 8px rgba(26,31,46,0.08)"}}>
                {[0,1,2].map(i=>(
                  <div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{background:"#818cf8",animation:"typingDot 1.2s ease-in-out infinite",animationDelay:`${i*0.18}s`}}/>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 pb-3 pt-1.5"
            style={{borderTop:"1px solid rgba(99,102,241,0.10)",background:"#f8faff"}}>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full"
              style={{background:"#FFFFFF",border:"1.5px solid rgba(99,102,241,0.14)"}}>
              <span className="font-robert text-[9px]" style={{color:"#9AA0B5"}}>Type a message...</span>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{background:"linear-gradient(135deg,#6366f1,#818cf8)",boxShadow:"0 2px 8px rgba(99,102,241,0.35)"}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-20 h-1 rounded-full" style={{background:"rgba(255,255,255,0.25)"}}/>
        </div>
      </div>
      <style>{`@keyframes typingDot{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-4px);opacity:1}}`}</style>
    </div>
  )
}

function ActivityFeedInline(){
  return(
    <div className="s1-activity shrink-0 flex flex-col gap-2" style={{width:196,opacity:0}}>
      <p className="font-robert text-[8.5px] font-bold tracking-widest uppercase mb-0.5" style={{color:C.accent}}>Live Activity</p>
      {[
        {icon:"🔔",label:"New request received",sub:"just now",color:"#6366f1",dot:"#818cf8"},
        {icon:"⚡",label:"Stack: Next.js + Node",sub:"2 sec ago",color:"#f59e0b",dot:"#fbbf24"},
        {icon:"🛠",label:"Dev started",sub:"now",color:"#10b981",dot:"#34d399"},
      ].map((item,i)=>(
        <div key={i} className={`af-item-${i} flex items-center gap-2.5 px-3 py-2.5 rounded-2xl`}
          style={{...clayCard(),opacity:0,transform:"translateX(18px)"}}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-sm"
            style={{background:`${item.color}13`,border:`1px solid ${item.color}1E`}}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-robert text-[10px] font-semibold leading-tight truncate" style={{color:C.ink}}>{item.label}</p>
            <p className="font-robert text-[8px] mt-0.5" style={{color:C.muted}}>{item.sub}</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:item.dot}}/>
        </div>
      ))}
    </div>
  )
}

// ── Code Editor (visibility:hidden → GSAP reveals) ────────────────────────────
function CodeEditorMockup(){
  const LINES=[
    [{t:"import ",c:"#818cf8"},{t:"{ useState }",c:"#c4b5fd"},{t:" from ",c:"#818cf8"},{t:"'react'",c:"#86efac"}],
    [{t:"import ",c:"#818cf8"},{t:"{ TaskCard }",c:"#c4b5fd"},{t:" from ",c:"#818cf8"},{t:"'./components'",c:"#86efac"}],
    [],
    [{t:"export function ",c:"#818cf8"},{t:"Dashboard",c:"#fbbf24"},{t:"() {",c:"#e2e8f0"}],
    [{t:"  const ",c:"#818cf8"},{t:"[tasks,setTasks]",c:"#c4b5fd"},{t:" = ",c:"#e2e8f0"},{t:"useState",c:"#fbbf24"},{t:"([])",c:"#e2e8f0"}],
    [{t:"  return ",c:"#818cf8"},{t:"(",c:"#e2e8f0"}],
    [{t:"    <div ",c:"#e2e8f0"},{t:"className",c:"#86efac"},{t:"=",c:"#e2e8f0"},{t:'"kanban"',c:"#fca5a5"},{t:">",c:"#e2e8f0"}],
    [{t:"      {tasks.",c:"#e2e8f0"},{t:"map",c:"#fbbf24"},{t:"(t=><TaskCard",c:"#e2e8f0"},{t:"/>)}",c:"#86efac"}],
  ]
  return(
    <div className="s2-editor-wrap" style={{visibility:"hidden",opacity:0}}>
      <div className="s2-editor shrink-0 rounded-2xl overflow-hidden"
        style={{width:300,background:"#0f0c29",
          boxShadow:"0 4px 0 2px rgba(0,0,0,0.25),0 20px 56px rgba(99,102,241,0.22),inset 0 1px 0 rgba(255,255,255,0.06)",
          border:"1.5px solid rgba(99,102,241,0.28)"}}>
        <div className="s2-editor-titlebar flex items-center gap-2 px-4 py-2.5"
          style={{background:"rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.07)",opacity:0}}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-70"/>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-70"/>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-70"/>
          <span className="ml-2 font-robert text-[10px] font-medium" style={{color:"rgba(255,255,255,0.38)"}}>Dashboard.tsx</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="s2-editor-dot w-1.5 h-1.5 rounded-full" style={{background:"#818cf8",opacity:0}}/>
            <span className="s2-editor-status font-robert text-[9px]" style={{color:"#818cf8",opacity:0}}>editing</span>
          </div>
        </div>
        <div className="flex" style={{minHeight:200}}>
          <div className="py-3 px-2.5 shrink-0" style={{width:82,borderRight:"1px solid rgba(255,255,255,0.06)"}}>
            <p className="s2-editor-explorer font-robert text-[8px] font-bold tracking-widest uppercase mb-2"
              style={{color:"rgba(255,255,255,0.22)",opacity:0}}>explorer</p>
            {["TaskCard.tsx","Dashboard.tsx","auth.ts","api/tasks.ts"].map((f,i)=>(
              <div key={f} className={`ft-${i} flex items-center gap-1.5 px-1.5 py-1 rounded text-[9px] font-robert truncate`}
                style={{color:f==="Dashboard.tsx"?"#c4b5fd":"rgba(255,255,255,0.30)",
                  background:f==="Dashboard.tsx"?"rgba(99,102,241,0.15)":"transparent",opacity:0}}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1" fill={f==="Dashboard.tsx"?"#818cf8":"rgba(255,255,255,0.18)"}/>
                </svg>{f}
              </div>
            ))}
          </div>
          <div className="flex-1 py-3 px-3 overflow-hidden">
            {LINES.map((line,i)=>(
              <div key={i} className={`cl-${i} flex items-center gap-2`}
                style={{opacity:0,transform:"translateX(-10px) translateY(4px)",minHeight:16}}>
                <span className="text-[8px] font-mono shrink-0 w-3 text-right" style={{color:"rgba(255,255,255,0.15)"}}>{i+1}</span>
                <span className="font-mono text-[9.5px] leading-tight whitespace-nowrap">
                  {line.map((tk,j)=><span key={j} style={{color:tk.c}}>{tk.t}</span>)}
                </span>
              </div>
            ))}
            <div className="code-cursor mt-1 ml-6 w-1.5 h-3.5 rounded-sm"
              style={{background:"#818cf8",animation:"cursorBlink 1s ease-in-out infinite",opacity:0}}/>
          </div>
        </div>
        <div className="s2-editor-statusbar flex items-center justify-between px-4 py-1.5"
          style={{background:"rgba(99,102,241,0.22)",borderTop:"1px solid rgba(255,255,255,0.05)",opacity:0}}>
          <span className="font-robert text-[8px] font-medium" style={{color:"rgba(255,255,255,0.50)"}}>TypeScript · UTF-8</span>
          <span className="font-robert text-[8px]" style={{color:"rgba(255,255,255,0.32)"}}>Ln 8, Col 42</span>
        </div>
      </div>
    </div>
  )
}

// ── Vercel Deploy Card (visibility:hidden → GSAP reveals) ─────────────────────
function DeployCardMockup(){
  const LOGS=[
    {icon:"✓",text:"Installing dependencies",color:"#34d399"},
    {icon:"✓",text:"Running build command",color:"#34d399"},
    {icon:"✓",text:"Generating static pages",color:"#34d399"},
    {icon:"✓",text:"Deploying to edge network",color:"#34d399"},
    {icon:"🚀",text:"Deployment complete!",color:"#818cf8"},
  ]
  return(
    <div className="s3-deploy-wrap" style={{visibility:"hidden",opacity:0}}>
      <div className="s3-deploy shrink-0 rounded-2xl overflow-hidden"
        style={{width:240,background:"#0f0c29",
          boxShadow:"0 4px 0 2px rgba(0,0,0,0.20),0 16px 48px rgba(99,102,241,0.20),inset 0 1px 0 rgba(255,255,255,0.06)",
          border:"1.5px solid rgba(99,102,241,0.24)"}}>
        <div className="dl-header px-4 pt-4 pb-3" style={{borderBottom:"1px solid rgba(255,255,255,0.06)",opacity:0}}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{background:"#000"}}>
              <svg width="10" height="9" viewBox="0 0 12 10" fill="white"><path d="M6 0L12 10H0L6 0Z"/></svg>
            </div>
            <span className="font-robert text-[11px] font-bold text-white">Vercel</span>
            <div className="ml-auto dl-dot w-2 h-2 rounded-full" style={{background:"#34d399",opacity:0}}/>
          </div>
          <div className="dl-url flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",opacity:0}}>
            <span className="w-1.5 h-1.5 rounded-full" style={{background:"#34d399"}}/>
            <span className="font-robert text-[9px] font-medium" style={{color:"rgba(255,255,255,0.65)"}}>yourproject.vercel.app</span>
          </div>
        </div>
        <div className="px-4 py-3 flex flex-col gap-1.5">
          <p className="dl-log-label font-robert text-[8.5px] font-bold tracking-widest uppercase mb-1"
            style={{color:"rgba(255,255,255,0.22)",opacity:0}}>build log</p>
          {LOGS.map((l,i)=>(
            <div key={i} className={`dl-log-${i} flex items-center gap-2`}
              style={{opacity:0,transform:"translateX(-12px) translateY(3px)"}}>
              <span className="text-[10px]">{l.icon}</span>
              <span className="font-robert text-[9.5px]" style={{color:l.color}}>{l.text}</span>
              <div className="flex-1 h-px ml-1"
                style={{background:`linear-gradient(90deg,${l.color}44,transparent)`,opacity:0.6}}/>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <div className="dl-footer flex items-center justify-between px-3 py-2 rounded-xl"
            style={{background:"rgba(99,102,241,0.16)",border:"1px solid rgba(99,102,241,0.24)",opacity:0}}>
            <span className="font-robert text-[9px] font-medium" style={{color:"rgba(255,255,255,0.42)"}}>Production</span>
            <span className="font-robert text-[9px] font-bold" style={{color:"#818cf8"}}>Live ✓</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeliveryStack(){
  return(
    <div className="delivery-stack relative shrink-0" style={{width:200,height:200,opacity:0}}>
      <div className="delivery-card-2 absolute rounded-2xl px-4 py-4"
        style={{width:180,left:0,top:0,
          background:"linear-gradient(135deg,rgba(245,243,255,0.96),rgba(238,242,255,0.92))",
          border:"1.5px solid rgba(99,102,241,0.14)",
          boxShadow:"0 2px 0 1px rgba(99,102,241,0.07),0 8px 20px rgba(99,102,241,0.09)",
          transform:"rotate(-5deg) translateY(8px)"}}>
        <div className="flex items-center gap-2 mb-2"><span className="text-base">📄</span>
          <span className="font-robert font-bold text-[11px]" style={{color:"#4338CA"}}>README.md</span></div>
        <div className="space-y-1">{["90%","65%","75%"].map((w,i)=>(
          <div key={i} className="h-1.5 rounded-full bg-indigo-200 opacity-55" style={{width:w}}/>
        ))}</div>
      </div>
      <div className="delivery-card-1 absolute rounded-2xl px-4 py-4"
        style={{width:180,left:0,top:0,
          background:"linear-gradient(135deg,rgba(236,253,245,0.96),rgba(255,255,255,0.96))",
          border:"1.5px solid rgba(52,211,153,0.22)",
          boxShadow:"0 2px 0 1px rgba(52,211,153,0.09),0 8px 20px rgba(52,211,153,0.11)",
          transform:"rotate(2deg) translateY(4px)"}}>
        <div className="flex items-center gap-2 mb-2"><span className="text-base">🚀</span>
          <span className="font-robert font-bold text-[11px]" style={{color:"#047857"}}>Deployed</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#34d399"}}/></div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{background:"rgba(52,211,153,0.11)"}}>
          <span className="w-1.5 h-1.5 rounded-full" style={{background:"#34d399"}}/>
          <span className="font-robert text-[9px]" style={{color:"#047857"}}>yourproject.vercel.app</span>
        </div>
      </div>
      <div className="delivery-card-0 absolute rounded-2xl px-4 py-4"
        style={{width:180,left:0,top:0,
          background:"linear-gradient(135deg,#1e1b4b,#312e81)",
          border:"1.5px solid rgba(129,140,248,0.28)",
          boxShadow:"0 4px 0 2px rgba(99,102,241,0.18),0 12px 32px rgba(99,102,241,0.20),inset 0 1px 0 rgba(255,255,255,0.10)"}}>
        <div className="flex items-center gap-2 mb-2.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          <span className="font-robert font-bold text-[11px] text-white">Source Code</span>
        </div>
        {["48 files","2,847 lines","MIT License"].map((l,i)=>(
          <div key={l} className="flex items-center gap-1.5 mb-1">
            <div className="w-1 h-1 rounded-full" style={{background:["#818cf8","#a78bfa","#c4b5fd"][i]}}/>
            <span className="font-robert text-[9px]" style={{color:"rgba(255,255,255,0.52)"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════
// MAIN COMPONENT
// ══════════════════════════
export default function HowItWorksSection(){
  const sectionRef   = useRef<HTMLElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const airplaneRef  = useRef<HTMLDivElement>(null)
  const trackWrapRef = useRef<HTMLDivElement>(null)
  const [ready,setReady]=useState(false)
  const [shapesReady,setShapesReady]=useState<{
    hTween:gsap.core.Tween;sectionEl:HTMLElement;trackWidth:number;totalScroll:number
  }|null>(null)

  useEffect(()=>{
    let cancelled=false
    const init=async()=>{
      try{if(document.fonts?.ready) await document.fonts.ready}catch(_){}
      await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())))
      if(!cancelled) setReady(true)
    }
    init(); return()=>{cancelled=true}
  },[])

  useEffect(()=>{
    if(!ready) return
    const section=sectionRef.current, track=trackRef.current
    if(!section||!track) return
    ScrollTrigger.refresh()

    if(window.innerWidth<768){
      const els=gsap.utils.toArray<HTMLElement>(".scene-mobile")
      gsap.set(els,{opacity:0,y:60})
      els.forEach(el=>gsap.to(el,{opacity:1,y:0,duration:0.8,ease:"power3.out",
        scrollTrigger:{trigger:el,start:"top 85%",toggleActions:"play none none reverse"}}))
      return
    }

    const getTotalScroll=()=>track.scrollWidth-window.innerWidth
    const pin=trackWrapRef.current??section

    gsap.fromTo(".hiw-heading",{opacity:1,y:0},{opacity:0,y:-36,ease:"none",
      scrollTrigger:{trigger:pin,start:"top 25%",end:"top top",scrub:true}})

    const hTween=gsap.to(track,{
      x:()=>-getTotalScroll(), ease:"none",
      scrollTrigger:{
        trigger:pin, start:"top top", end:()=>`+=${getTotalScroll()}`,
        scrub:1, pin:true, pinSpacing:true, anticipatePin:1,
        invalidateOnRefresh:true, fastScrollEnd:true,
        onEnter:()=>gsap.set(section,{opacity:1,visibility:"visible"}), 
        onLeave:()=>gsap.to(section,{opacity:0,duration:0.2}),
        onEnterBack:()=>gsap.to(section,{opacity:1,duration:0.2}),
      },
    })

    if(trackWrapRef.current){
      setShapesReady({hTween,sectionEl:trackWrapRef.current,
        trackWidth:track.scrollWidth,totalScroll:getTotalScroll()})
    }

    // ── SKY OVERLAY: completely invisible → fades in as scroll progresses ─────
    const skyOverlay=document.querySelector<HTMLElement>(".sky-overlay")
    if(skyOverlay){
      gsap.set(skyOverlay,{opacity:0})
      // Gradually reveal sky as horizontal scroll begins
      gsap.to(skyOverlay,{
        opacity:1, ease:"none",
        scrollTrigger:{
          trigger:pin, start:"top top",
          end:()=>`+=${getTotalScroll()*0.35}`,
          scrub:1.5,
          invalidateOnRefresh:true,
        },
      })
    }

    // ── JOURNEY ARROW: fades in once sky is partially visible ─────────────────
    const jArrow=document.querySelector<HTMLElement>(".journey-arrow")
    if(jArrow){
      gsap.set(jArrow,{opacity:0})
      gsap.to(jArrow,{
        opacity:0.85, ease:"none",
        scrollTrigger:{
          trigger:pin, start:()=>`top+=${getTotalScroll()*0.15}`,
          end:()=>`top+=${getTotalScroll()*0.45}`,
          containerAnimation:hTween,
          scrub:1,
          invalidateOnRefresh:true,
        },
      })
    }

    // ── SKY CLOUD DRIFT (infinite, slow, horizontal) ──────────────────────────
    [".sky-cloud-bg1",".sky-cloud-bg2",".sky-cloud-bg3",".sky-cloud-bg4",".sky-cloud-bg5"].forEach((cls,i)=>{
      const el=document.querySelector<HTMLElement>(cls);if(!el) return
      gsap.to(el,{x:30+i*15,ease:"sine.inOut",yoyo:true,repeat:-1,duration:8+i*2,delay:i*1.2})
    });
    const midClouds = [".sky-cloud-mid1",".sky-cloud-mid2",".sky-cloud-mid3",".sky-cloud-mid4"];
    midClouds.forEach((cls,i)=>{
      const el=document.querySelector<HTMLElement>(cls);
      if(el){
        gsap.to(el,{x:22+i*10,ease:"sine.inOut",yoyo:true,repeat:-1,duration:6+i*1.8,delay:0.5+i*0.8})
      }
    });
    [".sky-cloud-fg1",".sky-cloud-fg2",".sky-cloud-fg3",".sky-cloud-fg4"].forEach((cls,i)=>{
      const el=document.querySelector<HTMLElement>(cls);if(!el) return
      gsap.to(el,{x:16+i*8,ease:"sine.inOut",yoyo:true,repeat:-1,duration:5+i*1.5,delay:i*0.6})
    });

    // Section bg stays page bg (#F2F5FE) → sky overlay handles the color
    // When exit scene is reached, section bg goes to exitBg for seamless hand-off
    gsap.to(section,{
      backgroundColor:C.exitBg, ease:"none",
      scrollTrigger:{trigger:".exit-scene",containerAnimation:hTween,start:"left 60%",end:"left 10%",scrub:1},
    })

    // Airplane
    const plane=airplaneRef.current
    if(plane){
      gsap.set(plane,{opacity:0,x:-36})
      gsap.to(plane,{opacity:1,x:0,duration:0.7,ease:"power3.out",
        scrollTrigger:{trigger:pin,start:"top top",end:"top top+=100",scrub:false,toggleActions:"play none none reverse"}})
      gsap.to(plane,{x:()=>track.scrollWidth-180,ease:"none",
        scrollTrigger:{trigger:pin,start:"top top",end:()=>`+=${getTotalScroll()}`,scrub:1,invalidateOnRefresh:true}})
      gsap.to(plane,{y:"-=22",ease:"sine.inOut",yoyo:true,repeat:-1,duration:2.2})
      gsap.to(plane,{rotation:-4,ease:"sine.inOut",yoyo:true,repeat:-1,duration:3.1})
      ;[{t:".scene-1",y:-14,r:4},{t:".scene-2",y:-44,r:-9},
        {t:".scene-3",y:-22,r:6},{t:".scene-4",y:-62,r:-13},{t:".exit-scene",y:-10,r:2}]
        .forEach(({t,y,r})=>gsap.to(plane,{y,rotation:r,ease:"power2.inOut",
          scrollTrigger:{trigger:t,containerAnimation:hTween,start:"left 85%",end:"left 15%",scrub:1.2}}))
    }

    const ct=(trigger:string)=>({trigger,containerAnimation:hTween})

    // ── SCENE 1 ───────────────────────────────────────────────────────────────
    const s1w=gsap.utils.toArray<HTMLElement>(".s1-words .word-inner")
    const s1p=document.querySelector<HTMLElement>(".s1-para")
    const s1ph=document.querySelector<HTMLElement>(".s1-phone")
    const svgp=document.querySelector<HTMLElement>(".svg-path")
    const s1act=document.querySelector<HTMLElement>(".s1-activity")
    if(s1w.length) gsap.set(s1w,{opacity:0,y:68,filter:"blur(8px)"})
    if(s1p) gsap.set(s1p,{opacity:0,y:20})
    if(s1ph) gsap.set(s1ph,{opacity:0,y:34,scale:0.93})
    if(svgp) gsap.set(svgp,{strokeDashoffset:320})
    if(s1act) gsap.set(s1act,{opacity:0})
    ;[0,1,2].forEach(i=>{const el=document.querySelector<HTMLElement>(`.af-item-${i}`);if(el) gsap.set(el,{opacity:0,x:18})})

    ScrollTrigger.create({trigger:pin,start:"top top",
      onEnter:()=>{
        const tl=gsap.timeline({delay:0.04})
        if(s1w.length) tl.to(s1w,{opacity:1,y:0,filter:"blur(0px)",ease:"power3.out",stagger:0.07,duration:0.7},0)
        if(s1p) tl.to(s1p,{opacity:1,y:0,ease:"power3.out",duration:0.6},0.26)
        if(s1ph){
          tl.to(s1ph,{opacity:1,y:0,scale:1,ease:"power3.out",duration:0.7},0.16)
          CHAT.forEach((_,i)=>{
            const el=document.querySelector<HTMLElement>(`.chat-bubble-${i}`)
            if(el) tl.to(el,{opacity:1,y:0,duration:0.4,ease:"back.out(1.3)"},0.44+i*0.20)
          })
          const typ=document.querySelector<HTMLElement>(".typing-indicator")
          if(typ){tl.to(typ,{opacity:1,duration:0.3},0.48);tl.to(typ,{opacity:0,duration:0.3},1.52)}
        }
        if(svgp) tl.to(svgp,{strokeDashoffset:0,ease:"power2.inOut",duration:1.0},0.52)
        if(s1act) tl.to(s1act,{opacity:1,duration:0.4},0.58)
        ;[0,1,2].forEach(i=>{
          const el=document.querySelector<HTMLElement>(`.af-item-${i}`)
          if(el) tl.to(el,{opacity:1,x:0,ease:"back.out(1.4)",duration:0.44},0.70+i*0.17)
        })
      },
      onLeaveBack:()=>{
        if(s1w.length) gsap.set(s1w,{opacity:0,y:68,filter:"blur(8px)"})
        if(s1p) gsap.set(s1p,{opacity:0,y:20})
        if(s1ph) gsap.set(s1ph,{opacity:0,y:34,scale:0.93})
        if(svgp) gsap.set(svgp,{strokeDashoffset:320})
        if(s1act) gsap.set(s1act,{opacity:0})
        CHAT.forEach((_,i)=>{const el=document.querySelector<HTMLElement>(`.chat-bubble-${i}`);if(el) gsap.set(el,{opacity:0})})
        ;[0,1,2].forEach(i=>{const el=document.querySelector<HTMLElement>(`.af-item-${i}`);if(el) gsap.set(el,{opacity:0,x:18})})
      },
    })

    const conns=gsap.utils.toArray<HTMLElement>(".connector")
    gsap.set(conns,{opacity:0,x:-14})
    conns.forEach(c=>gsap.to(c,{opacity:1,x:0,
      scrollTrigger:{trigger:c,containerAnimation:hTween,start:"left 88%",end:"left 50%",scrub:1}}))

    // ── SCENE 2 ───────────────────────────────────────────────────────────────
    const s2w=gsap.utils.toArray<HTMLElement>(".s2-words .word-inner")
    gsap.set(s2w,{opacity:0,y:68,filter:"blur(8px)"})
    gsap.to(s2w,{opacity:1,y:0,filter:"blur(0px)",ease:"power3.out",stagger:0.06,
      scrollTrigger:{...ct(".scene-2"),start:"left 86%",end:"left 26%",scrub:0.5}})
    const badges=gsap.utils.toArray<HTMLElement>(".tech-badge")
    gsap.set(badges,{opacity:0,scale:0.7,y:16})
    gsap.to(badges,{opacity:1,scale:1,y:0,stagger:0.054,ease:"back.out(1.6)",
      scrollTrigger:{...ct(".scene-2"),start:"left 72%",end:"left 13%",scrub:1}})
    const s2q=document.querySelector<HTMLElement>(".s2-quote")
    if(s2q){gsap.set(s2q,{opacity:0,y:14});gsap.to(s2q,{opacity:1,y:0,
      scrollTrigger:{...ct(".scene-2"),start:"left 62%",end:"left 13%",scrub:1}})}
    const mc=document.querySelector<HTMLElement>(".mockup-card")
    if(mc){gsap.set(mc,{opacity:0,x:65,scale:0.92});gsap.to(mc,{opacity:1,x:0,scale:1,
      scrollTrigger:{...ct(".scene-2"),start:"left 74%",end:"left 20%",scrub:1}})}

    // Code editor timeline
    const edWrap=document.querySelector<HTMLElement>(".s2-editor-wrap")
    const ed=document.querySelector<HTMLElement>(".s2-editor")
    if(edWrap&&ed){
      gsap.set(edWrap,{visibility:"visible",opacity:0})
      gsap.set(ed,{y:50,scale:0.90,rotateX:8,transformPerspective:800,opacity:1})
      gsap.to(edWrap,{opacity:1,ease:"none",scrollTrigger:{...ct(".scene-2"),start:"left 70%",end:"left 58%",scrub:1}})
      gsap.to(ed,{y:0,scale:1,rotateX:0,ease:"power3.out",scrollTrigger:{...ct(".scene-2"),start:"left 68%",end:"left 52%",scrub:1}})
      const tb=document.querySelector<HTMLElement>(".s2-editor-titlebar")
      if(tb){gsap.set(tb,{opacity:0,y:-10});gsap.to(tb,{opacity:1,y:0,ease:"none",scrollTrigger:{...ct(".scene-2"),start:"left 55%",end:"left 48%",scrub:1}})}
      const dd=document.querySelector<HTMLElement>(".s2-editor-dot")
      if(dd){gsap.set(dd,{opacity:0,scale:0});gsap.to(dd,{opacity:1,scale:1,ease:"back.out(2)",scrollTrigger:{...ct(".scene-2"),start:"left 50%",end:"left 44%",scrub:1}})}
      const ds=document.querySelector<HTMLElement>(".s2-editor-status")
      if(ds){gsap.set(ds,{opacity:0});gsap.to(ds,{opacity:1,scrollTrigger:{...ct(".scene-2"),start:"left 49%",end:"left 43%",scrub:1}})}
      const ex=document.querySelector<HTMLElement>(".s2-editor-explorer")
      if(ex){gsap.set(ex,{opacity:0});gsap.to(ex,{opacity:1,ease:"none",scrollTrigger:{...ct(".scene-2"),start:"left 48%",end:"left 42%",scrub:1}})}
      ;[0,1,2,3].forEach(i=>{
        const el=document.querySelector<HTMLElement>(`.ft-${i}`);if(!el) return
        gsap.set(el,{opacity:0,x:-14,filter:"blur(3px)"})
        gsap.to(el,{opacity:1,x:0,filter:"blur(0px)",ease:"power2.out",
          scrollTrigger:{...ct(".scene-2"),start:`left ${46-i*3}%`,end:`left ${36-i*3}%`,scrub:1}})
      })
      ;[0,1,2,3,4,5,6,7].forEach(i=>{
        const el=document.querySelector<HTMLElement>(`.cl-${i}`);if(!el) return
        gsap.set(el,{opacity:0,x:-12,y:5,filter:"blur(4px)"})
        gsap.to(el,{opacity:1,x:0,y:0,filter:"blur(0px)",ease:"power2.out",
          scrollTrigger:{...ct(".scene-2"),start:`left ${42-i*2.8}%`,end:`left ${30-i*2.8}%`,scrub:1}})
      })
      const cur=document.querySelector<HTMLElement>(".code-cursor")
      if(cur){gsap.set(cur,{opacity:0,scale:0});gsap.to(cur,{opacity:1,scale:1,ease:"back.out(3)",
        scrollTrigger:{...ct(".scene-2"),start:"left 22%",end:"left 15%",scrub:1}})}
      const sb=document.querySelector<HTMLElement>(".s2-editor-statusbar")
      if(sb){gsap.set(sb,{opacity:0,y:8});gsap.to(sb,{opacity:1,y:0,ease:"none",
        scrollTrigger:{...ct(".scene-2"),start:"left 20%",end:"left 12%",scrub:1}})}
    }

    // Scene 2 orbs
    const s2Orbs=["s2d0","s2d1","s2d2","s2d3","s2d4","s2d5"].map(
      cls=>document.querySelector<HTMLElement>(`.${cls}`)
    ).filter(Boolean) as HTMLElement[]
    s2Orbs.forEach((el,i)=>{
      gsap.set(el,{opacity:0,scale:0.3})
      gsap.to(el,{opacity:1,scale:1,ease:"back.out(1.6)",
        scrollTrigger:{...ct(".scene-2"),start:`left ${70-i*3}%`,end:`left ${50-i*3}%`,scrub:1}})
      gsap.to(el,{y:`-=${8+i*4}`,ease:"sine.inOut",yoyo:true,repeat:-1,duration:2.2+i*0.4,delay:i*0.2})
    })

    // ── SCENE 3 ───────────────────────────────────────────────────────────────
    gsap.set(".s3-heading",{opacity:0,filter:"blur(12px)"})
    gsap.to(".s3-heading",{opacity:1,filter:"blur(0px)",
      scrollTrigger:{...ct(".scene-3"),start:"left 82%",end:"left 32%",scrub:1}})
    const chks=gsap.utils.toArray<HTMLElement>(".check-item")
    gsap.set(chks,{opacity:0,x:-26})
    chks.forEach((el,i)=>gsap.to(el,{opacity:1,x:0,
      scrollTrigger:{...ct(".scene-3"),start:`left ${78-i*5}%`,end:`left ${30-i*5}%`,scrub:1}}))
    const s3s=document.querySelector<HTMLElement>(".s3-side")
    if(s3s){gsap.set(s3s,{opacity:0,x:54,scale:0.93});gsap.to(s3s,{opacity:1,x:0,scale:1,
      scrollTrigger:{...ct(".scene-3"),start:"left 72%",end:"left 18%",scrub:1}})}

    // Vercel deploy card timeline
    const dcWrap=document.querySelector<HTMLElement>(".s3-deploy-wrap")
    const dc=document.querySelector<HTMLElement>(".s3-deploy")
    if(dcWrap&&dc){
      gsap.set(dcWrap,{visibility:"visible",opacity:0})
      gsap.set(dc,{y:50,scale:0.90,rotateY:12,transformPerspective:700,opacity:1})
      gsap.to(dcWrap,{opacity:1,ease:"none",scrollTrigger:{...ct(".scene-3"),start:"left 70%",end:"left 58%",scrub:1}})
      gsap.to(dc,{y:0,scale:1,rotateY:0,ease:"power3.out",scrollTrigger:{...ct(".scene-3"),start:"left 68%",end:"left 52%",scrub:1}})
      const dh=document.querySelector<HTMLElement>(".dl-header")
      if(dh){gsap.set(dh,{opacity:0,y:-12});gsap.to(dh,{opacity:1,y:0,ease:"none",
        scrollTrigger:{...ct(".scene-3"),start:"left 55%",end:"left 47%",scrub:1}})}
      const dot=document.querySelector<HTMLElement>(".dl-dot")
      if(dot){gsap.set(dot,{opacity:0,scale:0});gsap.to(dot,{opacity:1,scale:1,ease:"back.out(3)",
        scrollTrigger:{...ct(".scene-3"),start:"left 50%",end:"left 44%",scrub:1}})}
      const url=document.querySelector<HTMLElement>(".dl-url")
      if(url){gsap.set(url,{opacity:0,x:-16});gsap.to(url,{opacity:1,x:0,ease:"power2.out",
        scrollTrigger:{...ct(".scene-3"),start:"left 48%",end:"left 40%",scrub:1}})}
      const ll=document.querySelector<HTMLElement>(".dl-log-label")
      if(ll){gsap.set(ll,{opacity:0});gsap.to(ll,{opacity:1,ease:"none",
        scrollTrigger:{...ct(".scene-3"),start:"left 44%",end:"left 38%",scrub:1}})}
      ;[0,1,2,3,4].forEach(i=>{
        const el=document.querySelector<HTMLElement>(`.dl-log-${i}`);if(!el) return
        gsap.set(el,{opacity:0,x:-16,filter:"blur(3px)"})
        gsap.to(el,{opacity:1,x:0,filter:"blur(0px)",ease:"power2.out",
          scrollTrigger:{...ct(".scene-3"),start:`left ${40-i*4}%`,end:`left ${28-i*4}%`,scrub:1}})
      })
      const ft=document.querySelector<HTMLElement>(".dl-footer")
      if(ft){gsap.set(ft,{opacity:0,scale:0.85,y:8});gsap.to(ft,{opacity:1,scale:1,y:0,ease:"back.out(2)",
        scrollTrigger:{...ct(".scene-3"),start:"left 20%",end:"left 12%",scrub:1}})}
    }

    // Scene 3 orbs
    const s3Orbs=["s3d0","s3d1","s3d2","s3d3","s3d4","s3d5"].map(
      cls=>document.querySelector<HTMLElement>(`.${cls}`)
    ).filter(Boolean) as HTMLElement[]
    s3Orbs.forEach((el,i)=>{
      gsap.set(el,{opacity:0,scale:0.3})
      gsap.to(el,{opacity:1,scale:1,ease:"back.out(1.6)",
        scrollTrigger:{...ct(".scene-3"),start:`left ${68-i*3}%`,end:`left ${48-i*3}%`,scrub:1}})
      gsap.to(el,{y:`-=${7+i*4}`,ease:"sine.inOut",yoyo:true,repeat:-1,duration:2.4+i*0.35,delay:i*0.22})
    })

    // ── SCENE 4 ───────────────────────────────────────────────────────────────
    gsap.set(".delivered-text",{opacity:0,scale:0.84})
    gsap.to(".delivered-text",{opacity:1,scale:1,
      scrollTrigger:{...ct(".scene-4"),start:"left 86%",end:"left 26%",scrub:1}})
    const s4p=document.querySelector<HTMLElement>(".s4-para")
    if(s4p){gsap.set(s4p,{opacity:0,y:16});gsap.to(s4p,{opacity:1,y:0,
      scrollTrigger:{...ct(".scene-4"),start:"left 58%",end:"left 20%",scrub:1}})}
    gsap.set(".cta-btn",{opacity:0,scale:0.8})
    gsap.to(".cta-btn",{opacity:1,scale:1,ease:"elastic.out(1,0.5)",
      scrollTrigger:{...ct(".scene-4"),start:"left 62%",end:"left 18%",scrub:1}})
    const pts=gsap.utils.toArray<HTMLElement>(".particle")
    gsap.set(pts,{opacity:0,scale:0,y:34})
    pts.forEach((p,i)=>gsap.to(p,{opacity:0.62,scale:1,y:0,
      scrollTrigger:{...ct(".scene-4"),start:`left ${55-i*3}%`,end:`left ${16-i*2}%`,scrub:1}}))
    const s4b=document.querySelector<HTMLElement>(".s4-badge")
    if(s4b){gsap.set(s4b,{opacity:0,y:16});gsap.to(s4b,{opacity:1,y:0,
      scrollTrigger:{...ct(".scene-4"),start:"left 50%",end:"left 13%",scrub:1}})}
    const s4Orbs=["s4fd0","s4fd1","s4fd2","s4fd3"].map(
      cls=>document.querySelector<HTMLElement>(`.${cls}`)
    ).filter(Boolean) as HTMLElement[]
    s4Orbs.forEach((el,i)=>{
      gsap.set(el,{opacity:0,scale:0.3})
      gsap.to(el,{opacity:1,scale:1,ease:"back.out(1.6)",
        scrollTrigger:{...ct(".scene-4"),start:`left ${72-i*4}%`,end:`left ${52-i*4}%`,scrub:1}})
      gsap.to(el,{y:`-=${8+i*4}`,ease:"sine.inOut",yoyo:true,repeat:-1,duration:2+i*0.5,delay:i*0.18})
    })
    const ds2=document.querySelector<HTMLElement>(".delivery-stack")
    if(ds2){
      gsap.set(ds2,{opacity:0})
      gsap.to(ds2,{opacity:1,ease:"none",scrollTrigger:{...ct(".scene-4"),start:"left 82%",end:"left 63%",scrub:1}})
      const positions=[{rotate:0,y:0,x:0},{rotate:6,y:-20,x:20},{rotate:-7,y:-38,x:-16}]
      ;[0,1,2].forEach(ci=>{
        const el=document.querySelector<HTMLElement>(`.delivery-card-${ci}`);if(!el) return
        gsap.set(el,{rotate:0,y:0,x:0,opacity:ci===0?1:0})
        gsap.to(el,{rotate:positions[ci].rotate,y:positions[ci].y,x:positions[ci].x,opacity:1,ease:"none",
          scrollTrigger:{...ct(".scene-4"),start:"left 60%",end:"left 27%",scrub:1.2}})
      })
    }

    // ── EXIT SCENE ────────────────────────────────────────────────────────────
    const bgClouds=["exit-bg-cloud-1","exit-bg-cloud-2","exit-bg-cloud-3","exit-bg-cloud-4","exit-bg-cloud-5","exit-bg-cloud-6"].map(
      cls=>document.querySelector<HTMLElement>(`.${cls}`)
    ).filter(Boolean) as HTMLElement[]
    bgClouds.forEach((el,i)=>{
      gsap.set(el,{opacity:0,scale:0.85,x:i%2===0?-25:25})
      gsap.to(el,{opacity:1,scale:1,x:0,ease:"power2.out",
        scrollTrigger:{...ct(".exit-scene"),start:`left ${86-i*3}%`,end:`left ${66-i*3}%`,scrub:1}})
      gsap.to(el,{x:i%2===0?20:-18,ease:"sine.inOut",yoyo:true,repeat:-1,duration:6+i*1.2,delay:i*0.9})
    })
    const fgClouds=["exit-fg-cloud-l","exit-fg-cloud-c","exit-fg-cloud-r"].map(
      cls=>document.querySelector<HTMLElement>(`.${cls}`)
    ).filter(Boolean) as HTMLElement[]
    fgClouds.forEach((el,i)=>{
      gsap.set(el,{opacity:0,y:30})
      gsap.to(el,{opacity:1,y:0,ease:"power2.out",
        scrollTrigger:{...ct(".exit-scene"),start:`left ${72-i*4}%`,end:`left ${52-i*4}%`,scrub:1}})
      gsap.to(el,{x:i%2===0?22:-18,ease:"sine.inOut",yoyo:true,repeat:-1,duration:5+i*1.5,delay:0.4+i*0.6})
    })
    const exitL=document.querySelector<HTMLElement>(".exit-cloud-l")
    const exitR=document.querySelector<HTMLElement>(".exit-cloud-r")
    if(exitL){
      gsap.set(exitL,{opacity:0,x:-100,rotate:-18,scale:0.72})
      gsap.to(exitL,{opacity:1,x:0,rotate:0,scale:1,ease:"power3.out",
        scrollTrigger:{...ct(".exit-scene"),start:"left 88%",end:"left 60%",scrub:1}})
      gsap.to(exitL,{y:"-=16",ease:"sine.inOut",yoyo:true,repeat:-1,duration:3.8,delay:0.3})
    }
    if(exitR){
      gsap.set(exitR,{opacity:0,x:100,rotate:18,scale:0.72})
      gsap.to(exitR,{opacity:1,x:0,rotate:0,scale:1,ease:"power3.out",
        scrollTrigger:{...ct(".exit-scene"),start:"left 86%",end:"left 58%",scrub:1}})
      gsap.to(exitR,{y:"-=12",ease:"sine.inOut",yoyo:true,repeat:-1,duration:4.4,delay:0.6})
    }
    const exitC=document.querySelector<HTMLElement>(".exit-center")
    if(exitC){
      gsap.set(exitC,{opacity:0,y:44,filter:"blur(10px)"})
      gsap.to(exitC,{opacity:1,y:0,filter:"blur(0px)",ease:"power3.out",
        scrollTrigger:{...ct(".exit-scene"),start:"left 65%",end:"left 35%",scrub:1}})
    }

    ScrollTrigger.refresh()
    return()=>{
      ScrollTrigger.getAll().filter(t => t.vars.trigger === pin || t.vars.trigger === section || t.vars.trigger === track).forEach(t => t.kill())
      gsap.killTweensOf(".hiw-heading, .sky-overlay, .journey-arrow, .scene-mobile, .scene-1, .scene-2, .scene-3, .scene-4, .exit-scene")
      try{ScrollTrigger.clearScrollMemory()}catch(_){}
    }
  },[ready])

  return(
    <section ref={sectionRef} id="how_it_works" className="relative w-full"
      // Start with page bg — sky overlay fades in on scroll
      style={{background:C.pageBg,willChange:"background-color"}}>
      <h2 className="sr-only">How It Works — 4 Steps to Your Project</h2>

      <style>{`
        @keyframes pulse-ring{0%{transform:scale(1);opacity:0.5}100%{transform:scale(2.1);opacity:0}}
        @keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes exitBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
        @keyframes exitPulse{0%,100%{box-shadow:0 0 0 4px rgba(99,102,241,0.18),0 0 0 8px rgba(99,102,241,0.07)}
          50%{box-shadow:0 0 0 9px rgba(99,102,241,0.12),0 0 0 18px rgba(99,102,241,0.03)}}
      `}</style>

      {/* MOBILE */}
      <div className="md:hidden flex flex-col gap-20 py-20 px-6 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full font-robert font-bold text-[10px] tracking-widest uppercase"
            style={{background:C.accentLt,color:C.accent,border:`1px solid rgba(99,102,241,0.14)`}}>
            The Process
          </div>
          <AnimatedTitle title="How it Works"
            containerClass="text-[clamp(2.4rem,10vw,4rem)] font-black leading-tight font-neulis"
            style={{color:C.ink}}/>
          <p className="text-sm font-robert mt-3 max-w-xs mx-auto leading-relaxed" style={{color:C.muted}}>
            From rough idea to working product — in 4 clear steps.
          </p>
        </div>
        {[
          {step:"01",title:"Tell me what you need",desc:"Share your idea or brief.",icon:"💬"},
          {step:"02",title:"I build it for you",desc:"Right stack, clean code.",icon:"⚡"},
          {step:"03",title:"You review & approve",desc:"Live preview. Request changes.",icon:"✅"},
          {step:"04",title:"Delivered. Done.",desc:"Code + deployment + docs.",icon:"🚀"},
        ].map(s=>(
          <div key={s.step} className="scene-mobile flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{background:C.accentLt,border:`1px solid rgba(99,102,241,0.13)`}}>{s.icon}</div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.3em] font-robert uppercase" style={{color:C.accent}}>Step {s.step}</span>
              <h3 className="text-xl font-black leading-tight font-neulis" style={{color:C.ink}}>{s.title}</h3>
              <p className="text-sm leading-relaxed font-robert" style={{color:C.sub}}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP heading */}
      <div className="hiw-heading hidden md:flex flex-col items-center gap-3 pt-16 pb-8 relative z-50 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-robert font-bold text-[10px] tracking-[0.2em] uppercase pointer-events-auto"
          style={{background:C.accentLt,color:C.accent,border:`1px solid rgba(99,102,241,0.14)`}}>
          The Process
        </div>
        <AnimatedTitle title="How it Works"
          containerClass="text-center text-[clamp(2.8rem,5vw,5rem)] font-black text-zinc-900 leading-none tracking-tight font-neulis"/>
        <p className="text-xs font-robert tracking-wide" style={{color:C.muted}}>Scroll to travel through the journey →</p>
      </div>

      {/* DESKTOP — pinned scroll wrapper */}
      <div ref={trackWrapRef} className="hidden md:block relative">

        {/* SKY OVERLAY — sits above section bg, below track content */}
        <SkyOverlay/>

        {shapesReady&&(
          <FloatingShapes hTween={shapesReady.hTween} sectionEl={shapesReady.sectionEl}
            trackWidth={shapesReady.trackWidth} totalScroll={shapesReady.totalScroll}/>
        )}

        {/* Track: 4×110vw + 3×10vw + 1×100vw = 570vw */}
        <div ref={trackRef} className="flex items-center relative z-10"
          style={{width:"570vw",height:"100vh",willChange:"transform"}}>

          {/* ── Single Journey Arrow spans FULL track width ── */}
          <JourneyArrow/>

          {/* ── Airplane ── */}
          <div ref={airplaneRef} className="absolute z-30 pointer-events-none"
            style={{top:"55%",left:0,transform:"translateX(26px)",willChange:"transform",
              filter:"drop-shadow(4px 8px 12px rgba(0,0,0,0.15))",opacity:0}}>
            <div className="absolute right-full top-1/2 -translate-y-1/2 flex items-center" style={{width:68}}>
              <div className="h-px w-full" style={{background:"linear-gradient(to left,rgba(99,102,241,0.45),transparent)"}}/>
            </div>
            {[0,1,2].map(i=>(
              <div key={i} className="absolute rounded-full bg-white/45"
                style={{width:6-i,height:6-i,right:`${28+i*19}px`,top:"50%",
                  transform:"translateY(-50%)",animation:`pulse-ring ${0.8+i*0.28}s ease-out infinite`,
                  animationDelay:`${i*0.13}s`}}/>
            ))}
            <ClayAirplane style={{width:155,height:"auto"}}/>
          </div>

          {/* ══ SCENE 1 ══ */}
          <div className="scene scene-1 relative z-20 shrink-0 flex items-center"
            style={{width:"110vw",height:"100vh",paddingLeft:"6vw",paddingRight:"2vw",gap:"clamp(1.5rem,2.5vw,3rem)"}}>
            <div className="flex flex-col gap-5 shrink-0" style={{maxWidth:"38vw"}}>
              <span className="text-[11px] font-bold tracking-[0.3em] font-robert uppercase" style={{color:C.accent}}>Step 01</span>
              <div className="s1-words flex flex-wrap items-end gap-x-3 gap-y-1 leading-none">
                <SplitWord word="Tell"  style={{fontSize:"clamp(3rem,6.8vw,7rem)",fontWeight:900,color:C.ink,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="me"    style={{fontSize:"clamp(1.3rem,2.6vw,2.6rem)",fontWeight:700,color:C.accent,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="what"  style={{fontSize:"clamp(2.6rem,5.8vw,6.2rem)",fontWeight:900,color:C.ink,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="you"   style={{fontSize:"clamp(1rem,2vw,2rem)",fontWeight:700,color:C.muted,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="need." style={{fontSize:"clamp(3rem,6.8vw,7rem)",fontWeight:900,color:C.ink,fontFamily:"var(--font-neulis)"}}/>
              </div>
              <p className="s1-para text-base leading-relaxed max-w-xs font-robert" style={{color:C.sub}}>
                Share your idea, assignment brief, or project goal. No tech jargon needed.
              </p>
              <svg width="126" height="44" viewBox="0 0 140 50" fill="none" aria-hidden>
                <path className="svg-path" d="M8 25 Q35 5 60 25 Q85 45 110 25 Q125 12 136 25"
                  stroke={C.accent} strokeWidth="2.4" strokeLinecap="round" fill="none"
                  strokeDasharray="320" strokeDashoffset="0"/>
              </svg>
            </div>
            <PhoneChat/>
            <div className="flex-1 flex items-center justify-center">
              <ActivityFeedInline/>
            </div>
          </div>

          <StepConnector stepNum="02" stat="Response" statVal="< 2 hrs"/>

          {/* ══ SCENE 2 ══ */}
          <div className="scene scene-2 relative z-20 shrink-0 flex items-center"
            style={{width:"110vw",height:"100vh",paddingLeft:"6vw",paddingRight:"2vw",gap:"clamp(1.5rem,2.5vw,3rem)"}}>
            <SpeedLines corner="tr" color="#6366f1"/>
            <SpeedLines corner="bl" color="#818cf8"/>
            <SceneOrbs scene={2}/>
            <div className="flex flex-col gap-5 shrink-0 relative z-10" style={{maxWidth:"36vw"}}>
              <span className="text-[11px] font-bold tracking-[0.3em] font-robert uppercase" style={{color:C.accent}}>Step 02</span>
              <div className="s2-words flex flex-wrap items-end gap-x-3 gap-y-1 leading-none">
                <SplitWord word="I"     style={{fontSize:"clamp(1.3rem,2.6vw,2.6rem)",fontWeight:700,color:C.muted,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="Build" style={{fontSize:"clamp(3rem,7vw,7.5rem)",fontWeight:900,color:C.ink,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="it"    style={{fontSize:"clamp(1.3rem,2.4vw,2.4rem)",fontWeight:700,color:C.accent,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="for"   style={{fontSize:"clamp(1rem,1.9vw,1.9rem)",fontWeight:600,color:C.muted,fontFamily:"var(--font-neulis)"}}/>
                <SplitWord word="you."  style={{fontSize:"clamp(2.8rem,6.2vw,6.6rem)",fontWeight:900,color:C.ink,fontFamily:"var(--font-neulis)"}}/>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {TECH.map(t=>(
                  <span key={t.label} className="tech-badge inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-full border font-robert"
                    style={{background:`${t.color}12`,color:t.color==="#000000"?C.ink:t.color,borderColor:`${t.color}22`}}>
                    <img src={t.icon} alt={t.label} width={11} height={11} className="shrink-0" loading="lazy"/>
                    {t.label}
                  </span>
                ))}
              </div>
              <span className="s2-quote self-start font-robert text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{background:C.accentLt,color:C.accent,border:`1px solid rgba(99,102,241,0.14)`}}>
                ✦ Clean code. Real-world patterns.
              </span>
            </div>
            <TiltCard className="mockup-card shrink-0 w-48 rounded-3xl overflow-hidden relative z-10"
              style={{background:"linear-gradient(150deg,rgba(255,255,255,0.94),rgba(238,242,255,0.88))",
                backdropFilter:"blur(20px)",border:`1.5px solid rgba(99,102,241,0.12)`,
                boxShadow:"0 2px 0 1px rgba(99,102,241,0.04),0 12px 30px rgba(99,102,241,0.10),0 22px 48px rgba(0,0,0,0.06)"} as React.CSSProperties}>
              <div className="h-24 flex items-center justify-center relative overflow-hidden"
                style={{background:"linear-gradient(135deg,#eef2ff,#e0e7ff)"}}>
                {TECH[0] && <img src={TECH[0].icon} alt="" width={32} height={32} className="opacity-14 absolute left-3 bottom-2" loading="lazy"/>}
                <span className="text-2xl relative z-10">⚡</span>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <div className="h-2.5 rounded-full bg-zinc-200 w-3/4"/>
                <div className="h-2 rounded-full bg-zinc-100 w-1/2"/>
                <div className="h-2 rounded-full bg-zinc-100 w-2/3 mt-0.5"/>
                <div className="mt-2.5 h-6 rounded-xl flex items-center justify-center" style={{background:C.ink}}>
                  <span className="text-white text-[8px] font-bold tracking-wider">VIEW PROJECT</span>
                </div>
              </div>
            </TiltCard>
            <div className="flex-1 flex items-center justify-center relative z-10">
              <CodeEditorMockup/>
            </div>
          </div>

          <StepConnector stepNum="03" stat="Turnaround" statVal="48 hrs"/>

          {/* ══ SCENE 3 ══ */}
          <div className="scene scene-3 relative z-20 shrink-0 flex items-center"
            style={{width:"110vw",height:"100vh",paddingLeft:"6vw",paddingRight:"2vw",gap:"clamp(1.5rem,2.5vw,3rem)"}}>
            <SpeedLines corner="tr" color="#34d399"/>
            <SpeedLines corner="bl" color="#818cf8"/>
            <SceneOrbs scene={3}/>
            <div className="flex flex-col gap-6 shrink-0 relative z-10" style={{maxWidth:"38vw"}}>
              <span className="text-[11px] font-bold tracking-[0.3em] font-robert uppercase" style={{color:C.accent}}>Step 03</span>
              <h2 className="s3-heading font-neulis font-black leading-none tracking-tight"
                style={{fontSize:"clamp(3rem,6.8vw,7rem)",color:C.ink}}>
                You review<br/><span style={{color:C.accent}}>&amp;</span> approve.
              </h2>
              <div className="flex flex-col gap-3">
                {["Live preview link shared instantly","Request unlimited revisions","Changes made within 24 hours","Sign off when it's perfect"].map((item,i)=>(
                  <div key={i} className="check-item flex items-center gap-3 group cursor-default">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200"
                      style={{background:C.accent}}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-base font-robert group-hover:opacity-90 transition-opacity" style={{color:C.sub}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <TiltCard className="s3-side shrink-0 w-48 rounded-3xl overflow-hidden relative z-10"
              style={{background:"linear-gradient(150deg,rgba(238,242,255,0.96),rgba(255,255,255,0.92))",
                border:`1.5px solid rgba(99,102,241,0.12)`,
                boxShadow:"0 8px 28px rgba(99,102,241,0.08)"} as React.CSSProperties}>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-robert" style={{color:C.ink}}>Preview Ready</span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                </div>
                <div className="rounded-xl overflow-hidden border" style={{borderColor:"rgba(26,31,46,0.07)"}}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{background:"#f5f5f8"}}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300"/>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-300"/>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300"/>
                    <span className="ml-1.5 flex-1 h-1.5 rounded flex items-center px-1"
                      style={{background:"#e4e4eb",fontSize:6,color:"#9AA0B5",fontFamily:"var(--font-robert)"}}>yourproject.vercel.app</span>
                  </div>
                  <div className="bg-white p-2.5 space-y-1.5">
                    <div className="h-1.5 rounded w-full" style={{background:"#f0f0f4"}}/>
                    <div className="h-1.5 rounded w-3/4" style={{background:C.accentLt}}/>
                    <div className="h-1.5 rounded w-1/2" style={{background:"#f0f0f4"}}/>
                  </div>
                </div>
                <div className="self-center text-[9px] font-robert font-semibold px-3 py-1 rounded-full"
                  style={{background:"#f0fdf4",color:"#16a34a",border:"1px solid rgba(52,211,153,0.18)"}}>
                  ✓ Approved
                </div>
              </div>
            </TiltCard>
            <div className="flex-1 flex items-center justify-center relative z-10">
              <DeployCardMockup/>
            </div>
          </div>

          <StepConnector stepNum="04" stat="Final step" statVal="Almost 🎉"/>

          {/* ══ SCENE 4 ══ */}
          <div className="scene scene-4 relative z-20 shrink-0 w-screen flex items-center overflow-hidden"
            style={{height:"100vh",paddingLeft:"7vw",paddingRight:"5vw",gap:"5vw"}}>
            <SceneOrbs scene={4}/>
            <SpeedLines corner="tr" color="#f59e0b"/>
            <SpeedLines corner="bl" color="#6366f1"/>
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              {PARTICLES.map((p,i)=>(
                <span key={i} className="particle absolute rounded-full"
                  style={{width:p.w,height:p.h,top:p.top,left:p.left,backgroundColor:p.bg}}/>
              ))}
            </div>
            <div className="flex flex-col gap-6 relative z-10">
              <span className="text-[11px] font-bold tracking-[0.3em] font-robert uppercase" style={{color:C.accent}}>Step 04</span>
              <div className="delivered-text leading-none">
                <span className="font-neulis font-black block"
                  style={{fontSize:"clamp(3.5rem,9vw,10rem)",color:"transparent",
                    WebkitTextStroke:`2.5px ${C.ink}`,letterSpacing:"-0.03em"}}>DELIVERED.</span>
                <span className="font-neulis font-black block"
                  style={{fontSize:"clamp(3.5rem,9vw,10rem)",color:C.ink,letterSpacing:"-0.03em"}}>DONE.</span>
              </div>
              <p className="s4-para text-base max-w-sm leading-relaxed font-robert" style={{color:C.sub}}>
                Source code, deployment guide, and documentation — all handed over clean and ready.
              </p>
              <div className="s4-badge flex flex-wrap gap-2">
                {[{l:"✓ Source Code",bg:"#f0fdf4",c:"#16a34a",b:"rgba(52,211,153,0.18)"},
                  {l:"✓ Deployed",bg:"#eff6ff",c:"#2563eb",b:"rgba(59,130,246,0.18)"},
                  {l:"✓ Documented",bg:"#f5f3ff",c:"#7c3aed",b:"rgba(124,58,237,0.18)"},
                ].map(b=>(
                  <span key={b.l} className="text-xs font-robert font-semibold px-3 py-1.5 rounded-full"
                    style={{background:b.bg,color:b.c,border:`1px solid ${b.b}`}}>{b.l}</span>
                ))}
              </div>
              <Button
                className="cta-btn self-start font-robert font-bold text-sm px-8 py-4 rounded-2xl text-white tracking-wide transition-colors duration-300 h-auto hover:opacity-90"
                style={{background:C.ink,boxShadow:`0 4px 0 #3730a3,0 8px 24px rgba(99,102,241,0.20)`}}
                onClick={()=>document.getElementById("req_a_project")?.scrollIntoView({behavior:"smooth"})}>
                Request a Project →
              </Button>
            </div>
            <DeliveryStack/>
          </div>

          {/* ══ EXIT SCENE ══ */}
          <ExitScene/>

        </div>
      </div>
    </section>
  )
}