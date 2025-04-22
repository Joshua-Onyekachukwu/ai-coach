'use client'

import { ChevronRightIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function HeroSection() {
    return (
        <div className="relative isolate flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
            {/* Gradient background */}
            <div  style={{
                clipPath:
                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }} className="absolute inset-0 -z-20 aspect-1108/632 w-[69.25rem] bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-90" />


            {/* Animated grid background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[60rem] w-[120rem] -translate-x-1/2 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Floating gradient blobs */}
            <div className="absolute -top-40 -left-40 -z-10 transform-gpu blur-3xl" aria-hidden="true">
                <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20 rounded-full h-96 w-96 animate-float"></div>
            </div>
            <div className="absolute -bottom-32 -right-40 -z-10 transform-gpu blur-3xl" aria-hidden="true">
                <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-20 rounded-full h-96 w-96 animate-float-delay"></div>
            </div>

            {/* Content */}
            <motion.div
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.7, ease: 'easeOut'}}
                className="text-center px-6 sm:px-16 lg:px-24 max-w-4xl"
            >
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.3, duration: 0.5}}
                    className="mb-8 flex justify-center"
                >
                    <span
                        className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse mr-2"></span>
                        Now with AI coaching
                    </span>
                </motion.div>

                <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                    <span
                        className="bg-gradient-to-r from-indigo-300 to-indigo-600 bg-clip-text text-transparent">Transform</span> Your
                    Productivity
                </h1>
                <p className="mt-6 text-lg text-gray-300 sm:text-xl max-w-3xl mx-auto">
                    AI-powered accountability, real-time insights, and personalized coaching to help you achieve more in
                    less time.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <motion.div
                        whileHover={{scale: 1.03}}
                        whileTap={{scale: 0.98}}
                    >
                        <Link
                            to="/register"
                            className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl group hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                        >
                            <span
                                className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-purple-700 rounded group-hover:-mt-4 group-hover:-mr-4">
                                <span
                                    className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                            </span>
                            <span
                                className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 bg-gradient-to-r from-indigo-600 to-purple-700 rounded opacity-0 group-hover:opacity-100"></span>
                            <span
                                className="relative w-full text-center font-semibold text-lg flex items-center justify-center">
                                Get Started <ChevronRightIcon
                                className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                            </span>
                        </Link>
                    </motion.div>

                    <motion.a
                        whileHover={{scale: 1.03}}
                        whileTap={{scale: 0.98}}
                        href="#how-it-works"
                        className="inline-flex items-center px-6 py-3.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all duration-300 shadow hover:shadow-md group"
                    >
                        <PlayCircleIcon
                            className="h-5 w-5 text-indigo-400 mr-2 group-hover:text-indigo-300 transition-colors"/>
                        <span className="relative">
                            Watch Demo
                        </span>
                    </motion.a>
                </div>

                <div className="mt-16 flex justify-center">
                    <div
                        className="relative rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl w-full max-w-4xl h-64 sm:h-80 bg-gradient-to-br from-gray-800 to-gray-900/50">
                        {/* Video embed */}
                        <iframe
                            src="https://videocdn.cdnpk.net/videos/a84aa7ef-fc5d-4ba2-8d3a-585fb598fb02/horizontal/previews/clear/small.mp4?token=exp=1745232404~hmac=e7f73672231539dc6f0f6e64069aa6d38c16e36bc020d58189438c78631960f3"
                            className="absolute w-full h-full object-cover"
                            allowFullScreen
                            frameBorder="0"
                            title="Happy man using laptop video"
                        ></iframe>

                        {/* Overlay elements */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="text-center px-6">
                                <div
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30">
                                    <PlayCircleIcon className="h-8 w-8 text-indigo-400"/>
                                </div>
                                <p className="mt-4 text-sm text-gray-300">See how it works</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}