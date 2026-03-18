"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Code2, Clock, ShieldCheck, MessageCircle, FileText,
  ArrowRight, ArrowLeft, CheckCircle2, Lock, Bell,
  CreditCard, LayoutDashboard, Upload, Zap, BookOpen,
  ShoppingCart, Settings, Globe, MapPin, Smartphone,
  Plus, X, Check, Sparkles, CalendarIcon,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:"#F9FBFF", card:"#FFFFFF", sidebar:"#1A1F2E",
  accent:"#6366F1", accentDark:"#4F46E5", accentLight:"#EEF2FF",
  ink:"#1A1F2E", sub:"#5A6075", muted:"#9AA0B5",
  border:"rgba(26,31,46,0.09)", borderLight:"rgba(26,31,46,0.06)",
  green:"#34D399", greenLight:"#ECFDF5",
}
const clay=(hover=false):React.CSSProperties=>({
  background:T.card, borderRadius:20,
  border:`1.5px solid ${hover?"rgba(99,102,241,0.25)":T.border}`,
  boxShadow:hover
    ?"0 4px 0 1px rgba(99,102,241,0.12),0 12px 32px rgba(99,102,241,0.10),inset 0 1px 0 rgba(255,255,255,1)"
    :"0 2px 0 1px rgba(26,31,46,0.05),0 8px 24px rgba(26,31,46,0.07),inset 0 1px 0 rgba(255,255,255,1)",
})
const shadow={
  float:"0 4px 0 2px rgba(26,31,46,0.10),0 20px 56px rgba(26,31,46,0.12),inset 0 1px 0 rgba(255,255,255,0.9)",
  btn:"0 4px 0 rgba(55,48,163,0.55),0 8px 20px rgba(99,102,241,0.22),inset 0 1px 0 rgba(255,255,255,0.22)",
  btnHov:"0 2px 0 rgba(55,48,163,0.45),0 4px 12px rgba(99,102,241,0.15),inset 0 1px 0 rgba(255,255,255,0.2)",
  chip:"0 2px 0 rgba(26,31,46,0.08),0 4px 12px rgba(26,31,46,0.06),inset 0 1px 0 rgba(255,255,255,1)",
  chipSel:"0 3px 0 rgba(55,48,163,0.4),0 6px 16px rgba(99,102,241,0.22),inset 0 1px 0 rgba(255,255,255,0.2)",
}

// ── Types / DB ────────────────────────────────────────────────────────────────
export interface ProjectRequest {
  projectType:string; features:string[]; budget:number; description:string
  deadline:string; stackPref:string; refLink:string; name:string
  college:string; contactMethod:string; contactValue:string; submittedAt:string
}
async function submitProjectRequest(data:ProjectRequest):Promise<void>{
  console.log("[ProjectRequest]",data)
  await new Promise(r=>setTimeout(r,600))
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES=[
  {label:"User Authentication",  Icon:Lock,            bg:"#EDF4FF",ic:"#3B82F6"},
  {label:"Payment Integration",  Icon:CreditCard,      bg:"#FFF7ED",ic:"#F97316"},
  {label:"Email Notifications",  Icon:Bell,            bg:"#FDF4FF",ic:"#A855F7"},
  {label:"Admin Dashboard",      Icon:LayoutDashboard, bg:"#F0FDF4",ic:"#16A34A"},
  {label:"File Upload",          Icon:Upload,          bg:"#FFFBEB",ic:"#D97706"},
  {label:"Real-time Updates",    Icon:Zap,             bg:"#EFF6FF",ic:"#2563EB"},
  {label:"Blog / CMS",           Icon:BookOpen,        bg:"#FFF1F2",ic:"#E11D48"},
  {label:"Shopping Cart",        Icon:ShoppingCart,    bg:"#F5F3FF",ic:"#7C3AED"},
  {label:"CRUD Operations",      Icon:Settings,        bg:"#F0FDFA",ic:"#0D9488"},
  {label:"API Integration",      Icon:Globe,           bg:"#ECFDF5",ic:"#059669"},
  {label:"Location / Maps",      Icon:MapPin,          bg:"#FEF3C7",ic:"#B45309"},
  {label:"Responsive Design",    Icon:Smartphone,      bg:"#F0F9FF",ic:"#0284C7"},
]
const PROJECT_TYPES=[
  {value:"basic",    label:"Basic Static",full:"Basic Static Website",sub:"HTML/CSS, no backend",price:"₹500–₹1,500",dot:"#60A5FA"},
  {value:"frontend", label:"Frontend",    full:"Frontend Project",     sub:"React / Next.js",    price:"₹1,500–₹3k",dot:"#34D399"},
  {value:"fullstack",label:"Full-Stack",  full:"Mini Full-Stack",      sub:"Node + DB + API",    price:"₹3k–₹6k",   dot:"#FBBF24"},
  {value:"complete", label:"Complete App",full:"Complete Web App",     sub:"Auth, DB, Deployment",price:"₹6k+",     dot:"#F87171"},
]
const PERKS=[
  {Icon:Code2,         title:"Source code included",desc:"Learn, modify, submit"},
  {Icon:Clock,         title:"3–7 day delivery",    desc:"Deadline-aware, no ghosting"},
  {Icon:ShieldCheck,   title:"Starting ₹500",       desc:"No hidden charges ever"},
  {Icon:MessageCircle, title:"Not a bot — it's me", desc:"Direct personal reply"},
  {Icon:FileText,      title:"Explanation included", desc:"Understand what you submit"},
]
const STEPS=["Project","Features","Contact"]
interface FeatureTag{label:string}

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarsRow({count,size=11}:{count:number;size?:number}){
  return(
    <div className="flex items-center gap-[2px]">
      {Array.from({length:5},(_,i)=>(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          style={{fill:i<count?"#f59e0b":"none",stroke:i<count?"#f59e0b":"#d1d5db",strokeWidth:1.5}}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function MagneticBtn({children,className,style,onClick,disabled,type="button"}:{
  children:React.ReactNode;className?:string;style?:React.CSSProperties
  onClick?:()=>void;disabled?:boolean;type?:"button"|"submit"
}){
  const ref=useRef<HTMLButtonElement>(null)
  const x=useMotionValue(0), y=useMotionValue(0)
  const sx=useSpring(x,{stiffness:200,damping:20}), sy=useSpring(y,{stiffness:200,damping:20})
  const onMove=(e:React.MouseEvent<HTMLButtonElement>)=>{
    const r=ref.current!.getBoundingClientRect()
    x.set((e.clientX-r.left-r.width/2)*0.25)
    y.set((e.clientY-r.top-r.height/2)*0.25)
  }
  return(
    <motion.button ref={ref} type={type} className={className} style={{...style,x:sx,y:sy}}
      onMouseMove={onMove} onMouseLeave={()=>{x.set(0);y.set(0)}}
      whileHover={{scale:1.04}} whileTap={{scale:0.96,y:2}}
      onClick={onClick} disabled={disabled}>
      {children}
    </motion.button>
  )
}

// ── Side decorations (structure only — GSAP animates them) ────────────────────
interface SideBlobsProps{
  leftCard1Ref:React.RefObject<HTMLDivElement|null>
  leftCard2Ref:React.RefObject<HTMLDivElement|null>
  rightCard1Ref:React.RefObject<HTMLDivElement|null>
  rightCard2Ref:React.RefObject<HTMLDivElement|null>
  leftShapeRef:React.RefObject<HTMLDivElement|null>
  rightShapeRef:React.RefObject<HTMLDivElement|null>
  ghostNumRef:React.RefObject<HTMLDivElement|null>
  ghostCodeRef:React.RefObject<HTMLDivElement|null>
}
function SideBlobs({leftCard1Ref,leftCard2Ref,rightCard1Ref,rightCard2Ref,leftShapeRef,rightShapeRef,ghostNumRef,ghostCodeRef}:SideBlobsProps){
  return(
    <>
      {/* LEFT */}
      <div aria-hidden className="absolute left-0 top-0 h-full pointer-events-none overflow-hidden" style={{width:"15vw",zIndex:0}}>
        <div ref={ghostNumRef} className="absolute font-neulis font-black select-none"
          style={{fontSize:"clamp(80px,12vw,160px)",color:"transparent",WebkitTextStroke:"2px rgba(99,102,241,0.12)",
            top:"8%",left:"5%",lineHeight:1,willChange:"transform,opacity",opacity:0}}>
          04
        </div>
        <div ref={leftCard1Ref} className="absolute"
          style={{top:"28%",left:"8%",...clay(),borderRadius:16,padding:"14px 18px",minWidth:132,opacity:0,willChange:"transform,opacity"}}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{color:T.accent}}>Avg. Delivery</p>
          <p className="font-neulis font-black text-2xl leading-none" style={{color:T.ink}}>3–5 days</p>
          <p className="font-robert text-[10px] mt-1" style={{color:T.muted}}>deadline-aware</p>
        </div>
        <div ref={leftCard2Ref} className="absolute"
          style={{top:"52%",left:"8%",...clay(),borderRadius:16,padding:"14px 18px",minWidth:132,opacity:0,willChange:"transform,opacity"}}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{color:T.accent}}>Starting at</p>
          <p className="font-neulis font-black text-2xl leading-none" style={{color:T.ink}}>₹500</p>
          <p className="font-robert text-[10px] mt-1" style={{color:T.muted}}>no hidden fees</p>
        </div>
        <div ref={leftShapeRef} className="absolute" style={{top:"73%",left:"16%",opacity:0,willChange:"transform,opacity"}}>
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
            <defs><linearGradient id="rq_br" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#6366F1"/>
            </linearGradient></defs>
            <path d="M18 8 L6 24 L18 40" stroke="url(#rq_br)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 8 L42 24 L30 40" stroke="url(#rq_br)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {/* RIGHT */}
      <div aria-hidden className="absolute right-0 top-0 h-full pointer-events-none overflow-hidden" style={{width:"15vw",zIndex:0}}>
        <div ref={ghostCodeRef} className="absolute font-neulis font-black select-none text-right"
          style={{fontSize:"clamp(80px,12vw,160px)",color:"transparent",WebkitTextStroke:"2px rgba(99,102,241,0.10)",
            top:"5%",right:"5%",lineHeight:1,willChange:"transform,opacity",opacity:0}}>
          {"</>"}
        </div>
        <div ref={rightCard1Ref} className="absolute"
          style={{top:"26%",right:"8%",...clay(),borderRadius:16,padding:"14px 18px",minWidth:132,opacity:0,willChange:"transform,opacity"}}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{color:T.muted}}>Response</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{background:T.green}}/>
            <p className="font-neulis font-black text-xl leading-none" style={{color:T.ink}}>{"< 12 hrs"}</p>
          </div>
          <p className="font-robert text-[10px] mt-1" style={{color:T.muted}}>personal reply</p>
        </div>
        <div ref={rightCard2Ref} className="absolute"
          style={{top:"50%",right:"8%",...clay(),borderRadius:16,padding:"14px 18px",minWidth:132,opacity:0,willChange:"transform,opacity"}}>
          <p className="font-robert text-[9px] font-bold tracking-widest uppercase mb-1" style={{color:T.accent}}>Source code</p>
          <p className="font-neulis font-black text-xl leading-none italic" style={{color:T.ink}}>Included</p>
          <StarsRow count={5} size={10}/>
        </div>
        <div ref={rightShapeRef} className="absolute" style={{top:"73%",right:"18%",opacity:0,willChange:"transform,opacity"}}>
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
            <defs><linearGradient id="rq_gr" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C7D2FE"/><stop offset="100%" stopColor="#6366F1"/>
            </linearGradient></defs>
            {[0,45,90,135,180,225,270,315].map(a=>(
              <rect key={a} x="21" y="2" width="6" height="10" rx="2" fill="#818CF8" opacity="0.75" transform={`rotate(${a} 24 24)`}/>
            ))}
            <circle cx="24" cy="24" r="13" stroke="url(#rq_gr)" strokeWidth="3" fill="none"/>
            <circle cx="24" cy="24" r="6" fill="#6366F1" opacity="0.55"/>
          </svg>
        </div>
      </div>
    </>
  )
}

// ── Step bar ──────────────────────────────────────────────────────────────────
function StepBar({current}:{current:number}){
  return(
    <div className="flex items-center pb-6">
      {STEPS.map((label,i)=>{
        const done=i<current, active=i===current
        return(
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background:done?T.accent:active?T.ink:"transparent",
                  borderColor:done?T.accent:active?T.ink:T.muted,
                  boxShadow:active?`0 3px 0 rgba(55,48,163,0.3),0 6px 16px rgba(99,102,241,0.15)`:"none",
                  scale:active?1.1:1,
                }}
                transition={{type:"spring",stiffness:400,damping:25}}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2">
                {done
                  ?<motion.span initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:500}}>
                    <Check size={13} strokeWidth={3} color="white"/>
                  </motion.span>
                  :<span style={{color:active?"white":T.muted}}>{i+1}</span>
                }
              </motion.div>
              <span className="text-[10px] font-robert font-bold whitespace-nowrap"
                style={{color:active?T.ink:done?T.accent:T.muted}}>{label}</span>
            </div>
            {i<STEPS.length-1&&(
              <motion.div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden" style={{background:T.border}}>
                <motion.div className="h-full rounded-full origin-left"
                  initial={{scaleX:0}} animate={{scaleX:done?1:0}}
                  transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
                  style={{background:`linear-gradient(90deg,${T.accent},${T.ink})`}}/>
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Feature chip ──────────────────────────────────────────────────────────────
function FeatureChip({label,Icon,bg,ic,selected,onClick,index}:{
  label:string;Icon:any;bg:string;ic:string
  selected:boolean;onClick:()=>void;index:number
}){
  return(
    <motion.button type="button" onClick={onClick}
      initial={{opacity:0,scale:0.8,y:10}} animate={{opacity:1,scale:1,y:0}}
      transition={{delay:index*0.03,type:"spring",stiffness:400,damping:28}}
      whileHover={{y:-2,scale:1.03}} whileTap={{scale:0.94}}
      className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-robert font-semibold select-none cursor-pointer transition-colors duration-150"
      style={{borderRadius:50,background:selected?T.ink:"#FFFFFF",
        boxShadow:selected?shadow.chipSel:shadow.chip,
        border:selected?`1.5px solid ${T.ink}`:`1.5px solid rgba(26,31,46,0.10)`,
        color:selected?"#fff":T.ink}}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{background:selected?"rgba(255,255,255,0.15)":bg}}>
        <Icon size={10} style={{color:selected?"rgba(255,255,255,0.9)":ic}} strokeWidth={2.5}/>
      </span>
      {label}
      <motion.span animate={{rotate:selected?45:0}} transition={{duration:0.18}} className="text-[9px] opacity-50">+</motion.span>
    </motion.button>
  )
}

function FeatureSelector({selected,onAdd,onRemove}:{
  selected:FeatureTag[];onAdd:(t:FeatureTag)=>void;onRemove:(n:string)=>void
}){
  const [custom,setCustom]=useState("")
  const names=selected.map(s=>s.label)
  const avail=FEATURES.filter(f=>!names.includes(f.label))
  const addCustom=()=>{const v=custom.trim();if(!v||names.includes(v)) return;onAdd({label:v});setCustom("")}
  return(
    <div className="space-y-3">
      <motion.div
        animate={{borderColor:selected.length>0?"rgba(26,31,46,0.18)":"rgba(26,31,46,0.10)",
          background:selected.length>0?"rgba(26,31,46,0.03)":"rgba(242,240,235,0.6)"}}
        transition={{duration:0.3}}
        className="min-h-14 p-3 flex flex-wrap gap-1.5 items-start"
        style={{borderRadius:16,border:`2px dashed rgba(26,31,46,0.10)`}}>
        {selected.length===0
          ?<motion.p initial={{opacity:0}} animate={{opacity:1}}
              className="text-[11px] font-robert self-center px-1" style={{color:T.muted}}>
              Tap features below to add ↓ or type your own
            </motion.p>
          :<AnimatePresence>
            {selected.map(tag=>{
              const f=FEATURES.find(x=>x.label===tag.label)
              return(
                <motion.span key={tag.label}
                  initial={{opacity:0,scale:0.6,y:6}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.6,x:-10}}
                  transition={{type:"spring",stiffness:500,damping:28}}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-robert font-semibold"
                  style={{borderRadius:50,background:T.ink,color:"#fff",boxShadow:shadow.chipSel}}>
                  {f&&<span className="w-4 h-4 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.15)"}}>
                    <f.Icon size={9} color="white" strokeWidth={2.5}/>
                  </span>}
                  {tag.label}
                  <motion.button type="button" onClick={()=>onRemove(tag.label)}
                    className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                    whileHover={{scale:1.2}} whileTap={{scale:0.9}}>
                    <X size={9}/>
                  </motion.button>
                </motion.span>
              )
            })}
          </AnimatePresence>
        }
      </motion.div>
      {avail.length>0&&(
        <div className="flex flex-wrap gap-1.5">
          {avail.map((f,idx)=>(
            <FeatureChip key={f.label} label={f.label} Icon={f.Icon} bg={f.bg} ic={f.ic}
              selected={false} onClick={()=>onAdd({label:f.label})} index={idx}/>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input value={custom} onChange={e=>setCustom(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addCustom()}}}
          placeholder="Add your own feature..."
          className="flex-1 outline-none px-4 py-2.5 text-xs font-robert"
          style={{borderRadius:14,border:`1.5px solid ${T.border}`,background:"#FAFAF8",color:T.ink,
            boxShadow:"inset 0 1px 3px rgba(26,31,46,0.04)"}}/>
        <motion.button type="button" whileHover={{scale:1.04}} whileTap={{scale:0.95}} onClick={addCustom}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-robert font-bold text-white"
          style={{borderRadius:14,background:T.ink,boxShadow:`0 3px 0 rgba(0,0,0,0.3),0 6px 14px rgba(26,31,46,0.18)`}}>
          <Plus size={11}/> Add
        </motion.button>
      </div>
    </div>
  )
}

function BudgetControl({value,onChange}:{value:number;onChange:(v:number)=>void}){
  const [editing,setEditing]=useState(false)
  const [raw,setRaw]=useState(String(value))
  const MARKS=[500,2000,4000,6000,8000,10000]
  const clamp=(n:number)=>Math.round(Math.min(10000,Math.max(500,n))/100)*100
  const pct=((value-500)/9500)*100
  const commit=()=>{const n=parseInt(raw.replace(/[^0-9]/g,""),10);onChange(!isNaN(n)?clamp(n):value);setEditing(false)}
  return(
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-robert text-[10px] font-bold tracking-widest uppercase" style={{color:T.muted}}>Budget</span>
        {editing
          ?<input autoFocus value={raw} onChange={e=>setRaw(e.target.value)}
              onBlur={commit} onKeyDown={e=>e.key==="Enter"&&commit()}
              className="w-28 text-right text-xl font-black outline-none border-b-2"
              style={{fontFamily:"var(--font-neulis)",color:T.ink,borderColor:T.ink,background:"transparent"}}/>
          :<motion.button type="button" key={value}
              initial={{opacity:0,y:-6,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
              transition={{type:"spring",stiffness:400,damping:25}}
              onClick={()=>{setRaw(String(value));setEditing(true)}}
              className="font-black text-xl cursor-text" style={{fontFamily:"var(--font-neulis)",color:T.ink}}>
              ₹{value.toLocaleString("en-IN")}
            </motion.button>
        }
      </div>
      <div className="relative h-4 flex items-center">
        <div className="w-full h-2.5 rounded-full relative overflow-hidden" style={{background:"rgba(26,31,46,0.08)"}}>
          <motion.div className="absolute left-0 top-0 h-full rounded-full"
            style={{background:`linear-gradient(90deg,${T.accent},#818CF8)`}}
            animate={{width:`${pct}%`}} transition={{type:"spring",stiffness:300,damping:30}}/>
        </div>
        <input type="range" min={500} max={10000} step={100} value={value}
          onChange={e=>onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{zIndex:2}}/>
        <motion.div className="absolute w-5 h-5 rounded-full pointer-events-none"
          style={{background:T.ink,zIndex:1,boxShadow:`0 0 0 3px white,0 0 0 5px ${T.ink},0 4px 10px rgba(26,31,46,0.25)`}}
          animate={{left:`calc(${pct}% - 10px)`}} transition={{type:"spring",stiffness:300,damping:30}}/>
      </div>
      <div className="flex justify-between mt-2.5">
        {MARKS.map(m=>(
          <motion.button key={m} type="button" onClick={()=>onChange(m)}
            className="text-[9px] font-robert font-bold"
            animate={{color:value===m?T.ink:T.muted,scale:value===m?1.15:1}}
            transition={{type:"spring",stiffness:400,damping:20}}>
            {m>=1000?`₹${m/1000}k`:`₹${m}`}
          </motion.button>
        ))}
      </div>
      <p className="text-[10px] font-robert mt-2" style={{color:T.muted}}>Tap the amount above to type a custom value</p>
    </div>
  )
}

function StepCard({children,step}:{children:React.ReactNode;step:number}){
  return(
    <AnimatePresence mode="wait">
      <motion.div key={step}
        initial={{opacity:0,rotateX:12,scale:0.96,y:24}}
        animate={{opacity:1,rotateX:0,scale:1,y:0}}
        exit={{opacity:0,rotateX:-8,scale:0.97,y:-18}}
        transition={{duration:0.45,ease:[0.22,1,0.36,1]}}
        style={{transformStyle:"preserve-3d",perspective:1200}}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function SuccessScreen({onReset}:{onReset:()=>void}){
  return(
    <motion.div initial={{opacity:0,scale:0.93,y:16}} animate={{opacity:1,scale:1,y:0}}
      transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
      className="flex flex-col items-center text-center py-14 px-8 gap-6">
      <motion.div initial={{scale:0,rotate:-15}} animate={{scale:1,rotate:0}}
        transition={{delay:0.12,type:"spring",stiffness:260,damping:15}}
        className="w-20 h-20 rounded-[24px] flex items-center justify-center"
        style={{background:T.accentLight,border:`1px solid rgba(99,102,241,0.25)`}}>
        <CheckCircle2 size={36} style={{color:T.accent}} strokeWidth={1.8}/>
      </motion.div>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25}}>
        <h4 className="font-neulis font-black text-2xl mb-2" style={{color:T.ink}}>Request sent! ⚡</h4>
        <p className="text-sm font-robert leading-relaxed max-w-[240px] mx-auto" style={{color:T.sub}}>
          I&apos;ll personally review and reply within 12 hours.
        </p>
      </motion.div>
      <motion.a initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.38}}
        href="https://t.me/your_telegram" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 px-7 py-4 text-white font-robert font-bold text-sm w-full max-w-xs justify-center"
        style={{borderRadius:18,background:"#229ED9",boxShadow:"0 4px 0 #1268A1,0 8px 24px rgba(34,158,217,0.22),inset 0 1px 0 rgba(255,255,255,0.2)"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
        </svg>
        Join Telegram Community
      </motion.a>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
        className="flex flex-wrap gap-2 justify-center">
        {["Direct DM reply","No middleman","Live progress updates"].map((t,i)=>(
          <motion.span key={t} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
            transition={{delay:0.52+i*0.08,type:"spring",stiffness:400}}
            className="text-[10px] font-robert font-semibold px-3 py-1.5 rounded-full"
            style={{background:T.greenLight,color:T.green,border:`1px solid rgba(52,211,153,0.2)`}}>
            ✓ {t}
          </motion.span>
        ))}
      </motion.div>
      <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.58}}
        type="button" onClick={onReset}
        className="text-[11px] font-robert underline underline-offset-2" style={{color:T.muted}}>
        Submit another request →
      </motion.button>
    </motion.div>
  )
}

const IS:React.CSSProperties={
  borderRadius:14,border:`1.5px solid rgba(26,31,46,0.12)`,
  background:"#FAFAF8",color:T.ink,fontSize:13,
  fontFamily:"var(--font-robert)",
  boxShadow:"inset 0 1px 3px rgba(26,31,46,0.05)",
  width:"100%",outline:"none",padding:"10px 14px",
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function RequestProjectSection(){
  const sectionRef    = useRef<HTMLElement>(null)
  const eyebrowRef    = useRef<HTMLDivElement>(null)
  const headingRef    = useRef<HTMLHeadingElement>(null)
  const subRef        = useRef<HTMLParagraphElement>(null)
  const formRef       = useRef<HTMLDivElement>(null)
  const sidebarRef    = useRef<HTMLDivElement>(null)
  const perksRef      = useRef<HTMLDivElement>(null)
  const bgGlowRef     = useRef<HTMLDivElement>(null)
  const bgGlow2Ref    = useRef<HTMLDivElement>(null)
  const topLineRef    = useRef<HTMLDivElement>(null)
  const dotGridRef    = useRef<HTMLDivElement>(null)
  const leftCard1Ref  = useRef<HTMLDivElement>(null)
  const leftCard2Ref  = useRef<HTMLDivElement>(null)
  const rightCard1Ref = useRef<HTMLDivElement>(null)
  const rightCard2Ref = useRef<HTMLDivElement>(null)
  const leftShapeRef  = useRef<HTMLDivElement>(null)
  const rightShapeRef = useRef<HTMLDivElement>(null)
  const ghostNumRef   = useRef<HTMLDivElement>(null)
  const ghostCodeRef  = useRef<HTMLDivElement>(null)

  const [step,setStep]             = useState(0)
  const [submitted,setSubmitted]   = useState(false)
  const [submitting,setSubmitting] = useState(false)
  const [projectType,setProjectType] = useState("")
  const [selFeats,setSelFeats]     = useState<FeatureTag[]>([])
  const [budget,setBudget]         = useState(2000)
  const [description,setDescription] = useState("")
  const [deadline,setDeadline]     = useState<Date|undefined>(undefined)
  const [stackPref,setStackPref]   = useState("")
  const [refLink,setRefLink]       = useState("")
  const [name,setName]             = useState("")
  const [college,setCollege]       = useState("")
  const [contactMeth,setContactMeth] = useState<"telegram"|"email"|"whatsapp">("telegram")
  const [contactVal,setContactVal] = useState("")

  const addFeat    = useCallback((t:FeatureTag)=>setSelFeats(p=>p.find(f=>f.label===t.label)?p:[...p,t]),[])
  const removeFeat = useCallback((n:string)=>setSelFeats(p=>p.filter(f=>f.label!==n)),[])
  const selType    = PROJECT_TYPES.find(t=>t.value===projectType)
  const reset=()=>{
    setStep(0);setSubmitted(false);setProjectType("");setSelFeats([]);setBudget(2000)
    setDescription("");setDeadline(undefined);setStackPref("");setRefLink("")
    setName("");setCollege("");setContactVal("")
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ANIMATION ENGINE — cinematic scroll-driven orchestration
  // ════════════════════════════════════════════════════════════════════════════
  useEffect(()=>{
    const section=sectionRef.current
    if(!section) return
    let ctx:gsap.Context

    const boot=()=>{
      ctx=gsap.context(()=>{

        // ── Convenience helpers ───────────────────────────────────────────────
        // Scrub parallax: tied to section scroll from bottom→top of viewport
        const scrollParallax=(extra?:object)=>({
          trigger:section, start:"top bottom", end:"bottom top",
          scrub:1.6, ...extra,
        })
        // Entrance trigger: fires when element enters viewport, reverses on exit
        const onEnter=(el:Element|null,start="top 88%")=>({
          trigger:el??section, start,
          toggleActions:"play none none reverse" as const,
        })

        // ── 1. TOP ACCENT LINE — draws from center outward ────────────────────
        if(topLineRef.current){
          gsap.set(topLineRef.current,{scaleX:0,opacity:0,transformOrigin:"center"})
          gsap.to(topLineRef.current,{
            scaleX:1, opacity:1, duration:1.4, ease:"expo.out",
            scrollTrigger:onEnter(topLineRef.current,"top 96%"),
          })
        }

        // ── 2. DOT GRID — dissolve in ─────────────────────────────────────────
        if(dotGridRef.current){
          gsap.set(dotGridRef.current,{opacity:0})
          gsap.to(dotGridRef.current,{
            opacity:1, duration:1.8, ease:"power2.inOut",
            scrollTrigger:onEnter(section,"top 90%"),
          })
        }

        // ── 3. BG GLOWS — scale up from center + parallax float ───────────────
        if(bgGlowRef.current){
          gsap.set(bgGlowRef.current,{scale:0.5,opacity:0})
          gsap.to(bgGlowRef.current,{
            scale:1, opacity:1, duration:2.0, ease:"power2.out",
            scrollTrigger:onEnter(section,"top 92%"),
          })
          // Slow upward parallax — feels like section has depth
          gsap.to(bgGlowRef.current,{
            yPercent:-24, ease:"none",
            scrollTrigger:scrollParallax(),
          })
        }
        if(bgGlow2Ref.current){
          gsap.set(bgGlow2Ref.current,{scale:0.6,opacity:0})
          gsap.to(bgGlow2Ref.current,{
            scale:1, opacity:1, duration:2.2, ease:"power2.out", delay:0.3,
            scrollTrigger:onEnter(section,"top 90%"),
          })
          gsap.to(bgGlow2Ref.current,{
            yPercent:-16, ease:"none",
            scrollTrigger:scrollParallax(),
          })
        }

        // ── 4. GHOST NUMBERS — parallax at different depths ───────────────────
        // Left "04" — deeper parallax (moves more = feels closer)
        if(ghostNumRef.current){
          gsap.set(ghostNumRef.current,{opacity:0,scale:1.15,x:-20})
          gsap.to(ghostNumRef.current,{
            opacity:1, scale:1, x:0, duration:1.6, ease:"power3.out",
            scrollTrigger:onEnter(section,"top 88%"),
          })
          gsap.to(ghostNumRef.current,{
            yPercent:-42, ease:"none",
            scrollTrigger:scrollParallax(),
          })
        }
        // Right "</>" — shallower parallax (moves less = feels farther)
        if(ghostCodeRef.current){
          gsap.set(ghostCodeRef.current,{opacity:0,scale:1.15,x:20})
          gsap.to(ghostCodeRef.current,{
            opacity:1, scale:1, x:0, duration:1.6, ease:"power3.out", delay:0.1,
            scrollTrigger:onEnter(section,"top 86%"),
          })
          gsap.to(ghostCodeRef.current,{
            yPercent:-22, ease:"none",
            scrollTrigger:scrollParallax(),
          })
        }

        // ── 5. SIDE STAT CARDS — dramatic spring entrance ────────────────────
        // Left cards: slide from far left with rotation + scale
        const leftCards=[leftCard1Ref.current,leftCard2Ref.current].filter(Boolean) as HTMLElement[]
        leftCards.forEach((el,i)=>{
          gsap.set(el,{opacity:0,x:-60,rotate:-8,scale:0.85})
          gsap.to(el,{
            opacity:1, x:0, rotate:0, scale:1,
            duration:1.0, ease:"back.out(1.6)", delay:0.15+i*0.2,
            scrollTrigger:onEnter(section,"top 75%"),
          })
          // Parallax: each card at slightly different rate = layered depth
          gsap.to(el,{
            yPercent:-(10+i*8), ease:"none",
            scrollTrigger:scrollParallax(),
          })
          // Continuous gentle bob
          gsap.to(el,{
            y:`-=${12+i*5}`, ease:"sine.inOut",
            yoyo:true, repeat:-1, duration:3.8+i*0.9, delay:i*0.7,
          })
        })

        // Right cards: slide from far right with rotation + scale
        const rightCards=[rightCard1Ref.current,rightCard2Ref.current].filter(Boolean) as HTMLElement[]
        rightCards.forEach((el,i)=>{
          gsap.set(el,{opacity:0,x:60,rotate:8,scale:0.85})
          gsap.to(el,{
            opacity:1, x:0, rotate:0, scale:1,
            duration:1.0, ease:"back.out(1.6)", delay:0.2+i*0.2,
            scrollTrigger:onEnter(section,"top 75%"),
          })
          gsap.to(el,{
            yPercent:-(8+i*10), ease:"none",
            scrollTrigger:scrollParallax(),
          })
          gsap.to(el,{
            y:`-=${10+i*6}`, ease:"sine.inOut",
            yoyo:true, repeat:-1, duration:3.4+i*1.1, delay:0.4+i*0.5,
          })
        })

        // ── 6. FLOATING SHAPES ────────────────────────────────────────────────
        const shapes=[leftShapeRef.current,rightShapeRef.current].filter(Boolean) as HTMLElement[]
        shapes.forEach((el,i)=>{
          // Entrance: pop in with back.out spring + slight rotation reset
          gsap.set(el,{opacity:0,scale:0.1,rotation:i===0?-30:30})
          gsap.to(el,{
            opacity:0.55, scale:1, rotation:0,
            duration:1.2, ease:"back.out(2.0)",
            scrollTrigger:onEnter(section,"top 78%"),
          })
          // Float bob
          gsap.to(el,{
            y:`-=${20+i*10}`, ease:"sine.inOut",
            yoyo:true, repeat:-1, duration:3.0+i*1.4, delay:i*0.8,
          })
          // Left bracket: gentle sway; Right gear: continuous spin
          if(i===0){
            gsap.to(el,{rotation:15,ease:"sine.inOut",yoyo:true,repeat:-1,duration:4.5})
          } else {
            gsap.to(el,{rotation:360,ease:"none",repeat:-1,duration:16})
          }
          // Parallax
          gsap.to(el,{yPercent:-(26+i*12),ease:"none",scrollTrigger:scrollParallax()})
        })

        // ── 7. EYEBROW BADGE — pop up from below with spring ─────────────────
        if(eyebrowRef.current){
          gsap.set(eyebrowRef.current,{opacity:0,y:36,scale:0.75})
          gsap.to(eyebrowRef.current,{
            opacity:1, y:0, scale:1, duration:0.9, ease:"back.out(2.2)",
            scrollTrigger:onEnter(eyebrowRef.current,"top 90%"),
          })
        }

        // ── 8. HEADING — word-by-word: blur + slide + skew cascade ───────────
        if(headingRef.current){
          const words=headingRef.current.querySelectorAll<HTMLElement>(".word-anim")
          if(words.length){
            gsap.set(words,{opacity:0,y:80,skewX:-10,filter:"blur(14px)",transformOrigin:"left bottom"})
            gsap.to(words,{
              opacity:1, y:0, skewX:0, filter:"blur(0px)",
              duration:1.0, ease:"power4.out",
              stagger:{each:0.12, ease:"power2.out"},
              scrollTrigger:onEnter(headingRef.current,"top 88%"),
            })
          } else {
            gsap.set(headingRef.current,{opacity:0,y:50,skewX:-5,filter:"blur(10px)"})
            gsap.to(headingRef.current,{
              opacity:1, y:0, skewX:0, filter:"blur(0px)",
              duration:1.0, ease:"power4.out",
              scrollTrigger:onEnter(headingRef.current,"top 88%"),
            })
          }
        }

        // ── 9. SUBTEXT — smooth fade + rise ───────────────────────────────────
        if(subRef.current){
          gsap.set(subRef.current,{opacity:0,y:24,filter:"blur(4px)"})
          gsap.to(subRef.current,{
            opacity:1, y:0, filter:"blur(0px)", duration:0.85, ease:"power3.out", delay:0.18,
            scrollTrigger:onEnter(subRef.current,"top 88%"),
          })
        }

        // ── 10. FORM CARD — the centrepiece cinematic entrance ────────────────
        if(formRef.current){
          // Initial state: tilted back in 3D, scaled down, far below
          gsap.set(formRef.current,{
            opacity:0, y:80, scale:0.88,
            rotateX:18, transformPerspective:1400,
            filter:"blur(8px)",
          })
          // Animate in: unfolts forward like opening a book
          gsap.to(formRef.current,{
            opacity:1, y:0, scale:1, rotateX:0, filter:"blur(0px)",
            duration:1.3, ease:"power3.out",
            scrollTrigger:onEnter(formRef.current,"top 86%"),
          })
          // After entrance: subtle upward parallax float while scrolling through
          gsap.to(formRef.current,{
            yPercent:-5, ease:"none",
            scrollTrigger:scrollParallax({start:"top 60%",end:"bottom top"}),
          })
        }

        // ── 11. SIDEBAR — slide from left with slight rotation ────────────────
        if(sidebarRef.current){
          gsap.set(sidebarRef.current,{opacity:0,x:-50,rotateY:-8,transformPerspective:800})
          gsap.to(sidebarRef.current,{
            opacity:1, x:0, rotateY:0,
            duration:1.1, ease:"power3.out",
            scrollTrigger:onEnter(sidebarRef.current,"top 84%"),
          })
        }

        // ── 12. PERKS — staggered blur-slide from left ────────────────────────
        if(perksRef.current){
          const perkItems=perksRef.current.querySelectorAll<HTMLElement>(".perk-item")
          if(perkItems.length){
            gsap.set(perkItems,{opacity:0,x:-28,filter:"blur(6px)"})
            gsap.to(perkItems,{
              opacity:1, x:0, filter:"blur(0px)",
              duration:0.7, ease:"power3.out",
              stagger:0.11,
              scrollTrigger:onEnter(perksRef.current,"top 82%"),
            })
          }
        }

      },section)
    }

    // Double rAF ensures layout is fully settled before GSAP measures
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      boot()
      // Extra refresh after a tick for any dynamic content
      setTimeout(()=>ScrollTrigger.refresh(),250)
    }))

    return()=>{ try{ctx?.revert()}catch(_){} }
  },[])

  const handleSubmit=async()=>{
    setSubmitting(true)
    const payload:ProjectRequest={
      projectType, features:selFeats.map(f=>f.label), budget,
      description, deadline:deadline?deadline.toISOString():"",
      stackPref, refLink, name, college,
      contactMethod:contactMeth, contactValue:contactVal,
      submittedAt:new Date().toISOString(),
    }
    try{await submitProjectRequest(payload);setSubmitted(true)}
    catch(e){console.error(e);alert("Something went wrong — please try again.")}
    finally{setSubmitting(false)}
  }

  const cpHint={telegram:"@yourusername",email:"you@email.com",whatsapp:"+91 XXXXX XXXXX"}
  const LB="font-robert text-[10px] font-bold tracking-[0.3em] uppercase block mb-1.5"

  return(
    <section ref={sectionRef} id="req_a_project" aria-label="Request a project"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{background:T.bg,isolation:"isolate"}}>

      {/* ── BACKGROUND ───────────────────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{zIndex:0}}>

        {/* Primary center glow */}
        <div ref={bgGlowRef} style={{
          position:"absolute", top:"-10%", left:"50%", transform:"translateX(-50%)",
          width:"72vw", height:"52vw", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(99,102,241,0.10) 0%,transparent 62%)",
          filter:"blur(64px)", willChange:"transform,opacity",
        }}/>

        {/* Secondary bottom-right glow */}
        <div ref={bgGlow2Ref} style={{
          position:"absolute", bottom:"-8%", right:"-8%",
          width:"40vw", height:"40vw", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 62%)",
          filter:"blur(56px)", willChange:"transform,opacity",
        }}/>

        {/* Top accent line — scale draws from center */}
        <div ref={topLineRef} style={{
          position:"absolute", top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,transparent 6%,rgba(99,102,241,0.40) 26%,rgba(99,102,241,0.70) 50%,rgba(99,102,241,0.40) 74%,transparent 94%)`,
          transformOrigin:"center", willChange:"transform,opacity",
        }}/>

        {/* Dot grid — sides only */}
        <div ref={dotGridRef} style={{
          position:"absolute", inset:0,
          backgroundImage:`radial-gradient(circle,rgba(26,31,46,0.13) 1px,transparent 1px)`,
          backgroundSize:"28px 28px",
          WebkitMaskImage:`radial-gradient(ellipse 26% 90% at 0% 50%,black 0%,transparent 75%),radial-gradient(ellipse 26% 90% at 100% 50%,black 0%,transparent 75%)`,
          maskImage:`radial-gradient(ellipse 26% 90% at 0% 50%,black 0%,transparent 75%),radial-gradient(ellipse 26% 90% at 100% 50%,black 0%,transparent 75%)`,
          WebkitMaskComposite:"destination-over",
          maskComposite:"add" as React.CSSProperties["maskComposite"],
          willChange:"opacity",
        }}/>
      </div>

      {/* ── SIDE DECORATIONS ─────────────────────────────────────────────── */}
      <SideBlobs
        leftCard1Ref={leftCard1Ref} leftCard2Ref={leftCard2Ref}
        rightCard1Ref={rightCard1Ref} rightCard2Ref={rightCard2Ref}
        leftShapeRef={leftShapeRef} rightShapeRef={rightShapeRef}
        ghostNumRef={ghostNumRef} ghostCodeRef={ghostCodeRef}/>

      {/* ── CENTRE CONTENT ───────────────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto px-4" style={{zIndex:2}}>

        {/* Header */}
        <div className="text-center mb-14 flex flex-col items-center gap-3">
          <div ref={eyebrowRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-robert font-bold text-[10px] tracking-[0.3em] uppercase"
            style={{background:T.accentLight,color:T.accent,border:`1px solid rgba(99,102,241,0.15)`,opacity:0}}>
            <Sparkles size={10}/> Let&apos;s Build Together
          </div>

          <h2 ref={headingRef}
            className="font-neulis font-black leading-tight tracking-tight"
            style={{fontSize:"clamp(2rem,4.5vw,3.2rem)",color:T.ink,opacity:0}}>
            <span className="word-anim inline-block">Request</span>{" "}
            <span className="word-anim inline-block">a </span>
            <span className="word-anim inline-block" style={{color:T.accent}}>Project</span>
          </h2>

          <p ref={subRef} className="font-robert text-sm max-w-xs leading-relaxed"
            style={{color:T.muted,opacity:0}}>
            3 quick steps — personal reply within 12 hours.
          </p>
        </div>

        {/* ── FORM CARD ──────────────────────────────────────────────────── */}
        <div ref={formRef}
          className="grid grid-cols-1 lg:grid-cols-[270px_1fr] overflow-hidden"
          style={{borderRadius:28,background:T.card,boxShadow:shadow.float,
            border:`1.5px solid ${T.border}`,opacity:0,willChange:"transform,opacity"}}>

          {/* LEFT sidebar — navy */}
          <div ref={sidebarRef}
            className="hidden lg:flex flex-col p-8"
            style={{borderRight:`1.5px solid rgba(26,31,46,0.06)`,background:T.sidebar,opacity:0}}>

            <motion.div
              initial={{opacity:0,scale:0.8,y:-10}}
              whileInView={{opacity:1,scale:1,y:0}}
              viewport={{once:true,margin:"-60px"}}
              transition={{delay:0.35,type:"spring",stiffness:400,damping:25}}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full px-3 py-1.5 mb-7 w-fit font-robert"
              style={{background:`rgba(99,102,241,0.18)`,color:"#A5B4FC",border:`1px solid rgba(99,102,241,0.25)`}}>
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{background:"#818CF8"}}
                animate={{scale:[1,1.5,1],opacity:[1,0.5,1]}} transition={{repeat:Infinity,duration:2}}/>
              Open for projects
            </motion.div>

            <motion.h3
              initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-60px"}}
              transition={{delay:0.45,duration:0.7,ease:[0.22,1,0.36,1]}}
              className="font-neulis font-black text-xl leading-snug mb-2.5 text-white">
              Let&apos;s build your{" "}
              <span style={{color:"#818CF8"}}>next project</span>
            </motion.h3>

            <motion.p
              initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-60px"}}
              transition={{delay:0.55,duration:0.6}}
              className="text-xs font-robert leading-relaxed mb-8"
              style={{color:"rgba(255,255,255,0.45)"}}>
              I personally read every request and reply within 12 hours.
            </motion.p>

            <div ref={perksRef} className="flex flex-col gap-4 flex-1 mb-8">
              {PERKS.map((p,i)=>(
                <div key={p.title} className="perk-item flex items-start gap-3" style={{opacity:0}}>
                  <motion.div
                    whileHover={{scale:1.12,rotate:8}}
                    transition={{type:"spring",stiffness:400,damping:20}}
                    className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0"
                    style={{background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.2)",color:"#A5B4FC"}}>
                    <p.Icon size={13} strokeWidth={2}/>
                  </motion.div>
                  <div>
                    <p className="text-xs font-bold font-robert leading-tight text-white">{p.title}</p>
                    <p className="text-[10px] font-robert mt-0.5" style={{color:"rgba(255,255,255,0.4)"}}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-60px"}}
              transition={{delay:0.68,duration:0.6}}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
              style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.18)"}}>
              <motion.span className="w-2 h-2 rounded-full shrink-0" style={{background:"#818CF8"}}
                animate={{scale:[1,1.4,1],opacity:[1,0.4,1]}} transition={{repeat:Infinity,duration:1.8}}/>
              <span className="text-[11px] font-robert" style={{color:"rgba(255,255,255,0.45)"}}>
                <strong className="font-bold text-white">Accepting projects</strong> — 12 hr reply
              </span>
            </motion.div>
          </div>

          {/* RIGHT form panel */}
          <div className="flex flex-col min-w-0">
            {!submitted&&(
              <div className="px-8 pt-7 pb-0">
                <StepBar current={step}/>
              </div>
            )}

            <StepCard step={submitted?99:step}>
              <div>
                {submitted&&<SuccessScreen onReset={reset}/>}

                {/* ── STEP 0: Project Type ── */}
                {!submitted&&step===0&&(
                  <div className="px-8 py-6 space-y-5">
                    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}}>
                      <p className="font-neulis font-black text-lg" style={{color:T.ink}}>What are you building?</p>
                      <p className="text-xs font-robert mt-1" style={{color:T.sub}}>Pick a project type to get started.</p>
                    </motion.div>
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08,duration:0.5,ease:[0.22,1,0.36,1]}}>
                      <label className={LB} style={{color:T.muted}}>Project Type</label>
                      <Select value={projectType} onValueChange={v=>setProjectType(v??"")}>
                        <SelectTrigger className="font-robert text-sm h-11"
                          style={{...IS,padding:"0 14px",height:44,display:"flex",alignItems:"center"}}>
                          <SelectValue placeholder="Select a tier..."/>
                        </SelectTrigger>
                        <SelectContent style={{borderRadius:16,border:`1.5px solid rgba(26,31,46,0.10)`,
                          boxShadow:"0 8px 32px rgba(26,31,46,0.12)",background:"#FFFFFF"}}>
                          {PROJECT_TYPES.map(t=>(
                            <SelectItem key={t.value} value={t.value} className="font-robert text-sm py-2.5 cursor-pointer">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{background:t.dot}}/>
                                <span className="font-bold" style={{color:T.ink}}>{t.full}</span>
                                <span className="text-xs" style={{color:T.muted}}>— {t.sub}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <AnimatePresence>
                      {projectType&&(
                        <motion.div initial={{opacity:0,y:-10,scale:0.96}} animate={{opacity:1,y:0,scale:1}}
                          exit={{opacity:0,y:-10}} transition={{type:"spring",stiffness:400,damping:25}}
                          className="flex items-center justify-between px-4 py-3"
                          style={{borderRadius:16,background:T.ink,
                            boxShadow:`0 4px 0 rgba(55,48,163,0.55),0 8px 20px rgba(99,102,241,0.22),inset 0 1px 0 rgba(255,255,255,0.22)`}}>
                          <div className="flex items-center gap-2.5">
                            <motion.span className="w-2 h-2 rounded-full" style={{background:selType?.dot}}
                              animate={{scale:[1,1.3,1]}} transition={{repeat:Infinity,duration:1.8}}/>
                            <span className="font-robert font-bold text-sm text-white">{selType?.full}</span>
                            <span className="text-xs" style={{color:"rgba(255,255,255,0.45)"}}>— {selType?.sub}</span>
                          </div>
                          <span className="text-xs font-robert font-bold" style={{color:"#A5B4FC"}}>{selType?.price}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="grid grid-cols-2 gap-2.5">
                      {PROJECT_TYPES.map((t,i)=>{
                        const on=projectType===t.value
                        return(
                          <motion.button key={t.value} type="button"
                            initial={{opacity:0,y:16,scale:0.94}} animate={{opacity:1,y:0,scale:1}}
                            transition={{delay:0.12+i*0.06,type:"spring",stiffness:400,damping:28}}
                            whileHover={{y:-3,scale:1.02}} whileTap={{scale:0.97}}
                            onClick={()=>setProjectType(t.value)} className="text-left p-4"
                            style={{borderRadius:18,background:on?T.ink:"#FAFAF8",
                              boxShadow:on?`0 4px 0 rgba(55,48,163,0.55),0 8px 20px rgba(99,102,241,0.22),inset 0 1px 0 rgba(255,255,255,0.22)`:shadow.chip,
                              border:on?`1.5px solid ${T.ink}`:`1.5px solid rgba(26,31,46,0.08)`,
                              transition:"background 0.2s,box-shadow 0.2s,border-color 0.2s"}}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full" style={{background:t.dot}}/>
                              <p className="font-neulis font-black text-sm" style={{color:on?"#fff":T.ink}}>{t.label}</p>
                            </div>
                            <p className="font-robert text-[11px]" style={{color:on?"rgba(255,255,255,0.5)":T.muted}}>{t.sub}</p>
                            <p className="font-robert text-[10px] font-bold mt-1.5" style={{color:on?"#A5B4FC":"#4F46E5"}}>{t.price}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 1: Features + Budget ── */}
                {!submitted&&step===1&&(
                  <div className="px-8 py-6 space-y-6">
                    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}}>
                      <p className="font-neulis font-black text-lg" style={{color:T.ink}}>Features & Budget</p>
                      <p className="text-xs font-robert mt-1" style={{color:T.sub}}>Select what you need and set your budget.</p>
                    </motion.div>
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08,duration:0.5}}>
                      <label className={LB} style={{color:T.muted}}>Features Needed</label>
                      <FeatureSelector selected={selFeats} onAdd={addFeat} onRemove={removeFeat}/>
                    </motion.div>
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.16,duration:0.5}}>
                      <BudgetControl value={budget} onChange={setBudget}/>
                    </motion.div>
                  </div>
                )}

                {/* ── STEP 2: Contact ── */}
                {!submitted&&step===2&&(
                  <div className="px-8 py-6 space-y-5">
                    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}}>
                      <p className="font-neulis font-black text-lg" style={{color:T.ink}}>Almost done</p>
                      <p className="text-xs font-robert mt-1" style={{color:T.sub}}>Just enough to reach you — no spam, ever.</p>
                    </motion.div>
                    {[
                      <div key="desc">
                        <label className={LB} style={{color:T.muted}}>Project Description</label>
                        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
                          placeholder="e.g. A student attendance system where teachers log in, mark attendance, view reports..."
                          className="resize-none" style={{...IS,padding:"12px 14px"}}/>
                      </div>,
                      <div key="dl-stack" className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={LB} style={{color:T.muted}}>Deadline</label>
                          <Popover>
                            <PopoverTrigger className="flex items-center gap-2.5 font-robert text-sm text-left w-full"
                              style={{...IS,height:42,color:deadline?T.ink:T.muted,cursor:"pointer"}}>
                              <CalendarIcon size={14} style={{color:T.muted,flexShrink:0}}/>
                              {deadline?format(deadline,"dd MMM yyyy"):"Pick a deadline"}
                            </PopoverTrigger>
                            <PopoverContent align="start" style={{padding:0,borderRadius:20,
                              border:`1.5px solid rgba(26,31,46,0.10)`,
                              boxShadow:"0 4px 0 rgba(26,31,46,0.08),0 16px 40px rgba(26,31,46,0.12)",
                              overflow:"hidden",background:"#FFFFFF",width:"auto"}}>
                              <Calendar mode="single" selected={deadline} onSelect={setDeadline}
                                disabled={date=>date<new Date(new Date().setHours(0,0,0,0))}
                                initialFocus className="font-robert"/>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className={LB} style={{color:T.muted}}>Stack Preference</label>
                          <Select value={stackPref} onValueChange={v=>setStackPref(v??"")}>
                            <SelectTrigger className="font-robert text-sm"
                              style={{...IS,height:42,display:"flex",alignItems:"center",padding:"0 12px"}}>
                              <SelectValue placeholder="You decide"/>
                            </SelectTrigger>
                            <SelectContent style={{borderRadius:14,border:`1.5px solid rgba(26,31,46,0.10)`,background:"#FFF"}}>
                              {[{v:"you",l:"You decide — best fit"},{v:"react-node",l:"React + Node.js"},
                                {v:"html",l:"HTML/CSS/JS only"},{v:"nextjs",l:"Next.js"},{v:"firebase",l:"React + Firebase"}]
                                .map(o=><SelectItem key={o.v} value={o.v} className="font-robert text-sm">{o.l}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>,
                      <div key="ref">
                        <label className={LB} style={{color:T.muted}}>Reference Link <span className="normal-case font-normal">(optional)</span></label>
                        <input type="url" value={refLink} onChange={e=>setRefLink(e.target.value)} placeholder="Any site you like..." style={IS}/>
                      </div>,
                      <div key="contact">
                        <label className={LB} style={{color:T.muted}}>Contact Method</label>
                        <div className="flex rounded-2xl overflow-hidden mb-2.5"
                          style={{border:`1.5px solid rgba(26,31,46,0.10)`,background:"rgba(26,31,46,0.03)"}}>
                          {(["telegram","email","whatsapp"] as const).map(m=>(
                            <motion.button key={m} type="button" onClick={()=>setContactMeth(m)}
                              className="flex-1 py-2.5 text-xs font-robert font-bold capitalize border-r last:border-r-0"
                              animate={{background:contactMeth===m?T.ink:"transparent",color:contactMeth===m?"white":T.sub}}
                              transition={{duration:0.2}} style={{borderColor:"rgba(26,31,46,0.08)"}}>
                              {m}
                            </motion.button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={IS}/>
                          <input value={contactVal} onChange={e=>setContactVal(e.target.value)} placeholder={cpHint[contactMeth]} style={IS}/>
                        </div>
                        <input value={college} onChange={e=>setCollege(e.target.value)} placeholder="College (optional)" style={IS}/>
                      </div>,
                    ].map((el,i)=>(
                      <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
                        transition={{delay:i*0.07,duration:0.5,ease:[0.22,1,0.36,1]}}>
                        {el}
                      </motion.div>
                    ))}
                    <AnimatePresence>
                      {projectType&&(
                        <motion.div initial={{opacity:0,y:8,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
                          exit={{opacity:0,y:-8}} transition={{type:"spring",stiffness:400,damping:25}}
                          className="p-4 space-y-2.5 rounded-2xl"
                          style={{background:"rgba(26,31,46,0.03)",border:`1.5px solid rgba(26,31,46,0.06)`}}>
                          <p className="font-robert text-[10px] font-bold tracking-widest uppercase" style={{color:T.muted}}>Summary</p>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[11px] font-robert font-bold px-3 py-1.5 rounded-full text-white" style={{background:T.ink}}>{selType?.full}</span>
                            <span className="text-[11px] font-neulis font-black px-3 py-1.5 rounded-full"
                              style={{background:"rgba(99,102,241,0.08)",color:T.accent}}>₹{budget.toLocaleString("en-IN")}</span>
                            {selFeats.slice(0,3).map(f=>{
                              const feat=FEATURES.find(x=>x.label===f.label)
                              return(
                                <span key={f.label} className="text-[10px] font-robert px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                                  style={{background:"rgba(255,255,255,0.9)",color:T.sub,border:`1px solid rgba(26,31,46,0.08)`}}>
                                  {feat&&<feat.Icon size={9} style={{color:feat.ic}}/>}{f.label}
                                </span>
                              )
                            })}
                            {selFeats.length>3&&<span className="text-[10px] font-robert" style={{color:T.muted}}>+{selFeats.length-3} more</span>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Footer nav ── */}
                {!submitted&&(
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                    transition={{delay:0.26,duration:0.5}}
                    className="flex items-center justify-between px-8 py-5"
                    style={{borderTop:`1.5px solid rgba(26,31,46,0.05)`}}>
                    <div className="flex items-center gap-3">
                      <AnimatePresence>
                        {step>0&&(
                          <motion.button type="button"
                            initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}}
                            transition={{type:"spring",stiffness:400,damping:25}}
                            onClick={()=>setStep(s=>s-1)}
                            className="flex items-center gap-1.5 font-robert text-sm font-semibold transition-colors"
                            style={{color:T.sub}}>
                            <ArrowLeft size={14}/> Back
                          </motion.button>
                        )}
                      </AnimatePresence>
                      <span className="font-robert text-[10px]" style={{color:T.muted}}>Step {step+1} of {STEPS.length}</span>
                    </div>
                    <MagneticBtn
                      onClick={step<2?()=>setStep(s=>s+1):handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-7 py-3.5 font-robert font-bold text-sm text-white disabled:opacity-60"
                      style={{borderRadius:18,background:`linear-gradient(135deg,${T.accent},#818CF8)`,boxShadow:shadow.btn}}>
                      {submitting?"Sending…"
                        :step<2
                          ?<>Continue <motion.span animate={{x:[0,3,0]}} transition={{repeat:Infinity,duration:1.2}}><ArrowRight size={14}/></motion.span></>
                          :<>Send Request ⚡</>}
                    </MagneticBtn>
                  </motion.div>
                )}
              </div>
            </StepCard>
          </div>
        </div>
      </div>
    </section>
  )
}