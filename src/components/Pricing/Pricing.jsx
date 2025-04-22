'use client'

import { CheckIcon, StarIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const tiers = [
    {
        name: 'Starter',
        id: 'tier-starter',
        href: '/register',
        priceMonthly: '$19',
        description: 'Perfect for beginners building their first habits',
        features: [
            'Daily habit reminders',
            '3 active goals at a time',
            'Basic progress analytics',
            'Standard support (48h response)',
            'Mobile app access'
        ],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '/register',
        priceMonthly: '$49',
        description: 'For serious goal achievers needing advanced tools',
        features: [
            'Unlimited goals & habits',
            'AI-generated goal plans',
            'Advanced analytics dashboard',
            'Priority support (24h response)',
            'Weekly progress reports',
            'Voice check-in support',
            'Accountability partner matching'
        ],
        featured: true,
    },
    {
        name: 'Team',
        id: 'tier-team',
        href: '/register',
        priceMonthly: '$99',
        description: 'For groups and organizations',
        features: [
            'Everything in Pro',
            'Up to 5 team members',
            'Team progress tracking',
            'Admin dashboard',
            'Dedicated success manager',
            'Custom reporting',
            'API access'
        ],
        featured: false,
    }
]

export default function PricingSection() {
    return (
        <div id='pricing' className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            {/* Decorative background elements */}
            <div
                className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
                aria-hidden="true"
            >
                <div
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}
                    className="mx-auto max-w-4xl text-center"
                >
                    <div className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                        Pricing
                    </div>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Plans that grow with your <span className="text-indigo-600">ambition</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Whether you're building your first habit or leading a team, we have the right tools for you.
                    </p>
                </motion.div>

                {/* Pricing cards */}
                <motion.div
                    initial={{opacity: 0}}
                    whileInView={{opacity: 1}}
                    transition={{duration: 0.6, delay: 0.2}}
                    viewport={{once: true}}
                    className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-3"
                >
                    {tiers.map((tier) => (
                        <motion.div
                            key={tier.id}
                            whileHover={{y: -5}}
                            className={`
                                flex flex-col justify-between rounded-3xl p-8 shadow-lg ring-1 ring-gray-200
                                ${tier.featured ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
                            `}
                        >
                            <div>
                                {/* Popular badge */}
                                {tier.featured && (
                                    <div className="flex items-center gap-x-2 mb-4">
                                        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
                                            <StarIcon className="h-4 w-4 mr-1"/>
                                            Most popular
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold">{tier.name}</h3>
                                <p className="mt-4 text-sm">{tier.description}</p>

                                {/* Price */}
                                <div className="mt-6 flex items-baseline gap-x-2">
                                    <span className={`text-5xl font-bold ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                                        {tier.priceMonthly}
                                    </span>
                                    <span className={`text-sm font-semibold ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                                        /month
                                    </span>
                                </div>

                                {/* Features */}
                                <ul role="list" className="mt-8 space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <CheckIcon
                                                className={`h-5 w-5 flex-shrink-0 mt-0.5 mr-3 ${tier.featured ? 'text-indigo-400' : 'text-indigo-600'}`}
                                                aria-hidden="true"
                                            />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <motion.div
                                whileHover={{scale: 1.03}}
                                whileTap={{scale: 0.98}}
                                className="mt-10"
                            >
                                <Link
                                    to={tier.href}
                                    className={`
                                        block rounded-md px-3 py-2.5 text-center text-sm font-semibold leading-6 transition-all
                                        ${tier.featured
                                            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400'
                                            : 'bg-white text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                                        }
                                    `}
                                >
                                    Get started
                                </Link>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Enterprise option */}
                <motion.div
                    initial={{opacity: 0}}
                    whileInView={{opacity: 1}}
                    transition={{duration: 0.6, delay: 0.4}}
                    viewport={{once: true}}
                    className="mt-16 flex justify-center"
                >
                    <div className="mx-auto w-full max-w-3xl">
                        <motion.div
                            className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 sm:p-10 text-center shadow-2xl"
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, ease: "easeOut"}}
                            viewport={{once: true, margin: "-100px"}}
                        >
                            {/* Decorative floating elements */}
                            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-800/20 blur-[100px]"></div>
                            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-700/20 blur-[100px]"></div>

                            {/* Sparkle elements */}
                            <div className="absolute right-10 top-6 h-3 w-3 rounded-full bg-white/80 animate-pulse"></div>
                            <div className="absolute left-8 bottom-8 h-2 w-2 rounded-full bg-indigo-300/70 animate-pulse delay-300"></div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-700/30 backdrop-blur-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="h-8 w-8 text-white"
                                    >
                                        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
                                        <line x1="6" y1="1" x2="6" y2="4"/>
                                        <line x1="10" y1="1" x2="10" y2="4"/>
                                        <line x1="14" y1="1" x2="14" y2="4"/>
                                    </svg>
                                </div>

                                {/* Content */}
                                <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                                    Enterprise Solutions
                                </h3>
                                <p className="mx-auto mt-3 max-w-2xl text-lg text-indigo-100">
                                    Custom plans for organizations with specialized needs and larger teams.
                                </p>

                                {/* CTA Button */}
                                <motion.div
                                    className="mt-8"
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                >
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-900 shadow-md ring-1 ring-white/20 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300"
                                    >
                                        <span>Request Custom Quote</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path fillRule="evenodd"
                                                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>


                </motion.div>
            </div>
        </div>
    )
}