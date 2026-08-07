// ============================================================
// ContactPage — Contact Form + Info
// ============================================================
//
// 📚 REACT CONCEPT: Object state for forms
// Instead of a separate useState for each form field, we use
// one state object and a generic handleChange function.
//
//   const [form, setForm] = useState({ name:'', phone:'', email:'' ... })
//   const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
//
// [e.target.name] is a "computed property name" — it uses the input's
// name attribute as the key. This one function handles ALL inputs.
// ============================================================

import { useState }      from 'react';
import { Link }          from 'react-router-dom';
import { useSettings }   from '../hooks/useSettings';
import { useToast }      from '../hooks/useToast';
import { useFirestore }  from '../hooks/useFirestore';
import { Toast }         from '../components/ui/Toast';

export default function ContactPage() {
  const settings = useSettings();
  const { toast, showToast } = useToast();
  const { data: tours }      = useFirestore('tours');

  // One state object for the entire form
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    tour: '', date: '', people: '', message: '',
  });

  // 📚 Generic change handler using computed property names
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, tour, date, people, message } = form;
    const parts = [
      `Hello! I'm ${name} (📞 ${phone}).`,
      tour    ? ` Interested in: ${tour}.`         : '',
      date    ? ` Preferred date: ${date}.`         : '',
      people  ? ` Number of people: ${people}.`     : '',
      message ? ` ${message}`                       : '',
    ];
    const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(parts.join(''))}`;
    window.open(waLink, '_blank');
    showToast('Redirecting to WhatsApp... 💬', 'success');
  };

  const waDirectLink = `https://wa.me/${settings.whatsapp}?text=Hello! I'm interested in booking a tour.`;

  const INPUT_STYLE = {
    width: '100%', padding: '12px 16px',
    border: '2px solid var(--gray-light)', borderRadius: 10,
    fontSize: '0.9rem', fontFamily: 'inherit', color: 'var(--text)',
    outline: 'none', transition: 'border-color 0.2s',
    background: 'white',
  };

  return (
    <main id="contact-page">
      <Toast {...toast} />

      {/* Page Hero */}
      <section className="page-hero scrolled">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> › <span>Contact Us</span>
          </div>
          <h1>Get in Touch</h1>
          <p>We'd love to help you plan your dream Meghalaya trip</p>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 48 }}>
        <div className="container">
          <div className="contact-grid">

            {/* ── LEFT: Contact Form ─────────────────────── */}
            <div>
              <div className="contact-form">
                <div className="section-label" style={{ marginBottom: 8 }}>Send Us a Message</div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Plan Your Trip</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 24 }}>
                  Fill in your details and we'll connect you on WhatsApp instantly.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input type="text" id="name" name="name" placeholder="Your full name" required style={INPUT_STYLE} value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" required style={INPUT_STYLE} value={form.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" style={INPUT_STYLE} value={form.email} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tour">Interested Package</label>
                    <select id="tour" name="tour" style={{ ...INPUT_STYLE, cursor: 'pointer' }} value={form.tour} onChange={handleChange}>
                      <option value="">Select a tour (optional)</option>
                      {tours.map((t) => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Preferred Travel Date</label>
                      <input type="date" id="date" name="date" style={INPUT_STYLE} value={form.date} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="people">Number of People</label>
                      <input type="number" id="people" name="people" placeholder="2" min="1" max="50" style={INPUT_STYLE} value={form.people} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message" name="message"
                      placeholder="Tell us about your trip requirements..."
                      required rows={4}
                      style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 100 }}
                      value={form.message} onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: 14 }}>
                    💬 Send via WhatsApp →
                  </button>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center', marginTop: 10 }}>
                    We typically respond within 30 minutes during business hours.
                  </p>
                </form>
              </div>
            </div>

            {/* ── RIGHT: Contact Info ───────────────────── */}
            <div>
              <div className="contact-info-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>Our Contact Info</h3>
                {[
                  { icon: '📞', label: 'Phone',         value: settings.phone },
                  { icon: '✉️', label: 'Email',         value: settings.email },
                  { icon: '📍', label: 'Address',       value: settings.address },
                  { icon: '🕐', label: 'Working Hours', value: 'Mon–Sat: 8:00 AM – 8:00 PM\nSun: 9:00 AM – 5:00 PM' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="contact-info-item">
                    <div className="contact-info-icon">{icon}</div>
                    <div className="contact-info-text">
                      <strong>{label}</strong>
                      <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
                    </div>
                  </div>
                ))}
                <a href={waDirectLink} className="btn whatsapp-btn" target="_blank" rel="noreferrer">
                  💬 Chat on WhatsApp Now
                </a>
              </div>

              {/* Map placeholder */}
              <div style={{
                background: 'var(--light-2)', borderRadius: 16, height: 220,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12, border: '2px dashed var(--gray-light)', marginTop: 20,
              }}>
                <span style={{ fontSize: '3rem' }}>🗺️</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Police Bazar, Shillong</span>
                <a
                  href="https://www.google.com/maps/search/Police+Bazar+Shillong+Meghalaya"
                  target="_blank" rel="noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  Open in Google Maps
                </a>
              </div>

              {/* Social Media */}
              <div style={{ marginTop: 20, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Follow Our Adventures</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { href: settings.social?.facebook,  emoji: 'f',  label: 'Follow on Facebook',    color: '#1877f2', bg: 'rgba(24,119,242,0.05)'  },
                    { href: settings.social?.instagram, emoji: '📷', label: 'Follow on Instagram',   color: '#e1306c', bg: 'rgba(225,48,108,0.05)'   },
                    { href: settings.social?.youtube,   emoji: '▶',  label: 'Subscribe on YouTube',  color: '#ff0000', bg: 'rgba(255,0,0,0.05)'      },
                  ].map(({ href, emoji, label, color, bg }) => (
                    <a
                      key={label}
                      href={href || '#'}
                      target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 8, background: bg, color, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}
                    >
                      <span>{emoji}</span> {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
