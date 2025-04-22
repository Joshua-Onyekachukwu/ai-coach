'use client'

import { CloudArrowUpIcon, UserGroupIcon, RocketLaunchIcon, ArrowPathIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React from "react";

const features = [
    {
        name: 'Daily AI Check-ins',
        description: 'Start your day with an intelligent check-in that helps you stay aligned, focused, and motivated toward your goals.',
        icon: ArrowPathIcon,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50'
    },
    {
        name: 'Progress Analytics',
        description: 'Get visual insights into your habits and consistency with beautiful, actionable dashboards and reports.',
        icon: ChartBarIcon,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50'
    },
    {
        name: 'Smart Goal Tracking',
        description: 'Our AI breaks down your big goals into manageable steps and adjusts them based on your progress.',
        icon: LightBulbIcon,
        color: 'text-amber-500',
        bgColor: 'bg-amber-50'
    },
    {
        name: 'Accountability Network',
        description: 'Join a vetted community of high-performers who motivate each other to stay on track.',
        icon: UserGroupIcon,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50'
    },
]

export default function FeaturesSection() {
    return (
        <div id="features" className="relative overflow-hidden bg-white py-24 sm:py-32">
            {/* Decorative elements */}
            <div className="absolute -top-32 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl">
                <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                     style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Top Section - Side by Side */}
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center mb-20">
                    {/* TEXT SECTION */}
                    <motion.div
                        className="lg:pr-8"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        viewport={{once: true}}
                    >
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6}}
                            viewport={{once: true}}
                            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 mb-6"
                        >
                            <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                            AI-Powered Productivity
                        </motion.div>

                        <motion.h2
                            className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
                            initial={{opacity: 0}}
                            whileInView={{opacity: 1}}
                            transition={{delay: 0.3}}
                            viewport={{once: true}}
                        >
                            Transform how you <span className="text-indigo-600">achieve</span> your goals
                        </motion.h2>

                        <motion.p
                            className="mt-6 text-lg leading-8 text-gray-600"
                            initial={{opacity: 0}}
                            whileInView={{opacity: 1}}
                            transition={{delay: 0.4}}
                            viewport={{once: true}}
                        >
                            Our AI coach adapts to your unique workflow, providing personalized insights and
                            accountability to help you make consistent progress.
                        </motion.p>
                    </motion.div>

                    {/* IMAGE SECTION */}
                    <motion.div
                        className="relative"
                        initial={{opacity: 0, x: 50}}
                        whileInView={{opacity: 1, x: 0}}
                        transition={{duration: 0.6}}
                        viewport={{once: true}}
                    >
                        <div
                            className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl ring-1 ring-gray-900/10 lg:w-[576px] xl:w-[612px]">
                            {/* Placeholder for your screenshot - replace with actual image */}
                            <div className="absolute inset-0">
                                <img
                                    className="object-cover w-full h-full"
                                    src="https://img.freepik.com/free-photo/happy-african-american-professional-manager-smiling-looking-camera-headshot-portrait_1163-5134.jpg?uid=R15707722&ga=GA1.1.2138330038.1725127456&semt=ais_hybrid&w=740"
                                    alt="App preview"
                                />
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -left-16 top-20 -z-10 h-64 w-64 rounded-full bg-purple-500 opacity-20 blur-3xl"/>
                            <div className="absolute -right-16 bottom-20 -z-10 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"/>
                        </div>

                        {/* Floating metrics */}
                        <motion.div
                            className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-2">
                                    <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Weekly progress</p>
                                    <p className="text-lg font-semibold text-gray-900">+28%</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -top-8 -right-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200"
                            initial={{ y: -20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-lg bg-green-50 p-2">
                                    <ArrowPathIcon className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Consistency</p>
                                    <p className="text-lg font-semibold text-gray-900">94%</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Section - Feature Cards */}
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.name}
                                className="relative rounded-2xl p-6 transition-all hover:bg-gray-50 border border-gray-200"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                    {feature.name}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    {feature.description}
                                </p>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-gray-100 opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}