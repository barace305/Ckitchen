/**
 * CB Kitchen — Checkout Module
 * Handles multi-step membership application, client-side validation, 
 * simulated Stripe payment processing, localStorage data persistence, 
 * and redirect/success confirmation.
 * Pure vanilla JS · ES6+ · No dependencies
 */

const Checkout = (() => {
  'use strict';

  // --- Regex Rules ---
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[\d\s\-\+\(\)\.]{7,20}$/;

  // --- LocalStorage Storage Keys ---
  const STORAGE_KEYS = {
    applications: 'cbk_applications'
  };

  // --- State Variables ---
  let currentStep = 1;
  let applicationData = {};

  // --- DOM References ---
  const dom = {
    step1: document.getElementById('step-1'),
    step2: document.getElementById('step-2'),
    step3: document.getElementById('step-3'),
    
    appForm: document.getElementById('application-form'),
    payForm: document.getElementById('payment-form'),
    
    stepIndicator: document.querySelector('.step-indicator'),
    stepProgress: document.getElementById('step-progress'),
    
    btnBack: document.getElementById('btn-back-application'),
    
    // Inputs Step 1
    fullName: document.getElementById('app-fullname'),
    company: document.getElementById('app-company'),
    email: document.getElementById('app-email'),
    phone: document.getElementById('app-phone'),
    location: document.getElementById('app-location'),
    businessType: document.getElementById('app-business-type'),
    experience: document.getElementById('app-experience'),
    investment: document.getElementById('app-investment'),
    description: document.getElementById('app-description'),
    
    // Inputs Step 2
    cardNumber: document.getElementById('pay-card-number'),
    cardExpiry: document.getElementById('pay-card-expiry'),
    cardCvc: document.getElementById('pay-card-cvc'),
    cardName: document.getElementById('pay-card-name'),
    cardZip: document.getElementById('pay-card-zip'),
    
    submitBtn: document.getElementById('btn-activate-membership')
  };

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const showError = (fieldId, message) => {
    const group = document.getElementById(`form-group-${fieldId}`);
    if (!group) return;

    group.classList.add('form-group--error');
    const span = group.querySelector('.form-error');
    if (span) span.textContent = message;
  };

  const clearError = (fieldId) => {
    const group = document.getElementById(`form-group-${fieldId}`);
    if (!group) return;

    group.classList.remove('form-group--error');
    const span = group.querySelector('.form-error');
    if (span) span.textContent = '';
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  /* ------------------------------------------------------------------ */
  /*  Validation Step 1                                                  */
  /* ------------------------------------------------------------------ */
  const validateStep1 = () => {
    let valid = true;

    // Full Name
    if (!dom.fullName.value.trim()) {
      showError('fullname', 'Full name is required.');
      valid = false;
    } else {
      clearError('fullname');
    }

    // Company
    if (!dom.company.value.trim()) {
      showError('company', 'Company / business name is required.');
      valid = false;
    } else {
      clearError('company');
    }

    // Email
    const emailVal = dom.email.value.trim();
    if (!emailVal) {
      showError('email', 'Email address is required.');
      valid = false;
    } else if (!EMAIL_RE.test(emailVal)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email');
    }

    // Phone
    const phoneVal = dom.phone.value.trim();
    if (!phoneVal) {
      showError('phone', 'Phone number is required.');
      valid = false;
    } else if (!PHONE_RE.test(phoneVal)) {
      showError('phone', 'Please enter a valid phone number.');
      valid = false;
    } else {
      clearError('phone');
    }

    // Business Type
    if (!dom.businessType.value) {
      showError('business-type', 'Please select your business type.');
      valid = false;
    } else {
      clearError('business-type');
    }

    return valid;
  };

  /* ------------------------------------------------------------------ */
  /*  Validation Step 2                                                  */
  /* ------------------------------------------------------------------ */
  const validateStep2 = () => {
    let valid = true;

    // Card Number
    const cardNum = dom.cardNumber.value.replace(/\s+/g, '');
    if (!cardNum) {
      showError('card-number', 'Card number is required.');
      valid = false;
    } else if (cardNum.length < 15 || cardNum.length > 16 || !/^\d+$/.test(cardNum)) {
      showError('card-number', 'Please enter a valid card number.');
      valid = false;
    } else {
      clearError('card-number');
    }

    // Card Expiration
    const cardExp = dom.cardExpiry.value.replace(/\s+/g, '');
    if (!cardExp) {
      showError('card-expiry', 'Expiration date is required.');
      valid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
      showError('card-expiry', 'Enter MM / YY format.');
      valid = false;
    } else {
      const parts = cardExp.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10) + 2000;
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (month < 1 || month > 12) {
        showError('card-expiry', 'Invalid month.');
        valid = false;
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        showError('card-expiry', 'Card is expired.');
        valid = false;
      } else {
        clearError('card-expiry');
      }
    }

    // Card CVC
    const cvc = dom.cardCvc.value.trim();
    if (!cvc) {
      showError('card-cvc', 'CVC code is required.');
      valid = false;
    } else if (cvc.length < 3 || cvc.length > 4 || !/^\d+$/.test(cvc)) {
      showError('card-cvc', 'Invalid CVC.');
      valid = false;
    } else {
      clearError('card-cvc');
    }

    // Card Name
    if (!dom.cardName.value.trim()) {
      showError('card-name', 'Name on card is required.');
      valid = false;
    } else {
      clearError('card-name');
    }

    // Card ZIP
    const zip = dom.cardZip.value.trim();
    if (!zip) {
      showError('card-zip', 'Billing ZIP Code is required.');
      valid = false;
    } else if (zip.length < 5 || zip.length > 10) {
      showError('card-zip', 'Invalid ZIP Code.');
      valid = false;
    } else {
      clearError('card-zip');
    }

    return valid;
  };

  /* ------------------------------------------------------------------ */
  /*  Step Navigation                                                   */
  /* ------------------------------------------------------------------ */
  const goToStep = (step) => {
    // Hide all steps
    dom.step1.classList.remove('checkout-step--active');
    dom.step2.classList.remove('checkout-step--active');
    dom.step3.classList.remove('checkout-step--active');

    // Show current step
    const targetStepEl = document.getElementById(`step-${step}`);
    if (targetStepEl) {
      targetStepEl.classList.add('checkout-step--active');
    }

    // Update indicator indicators
    const steps = dom.stepIndicator.querySelectorAll('.step-indicator__step');
    steps.forEach((stepEl) => {
      const stepNum = parseInt(stepEl.dataset.step, 10);
      if (stepNum < step) {
        stepEl.classList.add('completed');
        stepEl.classList.remove('active');
      } else if (stepNum === step) {
        stepEl.classList.add('active');
        stepEl.classList.remove('completed');
      } else {
        stepEl.classList.remove('active', 'completed');
      }
    });

    // Update progress bar
    if (step === 1) {
      dom.stepProgress.style.width = '0%';
    } else if (step === 2) {
      dom.stepProgress.style.width = '50%';
    } else if (step === 3) {
      dom.stepProgress.style.width = '100%';
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ------------------------------------------------------------------ */
  /*  Save Application to LocalStorage                                 */
  /* ------------------------------------------------------------------ */
  const saveApplication = () => {
    let apps = [];
    try {
      apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.applications)) || [];
    } catch (e) {
      apps = [];
    }

    // Formulate a unique ID
    const appId = 'APP-' + String(apps.length + 1).padStart(3, '0');
    const dateStr = new Date().toISOString().split('T')[0];

    // Split name into first and last name for admin portal compatibility
    const nameParts = applicationData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const monthlyInvestmentLabel = {
      'under-5k': 'Under $5,000',
      '5k-15k': '$5,000 - $15,000',
      '15k-50k': '$15,000 - $50,000',
      '50k-100k': '$50,000 - $100,000',
      '100k-plus': '$100,000+'
    }[applicationData.monthlyInvestment] || 'N/A';

    const businessTypeLabel = {
      'general-contractor': 'General Contractor',
      'kitchen-bath-remodeler': 'Kitchen/Bath Remodeler',
      'home-builder': 'Home Builder',
      'developer': 'Developer',
      'interior-designer': 'Interior Designer',
      'other': 'Other'
    }[applicationData.businessType] || 'Other';

    const experienceLabel = {
      '1-3': '1-3 years',
      '3-5': '3-5 years',
      '5-10': '5-10 years',
      '10-20': '10-20 years',
      '20+': '20+ years'
    }[applicationData.experience] || 'N/A';

    const newApp = {
      id: appId,
      date: dateStr,
      firstName: firstName,
      lastName: lastName,
      company: applicationData.company,
      email: applicationData.email,
      phone: applicationData.phone,
      businessType: businessTypeLabel,
      experience: experienceLabel,
      monthlyInvestment: monthlyInvestmentLabel,
      licenseNumber: 'N/A',
      serviceArea: applicationData.location || 'N/A',
      description: applicationData.description || 'No description provided.',
      status: 'Pending',
      cardName: dom.cardName.value.trim(),
      cardZip: dom.cardZip.value.trim()
    };

    apps.push(newApp);
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(apps));
  };

  /* ------------------------------------------------------------------ */
  /*  Event Listeners & Initialization                                 */
  /* ------------------------------------------------------------------ */
  const init = () => {
    // --- Step 1 Form Listeners ---
    dom.appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep1()) {
        // Collect form data
        applicationData = {
          fullName: dom.fullName.value,
          company: dom.company.value,
          email: dom.email.value,
          phone: dom.phone.value,
          location: dom.location.value,
          businessType: dom.businessType.value,
          experience: dom.experience.value,
          monthlyInvestment: dom.investment.value,
          description: dom.description.value
        };
        
        goToStep(2);
      }
    });

    // Clear step 1 errors on input
    const step1Inputs = [dom.fullName, dom.company, dom.email, dom.phone, dom.businessType];
    step1Inputs.forEach(input => {
      input.addEventListener('input', () => {
        const id = input.id.replace('app-', '');
        clearError(id);
      });
      input.addEventListener('change', () => {
        const id = input.id.replace('app-', '');
        clearError(id);
      });
    });

    // --- Step 2 Form Listeners ---
    // Formatting Credit Card Input
    dom.cardNumber.addEventListener('input', (e) => {
      e.target.value = formatCardNumber(e.target.value);
      clearError('card-number');
    });

    // Formatting Expiry Input
    dom.cardExpiry.addEventListener('input', (e) => {
      e.target.value = formatExpiry(e.target.value);
      clearError('card-expiry');
    });

    dom.cardCvc.addEventListener('input', () => clearError('card-cvc'));
    dom.cardName.addEventListener('input', () => clearError('card-name'));
    dom.cardZip.addEventListener('input', () => clearError('card-zip'));

    // Back Button
    dom.btnBack.addEventListener('click', () => {
      goToStep(1);
    });

    // Submit Payment Form
    dom.payForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep2()) {
        // Set button loading state
        dom.submitBtn.classList.add('btn--loading');
        dom.submitBtn.disabled = true;
        dom.btnBack.disabled = true;

        /* 
         * STRIPE INTEGRATION POINT: Load Stripe.js
         * Example: const stripe = Stripe('pk_test_...');
         * 
         * STRIPE INTEGRATION POINT: Create Stripe Elements
         * Example: const cardElement = elements.create('card');
         * 
         * STRIPE INTEGRATION POINT: Handle payment method creation & confirmation
         * Example: 
         * stripe.confirmCardPayment(clientSecret, {
         *   payment_method: {
         *     card: cardElement,
         *     billing_details: { name: cardName, address: { postal_code: cardZip } }
         *   }
         * }).then((result) => { ... });
         */

        // Simulate Stripe authentication & API call delay
        setTimeout(() => {
          // Save details to LocalStorage
          saveApplication();
          
          // Disable loading, reset buttons
          dom.submitBtn.classList.remove('btn--loading');
          dom.submitBtn.disabled = false;
          dom.btnBack.disabled = false;

          // Transition to Step 3 Confirmation
          goToStep(3);
        }, 2000);
      }
    });

    // Set Copyright Year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  return { init };
})();

// Initialize checkout when DOM is ready
document.addEventListener('DOMContentLoaded', Checkout.init);
