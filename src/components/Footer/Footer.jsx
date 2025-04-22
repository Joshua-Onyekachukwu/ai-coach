import React from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo-white.png'

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const socialLinks = [
        { name: 'Twitter', url: '#', icon: '🐦' },
        { name: 'LinkedIn', url: '#', icon: '🔗' },
        { name: 'GitHub', url: '#', icon: '💻' },
        { name: 'Instagram', url: '#', icon: '📷' }
    ]

    return (
        <footer className="bg-gray-900 text-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Branding */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="space-y-6"
                    >
                        <a href="/" className="flex items-center gap-3 group">
                            <img
                                alt="AI Coach Logo"
                                src={logo}
                                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 md:h-14 lg:h-14"
                            />
                        </a>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering your goals with smart accountability. Stay consistent. Stay winning.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    className="text-gray-400 hover:text-indigo-400 text-xl"
                                    whileHover={{y: -2}}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.1}}
                    >
                        <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
                                <motion.li key={item} whileHover={{ x: 5 }}>
                                    <a
                                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-indigo-400 text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Resources */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {['Blog', 'Documentation', 'Community', 'Webinars'].map((item) => (
                                <motion.li key={item} whileHover={{ x: 5 }}>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-indigo-400 text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <div className="flex items-start gap-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <a
                                href="mailto:hello@aicoach.com"
                                className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                            >
                                hello@aicoach.com
                            </a>
                        </div>

                        <div className="mt-6">
                            <h5 className="text-sm font-medium text-white mb-2">Subscribe to our newsletter</h5>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-gray-800 text-white text-sm px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
                >
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} AI Coach. All rights reserved.
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Cookies</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}