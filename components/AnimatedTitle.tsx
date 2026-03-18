"use client"

import { gsap } from 'gsap'
import { useRef } from 'react'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

interface AnimatedTitleProps {
  title: string
  containerClass?: string
  style?: React.CSSProperties
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ title, containerClass, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const timeoutId = setTimeout(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%', // More robust start point
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
    }, 100)

    return () => clearTimeout(timeoutId)
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={clsx('animated-title', containerClass)} style={style}>
      {title.split('<br />').map((line, index) => (
        <div
          key={index}
          className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 tracking-tight "
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