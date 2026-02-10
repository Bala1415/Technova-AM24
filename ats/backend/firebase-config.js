// Firebase Configuration
// =====================

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsOfs9DUBh1qTFKW29_VBRmkkNM-5-wRQ",
    authDomain: "prodigy-pathways.firebaseapp.com",
    projectId: "prodigy-pathways",
    storageBucket: "prodigy-pathways.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, collection, doc, setDoc, getDoc, getDocs, 
    addDoc, updateDoc, deleteDoc, query, where, orderBy 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase services globally
window.firebase = {
    app,
    db,
    auth,
    // Firestore functions
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    // Auth functions
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};

console.log('Firebase initialized successfully!');
