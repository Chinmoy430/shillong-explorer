// ============================================================
// Firebase — Modular SDK v10 Initialization
// ============================================================
//
// 📚 REACT CONCEPT: ES Module (Service File)
// This file is NOT a React component — it's a plain JavaScript module.
// It runs once when first imported anywhere in the app and caches the
// Firebase instances. Every other file imports from here.
//
// OLD WAY (your existing code):
//   <script src="firebase-app-compat.js"></script>
//   const auth = firebase.auth();   ← global variable
//
// NEW WAY (modular SDK):
//   import { getAuth } from 'firebase/auth';
//   export const auth = getAuth(app); ← named export, tree-shakeable
//
// "Tree-shakeable" means Vite only bundles the Firebase modules you actually
// import — your bundle stays small even though Firebase is a large library.
// ============================================================

import { initializeApp }                from 'firebase/app';
import { getFirestore }                 from 'firebase/firestore';
import { getAuth, GoogleAuthProvider }  from 'firebase/auth';
import { getDatabase }                  from 'firebase/database';
import { getStorage }                   from 'firebase/storage';

// Vite exposes .env variables prefixed with VITE_ via import.meta.env.
// Never use process.env in Vite — it doesn't exist in the browser.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key]);

let app = null;
let db = null;
let auth = null;
let rtdb = null;
let storage = null;
let googleProvider = null;

export const isFirebaseConfigured = missingConfig.length === 0;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  rtdb = getDatabase(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} else {
  console.error(`[firebase] Missing Firebase config values: ${missingConfig.join(', ')}. Add them to your .env file and restart the dev server.`);
}

export { db, auth, rtdb, storage, googleProvider };
