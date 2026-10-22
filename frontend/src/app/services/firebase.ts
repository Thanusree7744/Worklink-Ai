import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3itggmWrfj_6CGXYc5z0GHfJB12UROVc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "worklink-ai-dda70.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "worklink-ai-dda70",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "worklink-ai-dda70.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "297893424523",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:297893424523:web:8f0640e8e041741282138e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-44N8WTZCZQ",
};

// Initialize Firebase (guarding against multiple initializations)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
