"use client"

import React, { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register plugin once at module level
gsap.registerPlugin(ScrollTrigger)

interface GSAPProviderProps {
    children: React.ReactNode
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
    useEffect(() => {
        const refreshGSAP = () => {
            ScrollTrigger.refresh(true)
            ScrollTrigger.update()
        }

        // 1. Initial refresh after a frame
        const frameId = requestAnimationFrame(() => {
            setTimeout(refreshGSAP, 100)
        })

        // 2. Initial refresh after a delay
        const initialRefresh = setTimeout(refreshGSAP, 500)

        // 3. Refresh when fonts are ready
        document.fonts.ready.then(refreshGSAP)

        // 4. Refresh on window load
        window.addEventListener("load", refreshGSAP)

        // 5. Safety timeout after 1200ms
        const safetyTimeoutId = setTimeout(refreshGSAP, 1200)

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId)
            clearTimeout(initialRefresh)
            window.removeEventListener("load", refreshGSAP)
            clearTimeout(safetyTimeoutId)
        }
    }, [])

    return <>{children}</>
}
