// ============================================================
// Footer — Site Footer with Dynamic Settings
// ============================================================
//
// 📚 REACT CONCEPT: useSettings() custom hook
// Instead of calling getData('siteSettings') on every page and
// manually updating DOM elements like document.querySelector('.site-phone'),
// we use useSettings() to read from SettingsContext.
//
// Because SettingsContext is backed by a real-time Firestore listener,
// the footer automatically updates if an admin changes the phone number
// or social media links — no page refresh needed.
// ============================================================

import { Link }         from 'react-router-dom';
import { useSettings }  from '../../hooks/useSettings';
import logo             from '../../assets/images/logo.png';

export function Footer() {
  // 📚 useSettings() reads from SettingsContext — provided at the app root
  const settings = useSettings();

  const waLink = `https://wa.me/${settings.whatsapp}?text=Hello! I'm interested in booking a tour.`;
  const year   = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src={logo} alt={settings.agencyName} style={{ height: 44, objectFit: 'contain' }} />
            </Link>
            <p>Your trusted travel partner for exploring the breathtaking landscapes of Shillong and Meghalaya. Every journey, a story worth telling.</p>
            <div className="footer-socials">
              {/* 📚 Short-circuit: settings.social?.facebook — optional chaining prevents errors if social is undefined */}
              <a href={settings.social?.facebook || '#'} className="social-link social-fb" target="_blank" rel="noreferrer" title="Facebook" aria-label="Facebook">f</a>
              <a href={settings.social?.instagram || '#'} className="social-link social-ig" target="_blank" rel="noreferrer" title="Instagram" aria-label="Instagram">📷</a>
              <a href={settings.social?.youtube  || '#'} className="social-link social-yt" target="_blank" rel="noreferrer" title="YouTube"   aria-label="YouTube">▶</a>
              <a href={settings.social?.twitter  || '#'} className="social-link social-tw" target="_blank" rel="noreferrer" title="Twitter"   aria-label="Twitter">𝕏</a>
            </div>
          </div>

          {/* Explore column */}
          <div>
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/attractions">Attractions</Link></li>
              <li><Link to="/tours">Tour Packages</Link></li>
              <li><Link to="/tours">Day Trips</Link></li>
              <li><Link to="/tours">Adventure Tours</Link></li>
              <li><Link to="/contact">Custom Tour</Link></li>
            </ul>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/contact">Book a Tour</Link></li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-item">
              <span className="icon">📍</span>
              <span>{settings.address}</span>
            </div>
            <div className="footer-contact-item">
              <span className="icon">📞</span>
              <span>{settings.phone}</span>
            </div>
            <div className="footer-contact-item">
              <span className="icon">✉️</span>
              <span>{settings.email}</span>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600 }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} <span>{settings.agencyName}</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
