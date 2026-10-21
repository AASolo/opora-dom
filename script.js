(function () {
  // Theme toggle (dark by default, choice remembered)
  var root = document.documentElement;
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  var CITIES = [
    ['Саратов', 'Поволжье'], ['Пенза', 'Поволжье'], ['Самара', 'Поволжье'], ['Тольятти', 'Поволжье'],
    ['Сызрань', 'Поволжье'], ['Ульяновск', 'Поволжье'], ['Казань', 'Поволжье'], ['Чебоксары', 'Поволжье'],
    ['Нижний Новгород', 'Поволжье'], ['Ижевск', 'Урал'], ['Челябинск', 'Урал'], ['Волгоград', 'Юг'],
    ['Астрахань', 'Юг'], ['Ростов-на-Дону', 'Юг'], ['Краснодар', 'Юг'], ['Сочи', 'Юг'],
    ['Воронеж', 'Центр'], ['Тверь', 'Центр'], ['Иваново', 'Центр']
  ];

  // Mobile menu
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Header border on scroll
  var header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  // Cities list, search and form select
  var list = document.getElementById('cityList');
  var empty = document.getElementById('cityEmpty');
  var select = document.getElementById('citySelect');
  CITIES.forEach(function (c) {
    var li = document.createElement('li');
    li.innerHTML = '<button type="button" class="city" data-city="' + c[0] + '">' + c[0] +
      ' <small>' + c[1] + '</small></button>';
    list.appendChild(li);
    var opt = document.createElement('option');
    opt.textContent = c[0];
    select.appendChild(opt);
  });
  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.city');
    if (!btn) return;
    select.value = btn.dataset.city;
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('citySearch').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase();
    var shown = 0;
    list.querySelectorAll('li').forEach(function (li) {
      var match = li.textContent.toLowerCase().indexOf(q) !== -1;
      li.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
  });

  // Reviews slider
  var track = document.getElementById('reviewsTrack');
  document.querySelectorAll('.slider-nav .round').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = track.querySelector('.review');
      track.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 16), behavior: 'smooth' });
    });
  });

  // Phone mask
  var phone = document.querySelector('input[name="phone"]');
  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10);
    var out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ') ' + d.slice(3, 6);
    if (d.length >= 6) out += '-' + d.slice(6, 8);
    if (d.length >= 8) out += '-' + d.slice(8, 10);
    phone.value = out;
  });

  // Form (demo: no sending)
  var form = document.getElementById('applyForm');
  var msg = document.getElementById('formMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['name', 'city'].forEach(function (n) {
      var f = form.elements[n];
      var bad = !f.value.trim();
      f.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    var digits = phone.value.replace(/\D/g, '');
    phone.classList.toggle('is-invalid', digits.length !== 11);
    if (digits.length !== 11) ok = false;
    if (!form.elements.agree.checked) ok = false;
    if (!ok) {
      msg.className = 'form__msg err';
      msg.textContent = 'Заполните имя, телефон, город и отметьте согласие.';
      return;
    }
    msg.className = 'form__msg ok';
    msg.textContent = 'Спасибо, ' + form.elements.name.value.trim() + '! Это демо: в рабочей версии заявка уйдёт в Telegram и на почту.';
    form.reset();
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: .15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
