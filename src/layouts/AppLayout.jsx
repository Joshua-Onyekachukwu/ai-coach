import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../components/Firebase.jsx';
import { doc, getDoc } from 'firebase/firestore';

export default function AppLayout() {
    const [firstName, setFirstName] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setFirstName(userDoc.data().firstName || 'User');
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    return (
        <div className="flex flex-col bg-gray-50">
            {/* Main content container with proper positioning */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar for desktop - fixed height with scrolling */}
                <div className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white shadow-xl">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center px-4 py-5 flex-shrink-0">
                            <span className="text-xl font-bold flex items-center pt-5">
                                <span className="bg-white text-indigo-700 rounded-lg p-1 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </span>
                                AI Coach
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            <nav className="flex-1 px-2 py-4 space-y-1">
                                {[
                                    { to: "/app/dashboard", icon: "🏠", label: "Dashboard" },
                                    { to: "/app/goals", icon: "🎯", label: "Goals" },
                                    { to: "/app/appointments", icon: "📅", label: "Appointments" },
                                    { to: "/app/coach", icon: "🤖", label: "Coach Chat" },
                                    { to: "/app/journal", icon: "✍️", label: "Journal" },
                                    { to: "/app/settings", icon: "⚙️", label: "Settings" }
                                ].map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({isActive}) =>
                                            `${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'} group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200`
                                        }
                                    >
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                        <div className="p-4 border-t border-indigo-600">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                        {firstName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3 relative">
                                    <p className="text-sm font-medium text-white">{firstName}</p>
                                    <button
                                        onClick={toggleProfileDropdown}
                                        className="text-xs font-medium text-indigo-200 hover:text-white focus:outline-none"
                                    >
                                        Account ▾
                                    </button>
                                    {profileDropdownOpen && (
                                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <button
                                                onClick={handleSignOut}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                        onClick={closeMobileMenu}
                        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
                    ></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-indigo-700 to-indigo-800 transform transition-transform duration-300 ease-in-out h-full">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                onClick={closeMobileMenu}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="sr-only">Close sidebar</span>
                                <span className="text-white text-2xl">×</span>
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 overflow-y-auto">
                            <div className="flex items-center px-4">
                                <span className="text-xl text-white font-bold flex items-center">
                                    <span className="bg-white text-indigo-700 rounded-lg p-1 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </span>
                                    AI Coach
                                </span>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {[
                                    { to: "/app/dashboard", icon: "🏠", label: "Dashboard" },
                                    { to: "/app/goals", icon: "🎯", label: "Goals" },
                                    { to: "/app/appointments", icon: "📅", label: "Appointments" },
                                    { to: "/app/coach", icon: "🤖", label: "Coach Chat" },
                                    { to: "/app/journal", icon: "✍️", label: "Journal" },
                                    { to: "/app/settings", icon: "⚙️", label: "Settings" }
                                ].map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({isActive}) =>
                                            `${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'} group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200`
                                        }
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-indigo-600 p-4">
                            <div className="flex items-center">
                                <div>
                                    <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                        {firstName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-white">{firstName}</div>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-xs font-medium text-indigo-200 hover:text-white"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Mobile header */}
                    <div className="sticky top-0 z-10 md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={toggleMobileMenu}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center">
                            <span className="text-lg font-semibold text-indigo-700">AI Coach</span>
                        </div>
                        <div className="w-6"></div> {/* Spacer for balance */}
                    </div>

                    {/* Content area */}
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}