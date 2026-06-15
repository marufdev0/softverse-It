
// card auto
const courseData = [
  { id: 'basic',       status: 'open', date: '30 জুন, 2026',  time: '৩টা-৫টা(রবি-মঙ্গল-বৃহ:স), ১টা-৩টা(শনি-সোম-বুধ)' },
  { id: 'kid',         status: 'open', date: '30 জুন, 2026', time: '৩টা-৫টা(শনি-সোম-বুধ)' },
  { id: 'graphic',     status: 'open', date: '30 জুন, 2026',  time: '৩টা-৫টা(শনি-সোম-বুধ)' },
  { id: 'skill-boost',   status: 'open', date: '30 জুন, 2026', time: '৫টা-৭টা(সপ্তাহে ৭ দিন)' },
  { id: 'ielts', status: 'open', date: '30 জুন, 2026', time: '৫টা-৭টা(শনি-সোম-বুধ)' },
  { id: 'ict-practice',    status: 'open', date: '0 জুন, 2026', time: '৫টা-৭টা(রবি-মঙ্গল-বৃহ:স)' },
];

const statusLabel = {
  open: { text: '🟢 ভর্তি চলছে', cls: 'open' },
  full: { text: '⛔ আসন পূর্ণ',  cls: 'full' },
  soon: { text: '🔜 শীঘ্রই আসছে', cls: 'soon' },
};

courseData.forEach(course => {
  const card = document.querySelector(`.c-card[data-id="${course.id}"]`);
  if (!card) return;
  const s = statusLabel[course.status];
  const badge = card.querySelector('.c-status');
  if (badge) { badge.textContent = s.text; badge.className = `c-status ${s.cls}`; }
  const dateEl = card.querySelector('.c-date');
  const timeEl = card.querySelector('.c-time');
  if (dateEl) dateEl.textContent = 'শুরু: ' + course.date;
  if (timeEl) timeEl.textContent = 'সময়: ' + course.time;
});

/* ══════════════════════════════════════
   TICKER DATA —
═══════════════════════════════════ */
const tickerItems = [
  ' ভর্তি চলছে — 30 জুন, 2026 থেকে নতুন ব্যাচ শুরু',
  ' বেসিক কম্পিউটার · গ্রাফিক ডিজাইন · কিডস কম্পিউটার',
  ' যোগাযোগ করুন: 01603-893912',
  ' মুন্সীগঞ্জ পুলিশ সুপার কার্যালয়ের বিপরীত পাশে',
  ' কোর্স শেষে সার্টিফিকেট প্রদান করা হয়',
];

// Ticker 
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  const html = [...tickerItems, ...tickerItems]
    .map(item => `<span>${item}</span>`)
    .join('');
  tickerTrack.innerHTML = html;
}

/* ── 1. NAVBAR SCROLL ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 40);
}, { passive: true });

/* ── 2. HAMBURGER ── */
const hbg = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');

hbg.addEventListener('click', (e) => {
  e.stopPropagation();
  hbg.classList.toggle('open');
  mob.classList.toggle('open');
});

mob.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hbg.classList.remove('open');
    mob.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !mob.contains(e.target)) {
    hbg.classList.remove('open');
    mob.classList.remove('open');
  }
});

/* ── 3. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 4. ENROLL MODAL ── */
const enrollOverlay = document.getElementById('enrollModal');
const modalClose    = document.getElementById('modalClose');

function openEnroll() {
  enrollOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeEnroll() {
  enrollOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// event delegation
document.body.addEventListener('click', e => {
  if (e.target.closest('.open-modal')) openEnroll();
});

modalClose.addEventListener('click', closeEnroll);
enrollOverlay.addEventListener('click', e => {
  if (e.target === enrollOverlay) closeEnroll();
});

/* ── 5. WELCOME MODAL ── */
const welcomeOverlay = document.getElementById('welcomeOverlay');

function openWelcome() {
  welcomeOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeWelcome() {
  welcomeOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// page load
window.addEventListener('load', () => setTimeout(openWelcome, 800));

document.getElementById('wmClose').addEventListener('click', closeWelcome);
document.getElementById('wmSkip').addEventListener('click', closeWelcome);
welcomeOverlay.addEventListener('click', e => {
  if (e.target === welcomeOverlay) closeWelcome();
});

document.getElementById('wmEnroll').addEventListener('click', () => {
  closeWelcome();
  setTimeout(openEnroll, 350);
});

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeEnroll();
    closeWelcome();
    closeLightbox();
  }
});

/* ── 6. FORM + GOOGLE SHEET ── */
const SHEET_URL   = 'https://script.google.com/macros/s/AKfycbxHlczHv1otw9rYXhJxAfLyAoGBCnlcRzzJQwx_zPZK_FzWjDZgvMeJKkoNS8WLaxvwIg/exec';
const form        = document.getElementById('enrollForm');
const formView    = document.getElementById('formView');
const successView = document.getElementById('successView');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnLoader   = document.getElementById('btnLoader');

function showError(fId, eId, show) {
  const f = document.getElementById(fId);
  const e = document.getElementById(eId);
  if (f) f.classList.toggle('error', show);
  if (e) e.classList.toggle('show', show);
}

function validate() {
  let ok = true;

  const name = document.getElementById('fullName').value.trim();
  if (!name) { showError('fullName','err-fullName',true); ok=false; }
  else         showError('fullName','err-fullName',false);

  const phone = document.getElementById('phone').value.trim().replace(/ |-/g,'');
  if (phone.length !== 11 || !phone.startsWith('01')) {
    showError('phone','err-phone',true); ok=false;
  } else showError('phone','err-phone',false);

  if (!document.getElementById('course').value) {
    showError('course','err-course',true); ok=false;
  } else showError('course','err-course',false);

  if (!document.getElementById('batch').value) {
    showError('batch','err-batch',true); ok=false;
  } else showError('batch','err-batch',false);

  return ok;
}

function resetForm() {
  formView.style.display = 'block';
  successView.classList.remove('show');
  form.reset();
  submitBtn.disabled = false;
  btnText.style.display = 'inline';
  btnLoader.style.display = 'none';
}

function showSuccess() {
  formView.style.display = 'none';
  successView.classList.add('show');
  setTimeout(() => {
    closeEnroll();
    setTimeout(resetForm, 400);
  }, 3000);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;

  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';

  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName:  document.getElementById('fullName').value.trim(),
      phone:     document.getElementById('phone').value.trim(),
      age:       document.getElementById('age').value || '—',
      course:    document.getElementById('course').value,
      batch:     document.getElementById('batch').value,
      education: document.getElementById('education').value || '—',
      message:   document.getElementById('message').value || '—',
    })
  })
  .then(showSuccess)
  .catch(showSuccess);
});

['fullName','phone','course','batch'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('error');
    const err = document.getElementById('err-' + id);
    if (err) err.classList.remove('show');
  });
});

/* ── 7. GALLERY FILTER ── */
document.querySelectorAll('.g-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.g-item').forEach(item => {
      if (item.classList.contains('g-hidden')) return;
      item.style.display = (filter === 'all' || item.dataset.cat === filter) ? 'block' : 'none';
    });
  });
});

/* ── 8. LAZY LOAD ── */
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    const src  = item.dataset.src;
    if (src && src.trim() !== '') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = item.dataset.label || '';
      img.loading = 'lazy';
      const ph = item.querySelector('.g-placeholder');
      if (ph) ph.style.display = 'none';
      item.prepend(img);
    }
    obs.unobserve(item);
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.g-item[data-src]').forEach(el => imgObserver.observe(el));

/* ── 9. LOAD MORE ── */
const loadMoreBtn   = document.getElementById('loadMoreBtn');
const loadMoreCount = document.getElementById('loadMoreCount');
const loadMoreText  = document.getElementById('loadMoreText');
const loadMoreIcon  = document.getElementById('loadMoreIcon');
const SHOW_PER_CLICK = 3;

function updateLoadMore() {
  const remaining = document.querySelectorAll('.g-item.g-hidden').length;
  if (remaining === 0) {
    loadMoreText.textContent = 'সব ছবি দেখা হয়ে গেছে';
    loadMoreIcon.textContent = '✓';
    loadMoreBtn.classList.add('all-shown');
    loadMoreCount.textContent = 'মোট ' + document.querySelectorAll('.g-item').length + 'টি ছবি';
  } else {
    loadMoreCount.textContent = 'আরও ' + remaining + 'টি ছবি আছে';
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    const hidden = [...document.querySelectorAll('.g-item.g-hidden')];
    hidden.slice(0, SHOW_PER_CLICK).forEach((item, i) => {
      item.classList.remove('g-hidden');
      item.classList.add('g-visible');
      item.style.animationDelay = (i * 0.12) + 's';
      imgObserver.observe(item);
    });
    updateLoadMore();
  });
  updateLoadMore();
}

/* ── 10. LIGHTBOX ── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbPh      = document.getElementById('lbPlaceholder');
const lbIcon    = document.getElementById('lbIcon');
const lbCaption = document.getElementById('lbCaption');
const lbCounter = document.getElementById('lbCounter');

let lbItems = [], lbIndex = 0;

function buildLbList() {
  lbItems = [...document.querySelectorAll('.g-item:not(.g-hidden):not([style*="none"])')];
}

function showLbSlide() {
  const item  = lbItems[lbIndex];
  const src   = item.dataset.src;
  const label = item.dataset.label || '';
  const icon  = item.dataset.icon  || '📸';
  lbCaption.textContent = label;
  lbCounter.textContent = (lbIndex + 1) + ' / ' + lbItems.length;
  if (src && src.trim() !== '') {
    lbImg.src = src; lbImg.style.display = 'block'; lbPh.style.display = 'none';
  } else {
    lbImg.style.display = 'none'; lbPh.style.display = 'flex'; lbIcon.textContent = icon;
  }
}

function openLightbox(index) {
  buildLbList(); lbIndex = index; showLbSlide();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('galleryGrid').addEventListener('click', e => {
  const item = e.target.closest('.g-item');
  if (!item) return;
  buildLbList();
  const idx = lbItems.indexOf(item);
  if (idx !== -1) openLightbox(idx);
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showLbSlide();
});
document.getElementById('lbNext').addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % lbItems.length; showLbSlide();
});
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showLbSlide(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbItems.length; showLbSlide(); }
});

/* ── 11. REVIEW AUTO SCROLL — card clone ── */
const reviewTrack = document.getElementById('reviewTrack');
if (reviewTrack) {
  /* কার্ডগুলো clone করে double করি
     যাতে scroll শেষ হলে seamless loop হয় */
  const cards = reviewTrack.innerHTML;
  reviewTrack.innerHTML = cards + cards;
}

/* ── YouTube Lazy Load ── */
document.querySelectorAll('.yt-lazy').forEach(el => {
  el.addEventListener('click', () => {
    const vid = el.dataset.vid;
    el.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${vid}?autoplay=1" 
        allow="autoplay; encrypted-media" 
        allowfullscreen
        style="width:100%; height:100%; border:0;">
      </iframe>
    `;
  });
});
