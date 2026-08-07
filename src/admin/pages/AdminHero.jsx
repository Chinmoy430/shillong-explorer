// ============================================================
// AdminHero — Edit Hero Section (real-time preview)
// ============================================================

import { useState, useEffect } from 'react';
import { useToast }             from '../../hooks/useToast';
import { Toast }                from '../../components/ui/Toast';
import { getHero, updateHero }  from '../../services/dataService';
import { LoadingSpinner }       from '../../components/ui/LoadingSpinner';
import { ImageUploader }        from '../../components/ui/ImageUploader';

export default function AdminHero() {
  const [form,    setForm]    = useState({
    title: '', subtitle: '', ctaText: '', backgroundImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const { toast, showToast }  = useToast();

  // Load current hero data on mount
  useEffect(() => {
    getHero().then((data) => {
      if (data) setForm(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHero(form);
      showToast('Hero section updated! Changes are live. ✓', 'success');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
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
          <h1 className="admin-page-title">Hero Section</h1>
          <p className="admin-page-subtitle">Edit the homepage hero banner — changes go live instantly</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Form */}
        <div className="admin-card">
          <h2 className="admin-card-title">Edit Content</h2>
          <form onSubmit={handleSave}>
            <div className="admin-form-group">
              <label {...LABEL}>Hero Title (HTML allowed for &lt;span&gt;)</label>
              <input {...INPUT} name="title" value={form.title} onChange={handleChange} placeholder="Explore the Magic of <span>Shillong</span>" />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>Wrap a word in &lt;span&gt; to highlight it in green.</span>
            </div>
            <div className="admin-form-group">
              <label {...LABEL}>Subtitle</label>
              <textarea className="admin-input" name="subtitle" value={form.subtitle} onChange={handleChange} rows={2} />
            </div>
            <div className="admin-form-group">
              <label {...LABEL}>CTA Button Text</label>
              <input {...INPUT} name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="Browse Attractions →" />
            </div>
            <div className="admin-form-group">
              <label {...LABEL}>Background Image</label>
              <ImageUploader
                value={form.backgroundImage}
                onChange={(url) => setForm((f) => ({ ...f, backgroundImage: url }))}
                folder="hero"
                label="Hero Background"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {saving ? 'Saving…' : '💾 Save Hero Section'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="admin-card">
          <h2 className="admin-card-title">Live Preview</h2>
          <div style={{
            borderRadius: 12, overflow: 'hidden', position: 'relative',
            background: '#1a2e1f', minHeight: 260,
            backgroundImage: form.backgroundImage ? `url('${form.backgroundImage}')` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,20,10,0.65)' }} />
            <div style={{ position: 'relative', padding: 24, zIndex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Northeast India's Premier Travel Agency</div>
              <h1
                style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 8 }}
                dangerouslySetInnerHTML={{ __html: form.title || 'Hero Title' }}
              />
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>{form.subtitle || 'Subtitle text'}</p>
              <div style={{ background: '#1a6b3c', color: 'white', padding: '8px 20px', borderRadius: 50, display: 'inline-block', fontSize: '0.82rem', fontWeight: 600 }}>
                {form.ctaText || 'CTA Button'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
