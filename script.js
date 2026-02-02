const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('is-open');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Registration form handling
const form = document.getElementById('registrationForm');
const statusEl = document.getElementById('formStatus');

function showError(input, show) {
  const errorEl = input.parentElement.querySelector('.form__error');
  if (errorEl) errorEl.style.display = show ? 'block' : 'none';
}

function validateForm() {
  let valid = true;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const interest = document.getElementById('interest');

  if (!name.value.trim()) { showError(name, true); valid = false; } else showError(name, false);
  if (!email.value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) { showError(email, true); valid = false; } else showError(email, false);
  if (!interest.value) { showError(interest, true); valid = false; } else showError(interest, false);

  return valid;
}

function submitToExcelAPI(payload) {
  const EXCEL_API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzi6Dx-yENNXm3d_RuTzpNVINGTv694SlcfkRhqH35WmBWG7V2RN0ZtkZjHpMcDc5v26w/exec';

  return new Promise((resolve, reject) => {
    // Crear iframe oculto
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hiddenFrame';
    document.body.appendChild(iframe);

    // Crear formulario que apunta al iframe
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = EXCEL_API_ENDPOINT;
    form.target = 'hiddenFrame';
    form.style.display = 'none';

    // Agregar campos
    for (let key in payload) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = payload[key];
      form.appendChild(input);
    }

    // Manejar respuesta
    iframe.onload = function() {
      setTimeout(() => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve({ status: 'success' });
      }, 1000);
    };

    // Enviar
    document.body.appendChild(form);
    form.submit();
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    if (!validateForm()) {
      statusEl.textContent = 'Por favor, corrige los campos marcados.';
      return;
    }

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      interest: document.getElementById('interest').value,
      source: 'FundEdu Web',
      timestamp: new Date().toISOString()
    };

    try {
      statusEl.textContent = 'Enviando...';
      await submitToExcelAPI(payload);
      statusEl.textContent = '¡Aplicación enviada! Te contactaremos pronto.';
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Hubo un problema al enviar. Intenta nuevamente.';
      console.error(err);
    }
  });
}