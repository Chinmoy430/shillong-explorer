// ============================================================
// HomePage — Main Landing Page
// ============================================================
//
// 📚 REACT CONCEPTS USED HERE:
//
// 1. useState — local state for: active category filter, search query,
//    selected attraction (controls modal open/close)
//
// 2. useFirestore — 4 real-time subscriptions (attractions, tours,
//    categories, testimonials). Each one: fires immediately with
//    current Firestore data, then auto-updates when data changes.
//
// 3. useMemo — computes filtered attractions only when dependencies
//    change. Prevents unnecessary recalculation on every render.
//    Dependencies: [attractions, activeCategory, searchQuery]
//
// 4. Composition — HomePage assembles many smaller components.
//    It's the "smart" component (owns data + state); other components
//    are "dumb" (receive props + render).
// ============================================================

import { useState, useMemo } from 'react';
import { Link }               from 'react-router-dom';
import { useFirestore }       from '../hooks/useFirestore';
import { useScrollReveal }    from '../hooks/useScrollReveal';
import { useToast }           from '../hooks/useToast';
import { HeroSection }        from '../components/sections/HeroSection';
import { CategoryChips }      from '../components/sections/CategoryChips';
import { AttractionCard }     from '../components/cards/AttractionCard';
import { WhyChooseUs }        from '../components/sections/WhyChooseUs';
import { TourCard }           from '../components/cards/TourCard';
import { TestimonialsSection} from '../components/sections/TestimonialsSection';
import { NewsletterSection }  from '../components/sections/NewsletterSection';
import { AttractionModal }    from '../components/modals/AttractionModal';
import { LoadingSpinner }     from '../components/ui/LoadingSpinner';
import { Toast }              from '../components/ui/Toast';

export default function HomePage() {
  const [activeCategory,     setActiveCategory]     = useState('all');
  const [searchQuery,        setSearchQuery]         = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const { toast, showToast } = useToast();

  // ── Firestore real-time data ──────────────────────────────
  const { data: attractions, loading: attractionsLoading } = useFirestore('attractions', 'rank');
  const { data: tours }        = useFirestore('tours');
  const { data: categories }   = useFirestore('categories', 'order');
  const { data: testimonials } = useFirestore('testimonials');

  // ── Computed / Derived data ───────────────────────────────
  // 📚 useMemo: only recalculate when these 3 values change.
  // Without useMemo, this filter would run on EVERY render, even
  // if the user just toggled the modal or scrolled the page.
  const filteredAttractions = useMemo(() => {
    let result = attractions;

    if (activeCategory !== 'all') {
      result = result.filter((a) => a.category === activeCategory);
    }
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

  const featuredTours = useMemo(
    () => tours.filter((t) => t.isFeatured),
    [tours]
  );

  // Activate scroll reveal animations after every render
  useScrollReveal();

  return (
    <main id="home-page">
      <Toast {...toast} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Search Bar ───────────────────────────────────── */}
      <section className="search-section">
        <div className="container">
          <div className="search-bar" id="main-search">
            <span className="search-icon">🔍</span>
            {/* 📚 Controlled input: value is owned by React state.
                Every keystroke calls setSearchQuery → triggers useMemo
                → filteredAttractions recalculates → grid re-renders. */}
            <input
              type="text"
              placeholder="Search attractions, waterfalls, tours..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* ── Category Chips ───────────────────────────────── */}
      <CategoryChips
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* ── Featured Attractions ─────────────────────────── */}
      <section className="attractions-section section-pad" id="featured-attractions">
        <div className="container">
          <div className="reveal">
            <div className="section-label">Must Visit</div>
            <h2 className="section-title">Top Attractions in <span>Shillong</span></h2>
            <p className="section-subtitle">
              Explore breathtaking destinations handpicked by our local travel experts.
            </p>
          </div>

          {attractionsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="attractions-grid" id="attractions-grid">
              {filteredAttractions.map((attraction) => (
                // 📚 key prop — required for lists. React uses it to track
                // which item changed/was added/removed for efficient DOM updates.
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onOpenModal={setSelectedAttraction}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 40 }} className="reveal">
            <Link to="/attractions" className="btn btn-outline">See All Attractions →</Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <WhyChooseUs />

      {/* ── Featured Tour Packages ───────────────────────── */}
      <section className="tours-section" id="featured-tours">
        <div className="container">
          <div className="reveal">
            <div className="section-label">Explore Meghalaya</div>
            <h2 className="section-title">Featured Tour <span>Packages</span></h2>
            <p className="section-subtitle">
              Curated tour packages to the best of Shillong and Meghalaya.
            </p>
          </div>

          <div className="tours-grid">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }} className="reveal">
            <Link to="/tours" className="btn btn-primary">View All Packages →</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <TestimonialsSection testimonials={testimonials} />

      {/* ── Newsletter ───────────────────────────────────── */}
      <NewsletterSection onShowToast={showToast} />

      {/* ── Attraction Detail Modal ───────────────────────── */}
      {/* isOpen is true when an attraction is selected (selectedAttraction is not null) */}
      <AttractionModal
        attraction={selectedAttraction}
        isOpen={!!selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </main>
  );
}
