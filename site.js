'use strict';
document.body.classList.remove('no-js');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'פתיחת תפריט');
}
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {closeMenu();menuButton.focus();}
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
function composeProjectMessage(values) {
  return ['שלום מוחמד, אשמח לקבל הצעת מחיר לעבודת חשמל.', '', 'שם: ' + values.name.trim(), 'מיקום: ' + values.city.trim(), 'סוג העבודה: ' + values.projectType, values.role ? 'תפקיד: ' + values.role : '', (values.area || '').trim() ? 'שטח משוער (מ״ר): ' + values.area.trim() : '', values.plans ? 'תוכניות: ' + values.plans : '', (values.description || '').trim() ? 'פרטי העבודה: ' + values.description.trim() : ''].filter(Boolean).join('\n');
}
function projectWhatsAppUrl(values) {
  return 'https://wa.me/972509028896?text=' + encodeURIComponent(composeProjectMessage(values));
}
const form = document.querySelector('#project-form');
if (form) {
  const fieldNames = ['name', 'city', 'projectType'];
  const fieldIds = {name: 'name', city: 'city', projectType: 'project-type'};
  const labels = {name: 'שם איש הקשר', city: 'מיקום הפרויקט', projectType: 'סוג הפרויקט'};
  function clearErrors() {
    for (const key of fieldNames) {
      form.elements[key].removeAttribute('aria-invalid');
      const error = document.getElementById(fieldIds[key] + '-error');
      error.textContent = '';error.hidden = true;
    }
    const summary = document.querySelector('#form-errors');
    summary.replaceChildren();summary.hidden = true;
  }
  for (const key of fieldNames) {
    form.elements[key].addEventListener('input', () => {
      form.elements[key].removeAttribute('aria-invalid');
      const error = document.getElementById(fieldIds[key] + '-error');
      error.hidden = true;error.textContent = '';
      document.querySelector('#form-errors').hidden = true;
    });
  }
  function validateForm() {
    clearErrors();
    const invalid = fieldNames.filter(key => !form.elements[key].value.trim());
    if (!invalid.length) return true;
    const summary = document.querySelector('#form-errors');
    summary.append(document.createTextNode('כדי להכין את הפנייה יש להשלים: '));
    invalid.forEach((key, index) => {
      form.elements[key].setAttribute('aria-invalid', 'true');
      const error = document.getElementById(fieldIds[key] + '-error');
      error.textContent = key === 'projectType' ? 'יש לבחור את סוג הפרויקט.' : 'יש למלא את ' + labels[key] + '.';
      error.hidden = false;
      const link = document.createElement('a');
      link.href = '#' + fieldIds[key];link.textContent = labels[key];
      link.addEventListener('click', event => {event.preventDefault();form.elements[key].focus();});
      summary.append(link, document.createTextNode(index < invalid.length - 1 ? ', ' : '.'));
    });
    summary.hidden = false;summary.focus();return false;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm()) return;
    const values = Object.fromEntries(new FormData(form));
    const url = projectWhatsAppUrl(values);
    window.open(url, '_blank', 'noopener,noreferrer');
    const status = document.querySelector('#form-status');
    status.replaceChildren(document.createTextNode('הפנייה מוכנה. אם WhatsApp לא נפתח, '));
    const retry = document.createElement('a');
    retry.href = url;retry.target = '_blank';retry.rel = 'noopener noreferrer';
    retry.textContent = 'אפשר לפתוח אותה כאן (בלשונית חדשה)';
    status.append(retry, document.createTextNode('. השליחה דורשת אישור ב־WhatsApp.'));
    status.hidden = false;
  });
  const modelContext = document.modelContext;
  if (modelContext && typeof modelContext.registerTool === 'function') {
    const lifecycle = new AbortController();
    const projectTypes = Array.from(form.elements.projectType.options).map(option => option.value).filter(Boolean);
    const roles = Array.from(form.elements.role.options).map(option => option.value).filter(Boolean);
    const planStates = Array.from(form.elements.plans.options).map(option => option.value).filter(Boolean);
    try {
      Promise.resolve(modelContext.registerTool({
        name: 'stage_project_inquiry',title: 'הכנת פנייה על עבודת חשמל',
        description: 'Fill the visible inquiry form and prepare a WhatsApp message. Does not open WhatsApp or send a message. The visitor sends it separately after reading the visible privacy notice.',
        inputSchema: {type: 'object', properties: {name: {type: 'string', minLength: 1, maxLength: 80}, city: {type: 'string', minLength: 1, maxLength: 100}, projectType: {type: 'string', enum: projectTypes}, role: {type: 'string', enum: roles}, area: {type: 'string', maxLength: 20}, plans: {type: 'string', enum: planStates}, description: {type: 'string', maxLength: 1500}}, required: ['name', 'city', 'projectType'], additionalProperties: false},
        annotations: {readOnlyHint: false, untrustedContentHint: false},
        execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid inquiry.');
          if (Object.keys(input).some(key => !['name', 'city', 'projectType', 'role', 'area', 'plans', 'description'].includes(key))) throw new Error('Unknown inquiry field.');
          for (const [key, max] of [['name', 80], ['city', 100]]) if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > max) throw new Error('Invalid ' + key + '.');
          if (!projectTypes.includes(input.projectType)) throw new Error('Invalid project type.');
          if (input.description !== undefined && (typeof input.description !== 'string' || input.description.length > 1500)) throw new Error('Invalid description.');
          if (input.role !== undefined && !roles.includes(input.role)) throw new Error('Invalid role.');
          if (input.plans !== undefined && !planStates.includes(input.plans)) throw new Error('Invalid plans.');
          if (input.area !== undefined && (typeof input.area !== 'string' || input.area.length > 20)) throw new Error('Invalid area.');
          const values = {...input, role: input.role || '', area: input.area || '', plans: input.plans || '', description: input.description || ''};
          clearErrors();
          for (const key of ['name', 'city', 'projectType', 'role', 'area', 'plans', 'description']) form.elements[key].value = values[key];
          const status = document.querySelector('#form-status');
          status.textContent = 'הפרטים מוכנים בטופס. אפשר לקרוא את הודעת הפרטיות ולהמשיך ל־WhatsApp.';status.hidden = false;
          return {status: 'prepared', message: composeProjectMessage(values), whatsappUrl: projectWhatsAppUrl(values), sent: false};
        }
      }, {signal: lifecycle.signal})).catch(() => {});
      window.addEventListener('pagehide', () => lifecycle.abort(), {once: true});
    } catch (_) {}
  }
}

function composeReviewMessage(values) {
  return ['שלום מוחמד, זו חוות הדעת שלי על העבודה של Blue Light:', '',
    'שם להצגה: ' + values.reviewName.trim(),
    'דירוג: ' + values.rating + ' מתוך 5',
    'חוות דעת: ' + values.reviewText.trim(), '',
    values.publishConsent === 'on' ? 'אני מאשר/ת פרסום באתר של חוות הדעת, הדירוג והשם שציינתי.' : 'משוב פרטי בלבד — איני מאשר/ת פרסום באתר.'
  ].join('\n');
}
const reviewForm = document.querySelector('#review-form');
if (reviewForm) {
  const reviewFields = ['review-name', 'review-rating', 'review-text'];
  const reviewErrors = document.getElementById('review-errors');
  const reviewStatus = document.getElementById('review-status');
  function clearReviewErrors() {
    reviewErrors.hidden = true;reviewErrors.textContent = '';
    for (const id of reviewFields) {
      document.getElementById(id).removeAttribute('aria-invalid');
      const error = document.getElementById(id + '-error');
      error.hidden = true;error.textContent = '';
    }
  }
  reviewForm.addEventListener('input', () => {clearReviewErrors();reviewStatus.hidden = true;});
  reviewForm.addEventListener('submit', event => {
    event.preventDefault();clearReviewErrors();reviewStatus.hidden = true;
    const values = Object.fromEntries(new FormData(reviewForm));
    const errors = [];
    if (!values.reviewName || !values.reviewName.trim() || values.reviewName.length > 80) errors.push(['review-name', 'יש לכתוב שם להצגה, עד 80 תווים.']);
    if (!['1','2','3','4','5'].includes(values.rating)) errors.push(['review-rating', 'יש לבחור דירוג בין 1 ל־5.']);
    if (!values.reviewText || values.reviewText.trim().length < 10 || values.reviewText.length > 1200) errors.push(['review-text', 'יש לכתוב חוות דעת באורך 10–1,200 תווים.']);
    if (errors.length) {
      for (const [id, message] of errors) {
        document.getElementById(id).setAttribute('aria-invalid', 'true');
        const error = document.getElementById(id + '-error');error.textContent = message;error.hidden = false;
      }
      reviewErrors.textContent = errors.map(item => item[1]).join(' ');
      reviewErrors.hidden = false;reviewErrors.focus();return;
    }
    const url = 'https://wa.me/972509028896?text=' + encodeURIComponent(composeReviewMessage(values));
    window.open(url, '_blank', 'noopener,noreferrer');
    reviewStatus.replaceChildren(document.createTextNode('חוות הדעת מוכנה. אם WhatsApp לא נפתח, '));
    const retry = document.createElement('a');retry.href = url;retry.target = '_blank';retry.rel = 'noopener noreferrer';
    retry.textContent = 'פתחו את ההודעה כאן (בלשונית חדשה)';
    reviewStatus.append(retry, document.createTextNode('. ההודעה תגיע אלינו רק אחרי שליחה ב־WhatsApp.'));
    reviewStatus.hidden = false;
  });
}
