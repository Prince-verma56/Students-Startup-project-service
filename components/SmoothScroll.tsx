"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
  }, [pathname])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
    })
    lenisRef.current = lenis

    // CONDITION 1: Lenis + GSAP conflict wiring
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0) // CONDITION 10: GSAP lagSmoothing

    // Add lenis class to html for CSS handling
    document.documentElement.classList.add('lenis')

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(raf)
      document.documentElement.classList.remove('lenis')
    }
  }, [])

  return <>{children}</>
}
