"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DemoSection — Page 03 · "Impressive Projects"
//
// BACKGROUND SYSTEM (confirmed layout):
//   Device line-art is drawn INSIDE the background SVG — same layer as glows,
//   ghost numbers, dot grid. Nothing floats on top of content.
//
//   Browser outline — bottom-left, stroke-only, tilted -6deg, ~0.16 opacity
//   Phone outline   — bottom-right, stroke-only, tilted +7deg, ~0.15 opacity
//   Ghost "03"      — top-left, outline stroke, parallax scrub
//   Ghost "{ }"     — top-right, outline stroke, parallax scrub
//   Dot grid        — side margins only
//   4 radial glows  — corners, very soft
//   Top accent line — indigo gradient
//
// ANIMATION — 3 phases (all GSAP):
//   Phase 1 (t=0.00): eyebrow → heading skew-drop → para blur-up
//   Phase 2 (t=0.55): pill badge bounces in from below (back.out)
//   Phase 3 (t=1.10): card belt expands with dealt cascade (rotateX stagger)
//
// GSAP yoyo effects:
//   Pill:       y +=8 sine.inOut yoyo repeat:-1 duration:2.2
//   Ghost "03": parallax scrub yPercent -30, scrub:2.0
//   Ghost "{ }":parallax scrub yPercent -20, scrub:1.6
//
// CARD BELT — true seamless infinite loop:
//   Single-deck modulo approach. Instead of cloning N copies and jumping
//   when pos crosses a threshold, we use a single deck rendered COPIES times
//   but keep pos always in range [-DECK,0] via modulo on every tick.
//   This means the seam NEVER shows — no jump, no stutter, ever.
//   Auto-scroll: 0.6px/frame lerped at 0.075. Drag + wheel supported.
//   Skew: derived from scroll velocity, clamped ±4deg, smooth transition.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  bg:     "#F9FBFF",
  accent: "#6366F1",
  ink:    "#1A1F2E",
  sub:    "#5A6075",
  muted:  "#9AA0B5",
  border: "rgba(26,31,46,0.09)",
  green:  "#34D399",
};

// ── Belt constants ────────────────────────────────────────────────────────────
const CARD_W         = 300;
const CARD_GAP       = 80;
const CARD_STRIDE    = CARD_W + CARD_GAP;
const COPIES         = 4;          // clones rendered for seamless wrap
const AUTO_SPEED     = 0.60;       // px/frame auto-scroll
const LERP_FACTOR    = 0.075;      // smoothing — higher = snappier
const WHEEL_MULT     = 0.22;
const EXPAND_STAGGER = 0.10;       // dealt cascade stagger between cards

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ── True modulo (always positive) ────────────────────────────────────────────
// JavaScript % is remainder, not modulo — negative values stay negative.
// We need pos to always stay in [-DECK, 0].
function mod(n: number, m: number) { return ((n % m) + m) % m; }

// ── Data ──────────────────────────────────────────────────────────────────────
interface Project {
  id: string; title: string; subtitle: string; image: string;
  deployedUrl: string; githubUrl: string; description: string;
  tags: string[]; techIcons: string[];
}

const ICON_MAP: Record<string, string> = {
  nextjs:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  react:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  nodejs:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  tailwind:   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  mongodb:    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
};

const PROJECTS: Project[] = [
  {
    id:"p1", title:"Portfolio Site",  subtitle:"Next.js + Tailwind",
    image:"https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    deployedUrl:"https://yoursite.com", githubUrl:"https://github.com/you/project",
    description:"Personal portfolio with 3D models, GSAP animations, and a fully responsive layout.",
    tags:["Next.js","Three.js"], techIcons:["nextjs","react"],
  },
  {
    id:"p2", title:"E-Commerce UI",   subtitle:"React + Framer Motion",
    image:"https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    deployedUrl:"https://yoursite.com", githubUrl:"https://github.com/you/project",
    description:"Full product listing UI with cart, filters, and smooth page transitions.",
    tags:["React","Stripe"], techIcons:["react","nodejs"],
  },
  {
    id:"p3", title:"Auth Dashboard",  subtitle:"Next.js + Prisma",
    image:"https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    deployedUrl:"https://yoursite.com", githubUrl:"https://github.com/you/project",
    description:"Full-stack dashboard with NextAuth, role-based access, and Prisma + Postgres.",
    tags:["NextAuth","Prisma"], techIcons:["nextjs","postgresql"],
  },
  {
    id:"p4", title:"Real-time Chat",  subtitle:"Socket.io + MongoDB",
    image:"https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    deployedUrl:"https://yoursite.com", githubUrl:"https://github.com/you/project",
    description:"Live messaging with rooms, presence indicators, and persistent message history.",
    tags:["Socket.io","Redis"], techIcons:["nodejs","mongodb"],
  },
  {
    id:"p5", title:"Task Manager",    subtitle:"React + Node",
    image:"https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    deployedUrl:"https://yoursite.com", githubUrl:"https://github.com/you/project",
    description:"Kanban-style task manager with drag-and-drop, labels, and team collaboration.",
    tags:["DnD","Express"], techIcons:["react","nodejs"],
  },
  {
    id:"p6", title:"Weather App",     subtitle:"React + OpenWeather",
    image:"https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    deployedUrl:"https://yoursite.com", githubUrl:"https://github.com/you/project",
    description:"Location-based weather dashboard with 7-day forecast and animated icons.",
    tags:["API","Recharts"], techIcons:["react","nodejs"],
  },
];

// ── Stack preview (pre-expansion) ─────────────────────────────────────────────
function StackPreview() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: CARD_W, height: 310 }}>
      {[3, 2, 1, 0].map(i => (
        <div key={i} className="absolute rounded-[22px]"
          style={{
            width: CARD_W, height: 290,
            background: "linear-gradient(150deg,rgba(255,255,255,0.96) 0%,rgba(238,242,255,0.90) 100%)",
            backdropFilter: "blur(18px)",
            border: "1.5px solid rgba(255,255,255,0.88)",
            boxShadow: "0 2px 0 1px rgba(0,0,0,0.03),0 8px 24px rgba(0,0,0,0.09)",
            transform: `translateX(${i*9}px) translateY(${i*-7}px) rotate(${(i-1.5)*2.8}deg)`,
            zIndex: 4 - i,
          }}
        />
      ))}
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
// Each card animates in with a dealt-from-deck entrance: y:60 → 0, rotateX:8 → 0
// The spring stagger + rotateX gives the "flip onto the table" feel.
function ProjectCard({
  project, index, isExpanded, velSkew,
}: {
  project: Project; index: number; isExpanded: boolean; velSkew: number;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity:0, y:60, scale:0.88, rotateX:10 }}
      animate={isExpanded
        ? { opacity:1, y:0, scale:1, rotateX:0 }
        : { opacity:0, y:60, scale:0.88, rotateX:10 }}
      transition={{
        type:"spring", stiffness:130, damping:18, mass:1.2,
        delay: isExpanded ? index * EXPAND_STAGGER : 0,
        opacity:{ duration:0.38, ease:"easeOut", delay: isExpanded ? index * EXPAND_STAGGER : 0 },
      }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={()  => setHov(false)}
      className="flex-shrink-0 flex flex-col rounded-[22px] overflow-hidden"
      style={{
        transformPerspective: 900,
        width: CARD_W,
        border: hov
          ? "1.5px solid rgba(99,102,241,0.24)"
          : "1.5px solid rgba(255,255,255,0.90)",
        background: "linear-gradient(150deg,rgba(255,255,255,0.97) 0%,rgba(238,242,255,0.92) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: hov
          ? "0 4px 0 1px rgba(99,102,241,0.10),0 20px 48px rgba(99,102,241,0.15)"
          : "0 2px 0 1px rgba(0,0,0,0.03),0 8px 24px rgba(0,0,0,0.07),0 20px 40px rgba(0,0,0,0.04)",
        // Skew from velocity — cards lean slightly in scroll direction, snaps back
        transform: hov
          ? "translateY(-7px)"
          : `skewX(${Math.max(-3.5, Math.min(3.5, velSkew * -0.55))}deg)`,
        transition: "transform 0.30s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s, border-color 0.22s",
        willChange: "transform",
      }}>

      {/* Image area */}
      <div className="relative overflow-hidden bg-zinc-100/60" style={{ aspectRatio:"16/10" }}>
        <img
          src={project.image} alt={project.title}
          className="w-full h-full object-cover" loading="lazy" draggable={false}
          style={{
            transition:"transform 0.65s cubic-bezier(0.22,1,0.36,1)",
            transform: hov ? "scale(1.07)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.14) 100%)" }}/>
        {/* Tech icon + tag badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {project.techIcons.slice(0,2).map(key => (
            <span key={key}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background:"rgba(255,255,255,0.92)", backdropFilter:"blur(10px)",
                border:"1px solid rgba(255,255,255,0.80)",
                boxShadow:"0 2px 8px rgba(0,0,0,0.12)",
              }}>
              <img src={ICON_MAP[key]} alt={key} width={16} height={16} loading="lazy"
                style={{ objectFit:"contain", filter:key==="nextjs"?"invert(1)":"none" }}/>
            </span>
          ))}
          {project.tags.map(tag => (
            <span key={tag}
              className="font-robert text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{
                background:"rgba(255,255,255,0.88)", backdropFilter:"blur(10px)",
                color:"#4338CA", border:"1px solid rgba(99,102,241,0.22)",
              }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-neulis font-black text-[16px] leading-snug tracking-tight"
            style={{ color:T.ink }}>
            {project.title}
          </h3>
          <span className="font-robert text-[10px] font-bold tracking-[0.14em] uppercase"
            style={{ color:T.accent }}>
            {project.subtitle}
          </span>
        </div>
        <p className="font-robert text-[11.5px] leading-relaxed flex-1" style={{ color:T.sub }}>
          {project.description}
        </p>
        <div className="flex gap-2 mt-auto pt-2">
          <a href={project.deployedUrl} target="_blank" rel="noopener noreferrer" draggable={false}
            className={cn(
              buttonVariants({ variant:"default", size:"sm" }),
              "flex-1 h-9 rounded-xl text-[11px] font-bold font-robert bg-zinc-900 hover:bg-zinc-800 text-white",
              "shadow-[0_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0_2px_0_rgba(0,0,0,0.22)] active:translate-y-[2px]",
              "transition-all duration-150 group/btn"
            )}>
            <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover/btn:rotate-12 transition-transform duration-200"/>
            <span>Live Demo</span>
          </a>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" draggable={false}
            className={cn(
              buttonVariants({ variant:"outline", size:"sm" }),
              "flex-1 h-9 rounded-xl text-[11px] font-bold font-robert",
              "border-zinc-200 bg-white/80 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 text-zinc-700",
              "transition-all duration-200 group/btn"
            )}>
            <Github className="w-3 h-3 flex-shrink-0 group-hover/btn:scale-110 transition-transform duration-200"/>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── TRUE SEAMLESS INFINITE BELT ───────────────────────────────────────────────
//
// HOW THE SEAMLESS LOOP WORKS:
//   We render COPIES identical decks side by side.
//   On every RAF tick we apply modulo to BOTH pos and target to keep them
//   strictly in [-DECK, 0]. Because we clamp before lerp, the visual position
//   wraps instantaneously at the seam — but since both pos and target jump
//   together, lerp sees zero distance at the seam and there is NO visible jump.
//
//   This is fundamentally different from the old wrapPos() approach which
//   could leave pos and target on different sides of the seam, causing
//   a 1-frame stutter or spring-back.
//
//   Result: the belt scrolls forever. User can drag in any direction forever.
//   There is no "end", no reset, no reverse, no wait.
function CardBelt({ isExpanded }: { isExpanded: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);
  const [velSkew, setVelSkew] = useState(0);

  // All mutable scroll state lives in a single ref — no re-renders from scroll
  const S = useRef({
    pos:      0,
    target:   0,
    prev:     0,
    vel:      0,
    auto:     false,
    dragging: false,
    dragX:    0,
    dragBase: 0,
    paused:   false, // true while hovering (auto stops, drag still works)
  });

  const DECK = PROJECTS.length * CARD_STRIDE;

  // ── RAF tick — runs every frame while belt is visible ─────────────────────
  useEffect(() => {
    if (!isExpanded) return;

    // Short startup delay so the dealt-cascade cards are visible before belt moves
    const startDelay = PROJECTS.length * EXPAND_STAGGER * 1000 + 280;

    const timer = setTimeout(() => {
      S.current.auto = true;

      const tick = () => {
        const s = S.current;

        // Auto-advance when not paused/dragging
        if (s.auto && !s.dragging && !s.paused) {
          s.target -= AUTO_SPEED;
        }

        // ── SEAMLESS MODULO CLAMP ──────────────────────────────────────────
        // Both target AND pos are kept in [-DECK, 0] using the same modulo.
        // When target wraps, pos wraps by exactly the same amount on the
        // NEXT lerp step, so there is never a discontinuity in the visual.
        s.target = -mod(-s.target, DECK);
        s.pos    = -mod(-s.pos,    DECK);

        // Lerp pos toward target
        s.pos = lerp(s.pos, s.target, LERP_FACTOR);

        // Velocity for skew effect
        const v = s.pos - s.prev;
        s.prev = s.pos;
        s.vel  = lerp(s.vel, v, 0.18); // low-pass filter so skew is smooth

        // Apply transform
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${s.pos}px)`;
        }

        // Update React skew state only when meaningfully changed (avoid re-render spam)
        setVelSkew(prev => Math.abs(s.vel - prev) > 0.015 ? s.vel : prev);

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isExpanded, DECK]);

  // ── Wheel handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isExpanded) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      S.current.target -= e.deltaY * WHEEL_MULT;
    };
    el.addEventListener("wheel", onWheel, { passive:false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isExpanded]);

  // ── Pointer handlers ───────────────────────────────────────────────────────
  const onEnter = () => { S.current.paused = true; };
  const onLeave = () => { S.current.paused = false; S.current.dragging = false; };
  const onDown  = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement;
    if (el.tagName.toLowerCase() === "a" || el.closest("a,button")) return;
    S.current.dragging = true;
    S.current.dragX    = e.clientX;
    S.current.dragBase = S.current.target;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove  = (e: React.PointerEvent) => {
    if (!S.current.dragging) return;
    S.current.target = S.current.dragBase + (e.clientX - S.current.dragX);
  };
  const onUp    = () => { S.current.dragging = false; };

  return (
    <div style={{
      height: isExpanded ? 540 : 360,
      transition: "height 1s cubic-bezier(0.22,1,0.36,1)",
      position: "relative",
    }}>
      {/* Stack preview rises and blurs away as belt starts */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div key="stack"
            initial={{ opacity:1, scale:1, y:0, filter:"blur(0px)" }}
            exit={{ opacity:0, scale:0.90, y:-36, filter:"blur(8px)" }}
            transition={{ duration:0.70, ease:[0.22,1,0.36,1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex:30 }}>
            <StackPreview/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ cursor: isExpanded ? "grab" : "default" }}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        {/* Minimal 24px edge fades — just softens card corners at viewport edge */}
        <div className="absolute inset-y-0 left-0 z-20 pointer-events-none"
          style={{ width:24, background:`linear-gradient(to right, ${T.bg}, transparent)` }}/>
        <div className="absolute inset-y-0 right-0 z-20 pointer-events-none"
          style={{ width:24, background:`linear-gradient(to left, ${T.bg}, transparent)` }}/>

        {/* Track — contains COPIES × PROJECTS cards, starts at x=0 */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 flex items-start select-none"
          style={{
            gap: `${CARD_GAP}px`,
            paddingTop: 24, paddingBottom: 24,
            willChange: "transform",
          }}>
          {Array.from({ length: COPIES }, (_, ci) => (
            <div key={ci} className="flex flex-shrink-0" style={{ gap:`${CARD_GAP}px` }}>
              {PROJECTS.map((p, i) => (
                <ProjectCard
                  key={`${ci}-${p.id}`}
                  project={p}
                  // Only the first deck copy gets the staggered entrance
                  index={ci === 0 ? i : 999}
                  isExpanded={isExpanded}
                  velSkew={velSkew}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Background SVG — all decorative elements live here ───────────────────────
// This renders at zIndex:0 behind EVERYTHING. No device div floats on content.
function BackgroundLayer() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex:0 }}>

      {/* ── Radial glow orbs ──────────────────────────────────────────────── */}
      <div style={{
        position:"absolute", top:"-8%", left:"-6vw",
        width:"40vw", height:"40vw", borderRadius:"50%",
        background:"radial-gradient(circle at 62% 55%, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.03) 46%, transparent 70%)",
        filter:"blur(56px)",
      }}/>
      <div style={{
        position:"absolute", bottom:"-8%", right:"-5vw",
        width:"38vw", height:"38vw", borderRadius:"50%",
        background:"radial-gradient(circle at 40% 52%, rgba(139,92,246,0.10) 0%, transparent 68%)",
        filter:"blur(52px)",
      }}/>
      <div style={{
        position:"absolute", bottom:"10%", left:"6vw",
        width:"22vw", height:"22vw", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(26,31,46,0.06) 0%, transparent 65%)",
        filter:"blur(36px)",
      }}/>
      <div style={{
        position:"absolute", top:"10%", right:"8vw",
        width:"18vw", height:"18vw", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
        filter:"blur(28px)",
      }}/>

      {/* ── Top accent line ───────────────────────────────────────────────── */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg, transparent 8%, rgba(99,102,241,0.38) 28%, rgba(99,102,241,0.62) 50%, rgba(99,102,241,0.38) 72%, transparent 92%)",
      }}/>

      {/* ── Dot grid — side margins only ──────────────────────────────────── */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"radial-gradient(circle, rgba(26,31,46,0.13) 1px, transparent 1px)",
        backgroundSize:"28px 28px",
        WebkitMaskImage:[
          "radial-gradient(ellipse 20% 90% at 0%   50%, black 0%, transparent 70%)",
          "radial-gradient(ellipse 20% 90% at 100% 50%, black 0%, transparent 70%)",
        ].join(", "),
        maskImage:[
          "radial-gradient(ellipse 20% 90% at 0%   50%, black 0%, transparent 70%)",
          "radial-gradient(ellipse 20% 90% at 100% 50%, black 0%, transparent 70%)",
        ].join(", "),
        WebkitMaskComposite:"destination-over",
        maskComposite:"add",
      } as React.CSSProperties}/>


    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function DemoSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const eyebrowRef    = useRef<HTMLParagraphElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const paraRef       = useRef<HTMLParagraphElement>(null);
  const pillRef       = useRef<HTMLDivElement>(null);
  const ghostNumRef   = useRef<HTMLDivElement>(null);
  const ghostBraceRef = useRef<HTMLDivElement>(null);
  const [isExpanded,  setIsExpanded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Set initial hidden states ─────────────────────────────────────────
      if (eyebrowRef.current)  gsap.set(eyebrowRef.current,  { opacity:0, y:18, filter:"blur(5px)" });
      if (headingRef.current)  gsap.set(headingRef.current,  { opacity:0, y:42, skewX:-2.5 });
      if (paraRef.current)     gsap.set(paraRef.current,     { opacity:0, y:16, filter:"blur(3px)" });
      if (pillRef.current)     gsap.set(pillRef.current,     { opacity:0, y:20, scale:0.85 });

      // ── 3-Phase cascade via IntersectionObserver ──────────────────────────
      const observer = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const tl = gsap.timeline({ defaults:{ ease:"power3.out" } });

        // PHASE 1 — heading content
        tl.to(eyebrowRef.current!,  { opacity:1, y:0, filter:"blur(0px)", duration:0.60 }, 0);
        tl.to(headingRef.current!,  { opacity:1, y:0, skewX:0, duration:0.78, ease:"power4.out" }, 0.12);
        tl.to(paraRef.current!,     { opacity:1, y:0, filter:"blur(0px)", duration:0.60 }, 0.40);

        // PHASE 2 — pill badge bounces in (back.out gives satisfying overshoot)
        tl.to(pillRef.current!, {
          opacity:1, y:0, scale:1,
          duration:0.65, ease:"back.out(1.8)",
        }, 0.58);

        // PHASE 3 — cards dealt onto the table
        tl.call(() => setIsExpanded(true), [], 1.08);

      }, { threshold:0.06 });

      observer.observe(section);

      // ── YOYO bob on pill (sine.inOut, gentle float) ───────────────────────
      // Starts after the entrance animation settles (~1.5s)
      gsap.to(pillRef.current, {
        y: "+=8",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        duration: 2.2,
        delay: 1.5,
      });

      // ── Ghost numbers: parallax scrub at different rates ─────────────────
      // "03" drifts faster = appears closer to viewer
      // "{ }" drifts slower = appears further back
      if (ghostNumRef.current) {
        gsap.to(ghostNumRef.current, {
          yPercent: -30,
          ease: "none",
          scrollTrigger:{
            trigger: section,
            start: "top bottom", end: "bottom top",
            scrub: 2.0,
          },
        });
      }
      if (ghostBraceRef.current) {
        gsap.to(ghostBraceRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger:{
            trigger: section,
            start: "top bottom", end: "bottom top",
            scrub: 1.6,
          },
        });
      }

      return () => observer.disconnect();
    }, section);

    return () => { try { ctx.revert(); } catch (_) {} };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative w-full py-20 md:py-28"
      style={{ background:T.bg, isolation:"isolate" }}
    >

      {/* ════ BACKGROUND — glows, dot grid, device line-art (zIndex:0) ══════ */}
      <BackgroundLayer/>

      {/* ════ GHOST "03" — top-left, parallax target ══════════════════════════ */}
      <div ref={ghostNumRef}
        aria-hidden
        className="absolute font-neulis font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(72px,10vw,148px)",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(99,102,241,0.13)",
          top:"3%", left:"1.5vw",
          lineHeight:1, letterSpacing:"-0.04em",
          zIndex:1,
        }}>
        03
      </div>

      {/* ════ GHOST "{ }" — top-right, parallax target ════════════════════════ */}
      <div ref={ghostBraceRef}
        aria-hidden
        className="absolute font-neulis font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(56px,8vw,110px)",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(99,102,241,0.09)",
          top:"2%", right:"1.5vw",
          lineHeight:1, letterSpacing:"-0.02em",
          zIndex:1,
        }}>
        {"{ }"}
      </div>

      {/* ════ PROJECTS PILL — bottom-left, yoyo bob ══════════════════════════ */}
      <div ref={pillRef}
        aria-hidden
        className="absolute pointer-events-none"
        style={{ bottom:"10%", left:"3vw", zIndex:2, opacity:0 }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:7,
          background:"rgba(255,255,255,0.90)",
          backdropFilter:"blur(16px)",
          WebkitBackdropFilter:"blur(16px)",
          border:"1.5px solid rgba(99,102,241,0.18)",
          borderRadius:28,
          padding:"7px 14px",
          boxShadow:[
            "0 4px 20px rgba(99,102,241,0.14)",
            "0 1px 4px rgba(0,0,0,0.06)",
            "inset 0 1px 0 rgba(255,255,255,0.92)",
          ].join(", "),
        }}>
          <span style={{
            width:7, height:7, borderRadius:"50%",
            background:T.green,
            boxShadow:`0 0 7px ${T.green}80`,
            display:"inline-block", flexShrink:0,
          }}/>
          <span className="font-neulis font-black"
            style={{ fontSize:16, color:T.ink, lineHeight:1, letterSpacing:"-0.02em" }}>
            6+
          </span>
          <span className="font-robert"
            style={{ fontSize:10, fontWeight:600, color:T.muted, letterSpacing:".06em", textTransform:"uppercase" }}>
            Projects Built
          </span>
        </div>
      </div>

      {/* ════ HEADING ══════════════════════════════════════════════════════════ */}
      <div
        className="relative text-center mx-auto px-6 mb-10 md:mb-14"
        style={{ zIndex:3, maxWidth:"min(72vw, 860px)" }}>

        <p ref={eyebrowRef}
          className="font-robert text-xs font-bold uppercase tracking-[0.3em] mb-4"
          style={{ color:T.accent, opacity:0 }}>
          Project Packages
        </p>

        <h2 ref={headingRef}
          className="font-neulis font-black tracking-tight mb-4"
          style={{
            whiteSpace: "nowrap",
            fontSize: "clamp(1.9rem,5.5vw,4.2rem)",
            lineHeight: 1.06,
            color: T.ink,
            opacity: 0,
          }}>
          Impressive Projects
        </h2>

        <p ref={paraRef}
          className="font-robert text-base md:text-lg leading-relaxed font-medium"
          style={{ color:T.sub, opacity:0 }}>
          Choose a project tier that fits your needs.
        </p>
      </div>

      {/* ════ CARD BELT — seamless infinite loop ══════════════════════════════ */}
      <div className="relative w-full" style={{ zIndex:3 }}>
        <CardBelt isExpanded={isExpanded}/>
      </div>

      {/* ════ DRAG HINT ════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ delay:1.6, duration:1.0 }}
        className="flex items-center justify-center gap-2.5 mt-5"
        style={{ zIndex:3 }}>
        <span style={{ width:32, height:1, background:"rgba(99,102,241,0.28)", display:"inline-block" }}/>
        <p className="font-robert text-[11px] text-zinc-400 tracking-[0.22em] uppercase select-none">
          Drag to explore
        </p>
        <span style={{ width:32, height:1, background:"rgba(99,102,241,0.28)", display:"inline-block" }}/>
      </motion.div>

    </section>
  );
}