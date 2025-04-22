import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../components/Firebase.jsx';

const GOAL_CATEGORIES = [
    { id: 'health', name: 'Health & Fitness', emoji: '💪' },
    { id: 'career', name: 'Career & Work', emoji: '💼' },
    { id: 'education', name: 'Education & Learning', emoji: '📚' },
    { id: 'finance', name: 'Finance & Money', emoji: '💰' },
    { id: 'personal', name: 'Personal Growth', emoji: '🌱' },
    { id: 'relationship', name: 'Relationships', emoji: '❤️' },
    { id: 'hobby', name: 'Hobbies & Recreation', emoji: '🎨' },
    { id: 'spiritual', name: 'Spiritual', emoji: '🧘' },
    { id: 'other', name: 'Other', emoji: '✨' }
];

// Goal templates to help users get started
const GOAL_TEMPLATES = [
    {
        category: 'health',
        title: 'Complete a 5K run',
        description: 'Train progressively to be able to run 5 kilometers without stopping',
        priority: 'Medium',
        smart: {
            specific: 'Train to run 5K without stopping',
            measurable: 'Track distance covered in each training session',
            achievable: 'Gradually increase distance each week',
            relevant: 'Improve cardiovascular health and overall fitness',
            timeBound: 'Complete within 3 months'
        },
        tasks: [
            { text: 'Get proper running shoes', completed: false },
            { text: 'Create a training schedule', completed: false },
            { text: 'Run 3 times per week', completed: false }
        ]
    },
    {
        category: 'career',
        title: 'Learn a new professional skill',
        description: 'Enhance my career options by learning a valuable new skill',
        priority: 'High',
        smart: {
            specific: 'Complete online course in the chosen skill',
            measurable: 'Earn certification or create portfolio pieces',
            achievable: 'Allocate 5 hours per week for learning',
            relevant: 'Will help advance my career path',
            timeBound: 'Complete within 2 months'
        },
        tasks: [
            { text: 'Research available courses', completed: false },
            { text: 'Enroll in selected course', completed: false },
            { text: 'Complete weekly assignments', completed: false }
        ]
    },
    {
        category: 'finance',
        title: 'Build an emergency fund',
        description: 'Save money for unexpected expenses and financial security',
        priority: 'High',
        smart: {
            specific: 'Save 3 months of living expenses',
            measurable: 'Track monthly savings amount',
            achievable: 'Set aside 10% of income each month',
            relevant: 'Provides financial security and peace of mind',
            timeBound: 'Complete within 1 year'
        },
        tasks: [
            { text: 'Calculate target amount', completed: false },
            { text: 'Open a dedicated savings account', completed: false },
            { text: 'Set up automatic transfers', completed: false }
        ]
    }
];

export default function CreateGoal() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const [activeGoalsCount, setActiveGoalsCount] = useState(0);

    // Form data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [tasks, setTasks] = useState([{ text: '', completed: false }]);
    const [milestones, setMilestones] = useState([{ title: '', dueDate: '', completed: false }]);
    const [reminder, setReminder] = useState('daily');

    // Smart goal elements
    const [specific, setSpecific] = useState('');
    const [measurable, setMeasurable] = useState('');
    const [achievable, setAchievable] = useState('');
    const [relevant, setRelevant] = useState('');
    const [timeBound, setTimeBound] = useState('');

    // Get current date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    // Calculate default due date (30 days from now)
    const getDefaultDueDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                console.log("🔒 No authenticated user. Redirecting to login...");
                navigate('/login');
                return;
            }

            console.log("✅ Authenticated user:", user.uid);

            try {
                const goalsRef = collection(db, 'goals');
                const goalsQuery = query(goalsRef, where('userId', '==', user.uid));
                const snapshot = await getDocs(goalsQuery);

                const goalsCount = snapshot.empty ? 0 : snapshot.docs.length;
                console.log(`📌 Found ${goalsCount} active goal(s)`);
                setActiveGoalsCount(goalsCount);

            } catch (error) {
                console.error('❌ Error fetching active goals:', error);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleAddTask = () => {
        setTasks([...tasks, { text: '', completed: false }]);
    };

    const handleRemoveTask = (index) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    };

    const handleTaskChange = (index, value) => {
        const newTasks = [...tasks];
        newTasks[index].text = value;
        setTasks(newTasks);
    };

    const handleAddMilestone = () => {
        setMilestones([...milestones, { title: '', dueDate: '', completed: false }]);
    };

    const handleRemoveMilestone = (index) => {
        const newMilestones = [...milestones];
        newMilestones.splice(index, 1);
        setMilestones(newMilestones);
    };

    const handleMilestoneChange = (index, field, value) => {
        const newMilestones = [...milestones];
        newMilestones[index][field] = value;
        setMilestones(newMilestones);
    };

    const nextStep = () => {
        setError('');

        // Validate current step
        if (step === 1) {
            if (!title.trim()) {
                setError('Please enter a goal title');
                return;
            }
            if (!category) {
                setError('Please select a category');
                return;
            }
            if (dueDate && new Date(dueDate) < new Date()) {
                setError('Due date cannot be in the past');
                return;
            }
        }

        // Show success message when moving from step 2 to 3
        if (step === 2) {
            setSuccessMessage('Great job defining your SMART goal!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }

        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const applyTemplate = (template) => {
        setTitle(template.title);
        setDescription(template.description);
        setCategory(template.category);
        setPriority(template.priority);

        // Set SMART goal elements
        setSpecific(template.smart.specific);
        setMeasurable(template.smart.measurable);
        setAchievable(template.smart.achievable);
        setRelevant(template.smart.relevant);
        setTimeBound(template.smart.timeBound);

        // Set tasks
        setTasks(template.tasks);

        // Set default due date (30 days from now)
        setDueDate(getDefaultDueDate());

        setShowTemplates(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No authenticated user!");
                setError('You must be logged in to create a goal');
                return;
            }

            // Basic validation
            if (!title.trim()) return setError('Goal title is required');
            if (!category) return setError('Please select a category');
            if (!GOAL_CATEGORIES.find(cat => cat.id === category)) return setError('Invalid category selected');
            if (!['Low', 'Medium', 'High'].includes(priority)) return setError('Invalid priority selected');

            // Filter and format tasks
            const filteredTasks = tasks
                .filter(task => task.text.trim() !== '')
                .map(task => ({
                    text: task.text.trim(),
                    completed: false
                }));

            if (filteredTasks.length === 0) {
                return setError('Please add at least one task');
            }

            // Filter and format milestones
            const filteredMilestones = milestones
                .filter(milestone => milestone.title.trim() !== '')
                .map(milestone => ({
                    title: milestone.title.trim(),
                    dueDate: milestone.dueDate && !isNaN(new Date(milestone.dueDate)) ? new Date(milestone.dueDate) : null,
                    completed: false
                }));

            const trimmedDescription = description?.trim() || '';
            const formattedDueDate = dueDate && !isNaN(new Date(dueDate)) ? new Date(dueDate) : null;

            const goalData = {
                userId: user.uid,
                title: title.trim(),
                description: trimmedDescription,
                category,
                priority,
                dueDate: formattedDueDate,
                tasks: filteredTasks,
                milestones: filteredMilestones,
                smart: {
                    specific,
                    measurable,
                    achievable,
                    relevant,
                    timeBound
                },
                reminder,
                progress: 0,
                completed: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            console.log("Submitting goal:", goalData);

            const docRef = await addDoc(collection(db, 'goals'), goalData);

            if (!docRef?.id) {
                console.error("No document ID returned from Firestore!");
                setError("Error: Could not retrieve the goal ID");
                return;
            }

            console.log("Goal created with ID:", docRef.id);
            navigate(`/app/goals/${docRef.id}`);

        } catch (error) {
            console.error('Error creating goal:', error);

            if (error.code === 'permission-denied') {
                setError('Permission denied. This could be due to Firestore rules. Please check that all required fields are valid.');
            } else if (error.code === 'unavailable') {
                setError('The service is currently unavailable. Please try again later.');
            } else {
                setError(`Error creating goal: ${error.message}`);
            }

            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryEmoji = (categoryId) => {
        const category = GOAL_CATEGORIES.find(cat => cat.id === categoryId);
        return category ? category.emoji : '✨';
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/app/goals')}
                    className="mr-4 text-gray-600 hover:text-indigo-600"
                    aria-label="Back to goals"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h1 className="text-3xl font-bold">Create New Goal</h1>
            </div>

            {/* Active goals summary */}
            {activeGoalsCount > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-800">
                    <p className="flex items-center">
                        <span className="mr-2">📊</span>
                        You currently have {activeGoalsCount} active goal{activeGoalsCount !== 1 ? 's' : ''}.
                    </p>
                </div>
            )}

            {/* Progress steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            1
                        </div>
                        <div className="ml-2 text-sm font-medium">Basic Info</div>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            2
                        </div>
                        <div className="ml-2 text-sm font-medium">SMART Framework</div>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            3
                        </div>
                        <div className="ml-2 text-sm font-medium">Tasks & Milestones</div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 animate-pulse">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div>
                        {/* Template Selection */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                                </svg>
                                {showTemplates ? 'Hide Templates' : 'Use a Goal Template'}
                            </button>

                            {showTemplates && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                                    {GOAL_TEMPLATES.map((template, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 cursor-pointer"
                                            onClick={() => applyTemplate(template)}
                                        >
                                            <div className="flex items-center mb-2">
                                                <span className="text-xl mr-2">{getCategoryEmoji(template.category)}</span>
                                                <h3 className="font-medium">{template.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Use Template
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                                Goal Title*
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="What do you want to achieve?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="3"
                                placeholder="Why is this goal important to you?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Category*
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {GOAL_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`flex items-center p-3 border rounded-md hover:border-indigo-500 ${
                                            category === cat.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                                        }`}
                                        onClick={() => setCategory(cat.id)}
                                    >
                                        <span className="text-xl mr-2">{cat.emoji}</span>
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="priority">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="dueDate">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    min={today}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: SMART Framework */}
                {step === 2 && (
                    <div>
                        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                            <h3 className="font-bold text-indigo-800 mb-2">The SMART Goal Framework</h3>
                            <p className="text-sm text-indigo-700">
                                Make your goal Specific, Measurable, Achievable, Relevant, and Time-bound to increase your chances of success.
                            </p>
                        </div>

                        {category && (
                            <div className="mb-6 p-3 border-l-4 border-indigo-300 bg-indigo-50">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">{getCategoryEmoji(category)}</span>
                                    <h3 className="font-medium text-indigo-800">{title}</h3>
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="specific">
                                Specific
                            </label>
                            <textarea
                                id="specific"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                                placeholder="What exactly do you want to accomplish?"
                                value={specific}
                                onChange={(e) => setSpecific(e.target.value)}
                            ></textarea>
                            <p className="mt-1 text-sm text-gray-500">
                                Example: "Run a half marathon" instead of "Get fit"
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="measurable">
                                Measurable
                            </label>
                            <textarea
                                id="measurable"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                                placeholder="How will you track your progress and measure success?"
                                value={measurable}
                                onChange={(e) => setMeasurable(e.target.value)}
                            ></textarea>
                            <p className="mt-1 text-sm text-gray-500">
                                Example: "Complete a 13.1 mile run" with tracking of weekly mileage
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="achievable">
                                Achievable
                            </label>
                            <textarea
                                id="achievable"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                                placeholder="Is this goal realistic given your resources and constraints?"
                                value={achievable}
                                onChange={(e) => setAchievable(e.target.value)}
                            ></textarea>
                            <p className="mt-1 text-sm text-gray-500">
                                Consider your available time, skills, and other commitments
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="relevant">
                                Relevant
                            </label>
                            <textarea
                                id="relevant"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                                placeholder="Why does this matter to you? How does it align with your larger goals?"
                                value={relevant}
                                onChange={(e) => setRelevant(e.target.value)}
                            ></textarea>
                            <p className="mt-1 text-sm text-gray-500">
                                Connect this goal to your values and long-term vision
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="timeBound">
                                Time-bound
                            </label>
                            <textarea
                                id="timeBound"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                                placeholder="What's your timeline? When will you achieve this by?"
                                value={timeBound}
                                onChange={(e) => setTimeBound(e.target.value)}
                            ></textarea>
                            <p className="mt-1 text-sm text-gray-500">
                                Set specific deadlines for your goal and milestones
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: Tasks & Milestones */}
                {step === 3 && (
                    <div>
                        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                            <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">{getCategoryEmoji(category)}</span>
                                <h3 className="font-medium text-indigo-800">{title}</h3>
                            </div>
                            {dueDate && (
                                <p className="text-sm text-indigo-600">
                                    Target completion: {new Date(dueDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-gray-700 font-medium">
                                    Tasks
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddTask}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Add Task
                                </button>
                            </div>

                            {tasks.map((task, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <input
                                        type="text"
                                        className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder={`Task ${index + 1}`}
                                        value={task.text}
                                        onChange={(e) => handleTaskChange(index, e.target.value)}
                                    />
                                    {tasks.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTask(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                            <p className="text-sm text-gray-500 mt-2">
                                Break down your goal into smaller, actionable tasks
                            </p>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-gray-700 font-medium">
                                    Milestones (Optional)
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddMilestone}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Add Milestone
                                </button>
                            </div>

                            {milestones.map((milestone, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md mb-3">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium mb-2">Milestone {index + 1}</h4>
                                        {milestones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMilestone(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Milestone title"
                                            value={milestone.title}
                                            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={milestone.dueDate}
                                            onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                                            min={today}
                                        />
                                    </div>
                                </div>
                            ))}
                            <p className="text-sm text-gray-500 mt-2">
                                Add key milestones to track your progress
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="reminder">
                                Reminder Frequency
                            </label>
                            <select
                                id="reminder"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={reminder}
                                onChange={(e) => setReminder(e.target.value)}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="none">None</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-2">
                                How often would you like to be reminded about this goal?
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Goal
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>

            {/* Helpful tips */}
            {step === 1 && (
                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Tips for Setting Effective Goals:</h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                        <li className="flex items-start">
                            <span className="mr-2">✨</span>
                            <span>Be specific about what you want to achieve</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">📊</span>
                            <span>Make sure your goal is measurable so you can track progress</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">⚖️</span>
                            <span>Set ambitious but realistic goals that challenge you appropriately</span>
                        </li>
                    </ul>
                </div>
            )}

            {step === 2 && (
                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">About SMART Goals:</h3>
                    <p className="text-sm text-blue-700 mb-2">
                        SMART goals help you clarify your ideas, focus your efforts, use your time and resources effectively, and increase your chances of achieving what you want.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li><strong>S</strong>pecific: Clear and well-defined</li>
                        <li><strong>M</strong>easurable: Quantifiable progress and end result</li>
                        <li><strong>A</strong>chievable: Realistic and attainable</li>
                        <li><strong>R</strong>elevant: Worthwhile and aligned with your values</li>
                        <li><strong>T</strong>ime-bound: Has a target date for completion</li>
                    </ul>
                </div>
            )}

            {step === 3 && (
                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Tips for Task Breakdown:</h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                        <li className="flex items-start">
                            <span className="mr-2">📝</span>
                            <span>Break your goal into small, actionable tasks that can be completed in a single session</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">🏆</span>
                            <span>Set milestones to celebrate progress and maintain motivation</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">⏰</span>
                            <span>Consider using reminders to stay consistent with your efforts</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}