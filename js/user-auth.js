// ============================================================
// SHILLONG EXPLORER — User Authentication (Firebase + EmailJS)
// ============================================================
// Requires: firebase-config.js (sets auth, db, googleProvider)
// Requires: EmailJS CDN loaded before this file
//
// EmailJS Setup:
//  1. Create account at https://www.emailjs.com
//  2. Add an Email Service (Gmail, Outlook, etc.)
//  3. Create an Email Template using the variables:
//       {{to_email}}, {{to_name}}, {{from_name}}, {{reply_to}}
//  4. Fill in EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID below
// ============================================================

'use strict';

// ============================================================
// EMAILJS CONFIG — replace with your actual credentials
// ============================================================
const EMAILJS_PUBLIC_KEY = 'Zl5lv-YMQ7VwmT8WI';   // e.g. 'user_xxxxxxxxxxxxxxxx'
const EMAILJS_SERVICE_ID = 'service_e8j527o';   // e.g. 'service_xxxxxxxx'
const EMAILJS_TEMPLATE_ID = 'template_b06hmco';  // e.g. 'template_xxxxxxxx'

// ---- State ----
let currentTab = 'signin';

// ============================================================
// INIT — page load
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // If user is already logged in → redirect away from auth page
  auth.onAuthStateChanged((user) => {
    if (user) {
      const redirect = getRedirectParam() || 'index.html';
      window.location.href = redirect;
    }
  });
});

function getRedirectParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect');
}

// ============================================================
// TAB SWITCHING (Sign In ↔ Create Account)
// ============================================================
function switchTab(tab) {
  currentTab = tab;

  document.querySelectorAll('.auth-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));

  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).setAttribute('aria-selected', 'true');
  document.getElementById(`section-${tab}`).classList.add('active');

  clearAlert();

  if (tab === 'signin') {
    document.getElementById('auth-greeting').textContent = 'Welcome Back';
    document.getElementById('auth-title').textContent = 'Sign In to Your Account';
    document.getElementById('auth-subtitle').textContent = 'Access your bookings, saved tours and travel history.';
  } else {
    document.getElementById('auth-greeting').textContent = 'Join the Adventure';
    document.getElementById('auth-title').textContent = 'Create Your Account';
    document.getElementById('auth-subtitle').textContent = 'Register for exclusive deals and personalized tours.';
  }
}

// ============================================================
// VALIDATION HELPERS
// ============================================================

/** Email — RFC 5322 simplified regex */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Phone — 7–15 digits (spaces/dashes allowed) */
function isValidPhone(phone) {
  const digits = phone.replace(/[\s\-()]/g, '');
  return /^\d{7,15}$/.test(digits);
}

/** Password strength: returns 0–4 */
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

/** Name: letters, spaces, hyphens, 2–60 chars */
function isValidName(name) {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,60}$/.test(name.trim());
}

// ---- Real-time field validators ----

function validateSigninEmail(input) {
  const val = input.value.trim();
  const fb = document.getElementById('signin-email-feedback');
  const st = document.getElementById('signin-email-status');
  if (!val) { setFieldNeutral(input, fb); st.textContent = ''; return; }
  if (isValidEmail(val)) {
    setFieldValid(input, fb, ''); st.textContent = '✅';
  } else {
    setFieldInvalid(input, fb, 'Enter a valid email address'); st.textContent = '❌';
  }
}

function validateRegEmail(input) {
  const val = input.value.trim();
  const fb = document.getElementById('reg-email-feedback');
  const st = document.getElementById('reg-email-status');
  if (!val) { setFieldNeutral(input, fb); st.textContent = ''; return; }
  if (isValidEmail(val)) {
    setFieldValid(input, fb, ''); st.textContent = '✅';
  } else {
    setFieldInvalid(input, fb, 'Enter a valid email (e.g. name@example.com)'); st.textContent = '❌';
  }
}

function validatePhoneInput(input, feedbackId) {
  const val = input.value.trim();
  const fb = document.getElementById(feedbackId);
  if (!val) { setFieldNeutral(input, fb); input.classList.remove('valid', 'invalid'); return; }
  if (isValidPhone(val)) {
    setFieldValid(input, fb, '✓ Valid phone number');
    input.classList.remove('invalid'); input.classList.add('valid');
  } else {
    setFieldInvalid(input, fb, 'Enter 7–15 digit phone number (e.g. 98765 43210)');
    input.classList.remove('valid'); input.classList.add('invalid');
  }
}

function validateName(input, feedbackId) {
  const val = input.value.trim();
  const fb = document.getElementById(feedbackId);
  if (!val) { setFieldNeutral(input, fb); return; }
  if (isValidName(val)) {
    setFieldValid(input, fb, '');
  } else {
    setFieldInvalid(input, fb, 'Use 2–60 letters only');
  }
}

function validatePassword(input) {
  const val = input.value;
  const fb = document.getElementById('reg-password-feedback');
  const wrap = document.getElementById('password-strength-wrap');
  const label = document.getElementById('strength-label');
  const bars = [1, 2, 3, 4].map(i => document.getElementById(`strength-bar-${i}`));

  if (!val) { setFieldNeutral(input, fb); wrap.style.display = 'none'; return; }

  wrap.style.display = 'block';
  const score = getPasswordStrength(val);
  bars.forEach(b => { b.className = 'strength-bar'; });

  let cls = '', text = '';
  if (score <= 1) {
    cls = 'weak'; text = 'Weak';
    bars[0].classList.add('weak');
  } else if (score === 2) {
    cls = 'fair'; text = 'Fair';
    bars[0].classList.add('fair'); bars[1].classList.add('fair');
  } else if (score === 3) {
    cls = 'fair'; text = 'Good';
    bars[0].classList.add('fair'); bars[1].classList.add('fair'); bars[2].classList.add('strong');
  } else {
    cls = 'strong'; text = 'Strong 💪';
    bars.forEach(b => b.classList.add('strong'));
  }
  label.textContent = text;
  label.className = `strength-label ${cls}`;

  if (val.length < 8) {
    setFieldInvalid(input, fb, 'Password must be at least 8 characters');
  } else if (score < 3) {
    setFieldNeutral(input, fb);
    fb.className = 'field-feedback info';
    fb.textContent = 'Add uppercase letters, numbers or symbols to strengthen.';
    fb.classList.remove('hidden');
  } else {
    setFieldValid(input, fb, '');
  }

  // Live confirm-password check
  const confirmInput = document.getElementById('reg-confirm-password');
  if (confirmInput && confirmInput.value) validateConfirmPassword(confirmInput);
}

function validateConfirmPassword(input) {
  const password = document.getElementById('reg-password').value;
  const fb = document.getElementById('reg-confirm-feedback');
  if (!input.value) { setFieldNeutral(input, fb); return; }
  if (input.value === password) {
    setFieldValid(input, fb, '✓ Passwords match');
  } else {
    setFieldInvalid(input, fb, 'Passwords do not match');
  }
}

// ---- Field state helpers ----
function setFieldValid(input, fbEl, message) {
  input.classList.remove('invalid'); input.classList.add('valid');
  if (fbEl) { fbEl.className = 'field-feedback success'; fbEl.textContent = message; }
}
function setFieldInvalid(input, fbEl, message) {
  input.classList.remove('valid'); input.classList.add('invalid');
  if (fbEl) { fbEl.className = 'field-feedback error'; fbEl.textContent = message; }
}
function setFieldNeutral(input, fbEl) {
  input.classList.remove('valid', 'invalid');
  if (fbEl) { fbEl.className = 'field-feedback hidden'; fbEl.textContent = ''; }
}

// ============================================================
// PASSWORD TOGGLE
// ============================================================
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
}

// ============================================================
// ALERT SYSTEM
// ============================================================
function showAlert(message, type = 'error') {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;
  const icons = { error: '❌', success: '✅', info: 'ℹ️' };
  alertEl.className = `auth-alert ${type}`;
  alertEl.innerHTML = `<span class="auth-alert-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  alertEl.style.display = 'flex';
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert() {
  const alertEl = document.getElementById('auth-alert');
  if (alertEl) { alertEl.style.display = 'none'; alertEl.textContent = ''; }
}

// ============================================================
// LOADING STATE
// ============================================================
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
}

function showPageLoader(show) {
  document.getElementById('auth-loading-overlay')?.classList.toggle('active', show);
}

// ============================================================
// GOOGLE SIGN IN / SIGN UP
// ============================================================
async function signInWithGoogle() {
  clearAlert();
  showPageLoader(true);
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    const isNewUser = result.additionalUserInfo?.isNewUser;

    if (isNewUser) {
      await saveUserProfile(user, {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        phone: '',
        provider: 'google'
      });
      await sendWelcomeEmailViaEmailJS(user.email, user.displayName?.split(' ')[0] || 'Explorer');
    }

    showSuccess(`Welcome${isNewUser ? ', ' + (user.displayName || '') : ' back, ' + (user.displayName || '')}!`);
    setTimeout(() => { window.location.href = getRedirectParam() || 'index.html'; }, 1800);
  } catch (err) {
    showPageLoader(false);
    showAlert(friendlyError(err), 'error');
  }
}

// ============================================================
// EMAIL / PASSWORD SIGN IN
// ============================================================
async function handleEmailSignIn(event) {
  event.preventDefault();
  clearAlert();

  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  if (!isValidEmail(email)) {
    showAlert('Please enter a valid email address.', 'error');
    document.getElementById('signin-email').focus();
    return;
  }
  if (!password) {
    showAlert('Please enter your password.', 'error');
    document.getElementById('signin-password').focus();
    return;
  }

  setLoading('btn-email-signin', true);
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    const user = result.user;
    // Sync last login to both Firestore + RTDB
    updateUserPresence(user.uid);
    showSuccess(`Welcome back, ${user.displayName || email.split('@')[0]}!`);
    setTimeout(() => { window.location.href = getRedirectParam() || 'index.html'; }, 1600);
  } catch (err) {
    setLoading('btn-email-signin', false);
    showAlert(friendlyError(err), 'error');
  }
}

// ============================================================
// FORGOT PASSWORD
// ============================================================
async function handleForgotPassword() {
  const email = document.getElementById('signin-email').value.trim();
  if (!email || !isValidEmail(email)) {
    showAlert('Enter your email address above, then click "Forgot Password".', 'info');
    document.getElementById('signin-email').focus();
    return;
  }
  clearAlert();
  try {
    await auth.sendPasswordResetEmail(email);
    showAlert(`Password reset link sent to ${email}. Check your inbox (and spam folder).`, 'success');
  } catch (err) {
    showAlert(friendlyError(err), 'error');
  }
}

// ============================================================
// REGISTER (Email / Password)
// ============================================================
async function handleRegister(event) {
  event.preventDefault();
  clearAlert();

  const firstName = document.getElementById('reg-firstname').value.trim();
  const lastName = document.getElementById('reg-lastname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const countryCode = document.getElementById('reg-country-code').value;
  const phoneRaw = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm-password').value;
  const terms = document.getElementById('reg-terms').checked;

  // Validate all fields
  const errors = [];
  if (!isValidName(firstName)) errors.push('Enter a valid first name (2–60 letters).');
  if (!isValidName(lastName)) errors.push('Enter a valid last name (2–60 letters).');
  if (!isValidEmail(email)) errors.push('Enter a valid email address.');
  if (!isValidPhone(phoneRaw)) errors.push('Enter a valid phone number (e.g. 98765 43210).');
  if (password.length < 8) errors.push('Password must be at least 8 characters.');
  if (getPasswordStrength(password) < 2) errors.push('Password is too weak — add uppercase letters, numbers or symbols.');
  if (password !== confirm) errors.push('Passwords do not match.');
  if (!terms) errors.push('Please accept the Terms of Service to continue.');

  if (errors.length > 0) {
    showAlert(errors[0], 'error');
    return;
  }

  const fullPhone = countryCode + phoneRaw.replace(/[\s\-()]/g, '');
  const displayName = `${firstName} ${lastName}`;

  setLoading('btn-register', true);
  try {
    // Create Firebase Auth account
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;

    // Update display name in Firebase Auth
    await user.updateProfile({ displayName });

    // Send email verification (Firebase built-in)
    await user.sendEmailVerification();

    // Save user profile to Firestore
    await saveUserProfile(user, { firstName, lastName, phone: fullPhone, provider: 'email' });

    // Send welcome email via EmailJS
    await sendWelcomeEmailViaEmailJS(email, firstName);

    // Show success screen
    showSuccess(`Welcome, ${firstName}! 🎉 A verification email has been sent to ${email}.`);
    setTimeout(() => { window.location.href = 'index.html'; }, 3000);

  } catch (err) {
    setLoading('btn-register', false);
    showAlert(friendlyError(err), 'error');
  }
}

// ============================================================
// FIRESTORE + REALTIME DATABASE — Save User Profile
// Writes to both databases simultaneously:
//  • Firestore  → rich querying, admin panel
//  • RTDB       → real-time sync, presence, fast reads
// ============================================================
async function saveUserProfile(user, extra = {}) {
  const profileData = {
    uid:         user.uid,
    displayName: user.displayName || `${extra.firstName || ''} ${extra.lastName || ''}`.trim(),
    email:       user.email || '',
    phoneNumber: extra.phone || user.phoneNumber || '',
    firstName:   extra.firstName || '',
    lastName:    extra.lastName  || '',
    photoURL:    user.photoURL   || '',
    provider:    extra.provider  || 'email',
    role:        'user'
  };

  try {
    // 1. Write to Firestore (with server timestamps)
    await db.collection('users').doc(user.uid).set({
      ...profileData,
      createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Firestore profile save error:', err);
  }

  try {
    // 2. Write to Realtime Database (with JS timestamp)
    const now = Date.now();
    await rtdb.ref(`users/${user.uid}`).set({
      ...profileData,
      createdAt:   now,
      lastLoginAt: now,
      online:      false
    });
  } catch (err) {
    console.error('RTDB profile save error:', err);
  }
}

// ---- Update last login timestamp in both DBs ----
async function updateUserPresence(uid) {
  const now = Date.now();
  try {
    db.collection('users').doc(uid).update({
      lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});
    rtdb.ref(`users/${uid}/lastLoginAt`).set(now).catch(() => {});
  } catch (err) {
    console.error('Presence update error:', err);
  }
}


// ============================================================
// WELCOME EMAIL — EmailJS
// ============================================================
async function sendWelcomeEmailViaEmailJS(toEmail, firstName) {
  if (!toEmail) return;
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded — skipping welcome email.');
    return;
  }
  // These template variables must match your EmailJS template
  const templateParams = {
    to_email: toEmail,
    to_name: firstName || 'Explorer',
    from_name: 'Shillong Explorer',
    reply_to: 'hello@shillongexplorer.com',
    message: `Welcome to Shillong Explorer! Your account has been created. Browse our tours at https://yourdomain.com/tours.html`
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Welcome email sent via EmailJS ✓');
  } catch (err) {
    // Non-critical — don't block registration if email fails
    console.error('EmailJS send error:', err);
  }
}

// ============================================================
// SUCCESS SCREEN
// ============================================================
function showSuccess(message) {
  showPageLoader(false);
  document.getElementById('auth-main-content').style.display = 'none';
  document.getElementById('success-msg').textContent = message;
  document.getElementById('auth-success-screen').classList.add('active');
}

// ============================================================
// FRIENDLY ERROR MESSAGES
// ============================================================
function friendlyError(err) {
  const code = err.code || '';
  const messages = {
    'auth/user-not-found': 'No account found with this email. Please register first.',
    'auth/wrong-password': 'Incorrect password. Try again or use "Forgot Password".',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Password must be at least 8 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up blocked by your browser — please allow pop-ups for this site.',
    'auth/cancelled-popup-request': 'Sign-in popup was cancelled.',
    'auth/network-request-failed': 'Network error — check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.',
    'auth/requires-recent-login': 'Please sign in again to perform this action.',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
  };
  return messages[code] || err.message || 'Something went wrong. Please try again.';
}

// ============================================================
// NAV AUTH STATE (called from main.js → initUserAuthState)
// Updates all .nav-user-area elements on every public page
// ============================================================
function initUserAuthState() {
  if (typeof auth === 'undefined') return;
  auth.onAuthStateChanged((user) => {
    updateNavForUser(user);
  });
}

function updateNavForUser(user) {
  const userAreaEls = document.querySelectorAll('.nav-user-area');
  if (!userAreaEls.length) return;

  userAreaEls.forEach(area => {
    if (user) {
      const initials = getInitials(user.displayName || user.email || 'U');
      area.innerHTML = `
        <button class="nav-user-btn" id="nav-user-btn" onclick="toggleUserDropdown()" aria-label="User menu" aria-haspopup="true">
          <div class="nav-user-avatar" title="${escapeHtml(user.displayName || user.email || '')}">
            ${user.photoURL
          ? `<img src="${user.photoURL}" alt="${escapeHtml(user.displayName || 'User')}" onerror="this.parentElement.textContent='${initials}'">`
          : initials
        }
          </div>
          <span class="nav-user-name">${escapeHtml((user.displayName || user.email || '').split(' ')[0])}</span>
          <span style="font-size:0.65rem;opacity:0.5;">▾</span>
        </button>
        <div class="nav-user-dropdown" id="nav-user-dropdown">
          <div class="nav-dropdown-header">
            <div class="nav-dropdown-name">${escapeHtml(user.displayName || 'Traveler')}</div>
            <div class="nav-dropdown-email">${escapeHtml(user.email || '')}</div>
          </div>
          <a href="#" class="nav-dropdown-item">👤 My Profile</a>
          <a href="#" class="nav-dropdown-item">🧳 My Bookings</a>
          <a href="#" class="nav-dropdown-item">❤️ Saved Tours</a>
          <div class="nav-dropdown-divider"></div>
          <button class="nav-dropdown-item danger" onclick="userSignOut()">🚪 Sign Out</button>
        </div>
      `;
    } else {
      area.innerHTML = `<a href="auth.html" class="nav-signin-btn" id="nav-signin-btn">👤 Sign In</a>`;
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav-user-btn') && !e.target.closest('#nav-user-dropdown')) {
      document.querySelectorAll('.nav-user-dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

function toggleUserDropdown() {
  document.getElementById('nav-user-dropdown')?.classList.toggle('open');
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

async function userSignOut() {
  try {
    await auth.signOut();
    window.location.reload();
  } catch (err) {
    console.error('Sign out error:', err);
  }
}
