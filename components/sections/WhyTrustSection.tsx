"use client"

// ─────────────────────────────────────────────────────────────────────────────
// WhyTrustSection.tsx — Final Premium Edition
//
// ✅ Desktop grid: 28% | 1fr (model, full width) | 30% — balanced as original
// ✅ Glassmorphism: 4-tier card system throughout
// ✅ Fonts: var(--font-neulis) / var(--font-robert) from HeroSection
// ✅ Icons: 100% Lucide React — zero emojis anywhere
// ✅ Mobile: GSAP ScrollTrigger fade-up per card, proper gaps + responsiveness
// ✅ Phase transitions: single onUpdate, 600% scroll space (comfortable)
// ✅ Phase content: modern, premium components per phase
// ✅ 3D skeleton loader while GLTF loads
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic"
import { useEffect, useRef, useState, memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Zap, Clock, CheckCircle2, Code2, Rocket, BookOpen, MessageSquare,
    TrendingUp, Star, CalendarDays, ShieldCheck, GitBranch, RefreshCw,
    ArrowRight, Send, Layers, Globe, FileText, Users, Award, Repeat,
    GraduationCap, BadgeCheck, Flame, Package, PhoneCall, Mail,
    MessagesSquare, ChevronDown,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const ModelViewer = dynamic(() => import("../three/ModelViewer"), {
    ssr: false,
    loading: () => <ModelSkeleton />,
})
const StableModelViewer = memo(ModelViewer)

// ═══════════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════════
const FN = "var(--font-neulis)"
const FR = "var(--font-robert)"
const FC = '"JetBrains Mono","Fira Code","SF Mono",Consolas,monospace'

const C = {
    ink: "#0d1625", sub: "#3a4f6e", muted: "#7a93b8",
    accent: "#6366F1", green: "#059669", amber: "#c47a15",
    purple: "#7c3aed",
    bBlue: "rgba(99,102,241,0.10)", bGreen: "rgba(5,150,106,0.10)",
    bAmb: "rgba(196,122,21,0.10)", bPurp: "rgba(124,58,237,0.10)",
    pageBg: "#F2F5FE",
} as const

type CP = React.CSSProperties

// ── Glass levels ─────────────────────────────────────────────────────
const gCard = (r = 18): CP => ({
    background: "rgba(255,255,255,0.80)",
    backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255,255,255,0.95)", borderRadius: r,
    boxShadow: "0 4px 0 1px rgba(99,102,241,0.04),0 8px 32px rgba(60,80,200,0.08),0 20px 48px rgba(60,80,200,0.04),inset 0 1px 0 rgba(255,255,255,1)",
})
const gSub = (r = 13): CP => ({
    background: "rgba(255,255,255,0.70)",
    backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.88)", borderRadius: r,
    boxShadow: "0 2px 0 1px rgba(99,102,241,0.03),0 4px 18px rgba(60,80,200,0.07),inset 0 1px 0 rgba(255,255,255,0.95)",
})
const gTint = (color: string, r = 12): CP => ({
    background: `linear-gradient(135deg,rgba(255,255,255,0.90),${color}16)`,
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${color}26`, borderRadius: r,
    boxShadow: `0 2px 14px ${color}12,inset 0 1px 0 rgba(255,255,255,0.92)`,
})
const gDark = (r = 13): CP => ({
    background: "rgba(12,11,36,0.92)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(129,140,248,0.24)", borderRadius: r,
    boxShadow: "0 4px 0 2px rgba(0,0,0,0.20),0 14px 40px rgba(99,102,241,0.22),inset 0 1px 0 rgba(255,255,255,0.06)",
})

const IW = (bg: string, sm = false): CP => ({
    width: sm ? 28 : 36, height: sm ? 28 : 36,
    borderRadius: sm ? 9 : 11, background: bg, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
})
const PANEL: CP = { position: "absolute", inset: 0, overflow: "hidden", willChange: "transform,opacity" }

// ── Micro components ──────────────────────────────────────────────────
const Pill = ({ children, color = C.accent, bg = C.bBlue }: { children: React.ReactNode; color?: string; bg?: string }) => (
    <span style={{ fontFamily: FR, fontSize: 8, fontWeight: 700, letterSpacing: ".06em", color, background: bg, borderRadius: 20, padding: "3px 10px", border: `1px solid ${color}22`, flexShrink: 0, display: "inline-block" }}>{children}</span>
)
const EyeBrow = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontFamily: FR, fontSize: 9, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase" as const, color: C.accent, marginBottom: 4 }}>{children}</div>
)
const Heading = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontFamily: FN, fontWeight: 900, fontSize: "clamp(1.65rem,2.7vw,2.9rem)", color: C.ink, lineHeight: 1.05, letterSpacing: "-.03em" }}>{children}</div>
)
const Stars = () => (
    <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
        {[0, 1, 2, 3, 4].map(i => <Star key={i} size={9} fill="#FBBF24" strokeWidth={0} />)}
    </div>
)
const HDivider = () => <div style={{ height: 1, background: "rgba(99,102,241,0.08)", margin: "6px 0" }} />
const Lbl = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontFamily: FR, fontSize: 7.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: C.muted, marginBottom: 9 }}>{children}</div>
)

const TECH = [
    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", label: "Next.js", color: "#000" },
    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", label: "React", color: "#61DAFB" },
    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", label: "Node.js", color: "#339933" },
    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", label: "MongoDB", color: "#47A248" },
    { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", label: "Tailwind", color: "#06B6D4" },
]
const TechBadge = ({ icon, label, color }: { icon: string; label: string; color: string }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FR, fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: `${color}14`, color: color === "#000" ? C.ink : color, border: `1px solid ${color}22` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt={label} width={11} height={11} style={{ flexShrink: 0 }} loading="lazy" />
        {label}
    </span>
)

// ═══════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════
function ModelSkeleton() {
    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 28, zIndex: 5 }}>
            <style>{`
        @keyframes skP{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.72;transform:scale(1.02)}}
        @keyframes skS{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .sk{animation:skP 2s ease-in-out infinite}
        .sk-s{background:linear-gradient(90deg,rgba(129,140,248,0.10) 25%,rgba(129,140,248,0.26) 50%,rgba(129,140,248,0.10) 75%);background-size:200% 100%;animation:skS 2.2s linear infinite}
      `}</style>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div className="sk sk-s" style={{ width: 48, height: 48, borderRadius: "50%", border: "1.5px solid rgba(129,140,248,0.20)" }} />
                <div className="sk-s" style={{ width: 18, height: 10, borderRadius: 4, opacity: .45 }} />
                <div className="sk sk-s" style={{ width: 68, height: 80, borderRadius: "13px 13px 6px 6px", border: "1.5px solid rgba(129,140,248,0.16)" }} />
                <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                    {[0, 1].map(i => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div className="sk sk-s" style={{ width: 26, height: 52, borderRadius: "4px 4px 0 0", border: "1.5px solid rgba(99,102,241,0.14)", animationDelay: `${i * .2}s` }} />
                            <div className="sk-s" style={{ width: 30, height: 9, borderRadius: "2px 2px 5px 5px", opacity: .5 }} />
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 12, fontFamily: FR, fontSize: 9, color: "rgba(99,102,241,0.42)", letterSpacing: ".12em", textTransform: "uppercase" }}>Loading 3D…</div>
                <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(99,102,241,0.32)", animation: `skP 1.2s ease-in-out ${i * .18}s infinite` }} />)}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// STAT CHIP — MutationObserver count-up
// ═══════════════════════════════════════════════════════════════════
const StatChip = memo(function StatChip({ v, sx, label, Icon, tint, idx }: {
    v: number; sx: string; label: string; Icon: React.ElementType; tint: { bg: string; ic: string }; idx: number
}) {
    const valRef = useRef<HTMLSpanElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const counted = useRef(false)
    useEffect(() => {
        const el = wrapRef.current; if (!el) return
        const obs = new MutationObserver(() => {
            if (el.dataset.active === "1" && !counted.current) {
                counted.current = true
                gsap.fromTo(valRef.current!, { innerText: 0 }, {
                    innerText: v, duration: 1.4, delay: idx * .18, ease: "power2.out", snap: { innerText: 1 },
                    onUpdate() { if (valRef.current) valRef.current.innerText = Math.round(Number(valRef.current.innerText)) + sx },
                })
            }
        })
        obs.observe(el, { attributes: true, attributeFilter: ["data-active"] })
        return () => obs.disconnect()
    }, [v, sx, idx])
    return (
        <div ref={wrapRef} data-stat-chip style={{ ...gCard(16), padding: "13px 16px", display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ ...IW(tint.bg), borderRadius: 12, boxShadow: `0 2px 10px ${tint.ic}22,inset 0 1px 0 rgba(255,255,255,.65)` }}>
                <Icon size={16} style={{ color: tint.ic }} />
            </div>
            <div style={{ flex: 1 }}>
                <span ref={valRef} style={{ display: "block", fontFamily: FN, fontWeight: 900, fontSize: 24, color: C.ink, lineHeight: 1, letterSpacing: "-.025em" }}>{v}{sx}</span>
                <span style={{ display: "block", fontFamily: FR, fontWeight: 600, fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: ".11em", marginTop: 2 }}>{label}</span>
            </div>
            <div style={{ width: 2, height: 28, borderRadius: 1, background: `linear-gradient(to bottom,${tint.ic}55,${tint.ic}14)` }} />
        </div>
    )
})

// ═══════════════════════════════════════════════════════════════════
// PHASE 1 — "Built by Prince."
// ═══════════════════════════════════════════════════════════════════
function P1L() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", overflow: "hidden" }}>
            <EyeBrow>Why Trust Me</EyeBrow>
            <Heading>Built by<br /><span style={{ color: C.accent }}>Prince.</span></Heading>
            <p style={{ fontFamily: FR, fontSize: 11, color: C.sub, lineHeight: 1.65, paddingLeft: 10, borderLeft: "2.5px solid rgba(99,102,241,.30)" }}>
                CS student. Building real projects since 16 — the person classmates call at 2am when code breaks.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {TECH.map(t => <TechBadge key={t.label} {...t} />)}
            </div>
            {/* Terminal code block */}
            <div style={{ ...gDark(13), padding: "12px 14px", fontFamily: FC, fontSize: 9, lineHeight: 1.9 }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 8, alignItems: "center" }}>
                    {["#ff5f57", "#ffbd2e", "#28c840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: .8 }} />)}
                    <span style={{ fontFamily: FR, fontSize: 8, color: "rgba(255,255,255,.26)", marginLeft: 7 }}>philosophy.ts</span>
                </div>
                <div style={{ color: "rgba(129,140,248,.55)", fontSize: 8, marginBottom: 2 }}>// My coding philosophy</div>
                <div><span style={{ color: "#818cf8" }}>const </span><span style={{ color: "#e2e8f0" }}>trust</span><span style={{ color: "rgba(255,255,255,.3)" }}> = </span><span style={{ color: "#34d399" }}>true</span></div>
                <div><span style={{ color: "#818cf8" }}>const </span><span style={{ color: "#e2e8f0" }}>deadline</span><span style={{ color: "rgba(255,255,255,.3)" }}> = </span><span style={{ color: "#fca5a5" }}>&quot;always met&quot;</span></div>
                <div><span style={{ color: "#818cf8" }}>const </span><span style={{ color: "#e2e8f0" }}>docs</span><span style={{ color: "rgba(255,255,255,.3)" }}> = </span><span style={{ color: "#34d399" }}>included</span></div>
            </div>
            {/* Delivery rate */}
            <div style={{ ...gCard(15), padding: "12px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ ...IW(C.bBlue, true) }}><TrendingUp size={12} style={{ color: C.accent }} /></div>
                    <Lbl>Delivery Rate</Lbl>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontFamily: FN, fontSize: 28, fontWeight: 900, color: C.ink, lineHeight: 1, letterSpacing: "-.03em" }}>100%</div>
                        <div style={{ fontFamily: FR, fontSize: 8, color: C.muted, marginTop: 2 }}>on-time delivery ↑</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
                        {[35, 50, 64, 80, 91, 100].map((h, i) => (
                            <div key={i} style={{
                                width: 9, height: `${h}%`, borderRadius: "4px 4px 0 0",
                                background: i === 5 ? "linear-gradient(to top,#4f46e5,#818cf8)" : `rgba(99,102,241,${.12 + i * .11})`,
                                boxShadow: i === 5 ? "0 0 10px rgba(99,102,241,.45)" : "none"
                            }} />
                        ))}
                    </div>
                </div>
            </div>
            {/* Status badge */}
            <div style={{ ...gSub(13), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 0 3px rgba(52,211,153,.22),0 0 8px rgba(52,211,153,.55)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>Currently available</div>
                    <div style={{ fontFamily: FR, fontSize: 8, color: C.muted }}>Taking new projects · &lt;2hr reply</div>
                </div>
                <Pill color={C.green} bg={C.bGreen}>● Active</Pill>
            </div>
        </div>
    )
}

function P1R() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 9, height: "100%", overflow: "hidden" }}>
            <StatChip v={6} sx="+" label="Projects Delivered" Icon={Zap} tint={{ bg: C.bBlue, ic: C.accent }} idx={0} />
            <StatChip v={0} sx="" label="Missed Deadlines" Icon={CheckCircle2} tint={{ bg: C.bGreen, ic: C.green }} idx={1} />
            <StatChip v={48} sx="h" label="Avg. Delivery Time" Icon={Clock} tint={{ bg: C.bAmb, ic: C.amber }} idx={2} />
            <div style={{ ...gCard(16), padding: "13px 15px" }}>
                <Lbl>Every Project Includes</Lbl>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                        { l: "Source Code", v: "Always", c: C.accent, bg: C.bBlue, Icon: Code2 },
                        { l: "Deployed", v: "Vercel", c: C.green, bg: C.bGreen, Icon: Globe },
                        { l: "Docs", v: "Full", c: C.purple, bg: C.bPurp, Icon: FileText },
                        { l: "Revisions", v: "Free", c: C.amber, bg: C.bAmb, Icon: RefreshCw },
                    ].map(m => (
                        <div key={m.l} style={{ ...gTint(m.c, 12), padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                                <m.Icon size={10} style={{ color: m.c, opacity: .7 }} />
                                <div style={{ fontFamily: FR, fontSize: 7, color: m.c, textTransform: "uppercase", letterSpacing: ".10em", fontWeight: 700 }}>{m.l}</div>
                            </div>
                            <div style={{ fontFamily: FN, fontSize: 16, fontWeight: 900, color: m.c, lineHeight: 1 }}>{m.v}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ ...gCard(16), padding: "14px 16px" }}>
                <div style={{ fontFamily: FN, fontSize: 36, color: C.accent, opacity: .16, lineHeight: .6, marginBottom: 6 }}>&ldquo;</div>
                <p style={{ fontFamily: FR, fontSize: 11, color: C.sub, lineHeight: 1.7, fontStyle: "italic", marginBottom: 11 }}>
                    Got 9/10 for my final year project. Prince delivered in 3 days and explained every line.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#818cf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0, fontFamily: FN }}>A</div>
                    <div>
                        <p style={{ fontFamily: FR, fontWeight: 700, fontSize: 10.5, color: C.ink }}>Aryan S. <span style={{ color: C.muted, fontWeight: 400 }}>· Final Year CSE, SPPU</span></p>
                        <Stars />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 2 — "Real work, real results."
// ═══════════════════════════════════════════════════════════════════
function P2L() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", overflow: "hidden" }}>
            <EyeBrow>What I&apos;ve Built</EyeBrow>
            <Heading>Real work,<br /><span style={{ color: C.accent }}>real results.</span></Heading>
            {[
                { name: "Task Manager App", tags: ["Next.js", "MongoDB", "Vercel"], days: "3 days", grade: "9/10", pct: 100 },
                { name: "E-Commerce Dashboard", tags: ["React", "Node.js", "Prisma"], days: "48 hrs", grade: "8.5/10", pct: 100 },
            ].map(p => (
                <div key={p.name} style={{ ...gCard(15), padding: "12px 15px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ ...IW(C.bBlue, true) }}><Layers size={11} style={{ color: C.accent }} /></div>
                            <span style={{ fontFamily: FR, fontSize: 11, fontWeight: 700, color: C.ink }}>{p.name}</span>
                        </div>
                        <Pill color={C.green} bg={C.bGreen}>✓ Delivered</Pill>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 9 }}>
                        {p.tags.map(t => <span key={t} style={{ fontFamily: FR, fontSize: 8, fontWeight: 700, color: C.accent, background: C.bBlue, borderRadius: 6, padding: "2px 8px", border: "1px solid rgba(99,102,241,.14)" }}>{t}</span>)}
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "rgba(99,102,241,.09)", overflow: "hidden", marginBottom: 6 }}>
                        <div style={{ height: "100%", width: `${p.pct}%`, borderRadius: 3, background: "linear-gradient(90deg,#818cf8,#6366f1)", boxShadow: "0 0 6px rgba(99,102,241,.4)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: FR, fontSize: 8.5, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}><Clock size={9} style={{ color: C.muted }} />{p.days}</span>
                        <span style={{ fontFamily: FN, fontSize: 11, fontWeight: 900, color: C.green }}>{p.grade}</span>
                    </div>
                </div>
            ))}
            <div style={{ ...gCard(15), padding: "12px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
                    <div style={{ ...IW(C.bBlue, true) }}><TrendingUp size={11} style={{ color: C.accent }} /></div>
                    <Lbl>Stack Expertise</Lbl>
                </div>
                {[{ n: "React / Next.js", p: 90 }, { n: "Node.js / API", p: 82 }, { n: "MongoDB / DB", p: 78 }, { n: "Tailwind / UI", p: 88 }].map(s => (
                    <div key={s.n} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontFamily: FR, fontSize: 9, color: C.sub, fontWeight: 500 }}>{s.n}</span>
                            <span style={{ fontFamily: FR, fontSize: 9, color: C.accent, fontWeight: 800 }}>{s.p}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: "rgba(99,102,241,.09)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${s.p}%`, borderRadius: 3, background: "linear-gradient(90deg,#818cf8,#6366f1)" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function P2R() {
    const pat = [6, 2, 4, 1, 5, 3, 0, 4, 2, 6, 1, 3, 5, 0, 4, 2, 3, 6, 1, 5, 0, 3, 4, 2, 6, 1, 5, 3]
    const ops = [.06, .14, .28, .44, .64, .82, 1]
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 9, height: "100%", overflow: "hidden" }}>
            <StatChip v={6} sx="+" label="Projects Delivered" Icon={Zap} tint={{ bg: C.bBlue, ic: C.accent }} idx={0} />
            <StatChip v={0} sx="" label="Missed Deadlines" Icon={CheckCircle2} tint={{ bg: C.bGreen, ic: C.green }} idx={1} />
            <StatChip v={48} sx="h" label="Avg. Delivery Time" Icon={Clock} tint={{ bg: C.bAmb, ic: C.amber }} idx={2} />
            <div style={{ ...gSub(13), padding: "11px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                    <div style={{ ...IW(C.bBlue, true) }}><GitBranch size={11} style={{ color: C.accent }} /></div>
                    <Lbl>GitHub Activity</Lbl>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2.5 }}>
                    {pat.map((p, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: `rgba(99,102,241,${ops[p]})` }} />)}
                </div>
                <div style={{ fontFamily: FR, fontSize: 8, color: C.muted, marginTop: 6 }}>Last 28 days · 47 contributions</div>
            </div>
            {/* Live indicator */}
            <div style={{ ...gTint("#f87171", 13), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f87171", boxShadow: "0 0 0 3px rgba(248,113,113,.22),0 0 8px rgba(248,113,113,.55)", flexShrink: 0 }} />
                <div>
                    <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>2 projects active right now</div>
                    <div style={{ fontFamily: FR, fontSize: 8, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        <Flame size={8} style={{ color: "#f87171" }} /> Live · Updated today
                    </div>
                </div>
            </div>
            <div style={{ ...gCard(16), padding: "14px 16px" }}>
                <div style={{ fontFamily: FN, fontSize: 36, color: C.green, opacity: .16, lineHeight: .6, marginBottom: 6 }}>&ldquo;</div>
                <p style={{ fontFamily: FR, fontSize: 11, color: C.sub, lineHeight: 1.7, fontStyle: "italic", marginBottom: 11 }}>
                    Saved my semester. Full-stack app in 2 days — he even sat on a call and walked me through the code.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#34d399,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0, fontFamily: FN }}>P</div>
                    <div>
                        <p style={{ fontFamily: FR, fontWeight: 700, fontSize: 10.5, color: C.ink }}>Priya M. <span style={{ color: C.muted, fontWeight: 400 }}>· 3rd Year IT, VIT</span></p>
                        <Stars />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 3 — "Students come back."
// ═══════════════════════════════════════════════════════════════════
function P3L() {
    const rows = [
        { Icon: Code2, l: "Source code included", s: "Learn, modify, submit", t: "Always", c: C.accent, bg: C.bBlue },
        { Icon: Globe, l: "Deployed to Vercel", s: "Live URL ready", t: "Live", c: C.green, bg: C.bGreen },
        { Icon: BookOpen, l: "Full documentation", s: "README + explanation", t: "Full", c: C.purple, bg: C.bPurp },
        { Icon: MessageSquare, l: "Viva prep support", s: "I explain every line", t: "Free", c: C.amber, bg: C.bAmb },
    ]
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", overflow: "hidden" }}>
            <EyeBrow>Why Students Trust</EyeBrow>
            <Heading>Students<br /><span style={{ color: C.accent }}>come back.</span></Heading>
            <div style={{ ...gCard(16), padding: "13px 15px" }}>
                <Lbl>What&apos;s Always Included</Lbl>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {rows.map((g, i) => (
                        <div key={g.l}>
                            {i > 0 && <HDivider />}
                            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                <div style={{ ...IW(g.bg, true), boxShadow: `0 2px 6px ${g.c}18`, borderRadius: 10 }}>
                                    <g.Icon size={11} style={{ color: g.c }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>{g.l}</div>
                                    <div style={{ fontFamily: FR, fontSize: 8.5, color: C.muted }}>{g.s}</div>
                                </div>
                                <Pill color={g.c} bg={g.bg}>{g.t}</Pill>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ ...gSub(12), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ ...IW(C.bBlue, true) }}><Repeat size={11} style={{ color: C.accent }} /></div>
                <div>
                    <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>3 repeat clients this month</div>
                    <div style={{ fontFamily: FR, fontSize: 8, color: C.muted }}>Trusted again and again</div>
                </div>
            </div>
            <div style={{ ...gSub(12), padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <GraduationCap size={11} style={{ color: C.accent }} />
                    <Lbl>Students From</Lbl>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {["SPPU", "VIT", "SRM", "BITS", "KIIT", "+7 more"].map(c => (
                        <span key={c} style={{ fontFamily: FR, fontSize: 8.5, fontWeight: 700, color: C.accent, background: C.bBlue, borderRadius: 7, padding: "3px 9px", border: "1px solid rgba(99,102,241,.14)" }}>{c}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

function P3R() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 9, height: "100%", overflow: "hidden" }}>
            {[
                { q: "Got 9/10 for my final year project. Prince delivered in 3 days and explained every line. Helped me ace the viva too.", name: "Aryan S.", role: "Final Year CSE, SPPU", av: "A", g: "linear-gradient(135deg,#818cf8,#6366f1)" },
                { q: "Saved my semester. Full-stack app in 2 days — he even sat on a call and walked me through the code before the demo.", name: "Priya M.", role: "3rd Year IT, VIT", av: "P", g: "linear-gradient(135deg,#34d399,#059669)" },
            ].map(t => (
                <div key={t.name} style={{ ...gCard(16), padding: "14px 16px" }}>
                    <div style={{ fontFamily: FN, fontSize: 32, color: C.accent, opacity: .16, lineHeight: .6, marginBottom: 6 }}>&ldquo;</div>
                    <p style={{ fontFamily: FR, fontSize: 11, color: C.sub, lineHeight: 1.7, fontStyle: "italic", marginBottom: 11 }}>{t.q}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.g, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0, fontFamily: FN }}>{t.av}</div>
                        <div>
                            <p style={{ fontFamily: FR, fontWeight: 700, fontSize: 10.5, color: C.ink }}>{t.name} <span style={{ color: C.muted, fontWeight: 400 }}>· {t.role}</span></p>
                            <Stars />
                        </div>
                    </div>
                </div>
            ))}
            <div style={{ ...gSub(13), padding: "11px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                    <Award size={11} style={{ color: C.accent }} />
                    <Lbl>Grade Results</Lbl>
                </div>
                {[
                    { n: "Task Manager App", g: "9/10" },
                    { n: "E-Commerce Dashboard", g: "8.5/10" },
                    { n: "Student Portal", g: "A+" },
                ].map((r, i) => (
                    <div key={r.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < 2 ? 7 : 0 }}>
                        <span style={{ fontFamily: FR, fontSize: 9.5, color: C.sub }}>{r.n}</span>
                        <span style={{ fontFamily: FN, fontSize: 12, fontWeight: 900, color: C.green }}>{r.g}</span>
                    </div>
                ))}
            </div>
            <div style={{ ...gTint(C.amber, 14), padding: "11px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ ...IW(C.bAmb), boxShadow: `0 2px 8px ${C.amber}22` }}>
                    <Star size={16} style={{ color: C.amber }} />
                </div>
                <div>
                    <span style={{ fontFamily: FN, fontWeight: 900, fontSize: 24, color: C.ink, letterSpacing: "-.03em" }}>5.0★</span>
                    <div style={{ fontFamily: FR, fontWeight: 700, fontSize: 8, color: C.amber, textTransform: "uppercase", letterSpacing: ".10em", marginTop: 1 }}>Average Rating</div>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 4 — "Your deadline is my priority."
// ═══════════════════════════════════════════════════════════════════
function P4L() {
    const tl = [
        { day: "Day 1", t: "Scope + kickoff", s: "Requirements, stack, repo setup", c: "#6366f1" },
        { day: "Day 2–3", t: "Build + push", s: "Feature-complete, tested, GitHub", c: "#818cf8" },
        { day: "Day 4", t: "Review + revisions", s: "Your feedback, unlimited changes", c: "#a5b4fc" },
        { day: "Day 5", t: "Deploy + handover", s: "Live URL, docs, explanation call", c: "#c7d2fe" },
    ]
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", overflow: "hidden" }}>
            <EyeBrow>Let&apos;s Work Together</EyeBrow>
            <Heading>Your deadline<br /><span style={{ color: C.accent }}>is my priority.</span></Heading>
            <div style={{ ...gCard(16), padding: "13px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ ...IW(C.bBlue, true) }}><CalendarDays size={11} style={{ color: C.accent }} /></div>
                    <Lbl>Typical Timeline</Lbl>
                </div>
                {tl.map((step, i) => (
                    <div key={step.day} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 9, height: 9, borderRadius: "50%", background: step.c, boxShadow: `0 0 6px ${step.c}88`, flexShrink: 0, marginTop: 1 }} />
                            {i < tl.length - 1 && <div style={{ width: 1, height: 24, background: `linear-gradient(to bottom,${step.c}55,transparent)` }} />}
                        </div>
                        <div style={{ paddingBottom: i < tl.length - 1 ? 4 : 0 }}>
                            <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>{step.day} · {step.t}</div>
                            <div style={{ fontFamily: FR, fontSize: 8.5, color: C.muted }}>{step.s}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ ...gSub(13), padding: "11px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ ...IW(C.bGreen, true) }}><ShieldCheck size={11} style={{ color: C.green }} /></div>
                    <Lbl>Transparent Pricing</Lbl>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontFamily: FN, fontWeight: 900, fontSize: 26, color: C.ink, lineHeight: 1, letterSpacing: "-.03em" }}>₹500+</div>
                        <div style={{ fontFamily: FR, fontSize: 8.5, color: C.muted, marginTop: 2 }}>No hidden charges</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <Pill color={C.green} bg={C.bGreen}>No deposit</Pill>
                        <Pill color={C.accent} bg={C.bBlue}>Pay on delivery</Pill>
                    </div>
                </div>
            </div>
            <div style={{ ...gSub(13), padding: "11px 14px" }}>
                <Lbl>Reach Me On</Lbl>
                <div style={{ display: "flex", gap: 7 }}>
                    {[
                        { label: "Telegram", bg: "rgba(59,130,246,.10)", c: "#3b82f6", Icon: Send },
                        { label: "WhatsApp", bg: C.bGreen, c: C.green, Icon: MessagesSquare },
                        { label: "Email", bg: C.bAmb, c: C.amber, Icon: Mail },
                    ].map(m => (
                        <div key={m.label} style={{ flex: 1, background: m.bg, borderRadius: 11, padding: "9px 0", textAlign: "center" as const, border: `1px solid ${m.c}22`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.6)` }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                                <m.Icon size={15} style={{ color: m.c }} />
                            </div>
                            <span style={{ fontFamily: FR, fontSize: 8.5, fontWeight: 700, color: m.c }}>{m.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function P4R() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 9, height: "100%", overflow: "hidden" }}>
            <div style={{ ...gCard(16), padding: "13px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <Package size={11} style={{ color: C.accent }} />
                    <Lbl>Every Project Includes</Lbl>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {[
                        { t: "Source code", Icon: Code2 },
                        { t: "Deployed live", Icon: Globe },
                        { t: "Documentation", Icon: FileText },
                        { t: "Viva prep", Icon: GraduationCap },
                        { t: "Free revisions", Icon: RefreshCw },
                        { t: "Explanation", Icon: MessagesSquare },
                    ].map(b => (
                        <span key={b.t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FR, fontSize: 8, fontWeight: 700, color: C.green, background: C.bGreen, borderRadius: 20, padding: "4px 10px", border: "1px solid rgba(5,150,106,.16)" }}>
                            <b.Icon size={9} style={{ color: C.green }} /> {b.t}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ ...gCard(16), padding: "13px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <BadgeCheck size={11} style={{ color: C.accent }} />
                    <Lbl>Trust Score</Lbl>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                        { l: "Delivered", v: "6+", c: C.accent, bg: C.bBlue, Icon: Zap },
                        { l: "On Time", v: "100%", c: C.green, bg: C.bGreen, Icon: CheckCircle2 },
                        { l: "Avg Rating", v: "5.0★", c: C.amber, bg: C.bAmb, Icon: Star },
                        { l: "Repeat", v: "3 clients", c: C.purple, bg: C.bPurp, Icon: Repeat },
                    ].map(m => (
                        <div key={m.l} style={{ ...gTint(m.c, 12), padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                                <m.Icon size={9} style={{ color: m.c, opacity: .7 }} />
                                <div style={{ fontFamily: FR, fontSize: 7, color: m.c, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 700 }}>{m.l}</div>
                            </div>
                            <div style={{ fontFamily: FN, fontSize: 16, fontWeight: 900, color: m.c, lineHeight: 1 }}>{m.v}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ ...gSub(13), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f87171", boxShadow: "0 0 0 3px rgba(248,113,113,.22),0 0 8px rgba(248,113,113,.55)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>2 students hired this week</div>
                    <div style={{ fontFamily: FR, fontSize: 8, color: C.muted }}>Spots filling up fast</div>
                </div>
                <Users size={12} style={{ color: C.muted, flexShrink: 0 }} />
            </div>
            <div style={{ ...gSub(13), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderLeft: `3px solid ${C.accent}` }}>
                <div style={{ ...IW(C.bBlue, true) }}><Clock size={11} style={{ color: C.accent }} /></div>
                <div>
                    <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, color: C.ink }}>&lt;2hr reply guaranteed</div>
                    <div style={{ fontFamily: FR, fontSize: 8, color: C.muted }}>No commitment required</div>
                </div>
            </div>
            <button
                type="button"
                onClick={() => document.getElementById("req_a_project")?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontFamily: FR, fontWeight: 800, fontSize: 13, padding: "13px 22px", borderRadius: 15, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, letterSpacing: ".02em", background: "linear-gradient(135deg,#4f46e5,#6366f1,#818cf8)", boxShadow: "0 4px 0 #3730a3,0 8px 28px rgba(99,102,241,.35),inset 0 1px 0 rgba(255,255,255,.22)", transition: "transform .15s,box-shadow .15s" }}
                onMouseEnter={e => { const t = e.currentTarget; t.style.transform = "translateY(-1px)"; t.style.boxShadow = "0 5px 0 #3730a3,0 12px 32px rgba(99,102,241,.4),inset 0 1px 0 rgba(255,255,255,.22)" }}
                onMouseLeave={e => { const t = e.currentTarget; t.style.transform = ""; t.style.boxShadow = "0 4px 0 #3730a3,0 8px 28px rgba(99,102,241,.35),inset 0 1px 0 rgba(255,255,255,.22)" }}
            >
                <Send size={14} /> Request a Project <ArrowRight size={14} />
            </button>
            <p style={{ fontFamily: FR, fontSize: 9.5, color: C.muted, lineHeight: 1.7 }}>Reply within 2 hours · Starting ₹500 · No commitment</p>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════
// CALLOUTS
// ═══════════════════════════════════════════════════════════════════
type CalloutItem = { l: string; v: string; pos: CP }
const CALLOUTS: CalloutItem[][] = [
    [
        { l: "Projects", v: "6+", pos: { top: "16%", left: "10px" } },
        { l: "On Time", v: "0 Late", pos: { top: "37%", right: "10px" } },
        { l: "Reply", v: "<2hrs", pos: { bottom: "30%", left: "10px" } },
        { l: "Rating", v: "5.0★", pos: { bottom: "18%", right: "10px" } },
    ], [
        { l: "Projects", v: "6+", pos: { top: "16%", left: "10px" } },
        { l: "Grade", v: "8.9/10", pos: { top: "37%", right: "10px" } },
        { l: "Stack", v: "MERN", pos: { bottom: "30%", left: "10px" } },
        { l: "Hosted", v: "Vercel", pos: { bottom: "18%", right: "10px" } },
    ], [
        { l: "Students", v: "12+", pos: { top: "16%", left: "10px" } },
        { l: "Colleges", v: "12+", pos: { top: "37%", right: "10px" } },
        { l: "Avg Grade", v: "A+", pos: { bottom: "30%", left: "10px" } },
        { l: "Repeat", v: "3 back", pos: { bottom: "18%", right: "10px" } },
    ], [
        { l: "Starting", v: "₹500", pos: { top: "16%", left: "10px" } },
        { l: "Reply", v: "<2hrs", pos: { top: "37%", right: "10px" } },
        { l: "Delivery", v: "48 hrs", pos: { bottom: "30%", left: "10px" } },
        { l: "Revision", v: "Free ∞", pos: { bottom: "18%", right: "10px" } },
    ],
]
const PHASE_LABELS = ["Phase 1 · Why Trust Me", "Phase 2 · My Work", "Phase 3 · Students Trust", "Phase 4 · Let's Build"]

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
export default function WhyTrustSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const pinWrapRef = useRef<HTMLDivElement>(null)
    const phaseLblRef = useRef<HTMLSpanElement>(null)
    const lp0 = useRef<HTMLDivElement>(null), lp1 = useRef<HTMLDivElement>(null)
    const lp2 = useRef<HTMLDivElement>(null), lp3 = useRef<HTMLDivElement>(null)
    const rp0 = useRef<HTMLDivElement>(null), rp1 = useRef<HTMLDivElement>(null)
    const rp2 = useRef<HTMLDivElement>(null), rp3 = useRef<HTMLDivElement>(null)
    const cw0 = useRef<HTMLDivElement>(null), cw1 = useRef<HTMLDivElement>(null)
    const cw2 = useRef<HTMLDivElement>(null), cw3 = useRef<HTMLDivElement>(null)
    const progRef = useRef<HTMLDivElement>(null)
    const glow1Ref = useRef<HTMLDivElement>(null)
    const glow2Ref = useRef<HTMLDivElement>(null)
    const dotRefs = useRef<(HTMLDivElement | null)[]>([])
    const scrollRef = useRef<number>(0)
    const phaseRef = useRef<number>(0)
    const [ready, setReady] = useState(false)
    const [hint, setHint] = useState(false)

    useEffect(() => {
        let cancelled = false
        const init = async () => {
            try { if (document.fonts?.ready) await document.fonts.ready } catch (_) { }
            await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))
            if (!cancelled) setReady(true)
        }
        init()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        if (!ready) return
        const section = sectionRef.current
        const pin = pinWrapRef.current
        if (!section || !pin) return

        // ── MOBILE: individual card scroll-trigger animations ──────────────
        if (window.innerWidth < 768) {
            const cards = section.querySelectorAll<HTMLElement>(".wt-mob-card")
            gsap.set(cards, { opacity: 0, y: 40, filter: "blur(4px)" })
            cards.forEach((el, i) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 88%",
                    onEnter: () => gsap.to(el, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, delay: (i % 3) * 0.08, ease: "power3.out" }),
                    onLeaveBack: () => gsap.to(el, { opacity: 0, y: 25, filter: "blur(3px)", duration: 0.35, ease: "power2.in" }),
                })
            })
            return () => ScrollTrigger.getAll().forEach(t => t.kill())
        }

        // ── DESKTOP ─────────────────────────────────────────────────────────
        const LPs = [lp0.current, lp1.current, lp2.current, lp3.current]
        const RPs = [rp0.current, rp1.current, rp2.current, rp3.current]
        const CWs = [cw0.current, cw1.current, cw2.current, cw3.current]
        const PHASES = 4

        // Initial state
        gsap.set([lp0.current, rp0.current], { opacity: 1, x: 0, filter: "blur(0px)", visibility: "visible" })
            ;[lp1.current, lp2.current, lp3.current, rp1.current, rp2.current, rp3.current].forEach(el => { if (el) gsap.set(el, { opacity: 0, x: 28, filter: "blur(4px)", visibility: "hidden" }) })
        CWs.forEach(cw => cw?.querySelectorAll<HTMLElement>("[data-callout]").forEach(el => gsap.set(el, { opacity: 0, y: 16, scale: 0.86, filter: "blur(4px)" })))

        const showCallouts = (idx: number) => {
            CWs[idx]?.querySelectorAll<HTMLElement>("[data-callout]").forEach((el, i) => {
                gsap.fromTo(el, { opacity: 0, y: 16, scale: 0.86, filter: "blur(5px)" }, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.62, delay: .06 + i * .10, ease: "power3.out", overwrite: "auto" })
                gsap.to(el, { y: "+=10", ease: "sine.inOut", yoyo: true, repeat: -1, duration: 2.6 + i * .44, delay: .9 + i * .14 })
            })
        }
        const hideCallouts = (idx: number) => {
            CWs[idx]?.querySelectorAll<HTMLElement>("[data-callout]").forEach(el => { gsap.killTweensOf(el); gsap.to(el, { opacity: 0, y: -12, filter: "blur(4px)", duration: 0.22, ease: "power2.in", overwrite: "auto" }) })
        }
        const triggerStats = (rpEl: HTMLDivElement | null) => {
            rpEl?.querySelectorAll<HTMLElement>("[data-stat-chip]").forEach(c => { c.dataset.active = "1" })
        }
        const switchPhase = (from: number, to: number, fwd: boolean) => {
            const dx = fwd ? 28 : -28
            if (LPs[from]) gsap.to(LPs[from], { opacity: 0, x: -dx, filter: "blur(5px)", visibility: "hidden", duration: 0.3, ease: "power2.in", overwrite: "auto" })
            if (RPs[from]) gsap.to(RPs[from], { opacity: 0, x: dx, filter: "blur(5px)", visibility: "hidden", duration: 0.3, ease: "power2.in", overwrite: "auto" })
            hideCallouts(from)
            if (LPs[to]) { gsap.set(LPs[to], { opacity: 0, x: dx, filter: "blur(5px)", visibility: "visible" }); gsap.to(LPs[to], { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.52, delay: .14, ease: "power3.out", overwrite: "auto" }) }
            if (RPs[to]) { gsap.set(RPs[to], { opacity: 0, x: -dx, filter: "blur(5px)", visibility: "visible" }); gsap.to(RPs[to], { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.52, delay: .22, ease: "power3.out", overwrite: "auto" }) }
            showCallouts(to)
            triggerStats(RPs[to])
            dotRefs.current.forEach((el, i) => { if (!el) return; el.style.width = i === to ? "22px" : "6px"; el.style.background = i === to ? "#6366f1" : "rgba(99,102,241,.20)" })
            if (phaseLblRef.current) phaseLblRef.current.textContent = PHASE_LABELS[to]
        }

        // 600% total → 150% per phase = comfortable deliberate scrolling
        const st = ScrollTrigger.create({
            trigger: pin, start: "top top", end: "+=600%",
            pin: true, pinSpacing: true, scrub: 1.2,
            onEnter() { showCallouts(0); triggerStats(rp0.current); setHint(true) },
            onLeaveBack() {
                setHint(false); hideCallouts(phaseRef.current)
                gsap.set([lp0.current, rp0.current], { opacity: 1, x: 0, filter: "blur(0px)", visibility: "visible" })
                    ;[lp1.current, lp2.current, lp3.current, rp1.current, rp2.current, rp3.current].forEach(el => el && gsap.set(el, { opacity: 0, x: 28, visibility: "hidden" }))
                phaseRef.current = 0
                dotRefs.current.forEach((el, i) => { if (el) { el.style.width = i === 0 ? "22px" : "6px"; el.style.background = i === 0 ? "#6366f1" : "rgba(99,102,241,.20)" } })
                if (phaseLblRef.current) phaseLblRef.current.textContent = PHASE_LABELS[0]
            },
            onUpdate(self) {
                const p = self.progress
                if (progRef.current) progRef.current.style.width = `${p * 100}%`
                if (glow1Ref.current) glow1Ref.current.style.opacity = `${Math.min(1, .40 + p * .65)}`
                if (glow2Ref.current) glow2Ref.current.style.opacity = `${Math.min(1, .22 + p * .70)}`
                scrollRef.current = p
                const np = Math.min(Math.floor(p * PHASES), PHASES - 1)
                if (np !== phaseRef.current) {
                    const op = phaseRef.current; const fwd = np > op
                    phaseRef.current = np
                    if (np > 0) setHint(false)
                    switchPhase(op, np, fwd)
                }
            },
        })
        return () => { st.kill(); ScrollTrigger.getAll().forEach(t => { if (t.vars.trigger === pin) t.kill() }) }
    }, [ready])

    const Callout = ({ label, val, pos }: { label: string; val: string; pos: CP }) => (
        <div data-callout style={{ position: "absolute", ...pos, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,1)", borderRadius: 12, boxShadow: "0 4px 20px rgba(60,80,200,.10),inset 0 1px 0 rgba(255,255,255,1)", padding: "7px 12px", zIndex: 4, display: "flex", flexDirection: "column", gap: 1, willChange: "transform,opacity" }}>
            <span style={{ fontFamily: FR, fontSize: 7, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".11em" }}>{label}</span>
            <span style={{ fontFamily: FN, fontSize: 15, fontWeight: 900, color: C.ink, lineHeight: 1 }}>{val}</span>
        </div>
    )

    // ── Mobile card wrapper (applies animation class) ──
    const MC = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
        <div className={`wt-mob-card ${className}`}>{children}</div>
    )

    return (
        <section ref={sectionRef} id="why_trust_me" aria-label="Why Trust Me" className="relative w-full" style={{ background: C.pageBg, isolation: "isolate" }}>
            <div className="sr-only"><h2>Why Trust Me — About Prince</h2></div>

            {/* ══════════════ DESKTOP ══════════════ */}
            <div ref={pinWrapRef} className="hidden md:block relative w-full"

                // style={{ height: "100vh", overflow: "hidden", background: "linear-gradient(148deg,#bed2e9 0%,#cfe0f0 22%,#ddeaf7 46%,#ccdee8 68%,#d8e8f2 100%)" }}
                style={{
                    height: "100vh", overflow: "hidden",
                    background: "linear-gradient(148deg,#bed2e9 0%,#cfe0f0 22%,#ddeaf7 46%,#ccdee8 68%,#d8e8f2 100%)",
                    // ↓ ADD THIS:
                   
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}


            >

                {/* BG glows + dot grid */}
                <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <div ref={glow1Ref} style={{ position: "absolute", top: "-12%", left: "-5%", width: "48vw", height: "48vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.20) 0%,transparent 68%)", filter: "blur(56px)", opacity: .40, willChange: "opacity" }} />
                    <div ref={glow2Ref} style={{ position: "absolute", bottom: "-14%", right: "-5%", width: "42vw", height: "42vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(109,92,240,.14) 0%,transparent 68%)", filter: "blur(50px)", opacity: .22, willChange: "opacity" }} />
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(70,100,200,.09) 1px,transparent 1px)", backgroundSize: "26px 26px", WebkitMaskImage: ["radial-gradient(ellipse 14% 88% at 0% 50%,black 0%,transparent 70%)", "radial-gradient(ellipse 14% 88% at 100% 50%,black 0%,transparent 70%)"].join(","), maskImage: ["radial-gradient(ellipse 14% 88% at 0% 50%,black 0%,transparent 70%)", "radial-gradient(ellipse 14% 88% at 100% 50%,black 0%,transparent 70%)"].join(","), WebkitMaskComposite: "destination-over", maskComposite: "add" } as CP} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent 5%,rgba(99,102,241,.26) 25%,rgba(99,102,241,.56) 50%,rgba(99,102,241,.26) 75%,transparent 95%)" }} />
                </div>

                {/* Progress bar */}
                <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(99,102,241,.08)", zIndex: 7 }}>
                    <div ref={progRef} style={{ height: "100%", width: "0%", background: "linear-gradient(to right,#6366f1,#818cf8)", borderRadius: "0 1px 1px 0", willChange: "width" }} />
                </div>

                {/* Header */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "11%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", zIndex: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", boxShadow: "0 2px 12px rgba(99,102,241,.38)", fontFamily: FN }}>P</div>
                        <div>
                            <div style={{ fontFamily: FN, fontSize: 12.5, fontWeight: 900, color: C.ink }}>Prince Dev</div>
                            <div style={{ fontFamily: FR, fontSize: 8.5, color: C.muted }}>CS Student · Full-Stack Developer · India</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ ...gSub(20), padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: 7 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px rgba(52,211,153,.7)", display: "inline-block" }} />
                            <span style={{ fontFamily: FR, fontSize: 9, fontWeight: 600, color: C.ink }}>Open for projects</span>
                        </div>
                        <div style={{ ...gSub(20), padding: "5px 14px" }}>
                            <span ref={phaseLblRef} style={{ fontFamily: FR, fontSize: 9, color: C.muted, fontWeight: 500 }}>{PHASE_LABELS[0]}</span>
                        </div>
                    </div>
                </div>

                {/* ── 3-column: 28% | 1fr | 30% — balanced, model takes full natural space ── */}
                <div style={{ position: "absolute", top: "11%", bottom: "8%", left: 0, right: 0, zIndex: 2, display: "grid", gridTemplateColumns: "28% 1fr 30%", gap: "12px", padding: "0 24px" }}>

                    {/* LEFT */}
                    <div style={{ position: "relative", overflow: "hidden" }}>
                        <div ref={lp0} style={PANEL}><P1L /></div>
                        <div ref={lp1} style={PANEL}><P2L /></div>
                        <div ref={lp2} style={PANEL}><P3L /></div>
                        <div ref={lp3} style={PANEL}><P4L /></div>
                    </div>

                    {/* CENTER — model card, full 1fr width */}
                    <div style={{ position: "relative", background: "rgba(255,255,255,0.3)", backdropFilter: "blur(0.3px)", WebkitBackdropFilter: "blur(2px)", border: "1px solid rgba(255,255,255,0.98)", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 0 2px rgba(99,102,241,0.04),0 12px 40px rgba(60,80,200,.08),0 32px 64px rgba(60,80,200,.05),inset 0 1px 0 rgba(255,255,255,1)" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", background: "linear-gradient(180deg,#e2ecfb 0%,#f3f8ff 90%)" }} />
                        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 90, height: 22, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(99,102,241,.22),transparent 70%)", filter: "blur(8px)" }} />
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(99,102,241,.38),transparent)", zIndex: 5 }} />
                        {[cw0, cw1, cw2, cw3].map((ref, idx) => (
                            <div key={idx} ref={ref} style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
                                {CALLOUTS[idx].map((c, i) => <Callout key={i} label={c.l} val={c.v} pos={c.pos} />)}
                            </div>
                        ))}
                        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                            <StableModelViewer scrollRef={scrollRef} />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{ position: "relative", overflow: "hidden" }}>
                        <div ref={rp0} style={PANEL}><P1R /></div>
                        <div ref={rp1} style={PANEL}><P2R /></div>
                        <div ref={rp2} style={PANEL}><P3R /></div>
                        <div ref={rp3} style={PANEL}><P4R /></div>
                    </div>
                </div>

                {/* Phase dots */}
                <div style={{ position: "absolute", bottom: "2.8%", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 6 }}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} ref={el => { dotRefs.current[i] = el }} style={{ borderRadius: 4, height: 6, width: i === 0 ? 22 : 6, background: i === 0 ? "#6366f1" : "rgba(99,102,241,.20)", transition: "all .36s cubic-bezier(.22,1,.36,1)" }} />
                    ))}
                </div>

                {/* Scroll hint */}
                <AnimatePresence>
                    {hint && (
                        <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.1, duration: .55 }}
                            style={{ position: "absolute", bottom: "5%", right: "3%", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 6, pointerEvents: "none" }}>
                            <div style={{ width: 1, height: 26, background: "linear-gradient(to bottom,transparent,rgba(99,102,241,.44))" }} />
                            <ChevronDown size={9} style={{ color: "rgba(99,102,241,.44)" }} />
                            <span style={{ fontFamily: FR, fontWeight: 700, fontSize: 8, color: "rgba(99,102,241,.38)", letterSpacing: ".16em", textTransform: "uppercase" }}>scroll</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ══════════════ MOBILE — stacked with scroll animations ══════════════ */}
            <div className="md:hidden" style={{ background: "linear-gradient(160deg,#c4d6ec 0%,#d8e8f5 50%,#e4edf7 100%)", padding: "48px 16px 80px" }}>

                {/* Hero model card */}
                <MC>
                    <div style={{ position: "relative", height: 300, marginBottom: 20, borderRadius: 24, overflow: "hidden", ...gCard(24) }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "38%", background: "linear-gradient(180deg,#e0eafb,#f3f8ff)" }} />
                        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(99,102,241,.20),transparent 70%)", filter: "blur(10px)" }} />
                        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
                            <StableModelViewer scrollRef={scrollRef} />
                        </div>
                        {CALLOUTS[0].slice(0, 4).map((c, i) => (
                            <div key={i} style={{ position: "absolute", top: `${12 + i * 22}%`, left: i % 2 === 0 ? "4%" : "auto", right: i % 2 !== 0 ? "4%" : "auto", ...gSub(11), padding: "5px 11px" }}>
                                <span style={{ fontFamily: FR, fontSize: 7, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", display: "block" }}>{c.l}</span>
                                <span style={{ fontFamily: FN, fontSize: 14, fontWeight: 900, color: C.ink, lineHeight: 1, display: "block" }}>{c.v}</span>
                            </div>
                        ))}
                    </div>
                </MC>

                {/* Phase 1 */}
                <div style={{ marginBottom: 12 }}>
                    <MC><EyeBrow>Why Trust Me</EyeBrow></MC>
                    <MC><div style={{ fontFamily: FN, fontWeight: 900, fontSize: "clamp(2rem,8vw,3rem)", color: C.ink, lineHeight: 1.06, letterSpacing: "-.03em", marginBottom: 12 }}>Built by<br /><span style={{ color: C.accent }}>Prince.</span></div></MC>
                    <MC><p style={{ fontFamily: FR, fontSize: 12, color: C.sub, lineHeight: 1.65, paddingLeft: 10, borderLeft: "2.5px solid rgba(99,102,241,.30)", marginBottom: 14 }}>CS student. Building real projects since 16 — the person classmates call at 2am when code breaks.</p></MC>
                    <MC><div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>{TECH.map(t => <TechBadge key={t.label} {...t} />)}</div></MC>
                    {/* Stat chips */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                        {[
                            { v: 6, sx: "+", l: "Projects Delivered", Icon: Zap, tint: { bg: C.bBlue, ic: C.accent } },
                            { v: 0, sx: "", l: "Missed Deadlines", Icon: CheckCircle2, tint: { bg: C.bGreen, ic: C.green } },
                            { v: 48, sx: "h", l: "Avg. Delivery Time", Icon: Clock, tint: { bg: C.bAmb, ic: C.amber } },
                        ].map((s, i) => (
                            <MC key={s.l}><StatChip v={s.v} sx={s.sx} label={s.l} Icon={s.Icon} tint={s.tint} idx={i} /></MC>
                        ))}
                    </div>
                    <MC>
                        <div style={{ ...gDark(14), padding: "12px 15px", fontFamily: FC, fontSize: 9.5, lineHeight: 1.9, marginBottom: 12 }}>
                            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                                {["#ff5f57", "#ffbd2e", "#28c840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: .5 }} />)}
                            </div>
                            <div style={{ color: "rgba(129,140,248,.55)", fontSize: 8.5, marginBottom: 2 }}>// My coding philosophy</div>
                            <div><span style={{ color: "#818cf8" }}>const </span><span style={{ color: "#e2e8f0" }}>trust</span><span style={{ color: "rgba(255,255,255,.3)" }}> = </span><span style={{ color: "#34d399" }}>true</span></div>
                            <div><span style={{ color: "#818cf8" }}>const </span><span style={{ color: "#e2e8f0" }}>deadline</span><span style={{ color: "rgba(255,255,255,.3)" }}> = </span><span style={{ color: "#fca5a5" }}>&quot;always met&quot;</span></div>
                            <div><span style={{ color: "#818cf8" }}>const </span><span style={{ color: "#e2e8f0" }}>docs</span><span style={{ color: "rgba(255,255,255,.3)" }}> = </span><span style={{ color: "#34d399" }}>included</span></div>
                        </div>
                    </MC>
                </div>

                {/* Phase 2 */}
                <div style={{ marginBottom: 12 }}>
                    <MC><EyeBrow>What I&apos;ve Built</EyeBrow></MC>
                    <MC><div style={{ fontFamily: FN, fontWeight: 900, fontSize: "clamp(2rem,8vw,3rem)", color: C.ink, lineHeight: 1.06, letterSpacing: "-.03em", marginBottom: 14 }}>Real work,<br /><span style={{ color: C.accent }}>real results.</span></div></MC>
                    {[
                        { name: "Task Manager App", tags: ["Next.js", "MongoDB", "Vercel"], days: "3 days", grade: "9/10" },
                        { name: "E-Commerce Dashboard", tags: ["React", "Node.js", "Prisma"], days: "48 hrs", grade: "8.5/10" },
                    ].map(p => (
                        <MC key={p.name}>
                            <div style={{ ...gCard(15), padding: "13px 15px", marginBottom: 10 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ ...IW(C.bBlue, true) }}><Layers size={12} style={{ color: C.accent }} /></div>
                                        <span style={{ fontFamily: FR, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.name}</span>
                                    </div>
                                    <Pill color={C.green} bg={C.bGreen}>✓ Delivered</Pill>
                                </div>
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                                    {p.tags.map(t => <span key={t} style={{ fontFamily: FR, fontSize: 9, fontWeight: 700, color: C.accent, background: C.bBlue, borderRadius: 6, padding: "3px 9px", border: "1px solid rgba(99,102,241,.14)" }}>{t}</span>)}
                                </div>
                                <div style={{ height: 5, borderRadius: 3, background: "rgba(99,102,241,.09)", overflow: "hidden", marginBottom: 7 }}>
                                    <div style={{ height: "100%", width: "100%", borderRadius: 3, background: "linear-gradient(90deg,#818cf8,#6366f1)" }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontFamily: FR, fontSize: 9.5, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} style={{ color: C.muted }} />{p.days}</span>
                                    <span style={{ fontFamily: FN, fontSize: 13, fontWeight: 900, color: C.green }}>{p.grade}</span>
                                </div>
                            </div>
                        </MC>
                    ))}
                </div>

                {/* Phase 3 */}
                <div style={{ marginBottom: 12 }}>
                    <MC><EyeBrow>Why Students Trust</EyeBrow></MC>
                    <MC><div style={{ fontFamily: FN, fontWeight: 900, fontSize: "clamp(2rem,8vw,3rem)", color: C.ink, lineHeight: 1.06, letterSpacing: "-.03em", marginBottom: 14 }}>Students<br /><span style={{ color: C.accent }}>come back.</span></div></MC>
                    <MC>
                        <div style={{ ...gCard(16), padding: "14px 15px", marginBottom: 10 }}>
                            <Lbl>What&apos;s Always Included</Lbl>
                            {[
                                { Icon: Code2, l: "Source code included", s: "Learn, modify, submit", c: C.accent, bg: C.bBlue },
                                { Icon: Globe, l: "Deployed to Vercel", s: "Live URL ready", c: C.green, bg: C.bGreen },
                                { Icon: BookOpen, l: "Full documentation", s: "README + explanation", c: C.purple, bg: C.bPurp },
                                { Icon: MessageSquare, l: "Viva prep support", s: "I explain every line", c: C.amber, bg: C.bAmb },
                            ].map((g, i) => (
                                <div key={g.l}>
                                    {i > 0 && <HDivider />}
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
                                        <div style={{ ...IW(g.bg, true), borderRadius: 10 }}><g.Icon size={12} style={{ color: g.c }} /></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: FR, fontSize: 11, fontWeight: 700, color: C.ink }}>{g.l}</div>
                                            <div style={{ fontFamily: FR, fontSize: 9, color: C.muted }}>{g.s}</div>
                                        </div>
                                        <Pill color={g.c} bg={g.bg}>{g.l.includes("Source") ? "Always" : g.l.includes("Deployed") ? "Live" : g.l.includes("doc") ? "Full" : "Free"}</Pill>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MC>
                    <MC>
                        <div style={{ ...gCard(16), padding: "14px 16px", marginBottom: 10 }}>
                            <div style={{ fontFamily: FN, fontSize: 32, color: C.accent, opacity: .16, lineHeight: .6, marginBottom: 6 }}>&ldquo;</div>
                            <p style={{ fontFamily: FR, fontSize: 12, color: C.sub, lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>Got 9/10 for my final year project. Prince delivered in 3 days and explained every line. Helped me ace the viva too.</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#818cf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0, fontFamily: FN }}>A</div>
                                <div><p style={{ fontFamily: FR, fontWeight: 700, fontSize: 11, color: C.ink }}>Aryan S. <span style={{ color: C.muted, fontWeight: 400 }}>· SPPU</span></p><Stars /></div>
                            </div>
                        </div>
                    </MC>
                </div>

                {/* Phase 4 */}
                <div style={{ marginBottom: 12 }}>
                    <MC><EyeBrow>Let&apos;s Work Together</EyeBrow></MC>
                    <MC><div style={{ fontFamily: FN, fontWeight: 900, fontSize: "clamp(2rem,8vw,3rem)", color: C.ink, lineHeight: 1.06, letterSpacing: "-.03em", marginBottom: 14 }}>Your deadline<br /><span style={{ color: C.accent }}>is my priority.</span></div></MC>
                    <MC>
                        <div style={{ ...gCard(16), padding: "14px 15px", marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <div style={{ ...IW(C.bBlue, true) }}><CalendarDays size={12} style={{ color: C.accent }} /></div>
                                <Lbl>Typical Timeline</Lbl>
                            </div>
                            {[
                                { day: "Day 1", t: "Scope + kickoff", c: "#6366f1" },
                                { day: "Day 2–3", t: "Build + push", c: "#818cf8" },
                                { day: "Day 4", t: "Review + revisions", c: "#a5b4fc" },
                                { day: "Day 5", t: "Deploy + handover", c: "#c7d2fe" },
                            ].map((step, i, arr) => (
                                <div key={step.day} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: step.c, boxShadow: `0 0 6px ${step.c}88`, flexShrink: 0, marginTop: 1 }} />
                                        {i < arr.length - 1 && <div style={{ width: 1, height: 26, background: `linear-gradient(to bottom,${step.c}55,transparent)` }} />}
                                    </div>
                                    <div style={{ paddingBottom: i < arr.length - 1 ? 5 : 0 }}>
                                        <div style={{ fontFamily: FR, fontSize: 11, fontWeight: 700, color: C.ink }}>{step.day} · {step.t}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MC>
                    <MC>
                        <div style={{ ...gCard(16), padding: "14px 15px", marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                                <Package size={12} style={{ color: C.accent }} />
                                <Lbl>Every Project Includes</Lbl>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {[
                                    { t: "Source code", Icon: Code2 },
                                    { t: "Deployed live", Icon: Globe },
                                    { t: "Documentation", Icon: FileText },
                                    { t: "Viva prep", Icon: GraduationCap },
                                    { t: "Free revisions", Icon: RefreshCw },
                                    { t: "Explanation", Icon: MessagesSquare },
                                ].map(b => (
                                    <span key={b.t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FR, fontSize: 9.5, fontWeight: 700, color: C.green, background: C.bGreen, borderRadius: 20, padding: "5px 11px", border: "1px solid rgba(5,150,106,.16)" }}>
                                        <b.Icon size={10} style={{ color: C.green }} /> {b.t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </MC>
                    <MC>
                        <button
                            type="button"
                            onClick={() => document.getElementById("req_a_project")?.scrollIntoView({ behavior: "smooth" })}
                            style={{ width: "100%", fontFamily: FR, fontWeight: 800, fontSize: 15, padding: "15px 24px", borderRadius: 16, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, letterSpacing: ".02em", background: "linear-gradient(135deg,#4f46e5,#6366f1,#818cf8)", boxShadow: "0 4px 0 #3730a3,0 8px 28px rgba(99,102,241,.35),inset 0 1px 0 rgba(255,255,255,.22)" }}
                        >
                            <Send size={15} /> Request a Project <ArrowRight size={15} />
                        </button>
                    </MC>
                </div>
            </div>
        </section>
    )
}