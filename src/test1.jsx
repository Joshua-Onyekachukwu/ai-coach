import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../components/Firebase.jsx';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Import icons (you can use react-icons or your preferred icon library)
import {
    FiCheck, FiCircle, FiTrash2, FiEdit, FiArrowLeft,
    FiCalendar, FiFlag, FiTag, FiList, FiPlus, FiX
} from 'react-icons/fi';

export default function GoalDetail() {
    const { goalId } = useParams();
    const navigate = useNavigate();
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'other',
        priority: 'Medium',
        description: '',
        dueDate: '',
        tasks: [],
        completed: false
    });
    const [newTask, setNewTask] = useState('');

    // Categories with emojis for better visual representation
    const validCategories = [
        { id: 'health', name: 'Health & Fitness', emoji: '💪' },
        { id: 'career', name: 'Career & Work', emoji: '💼' },
        { id: 'education', name: 'Education', emoji: '📚' },
        { id: 'finance', name: 'Finance', emoji: '💰' },
        { id: 'personal', name: 'Personal Growth', emoji: '🌱' },
        { id: 'relationship', name: 'Relationships', emoji: '❤️' },
        { id: 'hobby', name: 'Hobbies', emoji: '🎨' },
        { id: 'spiritual', name: 'Spiritual', emoji: '🧘' },
        { id: 'other', name: 'Other', emoji: '✨' }
    ];

    const validPriorities = [
        { id: 'Low', name: 'Low', color: 'bg-green-100 text-green-800' },
        { id: 'Medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'High', name: 'High', color: 'bg-red-100 text-red-800' }
    ];

    useEffect(() => {
        const fetchGoalDetails = async () => {
            try {
                if (!goalId) {
                    throw new Error('No goal ID provided');
                }

                setLoading(true);
                setError(null);

                const goalRef = doc(db, 'goals', goalId);
                const goalDoc = await getDoc(goalRef);

                if (!goalDoc.exists()) {
                    throw new Error('Goal not found');
                }

                const goalData = goalDoc.data();

                // Format dates for form inputs
                let formattedDueDate = '';
                if (goalData.dueDate) {
                    const dateObj = goalData.dueDate.toDate ?
                        goalData.dueDate.toDate() : goalData.dueDate;
                    formattedDueDate = dateObj.toISOString().split('T')[0];
                }

                // Ensure tasks array exists and has proper structure
                const formattedTasks = Array.isArray(goalData.tasks) ?
                    goalData.tasks.map(task => ({
                        title: task.title || task.text || '', // Handle both 'title' and 'text' fields
                        completed: task.completed || false
                    })) : [];

                setGoal({
                    id: goalDoc.id,
                    ...goalData,
                    dueDate: goalData.dueDate,
                    updatedAt: goalData.updatedAt
                });

                setFormData({
                    title: goalData.title || '',
                    category: validCategories.some(c => c.id === goalData.category) ?
                        goalData.category : 'other',
                    priority: validPriorities.some(p => p.id === goalData.priority) ?
                        goalData.priority : 'Medium',
                    description: goalData.description || '',
                    dueDate: formattedDueDate,
                    tasks: formattedTasks,
                    completed: goalData.completed || false
                });

            } catch (err) {
                console.error('Error fetching goal:', err);
                setError(err.message || 'Failed to load goal');
                navigate('/app/goals');
            } finally {
                setLoading(false);
            }
        };

        fetchGoalDetails();
    }, [goalId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleTaskToggle = (index) => {
        const updatedTasks = [...formData.tasks];
        updatedTasks[index] = {
            ...updatedTasks[index],
            completed: !updatedTasks[index].completed
        };
        setFormData(prev => ({ ...prev, tasks: updatedTasks }));
    };

    const addTask = () => {
        if (newTask.trim()) {
            setFormData(prev => ({
                ...prev,
                tasks: [...prev.tasks, { title: newTask.trim(), completed: false }]
            }));
            setNewTask('');
        }
    };

    const removeTask = (index) => {
        const updatedTasks = [...formData.tasks];
        updatedTasks.splice(index, 1);
        setFormData(prev => ({ ...prev, tasks: updatedTasks }));
    };

    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed).length;
        return Math.round((completed / tasks.length) * 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const goalRef = doc(db, 'goals', goalId);
            const progress = calculateProgress(formData.tasks);
            const dueDate = formData.dueDate ? new Date(formData.dueDate) : null;

            await updateDoc(goalRef, {
                title: formData.title,
                category: formData.category,
                priority: formData.priority,
                description: formData.description,
                dueDate: dueDate,
                tasks: formData.tasks,
                completed: formData.completed,
                progress: progress,
                updatedAt: serverTimestamp()
            });

            // Update local state with the new data
            setGoal(prev => ({
                ...prev,
                title: formData.title,
                category: formData.category,
                priority: formData.priority,
                description: formData.description,
                dueDate: dueDate,
                tasks: formData.tasks,
                completed: formData.completed,
                progress: progress,
                updatedAt: new Date()
            }));

            setIsEditing(false);
        } catch (err) {
            console.error('Error updating goal:', err);
            setError(err.message || 'Failed to update goal');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this goal? This cannot be undone.')) {
            try {
                await deleteDoc(doc(db, 'goals', goalId));
                navigate('/app/goals');
            } catch (err) {
                console.error('Error deleting goal:', err);
                setError(err.message || 'Failed to delete goal');
            }
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return 'No date set';
        try {
            const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (err) {
            console.error("Date formatting error:", err);
            return 'Invalid date';
        }
    };

    const getDaysRemaining = (dueDate) => {
        if (!dueDate) return null;
        try {
            const date = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
            const diff = date - new Date();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        } catch (err) {
            console.error("Error calculating days remaining:", err);
            return null;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Loading goal details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                            <button
                                onClick={() => navigate('/app/goals')}
                                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FiArrowLeft className="mr-1" /> Back to Goals
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!goal) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r mb-6">
                    <p className="text-yellow-700">Goal not found</p>
                </div>
                <button
                    onClick={() => navigate('/app/goals')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <FiArrowLeft className="mr-2" /> Return to Goals
                </button>
            </div>
        );
    }

    const progress = calculateProgress(goal.tasks);
    const daysRemaining = getDaysRemaining(goal.dueDate);
    const categoryData = validCategories.find(c => c.id === goal.category) || validCategories.find(c => c.id === 'other');
    const priorityData = validPriorities.find(p => p.id === goal.priority) || validPriorities.find(p => p.id === 'Medium');

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <button
                    onClick={() => navigate('/app/goals')}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <FiArrowLeft className="mr-2" /> Back to Goals
                </button>
                <div className="flex space-x-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FiEdit className="mr-2" /> Edit
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Main Card */}
            <div className={`bg-white rounded-xl shadow-md overflow-hidden ${goal.completed ? 'border-l-4 border-green-500' : ''}`}>
                {/* Header with status */}
                <div className={`px-6 py-4 ${goal.completed ? 'bg-green-50' : 'bg-indigo-50'} border-b`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className={`text-2xl font-bold ${goal.completed ? 'text-green-800' : 'text-indigo-800'}`}>
                                {goal.title}
                            </h1>
                            <div className="flex flex-wrap items-center mt-2 gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityData.color}`}>
                                    <FiFlag className="mr-1" /> {priorityData.name}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {categoryData.emoji} {categoryData.name}
                                </span>
                                {goal.completed && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <FiCheck className="mr-1" /> Completed
                                    </span>
                                )}
                            </div>
                        </div>
                        {daysRemaining !== null && (
                            <div className={`mt-3 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${daysRemaining > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                <FiCalendar className="inline mr-1" />
                                {daysRemaining > 0 ? (
                                    `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                                ) : (
                                    'Past due date'
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Form fields */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Title*
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                        Category*
                                    </label>
                                    <select
                                        name="category"
                                        id="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        {validCategories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.emoji} {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                        Priority*
                                    </label>
                                    <select
                                        name="priority"
                                        id="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        {validPriorities.map(priority => (
                                            <option key={priority.id} value={priority.id}>
                                                {priority.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="completed"
                                        id="completed"
                                        checked={formData.completed}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                                        Mark as completed
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    id="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* Tasks Section */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tasks
                                    </label>
                                    <span className="text-sm text-gray-500">
                                        {calculateProgress(formData.tasks)}% completed
                                    </span>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {formData.tasks.map((task, index) => (
                                        <div key={index} className="flex items-center group">
                                            <button
                                                type="button"
                                                onClick={() => handleTaskToggle(index)}
                                                className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-100 text-green-600' : 'border border-gray-300 text-transparent'}`}
                                            >
                                                {task.completed && <FiCheck className="h-3 w-3" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={task.title}
                                                onChange={(e) => {
                                                    const updatedTasks = [...formData.tasks];
                                                    updatedTasks[index].title = e.target.value;
                                                    setFormData(prev => ({ ...prev, tasks: updatedTasks }));
                                                }}
                                                className={`ml-2 block flex-1 border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 py-1 px-1 sm:text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeTask(index)}
                                                className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                            >
                                                <FiX className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 flex">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                        placeholder="Add a new task"
                                        className="block flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTask}
                                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <FiPlus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Form actions */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <FiTrash2 className="mr-2" /> Delete Goal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-sm font-medium text-gray-700">Progress</h3>
                                    <span className="text-sm font-medium text-indigo-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-indigo-600'}`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Description */}
                            {goal.description && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{goal.description}</p>
                                </div>
                            )}

                            {/* Due Date */}
                            {goal.dueDate && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                                    <p className="text-gray-600">
                                        <FiCalendar className="inline mr-1" />
                                        {formatDate(goal.dueDate)}
                                    </p>
                                </div>
                            )}

                            {/* Tasks */}
                            {goal.tasks && goal.tasks.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            <FiList className="inline mr-1" /> Tasks
                                        </h3>
                                        <span className="text-xs text-gray-500">
                {goal.tasks.filter(t => t.completed).length} of {goal.tasks.length} completed
            </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {goal.tasks.map((task, index) => (
                                            <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-100 text-green-600' : 'border border-gray-300'}`}>
                        {task.completed && <FiCheck className="h-3 w-3" />}
                    </span>
                                                <span className={`ml-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.title}  {/* This should display the task text */}
                    </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Last updated */}
                            {goal.updatedAt && (
                                <div className="pt-4 mt-4 border-t border-gray-200 text-xs text-gray-500">
                                    Last updated: {formatDate(goal.updatedAt)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}