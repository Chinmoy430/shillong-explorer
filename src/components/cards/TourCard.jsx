// ============================================================
// TourCard — Tour Package Card
// ============================================================
//
// 📚 REACT CONCEPT: Derived values (no extra state needed)
// waLink, hasSaving, and saving are computed INSIDE the render function
// from props. In vanilla JS you'd calculate these in the createTourCard()
// function and inject them into a template string.
// In React, you just compute them as regular JS variables above the return.
// They're recalculated on every render — but that's fine since renders
// are fast and these are simple calculations.
// ============================================================

import { StarRating }  from '../ui/StarRating';
import { useSettings } from '../../hooks/useSettings';

export function TourCard({ tour }) {
  const settings = useSettings();

  const {
    name, category, duration, groupSize,
    price, originalPrice,
    highlights, includes,
    image, rating, isFeatured,
  } = tour;

  const waLink    = `https://wa.me/${settings.whatsapp}?text=I'm interested in the "${name}" package.`;
  const hasSaving = originalPrice > price;
  const saving    = hasSaving ? (originalPrice - price).toLocaleString() : null;

  return (
    <div className={`tour-card ${isFeatured ? 'featured' : ''}`}>

      {/* Image */}
      <div className="tour-img">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => { e.target.src = '/assets/images/hero.png'; }}
        />
        <div className="tour-overlay" />
        <span className="tour-duration">⏱ {duration}</span>
      </div>

      {/* Body */}
      <div className="tour-body">
        <div className="tour-category">{category}</div>
        <h3 className="tour-name">{name}</h3>

        <div className="tour-rating">
          <StarRating rating={rating} />
          <span className="rating-text" style={{ fontSize: '0.8rem' }}>{rating} · {category}</span>
        </div>

        {/* Highlights — slice to first 4, show "+N more" if there are extra */}
        <div className="tour-highlights">
          {highlights?.slice(0, 4).map((h, i) => (
            <span key={i} className="tour-highlight">✓ {h}</span>
          ))}
          {highlights?.length > 4 && (
            <span className="tour-highlight">+{highlights.length - 4} more</span>
          )}
        </div>

        {/* Includes */}
        <div className="tour-includes">
          {includes?.map((inc, i) => (
            <span key={i} className="tour-include-item">✅ {inc}</span>
          ))}
        </div>

        {/* Footer: price + book button */}
        <div className="tour-footer">
          <div className="tour-price">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="tour-price-main">₹{price?.toLocaleString()}</span>
              {hasSaving && (
                <span className="tour-price-original">₹{originalPrice?.toLocaleString()}</span>
              )}
            </div>
            <span className="tour-price-per">per person · {groupSize}</span>
            {hasSaving && (
              <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>
                Save ₹{saving}
              </span>
            )}
          </div>
          <a href={waLink} target="_blank" rel="noreferrer" className="tour-book-btn">
            Book Now ➜
          </a>
        </div>
      </div>
    </div>
  );
}
