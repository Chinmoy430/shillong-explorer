// ============================================================
// LoadingSpinner — Loading State UI
// ============================================================

/**
 * @param {boolean} fullPage - Centers the spinner with min-height for full page loads
 */
export function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '60vh',
      }}>
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="auth-loading-spinner" style={{ margin: '40px auto' }} />
  );
}
