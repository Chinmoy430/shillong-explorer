// ============================================================
// AttractionModal — Attraction Detail Overlay
// ============================================================
//
// 📚 REACT CONCEPT: Composition with Modal wrapper
// AttractionModal uses the generic <Modal> component as its container.
// Modal handles the overlay, scroll locking, backdrop click-to-close,
// and the portal. AttractionModal only cares about what's INSIDE.
//
// This is the composition pattern:
//   <Modal isOpen onClose> ← container (handles overlay behaviour)
//     <div className="modal"> ← content (handles what's shown)
// ============================================================

import { Link }        from 'react-router-dom';
import { Modal }       from '../ui/Modal';
import { StarRating }  from '../ui/StarRating';
import { Badge }       from '../ui/Badge';
import { useSettings } from '../../hooks/useSettings';

/**
 * @param {Object}   attraction - The attraction to display (or null)
 * @param {boolean}  isOpen     - Controls modal visibility
 * @param {function} onClose    - Called when user dismisses the modal
 */
export function AttractionModal({ attraction, isOpen, onClose }) {
  const settings = useSettings();

  // Early return — nothing to render if no attraction is selected
  if (!attraction) return null;

  const {
    name, category, rating, reviewCount,
    shortDesc, fullDesc, image,
    location, duration, bestTime, isTopPick,
  } = attraction;

  const waLink = `https://wa.me/${settings.whatsapp}?text=I'd like to visit "${name}". Please help me plan a tour!`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal" role="document">

        {/* Image header */}
        <div className="modal-img">
          <img src={image} alt={name} />
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-category">{category}</div>
          <h2 className="modal-title">{name}</h2>

          <div className="modal-rating">
            <StarRating rating={rating} />
            <span className="rating-text">{rating}</span>
            <span className="review-count">({reviewCount} reviews)</span>
            {isTopPick && <Badge type="top">🏆 Top Pick</Badge>}
          </div>

          <p className="modal-desc">{fullDesc || shortDesc}</p>

          <div className="modal-details">
            {[
              { label: '📍 Location', value: location },
              { label: '⏱ Duration', value: duration },
              { label: '📅 Best Time', value: bestTime },
              { label: '📌 Type',     value: category  },
            ].map(({ label, value }) => (
              <div key={label} className="modal-detail">
                <span className="modal-detail-label">{label}</span>
                <span className="modal-detail-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <a href={waLink} className="btn btn-accent" target="_blank" rel="noreferrer">
              💬 Plan This Visit on WhatsApp
            </a>
            <Link to="/tours" className="btn btn-outline" onClick={onClose}>
              Browse Tour Packages
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
