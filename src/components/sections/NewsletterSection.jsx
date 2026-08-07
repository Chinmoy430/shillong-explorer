// ============================================================
// NewsletterSection — Email Subscribe Form
// ============================================================
//
// 📚 REACT CONCEPT: Controlled form input
// The email input value is bound to React state via value + onChange.
// This is a "controlled input" — React fully owns the input value.
//
// Compare with an uncontrolled input (ref-based):
//   Uncontrolled: <input ref={emailRef} />  (read with emailRef.current.value)
//   Controlled:   <input value={email} onChange={e => setEmail(e.target.value)} />
//
// Controlled inputs are preferred in React because:
//   • You can validate on every keystroke
//   • You can reset the form easily (setEmail(''))
//   • The state is always in sync with what's displayed
// ============================================================

import { useState } from 'react';

/**
 * @param {function} onShowToast - Callback to show a toast notification from the parent
 */
export function NewsletterSection({ onShowToast }) {
  // Controlled input state
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    // Prevent default form submit (page reload)
    e.preventDefault();
    onShowToast('Thanks for subscribing! We\'ll keep you updated. 🎉', 'success');
    setEmail(''); // Reset the controlled input
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-inner">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.5)', justifyContent: 'center' }}>
            Stay Updated
          </div>
          <h2 className="section-title">Get Travel Tips &amp; Deals</h2>
          <p>Subscribe for exclusive deals, travel tips, and Shillong travel guides delivered to your inbox.</p>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              required
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-submit">Subscribe →</button>
          </form>
        </div>
      </div>
    </section>
  );
}
