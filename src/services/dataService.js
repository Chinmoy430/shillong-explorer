// ============================================================
// Data Service — All Firestore CRUD Operations
// ============================================================
//
// 📚 REACT CONCEPT: Service Layer (Separation of Concerns)
// A "service" module contains all data-fetching logic so components
// stay clean. Components call these functions; they don't talk to
// Firestore directly. This makes code easy to test and maintain.
//
// Two types of functions here:
//   1. One-time reads:    getAttractions()   → returns a Promise<data[]>
//   2. Real-time subs:    subscribeToAttractions(callback) → returns unsubscribe fn
//
// Real-time subscriptions use Firestore onSnapshot(), which fires:
//   • Immediately with current data
//   • Again whenever the data changes in Firestore
// This is what makes admin changes appear instantly on the public site.
// ============================================================

import {
  collection, doc,
  getDocs, getDoc,
  addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot,
  query, orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Collection names as constants (avoids typo bugs) ─────────
const C = {
  ATTRACTIONS:  'attractions',
  TOURS:        'tours',
  CATEGORIES:   'categories',
  TESTIMONIALS: 'testimonials',
  USERS:        'users',
};
const SITE_CONTENT = 'siteContent';

// ── Helper: convert Firestore snapshot to plain JS array ─────
const snapToArray = (snapshot) =>
  snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

// ─────────────────────────────────────────────────────────────
// ATTRACTIONS
// ─────────────────────────────────────────────────────────────

export const getAttractions = async () => {
  const q = query(collection(db, C.ATTRACTIONS), orderBy('rank', 'asc'));
  return snapToArray(await getDocs(q));
};

/** Real-time listener. Returns unsubscribe function — call it to stop listening. */
export const subscribeToAttractions = (callback) => {
  const q = query(collection(db, C.ATTRACTIONS), orderBy('rank', 'asc'));
  return onSnapshot(q, (snap) => callback(snapToArray(snap)));
};

export const addAttraction = (data) =>
  addDoc(collection(db, C.ATTRACTIONS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateAttraction = (id, data) =>
  updateDoc(doc(db, C.ATTRACTIONS, id), { ...data, updatedAt: serverTimestamp() });

export const deleteAttraction = (id) =>
  deleteDoc(doc(db, C.ATTRACTIONS, id));

// ─────────────────────────────────────────────────────────────
// TOURS
// ─────────────────────────────────────────────────────────────

export const getTours = async () =>
  snapToArray(await getDocs(collection(db, C.TOURS)));

export const subscribeToTours = (callback) =>
  onSnapshot(collection(db, C.TOURS), (snap) => callback(snapToArray(snap)));

export const addTour = (data) =>
  addDoc(collection(db, C.TOURS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateTour = (id, data) =>
  updateDoc(doc(db, C.TOURS, id), { ...data, updatedAt: serverTimestamp() });

export const deleteTour = (id) =>
  deleteDoc(doc(db, C.TOURS, id));

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────

export const getCategories = async () => {
  const q = query(collection(db, C.CATEGORIES), orderBy('order', 'asc'));
  return snapToArray(await getDocs(q));
};

export const subscribeToCategories = (callback) => {
  const q = query(collection(db, C.CATEGORIES), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => callback(snapToArray(snap)));
};

export const setCategory = (id, data) =>
  setDoc(doc(db, C.CATEGORIES, id), data, { merge: true });

export const deleteCategory = (id) =>
  deleteDoc(doc(db, C.CATEGORIES, id));

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

export const getTestimonials = async () =>
  snapToArray(await getDocs(collection(db, C.TESTIMONIALS)));

export const subscribeToTestimonials = (callback) =>
  onSnapshot(collection(db, C.TESTIMONIALS), (snap) => callback(snapToArray(snap)));

export const addTestimonial = (data) =>
  addDoc(collection(db, C.TESTIMONIALS), { ...data, createdAt: serverTimestamp() });

export const updateTestimonial = (id, data) =>
  updateDoc(doc(db, C.TESTIMONIALS, id), data);

export const deleteTestimonial = (id) =>
  deleteDoc(doc(db, C.TESTIMONIALS, id));

// ─────────────────────────────────────────────────────────────
// SITE CONTENT — siteContent/settings & siteContent/hero
// ─────────────────────────────────────────────────────────────

export const getSiteSettings = async () => {
  const snap = await getDoc(doc(db, SITE_CONTENT, 'settings'));
  return snap.exists() ? snap.data() : null;
};

export const updateSiteSettings = (data) =>
  setDoc(doc(db, SITE_CONTENT, 'settings'), data, { merge: true });

/** Real-time settings — used by SettingsContext */
export const subscribeToSiteSettings = (callback) =>
  onSnapshot(doc(db, SITE_CONTENT, 'settings'), (snap) => {
    if (snap.exists()) callback(snap.data());
  });

export const getHero = async () => {
  const snap = await getDoc(doc(db, SITE_CONTENT, 'hero'));
  return snap.exists() ? snap.data() : null;
};

export const updateHero = (data) =>
  setDoc(doc(db, SITE_CONTENT, 'hero'), data, { merge: true });

export const subscribeToHero = (callback) =>
  onSnapshot(doc(db, SITE_CONTENT, 'hero'), (snap) => {
    if (snap.exists()) callback(snap.data());
  });

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, C.USERS, uid));
  return snap.exists() ? snap.data() : null;
};

/**
 * Creates or merges a user profile document in Firestore.
 * role defaults to 'user' — set 'admin' manually in Firebase Console.
 * If a profile already exists, the role is NOT overwritten.
 */
export const saveUserProfile = async (user, extra = {}) => {
  const profileData = {
    uid:         user.uid,
    displayName: user.displayName || `${extra.firstName || ''} ${extra.lastName || ''}`.trim(),
    email:       user.email || '',
    phoneNumber: extra.phone || user.phoneNumber || '',
    firstName:   extra.firstName || '',
    lastName:    extra.lastName  || '',
    photoURL:    user.photoURL   || '',
    provider:    extra.provider  || 'email',
  };
  
  // Only set role if explicitly provided, otherwise let existing role persist
  if (extra.role) {
    profileData.role = extra.role;
  } else {
    // Set default role only for new users
    const existingProfile = await getDoc(doc(db, C.USERS, user.uid));
    if (!existingProfile.exists()) {
      profileData.role = 'user';
    }
  }
  
  await setDoc(doc(db, C.USERS, user.uid), {
    ...profileData,
    createdAt:   serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  }, { merge: true });
  return profileData;
};

export const updateLastLogin = (uid) =>
  updateDoc(doc(db, C.USERS, uid), { lastLoginAt: serverTimestamp() }).catch(() => {});

export const getAllUsers = async () =>
  snapToArray(await getDocs(collection(db, C.USERS)));
