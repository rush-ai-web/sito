/* ============================================================
   RUSH — interactions
   Framer-style motion: reveal, word-fill, navbar, parallax,
   theme toggle, audience switch, form. All reduced-motion safe.
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- THEME ---------- */
  const root = document.documentElement;
  const STORE = 'rush-theme';
  const saved = localStorage.getItem(STORE);
  if (saved) root.setAttribute('data-theme', saved);

  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORE, next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#FAFAF9' : '#08080A');
  }
  document.querySelectorAll('#themeToggle, [data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', toggleTheme);
  });

  /* ---------- NAV shrink on scroll ---------- */
  const nav = document.getElementById('nav');
  let ticking = false;
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- REVEAL on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- WORD-FILL ---------- */
  // Split target text into words; fill as the section scrolls through view.
  function splitWords(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    const frag = document.createDocumentFragment();
    text.split(' ').forEach(function (w, i) {
      const span = document.createElement('span');
      span.className = 'wf-word';
      span.textContent = w;
      frag.appendChild(span);
      if (i < text.split(' ').length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.appendChild(frag);
    return el.querySelectorAll('.wf-word');
  }

  const wfEls = [];
  document.querySelectorAll('[data-wordfill]').forEach(function (el) {
    wfEls.push({ el: el, words: splitWords(el) });
  });

  function updateWordFill() {
    const vh = window.innerHeight;
    wfEls.forEach(function (item) {
      const rect = item.el.getBoundingClientRect();
      // progress: 0 when block enters lower third, 1 when it reaches upper third
      const start = vh * 0.82;
      const end = vh * 0.32;
      let p = (start - rect.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      const n = Math.round(p * item.words.length);
      item.words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    });
  }

  if (reduce) {
    wfEls.forEach(function (item) { item.words.forEach(function (w) { w.classList.add('on'); }); });
  } else if (wfEls.length) {
    let wfTick = false;
    window.addEventListener('scroll', function () {
      if (!wfTick) { window.requestAnimationFrame(function () { updateWordFill(); wfTick = false; }); wfTick = true; }
    }, { passive: true });
    updateWordFill();
  }

  /* ---------- HERO title: word-fill on load ---------- */
  const heroTitle = document.querySelector('[data-wordfill-load]');
  if (heroTitle && !reduce) {
    // split preserving <br>
    const nodes = Array.from(heroTitle.childNodes);
    heroTitle.textContent = '';
    let idx = 0;
    nodes.forEach(function (node) {
      if (node.nodeName === 'BR') { heroTitle.appendChild(document.createElement('br')); return; }
      node.textContent.trim().split(/\s+/).forEach(function (w) {
        const span = document.createElement('span');
        span.textContent = w;
        span.style.cssText = 'display:inline-block;opacity:0;filter:blur(10px);transform:translateY(14px);transition:opacity .6s var(--ease),transform .6s var(--ease),filter .6s var(--ease)';
        span.style.transitionDelay = (idx * 70) + 'ms';
        heroTitle.appendChild(span);
        heroTitle.appendChild(document.createTextNode(' '));
        idx++;
      });
    });
    requestAnimationFrame(function () {
      heroTitle.querySelectorAll('span').forEach(function (s) {
        s.style.opacity = '1'; s.style.filter = 'none'; s.style.transform = 'none';
      });
    });
  }

  /* ---------- PARALLAX (light) ---------- */
  if (!reduce) {
    const spot = document.querySelector('.hero__spot');
    const converge = document.querySelector('.converge');
    let pTick = false;
    window.addEventListener('scroll', function () {
      if (pTick) return;
      pTick = true;
      window.requestAnimationFrame(function () {
        const y = window.scrollY;
        if (spot) spot.style.transform = 'translateX(-50%) translateY(' + (y * 0.18) + 'px)';
        if (converge) converge.style.transform = 'translateY(' + (y * 0.08) + 'px)';
        pTick = false;
      });
    }, { passive: true });
  }

  /* ---------- CTA audience switch ---------- */
  const tabs = document.querySelectorAll('.cta__tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      const aud = tab.getAttribute('data-audience');
      document.querySelectorAll('[data-field]').forEach(function (f) {
        f.classList.toggle('field--hidden', f.getAttribute('data-field') !== aud);
      });
    });
  });

  /* ---------- FORM (demo, no backend) ---------- */
  const form = document.getElementById('accessForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const success = document.getElementById('formSuccess');
      form.querySelectorAll('.field, .btn, .cta__formnote').forEach(function (el) { el.style.display = 'none'; });
      if (success) success.hidden = false;
    });
  }

  /* ---------- Smooth-scroll offset for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
