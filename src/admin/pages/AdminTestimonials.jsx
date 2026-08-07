// ============================================================
// AdminTestimonials — CRUD for Customer Reviews
// ============================================================

import { useState }       from 'react';
import { useFirestore }   from '../../hooks/useFirestore';
import { useToast }       from '../../hooks/useToast';
import { Toast }          from '../../components/ui/Toast';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { addTestimonial, updateTestimonial, deleteTestimonial } from '../../services/dataService';

const EMPTY_FORM = { name: '', location: '', avatar: '', rating: 5, text: '', date: '' };

export default function AdminTestimonials() {
  const { data: testimonials, loading } = useFirestore('testimonials');
  const { toast, showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);

  const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...EMPTY_FORM, ...item }); setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateTestimonial(editItem.id, form);
        showToast('Review updated ✓', 'success');
      } else {
        await addTestimonial(form);
        showToast('Review added ✓', 'success');
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
      await deleteTestimonial(deleteId);
      showToast('Review deleted', 'success');
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
          <h1 className="admin-page-title">Testimonials</h1>
          <p className="admin-page-subtitle">{testimonials.length} reviews</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Review</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Avatar</th><th>Name</th><th>Location</th><th>Rating</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--admin-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {t.avatar || t.name?.slice(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td><strong>{t.name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</span></td>
                    <td>📍 {t.location}</td>
                    <td>{'★'.repeat(t.rating)}</td>
                    <td>{t.date}</td>
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

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editItem ? 'Edit Review' : 'Add Review'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Reviewer Name *</label>
                  <input {...INPUT} name="name" required value={form.name} onChange={handleChange} placeholder="Priya Sharma" />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Location</label>
                  <input {...INPUT} name="location" value={form.location} onChange={handleChange} placeholder="Delhi" />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Avatar (initials, e.g. PS)</label>
                  <input {...INPUT} name="avatar" value={form.avatar} onChange={handleChange} maxLength={2} placeholder="PS" />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Rating (1–5)</label>
                  <input {...INPUT} type="number" name="rating" min="1" max="5" value={form.rating} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Date</label>
                  <input {...INPUT} name="date" value={form.date} onChange={handleChange} placeholder="March 2025" />
                </div>
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Review Text *</label>
                <textarea className="admin-input" name="text" required value={form.text} onChange={handleChange} rows={4} placeholder="Write the review text…" />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editItem ? 'Update Review' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <h2 style={{ marginBottom: 8 }}>Delete Review?</h2>
            <p style={{ color: 'var(--admin-text-light)', marginBottom: 24 }}>This cannot be undone.</p>
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
