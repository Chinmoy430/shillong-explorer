// ============================================================
// HeroSection — Homepage Hero with Real-time Firestore Data
// ============================================================
//
// 📚 REACT CONCEPT: useEffect for data subscriptions
// This component subscribes to siteContent/hero in Firestore.
// When an admin edits the hero in the Admin Panel and saves,
// the subscribeToHero callback fires and updates this component
// in real-time — no refresh needed.
//
// The counter animation uses useRef to ensure it only runs once,
// even if the component re-renders (which happens when hero data loads).
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { Link }                         from 'react-router-dom';
import { subscribeToHero }              from '../../services/dataService';

const STATS = [
  { count: 50,   label: 'Attractions'    },
  { count: 25,   label: 'Tour Packages'  },
  { count: 2000, label: 'Happy Travelers'},
  { count: 5,    label: 'Years Experience'},
];

export function HeroSection() {
  const [hero, setHero] = useState({
    title:           'Explore the Magic of <span>Shillong</span>',
    subtitle:        'Scotland of the East — Waterfalls, Caves, and Culture Await You',
    ctaText:         'Browse Attractions →',
    backgroundImage: '/assets/images/hero.png',
  });
  const [bgLoaded, setBgLoaded] = useState(false);

  // 📚 useRef: persists between renders without causing re-renders.
  // We use it as a flag: once counters are animated, never animate again.
  const countersRan = useRef(false);

  // Subscribe to real-time hero data from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToHero((data) => {
      setHero(data);
      // Pre-load the new background image to avoid flash
      const img = new Image();
      img.onload = () => setBgLoaded(true);
      img.src    = data.backgroundImage;
    });
    return unsubscribe;
  }, []);

  // Animate stat counters (0 → target) on mount — runs only once
  useEffect(() => {
    if (countersRan.current) return;
    countersRan.current = true;

    document.querySelectorAll('[data-count]').forEach((el) => {
      const target    = parseInt(el.dataset.count, 10);
      let current     = 0;
      const increment = target / (1500 / 16); // 1500ms animation at 60fps

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
          return;
        }
        el.textContent = Math.floor(current) + '+';
      }, 16);
    });
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Background image — fades in once loaded */}
      <div
        className={`hero-bg ${bgLoaded ? 'loaded' : ''}`}
        id="hero-bg"
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-label">
          <span className="dot" />
          Northeast India's Premier Travel Agency
        </div>

        {/*
          📚 dangerouslySetInnerHTML:
          Used here because the hero title contains an HTML <span> for styling
          the highlighted word (e.g. "Shillong" in green).
          Only use this for trusted admin-controlled content, never for
          user-submitted content (XSS risk).
        */}
        <h1 id="hero-title" dangerouslySetInnerHTML={{ __html: hero.title }} />
        <p className="hero-sub" id="hero-sub">{hero.subtitle}</p>

        <div className="hero-actions">
          <Link to="/attractions" className="btn btn-accent" id="hero-cta">
            {hero.ctaText || 'Browse Attractions →'}
          </Link>
          <Link to="/tours"   className="btn btn-white">View Tour Packages</Link>
          <Link to="/contact" className="btn btn-accent">Book a Tour</Link>
        </div>

        {/* Stats counters */}
        <div className="hero-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat-num" data-count={stat.count}>0+</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll">↓</div>
    </section>
  );
}
