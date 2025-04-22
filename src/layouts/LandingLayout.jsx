import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './LandingLayout.css'

const LandingLayout = ({ children }) => {
    return (
        <div className="landing-layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default LandingLayout;