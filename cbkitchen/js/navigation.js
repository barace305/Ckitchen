/**
 * CB Kitchen — Navigation Module
 * Mobile menu toggle, smooth scroll, keyboard handling, click-outside close.
 * Pure vanilla JS · ES6+ · No dependencies
 */

const Navigation = (() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Cached DOM references                                              */
  /* ------------------------------------------------------------------ */
  let header = null;
  let hamburger = null;
  let mobileNav = null;
  let navLinks = null;
  let body = null;
  let savedScrollY = 0;

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const isMenuOpen = () => body?.classList.contains('nav-open');

  /** Lock body scroll (preserve current scroll position) */
  const lockScroll = () => {
    savedScrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  };

  /** Unlock body scroll and restore position */
  const unlockScroll = () => {
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  };

  /* ------------------------------------------------------------------ */
  /*  Open / Close                                                       */
  /* ------------------------------------------------------------------ */
  const openMenu = () => {
    body.classList.add('nav-open');
    header?.classList.add('nav-open');
    hamburger?.classList.add('hamburger--active');
    hamburger?.setAttribute('aria-expanded', 'true');
    mobileNav?.setAttribute('aria-hidden', 'false');
    lockScroll();
  };

  const closeMenu = () => {
    body.classList.remove('nav-open');
    header?.classList.remove('nav-open');
    hamburger?.classList.remove('hamburger--active');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileNav?.setAttribute('aria-hidden', 'true');
    unlockScroll();
  };

  const toggleMenu = () => {
    isMenuOpen() ? closeMenu() : openMenu();
  };

  /* ------------------------------------------------------------------ */
  /*  Smooth scroll to section                                           */
  /* ------------------------------------------------------------------ */
  const scrollToSection = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;

    const headerOffset = header?.offsetHeight ?? 80;
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Event handlers                                                     */
  /* ------------------------------------------------------------------ */

  /** Hamburger click */
  const onHamburgerClick = (e) => {
    e.stopPropagation();
    toggleMenu();
  };

  /** Nav link click — close menu & smooth scroll */
  const onNavLinkClick = (e) => {
    const link = e.currentTarget;
    const hash = link.getAttribute('href');

    if (hash?.startsWith('#')) {
      e.preventDefault();

      if (isMenuOpen()) {
        closeMenu();
        requestAnimationFrame(() => scrollToSection(hash));
      } else {
        scrollToSection(hash);
      }
    }
  };

  /** Escape key */
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      hamburger?.focus();
    }
  };

  /** Click outside the nav */
  const onClickOutside = (e) => {
    if (!isMenuOpen()) return;

    const clickedInsideMobileNav = mobileNav?.contains(e.target);
    const clickedHamburger = hamburger?.contains(e.target);

    if (!clickedInsideMobileNav && !clickedHamburger) {
      closeMenu();
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Public init                                                        */
  /* ------------------------------------------------------------------ */
  const init = () => {
    body = document.body;
    header = document.getElementById('header');
    hamburger = document.getElementById('hamburger');
    mobileNav = document.getElementById('mobile-nav');

    // Collect all nav links (desktop + mobile + CTA buttons that link to sections)
    navLinks = document.querySelectorAll(
      '.header__nav-link, .mobile-nav__link, .header__cta, .mobile-nav__cta'
    );

    // Hamburger toggle
    hamburger?.addEventListener('click', onHamburgerClick);

    // Nav-link clicks (smooth scroll + menu close)
    navLinks?.forEach((link) => link.addEventListener('click', onNavLinkClick));

    // Also handle any in-page anchor links (hero buttons, membership CTA, etc.)
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', onNavLinkClick);
    });

    // Keyboard (Escape)
    document.addEventListener('keydown', onKeyDown);

    // Click outside
    document.addEventListener('click', onClickOutside);
  };

  const destroy = () => {
    hamburger?.removeEventListener('click', onHamburgerClick);
    navLinks?.forEach((link) => link.removeEventListener('click', onNavLinkClick));
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onClickOutside);
  };

  return { init, destroy };
})();
