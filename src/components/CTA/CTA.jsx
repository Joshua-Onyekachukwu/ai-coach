'use client'
import { motion } from "framer-motion";
import {ArrowPathIcon, ChartBarIcon} from "@heroicons/react/24/outline/index.js";
import { Link } from 'react-router-dom';

export default function CTA() {
    return (
        <section className="bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-32 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl">
                <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 "
                     style={{
                         clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                     }}
                />
            </div>

            <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
                <motion.div
                    className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {/* Floating gradient circles */}
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>

                    <div className="mx-auto max-w-md lg:mx-0 lg:flex-auto lg:py-32">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20 mb-6"
                        >
                            <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                            Transform Your Productivity
                        </motion.div>

                        <motion.h2
                            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 text-left"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <span className="bg-gradient-to-r from-indigo-300 to-white bg-clip-text text-transparent">AI-Powered</span> Accountability Coaching
                        </motion.h2>

                        <motion.p
                            className="text-lg text-gray-300 mb-8 max-w-lg text-left"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Get personalized guidance, smart reminders, and data-driven insights to help you achieve your goals faster than ever before.
                        </motion.p>

                        <motion.div
                            className="flex items-center gap-x-6 lg:justify-start"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/register"
                                    className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
                                >
                                    Start Your Free Trial
                                </Link>
                            </motion.div>
                            <a
                                href="#how-it-works"
                                className="flex items-center text-sm font-semibold text-white hover:text-indigo-200 transition-colors"
                            >
                                See How It Works
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 ml-1">
                                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </motion.div>
                    </div>

                    <motion.div
                        className="relative mt-16 h-80 lg:mt-8 lg:h-[28rem]"
                        initial={{opacity: 0, scale: 0.9}}
                        whileInView={{opacity: 1, scale: 1}}
                        transition={{delay: 0.9, duration: 0.9}}
                    >
                        <div
                            className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl"></div>
                        <img
                            className="object-cover w-full h-full"
                            src="https://img.freepik.com/free-photo/happy-delighted-afro-girl-clenches-fists-feels-triumph-rejoices-victory-keeps-eyes-shut-smiles-broadly-wears-white-t-shirt-stands-indoor_273609-33297.jpg?uid=R15707722&ga=GA1.1.2138330038.1725127456&semt=ais_hybrid&w=740"
                            alt="App preview"
                        />
                        {/* Floating metrics */}
                        <motion.div
                            className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200"
                            initial={{y: 20, opacity: 0}}
                            whileInView={{y: 0, opacity: 1}}
                            transition={{delay: 0.8}}
                            viewport={{once: true}}
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-2">
                                    <ChartBarIcon className="h-5 w-5 text-indigo-600"/>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Weekly progress</p>
                                    <p className="text-lg font-semibold text-gray-900">+28%</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}