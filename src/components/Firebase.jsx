// firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
    getFirestore,
    collection,
    addDoc,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    onSnapshot
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYpf_KkzUI_E8sKqs7I_16axaox6xHKgI",
    authDomain: "ai-coaching-182fd.firebaseapp.com",
    projectId: "ai-coaching-182fd",
    storageBucket: "ai-coaching-182fd.appspot.com",
    messagingSenderId: "356785094413",
    appId: "1:356785094413:web:40892dcca5ebb56e823a44",
    measurementId: "G-KHMN7TTXF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics if supported
const initAnalytics = async () => {
    try {
        const supported = await isSupported();
        if (supported) {
            return getAnalytics(app);
        }
        return null;
    } catch (error) {
        console.error("Analytics initialization error:", error);
        return null;
    }
};

const analytics = initAnalytics();

// Initialize Auth and Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Initialize Firestore with persistence enabled (optional)
const db = getFirestore(app);

// Firestore helper functions
const createDocument = async (collectionName, data) => {
    try {
        return await addDoc(collection(db, collectionName), data);
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
};

const getUserDocument = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error("Error getting user document:", error);
        throw error;
    }
};

// Exports
export {
    // Core Firebase
    app,
    auth,
    db,
    analytics,

    // Auth
    googleProvider,
    facebookProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,

    // Firestore
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    onSnapshot,

    // Helper functions
    createDocument,
    getUserDocument
};