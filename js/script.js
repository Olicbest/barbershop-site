(function () {
  // sticky navbar background on scroll
  var navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // reveal elements on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // front-end booking form validation (no backend)
  var form = document.getElementById('bookingForm');
  var status = document.getElementById('formStatus');
  var dateInput = document.getElementById('date');
  var today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  function setError(field, msg) {
    var el = form.querySelector('[data-for="' + field + '"]');
    var input = form.elements[field];
    if (el) el.textContent = msg || '';
    if (input) input.classList.toggle('invalid', !!msg);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var ok = true;
    ['name', 'contact', 'service', 'date'].forEach(function (f) { setError(f, ''); });

    if (!data.get('name').trim()) { setError('name', 'Please enter your name.'); ok = false; }
    if (!data.get('contact').trim()) { setError('contact', 'Add a phone number or email.'); ok = false; }
    if (!data.get('service')) { setError('service', 'Pick a service.'); ok = false; }
    if (!data.get('date')) { setError('date', 'Choose a date.'); ok = false; }

    if (!ok) {
      status.textContent = 'Please fix the highlighted fields.';
      return;
    }
    status.textContent = 'Thanks ' + data.get('name').trim().split(' ')[0] + '! Your request is in. We will confirm shortly.';
    form.reset();
    dateInput.setAttribute('min', today);
  });
})();
