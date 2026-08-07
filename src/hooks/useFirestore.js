// ============================================================
// useFirestore — Generic Real-time Firestore Hook
// ============================================================
//
// 📚 REACT CONCEPT: Parameterised Custom Hook
// This hook encapsulates the entire data-fetching lifecycle:
//   1. Set loading = true
//   2. Subscribe to Firestore with onSnapshot
//   3. When data arrives, update state → component re-renders
//   4. On unmount, unsubscribe to prevent memory leaks
//
// Usage:
//   const { data: attractions, loading, error } = useFirestore('attractions', 'rank');
//   const { data: tours }                       = useFirestore('tours');
//
// This replaces ALL the old getData() calls scattered across pages.
// ============================================================

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * @param {string} collectionName - Firestore collection path
 * @param {string|null} orderByField - Optional field to order results by
 * @returns {{ data: Array, loading: boolean, error: Error|null }}
 */
export function useFirestore(collectionName, orderByField = null) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    // Build the Firestore query
    const ref = collection(db, collectionName);
    const q   = orderByField ? query(ref, orderBy(orderByField, 'asc')) : ref;

    // 📚 onSnapshot is Firestore's real-time listener.
    // The callback fires immediately with current data,
    // then again whenever a document in the collection is added/changed/deleted.
    // This is what makes admin changes appear instantly on the public site.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`[useFirestore] ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    // 📚 Cleanup function — React calls this when:
    //   • The component unmounts (navigating away from the page)
    //   • collectionName changes (rare but handled)
    // Without this, the listener keeps running and causes memory leaks.
    return unsubscribe;
  }, [collectionName, orderByField]);

  return { data, loading, error };
}
