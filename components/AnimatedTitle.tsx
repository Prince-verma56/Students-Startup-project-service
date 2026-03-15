"use client"

import { gsap } from 'gsap'
import { useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedTitleProps {
  title: string
  containerClass?: string
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ title, containerClass }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: '100 bottom',
        end: 'center bottom',
        toggleActions: 'play none none reverse',
      },
    })

    tl.to(
      '.animated-word',
      {
        opacity: 1,
        duration: 1.5,
        transform: 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)',
        ease: 'power2.inOut',
        stagger: 0.02,
      },
      0
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={clsx('animated-title', containerClass)}>
      {title.split('<br />').map((line, index) => (
        <div
          key={index}
          className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 tracking-tight"
        >
          {line.split(' ').map((word, idx) => (
            <span
              key={idx}
              className="animated-word"
              style={{ opacity: 0, transform: 'translate3d(0, 50px, 0) rotateY(20deg) rotateX(-20deg)' }}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default AnimatedTitle