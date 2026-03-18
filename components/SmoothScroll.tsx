"use client"

import { useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let locomotiveScroll: any;

    const init = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          duration: 1.2,
          lerp: 0.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        },
      })

      locomotiveScroll.on('scroll', ScrollTrigger.update)
    }

    init();

    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy()
    }
  }, [])

  return <>{children}</>
}
