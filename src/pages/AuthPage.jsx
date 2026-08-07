// ============================================================
// AuthPage — Sign In + Register (Firebase Auth)
// ============================================================
//
// 📚 REACT CONCEPTS USED HERE:
//
// 1. Tab switching with useState — 'signin' | 'register'
// 2. useEffect — redirect away if user is already logged in
// 3. useNavigate — programmatic navigation after login
// 4. useSearchParams — reads ?redirect=/admin from URL so we can
//    bounce the user back to their intended destination
// 5. Controlled inputs — all form fields tied to React state
// 6. Async event handlers — call authService functions with await
// ============================================================

import { useState, useEffect }            from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth }                         from '../hooks/useAuth';
import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  resetPassword,
  getFriendlyError,
} from '../services/authService';

// ── Validation helpers ────────────────────────────────────────
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
const isValidPhone = (p) => /^\d{7,15}$/.test(p.replace(/[\s\-()+]/g, ''));
const isValidName  = (n) => /^[a-zA-ZÀ-ÿ\s'.-]{2,60}$/.test(n.trim());

const getPasswordStrength = (p) => {
  let score = 0;
  if (p.length >= 8)            score++;
  if (/[A-Z]/.test(p))         score++;
  if (/[0-9]/.test(p))         score++;
  if (/[^A-Za-z0-9]/.test(p))  score++;
  return score;
};

const STRENGTH_LABELS = ['', 'Weak',   'Fair',    'Good',     'Strong 💪'];
const STRENGTH_COLORS = ['', '#ef4444','#f97316', '#22c55e',  '#16a34a'];

// ── Google Button sub-component ───────────────────────────────
function GoogleButton({ onClick, label }) {
  return (
    <button className="btn-google" onClick={onClick} type="button">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
        <path d="M47.532 24.552c0-1.636-.147-3.209-.42-4.727H24.48v8.945h12.968c-.56 3.01-2.256 5.562-4.806 7.273v6.044h7.776c4.552-4.192 7.114-10.367 7.114-17.535z" fill="#4285F4"/>
        <path d="M24.48 48c6.48 0 11.916-2.149 15.888-5.814l-7.776-6.044c-2.153 1.44-4.907 2.29-8.112 2.29-6.24 0-11.532-4.214-13.428-9.876H2.936v6.245C6.892 42.813 15.12 48 24.48 48z" fill="#34A853"/>
        <path d="M11.052 28.556A14.37 14.37 0 0 1 10.32 24c0-1.585.272-3.126.732-4.556V13.2H2.936A23.936 23.936 0 0 0 .48 24c0 3.867.924 7.525 2.456 10.8l8.116-6.244z" fill="#FBBC05"/>
        <path d="M24.48 9.568c3.516 0 6.672 1.209 9.156 3.579l6.864-6.864C36.384 2.378 30.948 0 24.48 0 15.12 0 6.892 5.187 2.936 13.2l8.116 6.244c1.896-5.662 7.188-9.876 13.428-9.876z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AuthPage() {
  const [tab,         setTab]         = useState('signin');
  const [isLoading,   setIsLoading]   = useState(false);
  const [alert,       setAlert]       = useState(null);      // { message, type }
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg,  setSuccessMsg]  = useState('');

  // Sign-in form
  const [siEmail,    setSiEmail]    = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPw,   setSiShowPw]   = useState(false);

  // Register form (one object for all fields)
  const [reg, setReg] = useState({
    firstName: '', lastName: '', email: '',
    countryCode: '+91', phone: '',
    password: '', confirm: '', terms: false,
  });
  const [regShowPw,  setRegShowPw]  = useState(false);
  const [regShowCfm, setRegShowCfm] = useState(false);

  const { user }        = useAuth();
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();

  // 📚 Redirect away if already logged in
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, searchParams]);

  const showAlert  = (message, type = 'error') => setAlert({ message, type });
  const clearAlert = () => setAlert(null);

  const switchTab = (newTab) => { setTab(newTab); clearAlert(); };

  // ── Sign In ───────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    clearAlert();
    if (!isValidEmail(siEmail)) { showAlert('Please enter a valid email address.'); return; }
    if (!siPassword)            { showAlert('Please enter your password.');          return; }
    setIsLoading(true);
    try {
      await signInWithEmail(siEmail, siPassword);
      // useEffect above will navigate once auth state updates
    } catch (err) {
      showAlert(getFriendlyError(err));
      setIsLoading(false);
    }
  };

  // ── Google Auth ───────────────────────────────────────────
  const handleGoogle = async () => {
    clearAlert();
    setIsLoading(true);
    try {
      const { user: gUser, isNewUser } = await signInWithGoogle();
      setSuccessMsg(`Welcome${isNewUser ? ', ' + gUser.displayName : ' back, ' + gUser.displayName}! 🎉`);
      setShowSuccess(true);
    } catch (err) {
      showAlert(getFriendlyError(err));
      setIsLoading(false);
    }
  };

  // ── Forgot Password ───────────────────────────────────────
  const handleForgot = async () => {
    if (!siEmail || !isValidEmail(siEmail)) {
      showAlert('Enter your email address above first, then click Forgot Password.', 'info');
      return;
    }
    clearAlert();
    setIsLoading(true);
    try {
      await resetPassword(siEmail);
      showAlert(`Password reset email sent to ${siEmail}. Check your inbox.`, 'success');
    } catch (err) {
      showAlert(getFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ──────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearAlert();
    const { firstName, lastName, email, countryCode, phone, password, confirm, terms } = reg;
    const errs = [];
    if (!isValidName(firstName))      errs.push('Enter a valid first name (2–60 letters).');
    if (!isValidName(lastName))       errs.push('Enter a valid last name.');
    if (!isValidEmail(email))         errs.push('Enter a valid email address.');
    if (!isValidPhone(phone))         errs.push('Enter a valid phone number.');
    if (password.length < 8)          errs.push('Password must be at least 8 characters.');
    if (getPasswordStrength(password) < 2) errs.push('Password is too weak. Add uppercase, numbers, or symbols.');
    if (password !== confirm)         errs.push('Passwords do not match.');
    if (!terms)                       errs.push('Please accept the Terms of Service.');
    if (errs.length) { showAlert(errs[0]); return; }

    setIsLoading(true);
    try {
      await registerWithEmail({
        firstName, lastName, email,
        phone: countryCode + phone.replace(/[\s\-()]/g, ''),
        password,
      });
      setSuccessMsg(`Welcome, ${firstName}! 🎉 A verification email has been sent to ${email}.`);
      setShowSuccess(true);
    } catch (err) {
      showAlert(getFriendlyError(err));
      setIsLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(reg.password);

  // ── Common input style ────────────────────────────────────
  const INPUT_STYLE = { className: 'form-input' };

  return (
    <div className="auth-page">
      {isLoading && (
        <div className="auth-loading-overlay active">
          <div className="auth-loading-spinner" />
        </div>
      )}

      {/* ── Left Hero Panel ──────────────────────────────── */}
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-content">
          <Link to="/" className="auth-logo">
            <img src="/assets/images/logo.png" alt="SAWAIOM TRAVELS AGENCY" style={{ height: 48, objectFit: 'contain' }} />
          </Link>
          <div className="auth-hero-tagline">Your Gateway to Meghalaya</div>
          <h1>Discover the <span>Scotland</span> of the East</h1>
          <p className="auth-hero-desc">
            Create your account and unlock exclusive tour deals, personalised itineraries,
            and 24/7 travel support across Shillong, Cherrapunji, and beyond.
          </p>
          <div className="auth-feature-cards">
            {[
              { icon: '🗺️', title: '50+ Curated Tours',    sub: 'Handpicked by local experts'       },
              { icon: '💰', title: "Members-Only Deals",    sub: 'Up to 20% off for registered users' },
              { icon: '📱', title: '24/7 Travel Support',  sub: "We're always just a message away"   },
            ].map((f) => (
              <div key={f.title} className="auth-feature-card">
                <div className="auth-feature-icon">{f.icon}</div>
                <div className="auth-feature-text">
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ─────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/" className="auth-back-link">← Back to SAWAIOM TRAVELS AGENCY</Link>

          {/* Alert banner */}
          {alert && (
            <div className={`auth-alert ${alert.type}`} style={{ display: 'flex' }}>
              <span className="auth-alert-icon">
                {alert.type === 'error' ? '❌' : alert.type === 'success' ? '✅' : 'ℹ️'}
              </span>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Success screen */}
          {showSuccess ? (
            <div className="auth-success-screen active">
              <div className="success-checkmark">🎉</div>
              <h2 className="success-title">Welcome Aboard!</h2>
              <p className="success-msg">{successMsg}</p>
              <div className="auth-loading-spinner" style={{ margin: '0 auto', borderTopColor: 'var(--primary)', width: 32, height: 32 }} />
            </div>
          ) : (
            <>
              <div className="auth-form-header">
                <div className="auth-greeting">
                  {tab === 'signin' ? 'Welcome Back' : 'Join the Adventure'}
                </div>
                <h1 className="auth-title">
                  {tab === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
                </h1>
                <p className="auth-subtitle">
                  {tab === 'signin'
                    ? 'Access your bookings, saved tours and travel history.'
                    : 'Register for exclusive deals and personalized tours.'}
                </p>
              </div>

              {/* Tabs */}
              <div className="auth-tabs" role="tablist">
                <button className={`auth-tab ${tab === 'signin' ? 'active' : ''}`} role="tab" onClick={() => switchTab('signin')}>
                  Sign In
                </button>
                <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} role="tab" onClick={() => switchTab('register')}>
                  Create Account
                </button>
              </div>

              {/* ── Sign In Form ─────────────────────── */}
              {tab === 'signin' && (
                <div className="form-section active">
                  <GoogleButton onClick={handleGoogle} label="Continue with Google" />
                  <div className="auth-divider"><span>or sign in with email</span></div>
                  <form onSubmit={handleSignIn} noValidate>
                    <div className="form-group">
                      <label className="form-label" htmlFor="si-email">Email Address <span>*</span></label>
                      <div className="input-wrapper">
                        <input type="email" className="form-input" id="si-email" placeholder="you@example.com" autoComplete="email" required value={siEmail} onChange={(e) => setSiEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="si-password">Password <span>*</span></label>
                      <div className="input-wrapper">
                        <input type={siShowPw ? 'text' : 'password'} className="form-input" id="si-password" placeholder="Enter your password" autoComplete="current-password" required value={siPassword} onChange={(e) => setSiPassword(e.target.value)} />
                        <button type="button" className="input-action" onClick={() => setSiShowPw((p) => !p)} aria-label="Toggle password visibility">{siShowPw ? '🙈' : '👁'}</button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: 20 }}>
                      <button type="button" onClick={handleForgot} style={{ fontSize: '0.83rem', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Forgot Password?
                      </button>
                    </div>
                    <button type="submit" className={`btn-auth ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                      <div className="btn-spinner" />
                      <span className="btn-text">Sign In →</span>
                    </button>
                  </form>
                  <div className="auth-switch">
                    New here?{' '}
                    <button className="auth-switch-btn" onClick={() => switchTab('register')}>
                      Create a free account
                    </button>
                  </div>
                </div>
              )}

              {/* ── Register Form ────────────────────── */}
              {tab === 'register' && (
                <div className="form-section active">
                  <GoogleButton onClick={handleGoogle} label="Sign Up with Google" />
                  <div className="auth-divider"><span>or register with email</span></div>
                  <form onSubmit={handleRegister} noValidate>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-fn">First Name <span>*</span></label>
                        <div className="input-wrapper">
                          <input type="text" className="form-input" id="reg-fn" placeholder="Arjun" required value={reg.firstName} onChange={(e) => setReg((r) => ({ ...r, firstName: e.target.value }))} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-ln">Last Name <span>*</span></label>
                        <div className="input-wrapper">
                          <input type="text" className="form-input" id="reg-ln" placeholder="Sharma" required value={reg.lastName} onChange={(e) => setReg((r) => ({ ...r, lastName: e.target.value }))} />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-email">Email Address <span>*</span></label>
                      <div className="input-wrapper">
                        <input type="email" className="form-input" id="reg-email" placeholder="you@example.com" required value={reg.email} onChange={(e) => setReg((r) => ({ ...r, email: e.target.value }))} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-phone">Phone Number <span>*</span></label>
                      <div className="phone-input-group">
                        <select className="phone-country-code" value={reg.countryCode} onChange={(e) => setReg((r) => ({ ...r, countryCode: e.target.value }))}>
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+61">🇦🇺 +61</option>
                          <option value="+880">🇧🇩 +880</option>
                        </select>
                        <input type="tel" className="phone-number-input" id="reg-phone" placeholder="98765 43210" maxLength={15} value={reg.phone} onChange={(e) => setReg((r) => ({ ...r, phone: e.target.value }))} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-pw">Password <span>*</span></label>
                      <div className="input-wrapper">
                        <input type={regShowPw ? 'text' : 'password'} className="form-input" id="reg-pw" placeholder="Min. 8 characters" required value={reg.password} onChange={(e) => setReg((r) => ({ ...r, password: e.target.value }))} />
                        <button type="button" className="input-action" onClick={() => setRegShowPw((p) => !p)} aria-label="Toggle">{regShowPw ? '🙈' : '👁'}</button>
                      </div>
                      {reg.password && (
                        <div className="password-strength">
                          <div className="strength-bars">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className={`strength-bar ${i <= pwStrength ? (pwStrength <= 1 ? 'weak' : pwStrength <= 2 ? 'fair' : 'strong') : ''}`} />
                            ))}
                          </div>
                          <span className="strength-label" style={{ color: STRENGTH_COLORS[pwStrength] }}>
                            {STRENGTH_LABELS[pwStrength]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-cfm">Confirm Password <span>*</span></label>
                      <div className="input-wrapper">
                        <input type={regShowCfm ? 'text' : 'password'} className="form-input" id="reg-cfm" placeholder="Repeat your password" required value={reg.confirm} onChange={(e) => setReg((r) => ({ ...r, confirm: e.target.value }))} />
                        <button type="button" className="input-action" onClick={() => setRegShowCfm((p) => !p)} aria-label="Toggle">{regShowCfm ? '🙈' : '👁'}</button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-checkbox" htmlFor="reg-terms">
                        <input type="checkbox" id="reg-terms" required checked={reg.terms} onChange={(e) => setReg((r) => ({ ...r, terms: e.target.checked }))} />
                        I agree to the <a href="#" tabIndex={-1}>Terms of Service</a> and <a href="#" tabIndex={-1}>Privacy Policy</a>
                      </label>
                    </div>

                    <button type="submit" className={`btn-auth ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                      <div className="btn-spinner" />
                      <span className="btn-text">Create My Account →</span>
                    </button>
                    <p className="auth-terms">By creating an account you agree to receive travel updates. Unsubscribe anytime.</p>
                  </form>
                  <div className="auth-switch">
                    Already have an account?{' '}
                    <button className="auth-switch-btn" onClick={() => switchTab('signin')}>Sign In</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
