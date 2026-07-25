// ============================================================
// SHILLONG EXPLORER — Firebase Configuration
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyDgmzVFToLlYVlNM53G6-bqD4n11MnZqHc",
  authDomain: "travel-20e51.firebaseapp.com",
  projectId: "travel-20e51",
  storageBucket: "travel-20e51.firebasestorage.app",
  messagingSenderId: "970117828253",
  appId: "1:970117828253:web:494d2e23162cc2741d0e74",
  measurementId: "G-VZBVN2N1MD",
  // Realtime Database URL — verify in Firebase Console → Realtime Database
  databaseURL: "https://travel-20e51-default-rtdb.firebaseio.com"
};

// Initialize Firebase (compat SDK)
firebase.initializeApp(firebaseConfig);

// ---- Service instances (globally accessible) ----
const auth         = firebase.auth();
const db           = firebase.firestore();          // Firestore
const rtdb         = firebase.database();           // Realtime Database
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
