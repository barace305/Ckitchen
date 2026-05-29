/* ═══════════════════════════════════════════════════════
   CB KITCHEN — ADMIN DASHBOARD JAVASCRIPT
   Mock Auth · localStorage CRUD · Search · Filter · CSV Export
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── CONSTANTS ───
  const CREDENTIALS = { username: 'admin', password: 'cbkitchen2026' };
  const STORAGE_KEYS = {
    session: 'cbk_admin_session',
    applications: 'cbk_applications',
    members: 'cbk_members',
    quotes: 'cbk_quotes',
    seeded: 'cbk_data_seeded'
  };

  // ─── DOM REFERENCES ───
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    loginScreen: $('#loginScreen'),
    loginForm: $('#loginForm'),
    loginUsername: $('#loginUsername'),
    loginPassword: $('#loginPassword'),
    loginError: $('#loginError'),
    dashboard: $('#adminDashboard'),
    sidebar: $('#sidebar'),
    sidebarOverlay: $('#sidebarOverlay'),
    hamburgerBtn: $('#hamburgerBtn'),
    logoutBtn: $('#logoutBtn'),
    // Stats
    statApplications: $('#statApplications'),
    statMembers: $('#statMembers'),
    statPending: $('#statPending'),
    statQuotes: $('#statQuotes'),
    // Dashboard tables
    recentApplicationsTable: $('#recentApplicationsTable'),
    recentQuotesTable: $('#recentQuotesTable'),
    // Application page
    applicationsTable: $('#applicationsTable'),
    appSearch: $('#appSearch'),
    appStatusFilter: $('#appStatusFilter'),
    appEmptyState: $('#appEmptyState'),
    exportApplicationsBtn: $('#exportApplicationsBtn'),
    // Members page
    membersTable: $('#membersTable'),
    memberSearch: $('#memberSearch'),
    memberEmptyState: $('#memberEmptyState'),
    exportMembersBtn: $('#exportMembersBtn'),
    // Quotes page
    quotesTable: $('#quotesTable'),
    quoteSearch: $('#quoteSearch'),
    quoteTypeFilter: $('#quoteTypeFilter'),
    quoteEmptyState: $('#quoteEmptyState'),
    exportQuotesBtn: $('#exportQuotesBtn'),
    // Modal
    detailModal: $('#detailModal'),
    modalTitle: $('#modalTitle'),
    modalBody: $('#modalBody'),
    modalFooter: $('#modalFooter'),
    modalCloseBtn: $('#modalCloseBtn'),
    // Toast
    toast: $('#toast')
  };

  // ═══════════════════════════════════════════════════════
  // SEED DATA
  // ═══════════════════════════════════════════════════════
  function seedData() {
    if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

    const applications = [
      {
        id: 'APP-001',
        date: '2026-05-15',
        firstName: 'Marcus',
        lastName: 'Reynolds',
        company: 'Reynolds Custom Builds',
        email: 'marcus@reynoldscb.com',
        phone: '(305) 555-0142',
        businessType: 'General Contractor',
        experience: '12 years',
        monthlyInvestment: '$5,000 - $10,000',
        licenseNumber: 'GC-2019-4421',
        serviceArea: 'Miami-Dade County, FL',
        description: 'Specializing in luxury kitchen and bathroom remodels for high-end residential clients. Looking to expand material sourcing network.',
        status: 'Pending'
      },
      {
        id: 'APP-002',
        date: '2026-05-12',
        firstName: 'Elena',
        lastName: 'Vasquez',
        company: 'Vasquez Interior Design',
        email: 'elena@vasquezinteriors.com',
        phone: '(212) 555-0198',
        businessType: 'Interior Designer',
        experience: '8 years',
        monthlyInvestment: '$3,000 - $5,000',
        licenseNumber: 'ID-NY-7832',
        serviceArea: 'Manhattan & Brooklyn, NY',
        description: 'High-end residential interior design firm. Focus on modern luxury kitchens with European cabinetry and premium countertops.',
        status: 'Approved'
      },
      {
        id: 'APP-003',
        date: '2026-05-10',
        firstName: 'David',
        lastName: 'Chen',
        company: 'Pacific Edge Construction',
        email: 'david@pacificedge.co',
        phone: '(415) 555-0173',
        businessType: 'General Contractor',
        experience: '15 years',
        monthlyInvestment: '$10,000 - $25,000',
        licenseNumber: 'CSLB-892341',
        serviceArea: 'San Francisco Bay Area, CA',
        description: 'Full-service renovation company handling luxury residential and boutique commercial projects. Seeking premium cabinet and fixture suppliers.',
        status: 'Approved'
      },
      {
        id: 'APP-004',
        date: '2026-05-08',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        company: 'Mitchell & Co. Renovations',
        email: 'sarah@mitchellreno.com',
        phone: '(773) 555-0156',
        businessType: 'Kitchen & Bath Specialist',
        experience: '6 years',
        monthlyInvestment: '$2,000 - $5,000',
        licenseNumber: 'IL-KB-55209',
        serviceArea: 'Chicago Metro Area, IL',
        description: 'Dedicated kitchen and bathroom renovation firm. Growing rapidly with focus on mid-to-high-end residential market.',
        status: 'Pending'
      },
      {
        id: 'APP-005',
        date: '2026-05-05',
        firstName: 'James',
        lastName: 'Whitmore',
        company: 'Whitmore Development Group',
        email: 'james@whitmoredev.com',
        phone: '(404) 555-0129',
        businessType: 'Developer / Builder',
        experience: '20 years',
        monthlyInvestment: '$25,000+',
        licenseNumber: 'GA-DB-1120',
        serviceArea: 'Atlanta Metro, GA',
        description: 'Luxury home builder constructing 15-20 custom homes per year. Need consistent supply of premium kitchen and bath fixtures.',
        status: 'Approved'
      },
      {
        id: 'APP-006',
        date: '2026-05-02',
        firstName: 'Ashley',
        lastName: 'Drummond',
        company: 'AD Studio Kitchen Design',
        email: 'ashley@adstudiokd.com',
        phone: '(310) 555-0187',
        businessType: 'Kitchen Designer',
        experience: '4 years',
        monthlyInvestment: '$1,000 - $3,000',
        licenseNumber: 'CA-KD-9021',
        serviceArea: 'Los Angeles, CA',
        description: 'Boutique kitchen design studio serving affluent Westside LA clients. Interested in exclusive European imports.',
        status: 'Denied'
      },
      {
        id: 'APP-007',
        date: '2026-04-28',
        firstName: 'Robert',
        lastName: 'Nakamura',
        company: 'Nakamura Fine Carpentry',
        email: 'robert@nakamurafc.com',
        phone: '(503) 555-0145',
        businessType: 'Cabinet Maker',
        experience: '18 years',
        monthlyInvestment: '$5,000 - $10,000',
        licenseNumber: 'OR-CM-3388',
        serviceArea: 'Portland Metro, OR',
        description: 'Custom cabinet shop building bespoke kitchen cabinetry. Seeking premium hardware, hinges, and specialty wood sources.',
        status: 'Pending'
      },
      {
        id: 'APP-008',
        date: '2026-04-25',
        firstName: 'Priya',
        lastName: 'Sharma',
        company: 'Sharma Luxury Interiors',
        email: 'priya@sharmaluxury.com',
        phone: '(832) 555-0164',
        businessType: 'Interior Designer',
        experience: '10 years',
        monthlyInvestment: '$5,000 - $10,000',
        licenseNumber: 'TX-ID-7741',
        serviceArea: 'Houston, TX',
        description: 'Full-service luxury interior design with specialisation in kitchen and living spaces. Portfolio includes multiple award-winning projects.',
        status: 'Pending'
      }
    ];

    const members = [
      {
        id: 'MEM-001',
        memberSince: '2025-11-01',
        firstName: 'Elena',
        lastName: 'Vasquez',
        company: 'Vasquez Interior Design',
        email: 'elena@vasquezinteriors.com',
        phone: '(212) 555-0198',
        tier: 'Professional',
        status: 'Active'
      },
      {
        id: 'MEM-002',
        memberSince: '2025-09-15',
        firstName: 'David',
        lastName: 'Chen',
        company: 'Pacific Edge Construction',
        email: 'david@pacificedge.co',
        phone: '(415) 555-0173',
        tier: 'Enterprise',
        status: 'Active'
      },
      {
        id: 'MEM-003',
        memberSince: '2025-08-20',
        firstName: 'James',
        lastName: 'Whitmore',
        company: 'Whitmore Development Group',
        email: 'james@whitmoredev.com',
        phone: '(404) 555-0129',
        tier: 'Enterprise',
        status: 'Active'
      },
      {
        id: 'MEM-004',
        memberSince: '2026-01-10',
        firstName: 'Nicole',
        lastName: 'Ferrara',
        company: 'Ferrara Design Co.',
        email: 'nicole@ferraradesign.com',
        phone: '(617) 555-0133',
        tier: 'Professional',
        status: 'Suspended'
      }
    ];

    const quotes = [
      {
        id: 'QTE-001',
        date: '2026-05-20',
        firstName: 'Thomas',
        lastName: 'Garcia',
        company: 'Garcia Home Builders',
        email: 'thomas@garciahb.com',
        phone: '(469) 555-0181',
        projectType: 'Kitchen Remodel',
        budget: '$75,000 - $100,000',
        timeline: '3-4 months',
        description: 'Complete luxury kitchen remodel for 4,200 sq ft estate. Italian marble countertops, custom walnut cabinetry, Sub-Zero & Wolf appliance package. Client wants a chef-grade layout with butler pantry.',
        status: 'New'
      },
      {
        id: 'QTE-002',
        date: '2026-05-18',
        firstName: 'Laura',
        lastName: 'Kingsley',
        company: 'Kingsley Renovations',
        email: 'laura@kingsleyreno.com',
        phone: '(602) 555-0152',
        projectType: 'Bathroom Remodel',
        budget: '$40,000 - $60,000',
        timeline: '6-8 weeks',
        description: 'Master bathroom renovation in Scottsdale luxury home. Heated floors, rain shower system, freestanding soaking tub, custom vanity with dual sinks.',
        status: 'Reviewed'
      },
      {
        id: 'QTE-003',
        date: '2026-05-14',
        firstName: 'Michael',
        lastName: 'O\'Brien',
        company: 'O\'Brien & Sons Construction',
        email: 'michael@obriensc.com',
        phone: '(617) 555-0174',
        projectType: 'Full Home Renovation',
        budget: '$200,000 - $350,000',
        timeline: '6-8 months',
        description: 'Complete renovation of 1920s Brookline brownstone. Three full bathrooms, chef kitchen, butler pantry, wet bar. Must preserve period details while modernising infrastructure.',
        status: 'Quoted'
      },
      {
        id: 'QTE-004',
        date: '2026-05-10',
        firstName: 'Jennifer',
        lastName: 'Park',
        company: 'Park Design Studio',
        email: 'jennifer@parkdesign.com',
        phone: '(206) 555-0193',
        projectType: 'Cabinet Installation',
        budget: '$25,000 - $40,000',
        timeline: '3-4 weeks',
        description: 'Custom cabinet installation for new construction home in Bellevue. White oak shaker cabinets with soft-close, pull-out organizers, and integrated lighting.',
        status: 'New'
      },
      {
        id: 'QTE-005',
        date: '2026-05-06',
        firstName: 'Anthony',
        lastName: 'Rossi',
        company: 'Rossi Commercial Interiors',
        email: 'anthony@rossicommercial.com',
        phone: '(702) 555-0168',
        projectType: 'Commercial Build-Out',
        budget: '$150,000 - $250,000',
        timeline: '4-5 months',
        description: 'Upscale restaurant kitchen build-out in Las Vegas. Commercial-grade stainless fixtures, custom prep stations, walk-in cooler/freezer, display kitchen for front-of-house.',
        status: 'Reviewed'
      },
      {
        id: 'QTE-006',
        date: '2026-04-29',
        firstName: 'Catherine',
        lastName: 'Wells',
        company: 'Wells & Associates',
        email: 'catherine@wellsassoc.com',
        phone: '(312) 555-0141',
        projectType: 'Kitchen Remodel',
        budget: '$50,000 - $75,000',
        timeline: '2-3 months',
        description: 'Modern minimalist kitchen remodel for Gold Coast condo. Waterfall quartz island, handleless cabinetry, integrated appliances, under-cabinet LED system.',
        status: 'Closed'
      }
    ];

    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
    localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
    localStorage.setItem(STORAGE_KEYS.seeded, 'true');
  }

  // ═══════════════════════════════════════════════════════
  // DATA HELPERS
  // ═══════════════════════════════════════════════════════
  function getData(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function statusClass(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ═══════════════════════════════════════════════════════
  // AUTHENTICATION
  // ═══════════════════════════════════════════════════════
  function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.session) === 'authenticated';
  }

  function login(username, password) {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      localStorage.setItem(STORAGE_KEYS.session, 'authenticated');
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.session);
    showLogin();
  }

  function showLogin() {
    dom.loginScreen.style.display = 'flex';
    dom.dashboard.style.display = 'none';
    dom.loginError.style.display = 'none';
    dom.loginUsername.value = '';
    dom.loginPassword.value = '';
    dom.loginUsername.focus();
  }

  function showDashboard() {
    dom.loginScreen.style.display = 'none';
    dom.dashboard.style.display = 'flex';
    navigateTo('dashboard');
  }

  // ═══════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════
  let currentPage = 'dashboard';

  function navigateTo(page) {
    currentPage = page;

    // Update nav active state
    $$('.nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Show/hide pages
    $$('.page').forEach(p => p.classList.remove('active'));
    const target = $(`#page-${page}`);
    if (target) target.classList.add('active');

    // Close mobile sidebar
    closeMobileSidebar();

    // Refresh page data
    switch (page) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'applications':
        renderApplications();
        break;
      case 'members':
        renderMembers();
        break;
      case 'quotes':
        renderQuotes();
        break;
    }
  }

  function closeMobileSidebar() {
    dom.sidebar.classList.remove('open');
    dom.sidebarOverlay.classList.remove('active');
    dom.hamburgerBtn.classList.remove('active');
  }

  // ═══════════════════════════════════════════════════════
  // DASHBOARD OVERVIEW
  // ═══════════════════════════════════════════════════════
  function renderDashboard() {
    const apps = getData(STORAGE_KEYS.applications);
    const members = getData(STORAGE_KEYS.members);
    const quotes = getData(STORAGE_KEYS.quotes);

    // Stats
    animateCounter(dom.statApplications, apps.length);
    animateCounter(dom.statMembers, members.filter(m => m.status === 'Active').length);
    animateCounter(dom.statPending, apps.filter(a => a.status === 'Pending').length);
    animateCounter(dom.statQuotes, quotes.length);

    // Recent applications (last 10)
    const recentApps = [...apps].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    dom.recentApplicationsTable.innerHTML = recentApps.length
      ? recentApps.map(a => `
          <tr>
            <td>${formatDate(a.date)}</td>
            <td>${escapeHtml(a.firstName)} ${escapeHtml(a.lastName)}</td>
            <td>${escapeHtml(a.company)}</td>
            <td>${escapeHtml(a.businessType)}</td>
            <td><span class="status-badge ${statusClass(a.status)}">${escapeHtml(a.status)}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">No applications yet</td></tr>';

    // Recent quotes (last 10)
    const recentQuotes = [...quotes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    dom.recentQuotesTable.innerHTML = recentQuotes.length
      ? recentQuotes.map(q => `
          <tr>
            <td>${formatDate(q.date)}</td>
            <td>${escapeHtml(q.firstName)} ${escapeHtml(q.lastName)}</td>
            <td>${escapeHtml(q.projectType)}</td>
            <td>${escapeHtml(q.budget)}</td>
            <td><span class="status-badge ${statusClass(q.status)}">${escapeHtml(q.status)}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">No quotes yet</td></tr>';
  }

  function animateCounter(el, target) {
    const current = parseInt(el.textContent) || 0;
    if (current === target) { el.textContent = target; return; }
    const duration = 600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(current + (target - current) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ═══════════════════════════════════════════════════════
  // APPLICATIONS
  // ═══════════════════════════════════════════════════════
  function getFilteredApplications() {
    let apps = getData(STORAGE_KEYS.applications);
    const search = (dom.appSearch.value || '').toLowerCase().trim();
    const status = dom.appStatusFilter.value;

    if (search) {
      apps = apps.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(search) ||
        (a.company || '').toLowerCase().includes(search) ||
        (a.email || '').toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      apps = apps.filter(a => a.status === status);
    }

    return apps.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function renderApplications() {
    const apps = getFilteredApplications();

    if (apps.length === 0) {
      dom.applicationsTable.innerHTML = '';
      dom.appEmptyState.style.display = 'block';
      return;
    }

    dom.appEmptyState.style.display = 'none';
    dom.applicationsTable.innerHTML = apps.map(a => `
      <tr>
        <td>${formatDate(a.date)}</td>
        <td>${escapeHtml(a.firstName)} ${escapeHtml(a.lastName)}</td>
        <td>${escapeHtml(a.company)}</td>
        <td>${escapeHtml(a.email)}</td>
        <td class="hide-mobile">${escapeHtml(a.phone)}</td>
        <td class="hide-tablet">${escapeHtml(a.businessType)}</td>
        <td class="hide-tablet">${escapeHtml(a.experience)}</td>
        <td class="hide-tablet">${escapeHtml(a.monthlyInvestment)}</td>
        <td><span class="status-badge ${statusClass(a.status)}">${escapeHtml(a.status)}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-blue" onclick="CBAdmin.viewApplication('${a.id}')">View</button>
            ${a.status === 'Pending' ? `
              <button class="btn btn-sm btn-green" onclick="CBAdmin.updateAppStatus('${a.id}', 'Approved')">Approve</button>
              <button class="btn btn-sm btn-red" onclick="CBAdmin.updateAppStatus('${a.id}', 'Denied')">Deny</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  function viewApplication(id) {
    const apps = getData(STORAGE_KEYS.applications);
    const app = apps.find(a => a.id === id);
    if (!app) return;

    dom.modalTitle.textContent = `Application — ${app.firstName} ${app.lastName}`;
    dom.modalBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Application ID</span>
          <span class="detail-value">${escapeHtml(app.id)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date Submitted</span>
          <span class="detail-value">${formatDate(app.date)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${escapeHtml(app.firstName)} ${escapeHtml(app.lastName)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Company</span>
          <span class="detail-value">${escapeHtml(app.company)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">${escapeHtml(app.email)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${escapeHtml(app.phone)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Business Type</span>
          <span class="detail-value">${escapeHtml(app.businessType)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Experience</span>
          <span class="detail-value">${escapeHtml(app.experience)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Monthly Investment</span>
          <span class="detail-value">${escapeHtml(app.monthlyInvestment)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">License Number</span>
          <span class="detail-value">${escapeHtml(app.licenseNumber)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Service Area</span>
          <span class="detail-value">${escapeHtml(app.serviceArea)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="detail-value"><span class="status-badge ${statusClass(app.status)}">${escapeHtml(app.status)}</span></span>
        </div>
        <div class="detail-item full-width">
          <span class="detail-label">Description</span>
          <span class="detail-value">${escapeHtml(app.description)}</span>
        </div>
      </div>
    `;

    dom.modalFooter.innerHTML = app.status === 'Pending'
      ? `<button class="btn btn-red" onclick="CBAdmin.updateAppStatus('${app.id}', 'Denied'); CBAdmin.closeModal();">Deny</button>
         <button class="btn btn-green" onclick="CBAdmin.updateAppStatus('${app.id}', 'Approved'); CBAdmin.closeModal();">Approve</button>`
      : `<button class="btn btn-outline" onclick="CBAdmin.closeModal();">Close</button>`;

    openModal();
  }

  function updateAppStatus(id, status) {
    const apps = getData(STORAGE_KEYS.applications);
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return;
    apps[idx].status = status;
    setData(STORAGE_KEYS.applications, apps);

    if (status === 'Approved') {
      const app = apps[idx];
      const members = getData(STORAGE_KEYS.members);
      // Check if already a member to prevent duplicates
      if (!members.some(m => m.email === app.email)) {
        const newMember = {
          id: 'MEM-' + String(members.length + 1).padStart(3, '0'),
          memberSince: new Date().toISOString().split('T')[0],
          firstName: app.firstName,
          lastName: app.lastName,
          company: app.company,
          email: app.email,
          phone: app.phone,
          tier: 'Founding Member',
          status: 'Active'
        };
        members.push(newMember);
        setData(STORAGE_KEYS.members, members);
      }
    }

    renderApplications();
    showToast(`Application ${status.toLowerCase()} successfully`, status === 'Approved' ? 'success' : 'error');
  }


  // ═══════════════════════════════════════════════════════
  // MEMBERS
  // ═══════════════════════════════════════════════════════
  function getFilteredMembers() {
    let members = getData(STORAGE_KEYS.members);
    const search = (dom.memberSearch.value || '').toLowerCase().trim();

    if (search) {
      members = members.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(search) ||
        (m.company || '').toLowerCase().includes(search) ||
        (m.email || '').toLowerCase().includes(search)
      );
    }

    return members.sort((a, b) => new Date(b.memberSince) - new Date(a.memberSince));
  }

  function renderMembers() {
    const members = getFilteredMembers();

    if (members.length === 0) {
      dom.membersTable.innerHTML = '';
      dom.memberEmptyState.style.display = 'block';
      return;
    }

    dom.memberEmptyState.style.display = 'none';
    dom.membersTable.innerHTML = members.map(m => `
      <tr>
        <td>${formatDate(m.memberSince)}</td>
        <td>${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</td>
        <td>${escapeHtml(m.company)}</td>
        <td>${escapeHtml(m.email)}</td>
        <td class="hide-mobile">${escapeHtml(m.phone)}</td>
        <td><span class="status-badge ${statusClass(m.status)}">${escapeHtml(m.status)}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-blue" onclick="CBAdmin.viewMember('${m.id}')">View</button>
            ${m.status === 'Active' ? `
              <button class="btn btn-sm btn-red" onclick="CBAdmin.updateMemberStatus('${m.id}', 'Suspended')">Suspend</button>
            ` : ''}
            ${m.status === 'Suspended' ? `
              <button class="btn btn-sm btn-green" onclick="CBAdmin.updateMemberStatus('${m.id}', 'Active')">Activate</button>
              <button class="btn btn-sm btn-red" onclick="CBAdmin.updateMemberStatus('${m.id}', 'Cancelled')">Cancel</button>
            ` : ''}
            ${m.status === 'Active' ? `
              <button class="btn btn-sm btn-outline" onclick="CBAdmin.updateMemberStatus('${m.id}', 'Cancelled')">Cancel</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  function viewMember(id) {
    const members = getData(STORAGE_KEYS.members);
    const m = members.find(x => x.id === id);
    if (!m) return;

    dom.modalTitle.textContent = `Member — ${m.firstName} ${m.lastName}`;
    dom.modalBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Member ID</span>
          <span class="detail-value">${escapeHtml(m.id)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Member Since</span>
          <span class="detail-value">${formatDate(m.memberSince)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Company</span>
          <span class="detail-value">${escapeHtml(m.company)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">${escapeHtml(m.email)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${escapeHtml(m.phone)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tier</span>
          <span class="detail-value">${escapeHtml(m.tier)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="detail-value"><span class="status-badge ${statusClass(m.status)}">${escapeHtml(m.status)}</span></span>
        </div>
      </div>
    `;

    let footerBtns = '<button class="btn btn-outline" onclick="CBAdmin.closeModal();">Close</button>';
    if (m.status === 'Active') {
      footerBtns = `<button class="btn btn-red" onclick="CBAdmin.updateMemberStatus('${m.id}', 'Suspended'); CBAdmin.closeModal();">Suspend</button>` + footerBtns;
    } else if (m.status === 'Suspended') {
      footerBtns = `<button class="btn btn-green" onclick="CBAdmin.updateMemberStatus('${m.id}', 'Active'); CBAdmin.closeModal();">Reactivate</button>` + footerBtns;
    }
    dom.modalFooter.innerHTML = footerBtns;

    openModal();
  }

  function updateMemberStatus(id, status) {
    const members = getData(STORAGE_KEYS.members);
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return;
    members[idx].status = status;
    setData(STORAGE_KEYS.members, members);
    renderMembers();
    const colorMap = { Active: 'success', Suspended: 'error', Cancelled: 'error' };
    showToast(`Member ${status.toLowerCase()} successfully`, colorMap[status] || 'info');
  }

  // ═══════════════════════════════════════════════════════
  // QUOTES
  // ═══════════════════════════════════════════════════════
  function getFilteredQuotes() {
    let quotes = getData(STORAGE_KEYS.quotes);
    const search = (dom.quoteSearch.value || '').toLowerCase().trim();
    const type = dom.quoteTypeFilter.value;

    if (search) {
      quotes = quotes.filter(q =>
        `${q.firstName} ${q.lastName}`.toLowerCase().includes(search) ||
        (q.company || '').toLowerCase().includes(search) ||
        (q.email || '').toLowerCase().includes(search)
      );
    }

    if (type !== 'all') {
      quotes = quotes.filter(q => q.projectType === type);
    }

    return quotes.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function renderQuotes() {
    const quotes = getFilteredQuotes();

    if (quotes.length === 0) {
      dom.quotesTable.innerHTML = '';
      dom.quoteEmptyState.style.display = 'block';
      return;
    }

    dom.quoteEmptyState.style.display = 'none';
    dom.quotesTable.innerHTML = quotes.map(q => `
      <tr>
        <td>${formatDate(q.date)}</td>
        <td>${escapeHtml(q.firstName)} ${escapeHtml(q.lastName)}</td>
        <td>${escapeHtml(q.company)}</td>
        <td>${escapeHtml(q.email)}</td>
        <td class="hide-mobile">${escapeHtml(q.phone)}</td>
        <td>${escapeHtml(q.projectType)}</td>
        <td class="hide-tablet">${escapeHtml(q.budget)}</td>
        <td class="hide-tablet">${escapeHtml(q.timeline)}</td>
        <td><span class="status-badge ${statusClass(q.status)}">${escapeHtml(q.status)}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-blue" onclick="CBAdmin.viewQuote('${q.id}')">View</button>
            ${q.status === 'New' ? `<button class="btn btn-sm btn-outline" onclick="CBAdmin.updateQuoteStatus('${q.id}', 'Reviewed')">Mark Reviewed</button>` : ''}
            ${q.status === 'Reviewed' ? `<button class="btn btn-sm btn-green" onclick="CBAdmin.updateQuoteStatus('${q.id}', 'Quoted')">Mark Quoted</button>` : ''}
            ${q.status === 'Quoted' ? `<button class="btn btn-sm btn-outline" onclick="CBAdmin.updateQuoteStatus('${q.id}', 'Closed')">Close</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  function viewQuote(id) {
    const quotes = getData(STORAGE_KEYS.quotes);
    const q = quotes.find(x => x.id === id);
    if (!q) return;

    dom.modalTitle.textContent = `Quote — ${q.firstName} ${q.lastName}`;
    dom.modalBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Quote ID</span>
          <span class="detail-value">${escapeHtml(q.id)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date Submitted</span>
          <span class="detail-value">${formatDate(q.date)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${escapeHtml(q.firstName)} ${escapeHtml(q.lastName)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Company</span>
          <span class="detail-value">${escapeHtml(q.company)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">${escapeHtml(q.email)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${escapeHtml(q.phone)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Project Type</span>
          <span class="detail-value">${escapeHtml(q.projectType)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Budget</span>
          <span class="detail-value">${escapeHtml(q.budget)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Timeline</span>
          <span class="detail-value">${escapeHtml(q.timeline)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="detail-value"><span class="status-badge ${statusClass(q.status)}">${escapeHtml(q.status)}</span></span>
        </div>
        <div class="detail-item full-width">
          <span class="detail-label">Project Description</span>
          <span class="detail-value">${escapeHtml(q.description)}</span>
        </div>
      </div>
    `;

    let footerHtml = '<button class="btn btn-outline" onclick="CBAdmin.closeModal();">Close</button>';
    if (q.status === 'New') {
      footerHtml = `<button class="btn btn-gold" onclick="CBAdmin.updateQuoteStatus('${q.id}', 'Reviewed'); CBAdmin.closeModal();">Mark as Reviewed</button>` + footerHtml;
    } else if (q.status === 'Reviewed') {
      footerHtml = `<button class="btn btn-green" onclick="CBAdmin.updateQuoteStatus('${q.id}', 'Quoted'); CBAdmin.closeModal();">Mark as Quoted</button>` + footerHtml;
    } else if (q.status === 'Quoted') {
      footerHtml = `<button class="btn btn-outline" onclick="CBAdmin.updateQuoteStatus('${q.id}', 'Closed'); CBAdmin.closeModal();">Close Quote</button>` + footerHtml;
    }
    dom.modalFooter.innerHTML = footerHtml;

    openModal();
  }

  function updateQuoteStatus(id, status) {
    const quotes = getData(STORAGE_KEYS.quotes);
    const idx = quotes.findIndex(q => q.id === id);
    if (idx === -1) return;
    quotes[idx].status = status;
    setData(STORAGE_KEYS.quotes, quotes);
    renderQuotes();
    showToast(`Quote marked as ${status.toLowerCase()}`, 'success');
  }

  // ═══════════════════════════════════════════════════════
  // MODAL
  // ═══════════════════════════════════════════════════════
  function openModal() {
    dom.detailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.detailModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ═══════════════════════════════════════════════════════
  // TOAST NOTIFICATION
  // ═══════════════════════════════════════════════════════
  let toastTimer = null;

  function showToast(message, type = 'info') {
    dom.toast.textContent = message;
    dom.toast.className = `toast ${type}`;
    dom.toast.style.display = 'block';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.style.display = 'none';
    }, 3000);
  }

  // ═══════════════════════════════════════════════════════
  // CSV EXPORT
  // ═══════════════════════════════════════════════════════
  function escapeCsv(val) {
    if (val == null) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function downloadCsv(filename, headers, rows) {
    const csv = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${rows.length} records to ${filename}`, 'success');
  }

  function exportApplications() {
    const apps = getFilteredApplications();
    const headers = ['Date', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Business Type', 'Experience', 'Monthly Investment', 'License', 'Service Area', 'Status'];
    const rows = apps.map(a => [
      a.date, a.firstName, a.lastName, a.company, a.email, a.phone,
      a.businessType, a.experience, a.monthlyInvestment, a.licenseNumber, a.serviceArea, a.status
    ]);
    downloadCsv('cbkitchen-applications.csv', headers, rows);
  }

  function exportMembers() {
    const members = getFilteredMembers();
    const headers = ['Member Since', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Tier', 'Status'];
    const rows = members.map(m => [
      m.memberSince, m.firstName, m.lastName, m.company, m.email, m.phone, m.tier, m.status
    ]);
    downloadCsv('cbkitchen-members.csv', headers, rows);
  }

  function exportQuotes() {
    const quotes = getFilteredQuotes();
    const headers = ['Date', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Project Type', 'Budget', 'Timeline', 'Status'];
    const rows = quotes.map(q => [
      q.date, q.firstName, q.lastName, q.company, q.email, q.phone,
      q.projectType, q.budget, q.timeline, q.status
    ]);
    downloadCsv('cbkitchen-quotes.csv', headers, rows);
  }

  // ═══════════════════════════════════════════════════════
  // EVENT BINDINGS
  // ═══════════════════════════════════════════════════════
  function initEvents() {
    // Login form
    dom.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = dom.loginUsername.value.trim();
      const pass = dom.loginPassword.value;

      if (login(user, pass)) {
        showDashboard();
      } else {
        dom.loginError.style.display = 'flex';
        dom.loginPassword.value = '';
        dom.loginPassword.focus();
      }
    });

    // Logout
    dom.logoutBtn.addEventListener('click', logout);

    // Sidebar navigation
    $$('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.dataset.page);
      });
    });

    // Dashboard "View All" links
    $$('.card-link[data-goto]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.goto);
      });
    });

    // Mobile hamburger
    dom.hamburgerBtn.addEventListener('click', () => {
      const isOpen = dom.sidebar.classList.toggle('open');
      dom.sidebarOverlay.classList.toggle('active', isOpen);
      dom.hamburgerBtn.classList.toggle('active', isOpen);
    });

    dom.sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // Application search & filter
    dom.appSearch.addEventListener('input', debounce(renderApplications, 250));
    dom.appStatusFilter.addEventListener('change', renderApplications);

    // Member search
    dom.memberSearch.addEventListener('input', debounce(renderMembers, 250));

    // Quote search & filter
    dom.quoteSearch.addEventListener('input', debounce(renderQuotes, 250));
    dom.quoteTypeFilter.addEventListener('change', renderQuotes);

    // Export buttons
    dom.exportApplicationsBtn.addEventListener('click', exportApplications);
    dom.exportMembersBtn.addEventListener('click', exportMembers);
    dom.exportQuotesBtn.addEventListener('click', exportQuotes);

    // Modal close
    dom.modalCloseBtn.addEventListener('click', closeModal);
    dom.detailModal.addEventListener('click', (e) => {
      if (e.target === dom.detailModal) closeModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (dom.detailModal.style.display !== 'none') closeModal();
      }
    });
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ═══════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════
  function init() {
    seedData();
    initEvents();

    if (isLoggedIn()) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  // Expose public API for inline onclick handlers
  window.CBAdmin = {
    viewApplication,
    updateAppStatus: updateAppStatus,
    viewMember,
    updateMemberStatus,
    viewQuote,
    updateQuoteStatus,
    closeModal
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
