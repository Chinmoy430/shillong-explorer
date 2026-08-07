// ============================================================
// AdminLayout — Admin Panel Shell (Sidebar + Topbar)
// ============================================================
//
// 📚 REACT CONCEPT: Layout component with children prop
// AdminLayout is a "shell" — it renders the sidebar and topbar,
// then renders {children} in the main content area.
// The specific admin page (Dashboard, Attractions, etc.) is passed
// as children from App.jsx.
//
// This is the same idea as a master template in HTML:
//   OLD: Every admin .html file included the same sidebar HTML
//   NEW: AdminLayout wraps every admin page once, in one place
// ============================================================

import { useState, useEffect }        from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth }                     from '../hooks/useAuth';
import { logOut }                      from '../services/authService';

const NAV_ITEMS = [
  { to: '/admin',              label: 'Dashboard',    icon: '📊', end: true  },
  { to: '/admin/attractions',  label: 'Attractions',  icon: '🗺️', end: false },
  { to: '/admin/tours',        label: 'Tours',        icon: '🧳', end: false },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '⭐', end: false },
  { to: '/admin/hero',         label: 'Hero Section', icon: '🖼️', end: false },
  { to: '/admin/settings',     label: 'Settings',     icon: '⚙️', end: false },
];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

// 📚 REACT CONCEPT: children prop
// Everything between <AdminLayout> ... </AdminLayout> in App.jsx
// arrives here as the `children` prop and is rendered in the main area.
export function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logOut();
    navigate('/');
  };

  // Close sidebar when navigating (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="admin-layout">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div className="sidebar-logo-icon">🏔️</div>
            <div>
              <div className="sidebar-logo-text">SAWAIOM</div>
              <div className="sidebar-logo-sub">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="s-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user info + sign out */}
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link" style={{ marginBottom: 8 }}>
            <span className="s-icon">🌐</span>
            View Public Site
          </Link>

          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.photoURL
                ? <img src={user.photoURL} alt={user.displayName || 'Admin'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : getInitials(user?.displayName || user?.email)
              }
            </div>
            <div>
              <div className="sidebar-user-name">{user?.displayName || 'Admin'}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>

          <button onClick={handleSignOut} className="sidebar-logout">
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 39 }}
        />
      )}

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>

          <div className="topbar-title">Admin Panel</div>

          <div className="topbar-right">
            <Link to="/" className="topbar-site-btn">
              🌐 View Site
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sidebar-user-avatar" style={{ width: 36, height: 36 }}>
                {user?.photoURL
                  ? <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : getInitials(user?.displayName || user?.email)
                }
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                  {user?.displayName || 'Admin'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
