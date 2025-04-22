'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const stats = [
    {
        id: 1,
        name: 'Daily Check-ins with AI Coaches',
        value: '75,000+',
        icon: ArrowTrendingUpIcon,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
    },
    {
        id: 2,
        name: 'Goals Achieved with AI Support',
        value: '2.5 million',
        icon: CheckCircleIcon,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50'
    },
    {
        id: 3,
        name: 'Users Who Stay on Track Yearly',
        value: '90%',
        icon: ChartBarIcon,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
    },
]

export default function StatsSection() {
    return (
        <div className="relative bg-white py-24 sm:py-32 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-100 opacity-20 blur-3xl"></div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Image Container */}
                    <motion.div
                        className="relative lg:h-full"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-100/20 to-purple-100/20 -z-10"></div>
                        <img
                            alt="AI Accountability"
                            src="https://img.freepik.com/free-photo/group-people-with-laptops_23-2147993401.jpg?uid=R15707722&ga=GA1.1.2138330038.1725127456&semt=ais_hybrid&w=740"
                            className="w-full h-full object-cover rounded-2xl shadow-xl border border-gray-100"
                        />
                    </motion.div>

                    {/* Stats Content */}
                    <motion.div
                        className="mt-16 lg:mt-0"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6"
                        >
                            <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                            Our Proven Impact
                        </motion.div>

                        <motion.h2
                            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            Achieve <span className="text-indigo-600">more</span> with AI accountability
                        </motion.h2>

                        <motion.p
                            className="mt-6 text-lg leading-8 text-gray-600"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            Join thousands of users who are reaching their goals faster with personalized AI coaching and data-driven insights.
                        </motion.p>

                        <motion.div
                            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            {stats.map((stat) => (
                                <motion.div
                                    key={stat.id}
                                    className="flex flex-col gap-y-4 p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <dt className="text-sm font-medium text-gray-600">{stat.name}</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}