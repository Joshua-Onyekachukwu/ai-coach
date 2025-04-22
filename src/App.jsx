import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
//
// import { useEffect, useState } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../components/Firebase';


// Layout Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


//
// // Layout components
import AppLayout from './layouts/AppLayout';
// import LandingLayout from './layouts/LandingLayout';


// Public Pages
import Home from './pages/Home';
import Signin from './pages/Signin/Signin';
import Register from './pages/Register/Register';


// Authenticated App Pages
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import GoalDetail from './pages/Detail.jsx';
import CreateGoal from './pages/CreateGoal.jsx';
import Appointments from './pages/Appointments';
import AppointmentDetail from "./pages/AppointmentDetail.jsx";
// import Coach from './pages/Coach';
import Journal from './pages/Journal.jsx';
// import Settings from './pages/Settings.jsx';


const App = () => {

    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Signin />} />
                    <Route path="/register" element={<Register />} />

                    {/*Authenticated Routes*/}
                    <Route element={<AppLayout />}>
                        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
                        <Route path="/app/dashboard" element={<Dashboard />} />
                        <Route path="/app/goals" element={<Goals />} />
                        <Route path="/app/goals/create" element={<CreateGoal />} />
                        <Route path="/app/goals/:goalId" element={<GoalDetail />} />
                        <Route path="/app/appointments" element={<Appointments />} />
                        <Route path="/app/appointments/:id" element={<AppointmentDetail />} />
                        {/*<Route path="/app/coach" element={<Coach />} />*/}
                        <Route path="/app/journal" element={<Journal />} />
                        {/*<Route path="/app/settings" element={<Settings />} />*/}
                    </Route>
                </Routes>
            </main>

            <Footer />
        </div>
    );
};

export default App;
