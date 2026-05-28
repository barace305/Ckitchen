/**
 * CB Kitchen — Animations Module
 * Scroll reveals, parallax, counters, navbar transitions, active nav highlighting.
 * Pure vanilla JS · ES6+ · No dependencies
 */

const Animations = (() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */
  let prefersReducedMotion = false;
  let revealObserver = null;
  let sectionObserver = null;
  let ticking = false;

  /* ------------------------------------------------------------------ */
  /*  Reduced-motion preference                                          */
  /* ------------------------------------------------------------------ */
  const checkReducedMotion = () => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;

    mq.addEventListener?.('change', (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) disableAllAnimations();
    });
  };

  /** Instantly reveal every .reveal element when motion is unwanted */
  const disableAllAnimations = () => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.transition = 'none';
      el.classList.add('active');
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Scroll-reveal (IntersectionObserver)                               */
  /* ------------------------------------------------------------------ */
  const initRevealObserver = () => {
    if (prefersReducedMotion) {
      disableAllAnimations();
      return;
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.delay, 10) || 0;

        if (delay > 0) {
          setTimeout(() => el.classList.add('active'), delay);
        } else {
          el.classList.add('active');
        }

        revealObserver.unobserve(el);
      });
    }, options);

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  };

  /* ------------------------------------------------------------------ */
  /*  Parallax hero background                                          */
  /* ------------------------------------------------------------------ */
  const handleParallax = () => {
    if (prefersReducedMotion) return;

    const heroBg = document.querySelector('.hero__bg-img');
    if (!heroBg) return;

    const hero = document.querySelector('.hero');
    const scrollY = window.scrollY;
    const heroHeight = hero?.offsetHeight || 800;

    if (scrollY <= heroHeight) {
      const translate = scrollY * 0.3;
      heroBg.style.transform = `scale(1.1) translateY(${translate}px)`;
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Counter animation                                                  */
  /* ------------------------------------------------------------------ */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target ?? el.textContent, 10);
    const duration = parseInt(el.dataset.duration, 10) || 2000;
    const suffix = el.dataset.suffix ?? '';
    const prefix = el.dataset.prefix ?? '';
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  };

  /* ------------------------------------------------------------------ */
  /*  Navbar background on scroll                                        */
  /* ------------------------------------------------------------------ */
  const handleNavbarScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Active nav-link highlighting                                       */
  /* ------------------------------------------------------------------ */
  const initActiveNavHighlight = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link, .mobile-nav__link');
    if (!sections.length || !navLinks.length) return;

    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      });
    }, options);

    sections.forEach((section) => sectionObserver.observe(section));
  };

  /* ------------------------------------------------------------------ */
  /*  Unified scroll handler (throttled via rAF)                         */
  /* ------------------------------------------------------------------ */
  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      handleNavbarScroll();
      handleParallax();
      ticking = false;
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Public init                                                        */
  /* ------------------------------------------------------------------ */
  const init = () => {
    checkReducedMotion();
    initRevealObserver();
    initCounters();
    initActiveNavHighlight();
    handleNavbarScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const destroy = () => {
    window.removeEventListener('scroll', onScroll);
    revealObserver?.disconnect();
    sectionObserver?.disconnect();
  };

  return { init, destroy };
})();
