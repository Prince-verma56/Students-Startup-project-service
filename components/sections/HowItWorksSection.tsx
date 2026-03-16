"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import AnimatedTitle from "../AnimatedTitle"

// ── Word splitter ─────────────────────────────────────────────────────────────
function SplitWord({
    word,
    className = "",
    style = {},
}: {
    word: string
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <span className="inline-block overflow-hidden leading-none align-bottom">
            <span className={`word-inner inline-block ${className}`} style={style}>
                {word}
            </span>
        </span>
    )
}

// ── Particle dot ──────────────────────────────────────────────────────────────
function Particle({ style, className = "" }: { style: React.CSSProperties; className?: string }) {
    return <span className={`absolute rounded-full pointer-events-none ${className}`} style={style} />
}

// ── Orb background blob ───────────────────────────────────────────────────────
function Orb({
    size,
    top,
    left,
    right,
    bottom,
    color,
    blur,
    anim,
    opacity = 1,
}: {
    size: string
    top?: string
    left?: string
    right?: string
    bottom?: string
    color: string
    blur: number
    anim: string
    opacity?: number
}) {
    return (
        <div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                top,
                left,
                right,
                bottom,
                background: `radial-gradient(circle, ${color} 30%, transparent 70%)`,
                filter: `blur(${blur}px)`,
                opacity,
                animation: anim,
                willChange: "transform",
            }}
        />
    )
}

// ── Arrow connector shown in gap between scenes ───────────────────────────────
function ProgressArrow({ label }: { label: string }) {
    return (
        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4 px-8 select-none">
            {/* Dashed line */}
            <div className="flex items-center gap-3">
                <div
                    className="w-24 border-t-2 border-dashed border-indigo-200"
                    style={{ borderSpacing: "8px" }}
                />
                {/* Arrow head */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M4 10h12M11 4l6 6-6 6"
                        stroke="#818cf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-300 uppercase font-robert whitespace-nowrap">
                {label}
            </span>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const trackRef   = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const section = sectionRef.current
        const track   = trackRef.current
        if (!section || !track) return

        const mm = gsap.matchMedia()

        mm.add("(max-width: 767px)", () => {
            gsap.utils.toArray<HTMLElement>(".scene-mobile").forEach((el) => {
                gsap.from(el, {
                    opacity: 0,
                    y: 60,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            })
        })

        mm.add("(min-width: 768px)", () => {
            const totalScroll = track.scrollWidth - window.innerWidth

            const hTween = gsap.to(track, {
                x: -totalScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${totalScroll}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                },
            })

            // BG colour shift
            gsap.to(section, {
                backgroundColor: "#eef2ff",
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${totalScroll * 0.7}`,
                    scrub: 1,
                },
            })
            gsap.to(section, {
                backgroundColor: "#ffffff",
                ease: "none",
                scrollTrigger: {
                    trigger: ".scene-4",
                    containerAnimation: hTween,
                    start: "left 60%",
                    end: "left 10%",
                    scrub: 1,
                },
            })

            // Word animate helper
            function animateWords(selector: string) {
                const words = gsap.utils.toArray<HTMLElement>(selector)
                if (!words.length) return
                gsap.from(words, {
                    opacity: 0,
                    y: 70,
                    filter: "blur(8px)",
                    ease: "power3.out",
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: words[0].closest(".scene") as HTMLElement,
                        containerAnimation: hTween,
                        start: "left 85%",
                        end: "left 30%",
                        scrub: 0.5,
                    },
                })
            }

            animateWords(".s1-words .word-inner")
            gsap.from(".s1-para", {
                opacity: 0, y: 24,
                scrollTrigger: { trigger: ".scene-1", containerAnimation: hTween, start: "left 70%", end: "left 20%", scrub: 1 },
            })
            gsap.from(".svg-path", {
                strokeDashoffset: 320, ease: "power2.inOut",
                scrollTrigger: { trigger: ".scene-1", containerAnimation: hTween, start: "left 75%", end: "left 25%", scrub: 1 },
            })

            animateWords(".s2-words .word-inner")
            gsap.from(".tech-badge", {
                opacity: 0, scale: 0.7, y: 20, stagger: 0.08, ease: "back.out(1.7)",
                scrollTrigger: { trigger: ".scene-2", containerAnimation: hTween, start: "left 70%", end: "left 20%", scrub: 1 },
            })
            gsap.from(".mockup-card", {
                x: 80, opacity: 0, scale: 0.9,
                scrollTrigger: { trigger: ".scene-2", containerAnimation: hTween, start: "left 75%", end: "left 25%", scrub: 1 },
            })

            // Progress arrows animate in
            gsap.utils.toArray<HTMLElement>(".progress-arrow").forEach((arrow) => {
                gsap.from(arrow, {
                    opacity: 0, x: -20,
                    scrollTrigger: {
                        trigger: arrow,
                        containerAnimation: hTween,
                        start: "left 90%",
                        end: "left 50%",
                        scrub: 1,
                    },
                })
            })

            gsap.from(".s3-heading", {
                opacity: 0, filter: "blur(12px)",
                scrollTrigger: { trigger: ".scene-3", containerAnimation: hTween, start: "left 80%", end: "left 35%", scrub: 1 },
            })
            gsap.utils.toArray<HTMLElement>(".check-item").forEach((item, i) => {
                gsap.from(item, {
                    opacity: 0, x: -30,
                    scrollTrigger: {
                        trigger: ".scene-3", containerAnimation: hTween,
                        start: `left ${75 - i * 5}%`, end: `left ${30 - i * 5}%`, scrub: 1,
                    },
                })
            })

            gsap.from(".delivered-text", {
                opacity: 0, scale: 0.82,
                scrollTrigger: { trigger: ".scene-4", containerAnimation: hTween, start: "left 85%", end: "left 30%", scrub: 1 },
            })
            gsap.from(".cta-btn", {
                scale: 0.75, opacity: 0, ease: "elastic.out(1,0.5)",
                scrollTrigger: { trigger: ".scene-4", containerAnimation: hTween, start: "left 60%", end: "left 20%", scrub: 1 },
            })
            gsap.utils.toArray<HTMLElement>(".particle").forEach((p, i) => {
                gsap.from(p, {
                    scale: 0, opacity: 0, y: 40,
                    scrollTrigger: {
                        trigger: ".scene-4", containerAnimation: hTween,
                        start: `left ${58 - i * 3}%`, end: `left ${20 - i * 2}%`, scrub: 1,
                    },
                })
            })
        })

        return () => mm.revert()
    }, { scope: sectionRef })

    const particles = [
        { w: 10, h: 10, top: "18%", left: "12%", bg: "#6366f1" },
        { w: 7,  h: 7,  top: "70%", left: "20%", bg: "#f59e0b" },
        { w: 12, h: 12, top: "30%", left: "55%", bg: "#10b981" },
        { w: 8,  h: 8,  top: "75%", left: "62%", bg: "#f43f5e" },
        { w: 6,  h: 6,  top: "20%", left: "75%", bg: "#6366f1" },
        { w: 9,  h: 9,  top: "60%", left: "80%", bg: "#f59e0b" },
        { w: 7,  h: 7,  top: "45%", left: "38%", bg: "#10b981" },
        { w: 11, h: 11, top: "82%", left: "45%", bg: "#6366f1" },
    ]

    return (
        <section
            ref={sectionRef}
            id="how_it_works"
            className="relative w-full overflow-hidden bg-white"
            style={{ willChange: "background-color" }}
        >
            {/* ── Global background orbs — always visible, very low opacity ──── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <Orb size="55vw" top="-15%" left="-10%"   color="rgba(99,102,241,0.12)"  blur={90}  anim="orbA 16s ease-in-out infinite" />
                <Orb size="45vw" bottom="-12%" right="-8%" color="rgba(139,92,246,0.09)"  blur={80}  anim="orbB 20s ease-in-out infinite" />
                <Orb size="35vw" top="25%"  left="38%"    color="rgba(56,189,248,0.07)"  blur={100} anim="orbC 24s ease-in-out infinite" />
                <Orb size="30vw" top="-5%"  right="8%"    color="rgba(244,114,182,0.06)" blur={75}  anim="orbD 18s ease-in-out infinite" />
                <Orb size="25vw" bottom="5%" left="20%"   color="rgba(16,185,129,0.06)"  blur={85}  anim="orbE 22s ease-in-out infinite" />
            </div>

            {/* ── Keyframes ─────────────────────────────────────────────────────── */}
            <style>{`
                @keyframes orbA {
                    0%,100% { transform:translate(0,0) scale(1); }
                    33%     { transform:translate(28px,-20px) scale(1.07); }
                    66%     { transform:translate(-16px,14px) scale(0.95); }
                }
                @keyframes orbB {
                    0%,100% { transform:translate(0,0) scale(1); }
                    40%     { transform:translate(-22px,24px) scale(1.09); }
                    70%     { transform:translate(18px,-12px) scale(0.93); }
                }
                @keyframes orbC {
                    0%,100% { transform:translate(0,0) scale(1); }
                    25%     { transform:translate(20px,18px) scale(1.06); }
                    75%     { transform:translate(-24px,-9px) scale(0.96); }
                }
                @keyframes orbD {
                    0%,100% { transform:translate(0,0) scale(1); }
                    50%     { transform:translate(-20px,22px) scale(1.08); }
                }
                @keyframes orbE {
                    0%,100% { transform:translate(0,0) scale(1); }
                    45%     { transform:translate(16px,-14px) scale(1.05); }
                    80%     { transform:translate(-10px,10px) scale(0.97); }
                }
            `}</style>

            {/* ── MOBILE layout ─────────────────────────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-24 py-20 px-6 relative z-10">
                <AnimatedTitle
                    title="How it <b>Works</b>"
                    containerClass="text-8xl font-black text-zinc-900 leading-tight mb-8"
                />
                {[
                    { step: "STEP 01", title: "Tell me what\nyou need",   desc: "Share your idea, assignment brief, or project goal. No tech jargon needed — just tell me what you want to build." },
                    { step: "STEP 02", title: "I build it\nfor you",       desc: "I pick the right stack, write clean code, and build your project with modern tools and real-world patterns." },
                    { step: "STEP 03", title: "You review\n& approve",     desc: "You get a live preview link. Check every detail, request changes, and sign off when it's perfect." },
                    { step: "STEP 04", title: "Delivered.\nDone.",          desc: "Source code, deployment, documentation — everything handed over clean and ready to submit or showcase." },
                ].map((s) => (
                    <div key={s.step} className="scene-mobile flex flex-col gap-4">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">{s.step}</span>
                        <h2 className="text-4xl font-black text-zinc-900 leading-tight whitespace-pre-line font-neulis">{s.title}</h2>
                        <p className="text-zinc-500 text-base leading-relaxed font-robert">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* ── DESKTOP heading overlay ───────────────────────────────────────── */}
            <div className="hidden md:block absolute top-10 left-0 right-0 z-50 pointer-events-none">
                <AnimatedTitle
                    title="How it <b>Works</b>"
                    containerClass="text-center text-4xl lg:text-7xl underline font-black text-zinc-900 leading-none tracking-tight font-neulis uppercase mt-10"
                />
            </div>

            {/* ── DESKTOP horizontal track ──────────────────────────────────────── */}
            {/*
                Width breakdown: 4 scenes (each 100vw) + 3 transition gaps (each ~18vw)
                Total ≈ 454vw so nothing bleeds and gaps are filled with connector elements
            */}
            <div
                ref={trackRef}
                className="hidden md:flex h-screen items-center relative z-10"
                style={{ width: "460vw", willChange: "transform" }}
            >

                {/* ══ SCENE 1 — Tell me what you need ══════════════════════════════ */}
                <div className="scene scene-1 flex-shrink-0 w-screen h-screen flex items-center px-[8vw] gap-16">
                    <div className="flex flex-col gap-6 max-w-[52vw]">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 01</span>
                        <div className="s1-words flex flex-wrap items-end gap-x-4 gap-y-1 leading-none">
                            <SplitWord word="Tell"  style={{ fontSize:"clamp(3.5rem,8vw,8rem)",   fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="me"    style={{ fontSize:"clamp(1.5rem,3vw,3rem)",   fontWeight:700, color:"#6366f1", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="what"  style={{ fontSize:"clamp(3rem,6.5vw,7rem)",   fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="you"   style={{ fontSize:"clamp(1.2rem,2.5vw,2.5rem)", fontWeight:700, color:"#a1a1aa", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="need." style={{ fontSize:"clamp(3.5rem,7.5vw,8rem)", fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
                        </div>
                        <p className="s1-para text-zinc-500 text-lg leading-relaxed max-w-md font-robert">
                            Share your idea, assignment brief, or project goal. No tech jargon needed — just tell me what you want to build.
                        </p>
                    </div>
                    <div className="flex-shrink-0 opacity-80">
                        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                            <circle cx="80" cy="80" r="60" stroke="#e4e4e7" strokeWidth="2" />
                            <path className="svg-path" d="M 40 80 Q 60 40 80 80 Q 100 120 120 80"
                                stroke="#6366f1" strokeWidth="3" strokeLinecap="round" fill="none"
                                strokeDasharray="320" strokeDashoffset="0" />
                            <circle cx="80" cy="80" r="6" fill="#6366f1" />
                        </svg>
                    </div>
                </div>

                {/* ── Gap 1→2: animated step counter + progress line ─────────────── */}
                <div className="progress-arrow flex-shrink-0 flex flex-col items-center justify-center gap-6 px-10"
                    style={{ width: "18vw" }}>
                    {/* Large step number */}
                    <span className="font-neulis font-black text-[6rem] leading-none text-indigo-100 select-none"
                        style={{ WebkitTextStroke: "2px #c7d2fe" }}>
                        02
                    </span>
                    {/* Animated arrow line */}
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-indigo-300 to-indigo-400" />
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9h12M10 4l5 5-5 5" stroke="#818cf8" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-[9px] font-bold tracking-[0.25em] text-indigo-300 uppercase font-robert">next up</span>
                </div>

                {/* ══ SCENE 2 — I build it for you ══════════════════════════════════ */}
                <div className="scene scene-2 flex-shrink-0 w-screen h-screen flex items-center px-[8vw] gap-12">
                    <div className="flex flex-col gap-6 max-w-[50vw]">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 02</span>
                        <div className="s2-words flex flex-wrap items-end gap-x-3 gap-y-1 leading-none">
                            <SplitWord word="I"      style={{ fontSize:"clamp(1.5rem,3vw,3rem)",    fontWeight:700, color:"#a1a1aa", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="Build"  style={{ fontSize:"clamp(3.5rem,8vw,8.5rem)",  fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="it"     style={{ fontSize:"clamp(1.5rem,2.8vw,3rem)",  fontWeight:700, color:"#6366f1", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="for"    style={{ fontSize:"clamp(1.2rem,2.2vw,2.2rem)", fontWeight:600, color:"#a1a1aa", fontFamily:"var(--font-neulis)" }} />
                            <SplitWord word="you."   style={{ fontSize:"clamp(3rem,7vw,7.5rem)",    fontWeight:900, color:"#18181b", fontFamily:"var(--font-neulis)" }} />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {["Next.js","React","Node.js","Tailwind","MongoDB","Prisma"].map((t) => (
                                <span key={t} className="tech-badge text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-robert">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mockup-card flex-shrink-0 w-64 rounded-3xl overflow-hidden border border-white/90 font-robert"
                        style={{
                            background:"linear-gradient(150deg,rgba(255,255,255,0.92) 0%,rgba(238,242,255,0.85) 100%)",
                            backdropFilter:"blur(20px)",
                            boxShadow:"0 2px 0 1px rgba(0,0,0,0.03),0 12px 32px rgba(99,102,241,0.12),0 28px 56px rgba(0,0,0,0.08)",
                        }}>
                        <div className="h-36 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                            <span className="text-4xl">⚡</span>
                        </div>
                        <div className="p-4 flex flex-col gap-1.5">
                            <div className="h-3 rounded-full bg-zinc-200 w-3/4" />
                            <div className="h-2.5 rounded-full bg-zinc-100 w-1/2" />
                            <div className="h-2.5 rounded-full bg-zinc-100 w-2/3 mt-1" />
                            <div className="mt-3 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold tracking-wider">VIEW PROJECT</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Gap 2→3: floating stat cards ──────────────────────────────────── */}
                <div className="progress-arrow flex-shrink-0 flex flex-col items-center justify-center gap-5 px-8"
                    style={{ width: "18vw" }}>
                    <span className="font-neulis font-black text-[6rem] leading-none text-indigo-100 select-none"
                        style={{ WebkitTextStroke: "2px #c7d2fe" }}>
                        03
                    </span>
                    {/* Mini stat pill */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="rounded-2xl px-4 py-2.5 text-center"
                            style={{
                                background:"linear-gradient(135deg,rgba(238,242,255,0.9) 0%,rgba(255,255,255,0.95) 100%)",
                                border:"1px solid rgba(199,210,254,0.5)",
                                boxShadow:"0 4px 16px rgba(99,102,241,0.08)",
                            }}>
                            <p className="text-[10px] text-indigo-400 font-robert font-bold tracking-wider uppercase mb-0.5">Avg. turnaround</p>
                            <p className="text-xl font-black text-zinc-900 font-neulis leading-none">48 hrs</p>
                        </div>
                        <div className="rounded-2xl px-4 py-2.5 text-center"
                            style={{
                                background:"linear-gradient(135deg,rgba(238,242,255,0.9) 0%,rgba(255,255,255,0.95) 100%)",
                                border:"1px solid rgba(199,210,254,0.5)",
                                boxShadow:"0 4px 16px rgba(99,102,241,0.08)",
                            }}>
                            <p className="text-[10px] text-indigo-400 font-robert font-bold tracking-wider uppercase mb-0.5">Revisions</p>
                            <p className="text-xl font-black text-zinc-900 font-neulis leading-none">Unlimited</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-indigo-300 to-indigo-400" />
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9h12M10 4l5 5-5 5" stroke="#818cf8" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* ══ SCENE 3 — You review & approve ════════════════════════════════ */}
                <div className="scene scene-3 flex-shrink-0 w-screen h-screen flex items-center px-[8vw] gap-16">
                    <div className="flex flex-col gap-8 max-w-[55vw]">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-500 font-robert uppercase">Step 03</span>
                        <h2 className="s3-heading font-neulis font-black text-zinc-900 leading-[1.0] tracking-tight"
                            style={{ fontSize:"clamp(3.5rem,7.5vw,8rem)" }}>
                            You review<br />
                            <span className="text-indigo-500">&amp;</span> approve.
                        </h2>
                        <div className="flex flex-col gap-3">
                            {[
                                "Live preview link shared instantly",
                                "Request unlimited revisions",
                                "Changes made within 24 hours",
                                "Sign off when it's perfect",
                            ].map((item, i) => (
                                <div key={i} className="check-item flex items-center gap-3">
                                    <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <span className="text-zinc-600 text-base font-robert">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Gap 3→4: final step badge ─────────────────────────────────────── */}
                <div className="progress-arrow flex-shrink-0 flex flex-col items-center justify-center gap-5 px-8"
                    style={{ width: "18vw" }}>
                    <span className="font-neulis font-black text-[6rem] leading-none text-indigo-100 select-none"
                        style={{ WebkitTextStroke: "2px #c7d2fe" }}>
                        04
                    </span>
                    {/* "Almost there" badge */}
                    <div className="rounded-2xl px-5 py-3 text-center"
                        style={{
                            background:"linear-gradient(135deg,rgba(238,242,255,0.9) 0%,rgba(255,255,255,0.95) 100%)",
                            border:"1px solid rgba(199,210,254,0.5)",
                            boxShadow:"0 4px 16px rgba(99,102,241,0.08)",
                        }}>
                        <p className="text-[10px] text-indigo-400 font-robert font-bold tracking-wider uppercase mb-1">Final step</p>
                        <p className="text-base font-black text-zinc-900 font-neulis leading-snug">
                            Almost<br />there 🎉
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-indigo-300 to-indigo-400" />
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9h12M10 4l5 5-5 5" stroke="#818cf8" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* ══ SCENE 4 — Delivered. Done. ════════════════════════════════════ */}
                <div className="scene scene-4 flex-shrink-0 w-screen h-screen flex items-center px-[8vw] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        {particles.map((p, i) => (
                            <Particle key={i} className="particle"
                                style={{ width:p.w, height:p.h, top:p.top, left:p.left, backgroundColor:p.bg, opacity:0.7 }} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-8 z-10">
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
                            Source code, deployment, documentation — everything handed over clean and ready.
                        </p>
                        <button
                            className="cta-btn self-start font-robert font-bold text-sm px-8 py-4 rounded-2xl bg-zinc-900 text-white tracking-wide hover:bg-indigo-600 transition-colors duration-300"
                            style={{ boxShadow:"0 4px 0 #3730a3, 0 8px 24px rgba(99,102,241,0.25)" }}
                            onClick={() => document.getElementById("req_a_project")?.scrollIntoView({ behavior:"smooth" })}
                        >
                            Request a Project →
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}