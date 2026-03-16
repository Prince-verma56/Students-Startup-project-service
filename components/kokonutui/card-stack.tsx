"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ── Config ────────────────────────────────────────────────────────────────────
const CARD_W         = 300    // card width px
const CARD_GAP       = 80     // gap between cards px
const CARD_STRIDE    = CARD_W + CARD_GAP  // total slot width per card
const AUTO_PX        = 0.55   // auto-scroll px per frame
const EASE           = 0.072  // lerp smoothness (lower = silkier)
const WHEEL_SENS     = 0.5    // wheel scroll sensitivity
const EXPAND_STAGGER = 0.09   // seconds between cards fanning out
const EXPAND_DELAY   = 500    // ms after viewport entry

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ── Data ──────────────────────────────────────────────────────────────────────

interface Project {
  id: string
  title: string
  subtitle: string
  image: string
  deployedUrl: string
  githubUrl: string
  description: string
  tags: string[]
}

const projects: Project[] = [
  {
    id: "p1", title: "Portfolio Site", subtitle: "Next.js + Tailwind",
    image: "https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    deployedUrl: "https://yoursite.com", githubUrl: "https://github.com/you/project",
    description: "Personal portfolio with 3D models, GSAP animations, and a fully responsive layout.",
    tags: ["Next.js", "Three.js"],
  },
  {
    id: "p2", title: "E-Commerce UI", subtitle: "React + Framer Motion",
    image: "https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    deployedUrl: "https://yoursite.com", githubUrl: "https://github.com/you/project",
    description: "Full product listing UI with cart, filters, and smooth page transitions.",
    tags: ["React", "Stripe"],
  },
  {
    id: "p3", title: "Auth Dashboard", subtitle: "Next.js + Prisma",
    image: "https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    deployedUrl: "https://yoursite.com", githubUrl: "https://github.com/you/project",
    description: "Full-stack dashboard with NextAuth, role-based access, and Prisma + Postgres.",
    tags: ["NextAuth", "Prisma"],
  },
  {
    id: "p4", title: "Real-time Chat", subtitle: "Socket.io + MongoDB",
    image: "https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    deployedUrl: "https://yoursite.com", githubUrl: "https://github.com/you/project",
    description: "Live messaging with rooms, presence indicators, and persistent message history.",
    tags: ["Socket.io", "Redis"],
  },
  {
    id: "p5", title: "Task Manager", subtitle: "React + Node",
    image: "https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center",
    deployedUrl: "https://yoursite.com", githubUrl: "https://github.com/you/project",
    description: "Kanban-style task manager with drag-and-drop, labels, and team collaboration.",
    tags: ["DnD", "Express"],
  },
  {
    id: "p6", title: "Weather App", subtitle: "React + OpenWeather",
    image: "https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center",
    deployedUrl: "https://yoursite.com", githubUrl: "https://github.com/you/project",
    description: "Location-based weather dashboard with 7-day forecast and animated icons.",
    tags: ["API", "Recharts"],
  },
]

// ── Stack preview (4 blank cards fanned) ─────────────────────────────────────
function StackPreview() {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 320 }}>
      {[3, 2, 1, 0].map((i) => (
        <div
          key={i}
          className="absolute rounded-[24px] border border-white/90"
          style={{
            width: CARD_W,
            height: 290,
            background: "linear-gradient(150deg,rgba(255,255,255,0.93) 0%,rgba(242,242,255,0.82) 100%)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 2px 0 1px rgba(0,0,0,0.03),0 8px 24px rgba(0,0,0,0.08),0 20px 40px rgba(0,0,0,0.05)",
            transform: `translateX(${i * 8}px) translateY(${i * -6}px) rotate(${(i - 1.5) * 2.5}deg)`,
            zIndex: 4 - i,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  )
}

// ── Single card ───────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  isExpanded,
  skew,
}: {
  project: Project
  index: number
  isExpanded: boolean
  skew: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.86 }}
      animate={isExpanded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.86 }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 22,
        mass: 1.05,
        delay: isExpanded ? index * EXPAND_STAGGER : 0,
        opacity: { duration: 0.4, ease: "easeOut", delay: isExpanded ? index * EXPAND_STAGGER : 0 },
      }}
      className="flex-shrink-0 flex flex-col rounded-[24px] overflow-hidden border border-white/90"
      style={{
        width: CARD_W,
        background: "linear-gradient(150deg,rgba(255,255,255,0.93) 0%,rgba(242,242,255,0.82) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 2px 0 1px rgba(0,0,0,0.03),0 8px 24px rgba(0,0,0,0.08),0 20px 40px rgba(0,0,0,0.05)",
        // Speed-based skew — cards lean with scroll direction
        transform: `skewX(${Math.max(-5, Math.min(5, skew * -0.7))}deg)`,
        transition: "transform 0.25s ease, box-shadow 0.4s ease",
        willChange: "transform",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-100/60" style={{ aspectRatio: "16/10" }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.6s ease" }}
          loading="lazy"
          draggable={false}
          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/8 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border-0 font-semibold tracking-wide"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-black text-[16px] text-zinc-900 leading-snug tracking-tight font-neulis">
            {project.title}
          </h3>
          <span className="text-[10px] font-bold text-indigo-500 tracking-[0.12em] uppercase font-neulis">
            {project.subtitle}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-zinc-500 leading-relaxed flex-1 font-neulis">
          {project.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-1.5">
          {/* Live Demo — Next.js Link for internal, regular anchor for external */}
          <a
            href={project.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "flex-1 h-9 rounded-xl text-[11px] font-bold font-neulis bg-zinc-900 hover:bg-zinc-700 text-white shadow-[0_4px_16px_rgba(0,0,0,0.20)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.30)] transition-all duration-200 group/btn"
            )}
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover/btn:rotate-12 transition-transform duration-200" />
            <span>Live Demo</span>
          </a>

          {/* GitHub */}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex-1 h-9 rounded-xl text-[11px] font-bold font-neulis border-zinc-200 bg-white/80 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 text-zinc-800 transition-all duration-200 group/btn"
            )}
          >
            <Github className="w-3 h-3 flex-shrink-0 group-hover/btn:scale-110 transition-transform duration-200" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CardStackExample({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [skew, setSkew] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number | null>(null)

  // All scroll state in a single ref — zero re-renders in the RAF loop
  const S = useRef({
    pos:      0,      // current rendered position (lerped)
    target:   0,      // where we are heading
    prev:     0,      // previous frame pos (for speed/skew)
    auto:     false,  // is auto-belt running
    dragging: false,
    dragX:    0,
    dragBase: 0,
    hasDragged: false,
  })

  const inView    = useInView(containerRef, { once: true, margin: "-8%" })
  const DECK      = projects.length * CARD_STRIDE   // one full deck width

  // Seamless wrap: keep pos in [-DECK, 0)
  // Key insight: we ONLY wrap pos; target follows by the same delta
  // This means lerp never sees a jump — it always chases smoothly
  function wrapPos(delta: number = 0) {
    const s = S.current
    s.pos    += delta
    s.target += delta
    s.prev   += delta
  }

  // Write transform directly to DOM — never touches React state
  function paint(x: number) {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${x}px)`
    }
  }

  // ── Expand on viewport entry ──────────────────────────────────────────────
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setIsExpanded(true), EXPAND_DELAY)
    return () => clearTimeout(t)
  }, [inView])

  // ── RAF loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isExpanded) return

    // Wait for spring settle before belt starts
    const beltDelay = projects.length * EXPAND_STAGGER * 1000 + 700

    const timer = setTimeout(() => {
      S.current.auto = true

      const tick = () => {
        const s = S.current

        // Auto-advance
        if (s.auto && !s.dragging) {
          s.target -= AUTO_PX
        }

        // Lerp pos toward target — this is the smoothness magic
        s.pos = lerp(s.pos, s.target, EASE)

        // Seamless wrap — shift both pos AND target by +DECK when pos < -DECK
        // Because we shift both equally, lerp never sees a discontinuity
        if (s.pos < -DECK) wrapPos(DECK)
        if (s.pos > 0)     wrapPos(-DECK)

        // Speed delta for skew
        const spd = s.pos - s.prev
        s.prev = s.pos

        paint(s.pos)

        // Update skew state (throttled — only on meaningful change)
        setSkew((prev) => Math.abs(spd - prev) > 0.02 ? spd : prev)

        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, beltDelay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isExpanded, DECK]) // eslint-disable-line

  // ── Wheel ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || !isExpanded) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      S.current.target -= e.deltaY * WHEEL_SENS * 0.2
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [isExpanded])

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const onEnter = () => { S.current.auto = false }
  const onLeave = () => { S.current.dragging = false; S.current.auto = true }

  const onDown = (e: React.PointerEvent) => {
    // Only start drag on the track itself — not on buttons/links
    const tag = (e.target as HTMLElement).tagName.toLowerCase()
    if (tag === "a" || tag === "button" || (e.target as HTMLElement).closest("a,button")) return
    S.current.dragging  = true
    S.current.dragX     = e.clientX
    S.current.dragBase  = S.current.target
    S.current.hasDragged = false
  }

  const onMove = (e: React.PointerEvent) => {
    if (!S.current.dragging) return
    const delta = e.clientX - S.current.dragX
    // Only count as a real drag after 5px of movement
    if (Math.abs(delta) > 5) S.current.hasDragged = true
    S.current.target = S.current.dragBase + delta
  }

  const onUp = () => { S.current.dragging = false }

  // ── Track positioning ─────────────────────────────────────────────────────
  // We render 5 copies. Copy index 2 (middle) is the one visible on load.
  // left offset = place copy[2]'s first card at the horizontal centre of the container
  const COPIES    = 5
  const copies    = Array.from({ length: COPIES }, (_, i) => i)
  const midCopy   = Math.floor(COPIES / 2)   // = 2
  // left = 50% of container - (midCopy decks + half card) so copy[2][0] starts centred
  const trackLeft = `calc(50% - ${midCopy * DECK + CARD_W / 2}px)`

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden select-none", className)}
      style={{
        height: isExpanded ? 520 : 360,
        transition: "height 1s cubic-bezier(0.22,1,0.36,1)",
        cursor: "grab",
      }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
    >
      {/* Stack preview — fades out when cards expand */}
      <motion.div
        animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.9 : 1, y: isExpanded ? -12 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 30 }}
      >
        {!isExpanded && <StackPreview />}
      </motion.div>

      {/* Fade masks */}
      <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-white via-white/20 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-white via-white/20 to-transparent z-20 pointer-events-none" />

      {/* Scrolling belt */}
      <div
        ref={trackRef}
        className="absolute top-0 flex items-start"
        style={{
          left: trackLeft,
          gap: `${CARD_GAP}px`,
          paddingTop: 20,
          paddingBottom: 20,
          willChange: "transform",
        }}
      >
        {copies.map((copyIdx) => (
          <div
            key={copyIdx}
            className="flex flex-shrink-0"
            style={{ gap: `${CARD_GAP}px` }}
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={`${copyIdx}-${project.id}`}
                project={project}
                // Only stagger the centre copy — others appear instantly
                index={copyIdx === midCopy ? i : 999}
                isExpanded={isExpanded}
                skew={skew}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}