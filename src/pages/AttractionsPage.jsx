// ============================================================
// AttractionsPage — Full Attractions Listing
// ============================================================

import { useState, useMemo }  from 'react';
import { Link }                from 'react-router-dom';
import { useFirestore }        from '../hooks/useFirestore';
import { useScrollReveal }     from '../hooks/useScrollReveal';
import { CategoryChips }       from '../components/sections/CategoryChips';
import { AttractionCard }      from '../components/cards/AttractionCard';
import { AttractionModal }     from '../components/modals/AttractionModal';
import { LoadingSpinner }      from '../components/ui/LoadingSpinner';

export default function AttractionsPage() {
  const [activeCategory,     setActiveCategory]     = useState('all');
  const [searchQuery,        setSearchQuery]         = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const { data: attractions, loading } = useFirestore('attractions', 'rank');
  const { data: categories }           = useFirestore('categories', 'order');

  const filtered = useMemo(() => {
    let result = attractions;
    if (activeCategory !== 'all') result = result.filter((a) => a.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result  = result.filter((a) =>
        a.name?.toLowerCase().includes(q)      ||
        a.shortDesc?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [attractions, activeCategory, searchQuery]);

  useScrollReveal();

  return (
    <main id="attractions-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> › <span>Attractions</span>
          </div>
          <h1>Attractions in Shillong</h1>
          <p>Discover breathtaking destinations across Meghalaya</p>
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <div className="container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search attractions..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <CategoryChips
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Grid */}
      <section className="attractions-section section-pad">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 24 }}>
            <span>
              Showing <strong>{filtered.length}</strong> of <strong>{attractions.length}</strong> attractions
              {activeCategory !== 'all' && ` in "${activeCategory}"`}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <p>No attractions found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="attractions-grid">
              {filtered.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onOpenModal={setSelectedAttraction}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AttractionModal
        attraction={selectedAttraction}
        isOpen={!!selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </main>
  );
}
