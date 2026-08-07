// ============================================================
// WhyChooseUs — Static Feature Cards Section
// ============================================================
//
// 📚 REACT CONCEPT: Static data arrays for rendering
// This section never changes (it's company USP content), so it's
// fine to hardcode the data array at the module level.
// The array is defined once and Array.map() renders the cards —
// much cleaner than copying the same <div> HTML 6 times.
// ============================================================

const FEATURES = [
  {
    icon:  '🗺️',
    title: 'Local Experts',
    desc:  'Born and raised in Shillong, our guides know every hidden trail and local secret.',
  },
  {
    icon:  '💰',
    title: 'Best Price Guarantee',
    desc:  'Competitive pricing with no hidden charges. We promise you the best value.',
  },
  {
    icon:  '🚗',
    title: 'Comfortable Transport',
    desc:  'Air-conditioned vehicles maintained to highest safety standards for your comfort.',
  },
  {
    icon:  '📱',
    title: '24/7 Support',
    desc:  "We're just a WhatsApp message away throughout your entire journey.",
  },
  {
    icon:  '🎯',
    title: 'Custom Itineraries',
    desc:  "Tell us your interests and we'll craft a personalized tour just for you.",
  },
  {
    icon:  '⭐',
    title: '5-Star Rated',
    desc:  'Trusted by 2,000+ happy travelers with consistently excellent reviews.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label" style={{ color: 'var(--accent)', justifyContent: 'center' }}>
            Why Choose Us
          </div>
          <h2 className="section-title" style={{ color: 'var(--white)', textAlign: 'center' }}>
            Travel With Confidence
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)', margin: '0 auto', textAlign: 'center' }}>
            We make every journey memorable, comfortable, and perfectly tailored for you.
          </p>
        </div>

        <div className="why-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="why-card reveal">
              <div className="why-icon">{f.icon}</div>
              <div className="why-title">{f.title}</div>
              <div className="why-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
