// ============================================================
// Modal — Generic Overlay Modal
// ============================================================
//
// 📚 REACT CONCEPT: createPortal
// Normally React renders everything inside the #root div.
// But a modal overlay needs to cover the ENTIRE screen, including
// elements outside #root (though in practice our app is all in #root).
//
// createPortal(children, container) renders the children at a
// different DOM location than the component tree suggests.
// Here we render to document.body so the modal sits at the top
// of the stacking context — nothing can overlap it accidentally.
//
// This is exactly what the old code did with:
//   document.getElementById('attraction-modal').classList.add('active')
// except now the modal state is driven by React props, not direct DOM mutation.
// ============================================================

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * @param {boolean} isOpen     - Whether the modal is visible
 * @param {function} onClose   - Called when user clicks the overlay backdrop
 * @param {ReactNode} children - The modal content (the inner .modal div)
 */
export function Modal({ isOpen, onClose, children }) {
  // Lock body scroll when modal is open — same behaviour as old vanilla code
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // Cleanup: always restore scroll when effect re-runs or component unmounts
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // 📚 REACT CONCEPT: Early return
  // If the modal is not open, render nothing.
  // React unmounts the portal content — keeping the DOM clean.
  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      // Close when clicking the dark backdrop (not the modal content itself)
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body // ← portal target: renders outside #root in the DOM
  );
}
