// ============================================================
// SAWAIOM TRAVELS AGENCY — Admin Authentication
// ============================================================

const AUTH_KEY = 'se_admin_session';

function checkAuth() {
  const session = sessionStorage.getItem(AUTH_KEY);
  if (!session) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function login(username, password) {
  const creds = getData('adminCredentials');
  if (username === creds.username && password === creds.password) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ username, loggedAt: Date.now() }));
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
}

function getSession() {
  const s = sessionStorage.getItem(AUTH_KEY);
  return s ? JSON.parse(s) : null;
}
