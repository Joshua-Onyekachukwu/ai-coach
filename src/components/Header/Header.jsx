'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const navigation = [
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex lg:flex-1"
                >
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            alt="AI Coach Logo"
                            src={logo}
                            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 md:h-14 lg:h-14"
                        />
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-10">
                    {navigation.map((item) => (
                        <motion.a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 relative py-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-1 items-center justify-end gap-x-6"
                >
                    <Link
                        to="/login"
                        className="hidden text-sm font-semibold text-gray-900 hover:text-indigo-600 lg:block transition-colors"
                    >
                        Log in
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            to="/register"
                            className="rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-400 transition-all"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden">
                    <motion.button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Menu Panel */}
            <Transition show={mobileMenuOpen} as={Fragment}>
                <Dialog as="div" className="lg:hidden" onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="flex items-center gap-3">
                                <img
                                    alt="AI Coach Logo"
                                    src={logo}
                                    className="h-10 w-auto"
                                />
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <Link
                                        to="/login"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="-mx-3 mt-2 block rounded-lg bg-indigo-600 px-3 py-2 text-base font-semibold text-white hover:bg-indigo-500"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </header>
    )
}
