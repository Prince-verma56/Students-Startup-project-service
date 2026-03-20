"use client"

// ─────────────────────────────────────────────────────────────────────────────
// ReviewSection — Student portfolio review section
//
// THEME: Navy (#1A1F2E) + Indigo (#6366F1) + Warm Linen (#FFFFFF bg)
// FONTS: font-neulis (headings), font-robert (body)
// STYLE: Claymorphism — layered shadows, white inset highlight, border
//
// ANIMATIONS (GSAP ScrollTrigger — no pin, no spacer issues):
//   • Section bg subtle fade-in
//   • Eyebrow badge: y:30 → 0, opacity 0→1
//   • H2 heading: y:50 → 0, opacity 0→1, slight skewX
//   • Stats card: y:40 → 0, opacity 0→1, scale 0.94→1
//   • Stat bars: scaleX 0→width (staggered)
//   • Filter tabs: y:16 → 0, opacity 0→1, staggered
//   • Review cards: y:40 → 0, opacity 0→1, scale 0.93→1, staggered 0.09s
//   • Form box: y:50 → 0, opacity 0→1, scale 0.95→1
//   • SideBlob cards: x:±40 → 0, opacity 0→1 (left slides from left, right from right)
//   • Floating shapes: continuous bob via GSAP (independent of scroll)
//
// GSAP RULES USED HERE:
//   • gsap.context() → scopes all animations to section, safe cleanup
//   • ScrollTrigger with toggleActions:"play none none reverse"
//     → plays on enter, reverses on leave back (elegant re-trigger)
//   • scrub: false (toggleActions instead) → snappy, not sluggish
//   • All initial states set with gsap.set() before ScrollTrigger fires
//   • Staggered children use gsap.utils.toArray() + stagger option
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight, ArrowUpDown, MessageSquarePlus } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id:      number
  name:    string
  college: string
  stars:   number
  text:    string
  type:    "basic" | "frontend" | "fullstack" | "complete"
  ago:     string
  ts:      number
}
type FilterType = "all" | "basic" | "frontend" | "fullstack" | "complete"

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:      "#F9FBFF",
  card:    "#FFFFFF",
  sidebar: "#1A1F2E",
  accent:  "#6366F1",
  accentL: "#EEF2FF",
  ink:     "#1A1F2E",
  sub:     "#5A6075",
  muted:   "#9AA0B5",
  border:  "rgba(26,31,46,0.09)",
  green:   "#34D399",
}

// Claymorphism shadow — same system used throughout the portfolio
const clay = (hover = false): React.CSSProperties => ({
  background:   T.card,
  borderRadius: 20,
  border:       `1.5px solid ${hover ? "rgba(99,102,241,0.25)" : T.border}`,
  boxShadow:    hover
    ? "0 4px 0 1px rgba(99,102,241,0.12), 0 12px 32px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,1)"
    : "0 2px 0 1px rgba(26,31,46,0.05), 0 8px 24px rgba(26,31,46,0.07), inset 0 1px 0 rgba(255,255,255,1)",
})

// ── Static data ───────────────────────────────────────────────────────────────
const REVIEWS: Review[] = [
  { id:1, name:"Rahul S.",  college:"VIT Vellore",        stars:5, type:"fullstack", ts:7, ago:"2 days ago",
    text:"Got a full React + Node dashboard in 4 days. He explained every file before handing over. I actually understood what I submitted." },
  { id:2, name:"Priya M.",  college:"UPES Dehradun",       stars:5, type:"frontend",  ts:6, ago:"1 week ago",
    text:"Super fast delivery. The code was clean and commented. Took me through the structure on a call. Highly recommend." },
  { id:3, name:"Aryan K.",  college:"DTU Delhi",           stars:5, type:"complete",  ts:5, ago:"2 weeks ago",
    text:"Needed a complete web app in 6 days. Delivered in 5. Source code and README included. Saved my final year project." },
  { id:4, name:"Sneha R.",  college:"SRM Chennai",         stars:4, type:"basic",     ts:4, ago:"3 weeks ago",
    text:"Good work, responsive and communicative. Minor revision was done within hours. Would use again." },
  { id:5, name:"Dev P.",    college:"Manipal",             stars:5, type:"fullstack", ts:3, ago:"1 month ago",
    text:"The explanation he gave was better than my professor's. Understood every component. Put it on my resume." },
  { id:6, name:"Ananya T.", college:"Lovely Professional", stars:5, type:"basic",     ts:2, ago:"1 month ago",
    text:"Portfolio site in 3 days. Looks professional, fully responsive. Exactly what I needed for internship apps." },
]

const STAR_DIST: Record<number,number> = { 5:16, 4:2, 3:0, 2:0, 1:0 }
const TOTAL = 18
const AVG   = 4.9

const BADGE: Record<string,{ label:string; bg:string; fg:string; dot:string }> = {
  basic:     { label:"Basic site",   bg:"#EEF2FF", fg:"#4338CA", dot:"#818CF8" },
  frontend:  { label:"Frontend",     bg:"#F0FDF4", fg:"#166534", dot:"#34D399" },
  fullstack: { label:"Full-stack",   bg:"#F5F3FF", fg:"#5B21B6", dot:"#A78BFA" },
  complete:  { label:"Complete app", bg:"#FFF7ED", fg:"#9A3412", dot:"#FB923C" },
}

const AVATARS = [
  { bg:"#EEF2FF", fg:"#4338CA" }, { bg:"#F0FDF4", fg:"#15803D" },
  { bg:"#FDF4FF", fg:"#9333EA" }, { bg:"#FFF7ED", fg:"#C2410C" },
  { bg:"#FFF1F2", fg:"#BE123C" }, { bg:"#ECFDF5", fg:"#047857" },
]

const FILTER_TABS: { type: FilterType; label: string }[] = [
  { type:"all",       label:"All"         },
  { type:"basic",     label:"Basic"       },
  { type:"frontend",  label:"Frontend"    },
  { type:"fullstack", label:"Full-stack"  },
  { type:"complete",  label:"Complete"    },
]

const HINTS = ["","Too low?","Below avg","Average","Good","Excellent ⭐"]

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (n: string) =>
  n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

function StarsRow({ count, size = 11 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          style={{ fill: i < count ? "#f59e0b" : "none", stroke: i < count ? "#f59e0b" : "#d1d5db", strokeWidth: 1.5 }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

// ── Side decorations (animated via GSAP refs passed from parent) ──────────────
interface SideBlobsProps {
  leftCard1Ref: React.RefObject<HTMLDivElement | null>
  leftCard2Ref: React.RefObject<HTMLDivElement | null>
  rightCard1Ref: React.RefObject<HTMLDivElement | null>
  rightCard2Ref: React.RefObject<HTMLDivElement | null>
  leftRingRef: React.RefObject<HTMLDivElement | null>
  rightDiamondRef: React.RefObject<HTMLDivElement | null>
}

function SideBlobs({
  leftCard1Ref, leftCard2Ref, rightCard1Ref, rightCard2Ref,
  leftRingRef, rightDiamondRef,
}: SideBlobsProps) {
  return (
    <>
      {/* ── LEFT ── */}
      <div aria-hidden className="absolute left-0 top-0 h-full pointer-events-none overflow-hidden"
        style={{ width: "15vw", zIndex: 0 }}>
        {/* Ghost number */}
        <div className="absolute font-neulis font-black select-none"
          style={{ fontSize: "clamp(80px,12vw,160px)", color: "transparent",
            WebkitTextStroke: "2px rgba(99,102,241,0.12)", top: "8%", left: "5%", lineHeight: 1 }}>
          05
        </div>
        {/* Stat card 1 */}
        <div ref={leftCard1Ref} className="absolute"
          style={{ top: "30%", left: "8%", ...clay(), borderRadius: 16, padding: "14px 18px", minWidth: 130, opacity: 0 }}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: T.accent }}>
            Avg. Rating
          </p>
          <p className="font-neulis font-black text-2xl leading-none" style={{ color: T.ink }}>4.9 / 5</p>
          <StarsRow count={5} size={10} />
        </div>
        {/* Stat card 2 */}
        <div ref={leftCard2Ref} className="absolute"
          style={{ top: "52%", left: "8%", ...clay(), borderRadius: 16, padding: "14px 18px", minWidth: 130, opacity: 0 }}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: T.accent }}>
            Revisions
          </p>
          <p className="font-neulis font-black text-xl leading-none italic" style={{ color: T.ink }}>Unlimited</p>
        </div>
        {/* Floating ring */}
        <div ref={leftRingRef} className="absolute" style={{ top: "72%", left: "18%", opacity: 0 }}>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="rv_r1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="19" stroke="url(#rv_r1)" strokeWidth="7" fill="none" />
          </svg>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div aria-hidden className="absolute right-0 top-0 h-full pointer-events-none overflow-hidden"
        style={{ width: "15vw", zIndex: 0 }}>
        {/* Ghost star */}
        <div className="absolute font-neulis font-black select-none text-right"
          style={{ fontSize: "clamp(80px,12vw,160px)", color: "transparent",
            WebkitTextStroke: "2px rgba(99,102,241,0.10)", top: "5%", right: "5%", lineHeight: 1 }}>
          ★
        </div>
        {/* Stat card 1 */}
        <div ref={rightCard1Ref} className="absolute"
          style={{ top: "28%", right: "8%", ...clay(), borderRadius: 16, padding: "14px 18px", minWidth: 130, opacity: 0 }}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: T.muted }}>Status</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.green }} />
            <p className="font-neulis font-black text-sm leading-none" style={{ color: T.ink }}>Verified</p>
          </div>
          <p className="font-robert text-[10px] mt-1" style={{ color: T.muted }}>{TOTAL} reviews</p>
        </div>
        {/* Stat card 2 */}
        <div ref={rightCard2Ref} className="absolute"
          style={{ top: "50%", right: "8%", ...clay(), borderRadius: 16, padding: "14px 18px", minWidth: 130, opacity: 0 }}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: T.accent }}>Turnaround</p>
          <p className="font-neulis font-black text-xl leading-none" style={{ color: T.ink }}>48 hrs</p>
        </div>
        {/* Floating diamond */}
        <div ref={rightDiamondRef} className="absolute" style={{ top: "74%", right: "20%", opacity: 0 }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <defs>
              <radialGradient id="rv_d1" cx="35%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#A5B4FC" /><stop offset="100%" stopColor="#6366F1" />
              </radialGradient>
            </defs>
            <rect x="5" y="5" width="26" height="26" rx="4" fill="url(#rv_d1)" transform="rotate(45 18 18)" />
          </svg>
        </div>
      </div>
    </>
  )
}

// ── Review card (Framer Motion for filter transitions — GSAP for scroll-in) ───
function ReviewCard({ r, i }: { r: Review; i: number }) {
  const [hov, setHov] = useState(false)
  const av  = AVATARS[i % AVATARS.length]
  const bdg = BADGE[r.type]
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.38, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        ...clay(hov), padding: "18px 20px", cursor: "default",
        transition: "box-shadow 0.25s, border-color 0.25s, transform 0.2s",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-robert font-bold text-xs flex-shrink-0"
            style={{ background: av.bg, color: av.fg }}>
            {initials(r.name)}
          </div>
          <div>
            <p className="font-robert font-semibold text-[12px] leading-tight" style={{ color: T.ink }}>{r.name}</p>
            <p className="font-robert text-[10px] mt-0.5" style={{ color: T.muted }}>{r.college}</p>
          </div>
        </div>
        <StarsRow count={r.stars} size={11} />
      </div>
      <p className="font-robert text-[12.5px] leading-[1.75] line-clamp-4 mb-3" style={{ color: T.sub }}>
        <span className="font-serif text-xl leading-none align-[-5px] mr-0.5" style={{ color: T.muted }}>"</span>
        {r.text}
      </p>
      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <span className="font-robert text-[10px]" style={{ color: T.muted }}>{r.ago}</span>
        <span className="font-robert text-[9.5px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: bdg.bg, color: bdg.fg, border: `1px solid ${bdg.fg}22` }}>
          {bdg.label}
        </span>
      </div>
    </motion.div>
  )
}

// ── Review form ───────────────────────────────────────────────────────────────
function ReviewForm() {
  const [rating,  setRating]  = useState(0)
  const [text,    setText]    = useState("")
  const [name,    setName]    = useState("")
  const [type,    setType]    = useState("")
  const [done,    setDone]    = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!rating)      { alert("Please select a star rating."); return }
    if (!text.trim()) { alert("Please write a short review."); return }
    if (!name.trim()) { alert("Please enter your name."); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false); setDone(true)
  }

  const iStyle: React.CSSProperties = {
    borderRadius: 14, border: `1.5px solid ${T.border}`,
    background: "#FAFAF8", color: T.ink, fontSize: 13,
    fontFamily: "var(--font-robert)",
    boxShadow: "inset 0 1px 3px rgba(26,31,46,0.05)",
    outline: "none", width: "100%", padding: "10px 14px",
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center py-10 gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 280, damping: 18 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: T.accentL, border: `1px solid rgba(99,102,241,0.25)` }}>
          <Check size={24} style={{ color: T.accent, strokeWidth: 2.5 }} />
        </motion.div>
        <div>
          <h4 className="font-neulis font-black text-base mb-1" style={{ color: T.ink }}>
            Review submitted! ⚡
          </h4>
          <p className="font-robert text-xs leading-relaxed max-w-[260px] mx-auto" style={{ color: T.muted }}>
            I&apos;ll verify and add it shortly. It helps other students trust the process.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {["✓ Will be verified", "✓ No spam", "✓ Thank you"].map(t => (
            <span key={t} className="font-robert text-[10px] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "#FFFFFF", border: `1px solid ${T.border}`, color: T.sub }}>{t}</span>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Star picker */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-robert text-[10px] font-bold tracking-widest uppercase" style={{ color: T.muted }}>
          Rating
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" onClick={() => setRating(n)}
              className="transition-transform hover:scale-125 active:scale-95" aria-label={`${n} star`}>
              <svg width="22" height="22" viewBox="0 0 24 24"
                style={{ fill: n <= rating ? "#f59e0b" : "none", stroke: "#f59e0b", strokeWidth: 1.8, transition: "fill .12s" }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="font-robert text-[11px]" style={{ color: T.muted }}>{HINTS[rating]}</span>
        )}
      </div>

      {/* Experience textarea */}
      <div>
        <label className="font-robert text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: T.muted }}>
          Your experience
        </label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
          placeholder="Tell other students what it was like — delivery speed, code quality, explanation..."
          className="resize-none" style={{ ...iStyle, padding: "12px 14px" }} />
      </div>

      {/* Name + type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-robert text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: T.muted }}>
            Name + College
          </label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Rahul, VIT" style={iStyle} />
        </div>
        <div>
          <label className="font-robert text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: T.muted }}>
            Project type
          </label>
          <select value={type} onChange={e => setType(e.target.value)} style={{ ...iStyle, cursor: "pointer" }}>
            <option value="">Select type...</option>
            <option value="basic">Basic static website</option>
            <option value="frontend">Frontend — React</option>
            <option value="fullstack">Mini full-stack</option>
            <option value="complete">Complete web app</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
        <p className="font-robert text-[10px]" style={{ color: T.muted }}>Appears after manual verification</p>
        <motion.button type="button" onClick={submit} disabled={loading}
          whileHover={{ y: -1.5 }} whileTap={{ y: 1, scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-robert font-bold text-[12px] text-white disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg,#6366F1,#818CF8)",
            boxShadow: "0 4px 0 rgba(55,48,163,0.4), 0 8px 20px rgba(99,102,241,0.22)",
          }}>
          {loading ? "Submitting…" : "Submit review"}
          {!loading && <ArrowRight size={13} />}
        </motion.button>
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function ReviewSection() {
  const [filter,  setFilter]  = useState<FilterType>("all")
  const [sortNew, setSortNew] = useState(true)

  // GSAP refs — all elements that need scroll-triggered animation
  const sectionRef      = useRef<HTMLElement>(null)
  const eyebrowRef      = useRef<HTMLDivElement>(null)
  const headingRef      = useRef<HTMLHeadingElement>(null)
  const subRef          = useRef<HTMLParagraphElement>(null)
  const statsRef        = useRef<HTMLDivElement>(null)
  const barFillsRef     = useRef<HTMLDivElement>(null)
  const filtersRef      = useRef<HTMLDivElement>(null)
  const gridRef         = useRef<HTMLDivElement>(null)
  const formRef         = useRef<HTMLDivElement>(null)
  // SideBlob card refs
  const leftCard1Ref    = useRef<HTMLDivElement>(null)
  const leftCard2Ref    = useRef<HTMLDivElement>(null)
  const rightCard1Ref   = useRef<HTMLDivElement>(null)
  const rightCard2Ref   = useRef<HTMLDivElement>(null)
  const leftRingRef     = useRef<HTMLDivElement>(null)
  const rightDiamondRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const base = filter === "all" ? [...REVIEWS] : REVIEWS.filter(r => r.type === filter)
    return [...base].sort((a, b) => sortNew ? b.ts - a.ts : a.ts - b.ts)
  }, [filter, sortNew])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: REVIEWS.length }
    REVIEWS.forEach(r => { c[r.type] = (c[r.type] || 0) + 1 })
    return c
  }, [])

  const totalDist = Object.values(STAR_DIST).reduce((a, b) => a + b, 0)

  // ── GSAP ScrollTrigger animations ──────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // Helper: creates a standard scroll trigger config
      // toggleActions: play forward, nothing on leave, nothing on enter back, reverse on scroll back
      const mkST = (trigger: Element, start = "top 85%") => ({
        trigger,
        start,
        toggleActions: "play none none reverse" as const,
      })

      // ── 1. Eyebrow badge ─────────────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { opacity: 0, y: 24 })
        gsap.to(eyebrowRef.current, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: mkST(eyebrowRef.current),
        })
      }

      // ── 2. H2 heading — y drop + skew ────────────────────────────────────
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 40, skewX: -3 })
        gsap.to(headingRef.current, {
          opacity: 1, y: 0, skewX: 0, duration: 0.85, ease: "power3.out",
          scrollTrigger: mkST(headingRef.current),
        })
      }

      // ── 3. Sub text ───────────────────────────────────────────────────────
      if (subRef.current) {
        gsap.set(subRef.current, { opacity: 0, y: 20 })
        gsap.to(subRef.current, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1,
          scrollTrigger: mkST(subRef.current),
        })
      }

      // ── 4. Stats card — scale + fade ─────────────────────────────────────
      if (statsRef.current) {
        gsap.set(statsRef.current, { opacity: 0, y: 36, scale: 0.96 })
        gsap.to(statsRef.current, {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: mkST(statsRef.current, "top 82%"),
        })
      }

      // ── 5. Bar fills — staggered scaleX ──────────────────────────────────
      if (barFillsRef.current) {
        const bars = barFillsRef.current.querySelectorAll<HTMLElement>(".gsap-bar-fill")
        if (bars.length) {
          gsap.set(bars, { scaleX: 0, transformOrigin: "left center" })
          gsap.to(bars, {
            scaleX: 1, duration: 0.9, ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: mkST(barFillsRef.current, "top 78%"),
          })
        }
      }

      // ── 6. Filter tabs — staggered fade ──────────────────────────────────
      if (filtersRef.current) {
        const tabs = filtersRef.current.querySelectorAll<HTMLElement>(".gsap-filter-tab")
        if (tabs.length) {
          gsap.set(tabs, { opacity: 0, y: 14 })
          gsap.to(tabs, {
            opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: mkST(filtersRef.current),
          })
        }
      }

      // ── 7. Review cards — staggered y + scale ────────────────────────────
      // Note: Framer Motion handles filter-change transitions.
      // GSAP handles the initial scroll-in reveal only.
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>(".gsap-review-card")
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 40, scale: 0.94 })
          gsap.to(cards, {
            opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: mkST(gridRef.current, "top 80%"),
          })
        }
      }

      // ── 8. Form box — y + scale ───────────────────────────────────────────
      if (formRef.current) {
        gsap.set(formRef.current, { opacity: 0, y: 44, scale: 0.97 })
        gsap.to(formRef.current, {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: mkST(formRef.current, "top 85%"),
        })
      }

      // ── 9. SideBlob LEFT cards — slide from left ──────────────────────────
      const leftEls = [leftCard1Ref.current, leftCard2Ref.current].filter(Boolean) as HTMLElement[]
      leftEls.forEach((el, i) => {
        gsap.set(el, { opacity: 0, x: -36 })
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: i * 0.15,
          scrollTrigger: mkST(section, "top 70%"),
        })
      })

      // ── 10. SideBlob RIGHT cards — slide from right ───────────────────────
      const rightEls = [rightCard1Ref.current, rightCard2Ref.current].filter(Boolean) as HTMLElement[]
      rightEls.forEach((el, i) => {
        gsap.set(el, { opacity: 0, x: 36 })
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: i * 0.15,
          scrollTrigger: mkST(section, "top 70%"),
        })
      })

      // ── 11. Floating shapes — bob continuously (not scroll-driven) ────────
      const floatEls = [leftRingRef.current, rightDiamondRef.current].filter(Boolean) as HTMLElement[]
      floatEls.forEach((el, i) => {
        // Fade in on scroll
        gsap.set(el, { opacity: 0, scale: 0.5 })
        gsap.to(el, {
          opacity: 0.38, scale: 1, duration: 0.8, ease: "back.out(1.4)",
          scrollTrigger: mkST(section, "top 75%"),
        })
        // Continuous bob — independent of scroll
        gsap.to(el, {
          y: `-=${14 + i * 6}`, ease: "sine.inOut",
          yoyo: true, repeat: -1, duration: 3 + i * 1.2, delay: i * 0.5,
        })
        // Slow rotation for diamond
        if (i === 1) {
          gsap.to(el, { rotation: 360, ease: "none", repeat: -1, duration: 18 })
        }
      })

    }, section)

    const t = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(t)
      ctx.revert()
      ScrollTrigger.getAll().filter(t => t.vars.trigger === section).forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="reviews"
      aria-label="Student reviews"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: T.bg }}
    >
      {/* Radial bg glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "70vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 65%)",
          filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-5%",
          width: "35vw", height: "35vw", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 65%)",
          filter: "blur(50px)" }} />
      </div>

      {/* Side decorations */}
      <SideBlobs
        leftCard1Ref={leftCard1Ref} leftCard2Ref={leftCard2Ref}
        rightCard1Ref={rightCard1Ref} rightCard2Ref={rightCard2Ref}
        leftRingRef={leftRingRef} rightDiamondRef={rightDiamondRef}
      />

      {/* Centre content */}
      <div className="relative max-w-4xl mx-auto px-4" style={{ zIndex: 2 }}>

        {/* Header */}
        <div className="text-center mb-10">
          <div ref={eyebrowRef}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 font-robert font-bold text-[10px] tracking-widest uppercase"
            style={{ background: T.accentL, color: T.accent, border: `1px solid rgba(99,102,241,0.15)`, opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.accent }} />
            Student reviews
          </div>
          <h2 ref={headingRef}
            className="font-neulis font-black text-zinc-900 leading-tight tracking-tight mb-2"
            style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)", opacity: 0 }}>
            What students say after{" "}
            <span style={{ color: T.accent }}>working with me</span>
          </h2>
          <p ref={subRef}
            className="font-robert text-sm max-w-sm mx-auto leading-relaxed"
            style={{ color: T.muted, opacity: 0 }}>
            Real reviews from real students — verified before going live.
          </p>
        </div>

        {/* Stats row */}
        <div ref={statsRef}
          className="flex flex-col sm:flex-row rounded-2xl mb-6 overflow-hidden"
          style={{ ...clay(), borderRadius: 20, opacity: 0 }}>
          {/* Score */}
          <div className="flex flex-col justify-center gap-2 px-6 py-5 min-w-[150px]">
            <p className="font-neulis font-black leading-none"
              style={{ fontSize: 54, letterSpacing: "-0.04em", color: T.ink }}>
              {AVG}
            </p>
            <StarsRow count={5} size={15} />
            <p className="font-robert text-[11px] mt-0.5" style={{ color: T.muted }}>
              <strong className="font-semibold" style={{ color: T.ink }}>{TOTAL}</strong> verified reviews
            </p>
          </div>
          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch" style={{ background: T.border }} />
          <div className="block sm:hidden h-px" style={{ background: T.border }} />
          {/* Bars */}
          <div ref={barFillsRef} className="flex flex-col justify-center gap-2 px-5 py-5 flex-1">
            {[5, 4, 3, 2, 1].map(star => {
              const n   = STAR_DIST[star] ?? 0
              const pct = totalDist ? Math.round(n / totalDist * 100) : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="font-robert text-[11px] w-2.5 text-right" style={{ color: T.muted }}>{star}</span>
                  <div className="flex-1 h-[6px] rounded-full overflow-hidden"
                    style={{ background: "rgba(26,31,46,0.07)" }}>
                    {/* gsap-bar-fill class is used by GSAP selector */}
                    <div className="gsap-bar-fill h-full rounded-full"
                      style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6366F1,#818CF8)" }} />
                  </div>
                  <span className="font-robert text-[10px] w-4 text-right" style={{ color: T.muted }}>{n}</span>
                  <span className="font-robert text-[10px] w-8 text-right" style={{ color: T.muted }}>
                    {pct ? `${pct}%` : ""}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Filters + sort */}
        <div ref={filtersRef} className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_TABS.map(tab => {
              const dot = BADGE[tab.type as keyof typeof BADGE]?.dot ?? T.muted
              const on  = filter === tab.type
              return (
                <button key={tab.type}
                  className="gsap-filter-tab flex items-center gap-1.5 px-3 py-1.5 rounded-full font-robert font-medium text-[11px] transition-all duration-150"
                  onClick={() => setFilter(tab.type)}
                  style={on
                    ? { background: T.accent, color: "#fff", border: `1px solid ${T.accent}`,
                        boxShadow: "0 3px 0 rgba(55,48,163,0.35), 0 6px 14px rgba(99,102,241,0.2)" }
                    : { background: "#FFFFFF", color: T.sub, border: `1px solid ${T.border}` }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: on ? "rgba(255,255,255,0.6)" : dot }} />
                  {tab.label}
                  <span className="opacity-50 text-[9px]">({counts[tab.type] ?? 0})</span>
                </button>
              )
            })}
          </div>
          <button className="gsap-filter-tab flex items-center gap-1.5 font-robert text-[11px] transition-colors whitespace-nowrap"
            onClick={() => setSortNew(p => !p)}
            style={{ color: T.muted }}>
            <ArrowUpDown size={12} /> {sortNew ? "Latest first" : "Oldest first"}
          </button>
        </div>

        {/* Cards grid */}
        <motion.div ref={gridRef} layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full py-10 text-center rounded-2xl font-robert text-sm"
                style={{ border: `1px dashed ${T.border}`, color: T.muted }}>
                No reviews yet for this type.
              </motion.div>
            ) : (
              filtered.map((r, i) => (
                // gsap-review-card class used by GSAP querySelectorAll
                <div key={r.id} className="gsap-review-card">
                  <ReviewCard r={r} i={i} />
                </div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Review form — always visible */}
        <div ref={formRef} style={{ ...clay(), borderRadius: 24, opacity: 0 }}>
          <div className="flex items-center justify-between px-6 pt-6 pb-5"
            style={{ borderBottom: `1.5px solid ${T.border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: T.accentL, border: `1px solid rgba(99,102,241,0.2)` }}>
                <MessageSquarePlus size={18} style={{ color: T.accent, strokeWidth: 1.8 }} />
              </div>
              <div>
                <p className="font-neulis font-black text-[15px] leading-tight" style={{ color: T.ink }}>
                  Worked with me? Leave a review
                </p>
                <p className="font-robert text-[11px] mt-0.5" style={{ color: T.muted }}>
                  Takes 30 seconds — helps other students decide
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              {["Verified", "No spam"].map(t => (
                <span key={t} className="font-robert text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: T.accentL, color: T.accent, border: `1px solid rgba(99,102,241,0.15)` }}>
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>
          <div className="px-6 py-6">
            <ReviewForm />
          </div>
        </div>

      </div>
    </section>
  )
}