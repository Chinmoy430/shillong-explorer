// ============================================================
// useScrollReveal — Intersection Observer for Reveal Animations
// ============================================================
//
// 📚 REACT CONCEPT: useEffect without dependency array
// When useEffect has NO dependency array, it runs after EVERY render.
// That's exactly what we want here — whenever new content appears
// (e.g. after Firestore data loads and cards mount), we want to
// observe those new .reveal elements.
//
// ALTERNATIVE: pass [] and use a MutationObserver.
// This simpler approach is fine for this use case.
// ============================================================

import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  // 📚 REACT CONCEPT: useRef
  // useRef stores a value that persists across renders WITHOUT causing re-renders.
  // We use it here to hold the IntersectionObserver instance so we can:
  //   1. Create it once  (not recreate on every render)
  //   2. Call .disconnect() in the cleanup to stop observing
  const observerRef = useRef(null);

  useEffect(() => {
    // Create a new observer each render cycle to capture newly mounted elements
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after revealing — each element only needs to animate once
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all .reveal elements in the DOM at this moment
    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }); // No dependency array — runs after every render
}
