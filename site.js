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
  return ['שלום מוחמד, אשמח לקבל הצעת מחיר לעבודת חשמל.', '', 'שם: ' + values.name.trim(), 'מיקום: ' + values.city.trim(), 'סוג העבודה: ' + values.projectType, values.description.trim() ? 'פרטי העבודה: ' + values.description.trim() : ''].filter(Boolean).join('\n');
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
    try {
      Promise.resolve(modelContext.registerTool({
        name: 'stage_project_inquiry',title: 'הכנת פנייה על עבודת חשמל',
        description: 'Fill the visible inquiry form and prepare a WhatsApp message. Does not open WhatsApp or send a message. The visitor sends it separately after reading the visible privacy notice.',
        inputSchema: {type: 'object', properties: {name: {type: 'string', minLength: 1, maxLength: 80}, city: {type: 'string', minLength: 1, maxLength: 100}, projectType: {type: 'string', enum: projectTypes}, description: {type: 'string', maxLength: 1500}}, required: ['name', 'city', 'projectType'], additionalProperties: false},
        annotations: {readOnlyHint: false, untrustedContentHint: false},
        execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid inquiry.');
          if (Object.keys(input).some(key => !['name', 'city', 'projectType', 'description'].includes(key))) throw new Error('Unknown inquiry field.');
          for (const [key, max] of [['name', 80], ['city', 100]]) if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > max) throw new Error('Invalid ' + key + '.');
          if (!projectTypes.includes(input.projectType)) throw new Error('Invalid project type.');
          if (input.description !== undefined && (typeof input.description !== 'string' || input.description.length > 1500)) throw new Error('Invalid description.');
          const values = {...input, description: input.description || ''};
          clearErrors();
          for (const key of ['name', 'city', 'projectType', 'description']) form.elements[key].value = values[key];
          const status = document.querySelector('#form-status');
          status.textContent = 'הפרטים מוכנים בטופס. אפשר לקרוא את הודעת הפרטיות ולהמשיך ל־WhatsApp.';status.hidden = false;
          return {status: 'prepared', message: composeProjectMessage(values), whatsappUrl: projectWhatsAppUrl(values), sent: false};
        }
      }, {signal: lifecycle.signal})).catch(() => {});
      window.addEventListener('pagehide', () => lifecycle.abort(), {once: true});
    } catch (_) {}
  }
}
