// ============================================================
// ImageUploader — File Picker + Cloudinary Upload
// ============================================================
//
// Usage:
//   <ImageUploader
//     value={form.image}          ← current URL (shown as preview)
//     onChange={(url) => setForm(f => ({ ...f, image: url }))}
//     folder="attractions"        ← Cloudinary folder name (optional)
//   />
//
// What it does:
//   1. Shows current image as a preview card
//   2. "Choose Photo" button opens the OS file dialog
//   3. User picks a file from their computer
//   4. File uploads to Cloudinary with a progress bar
//   5. Download URL is passed back via onChange()
//   6. Firestore saves that URL — image is now live on the site
//
// ============================================================

import { useRef, useState } from 'react';

export function ImageUploader({ value, onChange, folder = 'uploads', label = 'Photo' }) {
  const inputRef   = useRef(null);
  const [progress, setProgress] = useState(null);
  const [error,    setError]    = useState('');
  const cloudName  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: images only, max 5 MB
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }

    if (!cloudName) {
      setError('Cloudinary Cloud Name is not configured. Check your .env file.');
      setProgress(null);
      return;
    }

    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_upload'); // Must be created in Cloudinary settings
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      // Handle successful upload
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            onChange(response.secure_url);
            setProgress(null);
            console.log('Image uploaded successfully:', response.public_id);
          } catch (parseErr) {
            setError('Invalid response from Cloudinary');
            setProgress(null);
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            console.error('Cloudinary error:', errorResponse);
            setError(`Upload failed: ${errorResponse.error?.message || `Status ${xhr.status}`}`);
          } catch {
            setError(`Upload failed with status ${xhr.status}. Check console for details.`);
          }
          setProgress(null);
        }
      });

      // Handle upload errors
      xhr.addEventListener('error', () => {
        setError('Upload failed. Please check your connection and try again.');
        setProgress(null);
      });

      xhr.addEventListener('abort', () => {
        setError('Upload was cancelled.');
        setProgress(null);
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      xhr.send(formData);
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err?.message || 'Unknown error'}`);
      setProgress(null);
    }

    // Reset the file input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div>
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Image Preview Card */}
      <div style={{
        border: '2px dashed var(--admin-border, #e2e8e4)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--light, #f8faf9)',
        marginBottom: 10,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {/* Hover overlay to change photo */}
            <div
              onClick={() => inputRef.current?.click()}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer',
                color: 'white', fontWeight: 700, fontSize: '0.9rem', gap: 6,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              📷 Change Photo
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted, #8fa898)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🖼️</div>
            <div style={{ fontSize: '0.85rem' }}>No image selected</div>
          </div>
        )}
      </div>

      {/* Upload Progress Bar */}
      {progress !== null && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--border, #e2e8e4)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--primary, #1a6b3c)',
              borderRadius: 99,
              transition: 'width 0.2s',
            }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: 8 }}>{error}</div>
      )}

      {/* Choose Photo Button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={progress !== null}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px',
          background: 'var(--primary, #1a6b3c)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: progress !== null ? 'not-allowed' : 'pointer',
          opacity: progress !== null ? 0.6 : 1,
          transition: 'all 0.2s',
        }}
      >
        📂 {value ? 'Change Photo' : `Choose ${label}`}
      </button>

      {/* Show current URL (read-only) */}
      {value && (
        <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
          ✅ Uploaded: {value.length > 60 ? value.slice(0, 60) + '…' : value}
        </div>
      )}
    </div>
  );
}
