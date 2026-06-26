'use strict';

const BL_PHONE = '972509028896';
const WA_TEXT  = 'שלום מוחמד, ראיתי את האתר של Blue Light. אני צריך הצעת מחיר / בדיקה לעבודת חשמל.\n\nשם:\nעיר:\nסוג עבודה:';
const waUrl = (text = WA_TEXT) => `https://wa.me/${BL_PHONE}?text=${encodeURIComponent(text)}`;

// ── Sticky header shadow ──────────────────────────────────────────
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,.14)'
      : '0 2px 16px rgba(0,0,0,.08)';
  }, { passive: true });
}

// ── Mobile nav toggle ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
  nav.querySelectorAll('.nav-link, .nav-call').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Smooth scroll (offset for sticky header) ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href.length <= 1) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = (header ? header.offsetHeight : 72) + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ── Scroll spy — active nav link ──────────────────────────────────
const sections = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');
if (sections.length && navLinks.length) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelector(`.nav-link[href="#${entry.target.id}"]`)?.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 }).observe
    ? (() => {
        const spy = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector(`.nav-link[href="#${entry.target.id}"]`)?.classList.add('active');
          });
        }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
        sections.forEach(s => spy.observe(s));
      })()
    : null;
}

// ── Fade-up on scroll (with rootMargin so off-screen elements fire) ─
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll(
    '.service-card, .why-card, .about-feature, .city-tag, ' +
    '.contact-method, .audience-card, .process-step, ' +
    '.gallery-item, .info-card, .faq-item'
  ).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });
}

// ── Contact form → WhatsApp + thank-you ──────────────────────────
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
  contactFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('name')?.value.trim()  || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    if (!name || !phone) { alert('אנא מלא שם וטלפון.'); return; }

    const lines = [`שלום מוחמד, ראיתי את האתר של Blue Light.`, `שמי ${name}, טלפון ${phone}.`];
    const city       = document.getElementById('city')?.value.trim();
    const clientType = document.getElementById('clientType')?.value;
    const service    = document.getElementById('service')?.value;
    const hasPlans   = document.getElementById('hasPlans')?.value;
    const message    = document.getElementById('message')?.value.trim();
    if (city)       lines.push(`עיר: ${city}`);
    if (clientType) lines.push(`סוג לקוח: ${clientType}`);
    if (service)    lines.push(`סוג עבודה: ${service}`);
    if (hasPlans)   lines.push(`תוכנית / תמונות: ${hasPlans}`);
    if (message)    lines.push(`פרטים: ${message}`);

    window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
    e.target.reset();
    setTimeout(() => { window.location.href = 'thank-you.html'; }, 300);
  });
}

// ── Cookie Consent ────────────────────────────────────────────────
(function () {
  const banner = document.getElementById('cookieBanner');
  const accept = document.getElementById('cookieAccept');
  const reject = document.getElementById('cookieReject');
  if (!banner || !accept || !reject) return;

  const KEY = 'cookieConsent';

  function showBanner() {
    banner.classList.add('show');
    document.body.classList.add('cookie-active');
  }
  function hideBanner(val) {
    localStorage.setItem(KEY, val);
    banner.classList.remove('show');
    document.body.classList.remove('cookie-active');
  }

  if (!localStorage.getItem(KEY)) showBanner();
  accept.addEventListener('click', () => hideBanner('accepted'));
  reject.addEventListener('click', () => hideBanner('rejected'));
})();

// ── Legal Modal ───────────────────────────────────────────────────
const legalTexts = {
  privacy: `
    <h2>מדיניות פרטיות</h2>
    <span class="legal-date">עדכון אחרון: יוני 2026</span>
    <h3>1. מבוא</h3>
    <p>Blue Light חשמל מכבדת את פרטיות המשתמשים. מדיניות זו מסבירה איזה מידע נאסף ולמה הוא משמש.</p>
    <h3>2. מידע הנאסף</h3>
    <ul>
      <li>שם, טלפון, עיר, סוג לקוח וסוג עבודה — בעת מילוי טופס יצירת קשר.</li>
      <li>מידע טכני בסיסי של הדפדפן לצורך אבטחה ותפקוד האתר.</li>
      <li>עוגיות חיוניות לתפקוד. עוגיות מדידה ושיווק — רק לאחר הסכמה.</li>
    </ul>
    <h3>3. מטרת האיסוף</h3>
    <p>המידע משמש ליצירת קשר, תיאום סיור ובדיקת פרטי עבודה. לא נמכור פרטיך לצדדים שלישיים.</p>
    <h3>4. זכויות משתמש</h3>
    <p>ניתן לפנות בבקשה לעיון, תיקון או מחיקת מידע אישי.</p>
    <h3>5. יצירת קשר</h3>
    <p>לפניות בנושא פרטיות: <a href="tel:0509028896">050-9028896</a></p>`,
  terms: `
    <h2>תנאי שימוש</h2>
    <span class="legal-date">עדכון אחרון: יוני 2026</span>
    <h3>1. כללי</h3>
    <p>השימוש באתר מהווה הסכמה לתנאים אלה. האתר נועד להצגת מידע עסקי וליצירת קשר.</p>
    <h3>2. פרטי העסק</h3>
    <p>Blue Light חשמל | מוחמד כרואן | ע.מ 318226024 | רישיון חשמלאי ראשי 1009000.</p>
    <h3>3. הצעות מחיר</h3>
    <p>מידע באתר אינו הצעת מחיר מחייבת. הצעה תינתן לאחר בדיקת תוכניות, תמונות ומצב האתר.</p>
    <h3>4. זכויות יוצרים</h3>
    <p>אין להעתיק טקסטים, לוגו, עיצוב או תכנים ללא אישור בכתב.</p>
    <h3>5. דין וסמכות</h3>
    <p>השימוש באתר כפוף לדין הישראלי.</p>`,
  accessibility: `
    <h2>הצהרת נגישות</h2>
    <span class="legal-date">עדכון אחרון: יוני 2026</span>
    <h3>מחויבות לנגישות</h3>
    <p>Blue Light פועלת לשיפור חוויית הגלישה לכלל המשתמשים, לרבות אנשים עם מוגבלויות.</p>
    <h3>מה קיים באתר</h3>
    <ul>
      <li>כפתור נגישות צף עם כלים זמינים.</li>
      <li>הגדלה/הקטנה של טקסט, ניגודיות גבוהה, הדגשת קישורים, עצירת אנימציות.</li>
      <li>קישור דילוג לתוכן הראשי, תמיכת מקלדת ו-ARIA.</li>
    </ul>
    <h3>נתקלת בקושי?</h3>
    <p>פנה אלינו ונפעל לסייע: <a href="tel:0509028896">050-9028896</a></p>`
};

function openModal(type) {
  const content = document.getElementById('legalContent');
  const overlay = document.getElementById('legalOverlay');
  if (!content || !overlay) return;
  content.innerHTML = legalTexts[type] || '';
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  document.getElementById('legalClose')?.focus();
}
function closeModal() {
  document.getElementById('legalOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('legalClose')?.addEventListener('click', closeModal);
document.getElementById('legalOverlay')?.addEventListener('click', (e) => { if (e.target.id === 'legalOverlay') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('click', (e) => {
  const link = e.target.closest('.open-modal');
  if (link) { e.preventDefault(); openModal(link.dataset.modal); }
});

// ── Accessibility Widget ──────────────────────────────────────────
(function () {
  const html    = document.documentElement;
  const trigger = document.getElementById('accTrigger');
  const panel   = document.getElementById('accPanel');
  if (!trigger || !panel) return;

  const KEY = 'bluelight_acc';
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { state = {}; }

  const save  = () => localStorage.setItem(KEY, JSON.stringify(state));
  const apply = () => {
    html.classList.toggle('acc-contrast',  !!state.contrast);
    html.classList.toggle('acc-links',     !!state.links);
    html.classList.toggle('acc-no-motion', !!state.motion);
    html.style.setProperty('--acc-font-scale', state.fontScale || 1);
    document.getElementById('accContrast')?.setAttribute('aria-pressed', state.contrast ? 'true' : 'false');
    document.getElementById('accLinks')   ?.setAttribute('aria-pressed', state.links    ? 'true' : 'false');
    document.getElementById('accMotion')  ?.setAttribute('aria-pressed', state.motion   ? 'true' : 'false');
  };

  trigger.addEventListener('click', () => {
    const open = panel.hasAttribute('hidden');
    panel.toggleAttribute('hidden', !open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.getElementById('accFontUp')  ?.addEventListener('click', () => { state.fontScale = Math.min((state.fontScale || 1) + 0.1, 1.4);  save(); apply(); });
  document.getElementById('accFontDown')?.addEventListener('click', () => { state.fontScale = Math.max((state.fontScale || 1) - 0.1, 0.85); save(); apply(); });
  document.getElementById('accContrast')?.addEventListener('click', () => { state.contrast = !state.contrast; save(); apply(); });
  document.getElementById('accLinks')   ?.addEventListener('click', () => { state.links    = !state.links;    save(); apply(); });
  document.getElementById('accMotion')  ?.addEventListener('click', () => { state.motion   = !state.motion;   save(); apply(); });
  document.getElementById('accReset')   ?.addEventListener('click', () => { state = {}; localStorage.removeItem(KEY); apply(); });
  apply();
})();

// ── Analytics ─────────────────────────────────────────────────────
window.bluelightTrack = (eventName, data = {}) => {
  if (!eventName) return;
  if (window.gtag) window.gtag('event', eventName, data);
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-event]');
  if (el) window.bluelightTrack(el.dataset.event, { href: el.getAttribute('href') || '' });
});
