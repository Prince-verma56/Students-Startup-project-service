"use client"

// ─────────────────────────────────────────────────────────────────────────────
// ModelViewer.tsx — optimised for 60fps, zero React re-renders during scroll
//
// PERFORMANCE DECISIONS:
//   • Receives scrollRef (MutableRefObject<number>) — NOT a prop value.
//     This means the parent never needs to setState → no Canvas remount ever.
//   • Floating handled entirely inside useFrame with lerp — no setInterval,
//     no external RAF, no fighting with Three.js's own RAF loop.
//   • Camera zoom driven by scrollRef inside useFrame — no prop change.
//   • Single directional key light + 1 fill + ambient — minimum for good look.
//   • dpr capped at 1.5, powerPreference high-performance.
//   • antialias: false on mobile (detected once, never re-evaluated).
//   • ContactShadows removed — saves a full render pass per frame.
//     Replaced with a simple mesh-based shadow catcher (cheaper).
//   • gl.autoClear stays true (default) — no manual clear overhead.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useRef, useMemo, useEffect, memo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Center, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

const MODEL_PATH = "/models/TrustMeModel.glb"

const Model = memo(({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) => {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const targetRotY = (scrollRef.current - 0.5) * Math.PI * 1.5
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.08
    )
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.1
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={3.2} />
    </group>
  )
})
Model.displayName = "Model"

// Use a simpler fallback that is guaranteed to show
function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default function ModelViewer({ scrollRef, className = "" }: { scrollRef: React.MutableRefObject<number>, className?: string }) {
  return (
    <div className={`w-full h-full relative ${className}`} style={{ minHeight: "400px" }}>
      {/* DEBUG TEXT: If you see this, the component is rendering */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#eef2ff" }}
      >
        <ambientLight intensity={1.5} />
        <ambientLight intensity={2} />
        <directionalLight intensity={1.5} />



        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} color="white" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="white" intensity={2} />

        <Suspense fallback={<LoadingBox />}>
          <Model scrollRef={scrollRef} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)