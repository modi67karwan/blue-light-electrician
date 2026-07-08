// Sticky header shadow
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,.12)'
      : '0 2px 16px rgba(0,0,0,.08)';
  }, { passive: true });
}

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// Smooth scroll — skip bare "#" anchors (used by modal triggers)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Fade-up on scroll
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(
  '.service-card, .why-card, .testimonial-card, .about-feature, .city-tag, .contact-method'
).forEach(el => { el.classList.add('fade-up'); fadeObserver.observe(el); });

// Contact form — guarded: only runs on index.html where #contactForm exists
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!name || !phone) { alert('אנא מלא שם וטלפון.'); return; }
    const service = document.getElementById('service').value;
    const city = document.getElementById('city').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = `שלום מוחמד!%0Aשמי ${name}, מספרי ${phone}.${city ? '%0Aעיר: ' + city : ''}${service ? '%0Aשירות: ' + service : ''}${message ? '%0Aהודעה: ' + message : ''}`;
    window.open(`https://wa.me/972509028896?text=${text}`, '_blank');
    e.target.reset();
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
    });
  }, { passive: true });
}

// Legal modal
const legalTexts = {
  privacy: `<h2>מדיניות פרטיות</h2>
<p>Blue Light חשמל מכבדת את פרטיות המשתמשים.</p>
<h3>מידע שנאסף</h3>
<p>שם, מספר טלפון ופרטי הפרויקט שנמסרים דרך הטופס — לצורך יצירת קשר בלבד.</p>
<h3>שימוש במידע</h3>
<p>המידע משמש אך ורק לחזרה אליך בנוגע לעבודת החשמל המבוקשת ולא יועבר לצד שלישי.</p>
<h3>אחסון</h3>
<p>הטופס מעביר את הנתונים ישירות ל-WhatsApp ואינו שומר נתונים בשרת.</p>
<h3>יצירת קשר</h3>
<p>לשאלות בנושא פרטיות: mkproelect@gmail.com</p>`,
  terms: `<h2>תנאי שימוש</h2>
<p>השימוש באתר bluelight-electric.co.il מהווה הסכמה לתנאים הבאים.</p>
<h3>השירות</h3>
<p>האתר מספק מידע אודות שירותי חשמל של Blue Light – מוחמד כרואן, חשמלאי ראשי רישיון 1009000, ע.מ 318226024.</p>
<h3>אחריות</h3>
<p>פנייה דרך האתר אינה מהווה הצעת מחיר מחייבת. הצעת מחיר תינתן לאחר בדיקת הפרויקט בפועל.</p>
<h3>קניין רוחני</h3>
<p>כל תוכן האתר שייך ל-Blue Light חשמל.</p>
<h3>דין חל</h3>
<p>הדין הישראלי חל על השימוש באתר. סמכות שיפוטית: בתי המשפט במחוז תל אביב.</p>`,
  accessibility: `<h2>הצהרת נגישות</h2>
<p>Blue Light חשמל שואפת להנגיש את האתר לכלל המשתמשים בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות.</p>
<h3>תקן</h3>
<p>האתר נבנה לפי WCAG 2.1 ברמה AA.</p>
<h3>מאפייני נגישות</h3>
<ul>
<li>טקסט חלופי לכל התמונות</li>
<li>ניווט מקלדת מלא</li>
<li>דילוג לתוכן ראשי</li>
<li>כלי נגישות: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים, עצירת אנימציות</li>
<li>תמיכה בקוראי מסך</li>
</ul>
<h3>בעיות נגישות?</h3>
<p>נשמח לעזור: mkproelect@gmail.com | 050-9028896</p>
<p><small>הצהרה זו עודכנה ביולי 2026</small></p>`
};

const legalOverlay = document.getElementById('legalOverlay');
const legalContent = document.getElementById('legalContent');
const legalClose = document.getElementById('legalClose');

function openModal(type) {
  if (!legalOverlay || !legalContent) return;
  legalContent.innerHTML = legalTexts[type] || '';
  legalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (legalClose) legalClose.focus();
}

function closeModal() {
  if (!legalOverlay) return;
  legalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (legalOverlay) {
  if (legalClose) legalClose.addEventListener('click', closeModal);
  legalOverlay.addEventListener('click', (e) => { if (e.target === legalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalOverlay.classList.contains('active')) closeModal();
  });
}

document.querySelectorAll('.open-modal').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); openModal(el.dataset.modal); });
});

// Accessibility widget — guarded: only runs when widget elements exist
const accTrigger = document.getElementById('accTrigger');
const accPanel = document.getElementById('accPanel');

if (accTrigger && accPanel) {
  const state = JSON.parse(localStorage.getItem('bluelight_acc') || '{}');

  function applyState() {
    document.body.classList.toggle('acc-text-xl', state.fontSize === 2);
    document.body.classList.toggle('acc-text-lg', state.fontSize === 1);
    document.body.classList.toggle('acc-contrast', !!state.contrast);
    document.body.classList.toggle('acc-links', !!state.links);
    document.body.classList.toggle('acc-no-motion', !!state.noMotion);
    const fontUp = document.getElementById('accFontUp');
    const fontDown = document.getElementById('accFontDown');
    const contrast = document.getElementById('accContrast');
    const links = document.getElementById('accLinks');
    const motion = document.getElementById('accMotion');
    if (fontUp) fontUp.setAttribute('aria-pressed', String(state.fontSize === 2));
    if (fontDown) fontDown.setAttribute('aria-pressed', String(state.fontSize === 1));
    if (contrast) contrast.setAttribute('aria-pressed', String(!!state.contrast));
    if (links) links.setAttribute('aria-pressed', String(!!state.links));
    if (motion) motion.setAttribute('aria-pressed', String(!!state.noMotion));
  }

  applyState();

  accTrigger.addEventListener('click', () => {
    const isOpen = !accPanel.hidden;
    accPanel.hidden = isOpen;
    accTrigger.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    const widget = document.getElementById('accWidget');
    if (widget && !widget.contains(e.target) && !accPanel.hidden) {
      accPanel.hidden = true;
      accTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !accPanel.hidden) {
      accPanel.hidden = true;
      accTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  function save() { localStorage.setItem('bluelight_acc', JSON.stringify(state)); applyState(); }

  const fontUp = document.getElementById('accFontUp');
  const fontDown = document.getElementById('accFontDown');
  const contrast = document.getElementById('accContrast');
  const links = document.getElementById('accLinks');
  const motion = document.getElementById('accMotion');
  const reset = document.getElementById('accReset');

  if (fontUp) fontUp.addEventListener('click', () => { state.fontSize = Math.min((state.fontSize || 0) + 1, 2); save(); });
  if (fontDown) fontDown.addEventListener('click', () => { state.fontSize = Math.max((state.fontSize || 0) - 1, 0); save(); });
  if (contrast) contrast.addEventListener('click', () => { state.contrast = !state.contrast; save(); });
  if (links) links.addEventListener('click', () => { state.links = !state.links; save(); });
  if (motion) motion.addEventListener('click', () => { state.noMotion = !state.noMotion; save(); });
  if (reset) reset.addEventListener('click', () => { Object.keys(state).forEach(k => delete state[k]); save(); });
}
