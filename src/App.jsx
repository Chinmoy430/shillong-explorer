// ============================================================
// App.jsx — Router + Context Providers + Route Map
// ============================================================
//
// 📚 REACT CONCEPT: Component Tree / Provider nesting
// App.jsx is the root of the component tree. It:
//   1. Wraps everything in <BrowserRouter> for React Router to work
//   2. Wraps in <AuthProvider> so any component can call useAuth()
//   3. Wraps in <SettingsProvider> so any component can call useSettings()
//
// The order of providers matters when they depend on each other —
// here AuthProvider is inside BrowserRouter (Auth doesn't need routing)
// and SettingsProvider is inside AuthProvider (no dependency between them,
// but both need to be inside BrowserRouter for Link/Navigate to work).
//
// Route structure:
//   /admin/*  → AdminRoute (protected) → AdminLayout → admin pages
//   /*        → public Header + public pages + Footer
//
// By using /* for both admin and public, they don't interfere.
// ============================================================

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }      from './context/AuthContext';
import { SettingsProvider }  from './context/SettingsContext';
import { Header }            from './components/layout/Header';
import { Footer }            from './components/layout/Footer';
import { AdminRoute }        from './admin/AdminRoute';
import { AdminLayout }       from './admin/AdminLayout';
import { LoadingSpinner }    from './components/ui/LoadingSpinner';

// Public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AttractionsPage = lazy(() => import('./pages/AttractionsPage'));
const ToursPage = lazy(() => import('./pages/ToursPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminAttractions = lazy(() => import('./admin/pages/AdminAttractions'));
const AdminTours = lazy(() => import('./admin/pages/AdminTours'));
const AdminTestimonials = lazy(() => import('./admin/pages/AdminTestimonials'));
const AdminHero = lazy(() => import('./admin/pages/AdminHero'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));

export default function App() {
  return (
    // 📚 BrowserRouter uses the HTML5 History API for clean URLs (/tours not /#/tours)
    <BrowserRouter>
      {/*
        📚 Provider nesting:
        Any component at any depth can now call:
          useAuth()     → reads from AuthContext
          useSettings() → reads from SettingsContext
        without prop drilling.
      */}
      <AuthProvider>
        <SettingsProvider>
          <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>

            {/* ── Admin Routes (no public Header/Footer) ─── */}
            {/*
              AdminRoute checks: is user signed in AND role === 'admin'?
              If not, redirects to /auth?redirect=/admin
            */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout>
                    {/*
                      📚 Nested Routes:
                      /admin       → AdminDashboard  (index route)
                      /admin/tours → AdminTours
                      etc.
                      The "index" attribute means this route matches /admin exactly.
                    */}
                    <Routes>
                      <Route index                   element={<AdminDashboard />}    />
                      <Route path="attractions"      element={<AdminAttractions />}  />
                      <Route path="tours"            element={<AdminTours />}        />
                      <Route path="testimonials"     element={<AdminTestimonials />} />
                      <Route path="hero"             element={<AdminHero />}         />
                      <Route path="settings"         element={<AdminSettings />}     />
                    </Routes>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* ── Public Routes (with Header + Footer) ────── */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/"            element={<HomePage />}        />
                    <Route path="/attractions" element={<AttractionsPage />} />
                    <Route path="/tours"       element={<ToursPage />}       />
                    <Route path="/contact"     element={<ContactPage />}     />
                    <Route path="/auth"        element={<AuthPage />}        />
                    {/* 404 fallback */}
                    <Route path="*"            element={
                      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
                        <div style={{ fontSize: '4rem' }}>🗺️</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', margin: '16px 0 8px' }}>Page Not Found</h1>
                        <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
                        <a href="/" className="btn btn-primary">← Back to Home</a>
                      </div>
                    } />
                  </Routes>
                  <Footer />
                </>
              }
            />

          </Routes>
          </Suspense>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
