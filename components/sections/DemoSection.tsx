import { useInView } from "framer-motion";
import AnimatedTitle from "../AnimatedTitle";
import CardStackExample from "../kokonutui/card-stack";
import { motion } from "motion/react"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from 'react'
export default function DemoSection() {
    const headingRef = useRef<HTMLDivElement>(null)
    const eyebrowRef = useRef<HTMLParagraphElement>(null)
    const paraRef = useRef<HTMLParagraphElement>(null)
    const headingInView = useInView(headingRef, { once: true, margin: '-80px' })


    useGSAP(() => {
        if (!paraRef.current) return

        gsap.fromTo(
            paraRef.current,
            {
                opacity: 0,
                y: 28,
                filter: 'blur(6px)',
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: paraRef.current,
                    start: '80 bottom',
                    end: 'center bottom',
                    toggleActions: 'play none none reverse',
                },
            }
        )
    }, { scope: headingRef })


    return (
        <>

            <section
                id="demo"
                className="relative w-full py-24 md:py-32 px-4 sm:px-6 lg:px-12">

                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100/30 blur-[120px]" />
                </div>

                {/* Heading area */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 md:mb-20">

                    {/* Eyebrow */}
                    <motion.p
                        ref={eyebrowRef}
                        initial={{ opacity: 0, y: 12 }}
                        animate={headingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-500 mb-6 font-robert"
                    >
                        Project Packages
                    </motion.p>

                    {/* AnimatedTitle for heading */}
                    <AnimatedTitle
                        title="Impressive Projects"
                        containerClass="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-6 font-neulis whitespace-nowrap"
                    />

                    {/* Paragraph — GSAP scroll animation via ref */}
                    <p
                        ref={paraRef}
                        className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-140 mx-auto font-robert font-medium mt-6"
                        style={{ opacity: 1 }}
                    >
                        Choose a project tier that fits your needs.
                    </p>
                </div>
                <CardStackExample />


            </section>



        </>
    )
}



