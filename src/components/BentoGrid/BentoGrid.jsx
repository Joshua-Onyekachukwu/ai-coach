'use client'

import { motion } from 'framer-motion'
import { CodeBracketIcon, ShieldCheckIcon, RocketLaunchIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import React from "react";

export default function FeatureGrid() {
    return (
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}
                    className="text-center"
                >
                    <h2 className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold bg-indigo-100 text-indigo-700 mb-6">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                        Achieve Your Goals Faster
                    </h2>
                    <h3 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        AI-powered <span className="text-indigo-600">Accountability Coaching</span> for Success
                    </h3>
                </motion.div>


                {/* Bento Grid - Proper 3-column layout */}
                <div className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-3">
                    {/* Left Column - Mobile Friendly (Full Height) */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.2}}
                        viewport={{once: true}}
                        className="relative overflow-hidden rounded-3xl bg-white shadow-xl lg:row-span-2"
                    >
                        <div
                            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                                    <DevicePhoneMobileIcon className="h-6 w-6 text-indigo-600"/>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Mobile Access</h4>
                            </div>
                            <p className="mt-4 text-gray-600">
                                Stay on track with mobile-friendly access to your AI-powered coach. Track your goals and
                                progress from anywhere.
                            </p>
                            <div
                                className="mt-8 h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                <img
                                    className="h-full w-full object-cover object-top"
                                    src="https://img.freepik.com/free-photo/woman-having-online-meeting-work_23-2148940756.jpg?uid=R15707722&ga=GA1.1.2138330038.1725127456&semt=ais_hybrid&w=740"
                                    alt="Mobile app preview"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Middle Column - Stacked Performance and Security */}
                    <div className="space-y-6">
                        {/* Performance Card */}
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: 0.3}}
                            viewport={{once: true}}
                            className="relative overflow-hidden rounded-3xl bg-white shadow-xl"
                        >
                            <div
                                className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-100 opacity-30 blur-3xl"></div>
                            <div className="p-8 sm:p-10">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                                        <RocketLaunchIcon className="h-6 w-6 text-amber-600"/>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900">Performance Tracking</h4>
                                </div>
                                <p className="mt-4 text-gray-600">
                                    Monitor your progress with real-time performance analytics. Stay accountable and
                                    adjust your actions for maximum success.
                                </p>
                                <div className="mt-8 flex justify-center">
                                    <img
                                        className="w-full max-w-xs"
                                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                                        alt="Performance metrics"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Security Card */}
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                            viewport={{once: true}}
                            className="relative overflow-hidden rounded-3xl bg-white shadow-xl"
                        >
                            <div
                                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100 opacity-30 blur-3xl"></div>
                            <div className="p-8 sm:p-10">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                                        <ShieldCheckIcon className="h-6 w-6 text-emerald-600"/>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900">Secure Data</h4>
                                </div>
                                <p className="mt-4 text-gray-600">
                                    Your privacy is our priority. Our system ensures that your data is fully protected
                                    with top-notch security measures.
                                </p>
                                <div className="mt-8 flex justify-center">
                                    <img
                                        className="h-40 object-contain"
                                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                                        alt="Security features"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Powerful APIs (Full Height) */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.5}}
                        viewport={{once: true}}
                        className="relative overflow-hidden rounded-3xl bg-white shadow-xl lg:row-span-2"
                    >
                        <div
                            className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-100 opacity-30 blur-3xl"></div>
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                                    <CodeBracketIcon className="h-6 w-6 text-purple-600"/>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Smart AI Coaching</h4>
                            </div>
                            <p className="mt-4 text-gray-600">
                                Our system uses advanced AI to provide personalized coaching and actionable insights
                                that guide you to success every step of the way.
                            </p>
                            <div
                                className="mt-8 h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                <img
                                    className="h-full w-full object-cover object-top"
                                    src="https://img.freepik.com/premium-photo/business-woman-talking-whiteboard-presentation-planning-explaining-with-hand-gesture-office-female-leader-speaker-training-mentoring-feedback-with-corporate-meeting_590464-402205.jpg?uid=R15707722&ga=GA1.1.2138330038.1725127456&semt=ais_hybrid&w=740"
                                    alt="Mobile app preview"
                                />
                            </div>
                            {/*<div className="mt-8 h-[400px] overflow-hidden rounded-xl bg-gray-900">*/}
                            {/*    <div className="flex border-b border-gray-700 bg-gray-800/50 text-sm">*/}
                            {/*        <div*/}
                            {/*            className="border-r border-gray-700 bg-gray-800 px-4 py-3 font-medium text-gray-200">*/}
                            {/*            NotificationSetting.jsx*/}
                            {/*        </div>*/}
                            {/*        <div className="px-4 py-3 text-gray-400">App.jsx</div>*/}
                            {/*    </div>*/}
                            {/*    <div className="px-6 pt-6 pb-14">*/}
                            {/*        <div className="space-y-4 text-gray-400">*/}
                            {/*            <div className="flex gap-4">*/}
                            {/*                <span className="text-purple-400">import</span>*/}
                            {/*                <span>React from 'react'</span>*/}
                            {/*            </div>*/}
                            {/*            <div className="flex gap-4">*/}
                            {/*                <span className="text-purple-400">import</span>*/}
                            {/*                <span>{`{ useNotifications } from './hooks'`}</span>*/}
                            {/*            </div>*/}
                            {/*            <div className="h-4"></div>*/}
                            {/*            <div className="flex gap-4">*/}
                            {/*                <span className="text-purple-400">export default</span>*/}
                            {/*                <span className="text-amber-300">function</span>*/}
                            {/*                <span className="text-blue-400">NotificationSettings</span>*/}
                            {/*                <span>() {'{'}</span>*/}
                            {/*            </div>*/}
                            {/*            <div className="ml-8 space-y-4">*/}
                            {/*                <div className="flex gap-4">*/}
                            {/*                    <span className="text-purple-400">const</span>*/}
                            {/*                    <span>{`{ settings, updateSettings } = `}</span>*/}
                            {/*                    <span className="text-blue-400">useNotifications</span>*/}
                            {/*                    <span>()</span>*/}
                            {/*                </div>*/}
                            {/*                <div className="h-4"></div>*/}
                            {/*                <div className="flex gap-4">*/}
                            {/*                    <span className="text-purple-400">return</span>*/}
                            {/*                    <span>(</span>*/}
                            {/*                </div>*/}
                            {/*                <div className="ml-8">*/}
                            {/*                    <div>{`<div className="space-y-6">`}</div>*/}
                            {/*                    <div*/}
                            {/*                        className="ml-8">{`<h3 className="text-lg font-medium">Notifications</h3>`}</div>*/}
                            {/*                    <div className="ml-8">{`<div className="space-y-4">`}</div>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}