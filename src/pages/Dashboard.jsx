import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../components/Firebase.jsx';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { ProgressBar } from '../components/ui/ProgressBar';
import { FiTarget, FiCalendar, FiMessageSquare, FiBook, FiChevronRight } from 'react-icons/fi';

export default function Dashboard() {
    const [userData, setUserData] = useState({ firstName: '', streak: 0 });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [recentGoals, setRecentGoals] = useState([]);
    const [journalEntryCount, setJournalEntryCount] = useState(0);
    const [completionRate, setCompletionRate] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // Fetch user data
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData({
                            firstName: userDoc.data().firstName || 'User',
                            streak: userDoc.data().streak || 0
                        });
                    }

                    // Fetch upcoming appointments
                    const today = new Date();
                    const appointmentsQuery = query(
                        collection(db, 'appointments'),
                        where('userId', '==', user.uid),
                        where('date', '>=', today),
                        orderBy('date', 'asc'),
                        limit(3)
                    );
                    const appointmentsSnapshot = await getDocs(appointmentsQuery);
                    const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        date: doc.data().date.toDate()
                    }));
                    setUpcomingAppointments(appointmentsData);

                    // Fetch recent goals and calculate completion
                    const goalsQuery = query(
                        collection(db, 'goals'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc'),
                        limit(3)
                    );
                    const goalsSnapshot = await getDocs(goalsQuery);
                    const goalsData = goalsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt.toDate()
                    }));
                    setRecentGoals(goalsData);

                    // Calculate completion rate
                    const completedGoals = goalsData.filter(g => g.completed).length;
                    setCompletionRate(goalsData.length > 0 ? Math.round((completedGoals / goalsData.length) * 100) : 0);

                    // Count journal entries
                    const journalQuery = query(
                        collection(db, 'journalEntries'),
                        where('userId', '==', user.uid)
                    );
                    const journalSnapshot = await getDocs(journalQuery);
                    setJournalEntryCount(journalSnapshot.size);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {getGreeting()}, {userData.firstName}!
                    </h1>
                    <p className="mt-2 text-gray-600">Here's your personalized coaching overview</p>
                </div>
                <div className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
                    <span className="text-xl mr-2">🔥</span>
                    <span className="font-medium">{userData.streak}-day streak</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Goal Completion"
                    value={`${completionRate}%`}
                    icon={<FiTarget className="w-5 h-5" />}
                    color="indigo"
                    progress={completionRate}
                />
                <StatCard
                    title="Active Goals"
                    value={recentGoals.length}
                    icon={<FiTarget className="w-5 h-5" />}
                    color="blue"
                />
                <StatCard
                    title="Upcoming Sessions"
                    value={upcomingAppointments.length}
                    icon={<FiCalendar className="w-5 h-5" />}
                    color="purple"
                />
                <StatCard
                    title="Journal Entries"
                    value={journalEntryCount}
                    icon={<FiBook className="w-5 h-5" />}
                    color="pink"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <QuickAction
                        icon={<FiTarget className="w-6 h-6" />}
                        title="Set Goal"
                        to="/app/goals/create"
                        color="indigo"
                    />
                    <QuickAction
                        icon={<FiCalendar className="w-6 h-6" />}
                        title="Schedule"
                        to="/app/appointments"
                        color="blue"
                    />
                    <QuickAction
                        icon={<FiMessageSquare className="w-6 h-6" />}
                        title="AI Coach"
                        to="/app/coach"
                        color="purple"
                    />
                    <QuickAction
                        icon={<FiBook className="w-6 h-6" />}
                        title="Journal"
                        to="/app/journal"
                        color="pink"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
                        <Link to="/app/appointments" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                            View all <FiChevronRight className="ml-1" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((appointment) => (
                                <Link
                                    to={`/app/appointments/${appointment.id}`}
                                    key={appointment.id}
                                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatDate(appointment.date)}
                                            </p>
                                        </div>
                                        <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {appointment.type || 'Check-in'}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <p className="text-gray-500 mb-3">No upcoming sessions scheduled</p>
                                <Link
                                    to="/app/appointments/schedule"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Schedule Session
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Goals */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Goals</h2>
                        <Link to="/app/goals" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                            View all <FiChevronRight className="ml-1" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentGoals.length > 0 ? (
                            recentGoals.map((goal) => (
                                <Link
                                    to={`/app/goals/${goal.id}`}
                                    key={goal.id}
                                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start">
                                        <div className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900">{goal.title}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {goal.createdAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {goal.completed ? 'Completed' : `Target: ${new Date(goal.targetDate?.seconds * 1000).toLocaleDateString()}`}
                                            </p>
                                            {!goal.completed && (
                                                <div className="mt-2">
                                                    <ProgressBar
                                                        value={goal.progress || 0}
                                                        color={goal.progress > 70 ? 'green' : goal.progress > 30 ? 'yellow' : 'red'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <p className="text-gray-500 mb-3">You haven't set any goals yet</p>
                                <Link
                                    to="/app/goals/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Create Goal
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Motivation Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-center text-white">
                <h3 className="text-xl font-semibold mb-3">Today's Motivation</h3>
                <blockquote className="text-lg italic mb-4">
                    "Success is the sum of small efforts, repeated day in and day out."
                </blockquote>
                <p className="text-indigo-100">You're making progress every day!</p>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, color, progress }) {
    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            {progress !== undefined && (
                <div className="mt-4">
                    <ProgressBar value={progress} color={color} />
                </div>
            )}
        </div>
    );
}

// Quick Action Component
function QuickAction({ icon, title, to, color }) {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100'
    };

    return (
        <Link
            to={to}
            className={`${colorClasses[color]} rounded-lg p-4 flex flex-col items-center transition-colors`}
        >
            <div className="p-3 rounded-full bg-white shadow-sm mb-2">
                {icon}
            </div>
            <span className="font-medium text-sm">{title}</span>
        </Link>
    );
}