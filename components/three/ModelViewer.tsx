"use client"



import { Suspense, useRef, memo, Component, ReactNode } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

const MODEL_PATH = "/models/TrustMeModel.glb"

// ── Error Boundary ───────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

// ── Inner model — memo so it never remounts ───────────────────────
const Model = memo(function Model({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef  = useRef<THREE.Group>(null!)
  const { invalidate } = useThree()

  useFrame((state) => {
    if (!groupRef.current) return
    
    // Smooth rotation based on scroll progress ref
    const targetRotation = scrollRef.current * Math.PI * 2
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      0.08
    )

    // Floating effect
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.1

    // CONDITION 2: Invalidate for demand rendering
    state.invalidate()
    invalidate()
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={3.2} />
    </group>
  )
})
Model.displayName = "Model"

// ── Lightweight fallback while GLTF loads ────────────────────────
function LoadingFallback() {
  return (
    <group>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#a5b4fc" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 1.35, 12]} />
        <meshStandardMaterial color="#818cf8" opacity={0.45} transparent />
      </mesh>
    </group>
  )
}

// ── Detect mobile once — never re-evaluates ───────────────────────
const isMobileDevice =
  typeof window !== "undefined" && window.innerWidth < 768

export default function ModelViewer({
  scrollRef,
  className = "",
}: {
  scrollRef: React.MutableRefObject<number>
  className?: string
}) {
  return (
    <div
      className={`w-full h-full relative ${className}`}
      style={{ minHeight: 400 }}
    >
      <ErrorBoundary>
        <Canvas
          // ── KEY PERF FIX: only render when invalidated ──
          frameloop="demand"
          dpr={[1, 1.2]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            antialias: false,             // false saves ~30% GPU
            alpha: true,                  // transparent bg
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          {/* ── Simplified lights — FIX 1 ── */}
          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow={false} />
          <pointLight position={[-5, -5, -5]} intensity={1} />
          <directionalLight position={[-2, 2, -2]} intensity={0.5} />

          <Suspense fallback={<LoadingFallback />}>
            <Model scrollRef={scrollRef} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)