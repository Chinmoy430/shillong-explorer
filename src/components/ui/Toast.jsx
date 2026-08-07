// ============================================================
// Toast — Notification Component
// ============================================================
//
// 📚 REACT CONCEPT: Presentational (Dumb) Component
// Toast only renders what it receives via props. It has NO state
// of its own. All logic (show/hide timer) lives in useToast().
//
// This is the "Separation of Concerns" pattern:
//   useToast() → manages WHEN to show
//   <Toast />  → manages HOW it looks
//
// Usage:
//   const { toast, showToast } = useToast();
//   <Toast {...toast} />   ← spreads { message, type, visible } as props
// ============================================================

// 📚 REACT CONCEPT: Props Destructuring
// Instead of receiving one big "props" object, we destructure directly:
//   function Toast({ message, type, visible })
// is exactly the same as:
//   function Toast(props) { const { message, type, visible } = props; ... }
export function Toast({ message, type = 'success', visible = false }) {
  return (
    // 📚 Template literals in className: adds 'active' class only when visible=true
    <div className={`toast ${type} ${visible ? 'active' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
