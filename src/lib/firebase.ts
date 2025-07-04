// lib/firebase.ts

// Firebase core
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPBjR8D5_M262ZQ-3dotfFCCO_t2IuSo4",
  authDomain: "destinyconnect-43fc6.firebaseapp.com",
  projectId: "destinyconnect-43fc6",
  storageBucket: "destinyconnect-43fc6.firebasestorage.app",
  messagingSenderId: "72196392602",
  appId: "1:72196392602:web:ed550bd06206472d470123",
  measurementId: "G-KNRDMWH0BZ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export auth and firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
