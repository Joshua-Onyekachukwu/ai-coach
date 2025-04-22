import React from 'react'

// Sections
import Hero from "../components/Hero/Hero"
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Features from '../components/Features/Features'
import BentoGrid from "../components/BentoGrid/BentoGrid"
import Stats from "../components/Stats/Stats"
import Testimonials from "../components/Testimonials/Testimonials"
import Pricing from "../components/Pricing/Pricing"
import Contact from "../components/Contact/Contact"
import CTA from '../components/CTA/CTA'

const Home = () => {
    return (
        <main className="space-y-20 md:space-y-28 lg:space-y-32">
            <Hero />
            <HowItWorks />
            <Features />
            <BentoGrid />
            <Stats />
            <Testimonials />
            <Pricing />
            <Contact />
            <CTA />
        </main>
    )
}

export default Home