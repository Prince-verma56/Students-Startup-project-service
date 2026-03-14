import Image from 'next/image'
import React from 'react'
import dynamic from 'next/dynamic'
// import AttractButton from '../kokonutui/attract-button'
import SlideTextButton from '../kokonutui/slide-text-button'

import {
  
    Link2Icon,
   
} from 'lucide-react'

// import { SocialIcon } from 'react-social-icons'

const HeroModelCanvas = dynamic(() => import('../three/HeroModelCanvas'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
            Loading 3D…
        </div>
    ),
})

function HeroSection() {



    return (
        <section
            // style={{ backgroundImage: "url('/images/White Gradient Bg1.jpg')", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
            id="hero"
            className="relative w-full min-h-screen pt-24 md:pt-16 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-10 md:py-20">
            <video src="/videos/TechStackAnimation.mp4"
                className='-z-[2] absolute top-0 left-0 w-full h-full object-cover opacity-75'
                autoPlay loop muted></video>
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="relative z-10 flex flex-col h-[50vh] p-10 justify-center space-y-4 sm:space-y-6 font-neulis rounded-2xl border-gray-400 backdrop-blur-[0.2em]">
                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-3xl text-[#001a23]  sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Web Projects Built for Students,  by a Student
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">
                                what i do and for whom
                            </p>
                        </div>



                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 cursor-pointer">
                            {/* 

                            <AttractButton
                                className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium w-full sm:w-auto"  ></AttractButton> */}


                            <SlideTextButton
                                className='bg-transparent -tracking-wider text-black outline-gray-600 border-2 border-gray-700 hover:bg-transparent'
                                text='Request a Project'
                                slideText={<span className="flex items-center gap-2">

                                    Click here
                                    <Link2Icon className="w-5 h-5" />

                                </span>}
                            />
                            <SlideTextButton
                                text='Connect on Telegram'
                                slideText={<span className="flex items-center gap-2">
                                    Click here
                                    <Link2Icon className="w-5 h-5" />
                                </span>}
                            />



                        </div>
                    </div>

                    {/* Right Side - 3D model (efficient, lazy-loaded). To use the static image instead, uncomment the block below and comment out HeroModelCanvas. */}
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] bg-transparent">
                        <HeroModelCanvas
                        className="absolute inset-0" />
                        {/* <Image
                            src="/images/me3-removebg.png"
                            alt="hero section character"
                            fill
                            priority
                            className="object-contain object-center"
                        /> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
