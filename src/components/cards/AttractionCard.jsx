// ============================================================
// AttractionCard — Attraction Grid Card
// ============================================================
//
// 📚 REACT CONCEPTS USED HERE:
//
// 1. Props — everything needed is passed from the parent.
//    AttractionCard never fetches data itself — the page fetches
//    it and passes one attraction object down via props.
//    This makes the card reusable on HomePage, AttractionsPage, etc.
//
// 2. onClick as a prop — the parent (page) owns the modal state.
//    When the card is clicked, it calls onOpenModal(attraction),
//    which sets selectedAttraction in the parent, which opens the modal.
//    This is "lifting state up" — state lives where it's needed by
//    multiple components (both the card grid and the modal).
//
// 3. Conditional rendering — {isTopPick && <Badge>} renders the badge
//    only when isTopPick is true.
// ============================================================

import { StarRating } from '../ui/StarRating';
import { Badge }      from '../ui/Badge';

const CATEGORY_ICONS = {
  nature:    '🌿',
  waterfall: '💧',
  lake:      '🏞️',
  cultural:  '🏛️',
  adventure: '🧗',
  village:   '🏡',
  viewpoint: '🔭',
  all:       '🗺️',
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/**
 * @param {Object}   attraction   - Attraction data object from Firestore
 * @param {function} onOpenModal  - Called with the attraction when card is clicked
 */
export function AttractionCard({ attraction, onOpenModal }) {
  const { name, category, rating, reviewCount, shortDesc, image, location, duration, bestTime, rank, isTopPick } = attraction;
  const icon = CATEGORY_ICONS[category] || '📍';

  return (
    <div
      className="attraction-card reveal"
      data-category={category}
      onClick={() => onOpenModal(attraction)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      // Keyboard accessibility — open modal on Enter key too
      onKeyDown={(e) => { if (e.key === 'Enter') onOpenModal(attraction); }}
      aria-label={`View details for ${name}`}
    >
      <div className="card-img-wrap">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => { e.target.src = '/assets/images/hero.png'; }}
        />
        <div className="card-rank">#{rank}</div>
        <div className="card-badges">
          {/* 📚 Short-circuit evaluation: isTopPick && <Badge> */}
          {isTopPick && <Badge type="top">🏆 Top Pick</Badge>}
          <Badge type="white">{icon} {capitalize(category)}</Badge>
        </div>
      </div>

      <div className="card-body">
        <div className="card-category">{capitalize(category)}</div>
        <h3 className="card-title">{name}</h3>

        <div className="card-rating">
          <StarRating rating={rating} />
          <span className="rating-text">{rating}</span>
          <span className="review-count">({reviewCount?.toLocaleString()} reviews)</span>
        </div>

        <p className="card-desc">{shortDesc}</p>

        <div className="card-meta">
          <span className="card-meta-item">📍 {location}</span>
          <span className="card-meta-item">⏱ {duration}</span>
          <span className="card-meta-item">📅 {bestTime}</span>
          <span className="card-arrow">→</span>
        </div>
      </div>
    </div>
  );
}
