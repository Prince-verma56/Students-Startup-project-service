"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Code2, Clock, ShieldCheck, MessageCircle, FileText,
  ArrowRight, ArrowLeft, CheckCircle2, Lock, Bell,
  CreditCard, LayoutDashboard, Upload, Zap, BookOpen,
  ShoppingCart, Settings, Globe, MapPin, Smartphone,
  Plus, X, Check, Sparkles, CalendarIcon,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const T = {
  bg:          "#F9FBFF",
  card:        "#FFFFFF",
  sidebar:     "#1A1F2E",
  sidebarSub:  "#2A3044",
  accent:      "#2ECC8F",
  accentDark:  "#1FAF78",
  accentGlow:  "rgba(46,204,143,0.18)",
  ink:         "#1A1F2E",
  sub:         "#5A6075",
  muted:       "#9AA0B5",
  border:      "rgba(26,31,46,0.10)",
  borderLight: "rgba(26,31,46,0.06)",
  teal:        "#0D8A6A",
  tealLight:   "#E6F7F2",
}

const shadow = {
  card:   "0 2px 0 1px rgba(26,31,46,0.06), 0 12px 40px rgba(26,31,46,0.09), 0 2px 8px rgba(26,31,46,0.05)",
  float:  "0 4px 0 2px rgba(26,31,46,0.10), 0 20px 56px rgba(26,31,46,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
  btn:    "0 4px 0 rgba(15,90,58,0.6), 0 8px 20px rgba(46,204,143,0.22), inset 0 1px 0 rgba(255,255,255,0.22)",
  btnHov: "0 2px 0 rgba(15,90,58,0.6), 0 4px 12px rgba(46,204,143,0.15), inset 0 1px 0 rgba(255,255,255,0.22)",
  chip:   "0 2px 0 rgba(26,31,46,0.08), 0 4px 12px rgba(26,31,46,0.06), inset 0 1px 0 rgba(255,255,255,1)",
  chipSel:"0 3px 0 rgba(15,90,58,0.5), 0 6px 16px rgba(46,204,143,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
}

export interface ProjectRequest {
  projectType:   string
  features:      string[]
  budget:        number
  description:   string
  deadline:      string
  stackPref:     string
  refLink:       string
  name:          string
  college:       string
  contactMethod: string
  contactValue:  string
  submittedAt:   string
}

async function submitProjectRequest(data: ProjectRequest): Promise<void> {
  console.log("[ProjectRequest]", data)
  await new Promise(r => setTimeout(r, 600))
}

const FEATURES = [
  { label:"User Authentication",  Icon:Lock,           bg:"#EDF4FF", ic:"#3B82F6" },
  { label:"Payment Integration",  Icon:CreditCard,     bg:"#FFF7ED", ic:"#F97316" },
  { label:"Email Notifications",  Icon:Bell,           bg:"#FDF4FF", ic:"#A855F7" },
  { label:"Admin Dashboard",      Icon:LayoutDashboard,bg:"#F0FDF4", ic:"#16A34A" },
  { label:"File Upload",          Icon:Upload,         bg:"#FFFBEB", ic:"#D97706" },
  { label:"Real-time Updates",    Icon:Zap,            bg:"#EFF6FF", ic:"#2563EB" },
  { label:"Blog / CMS",           Icon:BookOpen,       bg:"#FFF1F2", ic:"#E11D48" },
  { label:"Shopping Cart",        Icon:ShoppingCart,   bg:"#F5F3FF", ic:"#7C3AED" },
  { label:"CRUD Operations",      Icon:Settings,       bg:"#F0FDFA", ic:"#0D9488" },
  { label:"API Integration",      Icon:Globe,          bg:"#ECFDF5", ic:"#059669" },
  { label:"Location / Maps",      Icon:MapPin,         bg:"#FEF3C7", ic:"#B45309" },
  { label:"Responsive Design",    Icon:Smartphone,     bg:"#F0F9FF", ic:"#0284C7" },
]

const PROJECT_TYPES = [
  { value:"basic",     label:"Basic Static",  full:"Basic Static Website", sub:"HTML/CSS, no backend",  price:"₹500–₹1,500",  dot:"#60A5FA" },
  { value:"frontend",  label:"Frontend",       full:"Frontend Project",      sub:"React / Next.js",       price:"₹1,500–₹3k",   dot:"#34D399" },
  { value:"fullstack", label:"Full-Stack",     full:"Mini Full-Stack",       sub:"Node + DB + API",       price:"₹3k–₹6k",      dot:"#FBBF24" },
  { value:"complete",  label:"Complete App",   full:"Complete Web App",      sub:"Auth, DB, Deployment",  price:"₹6k+",         dot:"#F87171" },
]

const PERKS = [
  { Icon:Code2,         title:"Source code included",  desc:"Learn, modify, submit"       },
  { Icon:Clock,         title:"3–7 day delivery",       desc:"Deadline-aware, no ghosting" },
  { Icon:ShieldCheck,   title:"Starting ₹500",          desc:"No hidden charges ever"      },
  { Icon:MessageCircle, title:"Not a bot — it's me",    desc:"Direct personal reply"       },
  { Icon:FileText,      title:"Explanation included",   desc:"Understand what you submit"  },
]

const STEPS = ["Project","Features","Contact"]
interface FeatureTag { label:string }

function StepBar({ current }:{ current:number }) {
  return (
    <div className="flex items-center pb-6">
      {STEPS.map((label,i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background: done   ? T.accent : active ? T.ink : "transparent",
                  borderColor: done  ? T.accent : active ? T.ink : T.muted,
                  boxShadow: active  ? `0 3px 0 rgba(26,31,46,0.25), 0 6px 16px rgba(26,31,46,0.12)` : "none",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300"
              >
                {done
                  ? <Check size={13} strokeWidth={3} color="white"/>
                  : <span style={{ color: active ? "white" : T.muted }}>{i+1}</span>
                }
              </motion.div>
              <span className="text-[10px] font-robert font-bold whitespace-nowrap"
                style={{ color: active ? T.ink : done ? T.accent : T.muted }}>
                {label}
              </span>
            </div>
            {i < STEPS.length-1 && (
              <motion.div className="flex-1 h-0.5 mx-2 mb-5 rounded-full"
                animate={{ background: done ? `linear-gradient(90deg,${T.accent},${T.ink})` : T.border }}
                transition={{ duration:0.4 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FeatureChip({ label,Icon,bg,ic,selected,onClick }:{
  label:string; Icon:React.ElementType; bg:string; ic:string; selected:boolean; onClick:()=>void
}) {
  return (
    <motion.button type="button" onClick={onClick}
      whileHover={{ y:-1.5 }} whileTap={{ scale:0.94 }}
      className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-robert font-semibold select-none cursor-pointer transition-all duration-150"
      style={{
        borderRadius: 50,
        background:   selected ? T.ink : "#FFFFFF",
        boxShadow:    selected ? shadow.chipSel : shadow.chip,
        border:       selected ? `1.5px solid ${T.ink}` : `1.5px solid rgba(26,31,46,0.10)`,
        color:        selected ? "#fff" : T.ink,
      }}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: selected ? "rgba(255,255,255,0.15)" : bg }}>
        <Icon size={10} style={{ color: selected ? "rgba(255,255,255,0.9)" : ic }} strokeWidth={2.5}/>
      </span>
      {label}
      <motion.span animate={{ rotate: selected ? 45 : 0 }} transition={{ duration:0.18 }}
        className="text-[9px] opacity-50">+</motion.span>
    </motion.button>
  )
}

function FeatureSelector({ selected,onAdd,onRemove }:{
  selected:FeatureTag[]; onAdd:(t:FeatureTag)=>void; onRemove:(n:string)=>void
}) {
  const [custom,setCustom] = useState("")
  const names = selected.map(s=>s.label)
  const avail = FEATURES.filter(f=>!names.includes(f.label))

  const addCustom = () => {
    const v = custom.trim(); if(!v||names.includes(v)) return
    onAdd({ label:v }); setCustom("")
  }

  return (
    <div className="space-y-3">
      <div className="min-h-14 p-3 flex flex-wrap gap-1.5 items-start transition-colors duration-200"
        style={{
          borderRadius:16,
          border:`2px dashed ${selected.length>0?"rgba(26,31,46,0.18)":"rgba(26,31,46,0.10)"}`,
          background: selected.length>0 ? "rgba(26,31,46,0.03)" : "rgba(242,240,235,0.6)",
        }}
      >
        {selected.length===0 ? (
          <p className="text-[11px] font-robert self-center px-1" style={{ color:T.muted }}>
            Tap features below to add ↓ or type your own
          </p>
        ) : (
          <AnimatePresence>
            {selected.map(tag => {
              const f = FEATURES.find(x=>x.label===tag.label)
              return (
                <motion.span key={tag.label}
                  initial={{ opacity:0,scale:0.7,y:4 }} animate={{ opacity:1,scale:1,y:0 }}
                  exit={{ opacity:0,scale:0.7,y:-4 }}
                  transition={{ type:"spring",stiffness:500,damping:28 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-robert font-semibold"
                  style={{ borderRadius:50, background:T.ink, color:"#fff", boxShadow:shadow.chipSel }}
                >
                  {f && (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background:"rgba(255,255,255,0.15)" }}>
                      <f.Icon size={9} color="white" strokeWidth={2.5}/>
                    </span>
                  )}
                  {tag.label}
                  <button type="button" onClick={()=>onRemove(tag.label)}
                    className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
                    <X size={9}/>
                  </button>
                </motion.span>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {avail.length>0 && (
        <div className="flex flex-wrap gap-1.5">
          {avail.map(f=>(
            <FeatureChip key={f.label} label={f.label} Icon={f.Icon} bg={f.bg} ic={f.ic}
              selected={false} onClick={()=>onAdd({ label:f.label })}/>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input value={custom} onChange={e=>setCustom(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"){e.preventDefault();addCustom()} }}
          placeholder="Add your own feature..."
          className="flex-1 outline-none px-4 py-2.5 text-xs font-robert"
          style={{ borderRadius:14, border:`1.5px solid ${T.border}`, background:"#FAFAF8", color:T.ink, boxShadow:"inset 0 1px 3px rgba(26,31,46,0.04)" }}
        />
        <motion.button type="button" whileTap={{ scale:0.95 }} onClick={addCustom}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-robert font-bold text-white"
          style={{ borderRadius:14, background:T.ink, boxShadow:`0 3px 0 rgba(0,0,0,0.3), 0 6px 14px rgba(26,31,46,0.18)` }}>
          <Plus size={11}/> Add
        </motion.button>
      </div>
    </div>
  )
}

function BudgetControl({ value,onChange }:{ value:number; onChange:(v:number)=>void }) {
  const [editing,setEditing] = useState(false)
  const [raw,setRaw]         = useState(String(value))
  const MARKS                = [500,2000,4000,6000,8000,10000]
  const clamp = (n:number)   => Math.round(Math.min(10000,Math.max(500,n))/100)*100
  const pct                  = ((value-500)/9500)*100

  const commit = () => {
    const n=parseInt(raw.replace(/[^0-9]/g,""),10)
    onChange(!isNaN(n)?clamp(n):value); setEditing(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-robert text-[10px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>Budget</span>
        {editing ? (
          <input autoFocus value={raw} onChange={e=>setRaw(e.target.value)}
            onBlur={commit} onKeyDown={e=>e.key==="Enter"&&commit()}
            className="w-28 text-right text-xl font-black outline-none border-b-2"
            style={{ fontFamily:"var(--font-neulis)", color:T.ink, borderColor:T.ink, background:"transparent" }}
          />
        ) : (
          <motion.button type="button" key={value}
            initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}
            onClick={()=>{ setRaw(String(value)); setEditing(true) }}
            className="font-black text-xl cursor-text"
            style={{ fontFamily:"var(--font-neulis)", color:T.ink }} title="Click to edit">
            ₹{value.toLocaleString("en-IN")}
          </motion.button>
        )}
      </div>

      <div className="relative h-4 flex items-center">
        <div className="w-full h-2.5 rounded-full relative overflow-hidden"
          style={{ background:"rgba(26,31,46,0.08)" }}>
          <motion.div className="absolute left-0 top-0 h-full rounded-full"
            style={{ background:`linear-gradient(90deg,${T.accent},${T.ink})`, width:`${pct}%` }}
            animate={{ width:`${pct}%` }}
            transition={{ type:"spring",stiffness:300,damping:30 }}
          />
        </div>
        <input type="range" min={500} max={10000} step={100} value={value}
          onChange={e=>onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex:2 }}
        />
        <motion.div className="absolute w-5 h-5 rounded-full pointer-events-none"
          style={{ left:`calc(${pct}% - 10px)`, background:T.ink, zIndex:1,
            boxShadow:`0 0 0 3px white, 0 0 0 5px ${T.ink}, 0 4px 10px rgba(26,31,46,0.25)` }}
          animate={{ left:`calc(${pct}% - 10px)` }}
          transition={{ type:"spring",stiffness:300,damping:30 }}
        />
      </div>

      <div className="flex justify-between mt-2.5">
        {MARKS.map(m=>(
          <button key={m} type="button" onClick={()=>onChange(m)}
            className="text-[9px] font-robert font-bold transition-all"
            style={{ color:value===m?T.ink:T.muted, transform:value===m?"scale(1.15)":"scale(1)" }}>
            {m>=1000?`₹${m/1000}k`:`₹${m}`}
          </button>
        ))}
      </div>
      <p className="text-[10px] font-robert mt-2" style={{ color:T.muted }}>
        Tap the amount above to type a custom value
      </p>
    </div>
  )
}

function StepCard({ children,step }:{ children:React.ReactNode; step:number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step}
        initial={{ opacity:0, rotateX:10, scale:0.96, y:20 }}
        animate={{ opacity:1, rotateX:0,  scale:1,    y:0  }}
        exit={{    opacity:0, rotateX:-7, scale:0.97, y:-16 }}
        transition={{ duration:0.42, ease:[0.22,1,0.36,1] }}
        style={{ transformStyle:"preserve-3d", perspective:1200 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function SuccessScreen({ onReset }:{ onReset:()=>void }) {
  return (
    <motion.div initial={{ opacity:0,scale:0.93,y:16 }} animate={{ opacity:1,scale:1,y:0 }}
      transition={{ duration:0.5,ease:[0.22,1,0.36,1] }}
      className="flex flex-col items-center text-center py-14 px-8 gap-6">
      <motion.div initial={{ scale:0,rotate:-15 }} animate={{ scale:1,rotate:0 }}
        transition={{ delay:0.12,type:"spring",stiffness:260,damping:15 }}
        className="w-20 h-20 rounded-[24px] flex items-center justify-center"
        style={{ background:T.ink, boxShadow:`0 6px 0 rgba(0,0,0,0.3),0 12px 32px rgba(26,31,46,0.2)` }}>
        <CheckCircle2 size={36} color={T.accent} strokeWidth={1.8}/>
      </motion.div>

      <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }}>
        <h4 className="font-neulis font-black text-2xl mb-2" style={{ color:T.ink }}>Request sent! ⚡</h4>
        <p className="text-sm font-robert leading-relaxed max-w-60 mx-auto" style={{ color:T.sub }}>
          I&apos;ll personally review and reply within 12 hours.
        </p>
      </motion.div>

      <motion.a initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.38 }}
        href="https://t.me/Princev26charley" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 px-7 py-4 text-white font-robert font-bold text-sm w-full max-w-xs justify-center"
        style={{ borderRadius:18, background:"#229ED9",
          boxShadow:"0 4px 0 #1268A1, 0 8px 24px rgba(34,158,217,0.22), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
        </svg>
        Join Telegram Community
      </motion.a>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
        className="flex flex-wrap gap-2 justify-center">
        {["Direct DM reply","No middleman","Live progress updates"].map(t=>(
          <span key={t} className="text-[10px] font-robert font-semibold px-3 py-1.5 rounded-full"
            style={{ background:T.tealLight, color:T.teal, border:`1px solid rgba(13,138,106,0.15)` }}>
            ✓ {t}
          </span>
        ))}
      </motion.div>

      <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.58 }}
        type="button" onClick={onReset}
        className="text-[11px] font-robert underline underline-offset-2"
        style={{ color:T.muted }}>
        Submit another request →
      </motion.button>
    </motion.div>
  )
}

const IS: React.CSSProperties = {
  borderRadius: 14,
  border: `1.5px solid rgba(26,31,46,0.12)`,
  background: "#FAFAF8",
  color: T.ink,
  fontSize: 13,
  fontFamily: "var(--font-robert)",
  boxShadow: "inset 0 1px 3px rgba(26,31,46,0.05)",
  width: "100%",
  outline: "none",
  padding: "10px 14px",
}

export default function RequestProjectSection() {
  const formRef = useRef<HTMLDivElement>(null)

  const [step,       setStep]       = useState(0)
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [projectType, setProjectType] = useState("")
  const [selFeats,    setSelFeats]    = useState<FeatureTag[]>([])
  const [budget,      setBudget]      = useState(2000)
  const [description, setDescription]= useState("")
  const [deadline,    setDeadline]    = useState<Date | undefined>(undefined)
  const [stackPref,   setStackPref]   = useState("")
  const [refLink,     setRefLink]     = useState("")
  const [name,        setName]        = useState("")
  const [college,     setCollege]     = useState("")
  const [contactMeth, setContactMeth] = useState<"telegram"|"email"|"whatsapp">("telegram")
  const [contactVal,  setContactVal]  = useState("")

  const addFeat    = useCallback((t:FeatureTag)=>setSelFeats(p=>p.find(f=>f.label===t.label)?p:[...p,t]),[])
  const removeFeat = useCallback((n:string)=>setSelFeats(p=>p.filter(f=>f.label!==n)),[])
  const selType    = PROJECT_TYPES.find(t=>t.value===projectType)

  const reset = () => {
    setStep(0);setSubmitted(false);setProjectType("");setSelFeats([]);setBudget(2000)
    setDescription("");setDeadline(undefined);setStackPref("");setRefLink("")
    setName("");setCollege("");setContactVal("")
  }

  useEffect(()=>{
    const el=formRef.current; if(!el) return
    gsap.set(el,{ opacity:0,rotateX:14,y:50,transformPerspective:1000 })
    ScrollTrigger.create({
      trigger:el,start:"top 82%",
      onEnter:()=>gsap.to(el,{ opacity:1,rotateX:0,y:0,duration:1.05,ease:"power3.out" }),
    })
    return ()=>ScrollTrigger.getAll().forEach(t=>{ try{t.kill(true)}catch(_){} })
  },[])

  const handleSubmit = async () => {
    setSubmitting(true)
    const payload: ProjectRequest = {
      projectType, features:selFeats.map(f=>f.label), budget,
      description, deadline: deadline ? deadline.toISOString() : "", stackPref, refLink,
      name, college, contactMethod:contactMeth, contactValue:contactVal,
      submittedAt: new Date().toISOString(),
    }
    try {
      await submitProjectRequest(payload)
      setSubmitted(true)
    } catch(e) {
      console.error(e)
      alert("Something went wrong — please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const cpHint = { telegram:"@yourusername", email:"you@email.com", whatsapp:"+91 XXXXX XXXXX" }
  const LB = "font-robert text-[10px] font-bold tracking-[0.3em] uppercase block mb-1.5"

  return (
    <section id="req_a_project" className="relative w-full py-24 px-4"
      style={{ background:T.bg, isolation:"isolate" }}>

      {/* ── BACKGROUND DECORATION SYSTEM ─────────────────────────────────── */}
      {/* NOTE: isolation:isolate creates a stacking context so z-index works correctly */}
      {/* All decoration divs use position:absolute with z-index:-1 (inline style, not Tailwind -z-10) */}

      {/* Layer 1 — all ambient glows in one div (most performant) */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, zIndex:-1, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 60% 70% at -2%  45%, rgba(46,204,143,0.13) 0%, transparent 60%),
          radial-gradient(ellipse 60% 70% at 102% 45%, rgba(46,204,143,0.11) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50%  108%,rgba(26,31,46,0.07)   0%, transparent 58%),
          radial-gradient(ellipse 45% 30% at 50%  -5%,  rgba(46,204,143,0.07) 0%, transparent 55%)
        `
      }}/>

      {/* Layer 2 — large blurred orb, top-left emerald */}
      <div aria-hidden="true" style={{
        position:"absolute", zIndex:-1, pointerEvents:"none",
        top:"-5%", left:"-5vw",
        width:"40vw", height:"40vw", borderRadius:"50%",
        background:"radial-gradient(circle at 60% 55%, rgba(46,204,143,0.22) 0%, rgba(46,204,143,0.06) 45%, transparent 70%)",
        filter:"blur(50px)",
      }}/>

      {/* Layer 3 — large blurred orb, top-right emerald */}
      <div aria-hidden="true" style={{
        position:"absolute", zIndex:-1, pointerEvents:"none",
        top:"-8%", right:"-6vw",
        width:"38vw", height:"38vw", borderRadius:"50%",
        background:"radial-gradient(circle at 40% 55%, rgba(46,204,143,0.17) 0%, rgba(13,138,106,0.05) 42%, transparent 68%)",
        filter:"blur(55px)",
      }}/>

      {/* Layer 4 — mid-left navy depth orb */}
      <div aria-hidden="true" style={{
        position:"absolute", zIndex:-1, pointerEvents:"none",
        top:"35%", left:"-3vw",
        width:"24vw", height:"24vw", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(26,31,46,0.10) 0%, transparent 65%)",
        filter:"blur(32px)",
      }}/>

      {/* Layer 5 — bottom-right navy orb */}
      <div aria-hidden="true" style={{
        position:"absolute", zIndex:-1, pointerEvents:"none",
        bottom:"-3%", right:"3vw",
        width:"30vw", height:"30vw", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(26,31,46,0.09) 0%, transparent 65%)",
        filter:"blur(40px)",
      }}/>

      {/* Layer 6 — dot grid, masked to left+right margins only */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, zIndex:-1, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle, rgba(26,31,46,0.15) 1px, transparent 1px)`,
        backgroundSize:"28px 28px",
        WebkitMaskImage:`radial-gradient(ellipse 25% 90% at 0% 50%, black 0%, transparent 75%), radial-gradient(ellipse 25% 90% at 100% 50%, black 0%, transparent 75%)`,
        maskImage:`radial-gradient(ellipse 25% 90% at 0% 50%, black 0%, transparent 75%), radial-gradient(ellipse 25% 90% at 100% 50%, black 0%, transparent 75%)`,
        WebkitMaskComposite:"destination-over",
        maskComposite:"add",
      }}/>

      {/* Layer 7 — top highlight line */}
      <div aria-hidden="true" style={{
        position:"absolute", top:0, left:0, right:0, height:2, zIndex:-1, pointerEvents:"none",
        background:`linear-gradient(90deg, transparent 8%, rgba(46,204,143,0.50) 28%, rgba(46,204,143,0.70) 50%, rgba(46,204,143,0.50) 72%, transparent 92%)`
      }}/>

      {/* ── END BACKGROUND ───────────────────────────────────────────────── */}

      {/* Header */}
      <motion.div className="text-center mb-14 flex flex-col items-center gap-3"
        initial={{ opacity:0,y:22 }} whileInView={{ opacity:1,y:0 }}
        viewport={{ once:true }} transition={{ duration:0.7,ease:[0.22,1,0.36,1] }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-robert font-bold tracking-[0.3em] uppercase"
          style={{ background:"rgba(26,31,46,0.06)", color:T.ink, border:`1px solid rgba(26,31,46,0.10)` }}>
          <Sparkles size={10}/> Let&apos;s Build Together
        </span>
        <h2 className="font-florish leading-none tracking-tight text-[clamp(2.4rem,5vw,4.5rem)]"
          style={{ color:T.ink }}>
          Request a Project
        </h2>
        <p className="text-sm font-robert font-light max-w-xs leading-relaxed" style={{ color:T.sub }}>
          3 quick steps — personal reply within 12 hours.
        </p>
      </motion.div>

      {/* Main card */}
      <div ref={formRef} className="max-w-5xl mx-auto" style={{ transformOrigin:"50% 40%" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] overflow-hidden"
          style={{ borderRadius:28, background:T.card, boxShadow:shadow.float, border:`1.5px solid rgba(26,31,46,0.08)` }}>

          {/* ── LEFT sidebar ─────────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col p-8"
            style={{ borderRight:`1.5px solid rgba(26,31,46,0.06)`, background:T.sidebar }}>

            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full px-3 py-1.5 mb-7 w-fit font-robert"
              style={{ background:"rgba(46,204,143,0.15)", color:T.accent, border:`1px solid rgba(46,204,143,0.25)` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:T.accent }}/>
              Open for projects
            </div>

            <h3 className="font-neulis font-black text-xl leading-snug mb-2.5 text-white">
              Let&apos;s build your{" "}
              <span style={{ color:T.accent }}>next project</span>
            </h3>
            <p className="text-xs font-robert leading-relaxed mb-8" style={{ color:"rgba(255,255,255,0.45)" }}>
              I personally read every request and reply within 12 hours.
            </p>

            <div className="flex flex-col gap-4 flex-1 mb-8">
              {PERKS.map(p=>(
                <div key={p.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)" }}>
                    <p.Icon size={13} strokeWidth={2}/>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-robert leading-tight text-white">{p.title}</p>
                    <p className="text-[10px] font-robert mt-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background:T.accent }}/>
              <span className="text-[11px] font-robert" style={{ color:"rgba(255,255,255,0.45)" }}>
                <strong className="font-bold text-white">Accepting projects</strong> — 12 hr reply
              </span>
            </div>
          </div>

          {/* ── RIGHT panel ──────────────────────────────────────────────── */}
          <div className="flex flex-col min-w-0">
            {!submitted && (
              <div className="px-8 pt-7 pb-0">
                <StepBar current={step}/>
              </div>
            )}

            <StepCard step={submitted?99:step}>
              <div>
                {submitted && <SuccessScreen onReset={reset}/>}

                {/* ── STEP 0 ── */}
                {!submitted && step===0 && (
                  <div className="px-8 py-6 space-y-5">
                    <div>
                      <p className="font-neulis font-black text-lg" style={{ color:T.ink }}>What are you building?</p>
                      <p className="text-xs font-robert mt-1" style={{ color:T.sub }}>Pick a project type to get started.</p>
                    </div>

                    <div>
                      <label className={LB} style={{ color:T.muted }}>Project Type</label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger className="font-robert text-sm h-11" style={{ ...IS, padding:"0 14px", height:44, display:"flex", alignItems:"center" }}>
                          <SelectValue placeholder="Select a tier..."/>
                        </SelectTrigger>
                        <SelectContent style={{ borderRadius:16, border:`1.5px solid rgba(26,31,46,0.10)`,
                          boxShadow:"0 8px 32px rgba(26,31,46,0.12)", background:"#FFFFFF" }}>
                          {PROJECT_TYPES.map(t=>(
                            <SelectItem key={t.value} value={t.value} className="font-robert text-sm py-2.5 cursor-pointer">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background:t.dot }}/>
                                <span className="font-bold" style={{ color:T.ink }}>{t.full}</span>
                                <span className="text-xs" style={{ color:T.muted }}>— {t.sub}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {projectType && (
                        <motion.div initial={{ opacity:0,y:-8,scale:0.97 }} animate={{ opacity:1,y:0,scale:1 }}
                          exit={{ opacity:0,y:-8 }}
                          className="flex items-center justify-between px-4 py-3"
                          style={{ borderRadius:16, background:T.ink, boxShadow:shadow.btn }}>
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full" style={{ background:selType?.dot }}/>
                            <span className="font-robert font-bold text-sm text-white">{selType?.full}</span>
                            <span className="text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>— {selType?.sub}</span>
                          </div>
                          <span className="text-xs font-robert font-bold" style={{ color:T.accent }}>{selType?.price}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-2 gap-2.5">
                      {PROJECT_TYPES.map(t=>{
                        const on=projectType===t.value
                        return (
                          <motion.button key={t.value} type="button" whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                            onClick={()=>setProjectType(t.value)}
                            className="text-left p-4 transition-all duration-200"
                            style={{ borderRadius:18, background:on?T.ink:"#FAFAF8",
                              boxShadow:on?shadow.btn:shadow.chip,
                              border:on?`1.5px solid ${T.ink}`:`1.5px solid rgba(26,31,46,0.08)` }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full" style={{ background:t.dot }}/>
                              <p className="font-neulis font-black text-sm" style={{ color:on?"#fff":T.ink }}>{t.label}</p>
                            </div>
                            <p className="font-robert text-[11px]" style={{ color:on?"rgba(255,255,255,0.5)":T.muted }}>{t.sub}</p>
                            <p className="font-robert text-[10px] font-bold mt-1.5" style={{ color:on?T.accent:T.teal }}>{t.price}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 1 ── */}
                {!submitted && step===1 && (
                  <div className="px-8 py-6 space-y-6">
                    <div>
                      <p className="font-neulis font-black text-lg" style={{ color:T.ink }}>Features & Budget</p>
                      <p className="text-xs font-robert mt-1" style={{ color:T.sub }}>Select what you need and set your budget.</p>
                    </div>
                    <div>
                      <label className={LB} style={{ color:T.muted }}>Features Needed</label>
                      <FeatureSelector selected={selFeats} onAdd={addFeat} onRemove={removeFeat}/>
                    </div>
                    <BudgetControl value={budget} onChange={setBudget}/>
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {!submitted && step===2 && (
                  <div className="px-8 py-6 space-y-5">
                    <div>
                      <p className="font-neulis font-black text-lg" style={{ color:T.ink }}>Almost done</p>
                      <p className="text-xs font-robert mt-1" style={{ color:T.sub }}>Just enough to reach you — no spam, ever.</p>
                    </div>

                    <div>
                      <label className={LB} style={{ color:T.muted }}>Project Description</label>
                      <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
                        placeholder="e.g. A student attendance system where teachers log in, mark attendance, view reports..."
                        className="resize-none" style={{ ...IS, padding:"12px 14px" }}/>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={LB} style={{ color:T.muted }}>Deadline</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="flex items-center gap-2.5 font-robert text-sm text-left w-full"
                              style={{ ...IS, height:42, color:deadline?T.ink:T.muted, cursor:"pointer" }}>
                              <CalendarIcon size={14} style={{ color:T.muted, flexShrink:0 }}/>
                              {deadline ? format(deadline,"dd MMM yyyy") : "Pick a deadline"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" style={{ padding:0, borderRadius:20,
                            border:`1.5px solid rgba(26,31,46,0.10)`,
                            boxShadow:"0 4px 0 rgba(26,31,46,0.08), 0 16px 40px rgba(26,31,46,0.12)",
                            overflow:"hidden", background:"#FFFFFF", width:"auto" }}>
                            <Calendar mode="single" selected={deadline} onSelect={setDeadline}
                              disabled={(date)=>date<new Date(new Date().setHours(0,0,0,0))}
                              initialFocus className="font-robert"/>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className={LB} style={{ color:T.muted }}>Stack Preference</label>
                        <Select value={stackPref} onValueChange={setStackPref}>
                          <SelectTrigger className="font-robert text-sm" style={{ ...IS, height:42, display:"flex", alignItems:"center", padding:"0 12px" }}>
                            <SelectValue placeholder="You decide"/>
                          </SelectTrigger>
                          <SelectContent style={{ borderRadius:14, border:`1.5px solid rgba(26,31,46,0.10)`, background:"#FFF" }}>
                            {[{v:"you",l:"You decide — best fit"},{v:"react-node",l:"React + Node.js"},{v:"html",l:"HTML/CSS/JS only"},{v:"nextjs",l:"Next.js"},{v:"firebase",l:"React + Firebase"}].map(o=>(
                              <SelectItem key={o.v} value={o.v} className="font-robert text-sm">{o.l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className={LB} style={{ color:T.muted }}>Reference Link <span className="normal-case font-normal">(optional)</span></label>
                      <input type="url" value={refLink} onChange={e=>setRefLink(e.target.value)}
                        placeholder="Any site you like..." style={IS}/>
                    </div>

                    <div>
                      <label className={LB} style={{ color:T.muted }}>Contact Method</label>
                      <div className="flex rounded-2xl overflow-hidden mb-2.5"
                        style={{ border:`1.5px solid rgba(26,31,46,0.10)`, background:"rgba(26,31,46,0.03)" }}>
                        {(["telegram","email","whatsapp"] as const).map(m=>(
                          <button key={m} type="button" onClick={()=>setContactMeth(m)}
                            className="flex-1 py-2.5 text-xs font-robert font-bold capitalize transition-all border-r last:border-r-0"
                            style={{ borderColor:"rgba(26,31,46,0.08)",
                              background:contactMeth===m?T.ink:"transparent",
                              color:contactMeth===m?"white":T.sub }}>
                            {m}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input value={name} onChange={e=>setName(e.target.value)}
                          placeholder="Your name" style={IS}/>
                        <input value={contactVal} onChange={e=>setContactVal(e.target.value)}
                          placeholder={cpHint[contactMeth]} style={IS}/>
                      </div>
                      <input value={college} onChange={e=>setCollege(e.target.value)}
                        placeholder="College (optional)" style={{ ...IS, marginTop:10 }}/>
                    </div>

                    {projectType && (
                      <div className="p-4 space-y-2.5 rounded-2xl"
                        style={{ background:"rgba(26,31,46,0.03)", border:`1.5px solid rgba(26,31,46,0.06)` }}>
                        <p className="font-robert text-[10px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>Summary</p>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[11px] font-robert font-bold px-3 py-1.5 rounded-full text-white"
                            style={{ background:T.ink }}>{selType?.full}</span>
                          <span className="text-[11px] font-neulis font-black px-3 py-1.5 rounded-full"
                            style={{ background:"rgba(26,31,46,0.06)", color:T.ink }}>
                            ₹{budget.toLocaleString("en-IN")}
                          </span>
                          {selFeats.slice(0,3).map(f=>{
                            const feat=FEATURES.find(x=>x.label===f.label)
                            return (
                              <span key={f.label} className="text-[10px] font-robert px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                                style={{ background:"rgba(255,255,255,0.9)", color:T.sub, border:`1px solid rgba(26,31,46,0.08)` }}>
                                {feat&&<feat.Icon size={9} style={{ color:feat.ic }}/>}{f.label}
                              </span>
                            )
                          })}
                          {selFeats.length>3&&<span className="text-[10px] font-robert" style={{ color:T.muted }}>+{selFeats.length-3} more</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Footer nav ── */}
                {!submitted && (
                  <div className="flex items-center justify-between px-8 py-5"
                    style={{ borderTop:`1.5px solid rgba(26,31,46,0.05)` }}>
                    <div className="flex items-center gap-3">
                      {step>0 && (
                        <button type="button" onClick={()=>setStep(s=>s-1)}
                          className="flex items-center gap-1.5 font-robert text-sm font-semibold transition-colors"
                          style={{ color:T.sub }}>
                          <ArrowLeft size={14}/> Back
                        </button>
                      )}
                      <span className="font-robert text-[10px]" style={{ color:T.muted }}>
                        Step {step+1} of {STEPS.length}
                      </span>
                    </div>

                    <motion.button type="button"
                      whileHover={{ y:-1.5, boxShadow:`0 6px 0 rgba(0,0,0,0.3),0 12px 28px rgba(26,31,46,0.2)` }}
                      whileTap={{ y:2, boxShadow:shadow.btnHov }}
                      onClick={step<2?()=>setStep(s=>s+1):handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-7 py-3.5 font-robert font-bold text-sm text-white disabled:opacity-60"
                      style={{ borderRadius:18, background:T.ink, boxShadow:shadow.btn,
                        transition:"box-shadow 0.15s,transform 0.15s" }}>
                      {submitting ? "Sending..." : step<2 ? (<>Continue <ArrowRight size={14}/></>) : (<>Send Request ⚡</>)}
                    </motion.button>
                  </div>
                )}
              </div>
            </StepCard>
          </div>
        </div>
      </div>
    </section>
  )
}