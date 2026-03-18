"use client"

import React from 'react'
import { motion } from 'motion/react'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import DemoSection from '@/components/sections/DemoSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ReqProjectSection from '@/components/sections/ReqProjectSection'
import ReviewSection from '@/components/sections/ReviewSection'
import ScrollCascadeText from '@/components/ScrollCascadeText'
import SectionConnector from '@/components/SectionConnector'
import Header from '../components/Navbar'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import WhyTrustSection from '@/components/sections/WhyTrustSection'


function page() {
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" as const }
  }

  return (
    <>
      <main className="overflow-hidden scroll-smooth cursor-none  bg-[#F2F5FE]">
        <SmoothCursor />
        <Header />
        {/* Hero section should be visible immediately */}
        <section id="hero">
          <HeroSection />
        </section>

        <SectionConnector from="#FFFFFF" to="#F9FBFF" glow={false} />

        <ScrollCascadeText
          id=""
          eyebrow="Why Trust Me"
          words={["CLEAN", "REAL", "CODE."]}
          paragraph="Not generated. Every line written with intention."
          sub="Source code, docs, and working demo — always included."
        />

        <SectionConnector from="#F9FBFF" to="#F9FBFF" glow={false} />

        <motion.section id="services" {...motionProps} className="pb-0">
          <ServicesSection />
        </motion.section>

        <SectionConnector from="#F9FBFF" to="#F9FBFF" glow={false} />

        <motion.section id="demo Projects" {...motionProps}>
          <DemoSection />
        </motion.section>

        <SectionConnector from="#F9FBFF" to="#F9FBFF" glow={false} />

        <div id="howitworks-entry" style={{ height: 1 }} />
        <section id="how_it_works" className="relative z-10">
          <HowItWorksSection />
        </section>
        <div id="howitworks-exit" style={{ height: 1 }} />

        <section id="req_a_project" className="relative z-20 bg-[#F9FBFF]">
          <motion.section {...motionProps}>
            <ReqProjectSection />
          </motion.section>
        </section>
        
        <SectionConnector from="#F9FBFF" to="#F9FBFF" glow={false} />

        <section id="reviews" className="relative z-40 bg-[#F9FBFF]">
          <motion.section {...motionProps}>
            <ReviewSection />
          </motion.section>
        </section>
        
        <SectionConnector from="#F9FBFF" to="#F9FBFF" glow={false} />

        <section id="why_trust_me" className="relative z-40 bg-[#F9FBFF]">
          <motion.section {...motionProps}>
            <WhyTrustSection />
          </motion.section>
        </section>

        {/* Extra space at the very bottom to allow the last pinned section to complete */}
        <div className="h-[150vh] bg-[#F9FBFF] relative z-50 flex items-end justify-center pb-20">
          <p className="text-zinc-300 font-robert text-sm">© 2024 • Built with Intention</p>
        </div>
      </main>
    </>
  )
}

export default page