// ============================================================
// AuthContext — Global Authentication State
// ============================================================
//
// 📚 REACT CONCEPT: Context API
// Problem: Many components need to know "who is logged in?"
//   - Header needs user for avatar
//   - AdminRoute needs role for access control
//   - ContactPage needs to personalize the form
//
// Without Context you'd pass user as a prop through every component:
//   App → Header → Nav → UserMenu   (called "prop drilling")
//
// With Context: any component calls useAuth() and gets the user directly.
//
// Three steps to use Context:
//   1. createContext()  → creates the channel
//   2. <Provider value> → broadcasts the value
//   3. useContext()     → any component tunes in
// ============================================================

import { createContext, useState, useEffect } from 'react';
import { onAuthChange } from '../services/authService';
import { getUserProfile, saveUserProfile } from '../services/dataService';

// Step 1: Create the context channel
// The initial value (null) is only used if a component tries to read
// the context WITHOUT being wrapped in <AuthProvider> — rare but good
// to guard against.
export const AuthContext = createContext(null);

// Step 2: The Provider component — wrap your whole app with this
export function AuthProvider({ children }) {
  // 📚 REACT CONCEPT: useState
  // These three state variables drive everything auth-related.
  // When any of them changes, every component using useAuth() re-renders.
  const [user,     setUser]     = useState(null);     // Firebase user object or null
  const [userRole, setUserRole] = useState(null);     // 'user' | 'admin' | null
  const [loading,  setLoading]  = useState(true);     // true until first auth check completes

  useEffect(() => {
    // 📚 REACT CONCEPT: useEffect with cleanup
    // This effect runs ONCE after the component first mounts (empty [] array).
    //
    // onAuthChange returns Firebase's unsubscribe function.
    // We RETURN it from useEffect — React calls this cleanup function
    // when AuthProvider unmounts, which prevents a memory leak.
    //
    // Think of it like: "start listening when I mount, stop when I unmount"
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch role from Firestore users/{uid}.role
        // This is what makes role-based access work:
        //   Regular user → role: 'user'  → cannot access /admin
        //   Admin user   → role: 'admin' → can access all /admin/* routes
        try {
          let profile = await getUserProfile(firebaseUser.uid);
          console.log('[AuthContext] User profile loaded:', profile);

          // 📚 Auto-provision: if this Firebase Auth user has no Firestore
          // document yet (e.g. signed in with an account created before this
          // React build), create it now with role: 'user'.
          // This is what makes the 'users' collection appear in Firestore.
          if (!profile) {
            console.log('[AuthContext] No profile found, creating new one for:', firebaseUser.email);
            await saveUserProfile(firebaseUser, {
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName:  firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              provider:  firebaseUser.providerData?.[0]?.providerId || 'email',
            });
            profile = await getUserProfile(firebaseUser.uid);
            console.log('[AuthContext] New profile created:', profile);
          }

          const finalRole = profile?.role ?? 'user';
          console.log('[AuthContext] Setting role to:', finalRole);
          setUserRole(finalRole);
        } catch (err) {
          console.error('[AuthContext] Error loading profile:', err);
          setUserRole('user'); // fallback on Firestore read error
        }
      } else {
        // User signed out
        setUser(null);
        setUserRole(null);
      }
      setLoading(false); // First auth check complete — hide loading screens
    });

    return unsubscribe; // ← cleanup: unsubscribes when AuthProvider unmounts
  }, []); // ← empty array: run this effect only once

  // Step 3: Broadcast the values to all children
  return (
    <AuthContext.Provider value={{ user, userRole, loading }}>
      {/*
        📚 REACT CONCEPT: children prop
        Everything nested inside <AuthProvider>...</AuthProvider> in App.jsx
        is passed here as the "children" prop and rendered unchanged.
        We're just wrapping the app to inject the context value.
      */}
      {children}
    </AuthContext.Provider>
  );
}
