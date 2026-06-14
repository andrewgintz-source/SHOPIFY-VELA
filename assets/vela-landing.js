(function() {
  'use strict';
  const ROOT = document.querySelector('.vlp-root');
  if (!ROOT) return;

  /* ── 1. Headline word split ── */
  (function() {
    const h1 = ROOT.querySelector('#vlp-h1-{{ section.id }}');
    if (!h1) return;
    const text = h1.textContent.trim();
    const accentWords = ['relentless.', 'relentless', 'calm', 'breathe', 'price.', 'broken', 'overwhelming'];
    h1.innerHTML = text.split(/\s+/).map((w, i) => {
      const cls = accentWords.includes(w.toLowerCase()) ? 'w w-accent' : 'w';
      const delay = (0.5 + i * 0.09).toFixed(2);
      return `<span class="${cls}" style="animation-delay:${delay}s">${w}</span> `;
    }).join('');
  })();

  /* ── 2. Mouse parallax on hero product ── */
  (function() {
    const product = ROOT.querySelector('#vlp-product-{{ section.id }}');
    if (!product || window.innerWidth < 990) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    function lerp(a, b, t) { return a + (b - a) * t; }
    document.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 24;
      ty = (e.clientY / window.innerHeight - 0.5) * 14;
    });
    function tick() {
      cx = lerp(cx, tx, 0.055);
      cy = lerp(cy, ty, 0.055);
      product.style.cssText = `animation-play-state:paused; transform:translate(${cx}px,${cy}px)`;
      raf = requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ── 3. Scroll reveal (IntersectionObserver) ── */
  (function() {
    const els = ROOT.querySelectorAll('.lp-reveal, .lp-reveal-left, .lp-reveal-right');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lp-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  })();

  /* ── 4. Count-up animation ── */
  (function() {
    const counters = ROOT.querySelectorAll('[data-count]');
    if (!counters.length) return;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const val = easeOut(p) * target;
          el.textContent = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  })();

  /* ── 5. Progress bars ── */
  (function() {
    const bars = ROOT.querySelectorAll('.lp-bar-fill');
    if (!bars.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        io.unobserve(bar);
      });
    }, { threshold: 0.4 });
    bars.forEach(b => io.observe(b));
  })();

  /* ── 6. FAQ accordion ── */
  (function() {
    ROOT.querySelectorAll('.lp-faq-q').forEach(q => {
      q.addEventListener('click', function() {
        const item = this.closest('.lp-faq-item');
        const isOpen = item.classList.contains('open');
        ROOT.querySelectorAll('.lp-faq-item.open').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.lp-faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ── 7. Smooth scroll for anchor links ── */
  (function() {
    ROOT.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  })();

})();