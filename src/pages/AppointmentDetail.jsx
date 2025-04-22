import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {doc, getDoc, updateDoc, deleteDoc, serverTimestamp} from 'firebase/firestore';
import { auth, db } from '../components/Firebase';

export default function AppointmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('30');
    const [coach, setCoach] = useState('AI Coach');
    const [status, setStatus] = useState('scheduled');

    // Fetch appointment details
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error('You must be logged in to view this appointment');
                }

                const docRef = doc(db, 'appointments', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error('Appointment not found');
                }

                const data = docSnap.data();

                // Check if the appointment belongs to the current user
                if (data.userId !== user.uid) {
                    throw new Error('You do not have permission to view this appointment');
                }

                // Convert Firestore timestamp to date string
                const appointmentDate = data.date.toDate();
                const dateStr = appointmentDate.toISOString().split('T')[0];
                const timeStr = appointmentDate.toTimeString().substring(0, 5);

                setAppointment({
                    id: docSnap.id,
                    ...data,
                    date: dateStr,
                    time: timeStr
                });

                // Set form fields
                setTitle(data.title);
                setDescription(data.description || '');
                setDate(dateStr);
                setTime(timeStr);
                setDuration(data.duration.toString());
                setCoach(data.coach || 'AI Coach');
                setStatus(data.status || 'scheduled');

                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointment:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setIsEditing(false);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('You must be logged in to update an appointment');
            }

            if (!title.trim()) {
                throw new Error('Appointment title is required');
            }

            if (!date || !time) {
                throw new Error('Date and time are required');
            }

            // Combine date and time into a single timestamp
            const dateTime = new Date(`${date}T${time}`);
            if (dateTime < new Date()) {
                throw new Error('Appointment cannot be in the past');
            }

            const appointmentRef = doc(db, 'appointments', id);
            await updateDoc(appointmentRef, {
                title,
                description,
                date: dateTime,
                duration: parseInt(duration),
                coach,
                status,
                updatedAt: serverTimestamp()
            });

            // Update local state
            setAppointment({
                ...appointment,
                title,
                description,
                date,
                time,
                duration,
                coach,
                status
            });

        } catch (error) {
            console.error('Error updating appointment:', error);
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'appointments', id));
            navigate('/app/appointments');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setError(error.message);
            setIsDeleting(false);
        }
    };

    const formatDateTime = (dateStr, timeStr) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(`${dateStr}T${timeStr}`).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            scheduled: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            canceled: 'bg-red-100 text-red-800',
            rescheduled: 'bg-purple-100 text-purple-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/app/appointments')}
                    className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/app/appointments')}
                className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Appointments
            </button>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Appointment Details</h1>
                <div className="flex space-x-2">
                    {!isEditing && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Canceling...
                                    </>
                                ) : (
                                    'Cancel Appointment'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {isEditing ? (
                <div className="bg-white rounded-xl shadow p-6">
                    <form onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Title*</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Coach</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={coach}
                                    onChange={(e) => setCoach(e.target.value)}
                                >
                                    <option value="AI Coach">AI Coach</option>
                                    <option value="Professional Coach">Professional Coach</option>
                                    <option value="Mentor">Mentor</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Date*</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Time*</label>
                                <input
                                    type="time"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Duration (minutes)</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">Status</label>
                            <select
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                                <option value="rescheduled">Rescheduled</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{appointment.title}</h2>
                                <div className="mt-1 flex items-center">
                                    {getStatusBadge(appointment.status)}
                                    <span className="ml-2 text-sm text-gray-500">
                                        with {appointment.coach}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">When</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    {formatDateTime(appointment.date, appointment.time)}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Duration: {appointment.duration} minutes
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Coach</h3>
                                <p className="mt-1 text-sm text-gray-900">{appointment.coach}</p>
                                {appointment.coach === 'AI Coach' && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Available 24/7 in your chat interface
                                    </p>
                                )}
                            </div>
                        </div>

                        {appointment.description && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                                    {appointment.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Preparation</h3>
                            <ul className="mt-2 space-y-3">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span className="text-sm text-gray-700">Review your goals and progress before the session</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span className="text-sm text-gray-700">Prepare any questions or topics you want to discuss</span>
                                </li>
                                {appointment.coach !== 'AI Coach' && (
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span className="text-sm text-gray-700">Join 5 minutes early to test your connection</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {appointment.status === 'scheduled' && (
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Reschedule
                            </button>
                            {appointment.coach === 'AI Coach' && (
                                <button
                                    onClick={() => navigate('/app/coach')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Start Session Now
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}