/* =============================================
   PristineClean – script.js
   ============================================= */

/* ---- Navbar scroll behaviour ---- */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

burger.addEventListener('click', () => {
  navbar.classList.toggle('nav-open');
  const expanded = navbar.classList.contains('nav-open');
  burger.setAttribute('aria-expanded', expanded);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('nav-open'));
});

/* ---- Floating CTA ---- */
const floatingCta = document.getElementById('floatingCta');
const heroSection = document.getElementById('hero');

const ctaObserver = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  },
  { threshold: 0.1 }
);
if (heroSection) ctaObserver.observe(heroSection);

/* ---- Contact form validation ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(input, errorId, message) {
  const error = document.getElementById(errorId);
  if (!input.value.trim()) {
    input.classList.add('error');
    if (error) error.textContent = message;
    return false;
  }
  input.classList.remove('error');
  if (error) error.textContent = '';
  return true;
}

function validateEmail(input, errorId) {
  const error = document.getElementById(errorId);
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.value.trim()) {
    input.classList.add('error');
    if (error) error.textContent = 'E-post är obligatorisk.';
    return false;
  }
  if (!re.test(input.value)) {
    input.classList.add('error');
    if (error) error.textContent = 'Ange en giltig e-postadress.';
    return false;
  }
  input.classList.remove('error');
  if (error) error.textContent = '';
  return true;
}

function validatePhone(input, errorId) {
  const error = document.getElementById(errorId);
  const digits = input.value.replace(/\D/g, '');
  if (!input.value.trim()) {
    input.classList.add('error');
    if (error) error.textContent = 'Telefonnummer är obligatoriskt.';
    return false;
  }
  if (digits.length < 7) {
    input.classList.add('error');
    if (error) error.textContent = 'Ange ett giltigt telefonnummer.';
    return false;
  }
  input.classList.remove('error');
  if (error) error.textContent = '';
  return true;
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput  = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const gdprInput  = document.getElementById('gdpr');
    const gdprError  = document.getElementById('gdprError');

    const v1 = validateField(nameInput,  'nameError',  'Namn är obligatoriskt.');
    const v2 = validatePhone(phoneInput, 'phoneError');
    const v3 = validateEmail(emailInput, 'emailError');

    let v4 = true;
    if (!gdprInput.checked) {
      gdprError.textContent = 'Du måste godkänna behandling av personuppgifter för att skicka formuläret.';
      v4 = false;
    } else {
      gdprError.textContent = '';
    }

    if (!v1 || !v2 || !v3 || !v4) return;

    // Show loading state
    const btn     = document.getElementById('submitBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoad = btn.querySelector('.btn-loading');
    btn.disabled  = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline';

    // Simulate async submission (replace with real API call)
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
    }, 1200);
  });

  // Live validation on blur
  ['name', 'phone', 'email'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      if (id === 'email') validateEmail(el, 'emailError');
      else if (id === 'phone') validatePhone(el, 'phoneError');
      else validateField(el, id + 'Error', `${el.previousElementSibling ? el.previousElementSibling.textContent.replace(' *','') : 'Fält'} är obligatoriskt.`);
    });
  });
}

/* =============================================
   COOKIE CONSENT
   ============================================= */
const COOKIE_KEY = 'pristineclean_cookie_consent';

function getCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCookieConsent(prefs) {
  try {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

function applyConsent(prefs) {
  // Analytics
  if (prefs.analytics) {
    // Initialize analytics (e.g. Google Analytics) here
    // window.dataLayer = window.dataLayer || []; etc.
  }
  // Marketing
  if (prefs.marketing) {
    // Initialize marketing pixels here
  }
}

const cookieBanner       = document.getElementById('cookieBanner');
const cookieAccept       = document.getElementById('cookieAccept');
const cookieDecline      = document.getElementById('cookieDecline');
const cookieSettings     = document.getElementById('cookieSettings');
const cookieModal        = document.getElementById('cookieModal');
const cookieModalClose   = document.getElementById('cookieModalClose');
const cookieModalBackdrop = document.getElementById('cookieModalBackdrop');
const cookieSavePrefs    = document.getElementById('cookieSavePrefs');
const cookieSaveDecline  = document.getElementById('cookieSaveDecline');
const reopenCookies      = document.getElementById('reopenCookies');

function hideBanner() {
  if (cookieBanner) cookieBanner.classList.add('hidden');
}

function openModal() {
  if (cookieModal) cookieModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (cookieModal) cookieModal.style.display = 'none';
  document.body.style.overflow = '';
}

// Show banner only if no consent stored
const existingConsent = getCookieConsent();
if (existingConsent) {
  hideBanner();
  applyConsent(existingConsent);
} else if (cookieBanner) {
  cookieBanner.classList.remove('hidden');
}

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    const prefs = { necessary: true, analytics: true, marketing: true };
    saveCookieConsent(prefs);
    applyConsent(prefs);
    hideBanner();
  });
}

if (cookieDecline) {
  cookieDecline.addEventListener('click', () => {
    const prefs = { necessary: true, analytics: false, marketing: false };
    saveCookieConsent(prefs);
    hideBanner();
  });
}

if (cookieSettings) cookieSettings.addEventListener('click', openModal);
if (cookieModalClose) cookieModalClose.addEventListener('click', closeModal);
if (cookieModalBackdrop) cookieModalBackdrop.addEventListener('click', closeModal);

if (cookieSaveDecline) {
  cookieSaveDecline.addEventListener('click', () => {
    const prefs = { necessary: true, analytics: false, marketing: false };
    saveCookieConsent(prefs);
    closeModal();
    hideBanner();
  });
}

if (cookieSavePrefs) {
  cookieSavePrefs.addEventListener('click', () => {
    const analytics = document.getElementById('cookieAnalytics');
    const marketing = document.getElementById('cookieMarketing');
    const prefs = {
      necessary: true,
      analytics: analytics ? analytics.checked : false,
      marketing: marketing ? marketing.checked : false,
    };
    saveCookieConsent(prefs);
    applyConsent(prefs);
    closeModal();
    hideBanner();
  });
}

if (reopenCookies) {
  reopenCookies.addEventListener('click', () => {
    openModal();
    // Pre-fill checkboxes from saved prefs
    const saved = getCookieConsent();
    if (saved) {
      const analytics = document.getElementById('cookieAnalytics');
      const marketing = document.getElementById('cookieMarketing');
      if (analytics) analytics.checked = !!saved.analytics;
      if (marketing) marketing.checked = !!saved.marketing;
    }
  });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cookieModal && cookieModal.style.display === 'flex') {
    closeModal();
  }
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
