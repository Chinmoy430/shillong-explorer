// ============================================================
// useAuth — Custom Hook for Auth Context
// ============================================================
//
// 📚 REACT CONCEPT: Custom Hook
// A custom hook is simply a function whose name starts with "use"
// and that calls other hooks inside it.
//
// Without this hook, every component needing auth would write:
//   import { useContext } from 'react';
//   import { AuthContext } from '../context/AuthContext';
//   const { user, userRole, loading } = useContext(AuthContext);
//
// With this hook, they just write:
//   import { useAuth } from '../hooks/useAuth';
//   const { user, userRole, loading } = useAuth();
//
// Benefits:
// • Less boilerplate in every component
// • The error check below catches usage outside of <AuthProvider>
// • Centralised — rename AuthContext and only update this file
// ============================================================

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth() must be used inside an <AuthProvider>. Check your App.jsx.');
  }
  return context;
}
