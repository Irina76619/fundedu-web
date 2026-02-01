// Simple nav toggle for mobile
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

async function submitToExcelAPI(payload) {
  // TODO: Reemplaza con tu endpoint real (por ejemplo, Apps Script, Airtable, Nocodb, etc.)
  const EXCEL_API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxwJ1J6l1cCp7GNNDGyqX7KWYmsTWWW-B_YofSwOM-CefSoErVf1vSJI4Ukrno9HXn0aA/exec';

  const res = await fetch(EXCEL_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Error al enviar datos');
  return res.json();
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


