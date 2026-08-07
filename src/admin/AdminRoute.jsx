// ============================================================
// AdminRoute — Role-Based Access Control Guard
// ============================================================
//
// 📚 REACT CONCEPT: Route Guard / Protected Route pattern
//
// AdminRoute is a "wrapper" component — it wraps child components
// and decides whether to render them or redirect.
//
// Three states:
//   1. loading = true  → show spinner (auth not checked yet)
//   2. !user           → redirect to /auth (not signed in)
//   3. role !== 'admin'→ redirect to / (signed in but not admin)
//   4. role === 'admin'→ render children (access granted)
//
// Usage in App.jsx:
//   <AdminRoute>
//     <AdminLayout>
//       <AdminDashboard />
//     </AdminLayout>
//   </AdminRoute>
//
// This replaces the old localStorage password check:
//   if (!localStorage.getItem('adminLoggedIn')) redirect('/admin-login.html');
// ============================================================

import { Navigate, useLocation }  from 'react-router-dom';
import { useAuth }                 from '../hooks/useAuth';
import { LoadingSpinner }          from '../components/ui/LoadingSpinner';

export function AdminRoute({ children }) {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // Wait for Firebase auth check to complete before making any decision
  if (loading) return <LoadingSpinner fullPage />;

  // Not signed in → redirect to auth, preserve intended destination
  if (!user) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Signed in but not admin → send to home (don't reveal the admin exists)
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin user — render the protected content
  return children;
}
