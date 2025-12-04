import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import * as firebaseStorage from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDcGUz-r2g2P3cNe_USxee8syPDigq3fAU",
  authDomain: "autopart-a69b7.firebaseapp.com",
  projectId: "autopart-a69b7",
  storageBucket: "autopart-a69b7.firebasestorage.app",
  messagingSenderId: "785909965336",
  appId: "1:785909965336:web:4fb012b5a6ed4acba1596d",
  measurementId: "G-S45E9EM7BR"
};

console.log("Initializing Firebase with config present:", !!firebaseConfig.apiKey);

// Initialize Firebase
let app;
let auth: any;
let db: any;
let initError: any = null;

try {
  // Using explicit casting to avoid TypeScript "no exported member" errors if types are mismatched
  app = (firebaseApp as any).initializeApp(firebaseConfig);

  // Initialize Services
  // auth = (firebaseAuth as any).getAuth(app);

  // Use in-memory persistence to rule out keychain/storage issues on iOS
  auth = (firebaseAuth as any).initializeAuth(app, {
    persistence: (firebaseAuth as any).inMemoryPersistence
  });

  // Enable verbose logging
  (firestore as any).setLogLevel('debug');

  // Initialize with memory cache (no persistence) to rule out corruption
  db = (firestore as any).initializeFirestore(app, {
    localCache: (firestore as any).memoryLocalCache()
  });

  console.log("Firebase initialized successfully with debug logging and memory cache");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  initError = error;
  // Mock objects to prevent crash
  // Mock objects to prevent crash
  auth = { currentUser: null };
  db = {};
}

export const storage = (firebaseStorage as any).getStorage(app);
export { auth, db, initError };