import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcGUz-r2g2P3cNe_USxee8syPDigq3fAU",
  authDomain: "autopart-a69b7.firebaseapp.com",
  projectId: "autopart-a69b7",
  storageBucket: "autopart-a69b7.firebasestorage.app",
  messagingSenderId: "785909965336",
  appId: "1:785909965336:web:4fb012b5a6ed4acba1596d",
  measurementId: "G-S45E9EM7BR"
};

// Initialize Firebase
// Using explicit casting to avoid TypeScript "no exported member" errors if types are mismatched
const app = (firebaseApp as any).initializeApp(firebaseConfig);

// Initialize Services
export const auth = (firebaseAuth as any).getAuth(app);
export const db = (firestore as any).getFirestore(app);