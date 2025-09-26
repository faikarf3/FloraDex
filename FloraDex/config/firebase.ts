// config/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID, // optional on native
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Avoid double-initialization during fast refresh
let auth = getAuth(app);
try {
  if (Platform.OS !== 'web' && !auth.currentUser) {
    // initializeAuth only once; if it throws, we already have auth
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  }
} catch {
  auth = getAuth(app);
}

export { auth };
export default app;
