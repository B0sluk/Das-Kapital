import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Check environment variables first, then fallback to localStorage
const getFirebaseConfig = () => {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.databaseURL && envConfig.apiKey) {
    return envConfig;
  }

  // Fallback to localStorage for easy setup without rebuilding
  try {
    const local = localStorage.getItem("das_kapital_firebase_config");
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error("Local Firebase config load failed:", e);
  }

  return null;
};

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getFirebaseConfig();
  if (!config || !config.databaseURL) {
    return null;
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    const db = getDatabase(app);
    return { app, db, config };
  } catch (e) {
    console.error("Firebase initialization failed:", e);
    return null;
  }
};
