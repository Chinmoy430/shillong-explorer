// ============================================================
// Auth Service — Firebase Authentication Functions
// ============================================================
//
// 📚 REACT CONCEPT: Separating Logic from UI
// These are plain async functions, NOT React hooks or components.
// They're called FROM components using async/await.
// Keeping auth logic here means AuthPage stays clean — it just
// calls these functions and updates local state accordingly.
//
// Compare old approach:
//   async function handleEmailSignIn(event) {  ← defined in user-auth.js, called from HTML onclick
//
// New approach:
//   import { signInWithEmail } from '../services/authService';
//   const user = await signInWithEmail(email, password);  ← called from AuthPage.jsx
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { saveUserProfile, updateLastLogin } from './dataService';
import { sendWelcomeEmail } from './emailService';

// ── SIGN IN WITH EMAIL/PASSWORD ───────────────────────────────

export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await updateLastLogin(result.user.uid);
  return result.user;
};

// ── SIGN IN / SIGN UP WITH GOOGLE ────────────────────────────

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // _tokenResponse.isNewUser tells us if this is a first-time Google sign-in
  const isNewUser = result._tokenResponse?.isNewUser ?? false;

  if (isNewUser) {
    await saveUserProfile(user, {
      firstName: user.displayName?.split(' ')[0] || '',
      lastName:  user.displayName?.split(' ').slice(1).join(' ') || '',
      provider:  'google',
    });
    await sendWelcomeEmail(user.email, user.displayName?.split(' ')[0] || 'Explorer');
  } else {
    await updateLastLogin(user.uid);
  }

  return { user, isNewUser };
};

// ── REGISTER WITH EMAIL/PASSWORD ─────────────────────────────

export const registerWithEmail = async ({ firstName, lastName, email, phone, password }) => {
  // Step 1: Create the Firebase Auth account
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user   = result.user;

  // Step 2: Set display name in Firebase Auth (for Avatar display in nav)
  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  // Step 3: Send email verification (Firebase built-in)
  await sendEmailVerification(user);

  // Step 4: Save user profile to Firestore users/{uid}
  //         role defaults to 'user' — promote to 'admin' in Firebase Console
  await saveUserProfile(user, { firstName, lastName, phone, provider: 'email' });

  // Step 5: Send welcome email via EmailJS
  await sendWelcomeEmail(email, firstName);

  return user;
};

// ── SIGN OUT ─────────────────────────────────────────────────

export const logOut = () => signOut(auth);

// ── PASSWORD RESET ────────────────────────────────────────────

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// ── AUTH STATE LISTENER ───────────────────────────────────────
// Used by AuthContext — not called directly by page components.
// Returns an unsubscribe function for cleanup.

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ── FRIENDLY ERROR MESSAGES ───────────────────────────────────
// Maps Firebase error codes to user-readable messages.
// In the old code this was in user-auth.js as friendlyError().

export const getFriendlyError = (err) => {
  const messages = {
    'auth/user-not-found':       'No account found with this email. Please register first.',
    'auth/wrong-password':       'Incorrect password. Try again or use "Forgot Password".',
    'auth/invalid-credential':   'Invalid email or password. Please check and try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password':        'Password must be at least 8 characters.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.',
    'auth/popup-blocked':        'Pop-up blocked by your browser — please allow pop-ups for this site.',
    'auth/network-request-failed': 'Network error — check your internet connection.',
    'auth/too-many-requests':    'Too many attempts. Please wait a moment and try again.',
    'auth/requires-recent-login':'Please sign in again to perform this action.',
    'auth/user-disabled':        'This account has been disabled. Contact support.',
  };
  return messages[err?.code] || err?.message || 'Something went wrong. Please try again.';
};
