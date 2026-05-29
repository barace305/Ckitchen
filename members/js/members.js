/* ============================================================
   CB KITCHEN — MEMBER PORTAL JAVASCRIPT
   Auth gate · Dashboard logic · Catalog handlers
   ============================================================ */

(function () {
  'use strict';

  // ── Constants ───────────────────────────────────────────────
  const STORAGE_KEY  = 'cbk_member';
  const DEMO_PASS    = 'member123';
  const TOAST_MS     = 3500;

  // ── DOM Cache ───────────────────────────────────────────────
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

  const els = {
    loginGate       : null,
    dashboard       : null,
    loginForm       : null,
    emailInput      : null,
    passInput       : null,
    loginBtn        : null,
    loginError      : null,
    logoutBtn       : null,
    memberNameHeader: null,
    welcomeName     : null,
    memberSince     : null,
    memberRenewal   : null,
    catalogCards    : null,
    toast           : null,
    toastMessage    : null,
  };

  // ── Initialise ──────────────────────────────────────────────
  function init() {
    cacheDom();
    bindEvents();
    checkAuth();
  }

  function cacheDom() {
    els.loginGate        = $('#login-gate');
    els.dashboard        = $('#member-dashboard');
    els.loginForm        = $('#login-form');
    els.emailInput       = $('#login-email');
    els.passInput        = $('#login-password');
    els.loginBtn         = $('#login-btn');
    els.loginError       = $('#login-error');
    els.logoutBtn        = $('#logout-btn');
    els.memberNameHeader = $('#header-member-name');
    els.welcomeName      = $('#welcome-name');
    els.memberSince      = $('#stat-member-since');
    els.memberRenewal    = $('#stat-renewal');
    els.catalogCards     = $$('.category-card');
    els.toast            = $('#toast');
    els.toastMessage     = $('#toast-message');
  }

  // ── Auth ────────────────────────────────────────────────────
  function getMember() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function saveMember(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clearMember() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function checkAuth() {
    const member = getMember();
    if (member && member.authenticated) {
      showDashboard(member);
    } else {
      showLogin();
    }
  }

  // ── Views ───────────────────────────────────────────────────
  function showLogin() {
    els.loginGate.style.display  = 'flex';
    els.dashboard.classList.remove('active');
    document.title = 'Member Login — CB Kitchen';
  }

  function showDashboard(member) {
    els.loginGate.style.display  = 'none';
    els.dashboard.classList.add('active');
    document.title = 'Member Portal — CB Kitchen';
    populateMemberData(member);
  }

  function populateMemberData(member) {
    const firstName = extractFirstName(member.email);

    // Header name
    if (els.memberNameHeader) {
      els.memberNameHeader.innerHTML = `Welcome, <span>${firstName}</span>`;
    }

    // Welcome section
    if (els.welcomeName) {
      els.welcomeName.textContent = firstName;
    }

    // Stats
    if (els.memberSince) {
      els.memberSince.textContent = formatDate(member.joinDate);
    }

    if (els.memberRenewal) {
      els.memberRenewal.textContent = formatDate(member.renewalDate);
    }
  }

  function extractFirstName(email) {
    if (!email) return 'Member';
    const local = email.split('@')[0];
    // Take first part before any dots/underscores, capitalise
    const name = local.split(/[._\-+]/)[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric',
        year:  'numeric',
      });
    } catch { return '—'; }
  }

  // ── Login Handler ───────────────────────────────────────────
  function handleLogin(e) {
    e.preventDefault();

    const email    = els.emailInput.value.trim();
    const password = els.passInput.value;

    // Validation
    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    // Simulate auth delay for premium feel
    els.loginBtn.classList.add('loading');
    els.loginBtn.textContent = 'Authenticating...';
    hideError();

    setTimeout(() => {
      if (password === DEMO_PASS) {
        const now = new Date();
        const joinDate = new Date(now);
        joinDate.setMonth(joinDate.getMonth() - 3); // Simulate 3 months ago

        const renewalDate = new Date(now);
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);

        const member = {
          email,
          authenticated: true,
          joinDate:      joinDate.toISOString(),
          renewalDate:   renewalDate.toISOString(),
          loginTime:     now.toISOString(),
        };

        saveMember(member);
        showDashboard(member);
      } else {
        showError('Invalid credentials. Please try again.');
      }

      els.loginBtn.classList.remove('loading');
      els.loginBtn.textContent = 'Access Portal';
    }, 900);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(msg) {
    if (els.loginError) {
      els.loginError.textContent = msg;
      els.loginError.classList.add('show');
    }
  }

  function hideError() {
    if (els.loginError) {
      els.loginError.classList.remove('show');
    }
  }

  // ── Logout Handler ─────────────────────────────────────────
  function handleLogout() {
    clearMember();
    // Reset form
    if (els.loginForm)  els.loginForm.reset();
    if (els.loginError) els.loginError.classList.remove('show');
    els.loginBtn.textContent = 'Access Portal';
    showLogin();
  }

  // ── Catalog Card Handlers ──────────────────────────────────
  function handleCardClick(e) {
    const card = e.currentTarget;
    const name = card.dataset.category || 'This collection';
    const isPdf = card.dataset.type === 'pdf';

    if (isPdf) {
      showToast(`<span>${name}</span> downloads will be available soon. We're preparing your contractor pricing sheets.`);
    } else {
      showToast(`<span>${name}</span> collection is coming soon. We're curating premium selections for you.`);
    }
  }

  // ── Toast ───────────────────────────────────────────────────
  let toastTimer = null;

  function showToast(htmlMessage) {
    if (!els.toast || !els.toastMessage) return;

    // Clear any existing timer
    if (toastTimer) clearTimeout(toastTimer);

    els.toastMessage.innerHTML = htmlMessage;
    els.toast.classList.add('show');

    toastTimer = setTimeout(() => {
      els.toast.classList.remove('show');
      toastTimer = null;
    }, TOAST_MS);
  }

  // ── Bind Events ─────────────────────────────────────────────
  function bindEvents() {
    // Login form
    if (els.loginForm) {
      els.loginForm.addEventListener('submit', handleLogin);
    }

    // Logout
    if (els.logoutBtn) {
      els.logoutBtn.addEventListener('click', handleLogout);
    }

    // Catalog cards
    els.catalogCards.forEach((card) => {
      card.addEventListener('click', handleCardClick);
    });

    // Clear error on input
    [els.emailInput, els.passInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', hideError);
      }
    });
  }

  // ── Boot ────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
