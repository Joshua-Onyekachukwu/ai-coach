import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../components/Firebase';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('30');
    const [coach, setCoach] = useState('AI Coach');

    // Get current date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    // Fetch appointments from Firestore
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error('User not authenticated');
                }

                // Get all appointments for this user without filtering by date
                const q = query(
                    collection(db, 'appointments'),
                    where('userId', '==', user.uid)
                );

                const querySnapshot = await getDocs(q);

                // Filter and format appointments after retrieval
                const appointmentsData = querySnapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        // Ensure the date field is a Firebase timestamp and convert it
                        const dateObj = data.date instanceof Timestamp ?
                            data.date.toDate() :
                            // Handle if it's already a Date object or a string
                            (data.date instanceof Date ? data.date : new Date(data.date));

                        return {
                            id: doc.id,
                            ...data,
                            dateObj: dateObj, // Store the Date object for sorting
                            date: dateObj.toISOString().split('T')[0] // For display
                        };
                    });

                // Sort appointments by date
                appointmentsData.sort((a, b) => a.dateObj - b.dateObj);

                // Log for debugging
                console.log("Fetched appointments:", appointmentsData);

                setAppointments(appointmentsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);  // Remove 'today' from dependency array as it's not needed

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('You must be logged in to create an appointment');
            }

            if (!title.trim()) {
                throw new Error('Appointment title is required');
            }

            if (!date) {
                throw new Error('Date is required');
            }

            if (!time) {
                throw new Error('Time is required');
            }

            // Combine date and time into a single timestamp
            const dateTime = new Date(`${date}T${time}`);
            if (dateTime < new Date()) {
                throw new Error('Appointment cannot be in the past');
            }

            const appointmentData = {
                userId: user.uid,
                title,
                description,
                date: Timestamp.fromDate(dateTime), // Use Firestore Timestamp
                duration: parseInt(duration),
                coach,
                createdAt: serverTimestamp(),
                status: 'scheduled'
            };

            await addDoc(collection(db, 'appointments'), appointmentData);

            // Reset form and refresh appointments
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setDuration('30');
            setShowForm(false);

            // Refresh appointments list by re-calling the effect
            const q = query(
                collection(db, 'appointments'),
                where('userId', '==', user.uid)
            );

            const querySnapshot = await getDocs(q);

            const appointmentsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const dateObj = data.date instanceof Timestamp ?
                    data.date.toDate() :
                    (data.date instanceof Date ? data.date : new Date(data.date));

                return {
                    id: doc.id,
                    ...data,
                    dateObj: dateObj,
                    date: dateObj.toISOString().split('T')[0]
                };
            });

            appointmentsData.sort((a, b) => a.dateObj - b.dateObj);
            setAppointments(appointmentsData);

        } catch (error) {
            console.error('Error creating appointment:', error);
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                await deleteDoc(doc(db, 'appointments', id));
                setAppointments(appointments.filter(appt => appt.id !== id));
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setError(error.message);
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Appointments</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    {showForm ? 'Cancel' : 'New Appointment'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Appointment Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Schedule New Appointment</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Title*</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Appointment title"
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
                                placeholder="What do you want to discuss?"
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
                                    min={today}
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

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Schedule Appointment
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Appointments List */}
            {appointments.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">Schedule your first appointment to get started.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            New Appointment
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                            <li key={appointment.id} className="p-6 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg">
                                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">{appointment.title}</h3>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    <p>{formatDate(appointment.date)} • {appointment.duration} minutes with {appointment.coach}</p>
                                                    {appointment.description && (
                                                        <p className="mt-1">{appointment.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex space-x-3">
                                        <button
                                            onClick={() => navigate(`/app/appointments/${appointment.id}`)}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => handleDelete(appointment.id)}
                                            className="px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}