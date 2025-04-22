'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function TestimonialCarousel() {
    const testimonials = [
        {
            id: 1,
            quote: "I never thought an AI coach could actually help me stay on track with my personal goals—but this has completely changed the game. I get daily check-ins, motivational nudges, and real-time insights that keep me focused. It's like having a coach in my pocket 24/7.",
            author: "Melissa T.",
            role: "Startup Founder",
            achievement: "Crushed 4 major goals in 3 months with AI support",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80"
        },
        {
            id: 2,
            quote: "The accountability features have transformed how I approach my work. I'm 3x more productive and actually completing projects instead of just starting them.",
            author: "James R.",
            role: "Software Engineer",
            achievement: "Increased productivity by 300%",
            image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80"
        },
        {
            id: 3,
            quote: "As a freelance designer, staying consistent used to be tough. Now, I wake up with clarity, track progress, and stay inspired—all through this AI. It’s seriously changed my mindset.",
            author: "Aisha N.",
            role: "Freelance Designer",
            achievement: "Hit income goals 2 months ahead of schedule",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
        },
        {
            id: 4,
            quote: "The weekly reflections and emotional wellness prompts have helped me stay grounded while running a growing business. This isn't just productivity—it’s wellness, too.",
            author: "Daniel W.",
            role: "Small Business Owner",
            achievement: "Reduced burnout and maintained a healthier work-life balance",
            image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
        },
        {
            id: 5,
            quote: "I was skeptical at first, but within a week I was hooked. The AI keeps me engaged, calls out my excuses, and even celebrates wins with me. So motivating!",
            author: "Tanya G.",
            role: "Marketing Consultant",
            achievement: "Launched 2 new client projects without burnout",
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
        },
        {
            id: 6,
            quote: "For someone who used to struggle with routines, this tool made it feel natural. The AI helped me build solid habits and actually stick to them without pressure.",
            author: "Ryan P.",
            role: "Content Creator",
            achievement: "Built a daily routine that finally sticks",
            image: "https://images.unsplash.com/photo-1520975911483-6ca0c91bff1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
        },
        {
            id: 7,
            quote: "This AI is like a mirror that keeps me honest. I’ve never had this level of self-awareness and goal clarity before.",
            author: "Isabella M.",
            role: "Leadership Coach",
            achievement: "Improved client engagement and doubled program signups",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
        },
        {
            id: 8,
            quote: "I'm managing my time better, sleeping better, and feeling more focused each day. This AI coach helped me rewire how I think about time and progress.",
            author: "Caleb L.",
            role: "Grad Student",
            achievement: "Balanced full-time study and part-time work with ease",
            image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
        }
    ]


    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0) // 0: no direction, 1: right, -1: left

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext()
        }, 8000)
        return () => clearInterval(interval)
    }, [currentIndex])

    const handleNext = () => {
        setDirection(1)
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 === testimonials.length ? 0 : prevIndex + 1
        )
    }

    const handlePrevious = () => {
        setDirection(-1)
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
        )
    }

    const handleDotClick = (index) => {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }

    const slideVariants = {
        hiddenRight: {
            x: "100%",
            opacity: 0
        },
        hiddenLeft: {
            x: "-100%",
            opacity: 0
        },
        visible: {
            x: "0",
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        },
        exit: {
            x: direction === 1 ? "-100%" : "100%",
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    }

    return (
        <section id="testimonials" className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-gray-900"></div>
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-900/10 blur-3xl"></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-3xl text-center"
                >
          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-4">
            <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
            Client Testimonials
          </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">visionaries</span>
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-300">
                        Hear from those who've transformed their productivity with our AI coaching
                    </p>
                </motion.div>

                <div className="relative mt-16">
                    {/* Carousel container */}
                    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial={direction === 1 ? "hiddenRight" : "hiddenLeft"}
                                animate="visible"
                                exit="exit"
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="relative h-full w-full max-w-4xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900/80 rounded-2xl"></div>
                                    <img
                                        src={testimonials[currentIndex].image}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover rounded-2xl opacity-30"
                                    />
                                    <div className="relative h-full flex flex-col justify-center p-12 sm:p-16 lg:p-20">
                                        <blockquote className="text-xl leading-8 text-white sm:text-2xl sm:leading-9">
                                            <p className="relative before:content-[''] before:absolute before:-left-4 before:-top-2 before:text-4xl before:text-indigo-400 before:opacity-50 before:font-serif">
                        {testimonials[currentIndex].quote}
                      </p>
                    </blockquote>
                    <figcaption className="mt-8">
                      <div className="flex items-center gap-x-4">
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].author}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-400"
                        />
                        <div>
                          <div className="font-semibold text-white">{testimonials[currentIndex].author}</div>
                          <div className="text-gray-400">{testimonials[currentIndex].role}</div>
                          <div className="mt-1 text-sm text-indigo-400">
                            {testimonials[currentIndex].achievement}
                          </div>
                        </div>
                      </div>
                    </figcaption>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/50 p-2 text-white shadow-lg hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/50 p-2 text-white shadow-lg hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Dots indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 w-8 rounded-full transition-all ${index === currentIndex ? 'bg-indigo-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}