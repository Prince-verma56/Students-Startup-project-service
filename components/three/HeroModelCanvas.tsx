"use client"

import { Suspense } from 'react'
import { Canvas, GroupProps } from '@react-three/fiber'
import { Environment, Html, useGLTF, OrbitControls, ContactShadows, Stage } from '@react-three/drei'

type ModelProps = GroupProps

function AvatarModel(props: ModelProps) {
  const { scene } = useGLTF('/models/MyChar3DModel2.glb')
  return <primitive object={scene} {...props} />
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-full bg-white/80 px-4 py-2 text-xs text-gray-700 shadow-lg">
        Loading 3D Model…
      </div>
    </Html>
  )
}

export default function HeroModelCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Stage environment="city" intensity={0.5} castShadow={true} adjustCamera={true}>
            <Environment preset="city" />
            
            <AvatarModel rotation={[0, 0, 0]} />
          </Stage>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={.7}
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
