import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAosY9XOqxE1n1hxY2iP_KBIwLiwUf8nSs",
  authDomain: "workmanagement-a6b1e.firebaseapp.com",
  projectId: "workmanagement-a6b1e",
  storageBucket: "workmanagement-a6b1e.appspot.com",
  messagingSenderId: "568635570670",
  appId: "1:568635570670:web:6156e0e9eb743c9da1b6ff",
  measurementId: "G-1KRFHKR3C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;