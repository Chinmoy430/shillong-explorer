// ============================================================
// Header — Sticky Navigation + Mobile Menu + User Avatar
// ============================================================
//
// 📚 REACT CONCEPTS USED HERE:
//
// 1. useState — three pieces of local state:
//    • scrolled (bool) — adds 'scrolled' class for sticky styling
//    • mobileOpen (bool) — controls mobile menu open/close
//    • dropdownOpen (bool) — controls user avatar dropdown
//
// 2. useEffect — two effects:
//    • Scroll listener: adds/removes 'scrolled' class
//    • Click-outside listener: closes dropdown when clicking elsewhere
//    Both return cleanup functions to remove event listeners on unmount.
//
// 3. NavLink (React Router) — like <Link> but adds 'active' class
//    automatically when the URL matches. The className prop can accept
//    a function: ({ isActive }) => isActive ? 'active' : ''
//    This replaces the old initHeader() path matching logic.
//
// 4. useAuth() — reads { user, userRole } from AuthContext.
//    No need to listen to Firebase directly — AuthProvider does that.
// ============================================================

import { useState, useEffect }       from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth }                    from '../../hooks/useAuth';
import { logOut }                     from '../../services/authService';
import logo                           from '../../assets/images/logo.png';

const NAV_LINKS = [
  { to: '/',            label: 'Home',          end: true },
  { to: '/attractions', label: 'Attractions',   end: false },
  { to: '/tours',       label: 'Tour Packages', end: false },
  { to: '/contact',     label: 'Contact',       end: false },
];

// Produces "PS" from "Priya Sharma" for the avatar initials
const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

export function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, userRole } = useAuth();
  
  // Debug logging for admin role
  if (user && userRole) {
    console.log('[Header] User:', user.email, '| Role:', userRole);
  }
  const navigate = useNavigate();

  // ── Effect 1: Sticky header on scroll ──────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check immediately on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Effect 2: Close dropdown on outside click ───────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#nav-user-btn') && !e.target.closest('#nav-user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSignOut = async () => {
    await logOut();
    setDropdownOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ── Mobile Slide-In Menu ─────────────────────────── */}
      <nav className={`mobile-menu ${mobileOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <span className="mobile-menu-close" onClick={closeMobile} aria-label="Close menu">✕</span>

        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} onClick={closeMobile} end={link.end}>
            {link.label}
          </NavLink>
        ))}

        <Link
          to="/contact"
          onClick={closeMobile}
          style={{ background: 'var(--accent)', color: '#fff', padding: '12px 32px', borderRadius: '50px', fontWeight: 700 }}
        >
          📅 Book a Tour
        </Link>

        {user ? (
          <button
            onClick={() => { handleSignOut(); closeMobile(); }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '1rem', textAlign: 'left', padding: 0 }}
          >
            🚪 Sign Out
          </button>
        ) : (
          <NavLink to="/auth" onClick={closeMobile}>👤 Sign In / My Account</NavLink>
        )}


      </nav>

      {/* ── Main Header ──────────────────────────────────── */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`} id="header">
        <nav className="nav">

          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logo} alt="SAWAIOM TRAVELS AGENCY" style={{ height: 44, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#188029', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              Sawaiom Travels
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              // 📚 NavLink className as function:
              // React Router calls it with { isActive: true/false }
              // so we can conditionally apply our 'active' CSS class.
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Nav CTA — Auth area + hamburger */}
          <div className="nav-cta">
            <div className="nav-user-area">
              {/* 📚 Conditional rendering: show avatar if logged in, sign-in button if not */}
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    id="nav-user-btn"
                    className="nav-user-btn"
                    onClick={() => setDropdownOpen((d) => !d)}
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="nav-user-avatar" title={user.displayName || user.email}>
                      {user.photoURL
                        ? <img src={user.photoURL} alt={user.displayName || 'User'} onError={(e) => { e.target.style.display = 'none'; }} />
                        : getInitials(user.displayName || user.email)
                      }
                    </div>
                    <span className="nav-user-name">
                      {(user.displayName || user.email || '').split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>▾</span>
                  </button>

                  <div id="nav-user-dropdown" className={`nav-user-dropdown ${dropdownOpen ? 'open' : ''}`}>
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-name">{user.displayName || 'Traveler'}</div>
                      <div className="nav-dropdown-email">{user.email}</div>
                    </div>

                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="nav-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a6b3c', fontWeight: 600 }}
                      >
                        <span style={{
                          background: '#1a6b3c', color: 'white',
                          borderRadius: 5, padding: '1px 6px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em'
                        }}>ADMIN</span>
                        Admin Panel
                      </Link>
                    )}

                    <div className="nav-dropdown-divider" />

                    <button className="nav-dropdown-item danger" onClick={handleSignOut}>
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <NavLink to="/auth" className="nav-signin-btn" id="nav-signin-btn">
                  👤 Sign In
                </NavLink>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              className="hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
