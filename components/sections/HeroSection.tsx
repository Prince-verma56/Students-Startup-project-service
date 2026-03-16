"use client"

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SlideTextButton from '../kokonutui/slide-text-button'
import { Link2Icon } from 'lucide-react'

const HeroModelCanvas = dynamic(() => import('../three/HeroModelCanvas'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
            Loading 3D…
        </div>
    ),
})

function HeroSection() {
    const containerRef = useRef<HTMLElement>(null)
    const videoRef     = useRef<HTMLVideoElement>(null)
    const headingRef   = useRef<HTMLHeadingElement>(null)
    const paraRef      = useRef<HTMLParagraphElement>(null)
    // individual button wrapper refs so we bypass SlideTextButton's internal motion.div
    const btn1Ref      = useRef<HTMLDivElement>(null)
    const btn2Ref      = useRef<HTMLDivElement>(null)

    // ── Scroll-linked video mask ──────────────────────────────────────────
    useGSAP(() => {
        if (!videoRef.current || !containerRef.current) return

        gsap.set(videoRef.current, {
            clipPath: 'polygon(14% 0%, 72% 0%, 88% 90%, 0% 95%)',
            borderRadius: '0% 0% 40% 10%',
        })

        gsap.from(videoRef.current, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            borderRadius: '0% 0% 0% 0%',
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom 30%',
                scrub: 1.5,
            },
        })

        gsap.fromTo(
            videoRef.current,
            { opacity: 0, scale: 1.06 },
            {
                opacity: 0.75,
                scale: 1,
                duration: 1.8,
                ease: 'power2.out',
                delay: 0.1,
                clearProps: 'scale',
            }
        )
    }, { scope: containerRef })

    // ── One-time text + button entrance ──────────────────────────────────
    useGSAP(() => {
        const heading = headingRef.current
        const para    = paraRef.current
        const btn1    = btn1Ref.current
        const btn2    = btn2Ref.current

        if (!heading || !para || !btn1 || !btn2) return

        const originalHTML = heading.innerHTML
        const originalText = heading.innerText

        // Split heading into word spans
        const words = originalText.trim().split(/\s+/)
        heading.innerHTML = words
            .map(
                (w) =>
                    `<span class="inline-block overflow-hidden leading-tight"><span class="wi inline-block">${w}&nbsp;</span></span>`
            )
            .join('')

        const wordEls = heading.querySelectorAll<HTMLElement>('.wi')

        // Hide everything before animation — prevents any flash
        gsap.set(wordEls,  { opacity: 0, y: 30, filter: 'blur(8px)' })
        gsap.set(para,     { opacity: 0, y: 16 })
        gsap.set(btn1,     { opacity: 0, y: 24 })
        gsap.set(btn2,     { opacity: 0, y: 24 })

        const tl = gsap.timeline({
            delay: 0.5,
            defaults: { ease: 'power3.out' },
        })

        // 1. Heading words drop in
        tl.to(wordEls, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.07,
        })

        // 2. Paragraph fades up
        tl.to(para, {
            opacity: 1,
            y: 0,
            duration: 0.55,
        }, '-=0.2')

        // 3. Button 1
        tl.to(btn1, {
            opacity: 1,
            y: 0,
            duration: 0.5,
        }, '-=0.05')

        // 4. Button 2 — slightly after btn1
        tl.to(btn2, {
            opacity: 1,
            y: 0,
            duration: 0.5,
        }, '-=0.3')

        return () => {
            if (heading) heading.innerHTML = originalHTML
        }
    }, { scope: containerRef })

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative w-full min-h-screen pt-24 md:pt-16 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-10 md:py-20"
        >
            {/* Video with scroll-linked mask */}
            <video
                ref={videoRef}
                src="/videos/TechStackAnimation.mp4"
                className="absolute top-0 left-0 w-full h-full object-cover -z-[2]"
                style={{ willChange: 'clip-path, border-radius, transform' }}
                autoPlay
                loop
                muted
                playsInline
            />

            <div className="absolute inset-0 -z-[1] bg-white/10 pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">

                    {/* Left — Content */}
                    <div className="relative z-10 flex flex-col h-[50vh] justify-center space-y-4 sm:space-y-6 font-neulis rounded-2xl backdrop-blur-[0.2em]">
                        <div className="space-y-3 sm:space-y-4">
                            <h1
                                ref={headingRef}
                                className="text-3xl text-[#001a23] sm:text-4xl font-neulis leading-tight md:text-5xl lg:text-6xl font-bold leading-tight"
                            >
                                Web Projects Built for Students, by a Student
                            </h1>
                            <p
                                ref={paraRef}
                                className="text-base sm:text-lg md:text-xl text-gray-600 font-chocolate font-florish "
                            >
                                what i do and for whom
                            </p>
                        </div>

                        {/* Buttons — left-aligned, each wrapped for independent GSAP targeting */}
                        <div className="flex flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4 flex-wrap">
                            <div ref={btn1Ref}>
                                <SlideTextButton
                                    className="bg-transparent -tracking-wider text-black border-2 border-gray-700 hover:bg-transparent"
                                    text="Request a Project"
                                    slideText={
                                        <span className="flex items-center gap-2">
                                            Click here <Link2Icon className="w-5 h-5" />
                                        </span>
                                    }
                                />
                            </div>
                            <div ref={btn2Ref}>
                                <SlideTextButton
                                    text="Connect on Telegram"
                                    slideText={
                                        <span className="flex items-center gap-2">
                                            Click here <Link2Icon className="w-5 h-5" />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right — 3D Model */}
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] bg-transparent">
                        <HeroModelCanvas className="absolute inset-0" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection