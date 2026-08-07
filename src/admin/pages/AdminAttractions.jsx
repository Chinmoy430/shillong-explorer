// ============================================================
// AdminAttractions — CRUD for Attractions
// ============================================================

import { useState }        from 'react';
import { useFirestore }    from '../../hooks/useFirestore';
import { useToast }        from '../../hooks/useToast';
import { Toast }           from '../../components/ui/Toast';
import { LoadingSpinner }  from '../../components/ui/LoadingSpinner';
import { ImageUploader }   from '../../components/ui/ImageUploader';
import {
  addAttraction, updateAttraction, deleteAttraction,
} from '../../services/dataService';

const EMPTY_FORM = {
  name: '', category: 'nature', rating: 4.5, reviewCount: 100, rank: 1,
  shortDesc: '', fullDesc: '', image: '', location: '',
  duration: '2-3 hours', bestTime: 'October to April', isTopPick: false,
};

const CATEGORIES = ['nature','waterfall','lake','cultural','adventure','village','viewpoint'];

export default function AdminAttractions() {
  const { data: attractions, loading } = useFirestore('attractions', 'rank');
  const { toast, showToast }           = useToast();

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);   // null = add mode
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);

  const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...EMPTY_FORM, ...item }); setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateAttraction(editItem.id, form);
        showToast('Attraction updated ✓', 'success');
      } else {
        await addAttraction(form);
        showToast('Attraction added ✓', 'success');
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
      await deleteAttraction(deleteId);
      showToast('Attraction deleted', 'success');
    } catch {
      showToast('Delete failed', 'error');
    }
    setDeleteId(null);
  };

  const INPUT = { className: 'admin-input' };
  const LABEL = { className: 'admin-label' };

  return (
    <div>
      <Toast {...toast} />

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Attractions</h1>
          <p className="admin-page-subtitle">{attractions.length} attractions · managed in real-time</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Attraction</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Rating</th>
                  <th>Rank</th><th>Top Pick</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attractions.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <img src={a.image} alt={a.name} style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none'; }} />
                    </td>
                    <td><strong>{a.name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>{a.location}</span></td>
                    <td><span className="badge-admin badge-info">{a.category}</span></td>
                    <td>⭐ {a.rating} <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>({a.reviewCount})</span></td>
                    <td>#{a.rank}</td>
                    <td>{a.isTopPick ? '✅' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn-edit"   onClick={() => openEdit(a)}>✏️</button>
                        <button className="admin-btn-delete" onClick={() => setDeleteId(a.id)}>🗑️</button>
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
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editItem ? 'Edit Attraction' : 'Add Attraction'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Name *</label>
                  <input {...INPUT} name="name" required value={form.name} onChange={handleChange} placeholder="Elephant Falls" />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Category</label>
                  <select className="admin-input" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Photo</label>
                <ImageUploader
                  value={form.image}
                  onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                  folder="attractions"
                  label="Attraction Photo"
                />
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Short Description *</label>
                <input {...INPUT} name="shortDesc" required value={form.shortDesc} onChange={handleChange} />
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Full Description</label>
                <textarea className="admin-input" name="fullDesc" value={form.fullDesc} onChange={handleChange} rows={3} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Location</label>
                  <input {...INPUT} name="location" value={form.location} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Duration</label>
                  <input {...INPUT} name="duration" value={form.duration} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label {...LABEL}>Rating (0–5)</label>
                  <input {...INPUT} type="number" name="rating" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Review Count</label>
                  <input {...INPUT} type="number" name="reviewCount" value={form.reviewCount} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label {...LABEL}>Rank</label>
                  <input {...INPUT} type="number" name="rank" value={form.rank} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-group">
                <label {...LABEL}>Best Time to Visit</label>
                <input {...INPUT} name="bestTime" value={form.bestTime} onChange={handleChange} />
              </div>
              <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" id="isTopPick" name="isTopPick" checked={form.isTopPick} onChange={handleChange} />
                <label htmlFor="isTopPick" style={{ fontWeight: 600, cursor: 'pointer' }}>🏆 Mark as Top Pick</label>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editItem ? 'Update Attraction' : 'Add Attraction'}
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
            <h2 style={{ marginBottom: 8 }}>Delete Attraction?</h2>
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
