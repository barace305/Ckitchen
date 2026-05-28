/**
 * CB Kitchen — Main Entry Point
 * Bootstraps animations, navigation, form modules.
 * Lazy loading, copyright year, gold cursor effect.
 * Pure vanilla JS · ES6+ · No dependencies
 */

(() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Boot log                                                           */
  /* ------------------------------------------------------------------ */
  console.log(
    '%cCB Kitchen — Custom Built Kitchen | Private Luxury Contractor Network',
    'color:#c9a96e;font-weight:bold;font-size:14px;'
  );

  /* ------------------------------------------------------------------ */
  /*  Page-load animation class                                          */
  /* ------------------------------------------------------------------ */
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    });
  });

  /* ------------------------------------------------------------------ */
  /*  DOMContentLoaded — initialise everything                           */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    // Smooth-scroll polyfill check
    if (!('scrollBehavior' in document.documentElement.style)) {
      console.info(
        'CB Kitchen: native smooth-scroll not supported — consider a polyfill.'
      );
    }

    // --- Core modules ---
    Animations.init();
    Navigation.init();
    Form.init();

    // --- Lazy-load images ---
    initLazyImages();

    // --- Copyright year ---
    updateCopyrightYear();

    // --- Gold cursor (desktop only, hero section) ---
    initGoldCursor();
  });

  /* ================================================================== */
  /*  Lazy-load images                                                   */
  /* ================================================================== */
  const initLazyImages = () => {
    const lazyImages = document.querySelectorAll('img.lazy');
    if (!lazyImages.length) return;

    const loadImage = (img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.remove('lazy');
      img.classList.add('lazy--loaded');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            loadImage(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '200px 0px' }
      );

      lazyImages.forEach((img) => observer.observe(img));
    } else {
      lazyImages.forEach(loadImage);
    }
  };

  /* ================================================================== */
  /*  Copyright year auto-update                                         */
  /* ================================================================== */
  const updateCopyrightYear = () => {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  };

  /* ================================================================== */
  /*  Gold cursor effect (hero section only, desktop)                    */
  /* ================================================================== */
  const initGoldCursor = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    Object.assign(dot.style, {
      position: 'fixed',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(201,169,110,0.6) 0%, rgba(201,169,110,0) 70%)',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'opacity 0.3s ease',
      opacity: '0',
      mixBlendMode: 'screen',
    });
    document.body.appendChild(dot);

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let animating = false;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      dotX = lerp(dotX, mouseX, 0.15);
      dotY = lerp(dotY, mouseY, 0.15);
      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;

      if (animating) requestAnimationFrame(animate);
    };

    hero.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      animating = true;
      requestAnimationFrame(animate);
    });

    hero.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      animating = false;
    });

    hero.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  };
})();
