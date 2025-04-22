import React from 'react'
import { MessageCircle, CalendarClock, Target, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
    {
        icon: <Target className="w-8 h-8" />,
        title: "Set Smart Goals",
        description: "Define specific, measurable goals with AI guidance that breaks them into achievable milestones.",
        color: "from-indigo-500 to-purple-500",
        accent: "bg-indigo-500"
    },
    {
        icon: <CalendarClock className="w-8 h-8" />,
        title: "Schedule AI Sessions",
        description: "Plan voice check-ins with your AI coach using our intuitive scheduling system.",
        color: "from-amber-500 to-orange-500",
        accent: "bg-amber-500"
    },
    {
        icon: <MessageCircle className="w-8 h-8" />,
        title: "Maintain Consistency",
        description: "Get real-time feedback and encouragement to stay focused and accountable.",
        color: "from-emerald-500 to-teal-500",
        accent: "bg-emerald-500"
    }
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-24 bg-white overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-full max-w-4xl h-[800px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full opacity-40 blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 mb-6"
                    >
                        <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                        Simple 3-step process
                    </motion.div>

                    <motion.h2
                        className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        How Our <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">AI Coach</span> Works
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Transform your productivity in just three simple steps with personalized AI guidance.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            {/* Step number */}
                            <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${step.accent} shadow-md`}>
                                {index + 1}
                            </div>

                            {/* Main card */}
                            <div className={`h-full p-8 rounded-2xl bg-white border border-gray-200 shadow-sm group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 ${step.color} transition-opacity duration-500 -z-10`} />

                                {/* Icon container */}
                                <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${step.color} shadow-md`}>
                                    {React.cloneElement(step.icon, { className: "w-8 h-8 text-white" })}
                                </div>

                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 mb-6">{step.description}</p>

                                <div className="flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                                </div>

                                {/* Animated border bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
                                    <motion.div
                                        className={`h-full ${step.accent}`}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5, delay: index * 0.3 }}
                                        viewport={{ once: true }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Animated connector lines (desktop only) */}
                <div className="hidden md:flex items-center justify-center mt-8 relative">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            {index < steps.length - 1 && (
                                <motion.div
                                    className={`h-1 w-24 ${step.accent} opacity-30`}
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
                                    viewport={{ once: true }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}