// ============================================================
// SHILLONG EXPLORER — Main Public Site JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  loadSiteSettings();
  initHeader();
  initMobileMenu();
  initHero();
  initToast();

  // Firebase user auth state — updates nav sign-in/avatar
  if (typeof initUserAuthState === 'function') initUserAuthState();

  // Page-specific inits (must run before scroll reveal)
  if (document.getElementById('home-page')) initHome();
  if (document.getElementById('attractions-page')) initAttractionsPage();
  if (document.getElementById('tours-page')) initToursPage();
  if (document.getElementById('contact-page')) initContactPage();

  // Run AFTER content is rendered so all .reveal elements exist in DOM
  initScrollReveal();
});

// ============================================================
// SITE SETTINGS LOADER
// ============================================================
function loadSiteSettings() {
  const settings = getData('siteSettings');
  if (!settings) return;
  // Update agency name / logo across all pages
  document.querySelectorAll('.site-name').forEach(el => el.textContent = settings.agencyName);
  document.querySelectorAll('.site-tagline').forEach(el => el.textContent = settings.tagline);
  document.querySelectorAll('.site-phone').forEach(el => el.textContent = settings.phone);
  document.querySelectorAll('.site-email').forEach(el => el.textContent = settings.email);
  document.querySelectorAll('.site-address').forEach(el => el.textContent = settings.address);
  document.querySelectorAll('.site-whatsapp').forEach(el => {
    el.href = `https://wa.me/${settings.whatsapp}?text=Hello! I'm interested in booking a tour.`;
  });
  // Social links
  if (settings.social) {
    document.querySelectorAll('.social-fb').forEach(el => { el.href = settings.social.facebook || '#'; });
    document.querySelectorAll('.social-ig').forEach(el => { el.href = settings.social.instagram || '#'; });
    document.querySelectorAll('.social-yt').forEach(el => { el.href = settings.social.youtube || '#'; });
    document.querySelectorAll('.social-tw').forEach(el => { el.href = settings.social.twitter || '#'; });
  }
  // Page title
  document.title = `${settings.agencyName} — ${settings.tagline}`;
}

// ============================================================
// HEADER
// ============================================================
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Set active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu-close');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeBtn?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============================================================
// HERO SECTION
// ============================================================
function initHero() {
  const hero = getData('hero');
  if (!hero) return;
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const bg = heroSection.querySelector('.hero-bg');
  const h1 = heroSection.querySelector('#hero-title');
  const sub = heroSection.querySelector('#hero-sub');
  const ctaBtn = heroSection.querySelector('#hero-cta');

  if (bg) {
    bg.style.backgroundImage = `url('${hero.backgroundImage}')`;
    setTimeout(() => bg.classList.add('loaded'), 100);
  }
  if (h1) h1.innerHTML = hero.title;
  if (sub) sub.textContent = hero.subtitle;
  if (ctaBtn) {
    ctaBtn.textContent = hero.ctaText;
    ctaBtn.href = hero.ctaLink;
  }
}

// ============================================================
// HOMEPAGE
// ============================================================
function initHome() {
  renderCategories();
  renderFeaturedAttractions();
  renderFeaturedTours();
  renderTestimonials();
  initSearch();
}

function renderCategories() {
  const wrap = document.getElementById('category-chips');
  if (!wrap) return;
  const cats = getData('categories') || [];
  wrap.innerHTML = '';
  cats.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'cat-chip' + (cat.id === 'all' ? ' active' : '');
    chip.dataset.cat = cat.id;
    chip.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.name}`;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (document.getElementById('home-page')) {
        filterAttractionCards(cat.id);
      }
    });
    wrap.appendChild(chip);
  });
}

function renderFeaturedAttractions() {
  const grid = document.getElementById('attractions-grid');
  if (!grid) return;
  const attractions = getData('attractions') || [];
  grid.innerHTML = '';
  attractions.forEach(a => {
    grid.appendChild(createAttractionCard(a));
  });
}

function filterAttractionCards(catId) {
  const cards = document.querySelectorAll('.attraction-card');
  cards.forEach(card => {
    const cat = card.dataset.category;
    if (catId === 'all' || cat === catId) {
      card.style.display = '';
      card.style.animation = 'fadeIn 0.4s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

function createAttractionCard(a) {
  const div = document.createElement('div');
  div.className = 'attraction-card';
  div.dataset.category = a.category;
  div.innerHTML = `
    <div class="card-img-wrap">
      <img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.src='assets/images/hero.png'">
      <div class="card-rank">#${a.rank}</div>
      <div class="card-badges">
        ${a.isTopPick ? '<span class="badge badge-top">🏆 Top Pick</span>' : ''}
        <span class="badge badge-white">${getCategoryIcon(a.category)} ${capitalize(a.category)}</span>
      </div>
    </div>
    <div class="card-body">
      <div class="card-category">${capitalize(a.category)}</div>
      <h3 class="card-title">${a.name}</h3>
      <div class="card-rating">
        <div class="stars">${renderStars(a.rating)}</div>
        <span class="rating-text">${a.rating}</span>
        <span class="review-count">(${a.reviewCount.toLocaleString()} reviews)</span>
      </div>
      <p class="card-desc">${a.shortDesc}</p>
      <div class="card-meta">
        <span class="card-meta-item">📍 ${a.location}</span>
        <span class="card-meta-item">⏱ ${a.duration}</span>
        <span class="card-meta-item">📅 ${a.bestTime}</span>
        <span class="card-arrow">→</span>
      </div>
    </div>
  `;
  div.addEventListener('click', () => openAttractionModal(a));
  return div;
}

function renderFeaturedTours() {
  const grid = document.getElementById('tours-grid');
  if (!grid) return;
  const tours = getData('tours') || [];
  const featured = tours.filter(t => t.isFeatured);
  grid.innerHTML = '';
  featured.forEach(t => grid.appendChild(createTourCard(t)));
}

function createTourCard(t) {
  const settings = getData('siteSettings');
  const waLink = `https://wa.me/${settings?.whatsapp || ''}?text=I'm interested in the "${t.name}" package.`;
  const div = document.createElement('div');
  div.className = 'tour-card' + (t.isFeatured ? ' featured' : '');
  const discount = t.originalPrice > t.price
    ? `<span style="font-size:0.75rem;color:#22c55e;font-weight:700;">Save ₹${(t.originalPrice - t.price).toLocaleString()}</span>`
    : '';
  div.innerHTML = `
    <div class="tour-img">
      <img src="${t.image}" alt="${t.name}" loading="lazy" onerror="this.src='assets/images/hero.png'">
      <div class="tour-overlay"></div>
      <span class="tour-duration">⏱ ${t.duration}</span>
    </div>
    <div class="tour-body">
      <div class="tour-category">${t.category}</div>
      <h3 class="tour-name">${t.name}</h3>
      <div class="tour-rating">
        <div class="stars">${renderStars(t.rating)}</div>
        <span class="rating-text" style="font-size:0.8rem;">${t.rating} · ${t.category}</span>
      </div>
      <div class="tour-highlights">
        ${t.highlights.slice(0, 4).map(h => `<span class="tour-highlight">✓ ${h}</span>`).join('')}
        ${t.highlights.length > 4 ? `<span class="tour-highlight">+${t.highlights.length - 4} more</span>` : ''}
      </div>
      <div class="tour-includes">
        ${t.includes.map(inc => `<span class="tour-include-item">✅ ${inc}</span>`).join('')}
      </div>
      <div class="tour-footer">
        <div class="tour-price">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="tour-price-main">₹${t.price.toLocaleString()}</span>
            ${t.originalPrice > t.price ? `<span class="tour-price-original">₹${t.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <span class="tour-price-per">per person · ${t.groupSize}</span>
          ${discount}
        </div>
        <a href="${waLink}" target="_blank" class="tour-book-btn">Book Now ➜</a>
      </div>
    </div>
  `;
  return div;
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  const testimonials = getData('testimonials') || [];
  grid.innerHTML = '';
  testimonials.forEach(t => {
    const div = document.createElement('div');
    div.className = 'testimonial-card';
    div.innerHTML = `
      <div class="testimonial-rating">${renderStars(t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.avatar}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-location">📍 ${t.location} · ${t.date}</div>
        </div>
      </div>
    `;
    grid.appendChild(div);
  });
}

// ============================================================
// ATTRACTION MODAL
// ============================================================
function openAttractionModal(a) {
  const overlay = document.getElementById('attraction-modal');
  if (!overlay) return;
  const settings = getData('siteSettings');
  const waLink = `https://wa.me/${settings?.whatsapp || ''}?text=I'd like to visit "${a.name}". Please help me plan a tour!`;

  overlay.querySelector('.modal-img img').src = a.image;
  overlay.querySelector('.modal-category').textContent = capitalize(a.category);
  overlay.querySelector('.modal-title').textContent = a.name;
  overlay.querySelector('.modal-rating').innerHTML = `
    <div class="stars">${renderStars(a.rating)}</div>
    <span class="rating-text">${a.rating}</span>
    <span class="review-count">(${a.reviewCount} reviews)</span>
    ${a.isTopPick ? '<span class="badge badge-top">🏆 Top Pick</span>' : ''}
  `;
  overlay.querySelector('.modal-desc').textContent = a.fullDesc;
  overlay.querySelector('#modal-location').textContent = a.location;
  overlay.querySelector('#modal-duration').textContent = a.duration;
  overlay.querySelector('#modal-best-time').textContent = a.bestTime;
  overlay.querySelector('#modal-whatsapp').href = waLink;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAttractionModal() {
  document.getElementById('attraction-modal')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// ATTRACTIONS PAGE
// ============================================================
function initAttractionsPage() {
  renderCategories();
  renderAllAttractions();
  initSearch();

  // Category filter on attractions page
  document.getElementById('category-chips')?.addEventListener('click', e => {
    const chip = e.target.closest('.cat-chip');
    if (!chip) return;
    const cat = chip.dataset.cat;
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterAndRenderAttractions(cat, document.getElementById('search-input')?.value || '');
  });
}

function renderAllAttractions(filter = 'all', query = '') {
  const grid = document.getElementById('attractions-grid');
  const count = document.getElementById('results-count');
  if (!grid) return;
  let attractions = getData('attractions') || [];
  if (filter !== 'all') attractions = attractions.filter(a => a.category === filter);
  if (query) {
    const q = query.toLowerCase();
    attractions = attractions.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.shortDesc.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }
  grid.innerHTML = '';
  if (count) count.innerHTML = `Showing <strong>${attractions.length}</strong> attractions`;
  attractions.forEach(a => grid.appendChild(createAttractionCard(a)));
  initScrollReveal();
}

function filterAndRenderAttractions(cat, query) {
  renderAllAttractions(cat, query);
}

// ============================================================
// TOURS PAGE
// ============================================================
function initToursPage() {
  renderAllTours();

  document.getElementById('duration-filter')?.addEventListener('change', filterTours);
  document.getElementById('category-filter')?.addEventListener('change', filterTours);
  document.getElementById('sort-filter')?.addEventListener('change', filterTours);
}

function renderAllTours(tours) {
  const grid = document.getElementById('all-tours-grid');
  if (!grid) return;
  const allTours = tours || getData('tours') || [];
  const count = document.getElementById('tours-count');
  if (count) count.innerHTML = `<strong>${allTours.length}</strong> packages available`;
  grid.innerHTML = '';
  allTours.forEach(t => grid.appendChild(createTourCard(t)));
  initScrollReveal();
}

function filterTours() {
  let tours = getData('tours') || [];
  const duration = document.getElementById('duration-filter')?.value;
  const category = document.getElementById('category-filter')?.value;
  const sort = document.getElementById('sort-filter')?.value;

  if (duration) tours = tours.filter(t => t.duration === duration);
  if (category) tours = tours.filter(t => t.category === category);
  if (sort === 'price-asc') tours.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') tours.sort((a, b) => b.price - a.price);
  if (sort === 'rating') tours.sort((a, b) => b.rating - a.rating);

  renderAllTours(tours);
}

// ============================================================
// CONTACT PAGE
// ============================================================
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const settings = getData('siteSettings');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const message = document.getElementById('contact-message').value;
    const tour = document.getElementById('contact-tour')?.value || '';
    const msg = `Hello! I'm ${name} (📞 ${phone}).${tour ? ` Interested in: ${tour}.` : ''} ${message}`;
    const waLink = `https://wa.me/${settings?.whatsapp || ''}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
    showToast('Redirecting to WhatsApp...', 'success');
  });
}

// ============================================================
// SEARCH
// ============================================================
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (!searchInput) return;

  const doSearch = () => {
    const q = searchInput.value.trim();
    const activeCat = document.querySelector('.cat-chip.active')?.dataset.cat || 'all';
    if (document.getElementById('attractions-page')) {
      filterAndRenderAttractions(activeCat, q);
    } else {
      // Homepage: filter visible cards
      const cards = document.querySelectorAll('.attraction-card');
      cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
        const cat = card.dataset.category || '';
        const show = !q || title.includes(q.toLowerCase()) || desc.includes(q.toLowerCase()) || cat.includes(q.toLowerCase());
        card.style.display = show ? '' : 'none';
      });
    }
  };

  searchBtn?.addEventListener('click', doSearch);
  searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') doSearch(); });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout;
function showToast(message, type = 'success') {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.className = `toast ${type} active`;
  toastTimeout = setTimeout(() => toast.classList.remove('active'), 3500);
}
function initToast() {} // placeholder

// ============================================================
// NEWSLETTER
// ============================================================
function handleNewsletter(e) {
  e.preventDefault();
  showToast('Thanks for subscribing! 🎉', 'success');
  e.target.reset();
}

// ============================================================
// HELPERS
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

function getCategoryIcon(cat) {
  const icons = {
    nature: '🌿', waterfall: '💧', lake: '🏞️',
    cultural: '🏛️', adventure: '🧗', village: '🏡',
    viewpoint: '🔭', all: '🗺️'
  };
  return icons[cat] || '📍';
}

// Number counter animation for hero stats
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { el.textContent = target + '+'; clearInterval(timer); return; }
    el.textContent = Math.floor(start) + '+';
  }, 16);
}

window.addEventListener('load', () => {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    animateCounter(el, target);
  });
});
