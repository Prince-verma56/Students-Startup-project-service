"use client"

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type { GroupProps } from '@react-three/fiber'
import { Environment, Html, useGLTF, OrbitControls, Stage } from '@react-three/drei'

type ModelProps = GroupProps

function AvatarModel(props: ModelProps) {
  const { scene } = useGLTF('/models/MyChar3DModel2.glb')
  return <primitive object={scene} {...props} />
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-full bg-white/80 px-4 py-2 text-xs text-gray-700 shadow-lg whitespace-nowrap">
       <h1 className='font-zentry font-semibold text-xl tracking-wider'> Loading 3D Model…</h1>
      </div>
    </Html>
  )
}

export default function HeroModelCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4], fov: 35 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Stage environment="city" intensity={0.6} contactShadow={{ opacity: 0.5, blur: 2 }} adjustCamera={true}>
            <AvatarModel rotation={[0, 2.5, 0]} />
            <ambientLight intensity={0.2} />
            <ambientLight intensity={0.2} position={[0, 0, 1]} />
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