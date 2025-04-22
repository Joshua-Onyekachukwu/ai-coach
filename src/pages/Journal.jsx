import { useState, useEffect } from 'react';
import { db, auth } from '../components/Firebase.jsx';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiSave, FiX, FiClock } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Journal() {
    const [user] = useAuthState(auth);
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentJournal, setCurrentJournal] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mood: 'neutral'
    });

    // Mood options with emojis
    const moodOptions = [
        { id: 'happy', name: 'Happy', emoji: '😊' },
        { id: 'sad', name: 'Sad', emoji: '😢' },
        { id: 'angry', name: 'Angry', emoji: '😠' },
        { id: 'excited', name: 'Excited', emoji: '🤩' },
        { id: 'neutral', name: 'Neutral', emoji: '😐' },
        { id: 'tired', name: 'Tired', emoji: '😴' },
        { id: 'anxious', name: 'Anxious', emoji: '😰' }
    ];

    // Fetch all journals from Firestore for current user
    const fetchJournals = async () => {
        try {
            if (!user) return;

            setLoading(true);
            setError(null);

            const q = query(
                collection(db, 'journals'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            const journalsData = [];
            querySnapshot.forEach((doc) => {
                journalsData.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                    updatedAt: doc.data().updatedAt?.toDate() || null
                });
            });

            setJournals(journalsData);
        } catch (err) {
            console.error('Error fetching journals:', err);
            setError(err.message || 'Failed to load journals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewJournal = () => {
        setCurrentJournal(null);
        setFormData({
            title: '',
            content: '',
            mood: 'neutral'
        });
        setIsEditing(true);
    };

    const handleEditJournal = (journal) => {
        setCurrentJournal(journal);
        setFormData({
            title: journal.title,
            content: journal.content,
            mood: journal.mood || 'neutral'
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentJournal(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const journalData = {
                title: formData.title,
                content: formData.content,
                mood: formData.mood,
                userId: user.uid, // Critical for security rules
                updatedAt: serverTimestamp()
            };

            if (currentJournal) {
                // Update existing journal
                const journalRef = doc(db, 'journals', currentJournal.id);
                await updateDoc(journalRef, journalData);
            } else {
                // Create new journal
                journalData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'journals'), journalData);
            }

            await fetchJournals();
            setIsEditing(false);
            setCurrentJournal(null);
        } catch (err) {
            console.error('Error saving journal:', err);
            setError(err.message || 'Failed to save journal');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (journalId) => {
        if (window.confirm('Are you sure you want to delete this journal entry? This cannot be undone.')) {
            try {
                await deleteDoc(doc(db, 'journals', journalId));
                await fetchJournals();
            } catch (err) {
                console.error('Error deleting journal:', err);
                setError(err.message || 'Failed to delete journal');
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r mb-6">
                    <p className="text-blue-700">Please sign in to access your journal</p>
                </div>
            </div>
        );
    }

    if (loading && journals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Loading journals...</p>
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
                                onClick={fetchJournals}
                                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Journal</h1>
                <p className="mt-2 text-gray-600">Reflect on your thoughts and experiences</p>
            </div>

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {currentJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    maxLength={100}
                                />
                                <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
                            </div>

                            <div>
                                <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
                                    How are you feeling?
                                </label>
                                <select
                                    name="mood"
                                    id="mood"
                                    value={formData.mood}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {moodOptions.map(mood => (
                                        <option key={mood.id} value={mood.id}>
                                            {mood.emoji} {mood.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                    Your Thoughts*
                                </label>
                                <textarea
                                    name="content"
                                    id="content"
                                    rows="10"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                                <div className="flex justify-between mt-1">
                                    <p className="text-xs text-gray-500">
                                        {formData.content.split(/\s+/).filter(Boolean).length} words
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        <FiClock className="inline mr-1" />
                                        {getReadTime(formData.content)} min read
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    <FiSave className="mr-2" />
                                    {loading ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">
                            {journals.length} {journals.length === 1 ? 'Entry' : 'Entries'}
                        </h2>
                        <button
                            onClick={handleNewJournal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FiPlus className="mr-2" /> New Entry
                        </button>
                    </div>

                    {journals.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                <FiEdit className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No journal entries yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by writing your first journal entry.</p>
                            <div className="mt-6">
                                <button
                                    onClick={handleNewJournal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <FiPlus className="mr-2" /> Create your first entry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {journals.map(journal => {
                                const mood = moodOptions.find(m => m.id === journal.mood) || moodOptions.find(m => m.id === 'neutral');

                                return (
                                    <div key={journal.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-800">{journal.title}</h2>
                                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            {mood.emoji} {mood.name}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <FiClock className="mr-1" />
                                                            {getReadTime(journal.content)} min read
                                                        </span>
                                                        <span className="flex items-center">
                                                            {formatDate(journal.createdAt)}
                                                        </span>
                                                        {journal.updatedAt && (
                                                            <span className="text-gray-400 italic">
                                                                Edited
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditJournal(journal)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        aria-label="Edit journal entry"
                                                    >
                                                        <FiEdit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(journal.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        aria-label="Delete journal entry"
                                                    >
                                                        <FiTrash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 prose max-w-none text-gray-600 whitespace-pre-line">
                                                {journal.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}