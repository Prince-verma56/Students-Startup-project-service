"use client"

import React from 'react'
import { motion } from 'motion/react'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import DemoSection from '@/components/sections/DemoSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ReqProjectSection from '@/components/sections/ReqProjectSection'
import TelegramSection from '@/components/sections/TelegramSection'
import WhyTrustSection from '@/components/sections/WhyTrustSection'
import Header from '../components/Navbar'
import { SmoothCursor } from '@/components/ui/smooth-cursor'


function page() {
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  return (
    <>
      <main className="overflow-hidden scroll-smooth cursor-none">
        <SmoothCursor />
        <Header />
        {/* Hero section should be visible immediately */}
        <section id="hero">
          <HeroSection />
        </section>
        <motion.section id="services" {...motionProps}>
          <ServicesSection />
        </motion.section>
        <motion.section id="demo Projects" {...motionProps}>
          <DemoSection />
        </motion.section>
        <motion.section id="how_it_works" {...motionProps}>
          <HowItWorksSection />
        </motion.section>
        <motion.section id="req_a_project" {...motionProps}>
          <ReqProjectSection />
        </motion.section>
        <motion.section id="telegram" {...motionProps}>
          <TelegramSection />
        </motion.section>
        <motion.section id="why_trust_me" {...motionProps}>
          <WhyTrustSection />
        </motion.section>
      </main>
    </>
  )
}

export default page