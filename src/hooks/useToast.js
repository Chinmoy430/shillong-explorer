// ============================================================
// useToast — Toast Notification State Management
// ============================================================
//
// 📚 REACT CONCEPT: useCallback
// useCallback(fn, [deps]) memoizes a function — it returns the SAME
// function reference between renders unless dependencies change.
//
// Why does this matter for showToast?
// If we pass showToast as a prop to a child component, without useCallback
// a new function would be created every render, causing the child to
// re-render unnecessarily. useCallback prevents this.
//
// Usage in a page component:
//   const { toast, showToast } = useToast();
//   ...
//   <button onClick={() => showToast('Subscribed! 🎉', 'success')}>Subscribe</button>
//   <Toast {...toast} />
// ============================================================

import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toast, setToast] = useState({
    message: '',
    type:    'success',  // 'success' | 'error' | 'info'
    visible: false,
  });

  // useRef to store the timeout ID so we can clear it if showToast is
  // called again before the previous toast has dismissed.
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    // Clear any existing timeout before starting a new one
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setToast({ message, type, visible: true });

    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  }, []); // Empty deps — showToast never changes

  return { toast, showToast };
}
