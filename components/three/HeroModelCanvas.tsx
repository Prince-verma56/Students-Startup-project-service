"use client"

import { Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, useGLTF, OrbitControls, Stage } from '@react-three/drei'

function AvatarModel() {
  const { scene } = useGLTF('/models/MyChar3DModel2.glb')
  // Cloning prevents the model from disappearing if the component re-mounts
  const clonedScene = useMemo(() => scene.clone(), [scene])
  const { invalidate } = useThree()

  // CONDITION 2: Invalidate on each frame for demand rendering
  useFrame((state) => {
    state.invalidate()
    // Manual invalidate call just in case state.invalidate() isn't enough in some fiber versions
    invalidate()
  })

  return <primitive

    object={clonedScene}
    rotation={[0, Math.PI / -0.9, 0]}

  />
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-full bg-white/80 px-4 py-2 text-xs text-gray-700 shadow-lg whitespace-nowrap">
        <h1 className='font-zentry font-semibold text-xl tracking-wider'>Loading 3D Model…</h1>
      </div>
    </Html>
  )
}

// Detect mobile once
const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768

export default function HeroModelCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        // CONDITION 2: Demand rendering
        frameloop="demand"
        dpr={[1, isMobileDevice ? 1 : 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.5, 5], fov: 35 }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Stage environment="city" intensity={0.6} contactShadow={{ opacity: 0.5, blur: 2 }} adjustCamera={true}>

            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1} />
            <directionalLight position={[-2, 2, -2]} intensity={0.5} />
            <AvatarModel />
          </Stage>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxAzimuthAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}

            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/MyChar3DModel2.glb')