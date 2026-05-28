/**
 * CB Kitchen — Form Module
 * Validation, file upload (drag & drop), submission simulation, success state.
 * Pure vanilla JS · ES6+ · No dependencies
 */

const Form = (() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Constants                                                          */
  /* ------------------------------------------------------------------ */
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
  const MAX_FILES = 5;
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
  ];
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[\d\s\-\+\(\)\.]{7,20}$/;

  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */
  let form = null;
  let fileInput = null;
  let dropZone = null;
  let fileListEl = null;
  let submitBtn = null;
  let successEl = null;
  let resetBtn = null;
  let fileList = [];

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

  const clearAllErrors = () => {
    form?.querySelectorAll('.form-group--error').forEach((g) => {
      g.classList.remove('form-group--error');
    });
    form?.querySelectorAll('.form-error').forEach((s) => {
      s.textContent = '';
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Validation                                                         */
  /* ------------------------------------------------------------------ */
  const validateForm = () => {
    let valid = true;

    // Name
    const name = document.getElementById('quote-name');
    if (!name?.value.trim()) {
      showError('name', 'Full name is required.');
      valid = false;
    }

    // Company
    const company = document.getElementById('quote-company');
    if (!company?.value.trim()) {
      showError('company', 'Company name is required.');
      valid = false;
    }

    // Phone
    const phone = document.getElementById('quote-phone');
    if (!phone?.value.trim()) {
      showError('phone', 'Phone number is required.');
      valid = false;
    } else if (!PHONE_RE.test(phone.value.trim())) {
      showError('phone', 'Please enter a valid phone number.');
      valid = false;
    }

    // Email
    const email = document.getElementById('quote-email');
    if (!email?.value.trim()) {
      showError('email', 'Email address is required.');
      valid = false;
    } else if (!EMAIL_RE.test(email.value.trim())) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    // Project Type
    const projectType = document.getElementById('quote-project-type');
    if (!projectType?.value) {
      showError('project-type', 'Please select a project type.');
      valid = false;
    }

    return valid;
  };

  /* ------------------------------------------------------------------ */
  /*  File upload                                                        */
  /* ------------------------------------------------------------------ */
  const renderFileList = () => {
    if (!fileListEl) return;

    if (!fileList.length) {
      fileListEl.innerHTML = '';
      return;
    }

    fileListEl.innerHTML = fileList
      .map(
        (file, i) => `
        <div class="file-item">
          <span class="file-item__name">${file.name}</span>
          <span class="file-item__size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
          <button type="button" class="file-item__remove" data-index="${i}" aria-label="Remove ${file.name}">&times;</button>
        </div>`
      )
      .join('');

    fileListEl.querySelectorAll('.file-item__remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        fileList.splice(idx, 1);
        renderFileList();
      });
    });
  };

  const addFiles = (incoming) => {
    const files = Array.from(incoming);

    for (const file of files) {
      if (fileList.length >= MAX_FILES) {
        showError('files', `Maximum of ${MAX_FILES} files allowed.`);
        break;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        showError('files', `"${file.name}" is not supported. Use images or PDFs.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        showError('files', `"${file.name}" exceeds the 10 MB size limit.`);
        continue;
      }

      const duplicate = fileList.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (!duplicate) {
        fileList.push(file);
      }
    }

    renderFileList();
  };

  const initFileUpload = () => {
    fileInput = document.getElementById('quote-files');
    dropZone = document.getElementById('file-upload-area');
    fileListEl = document.getElementById('file-list');

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length) addFiles(fileInput.files);
        fileInput.value = '';
      });
    }

    if (dropZone) {
      const prevent = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      ['dragenter', 'dragover'].forEach((evt) => {
        dropZone.addEventListener(evt, (e) => {
          prevent(e);
          dropZone.classList.add('file-upload--dragover');
        });
      });

      ['dragleave', 'drop'].forEach((evt) => {
        dropZone.addEventListener(evt, (e) => {
          prevent(e);
          dropZone.classList.remove('file-upload--dragover');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        prevent(e);
        const dt = e.dataTransfer;
        if (dt?.files?.length) addFiles(dt.files);
      });

      // Click on drop zone triggers file input
      dropZone.addEventListener('click', (e) => {
        if (e.target.closest('.file-item__remove')) return;
        fileInput?.click();
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Submission                                                         */
  /* ------------------------------------------------------------------ */
  const showSuccess = () => {
    form.hidden = true;
    if (successEl) {
      successEl.hidden = false;
      successEl.classList.add('quote-form__success--visible');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    clearAllErrors();

    if (!validateForm()) {
      const firstError = form.querySelector('.form-group--error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn--loading');
    }

    // Simulate async submission
    setTimeout(() => {
      showSuccess();
      fileList = [];
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--loading');
      }
    }, 2000);
  };

  /* ------------------------------------------------------------------ */
  /*  Live clear-on-focus                                                */
  /* ------------------------------------------------------------------ */
  const initLiveClear = () => {
    form?.addEventListener('focusin', (e) => {
      const field = e.target;
      if (field.matches('input, select, textarea')) {
        const group = field.closest('.form-group');
        if (group) {
          const groupId = group.id?.replace('form-group-', '');
          if (groupId) clearError(groupId);
        }
      }
    });

    form?.addEventListener('change', (e) => {
      if (e.target.matches('select')) {
        const group = e.target.closest('.form-group');
        if (group) {
          const groupId = group.id?.replace('form-group-', '');
          if (groupId) clearError(groupId);
        }
      }
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Public init                                                        */
  /* ------------------------------------------------------------------ */
  const init = () => {
    form = document.getElementById('quote-form');
    submitBtn = document.getElementById('quote-submit-btn');
    successEl = document.getElementById('form-success');
    resetBtn = document.getElementById('form-reset-btn');

    if (!form) return;

    form.addEventListener('submit', onSubmit);
    initLiveClear();
    initFileUpload();

    // Reset button in success message
    resetBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      form.hidden = false;
      if (successEl) {
        successEl.hidden = true;
        successEl.classList.remove('quote-form__success--visible');
      }
    });
  };

  const destroy = () => {
    form?.removeEventListener('submit', onSubmit);
  };

  return { init, destroy };
})();
