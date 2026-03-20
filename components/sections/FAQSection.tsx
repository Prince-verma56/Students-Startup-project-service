"use client"

 
//   green:#34D399
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence }                   from "motion/react"
import { Search, Send }                              from "lucide-react"
import gsap                                          from "gsap"
import { ScrollTrigger }                             from "gsap/ScrollTrigger"
import { cn }                                        from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:       "#F9FBFF",
  accent:   "#6366F1",
  ink:      "#1A1F2E",
  sub:      "#5A6075",
  muted:    "#9AA0B5",
  border:   "rgba(26,31,46,0.09)",
  green:    "#34D399",
  darkBg:   "#0f0e1a",
  darkMid:  "#1a1040",
  darkEdge: "#0f172a",
} as const

// ── Glass styles ──────────────────────────────────────────────────────────────
const glassLight: React.CSSProperties = {
  backdropFilter:       "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background:           "rgba(255,255,255,0.08)",
  border:               "1px solid rgba(255,255,255,0.14)",
  boxShadow:            "inset 0 1px 0 rgba(255,255,255,0.10)",
}

const glassWhite: React.CSSProperties = {
  backdropFilter:       "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  background:           "rgba(255,255,255,0.82)",
  border:               "1.5px solid rgba(99,102,241,0.13)",
  boxShadow:            "0 2px 0 1px rgba(26,31,46,0.03), 0 8px 28px rgba(26,31,46,0.07), inset 0 1px 0 rgba(255,255,255,0.96)",
}

// ── FAQ data ──────────────────────────────────────────────────────────────────
interface FAQ {
  id:       string
  topic:    string
  emoji:    string
  question: string
  answer:   string
  badge?:   { text: string; color: string; bg: string }
  student:  { initial: string; name: string; avatarBg: string; nameColor: string }
}

const FAQS: FAQ[] = [
  {
    id:       "payment",
    topic:    "Payment",
    emoji:    "💳",
    question: "Is it safe to pay? I've been scammed before on Fiverr 😬",
    answer:   "100% understand. I work with milestone payments — you pay 50% upfront, 50% only after you've seen and approved the working project. No demo = no final payment. I'm a fellow student, not a random seller.",
    badge:    { text: "✓ Zero Risk", color: "#fff", bg: "rgba(52,211,153,0.25)" },
    student:  { initial:"S", name:"Student", avatarBg:"linear-gradient(135deg,#eef2ff,#c7d2fe)", nameColor:T.accent },
  },
  {
    id:       "source-code",
    topic:    "Source Code",
    emoji:    "📁",
    question: "Do I get the full source code? Or just a deployed link?",
    answer:   "You get everything — full source code on GitHub or as a ZIP, deployment on Vercel, and a short explanation of each file. It's 100% yours. I don't keep your project or resell it to anyone.",
    badge:    { text: "✓ Yours Forever", color: "#fff", bg: "rgba(99,102,241,0.30)" },
    student:  { initial:"R", name:"Riya", avatarBg:"linear-gradient(135deg,#fef3c7,#fde68a)", nameColor:"#b45309" },
  },
  {
    id:       "deadlines",
    topic:    "Deadlines",
    emoji:    "⏱",
    question: "What happens if you miss my submission deadline?",
    answer:   "Tell me your deadline on day 1 — I always build buffer time in. 0 missed deliveries so far. But if I ever do fall short, I'll work overtime at no extra charge and refund the difference. Your grade is my responsibility.",
    badge:    { text: "0 Missed", color: "#fff", bg: "rgba(52,211,153,0.25)" },
    student:  { initial:"A", name:"Aryan", avatarBg:"linear-gradient(135deg,#dcfce7,#86efac)", nameColor:"#166534" },
  },
  {
    id:       "revisions",
    topic:    "Revisions",
    emoji:    "🔄",
    question: "What's your revision policy? What if I want changes?",
    answer:   "1 free revision is included in every package — minor UI tweaks, content changes, feature adjustments. Major scope changes (new pages, different stack) are discussed and quoted separately. I won't ghost you after delivery.",
    badge:    { text: "1 Free Included", color: "#fff", bg: "rgba(99,102,241,0.30)" },
    student:  { initial:"P", name:"Priya", avatarBg:"linear-gradient(135deg,#fce7f3,#fbcfe8)", nameColor:"#be185d" },
  },
  {
    id:       "college",
    topic:    "College",
    emoji:    "📋",
    question: "Is it safe to submit this for my college project?",
    answer:   "Projects are built as learning references and portfolio pieces. How you use them for your own submissions is your responsibility. I can explain every line of code so you genuinely understand it — which helps massively with vivas and presentations.",
    badge:    { text: "⚠ Your Responsibility", color: "#fff", bg: "rgba(245,158,11,0.30)" },
    student:  { initial:"K", name:"Kabir", avatarBg:"linear-gradient(135deg,#e0f2fe,#bae6fd)", nameColor:"#0369a1" },
  },
  {
    id:       "not-happy",
    topic:    "Not Happy?",
    emoji:    "😐",
    question: "What if I'm not satisfied with the final result?",
    answer:   "Message me directly — I don't disappear after delivery. If the project doesn't match what we agreed, I'll fix it. I care about my reputation more than any single payment. Every project I build is a referral machine.",
    badge:    { text: "✓ I'll Fix It", color: "#fff", bg: "rgba(239,68,68,0.25)" },
    student:  { initial:"M", name:"Mehul", avatarBg:"linear-gradient(135deg,#f3e8ff,#e9d5ff)", nameColor:"#7c3aed" },
  },
]

const ALL_FILTER = { id: "all", topic: "All", emoji: "" }

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3 rounded-2xl rounded-bl-sm"
      style={{ ...glassWhite, display:"inline-flex" }}>
      {[0,1,2].map(i=>(
        <span key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: T.muted,
            animation: `wtDot 1.2s ease-in-out ${i*0.18}s infinite`,
          }}/>
      ))}
    </div>
  )
}

// ── Star row ──────────────────────────────────────────────────────────────────
function Stars({ n=5 }:{ n?:number }) {
  return (
    <span className="inline-flex gap-px">
      {Array.from({length:n},(_,i)=>(
        <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

// ── Message bubble variants ───────────────────────────────────────────────────
const bubbleIn = {
  initial:   { opacity:0, y:14, scale:0.97 },
  animate:   { opacity:1, y:0,  scale:1,
    transition:{ type:"spring", stiffness:220, damping:22 } },
  exit:      { opacity:0, y:-10, transition:{ duration:0.22 } },
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FAQSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const headerRef     = useRef<HTMLDivElement>(null)
  const chatBodyRef   = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const searchRef     = useRef<HTMLInputElement>(null)

  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery,  setSearchQuery]  = useState("")
  const [visibleFaqs,  setVisibleFaqs]  = useState<FAQ[]>(FAQS)
  const [activeFaq,    setActiveFaq]    = useState<FAQ>(FAQS[0])
  const [showTyping,   setShowTyping]   = useState(false)
  const [showAnswer,   setShowAnswer]   = useState(true)
  const [isAnimating,  setIsAnimating]  = useState(false)

  // ── Section entrance animation ────────────────────────────────────────────
  useEffect(()=>{
    const section = sectionRef.current
    const header  = headerRef.current
    const body    = chatBodyRef.current
    if(!section || !header || !body) return

    gsap.set(header, { opacity:0, y:-24 })
    gsap.set(body,   { opacity:0, y:28  })

    const obs = new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting) return
      obs.disconnect()
      const tl = gsap.timeline({ defaults:{ ease:"power3.out" } })
      tl.to(header, { opacity:1, y:0, duration:0.70 }, 0)
        .to(body,   { opacity:1, y:0, duration:0.70 }, 0.18)
    }, { threshold:0.08 })

    obs.observe(section)
    return ()=> obs.disconnect()
  },[])

  // ── Filter logic ──────────────────────────────────────────────────────────
  useEffect(()=>{
    const q = searchQuery.toLowerCase().trim()
    let filtered = FAQS

    if(activeFilter !== "all") {
      filtered = filtered.filter(f=> f.id === activeFilter)
    }
    if(q) {
      filtered = filtered.filter(f=>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q)
      )
    }
    setVisibleFaqs(filtered)
  },[activeFilter, searchQuery])

  // ── Select a FAQ and animate the chat ────────────────────────────────────
  const selectFaq = useCallback((faq: FAQ)=>{
    if(isAnimating || faq.id === activeFaq.id) return
    setIsAnimating(true)
    setShowAnswer(false)

    // Short delay then show new question
    setTimeout(()=>{
      setActiveFaq(faq)
      setShowTyping(true)

      // Typing for 1.1s then show answer
      setTimeout(()=>{
        setShowTyping(false)
        setShowAnswer(true)
        setIsAnimating(false)

        // Scroll chat to bottom
        if(chatScrollRef.current) {
          chatScrollRef.current.scrollTo({
            top: chatScrollRef.current.scrollHeight,
            behavior: "smooth",
          })
        }
      }, 1100)
    }, 200)
  },[activeFaq.id, isAnimating])

  // ── Filter chip click ─────────────────────────────────────────────────────
  const handleFilter = useCallback((id: string)=>{
    setActiveFilter(id)
    // If filtered to one result, show it
    if(id !== "all") {
      const found = FAQS.find(f=> f.id === id)
      if(found) selectFaq(found)
    } else {
      selectFaq(FAQS[0])
    }
  },[selectFaq])

  const filters = [ALL_FILTER, ...FAQS.map(f=>({ id:f.id, topic:f.topic, emoji:f.emoji }))]

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative w-full py-20 md:py-28"
      style={{ background:T.bg, isolation:"isolate" }}>

      {/* CSS keyframes for typing dots */}
      <style>{`
        @keyframes wtDot {
          0%,60%,100%{ transform:translateY(0); opacity:.5 }
          30%{ transform:translateY(-4px); opacity:1 }
        }
      `}</style>

      {/* ── Background glows (same as other sections) ────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex:0 }}>
        <div style={{
          position:"absolute", top:"-12%", right:"-8%",
          width:"45vw", height:"45vw", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 68%)",
          filter:"blur(48px)",
        }}/>
        <div style={{
          position:"absolute", bottom:"-14%", left:"-6%",
          width:"42vw", height:"42vw", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 68%)",
          filter:"blur(44px)",
        }}/>
        {/* Top accent line */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:2,
          background:"linear-gradient(90deg,transparent 5%,rgba(99,102,241,0.30) 25%,rgba(99,102,241,0.55) 50%,rgba(99,102,241,0.30) 75%,transparent 95%)",
        }}/>
        {/* Dot grid side margins */}
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

      {/* ── Ghost section number ─────────────────────────────────────── */}
      <div aria-hidden
        className="absolute font-neulis font-black select-none pointer-events-none"
        style={{
          fontSize:"clamp(72px,10vw,148px)",
          color:"transparent",
          WebkitTextStroke:"1.5px rgba(99,102,241,0.10)",
          top:"3%", right:"1.5vw",
          lineHeight:1, letterSpacing:"-0.04em", zIndex:1,
        }}>
        FAQ
      </div>

      {/* ── Centred container ────────────────────────────────────────── */}
      <div className="relative mx-auto px-4 sm:px-6"
        style={{ maxWidth:760, zIndex:2 }}>

        {/* ════════════════════════════════════════════════════════════
            DARK GLASS HEADER
            ════════════════════════════════════════════════════════════ */}
        <div
          ref={headerRef}
          className="relative overflow-hidden"
          style={{
            background:`linear-gradient(160deg,${T.darkBg} 0%,${T.darkMid} 55%,${T.darkEdge} 100%)`,
            borderRadius:"22px 22px 0 0",
            padding:"28px 28px 22px",
          }}>

          {/* inner glow orb */}
          <div style={{
            position:"absolute", top:"-30%", left:"30%",
            width:"60%", height:"200%",
            background:"radial-gradient(ellipse,rgba(99,102,241,0.18) 0%,transparent 65%)",
            filter:"blur(32px)", pointerEvents:"none",
          }}/>

          {/* top hairline */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:1,
            background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.50),transparent)",
          }}/>

          <div className="relative" style={{ zIndex:1 }}>
            {/* eyebrow */}
            <p className="font-robert font-bold uppercase"
              style={{
                fontSize:10, letterSpacing:".22em",
                color:"rgba(99,102,241,0.70)", marginBottom:8,
              }}>
              Got Questions?
            </p>

            {/* heading */}
            <h2 className="font-neulis font-black leading-[1.04] tracking-tight"
              style={{
                fontSize:"clamp(1.8rem,4.2vw,3.2rem)",
                color:"#fff", marginBottom:20,
              }}>
              Ask me{" "}
              <span style={{ color:"#818cf8" }}>anything.</span>
            </h2>

            {/* search bar */}
            <div className="relative flex items-center gap-2.5 mb-4"
              style={{
                ...glassLight,
                borderRadius:32,
                padding:"10px 18px",
              }}>
              <Search style={{ width:14, height:14, color:"rgba(255,255,255,0.40)", flexShrink:0 }}/>
              <input
                ref={searchRef}
                type="text"
                placeholder='Search questions... e.g. "payment", "deadline"'
                value={searchQuery}
                onChange={e=> setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none font-robert"
                style={{ fontSize:13, color:"rgba(255,255,255,0.85)", caretColor:"#6366f1" }}
              />
              {/* live indicator dot */}
              <div style={{
                width:6, height:6, borderRadius:"50%",
                background: T.accent,
                boxShadow:`0 0 7px ${T.accent}`,
                flexShrink:0,
              }}/>
            </div>

            {/* filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth:"none", msOverflowStyle:"none" }}>
              {filters.map(f=>{
                const active = activeFilter === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={()=> handleFilter(f.id)}
                    className="font-robert font-bold whitespace-nowrap flex-shrink-0"
                    style={{
                      fontSize:11,
                      padding:"5px 14px",
                      borderRadius:20,
                      border:"none",
                      cursor:"pointer",
                      transition:"all 0.22s cubic-bezier(0.22,1,0.36,1)",
                      ...(active
                        ? { background:T.accent, color:"#fff",
                            boxShadow:`0 3px 12px rgba(99,102,241,0.45)` }
                        : { background:"rgba(255,255,255,0.10)",
                            color:"rgba(255,255,255,0.70)",
                            border:"0.5px solid rgba(255,255,255,0.14)" }
                      ),
                    }}>
                    {f.emoji && <span style={{ marginRight:4 }}>{f.emoji}</span>}
                    {f.topic}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            LIGHT CHAT BODY
            ════════════════════════════════════════════════════════════ */}
        <div
          ref={chatBodyRef}
          style={{
            background:T.bg,
            border:`1px solid rgba(99,102,241,0.12)`,
            borderTop:"none",
          }}>

          {/* chat scroll area */}
          <div
            ref={chatScrollRef}
            className="flex flex-col gap-4"
            style={{
              padding:"22px 24px",
              minHeight:280,
              overflowY:"auto",
              scrollbarWidth:"none",
            }}>

            {/* ── Student question bubble ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`q-${activeFaq.id}`}
                {...bubbleIn}
                className="flex gap-2.5 items-end">
                {/* avatar */}
                <div className="flex-shrink-0 font-neulis font-black flex items-center justify-center"
                  style={{
                    width:32, height:32, borderRadius:"50%",
                    background:activeFaq.student.avatarBg,
                    fontSize:12, color:activeFaq.student.nameColor,
                    border:"1.5px solid rgba(255,255,255,0.80)",
                    boxShadow:"0 2px 8px rgba(26,31,46,0.10)",
                  }}>
                  {activeFaq.student.initial}
                </div>
                {/* bubble */}
                <div style={{
                  ...glassWhite,
                  borderRadius:"18px 18px 18px 4px",
                  padding:"10px 14px",
                  maxWidth:"74%",
                }}>
                  <p className="font-robert font-bold"
                    style={{ fontSize:10, color:activeFaq.student.nameColor, marginBottom:3, letterSpacing:".04em" }}>
                    {activeFaq.student.name}
                  </p>
                  <p className="font-robert leading-relaxed"
                    style={{ fontSize:13.5, color:T.ink }}>
                    {activeFaq.question}
                  </p>
                  <p className="font-robert" style={{ fontSize:9, color:T.muted, marginTop:4, textAlign:"right" }}>
                    Just now
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Typing indicator ── */}
            <AnimatePresence>
              {showTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity:0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }}
                  transition={{ duration:0.28 }}
                  className="flex gap-2.5 items-end flex-row-reverse">
                  {/* Prince avatar */}
                  <div className="flex-shrink-0 font-neulis font-black flex items-center justify-center text-white"
                    style={{
                      width:32, height:32, borderRadius:"50%",
                      background:"linear-gradient(135deg,#6366f1,#4338ca)",
                      fontSize:11, boxShadow:"0 3px 12px rgba(99,102,241,0.45)",
                    }}>
                    P
                  </div>
                  <TypingIndicator/>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Prince answer bubble ── */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  key={`a-${activeFaq.id}`}
                  {...bubbleIn}
                  className="flex gap-2.5 items-end flex-row-reverse">
                  {/* Prince avatar */}
                  <div className="flex-shrink-0 font-neulis font-black flex items-center justify-center text-white"
                    style={{
                      width:32, height:32, borderRadius:"50%",
                      background:"linear-gradient(135deg,#6366f1,#4338ca)",
                      fontSize:11,
                      boxShadow:"0 3px 12px rgba(99,102,241,0.45)",
                    }}>
                    P
                  </div>
                  {/* bubble */}
                  <div style={{
                    background:"linear-gradient(135deg,#6366f1 0%,#4338ca 100%)",
                    borderRadius:"18px 18px 4px 18px",
                    padding:"11px 15px",
                    maxWidth:"78%",
                    boxShadow:"0 6px 24px rgba(99,102,241,0.35)",
                  }}>
                    <p className="font-robert leading-relaxed"
                      style={{ fontSize:13.5, color:"#fff" }}>
                      {activeFaq.answer}
                    </p>
                    {/* inline guarantee badge */}
                    {activeFaq.badge && (
                      <div className="inline-flex items-center gap-1.5 mt-2 font-robert font-bold"
                        style={{
                          fontSize:10, color:activeFaq.badge.color,
                          background:activeFaq.badge.bg,
                          padding:"2px 8px", borderRadius:8,
                        }}>
                        {activeFaq.badge.text}
                      </div>
                    )}
                    {/* tick + time */}
                    <div className="flex items-center justify-between mt-1.5">
                      <Stars/>
                      <span className="font-robert"
                        style={{ fontSize:9, color:"rgba(255,255,255,0.50)" }}>
                        ✓✓ Delivered
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── Quick-tap question chips ────────────────────────────── */}
          <div style={{
            padding:"0 24px 18px",
            borderTop:`0.5px solid rgba(99,102,241,0.08)`,
            paddingTop:14,
          }}>
            <p className="font-robert font-bold uppercase"
              style={{ fontSize:9, letterSpacing:".18em", color:T.muted, marginBottom:10 }}>
              Tap a question
            </p>
            <div className="flex flex-wrap gap-2">
              {visibleFaqs.length > 0
                ? visibleFaqs.map(faq=>(
                    <button
                      key={faq.id}
                      type="button"
                      onClick={()=> selectFaq(faq)}
                      disabled={isAnimating}
                      className={cn(
                        "font-robert font-bold flex items-center gap-1.5",
                        "transition-all duration-200",
                        faq.id === activeFaq.id
                          ? "opacity-100"
                          : "opacity-75 hover:opacity-100"
                      )}
                      style={{
                        fontSize:11.5, padding:"6px 13px", borderRadius:22,
                        background: faq.id === activeFaq.id
                          ? "rgba(99,102,241,0.10)"
                          : "rgba(255,255,255,0.90)",
                        border: faq.id === activeFaq.id
                          ? `1.5px solid rgba(99,102,241,0.32)`
                          : `1px solid rgba(99,102,241,0.16)`,
                        color: faq.id === activeFaq.id ? T.accent : T.ink,
                        cursor: isAnimating ? "wait" : "pointer",
                        boxShadow: faq.id === activeFaq.id
                          ? "0 2px 10px rgba(99,102,241,0.14)"
                          : "0 1px 6px rgba(26,31,46,0.06)",
                        backdropFilter:"blur(10px)",
                        WebkitBackdropFilter:"blur(10px)",
                      }}>
                      <span style={{ fontSize:9, opacity:.7 }}>?</span>
                      {faq.topic}
                    </button>
                  ))
                : (
                  <p className="font-robert" style={{ fontSize:12, color:T.muted }}>
                    No questions match "{searchQuery}" — try a different keyword.
                  </p>
                )
              }
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            FROSTED GLASS INPUT BAR (bottom)
            ════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center gap-3"
          style={{
            ...glassWhite,
            borderRadius:"0 0 22px 22px",
            borderTop:"none",
            padding:"12px 16px",
            border:`1px solid rgba(99,102,241,0.12)`,
          }}>
          {/* Prince avatar mini */}
          <div className="flex-shrink-0 font-neulis font-black flex items-center justify-center text-white"
            style={{
              width:28, height:28, borderRadius:"50%",
              background:"linear-gradient(135deg,#6366f1,#4338ca)",
              fontSize:10,
              boxShadow:"0 2px 8px rgba(99,102,241,0.40)",
            }}>
            P
          </div>
          {/* placeholder text */}
          <div className="flex-1">
            <p className="font-robert" style={{ fontSize:13, color:T.muted }}>
              Ask anything — I reply in &lt;2hrs
            </p>
          </div>
          {/* online indicator */}
          <div className="flex items-center gap-1.5">
            <div style={{
              width:6, height:6, borderRadius:"50%",
              background:T.green,
              boxShadow:`0 0 6px ${T.green}`,
            }}/>
            <span className="font-robert font-bold"
              style={{ fontSize:10, color:T.green }}>
              Online now
            </span>
          </div>
          {/* send button — links to Telegram */}
          <a
            href="https://t.me/your_telegram"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center justify-center text-white"
            style={{
              width:36, height:36, borderRadius:"50%",
              background:"linear-gradient(135deg,#6366f1,#4338ca)",
              boxShadow:"0 3px 12px rgba(99,102,241,0.45)",
              transition:"transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e=>{
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform="scale(1.08)"
              el.style.boxShadow="0 5px 18px rgba(99,102,241,0.55)"
            }}
            onMouseLeave={e=>{
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform="scale(1)"
              el.style.boxShadow="0 3px 12px rgba(99,102,241,0.45)"
            }}>
            <Send style={{ width:15, height:15 }}/>
          </a>
        </div>

        {/* ── disclaimer note ── */}
        <p className="font-robert text-center mt-4"
          style={{ fontSize:11, color:T.muted, lineHeight:1.6 }}>
          Have a different question?{" "}
          <a href="https://t.me/your_telegram" target="_blank" rel="noopener noreferrer"
            className="font-bold"
            style={{ color:T.accent, textDecoration:"none" }}>
            Message me on Telegram →
          </a>
        </p>

      </div>
    </section>
  )
}
