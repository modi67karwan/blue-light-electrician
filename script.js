// Sticky header shadow
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 24px rgba(0,0,0,.12)'
    : '0 2px 16px rgba(0,0,0,.08)';
});

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Fade-up on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .why-card, .about-feature, .city-tag, .contact-method, .audience-card, .process-step, .gallery-item'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if (!name || !phone) {
    alert('אנא מלא שם וטלפון.');
    return;
  }
  const service = document.getElementById('service').value;
  const city = document.getElementById('city').value.trim();
  const message = document.getElementById('message').value.trim();
  const text = `שלום מוחמד!%0Aשמי ${name}, מספרי ${phone}.${city ? '%0Aעיר: ' + city : ''}${service ? '%0Aשירות: ' + service : ''}${message ? '%0Aהודעה: ' + message : ''}`;
  window.open(`https://wa.me/972509028896?text=${text}`, '_blank');
  e.target.reset();
});

// ─── Cookie Consent ───
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!localStorage.getItem('cookieConsent')) banner.classList.add('show');
  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('show');
  });
  document.getElementById('cookieReject').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    banner.classList.remove('show');
  });
})();

// ─── Legal Modal Content ───
const legalTexts = {
  privacy: `
    <h2>מדיניות פרטיות</h2>
    <span class="legal-date">עדכון אחרון: יוני 2026 | בהתאם לתיקון 13 לחוק הגנת הפרטיות</span>
    <h3>1. מבוא</h3>
    <p>Blue Light חשמל ("אנו") מכבדת את פרטיות המשתמשים באתר bluelight-electric.co.il. מדיניות זו מסבירה כיצד אנו אוספים ומשתמשים במידע אישי.</p>
    <h3>2. מידע הנאסף</h3>
    <ul>
      <li>שם, טלפון, עיר וסוג שירות — בעת מילוי טופס יצירת קשר</li>
      <li>כתובת IP ונתוני גלישה — באופן אוטומטי</li>
      <li>עוגיות (Cookies) — בכפוף להסכמתך בלבד</li>
    </ul>
    <h3>3. מטרת האיסוף</h3>
    <p>המידע נאסף אך ורק לצורך יצירת קשר ותיאום שירות. לא ישמש לכל מטרה אחרת.</p>
    <h3>4. שיתוף מידע</h3>
    <p>לא נמכור ולא נעביר את פרטיך לצדדים שלישיים, למעט WhatsApp לצורך יצירת קשר ישיר ובהתאם לדרישות חוק.</p>
    <h3>5. עוגיות (Cookies)</h3>
    <p>האתר משתמש בעוגיות בסיסיות לתפקוד בלבד. עוגיות אנליטיקה ייטענו רק לאחר הסכמתך דרך הבאנר. כפתור "דחה הכל" שקול לכפתור "קבל הכל".</p>
    <h3>6. זכויות המשתמש (תיקון 13)</h3>
    <p>יש לך זכות לעיין, לתקן, להגביל או לדרוש מחיקה של מידעך תוך 30 יום מהפנייה.</p>
    <h3>7. אבטחה</h3>
    <p>האתר פועל באמצעות HTTPS עם הצפנת SSL מלאה.</p>
    <h3>8. יצירת קשר</h3>
    <p>לפניות בנוגע לפרטיות: <a href="tel:0509028896">050-9028896</a></p>
  `,
  terms: `
    <h2>תנאי שימוש</h2>
    <span class="legal-date">עדכון אחרון: יוני 2026</span>
    <h3>1. כללי</h3>
    <p>השימוש באתר bluelight-electric.co.il מהווה הסכמה לתנאים הבאים. אם אינך מסכים, הפסק את השימוש.</p>
    <h3>2. פרטי העסק</h3>
    <p>Blue Light חשמל | מוחמד כרואן | עוסק מורשה מס' 318226024 | רישיון חשמלאי ראשי 1009000 | אזור שירות: תל אביב והמרכז</p>
    <h3>3. זכויות יוצרים</h3>
    <p>כל התכנים באתר — טקסט, עיצוב ולוגו — הם קניינו הרוחני של Blue Light חשמל. אין להעתיק ללא אישור בכתב.</p>
    <h3>4. אחריות</h3>
    <p>המידע באתר הוא לצרכים אינפורמטיביים בלבד. ביצוע עבודה מותנה בהסכמה מפורשת ובחוזה שירות נפרד.</p>
    <h3>5. מחירים</h3>
    <p>מחירים מתאמים אישית לכל עבודה. אין מחיר מחייב ללא הצעת מחיר כתובה.</p>
    <h3>6. דיוור</h3>
    <p>לא ישלחו אליך מסרים פרסומיים ללא הסכמתך המפורשת, בהתאם לסעיף 30א לחוק התקשורת.</p>
    <h3>7. שינויים</h3>
    <p>אנו שומרים את הזכות לעדכן תנאים אלה בכל עת. שימוש מתמשך לאחר שינוי מהווה הסכמה.</p>
    <h3>8. דין חל</h3>
    <p>תנאים אלה כפופים לדין הישראלי. סמכות השיפוט — בתי המשפט בישראל.</p>
  `,
  accessibility: `
    <h2>הצהרת נגישות</h2>
    <span class="legal-date">עדכון: יוני 2026</span>
    <h3>מחויבות לנגישות</h3>
    <p>Blue Light חשמל מחויבת לנגישות דיגיטלית לכלל המשתמשים, לרבות אנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות.</p>
    <h3>מצב הנגישות הנוכחי</h3>
    <ul>
      <li>ניגודיות צבעים ברורה בין טקסט לרקע</li>
      <li>מבנה כותרות (H1–H3) תקני לקוראי מסך</li>
      <li>תיאורי alt לתמונות</li>
      <li>תמיכה בניווט מקלדת</li>
      <li>טקסט ניתן להגדלה ולשינוי גודל</li>
    </ul>
    <h3>פטור חלקי</h3>
    <p>בהתאם לתקנות הנגישות לאתרי אינטרנט (2013), עסקים עם מחזור שנתי מתחת ל-1,000,000 ₪ פטורים מהנגשה מלאה לפי תקן WCAG 2.2 AA. אנו עושים מאמצים לשפר את הנגישות באופן שוטף.</p>
    <h3>נתקלת בקושי?</h3>
    <p>נשמח לסייע: <a href="tel:0509028896">050-9028896</a></p>
  `
};

function openModal(type) {
  document.getElementById('legalContent').innerHTML = legalTexts[type] || '';
  document.getElementById('legalOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('legalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('legalClose').addEventListener('click', closeModal);
document.getElementById('legalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', function (e) {
  const link = e.target.closest('.open-modal');
  if (link) {
    e.preventDefault();
    e.stopPropagation();
    openModal(link.dataset.modal);
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
  });
}, { passive: true });
