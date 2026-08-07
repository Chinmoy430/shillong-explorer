// ============================================================
// Badge — Coloured Pill Labels
// ============================================================

// 📚 REACT CONCEPT: Props with a lookup object (alternatives to if/else chains)
// Instead of:  if (type === 'top') className = 'badge badge-top'; else if ...
// We use an object map — much cleaner and easily extensible.
const CLASS_MAP = {
  top:     'badge badge-top',
  white:   'badge badge-white',
  success: 'badge-admin badge-success',
  info:    'badge-admin badge-info',
  neutral: 'badge-admin badge-neutral',
  warning: 'badge-admin badge-warning',
  danger:  'badge-admin badge-danger',
};

/**
 * @param {'top'|'white'|'success'|'info'|'neutral'|'warning'|'danger'} type
 * @param {ReactNode} children - Badge label content
 */
export function Badge({ type = 'white', children }) {
  return (
    <span className={CLASS_MAP[type] || 'badge'}>
      {children}
    </span>
  );
}
