"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Center } from "@react-three/drei"
import { Suspense, useRef, useEffect } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function Model({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/models/TrustMeModel.glb")
  const groupRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    if (!groupRef.current) return

    // 🔥 smoother rotation (no jump)
    gsap.to(groupRef.current.rotation, {
      y: scrollProgress * Math.PI * 2,
      duration: 0.8,
      ease: "power3.out",
    })

  }, [scrollProgress])

  // 🔥 subtle floating (Apple feel)
  useEffect(() => {
    if (!groupRef.current) return

    gsap.to(groupRef.current.position, {
      y: 0.12,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, [])

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} scale={3.2} />
      </group>
    </Center>
  )
}

useGLTF.preload("/models/TrustMeModel.glb")

export default function ModelViewer({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, 5], fov: 40 }}
      gl={{ antialias: true }}
    >
      {/* 🔥 cinematic lighting */}
      <ambientLight intensity={0.7} />
      <ambientLight intensity={0.7} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#6366F1" />
      <pointLight position={[0, 2, 3]} intensity={0.5} />

      {/* ❌ REMOVED ground circle (this fixes bottom patch) */}

      <Suspense fallback={null}>
        <Model scrollProgress={scrollProgress} />
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}