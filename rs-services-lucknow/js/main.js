/* =========================================================
   RS Services Lucknow — interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Header state + scroll progress ---------- */
  var header = document.getElementById('siteHeader');
  var bar = document.querySelector('.scroll-progress__bar');
  var callbar = document.querySelector('.callbar');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle('is-stuck', y > 40);

    if (bar) {
      var pct = max > 0 ? (y / max) * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
    }

    if (callbar) callbar.classList.toggle('is-on', y > 520);

    if (!reduce) heroParallax(y);

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  /* ---------- Hero parallax ---------- */
  var heroImg = document.querySelector('.hero__img');
  var hero = document.querySelector('.hero');
  var heroInner = document.querySelector('.hero__inner');

  function heroParallax(y) {
    if (!heroImg || !hero) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
    var shift = Math.min(y, window.innerHeight) * 0.14;
    var fade = Math.max(0, 1 - y / (window.innerHeight * 0.8));
    heroImg.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    if (heroInner) heroInner.style.opacity = fade.toFixed(3);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));

  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }

  /* ---------- Hero entrance ---------- */
  var heroEl = document.querySelector('.hero');
  if (heroEl) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroEl.classList.add('is-ready'); });
    });
  }

  /* ---------- Counters ---------- */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var dur = 1600;
    var start = null;

    if (reduce) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = decimals
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var sheet = document.getElementById('mobileNav');

  function closeNav() {
    if (!sheet || !toggle) return;
    sheet.classList.remove('is-open');
    sheet.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && sheet) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeNav();
      } else {
        sheet.hidden = false;
        sheet.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
      }
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Active nav link ---------- */
  var sections = [].slice.call(document.querySelectorAll('section[id]'));
  var navLinks = [].slice.call(document.querySelectorAll('.site-nav a'));

  if ('IntersectionObserver' in window && sections.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0.4, rootMargin: '-20% 0px -40% 0px' });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- Services hover preview (fine pointers only) ---------- */
  var preview = document.getElementById('svcPreview');
  var previewImg = preview ? preview.querySelector('img') : null;
  var svcItems = [].slice.call(document.querySelectorAll('.svc'));

  if (preview && previewImg && fine && !reduce) {
    var px = 0, py = 0, tx = 0, ty = 0, raf = null;

    function loop() {
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      preview.style.left = px + 'px';
      preview.style.top = py + 'px';
      raf = requestAnimationFrame(loop);
    }

    svcItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var src = item.getAttribute('data-img');
        if (!src) return;
        if (previewImg.getAttribute('src') !== src) previewImg.setAttribute('src', src);
        preview.classList.add('is-on');
        if (!raf) loop();
      });
      item.addEventListener('mousemove', function (e) {
        tx = e.clientX + 28;
        ty = e.clientY;
      });
      item.addEventListener('mouseleave', function () {
        preview.classList.remove('is-on');
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Boot ---------- */
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  onScroll();
})();
