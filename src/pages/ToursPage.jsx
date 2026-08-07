// ============================================================
// ToursPage — Tour Packages Listing with Filters
// ============================================================
//
// 📚 REACT CONCEPT: Multiple useState values + derived computation
// Each filter (duration, category, sort) is its own state variable.
// useMemo recomputes the filtered+sorted list whenever ANY filter changes.
// The sort logic uses Array.sort() — a copy is made first ([...tours])
// because sort() mutates the array and we never mutate Firestore data directly.
// ============================================================

import { useState, useMemo } from 'react';
import { Link }               from 'react-router-dom';
import { useFirestore }       from '../hooks/useFirestore';
import { useScrollReveal }    from '../hooks/useScrollReveal';
import { TourCard }           from '../components/cards/TourCard';
import { LoadingSpinner }     from '../components/ui/LoadingSpinner';

const SELECT_STYLE = {
  padding: '8px 14px',
  border: '1.5px solid #e2e8e4',
  borderRadius: 8,
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: 'inherit',
  color: '#1a2e1f',
  background: 'white',
  cursor: 'pointer',
};

export default function ToursPage() {
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [sort,     setSort]     = useState('');

  const { data: tours, loading } = useFirestore('tours');

  const filtered = useMemo(() => {
    // Always sort a COPY — never mutate the original array from state
    let result = [...tours];
    if (duration) result = result.filter((t) => t.duration === duration);
    if (category) result = result.filter((t) => t.category === category);
    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [tours, duration, category, sort]);

  useScrollReveal();

  // Derive unique duration options from actual tour data
  const durationOptions = [...new Set(tours.map((t) => t.duration).filter(Boolean))];
  const categoryOptions = [...new Set(tours.map((t) => t.category).filter(Boolean))];

  return (
    <main id="tours-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> › <span>Tour Packages</span>
          </div>
          <h1>Tour Packages</h1>
          <p>Explore Shillong &amp; Meghalaya with our expertly curated packages</p>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 40 }}>
        <div className="container">

          {/* Filter Bar */}
          <div
            className="filters-bar"
            style={{
              background: 'white', padding: '16px 20px', borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 28,
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-light)' }}>🔽 Filter:</span>

            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={SELECT_STYLE}>
              <option value="">All Durations</option>
              {durationOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select value={category} onChange={(e) => setCategory(e.target.value)} style={SELECT_STYLE}>
              <option value="">All Categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)} style={SELECT_STYLE}>
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {(duration || category || sort) && (
              <button
                onClick={() => { setDuration(''); setCategory(''); setSort(''); }}
                style={{ ...SELECT_STYLE, color: 'var(--accent)', border: '1.5px solid var(--accent)' }}
              >
                ✕ Clear Filters
              </button>
            )}

            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              <strong>{filtered.length}</strong> packages available
            </span>
          </div>

          {/* Tours Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
              <p>No packages match your filters. Try removing some filters.</p>
            </div>
          ) : (
            <div className="tours-grid" style={{ marginTop: 0 }}>
              {filtered.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Tour CTA */}
      <section style={{
        background: 'var(--dark)', padding: '60px 0',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle,rgba(26,107,60,0.2),transparent)', borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ color: 'var(--accent)', justifyContent: 'center' }}>
            Not finding what you need?
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: 'white', fontSize: '2rem', marginBottom: 12 }}>
            Build Your <span style={{ color: 'var(--accent)' }}>Custom Tour</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto 28px' }}>
            Tell us your dream trip and we'll create a personalized itinerary just for you.
          </p>
          <Link to="/contact" className="btn btn-accent">Get a Custom Quote →</Link>
        </div>
      </section>
    </main>
  );
}
