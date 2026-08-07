// ============================================================
// AdminTours — CRUD for Tour Packages
// ============================================================

import { useState }       from 'react';
import { useFirestore }   from '../../hooks/useFirestore';
import { useToast }       from '../../hooks/useToast';
import { Toast }          from '../../components/ui/Toast';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImageUploader }  from '../../components/ui/ImageUploader';
import { addTour, updateTour, deleteTour } from '../../services/dataService';

const EMPTY_FORM = {
  name: '', category: 'Sightseeing', duration: '1 Day', groupSize: '2–12 people',
  price: 1999, originalPrice: 2499, rating: 4.5, isFeatured: false,
  description: '', image: '',
  highlights: '', // comma-separated string → converted to array on save
  includes:   '', // comma-separated string → converted to array on save
};

const CATEGORIES = ['Sightseeing', 'Nature', 'Adventure', 'Cultural', 'Wildlife'];
const DURATIONS  = ['Half Day', '1 Day', '2 Days', '3 Days', '5 Days', 'Custom'];

export default function AdminTours() {
  const { data: tours, loading } = useFirestore('tours');
  const { toast, showToast }     = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);

  const toFormValues = (item) => ({
    ...EMPTY_FORM, ...item,
    highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : item.highlights || '',
    includes:   Array.isArray(item.includes)   ? item.includes.join(', ')   : item.includes   || '',
  });

  const toFirestoreValues = (f) => ({
    ...f,
    highlights: f.highlights.split(',').map((s) => s.trim()).filter(Boolean),
    includes:   f.includes.split(',').map((s)   => s.trim()).filter(Boolean),
    price:         Number(f.price),
    originalPrice: Number(f.originalPrice),
    rating:        Number(f.rating),
  });

  const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setForm(toFormValues(item)); setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = toFirestoreValues(form);
      if (editItem) {
        await updateTour(editItem.id, data);
        showToast('Tour updated ✓', 'success');
      } else {
        await addTour(data);
        showToast('Tour added ✓', 'success');
      }
      closeModal();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTour(deleteId);
      showToast('Tour deleted', 'success');
    } catch { showToast('Delete failed', 'error'); }
    setDeleteId(null);
  };

  const INPUT = { className: 'admin-input' };
  const LABEL = { className: 'admin-label' };

  return (
    <div>
      <Toast {...toast} />
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tour Packages</h1>
          <p className="admin-page-subtitle">{tours.length} packages · managed in real-time</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Tour</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Duration</th><th>Price</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {tours.map((t) => (
                  <tr key={t.id}>
                    <td><img src={t.image} alt={t.name} style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none'; }} /></td>
                    <td><strong>{t.name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>{t.groupSize}</span></td>
                    <td><span className="badge-admin badge-info">{t.category}</span></td>
                    <td>{t.duration}</td>
                    <td>₹{t.price?.toLocaleString()}</td>
                    <td>{t.isFeatured ? '✅' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn-edit"   onClick={() => openEdit(t)}>✏️</button>
                        <button className="admin-btn-delete" onClick={() => setDeleteId(t.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="admin-modal" style={{ maxWidth: 700 }}>
            <div className="admin-modal-header">
              <h2>{editItem ? 'Edit Tour' : 'Add Tour Package'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Name *</label>
                  <input {...INPUT} name="name" required value={form.name} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Category</label>
                  <select className="admin-input" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Duration</label>
                  <select className="admin-input" name="duration" value={form.duration} onChange={handleChange}>
                    {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Group Size</label>
                  <input {...INPUT} name="groupSize" value={form.groupSize} onChange={handleChange} placeholder="2–12 people" />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Price (₹)</label>
                  <input {...INPUT} type="number" name="price" value={form.price} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Original Price (₹)</label>
                  <input {...INPUT} type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Rating</label>
                  <input {...INPUT} type="number" name="rating" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Tour Photo</label>
                <ImageUploader
                  value={form.image}
                  onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                  folder="tours"
                  label="Tour Photo"
                />
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Description</label>
                <textarea className="admin-input" name="description" value={form.description} onChange={handleChange} rows={2} />
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Highlights (comma-separated)</label>
                <input {...INPUT} name="highlights" value={form.highlights} onChange={handleChange} placeholder="Dawki Boating, Root Bridge, Mawlynnong" />
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Includes (comma-separated)</label>
                <input {...INPUT} name="includes" value={form.includes} onChange={handleChange} placeholder="AC Vehicle, Guide, Entry Tickets" />
              </div>
              <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                <label htmlFor="isFeatured" style={{ fontWeight: 600, cursor: 'pointer' }}>⭐ Mark as Featured</label>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editItem ? 'Update Tour' : 'Add Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <h2 style={{ marginBottom: 8 }}>Delete Tour?</h2>
            <p style={{ color: 'var(--admin-text-light)', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn" style={{ background: '#ef4444', color: 'white' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
