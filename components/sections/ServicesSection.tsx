"use client"

import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import CardFlip from '../kokonutui/card-flip'
import AnimatedTitle from '../AnimatedTitle'

gsap.registerPlugin(ScrollTrigger)

// ── Types ─────────────────────────────────────────────────────────────────────

interface Tier {
  name: string
  subtitle: string
  description: string
  features: string[]
  price: string
  image?: string
  accentColor: string
  featured?: boolean
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TIERS: Tier[] = [
  {
    name: 'Basic',
    subtitle: 'Quick Landing Pages',
    description:
      'Perfect for simple academic assignments or personal landing pages that need a professional look without complex logic.',
    features: [
      'Single landing page',
      'Simple functionality',
      'Basic CSS animations',
      'Full documentation',
      '1 Revision',
    ],
    price: '₹500–₹1500',
    accentColor: 'emerald',
    image:
      'https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center',
    featured: true,
  },
  {
    name: 'Frontend',
    subtitle: 'Interactive React UI',
    description:
      'High-quality React/Next.js frontend development with smooth transitions, responsive design, and API integrations.',
    features: [
      'Multi-page React UI',
      'API integration',
      'Responsive design',
      'Complex animations',
      'Source code access',
    ],
    price: '₹1500–₹3000',
    accentColor: 'blue',
    image:
      'https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center',
    featured: true,
  },
  {
    name: 'Mini Full-Stack',
    subtitle: 'Complete Web App',
    description:
      'A full-featured application with backend logic, database storage, and user authentication. Ideal for major projects.',
    features: [
      'Auth system (NextAuth)',
      'Database (Prisma/Mongo)',
      'CRUD operations',
      'Admin Dashboard',
      'Deployment guide',
    ],
    price: '₹3000–₹6000',
    accentColor: 'violet',
    featured: true,
    image:
      'https://cdn.dribbble.com/userupload/41459731/file/original-5d9baa65b099526a1889cc17ca526de5.jpg?resize=752x&vertical=center',
  },
  {
    name: 'Advanced App',
    subtitle: 'Scalable Solutions',
    description:
      'Professional MERN stack applications with advanced features like payment gateways, real-time updates, and high performance.',
    features: [
      'Advanced MERN Stack',
      'Payment gateway',
      'Cloud deployment',
      'Real-time features',
      'SEO Optimization',
    ],
    price: '₹6000+',
    accentColor: 'rose',
    image:
      'https://cdn.dribbble.com/userupload/41476319/file/original-efcbf7ff33d31c763e48ab2ab6fe2bb4.jpg?resize=752x&vertical=center',
  },
]

// ── ServicesSection ───────────────────────────────────────────────────────────

const ServicesSection: React.FC = () => {
  const headingRef    = useRef<HTMLDivElement>(null)
  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const paraRef       = useRef<HTMLParagraphElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-80px' })

  // Paragraph scroll-triggered animation via GSAP
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
    <section
      id="services"
      className="relative w-full py-24 md:py-32 px-4 sm:px-6 lg:px-12"
    >
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
          title="Build Your Student <br /> Project Faster"
          containerClass="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-6 font-neulis"
        />

        {/* Paragraph — GSAP scroll animation via ref */}
        <p
          ref={paraRef}
          className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-[560px] mx-auto font-robert font-medium mt-6"
          style={{ opacity: 0 }}
        >
          Choose a project tier that fits your assignment or portfolio requirements.
        </p>
      </div>

      {/* Card grid — untouched */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {TIERS.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <CardFlip
              title={tier.name}
              subtitle={tier.subtitle}
              description={tier.description}
              features={tier.features}
              price={tier.price}
              image={tier.image}
              accentColor={tier.accentColor}
              className={tier.featured ? 'scale-[1.05] z-10' : ''}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection