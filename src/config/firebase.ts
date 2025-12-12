import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCbG9WWJdojOpMJD1Qx5Lvm2UHjUVYODCQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'pea-wom-dev.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pea-wom-dev',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'pea-wom-dev.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '226186087770',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:226186087770:web:16fdc0e3efa08c5575b763',
};

export const initializeFirebase = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
};

export { getMessaging, getToken, onMessage };
