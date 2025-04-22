import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { motion } from "framer-motion";
import React from "react";

export default function ContactSection() {
    return (
        <div id='contact' className="relative isolate bg-gray-900">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    className="absolute inset-0 h-full w-full stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="pattern"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#pattern)" />
                </svg>
                <div
                    className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform-gpu blur-3xl"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20"
                        style={{
                            clipPath:
                                'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                        }}
                    />
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48"
                >
                    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6"
                        >
                            <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
                            Contact Us
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                        >
                            Get in touch
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 text-lg leading-8 text-gray-300"
                        >
                            Have questions or want to discuss a project? Reach out to our team and we'll get back to you as soon as possible.
                        </motion.p>

                        <motion.dl
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-10 space-y-4 text-base leading-7 text-gray-300"
                        >
                            <ContactInfoItem
                                icon={<BuildingOffice2Icon className="h-6 w-6 text-gray-400" />}
                                label="Address"
                                info={
                                    <>
                                        545 Mavis Island<br />
                                        Chicago, IL 99191
                                    </>
                                }
                            />
                            <ContactInfoItem
                                icon={<PhoneIcon className="h-6 w-6 text-gray-400" />}
                                label="Telephone"
                                info={<a href="tel:+1 (555) 234-5678" className="hover:text-white">+1 (555) 234-5678</a>}
                            />
                            <ContactInfoItem
                                icon={<EnvelopeIcon className="h-6 w-6 text-gray-400" />}
                                label="Email"
                                info={<a href="mailto:hello@example.com" className="hover:text-white">hello@example.com</a>}
                            />
                        </motion.dl>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    action="#"
                    method="POST"
                    className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
                >
                    <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <FormInput
                                id="first-name"
                                name="first-name"
                                label="First name"
                                type="text"
                                autoComplete="given-name"
                            />
                            <FormInput
                                id="last-name"
                                name="last-name"
                                label="Last name"
                                type="text"
                                autoComplete="family-name"
                            />
                            <FormInput
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                autoComplete="email"
                                fullWidth
                            />
                            <FormInput
                                id="phone-number"
                                name="phone-number"
                                label="Phone number"
                                type="tel"
                                autoComplete="tel"
                                fullWidth
                            />
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white">
                                    Message
                                </label>
                                <div className="mt-2.5">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="block w-full rounded-md bg-white/5 border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Send message
                            </motion.button>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    )
}

function ContactInfoItem({ icon, label, info }) {
    return (
        <div className="flex gap-x-4">
            <dt className="flex-none">
                <span className="sr-only">{label}</span>
                {icon}
            </dt>
            <dd>{info}</dd>
        </div>
    )
}

function FormInput({ id, name, label, type, autoComplete, fullWidth = false }) {
    return (
        <div className={fullWidth ? 'sm:col-span-2' : ''}>
            <label htmlFor={id} className="block text-sm font-semibold leading-6 text-white">
                {label}
            </label>
            <div className="mt-2.5">
                <input
                    id={id}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    className="block w-full rounded-md bg-white/5 border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    )
}