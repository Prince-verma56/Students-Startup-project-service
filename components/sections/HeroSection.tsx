"use client"

import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SlideTextButton from '../kokonutui/slide-text-button'
import { Link2Icon } from 'lucide-react'

// Register GSAP
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Color Tokens
const C = {
    pageBg: "#F2F5FE",
    accent: "#6366F1",
    ink: "#1A1F2E",
}

const HeroModelCanvas = dynamic(() => import('../three/HeroModelCanvas'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 font-neulis">
            Initializing 3D...
        </div>
    ),
})

export default function HeroSection() {
    const containerRef = useRef<HTMLElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const paraRef = useRef<HTMLParagraphElement>(null)
    const btn1Ref = useRef<HTMLDivElement>(null)
    const btn2Ref = useRef<HTMLDivElement>(null)

    // ── 1. Video Scroll Mask Animation ─────────────────────────────────────
    useGSAP(() => {
        if (!videoRef.current || !containerRef.current) return

        // Set initial "Full Screen" state
        gsap.set(videoRef.current, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            borderRadius: '0% 0% 0% 0%',
            opacity: 0,
            scale: 1.05
        })

        // Entrance: Fade in and scale down slightly
        gsap.to(videoRef.current, {
            opacity: 0.85,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out'
        })

        // Scroll Logic: Transition to organic shape
        gsap.to(videoRef.current, {
            // This shape pulls the corners in to create a "Clay" or "Liquid" look
            clipPath: 'polygon(12% 0%, 82% 0%, 94% 88%, 4% 94%)',
            borderRadius: '0px 0px 100px 40px',
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom 20%',
                scrub: 1.5,
            },
        })
    }, { scope: containerRef })

    // ── 2. Split-Text Word Entrance ────────────────────────────────────────
    useGSAP(() => {
        const heading = headingRef.current
        if (!heading) return

        const originalHTML = heading.innerHTML
        const words = heading.innerText.trim().split(/\s+/)
        
        // Wrap words for animation
        heading.innerHTML = words
            .map(w => `<span class="inline-block overflow-hidden py-1">
                          <span class="word-inner inline-block">${w}&nbsp;</span>
                       </span>`)
            .join('')

        const wordInners = heading.querySelectorAll('.word-inner')

        const tl = gsap.timeline({ delay: 0.4 })

        tl.fromTo(wordInners, 
            { y: 60, opacity: 0, filter: 'blur(10px)' },
            { 
                y: 0, 
                opacity: 1, 
                filter: 'blur(0px)', 
                stagger: 0.08, 
                duration: 0.8, 
                ease: "power4.out" 
            }
        )
        .fromTo([paraRef.current, btn1Ref.current, btn2Ref.current],
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        )

        return () => { heading.innerHTML = originalHTML }
    }, { scope: containerRef })

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
            style={{ backgroundColor: C.pageBg }}
        >
            {/* ── BACKGROUND VIDEO LAYER ── */}
            <video
                ref={videoRef}
                src="/videos/TechStackAnimation.mp4"
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: 1, willChange: 'clip-path' }}
                autoPlay loop muted playsInline preload="auto"
            />

            {/* Subtle light overlay to bridge video and UI */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" style={{ zIndex: 2 }} />

            {/* ── CONTENT LAYER ── */}
            <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ zIndex: 10 }}>
                
                {/* Left Side: Text Content */}
                <div className="flex flex-col space-y-8">
                    <div className="space-y-4">
                        <h1
                            ref={headingRef}
                            className="text-4xl md:text-6xl font-neulis font-bold text-[#001a23] leading-[1.1] tracking-tight"
                        >
                            Web Projects Built for Students, by a Student
                        </h1>
                        <p
                            ref={paraRef}
                            className="text-xl md:text-2xl text-gray-600 font-chocolate font-florish italic"
                        >
                            what i do and for whom
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <div ref={btn1Ref}>
                            <SlideTextButton
                                className="border-2 border-slate-800 bg-transparent text-slate-900 hover:bg-slate-900 hover:text-white transition-colors font-neulis"
                                text="Request a Project"
                                slideText={<span className="flex items-center gap-2">Let's Go <Link2Icon className="w-4 h-4"/></span>}
                            />
                        </div>
                        <div ref={btn2Ref}>
                            <SlideTextButton
                                className="font-neulis"
                                text="Connect Now"
                                slideText={<span className="flex items-center gap-2">Telegram <Link2Icon className="w-4 h-4"/></span>}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: 3D Model Area */}
                <div className="relative w-full h-[450px] md:h-[650px]">
                    {/* The 3D model container */}
                    <HeroModelCanvas className="w-full h-full" />
                    
                    {/* Visual anchor for the model */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/10 blur-xl rounded-full -z-10" />
                </div>
            </div>
        </section>
    )
}