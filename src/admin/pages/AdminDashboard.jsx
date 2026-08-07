// ============================================================
// AdminDashboard — Stats + Overview
// ============================================================

import { Link }          from 'react-router-dom';
import { useFirestore }  from '../../hooks/useFirestore';
import { LoadingSpinner} from '../../components/ui/LoadingSpinner';

const STAT_CARDS = [
  { label: 'Attractions',   icon: '🗺️', path: '/admin/attractions', color: '#1a6b3c' },
  { label: 'Tour Packages', icon: '🧳', path: '/admin/tours',        color: '#0ea5e9' },
  { label: 'Testimonials',  icon: '⭐', path: '/admin/testimonials', color: '#f59e0b' },
  { label: 'Categories',    icon: '🏷️', path: '/admin/settings',     color: '#8b5cf6' },
];

export default function AdminDashboard() {
  const { data: attractions,  loading: la } = useFirestore('attractions');
  const { data: tours,        loading: lt } = useFirestore('tours');
  const { data: testimonials, loading: lte }= useFirestore('testimonials');
  const { data: categories }                = useFirestore('categories');

  const counts = [attractions.length, tours.length, testimonials.length, categories.length];
  const loading = la || lt || lte;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Overview of your travel agency content</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {STAT_CARDS.map((card, i) => (
              <Link key={card.label} to={card.path} style={{ textDecoration: 'none' }}>
                <div className="admin-stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{counts[i]}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-light)' }}>{card.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', marginTop: 4 }}>Manage →</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="admin-card">
            <h2 className="admin-card-title">Quick Actions</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { to: '/admin/attractions', label: '+ Add Attraction' },
                { to: '/admin/tours',       label: '+ Add Tour'       },
                { to: '/admin/testimonials',label: '+ Add Review'     },
                { to: '/admin/hero',        label: '✏️ Edit Hero'     },
                { to: '/admin/settings',    label: '⚙️ Site Settings' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Attractions */}
          <div className="admin-card" style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="admin-card-title" style={{ marginBottom: 0 }}>Recent Attractions</h2>
              <Link to="/admin/attractions" style={{ fontSize: '0.82rem', color: 'var(--admin-accent)' }}>View all →</Link>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>Category</th><th>Rating</th><th>Top Pick</th></tr>
                </thead>
                <tbody>
                  {attractions.slice(0, 5).map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td><strong>{a.name}</strong></td>
                      <td><span className="badge-admin badge-info">{a.category}</span></td>
                      <td>⭐ {a.rating}</td>
                      <td>{a.isTopPick ? '✅' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
