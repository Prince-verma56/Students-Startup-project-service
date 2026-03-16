"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.2, // Reduced for better performance
      lerp: 0.1,    // Fixed lerp value (must be between 0 and 1)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Fixed easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })


    lenis.on('scroll', ScrollTrigger.update)


    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(1000, 16)


    return () => {
      lenis.destroy()
      gsap.ticker.remove(update)
    }
  }, [])

  return <>{children}</>
}
