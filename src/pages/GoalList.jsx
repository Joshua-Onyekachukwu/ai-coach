import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../components/Firebase.jsx';
import { Link } from 'react-router-dom';

// Component to list and debug goals
export default function GoalsList() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState({
        userId: null,
        queryExecuted: false,
        querySnapshot: null,
        authenticated: false
    });

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setLoading(true);
                const user = auth.currentUser;

                // Update debug info
                setDebugInfo(prev => ({
                    ...prev,
                    userId: user?.uid,
                    authenticated: !!user
                }));

                if (!user) {
                    throw new Error('User not authenticated');
                }

                // Create query
                const goalsQuery = query(
                    collection(db, 'goals'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );

                // Update debug info that query was executed
                setDebugInfo(prev => ({
                    ...prev,
                    queryExecuted: true
                }));

                // Execute query
                const querySnapshot = await getDocs(goalsQuery);

                // Update debug info with query results
                setDebugInfo(prev => ({
                    ...prev,
                    querySnapshot: {
                        size: querySnapshot.size,
                        empty: querySnapshot.empty
                    }
                }));

                // Process query results
                const goalsList = [];
                querySnapshot.forEach((doc) => {
                    goalsList.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setGoals(goalsList);
                console.log('Goals fetched:', goalsList);
            } catch (err) {
                console.error('Error fetching goals:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Goals</h1>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Goals</h1>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    Error: {error}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Troubleshooting:</h3>
                    <p className="text-sm">Please make sure you're logged in and try refreshing the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Goals</h1>
                <Link
                    to="/app/goals/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    New Goal
                </Link>
            </div>

            {/* Debug information - remove in production */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Debug Information</h3>
                <div className="text-sm">
                    <p>User authenticated: <span className={debugInfo.authenticated ? "text-green-600" : "text-red-600"}>{debugInfo.authenticated ? "Yes" : "No"}</span></p>
                    <p>User ID: {debugInfo.userId || "Not available"}</p>
                    <p>Query executed: <span className={debugInfo.queryExecuted ? "text-green-600" : "text-red-600"}>{debugInfo.queryExecuted ? "Yes" : "No"}</span></p>
                    {debugInfo.querySnapshot && (
                        <>
                            <p>Query results: {debugInfo.querySnapshot.size}</p>
                            <p>Query empty: <span className={debugInfo.querySnapshot.empty ? "text-red-600" : "text-green-600"}>{debugInfo.querySnapshot.empty ? "Yes" : "No"}</span></p>
                        </>
                    )}
                </div>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No goals yet</h3>
                    <p className="text-gray-500 mb-6">Create your first goal to start tracking your progress</p>
                    <Link
                        to="/app/goals/create"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Create Your First Goal
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal) => (
                        <Link
                            key={goal.id}
                            to={`/app/goals/${goal.id}`}
                            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-center mb-3">
                                <span className="text-2xl mr-3">
                                    {goal.category === 'health' && '💪'}
                                    {goal.category === 'career' && '💼'}
                                    {goal.category === 'education' && '📚'}
                                    {goal.category === 'finance' && '💰'}
                                    {goal.category === 'personal' && '🌱'}
                                    {goal.category === 'relationship' && '❤️'}
                                    {goal.category === 'hobby' && '🎨'}
                                    {goal.category === 'spiritual' && '🧘'}
                                    {goal.category === 'other' && '✨'}
                                </span>
                                <h3 className="text-lg font-semibold">{goal.title}</h3>
                            </div>

                            {/* Priority badge */}
                            <div className="flex items-center mb-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                                        goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                }`}>
                                    {goal.priority} Priority
                                </span>

                                {goal.dueDate && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        Due: {goal.dueDate.toDate().toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {/* Progress bar */}
                            <div className="mb-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full"
                                        style={{ width: `${goal.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{goal.progress || 0}% complete</span>
                                {goal.tasks && (
                                    <span>
                                        {goal.tasks.filter(task => task.completed).length} / {goal.tasks.length} tasks
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}