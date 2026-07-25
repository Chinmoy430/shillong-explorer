// ============================================================
// SAWAIOM TRAVELS AGENCY — Admin Panel JS
// ============================================================

// ----- Toast -----
let adminToastTimeout;
function adminToast(message, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'admin-toast';
    toast.innerHTML = `<span id="admin-toast-icon"></span><span id="admin-toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  clearTimeout(adminToastTimeout);
  document.getElementById('admin-toast-icon').textContent = type === 'success' ? '✅' : '❌';
  document.getElementById('admin-toast-msg').textContent = message;
  toast.className = `admin-toast ${type} active`;
  adminToastTimeout = setTimeout(() => toast.classList.remove('active'), 3500);
}

// ----- Modal -----
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
  document.body.style.overflow = '';
}
function closeAllModals() {
  document.querySelectorAll('.admin-modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// ----- Sidebar (mobile) -----
function initAdminSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const hamburgerBtn = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  hamburgerBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('active');
  });
  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  });
}

// ----- Logout -----
function adminLogout() {
  if (confirm('Are you sure you want to log out?')) logout();
}

// ----- Image Preview -----
function previewImage(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;
  input.addEventListener('input', () => {
    const url = input.value.trim();
    if (url) {
      preview.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<div class=placeholder>Invalid image URL</div>'" alt="Preview">`;
    } else {
      preview.innerHTML = `<div class="placeholder">Image preview will appear here</div>`;
    }
  });
}

// ============================================================
// DASHBOARD
// ============================================================
function initDashboard() {
  checkAuth();
  initAdminSidebar();

  const attractions = getData('attractions') || [];
  const tours = getData('tours') || [];
  const categories = getData('categories') || [];
  const testimonials = getData('testimonials') || [];

  document.getElementById('stat-attractions').textContent = attractions.length;
  document.getElementById('stat-tours').textContent = tours.length;
  document.getElementById('stat-categories').textContent = categories.length;
  document.getElementById('stat-testimonials').textContent = testimonials.length;

  // Recent attractions list
  const recentList = document.getElementById('recent-attractions');
  if (recentList) {
    recentList.innerHTML = attractions.slice(0, 5).map(a => `
      <tr>
        <td><img class="table-thumb" src="${a.image}" alt="${a.name}" onerror="this.src='../assets/images/hero.png'"></td>
        <td><div class="table-name">${a.name}</div><div class="table-sub">${capitalize(a.category)}</div></td>
        <td><div class="stars" style="font-size:0.8rem;color:#f4a027;">${renderStars(a.rating)}</div></td>
        <td>${a.isTopPick ? '<span class="badge-admin badge-success">Top Pick</span>' : '<span class="badge-admin badge-neutral">Regular</span>'}</td>
        <td><a href="attractions.html" class="btn-admin btn-admin-ghost btn-sm">Edit</a></td>
      </tr>
    `).join('');
  }
}

// ============================================================
// ATTRACTIONS MANAGEMENT
// ============================================================
let editingAttractionId = null;

function initAttractionsAdmin() {
  checkAuth();
  initAdminSidebar();
  renderAttractionsTable();
  initAttractionForm();
  previewImage('attr-image', 'attr-image-preview');
}

function renderAttractionsTable() {
  const tbody = document.getElementById('attractions-tbody');
  if (!tbody) return;
  const attractions = getData('attractions') || [];
  if (!attractions.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🏔️</div><div class="empty-title">No attractions yet</div><div class="empty-desc">Click "Add Attraction" to get started.</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = attractions.map(a => `
    <tr>
      <td><img class="table-thumb" src="${a.image}" alt="${a.name}" onerror="this.src='../assets/images/hero.png'"></td>
      <td>
        <div class="table-name">${a.name}</div>
        <div class="table-sub">📍 ${a.location}</div>
      </td>
      <td><span class="badge-admin badge-info">${capitalize(a.category)}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="color:#f4a027;font-size:0.85rem;">${renderStars(a.rating)}</span>
          <span style="font-size:0.8rem;font-weight:700;">${a.rating}</span>
        </div>
        <div class="table-sub">${a.reviewCount} reviews</div>
      </td>
      <td>${a.isTopPick ? '<span class="badge-admin badge-success">✓ Top Pick</span>' : '<span class="badge-admin badge-neutral">Regular</span>'}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-admin btn-admin-warning btn-sm" onclick="editAttraction(${a.id})">✏️ Edit</button>
          <button class="btn-admin btn-admin-danger btn-sm" onclick="deleteAttraction(${a.id})">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function initAttractionForm() {
  // Populate categories in select
  const catSelect = document.getElementById('attr-category');
  if (catSelect) {
    const cats = getData('categories') || [];
    catSelect.innerHTML = cats.filter(c => c.id !== 'all').map(c =>
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
  }

  document.getElementById('add-attraction-btn')?.addEventListener('click', () => {
    editingAttractionId = null;
    document.getElementById('attr-form').reset();
    document.getElementById('attr-image-preview').innerHTML = `<div class="placeholder">Image preview will appear here</div>`;
    document.getElementById('attraction-modal-title').textContent = 'Add New Attraction';
    openModal('attraction-modal');
  });

  document.getElementById('attr-form')?.addEventListener('submit', saveAttraction);
}

function editAttraction(id) {
  const attractions = getData('attractions') || [];
  const a = attractions.find(x => x.id === id);
  if (!a) return;
  editingAttractionId = id;

  document.getElementById('attr-name').value = a.name;
  document.getElementById('attr-category').value = a.category;
  document.getElementById('attr-rating').value = a.rating;
  document.getElementById('attr-reviews').value = a.reviewCount;
  document.getElementById('attr-rank').value = a.rank;
  document.getElementById('attr-location').value = a.location;
  document.getElementById('attr-duration').value = a.duration;
  document.getElementById('attr-best-time').value = a.bestTime;
  document.getElementById('attr-short-desc').value = a.shortDesc;
  document.getElementById('attr-full-desc').value = a.fullDesc;
  document.getElementById('attr-image').value = a.image;
  document.getElementById('attr-top-pick').checked = a.isTopPick;

  // Trigger preview
  document.getElementById('attr-image-preview').innerHTML = `<img src="${a.image}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=placeholder>Invalid URL</div>'">`;

  document.getElementById('attraction-modal-title').textContent = 'Edit Attraction';
  openModal('attraction-modal');
}

function saveAttraction(e) {
  e.preventDefault();
  const attractions = getData('attractions') || [];
  const newItem = {
    id: editingAttractionId || (Date.now()),
    name: document.getElementById('attr-name').value.trim(),
    category: document.getElementById('attr-category').value,
    rating: parseFloat(document.getElementById('attr-rating').value),
    reviewCount: parseInt(document.getElementById('attr-reviews').value),
    rank: parseInt(document.getElementById('attr-rank').value) || attractions.length + 1,
    location: document.getElementById('attr-location').value.trim(),
    duration: document.getElementById('attr-duration').value.trim(),
    bestTime: document.getElementById('attr-best-time').value.trim(),
    shortDesc: document.getElementById('attr-short-desc').value.trim(),
    fullDesc: document.getElementById('attr-full-desc').value.trim(),
    image: document.getElementById('attr-image').value.trim(),
    isTopPick: document.getElementById('attr-top-pick').checked
  };

  if (editingAttractionId) {
    const idx = attractions.findIndex(a => a.id === editingAttractionId);
    if (idx !== -1) attractions[idx] = newItem;
  } else {
    attractions.push(newItem);
  }
  setData('attractions', attractions);
  renderAttractionsTable();
  closeModal('attraction-modal');
  adminToast(editingAttractionId ? 'Attraction updated! ✅' : 'Attraction added! ✅', 'success');
  editingAttractionId = null;
}

function deleteAttraction(id) {
  const attractions = getData('attractions') || [];
  const a = attractions.find(x => x.id === id);
  if (!a) return;
  document.getElementById('delete-item-name').textContent = a.name;
  document.getElementById('confirm-delete-btn').onclick = () => {
    setData('attractions', attractions.filter(x => x.id !== id));
    renderAttractionsTable();
    closeModal('confirm-delete-modal');
    adminToast('Attraction deleted.', 'success');
  };
  openModal('confirm-delete-modal');
}

// ============================================================
// TOURS MANAGEMENT
// ============================================================
let editingTourId = null;

function initToursAdmin() {
  checkAuth();
  initAdminSidebar();
  renderToursTable();
  initTourForm();
  previewImage('tour-image', 'tour-image-preview');
}

function renderToursTable() {
  const tbody = document.getElementById('tours-tbody');
  if (!tbody) return;
  const tours = getData('tours') || [];
  if (!tours.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🧳</div><div class="empty-title">No tours yet</div><div class="empty-desc">Click "Add Tour" to get started.</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = tours.map(t => `
    <tr>
      <td><img class="table-thumb" src="${t.image}" alt="${t.name}" onerror="this.src='../assets/images/hero.png'"></td>
      <td>
        <div class="table-name">${t.name}</div>
        <div class="table-sub">${t.category}</div>
      </td>
      <td>${t.duration}</td>
      <td>
        <div style="font-weight:700;color:#1a6b3c;">₹${t.price.toLocaleString()}</div>
        ${t.originalPrice > t.price ? `<div class="table-sub" style="text-decoration:line-through;">₹${t.originalPrice.toLocaleString()}</div>` : ''}
      </td>
      <td>${t.isFeatured ? '<span class="badge-admin badge-success">⭐ Featured</span>' : '<span class="badge-admin badge-neutral">Regular</span>'}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-admin btn-admin-warning btn-sm" onclick="editTour(${t.id})">✏️ Edit</button>
          <button class="btn-admin btn-admin-danger btn-sm" onclick="deleteTour(${t.id})">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function initTourForm() {
  document.getElementById('add-tour-btn')?.addEventListener('click', () => {
    editingTourId = null;
    document.getElementById('tour-form').reset();
    document.getElementById('tour-image-preview').innerHTML = `<div class="placeholder">Image preview will appear here</div>`;
    document.getElementById('tour-modal-title').textContent = 'Add New Tour Package';
    openModal('tour-modal');
  });
  document.getElementById('tour-form')?.addEventListener('submit', saveTour);
}

function editTour(id) {
  const tours = getData('tours') || [];
  const t = tours.find(x => x.id === id);
  if (!t) return;
  editingTourId = id;

  document.getElementById('tour-name').value = t.name;
  document.getElementById('tour-category').value = t.category;
  document.getElementById('tour-duration').value = t.duration;
  document.getElementById('tour-group-size').value = t.groupSize;
  document.getElementById('tour-price').value = t.price;
  document.getElementById('tour-original-price').value = t.originalPrice;
  document.getElementById('tour-description').value = t.description;
  document.getElementById('tour-highlights').value = t.highlights.join(', ');
  document.getElementById('tour-includes').value = t.includes.join(', ');
  document.getElementById('tour-image').value = t.image;
  document.getElementById('tour-rating').value = t.rating;
  document.getElementById('tour-featured').checked = t.isFeatured;

  document.getElementById('tour-image-preview').innerHTML = `<img src="${t.image}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=placeholder>Invalid URL</div>'">`;
  document.getElementById('tour-modal-title').textContent = 'Edit Tour Package';
  openModal('tour-modal');
}

function saveTour(e) {
  e.preventDefault();
  const tours = getData('tours') || [];
  const newItem = {
    id: editingTourId || Date.now(),
    name: document.getElementById('tour-name').value.trim(),
    category: document.getElementById('tour-category').value.trim(),
    duration: document.getElementById('tour-duration').value.trim(),
    groupSize: document.getElementById('tour-group-size').value.trim(),
    price: parseInt(document.getElementById('tour-price').value),
    originalPrice: parseInt(document.getElementById('tour-original-price').value) || parseInt(document.getElementById('tour-price').value),
    description: document.getElementById('tour-description').value.trim(),
    highlights: document.getElementById('tour-highlights').value.split(',').map(s => s.trim()).filter(Boolean),
    includes: document.getElementById('tour-includes').value.split(',').map(s => s.trim()).filter(Boolean),
    image: document.getElementById('tour-image').value.trim(),
    rating: parseFloat(document.getElementById('tour-rating').value) || 4.5,
    isFeatured: document.getElementById('tour-featured').checked
  };

  if (editingTourId) {
    const idx = tours.findIndex(t => t.id === editingTourId);
    if (idx !== -1) tours[idx] = newItem;
  } else {
    tours.push(newItem);
  }
  setData('tours', tours);
  renderToursTable();
  closeModal('tour-modal');
  adminToast(editingTourId ? 'Tour updated! ✅' : 'Tour added! ✅', 'success');
  editingTourId = null;
}

function deleteTour(id) {
  const tours = getData('tours') || [];
  const t = tours.find(x => x.id === id);
  if (!t) return;
  document.getElementById('delete-item-name').textContent = t.name;
  document.getElementById('confirm-delete-btn').onclick = () => {
    setData('tours', tours.filter(x => x.id !== id));
    renderToursTable();
    closeModal('confirm-delete-modal');
    adminToast('Tour deleted.', 'success');
  };
  openModal('confirm-delete-modal');
}

// ============================================================
// HERO EDITOR
// ============================================================
function initHeroAdmin() {
  checkAuth();
  initAdminSidebar();

  const hero = getData('hero') || {};
  document.getElementById('hero-title-input').value = hero.title || '';
  document.getElementById('hero-subtitle-input').value = hero.subtitle || '';
  document.getElementById('hero-cta-text').value = hero.ctaText || '';
  document.getElementById('hero-bg-input').value = hero.backgroundImage || '';

  updateHeroPreview();

  ['hero-title-input', 'hero-subtitle-input', 'hero-cta-text', 'hero-bg-input'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateHeroPreview);
  });

  document.getElementById('hero-save-btn')?.addEventListener('click', saveHero);
}

function updateHeroPreview() {
  const title = document.getElementById('hero-title-input')?.value || '';
  const sub = document.getElementById('hero-subtitle-input')?.value || '';
  const cta = document.getElementById('hero-cta-text')?.value || '';
  const bg = document.getElementById('hero-bg-input')?.value || '';

  const preview = document.getElementById('hero-live-preview');
  if (!preview) return;
  preview.querySelector('.hero-preview-bg').style.backgroundImage = bg ? `url('../${bg}')` : '';
  preview.querySelector('.hero-preview-title').textContent = title;
  preview.querySelector('.hero-preview-sub').textContent = sub;
  preview.querySelector('.hero-preview-btn').textContent = cta;
}

function saveHero() {
  const hero = {
    title: document.getElementById('hero-title-input').value.trim(),
    subtitle: document.getElementById('hero-subtitle-input').value.trim(),
    ctaText: document.getElementById('hero-cta-text').value.trim(),
    ctaLink: 'attractions.html',
    backgroundImage: document.getElementById('hero-bg-input').value.trim()
  };
  setData('hero', hero);
  adminToast('Hero section saved! ✅', 'success');
}

// ============================================================
// SETTINGS
// ============================================================
function initSettings() {
  checkAuth();
  initAdminSidebar();

  const settings = getData('siteSettings') || {};
  document.getElementById('s-agency-name').value = settings.agencyName || '';
  document.getElementById('s-tagline').value = settings.tagline || '';
  document.getElementById('s-phone').value = settings.phone || '';
  document.getElementById('s-email').value = settings.email || '';
  document.getElementById('s-whatsapp').value = settings.whatsapp || '';
  document.getElementById('s-address').value = settings.address || '';
  document.getElementById('s-facebook').value = settings.social?.facebook || '';
  document.getElementById('s-instagram').value = settings.social?.instagram || '';
  document.getElementById('s-youtube').value = settings.social?.youtube || '';
  document.getElementById('s-twitter').value = settings.social?.twitter || '';

  document.getElementById('settings-form')?.addEventListener('submit', saveSettings);
  document.getElementById('password-form')?.addEventListener('submit', changePassword);
  document.getElementById('reset-data-btn')?.addEventListener('click', () => {
    if (confirm('⚠️ This will reset ALL content to defaults. Are you sure?')) {
      resetData();
      adminToast('Data reset to defaults.', 'success');
    }
  });
}

function saveSettings(e) {
  e.preventDefault();
  const settings = {
    agencyName: document.getElementById('s-agency-name').value.trim(),
    tagline: document.getElementById('s-tagline').value.trim(),
    phone: document.getElementById('s-phone').value.trim(),
    email: document.getElementById('s-email').value.trim(),
    whatsapp: document.getElementById('s-whatsapp').value.trim(),
    address: document.getElementById('s-address').value.trim(),
    social: {
      facebook: document.getElementById('s-facebook').value.trim(),
      instagram: document.getElementById('s-instagram').value.trim(),
      youtube: document.getElementById('s-youtube').value.trim(),
      twitter: document.getElementById('s-twitter').value.trim()
    }
  };
  setData('siteSettings', settings);
  adminToast('Settings saved! ✅', 'success');
}

function changePassword(e) {
  e.preventDefault();
  const current = document.getElementById('current-password').value;
  const newPass = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-password').value;
  const creds = getData('adminCredentials');

  if (current !== creds.password) {
    adminToast('Current password is incorrect.', 'error'); return;
  }
  if (newPass !== confirm) {
    adminToast('New passwords do not match.', 'error'); return;
  }
  if (newPass.length < 6) {
    adminToast('Password must be at least 6 characters.', 'error'); return;
  }
  setData('adminCredentials', { ...creds, password: newPass });
  adminToast('Password changed! ✅', 'success');
  e.target.reset();
}

// ============================================================
// TESTIMONIALS MANAGEMENT
// ============================================================
function initTestimonialsAdmin() {
  checkAuth();
  initAdminSidebar();
  renderTestimonialsTable();
  initTestimonialForm();
}

function renderTestimonialsTable() {
  const tbody = document.getElementById('testimonials-tbody');
  if (!tbody) return;
  const testimonials = getData('testimonials') || [];
  if (!testimonials.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">💬</div><div class="empty-title">No testimonials yet</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = testimonials.map(t => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700;flex-shrink:0;">${t.avatar}</div>
          <div>
            <div class="table-name">${t.name}</div>
            <div class="table-sub">📍 ${t.location}</div>
          </div>
        </div>
      </td>
      <td><div style="color:#f4a027;font-size:0.9rem;">${renderStars(t.rating)}</div></td>
      <td style="max-width:280px;font-size:0.82rem;color:var(--text-light);">"${t.text.substring(0,80)}..."</td>
      <td style="font-size:0.8rem;color:var(--text-muted);">${t.date}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-admin btn-admin-warning btn-sm" onclick="editTestimonial(${t.id})">✏️</button>
          <button class="btn-admin btn-admin-danger btn-sm" onclick="deleteTestimonial(${t.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

let editingTestimonialId = null;
function initTestimonialForm() {
  document.getElementById('add-testimonial-btn')?.addEventListener('click', () => {
    editingTestimonialId = null;
    document.getElementById('testimonial-form').reset();
    document.getElementById('testimonial-modal-title').textContent = 'Add Testimonial';
    openModal('testimonial-modal');
  });
  document.getElementById('testimonial-form')?.addEventListener('submit', saveTestimonial);
}

function editTestimonial(id) {
  const items = getData('testimonials') || [];
  const t = items.find(x => x.id === id);
  if (!t) return;
  editingTestimonialId = id;
  document.getElementById('t-name').value = t.name;
  document.getElementById('t-location').value = t.location;
  document.getElementById('t-avatar').value = t.avatar;
  document.getElementById('t-rating').value = t.rating;
  document.getElementById('t-text').value = t.text;
  document.getElementById('t-date').value = t.date;
  document.getElementById('testimonial-modal-title').textContent = 'Edit Testimonial';
  openModal('testimonial-modal');
}

function saveTestimonial(e) {
  e.preventDefault();
  const items = getData('testimonials') || [];
  const newItem = {
    id: editingTestimonialId || Date.now(),
    name: document.getElementById('t-name').value.trim(),
    location: document.getElementById('t-location').value.trim(),
    avatar: document.getElementById('t-avatar').value.trim().toUpperCase().substring(0,2),
    rating: parseInt(document.getElementById('t-rating').value),
    text: document.getElementById('t-text').value.trim(),
    date: document.getElementById('t-date').value.trim()
  };
  if (editingTestimonialId) {
    const idx = items.findIndex(x => x.id === editingTestimonialId);
    if (idx !== -1) items[idx] = newItem;
  } else {
    items.push(newItem);
  }
  setData('testimonials', items);
  renderTestimonialsTable();
  closeModal('testimonial-modal');
  adminToast('Testimonial saved! ✅', 'success');
  editingTestimonialId = null;
}

function deleteTestimonial(id) {
  const items = getData('testimonials') || [];
  const t = items.find(x => x.id === id);
  if (!t) return;
  document.getElementById('delete-item-name').textContent = t.name;
  document.getElementById('confirm-delete-btn').onclick = () => {
    setData('testimonials', items.filter(x => x.id !== id));
    renderTestimonialsTable();
    closeModal('confirm-delete-modal');
    adminToast('Testimonial deleted.', 'success');
  };
  openModal('confirm-delete-modal');
}

// ============================================================
// HELPERS (shared with admin pages)
// ============================================================
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  for (let i = Math.ceil(rating); i < 5; i++) stars += '☆';
  return stars;
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
