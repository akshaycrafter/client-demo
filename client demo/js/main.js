/* ============================================================
   AC Service — demo sample site
   Everything on the page comes from the DATA object below.
   Change a value there and the whole site updates.
   ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
     DEMO DATA — the single source of truth for the whole page.
     Every value here is an obviously fake sample.
     ------------------------------------------------------------ */
  var DATA = {
    // Business name — also drives the monogram and the page title
    name: 'AC Service',

    // Small label used in the hero and the footer
    taglineLabel: 'AC repair · Your City',

    // Contact
    phone: '+91 00000 00000',
    phoneHref: 'tel:+910000000000',
    whatsapp: 'https://wa.me/910000000000',

    // Where we are
    address: 'Shop No. 00, Main Road, Your City',
    hours: 'Open daily, 9 am to 8 pm',

    // Google Maps embed query, built into both map links
    mapQuery: 'Your City',

    // Copy
    heroTitleLine1: 'Cool air,',
    heroTitleItalic: 'fixed properly.',
    heroSub: 'We come to your place, check the AC, and fix what needs fixing.',
    ctaTitle: 'AC not cooling?',
    ctaSub: 'Send a message and we get back to you.',
    callLabel: 'Call now',
    callShortLabel: 'Call',
    whatsappLabel: 'WhatsApp',

    // Section labels
    labels: {
      services: 'Services',
      servicesEyebrow: 'What we do',
      servicesIntro: 'Four regular jobs for split and window units.',
      how: 'How it works',
      howTitle: 'Three steps',
      howIntro: 'From a message to a unit that cools again.',
      why: 'Why choose us',
      whyTitle: 'What to expect',
      location: 'Location and hours',
      locationTitle: 'Where to find us',
      contact: 'Contact',
      contactTitle: 'Get in touch',
      contactIntro: 'A call or a message is enough to book a visit.',
      directions: 'Get directions'
    },

    // Three generic, non-claim points
    why: [
      'Doorstep service',
      'Clear communication',
      'Neat work'
    ],

    // Services — plain factual lines, no claims about speed, price,
    // warranty, brands, years or certifications
    services: [
      {
        name: 'AC repair',
        text: 'Finding the fault and restoring cooling on split and window AC units.'
      },
      {
        name: 'AC servicing and cleaning',
        text: 'Cleaning and routine servicing to keep the unit running properly.'
      },
      {
        name: 'AC installation',
        text: 'Mounting and setting up new AC units.'
      },
      {
        name: 'AC gas filling',
        text: 'Checking for leaks and refilling the coolant gas the unit needs.'
      }
    ],

    // Deliberately empty — the site has no ratings, counts or testimonials
    reviews: []
  };

  /* ------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------ */
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };

  // Text into an element by id, only when that element exists
  var put = function (id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  };

  var pad2 = function (n) {
    return String(n).length < 2 ? '0' + n : String(n);
  };

  // Short-circuit for "is the user on a phone/tablet"?
  var isCoarse = function () {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  };

  var prefersReducedMotion = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* ------------------------------------------------------------
     Push DATA into the elements written in index.html
     ------------------------------------------------------------ */
  function applyStatic() {
    // Title: "AC Service | Demo"
    document.title = DATA.name + ' | Demo';

    // Monogram = first letter of every word in the name
    var mono = DATA.name
      .split(/\s+/)
      .filter(Boolean)
      .map(function (w) { return w.charAt(0); })
      .join('')
      .toUpperCase();

    put('navMono', mono);
    put('navName', DATA.name);
    put('footerName', DATA.name);
    put('footerTag', DATA.taglineLabel);
    put('footerBase', 'Demo sample website. ' + DATA.name + '.');
    put('heroTag', DATA.taglineLabel);
    put('heroSub', DATA.heroSub);
    put('ctaTitle', DATA.ctaTitle);
    put('ctaSub', DATA.ctaSub);

    // Section labels
    var L = DATA.labels;
    $$('.s-label').forEach(function (el) {
      var map = {
        services: L.servicesEyebrow,
        how: L.how,
        why: L.why,
        location: L.location,
        contact: L.contact
      };
      var key = (el.closest('section') || {}).id;
      if (map[key]) el.textContent = map[key];
    });

    put('locIntro', DATA.address + ' · ' + DATA.hours);
    put('locAddress', DATA.address);
    put('locHours', DATA.hours);
    put('infoAddress', DATA.address);
    put('infoHours', DATA.hours);
    put('footAddress', DATA.address);
    put('footHours', DATA.hours);
    put('ovHours', DATA.hours);
    put('ovPlace', DATA.address);

    // Phone everywhere
    var pillText = $('.phone-pill span');
    if (pillText) pillText.textContent = DATA.phone;
    ['locPhone', 'infoPhone', 'footPhone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.textContent = DATA.phone;
        el.href = DATA.phoneHref;
      }
    });

    // "Call now" buttons in the navbar and the mobile menu
    ['callNowBtn', 'ovCallBtn', 'heroCallBtn'].forEach(function (id) {
      var btn = document.getElementById(id);
      var span = btn && $('.btn-text', btn);
      if (span) span.textContent = DATA.callLabel;
    });

    // Nav brand aria label
    var brand = $('.nav-brand');
    if (brand) brand.setAttribute('aria-label', DATA.name + ' — back to top');

    var pill = document.getElementById('phonePill');
    if (pill) {
      pill.href = DATA.phoneHref;
      pill.setAttribute('aria-label', 'Call ' + DATA.name + ' at ' + DATA.phone);
    }

    // Every WhatsApp link on the page
    $$('[data-wa]').forEach(function (a) {
      a.href = DATA.whatsapp;
      var label = $('[data-wa-label]', a);
      if (label) label.textContent = DATA.whatsapp;
    });
    $$('.v-hide').forEach(function (el) {
      if (/wa\.me/.test(el.textContent)) el.textContent = DATA.whatsapp;
    });

    // Map embed + directions link, both built from mapQuery
    var map = encodeURIComponent(DATA.mapQuery);
    var embed = $('#mapFrame');
    if (embed) {
      embed.src = 'https://www.google.com/maps?q=' + map + '&output=embed';
      embed.title = 'Map showing ' + DATA.mapQuery;
    }
    var dirs = document.getElementById('directionsBtn');
    if (dirs) {
      dirs.href = 'https://www.google.com/maps/search/?api=1&query=' + map;
      var dirsText = $('.btn-text', dirs);
      if (dirsText) dirsText.textContent = L.directions;
    }
  }

  /* ------------------------------------------------------------
     Hero title — built in one place from DATA
     ------------------------------------------------------------ */
  function applyHeroTitle() {
    var host = document.getElementById('heroTitle');
    if (!host) return;

    host.innerHTML =
      '<span class="line"><span class="line-in">' + DATA.heroTitleLine1 + '</span></span>' +
      '<span class="line"><span class="line-in"><em>' + DATA.heroTitleItalic + '</em></span></span>';
  }

  /* ------------------------------------------------------------
     Services — rendered as numbered full-width rows
     ------------------------------------------------------------ */
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>';

  function renderServices() {
    var host = document.getElementById('servicesList');
    if (!host) return;

    var html = DATA.services.map(function (s, i) {
      return (
        '<div class="row reveal">' +
          '<span class="row-num">' + pad2(i + 1) + '</span>' +
          '<div class="row-body">' +
            '<h3 class="row-name">' + s.name + '</h3>' +
            '<p class="row-desc">' + s.text + '</p>' +
          '</div>' +
          '<span class="row-arrow" aria-hidden="true">' + ARROW + '</span>' +
        '</div>'
      );
    }).join('');

    host.innerHTML = html;
  }

  /* ------------------------------------------------------------
     Marquee — service names + the city label, joined by a mark
     ------------------------------------------------------------ */
  function renderMarquee() {
    var host = document.getElementById('marqueeTrack');
    if (!host) return;

    var items = DATA.services.map(function (s) { return s.name; })
      .concat([DATA.taglineLabel]);

    // A chunk is the unit of motion; the list is repeated so the loop is seamless
    var chunk = items.map(function (t, i) {
      return '<span>' + t + '</span>' +
        (i < items.length - 1 ? '<span class="mark" aria-hidden="true">/</span>' : '');
    }).join('');

    var repeats = isCoarse() ? 1 : 4;
    host.innerHTML = new Array(repeats).fill(chunk)
      .map(function (c) { return '<div class="marquee-chunk">' + c + '</div>'; })
      .join('');
  }

  /* ------------------------------------------------------------
     Smooth scrolling: Lenis driven by the GSAP ticker, ScrollTrigger
     updated on every Lenis scroll tick.
     ------------------------------------------------------------ */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return null;

    gsap.registerPlugin(ScrollTrigger);

    var lenis = new Lenis({
      duration: 1.05,
      easing: function (t) { return 1 - Math.pow(1 - t, 3); }
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  // Frosted navbar after the page moves away from the top
  function initNavBackground() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle('is-solid', window.scrollY > 24);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // In-page anchor clicks. Bound once; `scrollCtx.lenis` is filled in later
  // once Lenis has been created, so there is only ever one handler per link.
  var scrollCtx = { lenis: null };

  function initAnchorNav() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = id && document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        setMenu(false);

        var navH = parseFloat(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        var y = target.getBoundingClientRect().top + window.pageYOffset - (navH - 12);

        if (scrollCtx.lenis && !prefersReducedMotion()) {
          scrollCtx.lenis.scrollTo(y, { duration: 1.1 });
        } else {
          window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ------------------------------------------------------------
     Page-load intro, kept under 1.5s
     ------------------------------------------------------------ */
  function playIntro() {
    var lines = $$('#heroTitle .line');
    var rest = $$('.hero .reveal');

    gsap.set(lines, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(rest, { autoAlpha: 0, y: 24 });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(lines, { clipPath: 'inset(0 0 0% 0)', duration: 0.95, stagger: 0.1 }, 0.08)
      .to(rest, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07 }, 0.7);

    // The title is the first thing a visitor sees — never let it stay clipped.
    setTimeout(function () {
      gsap.set(lines, { clipPath: 'inset(0 0 0% 0)', overwrite: true });
    }, 1600);
  }

  /* ------------------------------------------------------------
     Scroll reveals: line-by-line mask for headlines, fade-up for
     paragraphs, rows and cards.
     ------------------------------------------------------------ */
  function initReveals() {
    // Headings without lines get wrapped so they share the mask reveal
    $$('.mask').forEach(function (head) {
      if (head.closest('.hero')) return;
      if ($('.line', head)) return;
      head.innerHTML = '<span class="line"><span class="line-in">' +
        head.textContent + '</span></span>';
    });

    $$('.mask').forEach(function (head) {
      // Headlines already played during the page-load intro keep showing
      if (head.closest('.hero')) return;

      var lines = $$('.line', head);
      var delay = parseFloat(head.style.getPropertyValue('--rd')) || 0;
      gsap.set(lines, { clipPath: 'inset(0 0 100% 0)' });

      gsap.to(lines, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.05,
        stagger: 0.1,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 86%', once: true }
      });
    });

    $$('.reveal').forEach(function (el) {
      if (el.closest('.hero')) return;                 // hero runs its own intro

      var delay = parseFloat(el.style.getPropertyValue('--rd')) || 0;
      gsap.set(el, { autoAlpha: 0, y: 24 });

      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  // The thin line that joins the three step numerals
  function initStepsLine() {
    var fill = $('.steps-line-fill');
    if (!fill || !window.ScrollTrigger) return;

    ScrollTrigger.create({
      trigger: '#stepsWrap',
      start: 'top 80%',
      once: true,
      onEnter: function () {
        gsap.to(fill, { scaleY: 1, duration: 1.6, ease: 'power2.inOut' });
      }
    });
  }

  // Slow marquee, roughly 14 px of motion per second
  function initMarquee() {
    var track = document.getElementById('marqueeTrack');
    var chunk = track && $('.marquee-chunk', track);
    if (!track || !chunk) return;

    var one = chunk.getBoundingClientRect().width;
    if (!one) return;

    gsap.to(track, { x: -one, ease: 'none', duration: one / 14, repeat: -1 });
  }

  /* ------------------------------------------------------------
     Hero background: slow zoom, gentle parallax, and a clean
     fallback if assets/images/hero.jpg is not there yet.
     ------------------------------------------------------------ */
  function initHeroBg() {
    var img = document.getElementById('heroImg');
    if (!img) return;

    img.addEventListener('error', function () {
      img.style.display = 'none';                       // plain white hero
    });

    if (!window.ScrollTrigger) return;

    gsap.fromTo(img, { scale: 1.04 }, { scale: 1.12, duration: 24, ease: 'none' });

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: function (self) {
        gsap.to(img, {
          yPercent: self.progress * 26,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  }

  // Load the map only when it gets near the viewport
  function initMapLazy() {
    var frame = document.getElementById('mapFrame');
    if (!frame || !('IntersectionObserver' in window)) return;

    var src = frame.getAttribute('src');
    if (!src) return;

    frame.removeAttribute('src');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          frame.src = src;
          io.disconnect();
        }
      });
    }, { rootMargin: '320px' });

    io.observe(frame);
  }

  /* ------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------ */
  function setMenu(open) {
    var overlay = document.getElementById('mobileOverlay');
    var toggle = document.getElementById('navToggle');
    if (!overlay) return;

    overlay.classList.toggle('is-open', open);
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (toggle) {
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    document.body.classList.toggle('menu-open', open);
  }

  function initMenu() {
    var overlay = document.getElementById('mobileOverlay');
    var toggle = document.getElementById('navToggle');
    var closeBtn = document.getElementById('ovCloseBtn');

    if (toggle) {
      toggle.addEventListener('click', function () {
        setMenu(!overlay.classList.contains('is-open'));
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });

    if (overlay) {
      $$('a', overlay).forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // Every call button, wired once from DATA
  function initCallButtons() {
    var href = DATA.phoneHref;

    ['callNowBtn', 'heroCallBtn', 'ctaCallBtn', 'ovCallBtn', 'mbarCallBtn'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function () {
        window.location.href = href;
      });
    });
  }

  // Slight magnetic pull, capped at 6 px, desktop only
  function initMagnetic() {
    if (isCoarse() || typeof gsap === 'undefined') return;

    var MAX = 6;

    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;

        gsap.to(el, {
          x: Math.max(-MAX, Math.min(MAX, dx * 24)),
          y: Math.max(-MAX, Math.min(MAX, dy * 24)),
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      el.addEventListener('pointerleave', function () {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    });
  }

  /* ------------------------------------------------------------
     Boot
     ------------------------------------------------------------ */
  // Remove the mask wrappers so headings cannot stay clipped without GSAP
  function flattenMasks() {
    $$('.mask').forEach(function (head) {
      var lines = $$('.line', head);
      lines.forEach(function (line) {
        var inside = line.firstElementChild;
        if (inside && inside.classList.contains('line-in')) {
          line.parentNode.replaceChild(inside, line);
        }
      });
    });
  }

  function init() {
    applyStatic();
    applyHeroTitle();
    renderServices();
    renderMarquee();

    initMenu();
    initAnchorNav();
    initCallButtons();
    initNavBackground();
    initMapLazy();

    var reduced = prefersReducedMotion();
    var hasGsap = typeof gsap !== 'undefined';
    var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';

    // Without motion libraries (or with reduced motion) nothing may stay hidden,
    // so drop the js flag, flatten the masked headlines and stay static.
    if (!hasST || reduced) {
      document.documentElement.classList.remove('js');
      flattenMasks();
      return;
    }

    scrollCtx.lenis = initSmoothScroll();

    playIntro();
    initReveals();
    initStepsLine();
    initMarquee();
    initHeroBg();
    initMagnetic();

    window.addEventListener('resize', function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ===== Hero AC illustration ===== */
(function () {
  function initAcx() {
    var hero = document.querySelector('.hero, #hero, main > section:first-of-type');
    if (!hero || hero.querySelector('.acx')) return;
    if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
    var svg = ''
      + '<svg class="acx__svg" viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">'
      + '<defs><linearGradient id="acxFade" gradientUnits="userSpaceOnUse" x1="0" y1="192" x2="0" y2="400">'
      + '<stop offset="0" stop-color="#6B7075" stop-opacity=".95"/>'
      + '<stop offset="1" stop-color="#9EA2A7" stop-opacity=".05"/></linearGradient></defs>'
      + '<rect x="40" y="50" width="440" height="140" rx="30" fill="#FFFFFF" stroke="#6B7075" stroke-width="1.5"/>'
      + '<path d="M66 64H454" stroke="#DADCDF" stroke-width="1"/>'
      + '<path d="M96 84H300M96 96H300M96 108H300" stroke="#9EA2A7" stroke-width="1.2" stroke-linecap="round"/>'
      + '<path d="M66 136H454" stroke="#DADCDF" stroke-width="1"/>'
      + '<rect x="70" y="148" width="380" height="24" rx="12" fill="#F4F4F5" stroke="#9EA2A7" stroke-width="1.2"/>'
      + '<path d="M86 166Q260 176 434 166" stroke="#6B7075" stroke-width="1.5" stroke-linecap="round"/>'
      + '<circle class="acx__led" cx="436" cy="92" r="4" fill="#6B7075"/>'
      + '<g class="acx__flow" stroke="url(#acxFade)" stroke-width="1.5" stroke-linecap="round" fill="none">'
      + '<path style="--i:0" pathLength="1" d="M120 192C108 232 138 262 120 312C110 342 128 362 118 388"/>'
      + '<path style="--i:1" pathLength="1" d="M190 192C178 242 208 272 190 332C180 362 196 378 188 398"/>'
      + '<path style="--i:2" pathLength="1" d="M260 192C248 232 278 268 260 318"/>'
      + '<path style="--i:3" pathLength="1" d="M330 192C318 242 348 272 330 328C320 358 336 374 328 394"/>'
      + '<path style="--i:4" pathLength="1" d="M400 192C388 232 418 262 400 308C392 334 406 350 402 368"/>'
      + '</g></svg>';
    hero.insertAdjacentHTML('beforeend', '<div class="acx" aria-hidden="true"><div class="acx__in">' + svg + '</div></div>');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAcx);
  else initAcx();
})();
