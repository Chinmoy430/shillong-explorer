// ============================================================
// AdminSettings — Site Settings + Database Seeding
// ============================================================

import { useState, useEffect } from 'react';
import { useToast }             from '../../hooks/useToast';
import { Toast }                from '../../components/ui/Toast';
import { getSiteSettings, updateSiteSettings } from '../../services/dataService';
import { seedFirestore }        from '../../services/seedService';
import { LoadingSpinner }       from '../../components/ui/LoadingSpinner';

const DEFAULT_FORM = {
  agencyName: '', tagline: '', phone: '', email: '', whatsapp: '', address: '',
  social: { facebook: '', instagram: '', youtube: '', twitter: '' },
};

export default function AdminSettings() {
  const [form,        setForm]        = useState(DEFAULT_FORM);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [seeding,     setSeeding]     = useState(false);
  const [seedLog,     setSeedLog]     = useState([]);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setForm({ ...DEFAULT_FORM, ...data, social: { ...DEFAULT_FORM.social, ...(data.social || {}) } });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (e) => {
    setForm((f) => ({ ...f, social: { ...f.social, [e.target.name]: e.target.value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(form);
      showToast('Settings saved! Changes are live. ✓', 'success');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Seed Firestore with default data
  const handleSeed = async () => {
    setSeeding(true);
    setSeedLog([]);
    try {
      await seedFirestore((msg) => {
        setSeedLog((prev) => [...prev, msg]);
      });
      showToast('Database initialized successfully! ✓', 'success');
    } catch (err) {
      showToast('Seed error: ' + err.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const INPUT = { className: 'admin-input' };
  const LABEL = { className: 'admin-label' };

  return (
    <div>
      <Toast {...toast} />
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Settings</h1>
          <p className="admin-page-subtitle">Update agency info, contact details, and social links</p>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => setShowSeedModal(true)}
          style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
        >
          🌱 Initialize Database
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* General Info */}
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <h2 className="admin-card-title">General Information</h2>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label {...LABEL}>Agency Name</label>
              <input {...INPUT} name="agencyName" value={form.agencyName} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label {...LABEL}>Tagline</label>
              <input {...INPUT} name="tagline" value={form.tagline} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form-group">
            <label {...LABEL}>Address</label>
            <input {...INPUT} name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        {/* Contact */}
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <h2 className="admin-card-title">Contact Details</h2>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label {...LABEL}>Phone Number</label>
              <input {...INPUT} name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
            <div className="admin-form-group">
              <label {...LABEL}>Email Address</label>
              <input {...INPUT} name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label {...LABEL}>WhatsApp Number (digits only)</label>
              <input {...INPUT} name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="919876543210" />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>Include country code, no spaces or +</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <h2 className="admin-card-title">Social Media Links</h2>
          <div className="admin-form-row">
            {['facebook', 'instagram', 'youtube', 'twitter'].map((platform) => (
              <div key={platform} className="admin-form-group">
                <label {...LABEL}>{platform.charAt(0).toUpperCase() + platform.slice(1)} URL</label>
                <input {...INPUT} name={platform} type="url" value={form.social[platform] || ''} onChange={handleSocialChange} placeholder={`https://${platform}.com/your-page`} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ fontSize: '1rem', padding: '12px 32px' }}>
          {saving ? 'Saving…' : '💾 Save All Settings'}
        </button>
      </form>

      {/* Seed Database Modal */}
      {showSeedModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h2>🌱 Initialize Database</h2>
              <button className="admin-modal-close" onClick={() => { setShowSeedModal(false); setSeedLog([]); }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <strong>⚠️ Before running:</strong> This will write default data (attractions, tours, testimonials, categories, hero, settings) to Firestore. Collections that already have documents will be <strong>skipped</strong>, so it is safe to run on an existing database.
              </div>
              {seedLog.length > 0 && (
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, maxHeight: 200, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.82rem', marginBottom: 16 }}>
                  {seedLog.map((line, i) => <div key={i} style={{ color: line.startsWith('✅') ? '#16a34a' : '#374151' }}>{line}</div>)}
                </div>
              )}
              <div className="admin-modal-footer">
                <button className="btn btn-outline" onClick={() => { setShowSeedModal(false); setSeedLog([]); }} disabled={seeding}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={handleSeed}
                  disabled={seeding}
                  style={{ background: '#f59e0b', borderColor: '#f59e0b' }}
                >
                  {seeding ? '⏳ Seeding…' : '🌱 Run Seed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
