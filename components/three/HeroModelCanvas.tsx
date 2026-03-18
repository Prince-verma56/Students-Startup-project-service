"use client"

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html, useGLTF, OrbitControls, Stage, Center } from '@react-three/drei'

function AvatarModel() {
  const { scene } = useGLTF('/models/MyChar3DModel2.glb')
  // Cloning prevents the model from disappearing if the component re-mounts
  const clonedScene = useMemo(() => scene.clone(), [scene])
  return <primitive object={clonedScene} />
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-full bg-white/80 px-4 py-2 text-xs text-gray-700 shadow-lg whitespace-nowrap">
        {/* Restored your custom font here */}
        <h1 className='font-zentry font-semibold text-xl tracking-wider'>Loading 3D Model…</h1>
      </div>
    </Html>
  )
}

export default function HeroModelCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]} // Performance boost: 1.5 is plenty for web
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4], fov: 35 }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Stage environment="city" intensity={0.6} contactShadow={{ opacity: 0.5, blur: 2 }} adjustCamera={true}>
            <AvatarModel />
          </Stage>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxAzimuthAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/MyChar3DModel2.glb')