// ============================================================
// TestimonialsSection — Customer Reviews Grid
// ============================================================
//
// 📚 REACT CONCEPT: Props-driven component
// Testimonials data is fetched by the parent (HomePage) via useFirestore()
// and passed down here as a prop. The parent handles data fetching;
// this component handles rendering. Clean separation of concerns.
// ============================================================

import { StarRating } from '../ui/StarRating';

/**
 * @param {Array} testimonials - Array of testimonial objects from Firestore
 */
export function TestimonialsSection({ testimonials = [] }) {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label" style={{ justifyContent: 'center' }}>Happy Travelers</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            What Our Guests <span>Say</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            Real reviews from real travelers who explored Meghalaya with us.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card reveal">
              <div className="testimonial-rating">
                <StarRating rating={t.rating} />
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-location">📍 {t.location} · {t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
