import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../components/Firebase.jsx';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Starting auth state monitoring");
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User authenticated, fetching goals");
                fetchGoals(user);
            } else {
                console.log("No user is signed in");
                setLoading(false);
                setGoals([]);
                // Optionally redirect to login
                // navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchGoals = async (user) => {
        try {
            setLoading(true);
            setError(null);

            const goalsQuery = query(
                collection(db, 'goals'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            console.log("Executing Firestore query");
            const querySnapshot = await getDocs(goalsQuery);
            console.log(`Found ${querySnapshot.docs.length} goals`);

            const goalsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : null,
                    tasks: Array.isArray(data.tasks) ? data.tasks : []
                };
            });

            setGoals(goalsData);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setError('Failed to load your goals. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = (goal) => {
        if (!goal.tasks || goal.tasks.length === 0) return 0;
        const completedTasks = goal.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / goal.tasks.length) * 100);
    };

    const getStatusColor = (goal) => {
        const progress = calculateProgress(goal);
        if (progress >= 100) return 'bg-green-500';

        // Check if past due date
        if (goal.dueDate && new Date() > goal.dueDate) {
            return 'bg-red-500';
        }

        // Normal progress
        if (progress >= 70) return 'bg-green-500';
        if (progress >= 30) return 'bg-yellow-500';
        return 'bg-indigo-500';
    };

    const filterGoals = (status) => {
        setActiveFilter(status);
    };

    const getFilteredGoals = () => {
        switch (activeFilter) {
            case 'active':
                return goals.filter(goal =>
                    calculateProgress(goal) < 100 &&
                    (!goal.dueDate || new Date() <= goal.dueDate)
                );
            case 'completed':
                return goals.filter(goal => calculateProgress(goal) >= 100);
            case 'overdue':
                return goals.filter(goal =>
                    goal.dueDate &&
                    new Date() > goal.dueDate &&
                    calculateProgress(goal) < 100
                );
            default:
                return goals;
        }
    };

    const getGoalCategories = () => {
        const categories = {};
        goals.forEach(goal => {
            if (goal.category) {
                categories[goal.category] = (categories[goal.category] || 0) + 1;
            }
        });
        return categories;
    };

    const categoryCount = getGoalCategories();

    const handleRefresh = () => {
        const user = auth.currentUser;
        if (user) {
            fetchGoals(user);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Goals</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md"
                        disabled={loading}
                    >
                        <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate('/app/goals/create')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Goal
                    </button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => filterGoals('all')}
                    className={`px-4 py-2 rounded-md ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All Goals ({goals.length})
                </button>
                <button
                    onClick={() => filterGoals('active')}
                    className={`px-4 py-2 rounded-md ${activeFilter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Active
                </button>
                <button
                    onClick={() => filterGoals('completed')}
                    className={`px-4 py-2 rounded-md ${activeFilter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Completed
                </button>
                <button
                    onClick={() => filterGoals('overdue')}
                    className={`px-4 py-2 rounded-md ${activeFilter === 'overdue' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Overdue
                </button>
            </div>

            {/* Categories summary */}
            {Object.keys(categoryCount).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                    {Object.entries(categoryCount).map(([category, count]) => (
                        <div key={category} className="bg-white p-3 rounded-md shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">{category}</span>
                                <span className="text-sm font-bold text-indigo-600">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : getFilteredGoals().length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold mb-2">No goals found</h3>
                    <p className="text-gray-600 mb-6">
                        {activeFilter === 'all'
                            ? "You haven't created any goals yet."
                            : `You don't have any ${activeFilter} goals.`}
                    </p>
                    {activeFilter === 'all' && (
                        <button
                            onClick={() => navigate('/app/goals/create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md"
                        >
                            Create Your First Goal
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {getFilteredGoals().map(goal => (
                        <Link
                            to={`/app/goals/${goal.id}`}
                            key={goal.id}
                            className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6"
                        >

                            {goal.category && (
                                <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                                    {goal.category}
                                </div>
                            )}
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold mb-3">{goal.title}</h2>
                                {goal.priority && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                                        goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'}`
                                    }>
                                        {goal.priority}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${getStatusColor(goal)} h-2 rounded-full`}
                                        style={{ width: `${calculateProgress(goal)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-gray-500">Progress</span>
                                    <span className="text-xs font-medium">{calculateProgress(goal)}%</span>
                                </div>
                            </div>

                            {goal.dueDate && (
                                <div className="text-sm text-gray-600">
                                    {new Date() > goal.dueDate ? (
                                        <span className="text-red-600">
                                            Due {goal.dueDate.toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span>
                                            Due {goal.dueDate.toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            )}

                            {goal.tasks && goal.tasks.length > 0 && (
                                <div className="mt-3 text-sm text-gray-600">
                                    {goal.tasks.filter(task => task.completed).length} of {goal.tasks.length} tasks completed
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}