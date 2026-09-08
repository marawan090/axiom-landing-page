// Axiom Research AI - Waitlist Application & Dual-Email Intake Handler

// State
let lastSubmission = null;

// Anti-Disposable Email List
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'tempmail.net', '10minutemail.com', '10minutemail.net',
  'mailinator.com', 'guerrillamail.com', 'guerrillamailblock.com', 'guerrillamail.net', 'guerrillamail.biz', 'guerrillamail.org',
  'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'trashmail.org', 'sharklasers.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'dispostable.com', 'getnada.com',
  'fakemailgenerator.com', 'mohmal.com', 'burnermail.io', 'crazymailing.com',
  'generator.email', 'inboxkitten.com', 'dropmail.me', 'byom.de', 'mytemp.email',
  'emailondeck.com', 'temp-mail.io', 'tmpmail.org', 'disposablemail.com'
]);

function isDisposableDomain(domain) {
  if (!domain) return false;
  const dom = domain.toLowerCase().trim();
  if (DISPOSABLE_EMAIL_DOMAINS.has(dom)) return true;
  const disposableKeywords = ['tempmail', '10minute', 'throwaway', 'dispostable', 'mailinator', 'guerrillamail', 'trashmail', 'fakemail', 'burnermail', 'temp-mail'];
  return disposableKeywords.some(kw => dom.includes(kw));
}

function isAcademicDomain(domain) {
  if (!domain) return false;
  const dom = domain.toLowerCase().trim();
  // Matches .edu, .ac.uk, .ac.in, .ac.jp, .edu.au, .edu.eg, etc.
  if (/\.(edu|ac\.[a-z]{2,3}|edu\.[a-z]{2,3})$/i.test(dom)) return true;
  if (dom.endsWith('.edu')) return true;
  // Recognized university / research institutes
  const academicInstitutes = ['inria.fr', 'cern.ch', 'mpg.de', 'cnrs.fr', 'fraunhofer.de', 'ethz.ch', 'epfl.ch'];
  return academicInstitutes.some(inst => dom === inst || dom.endsWith('.' + inst));
}

function isValidEmailStructure(email) {
  // Standard RFC regex pattern matching
  const rfcRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return rfcRegex.test(email);
}

// Real-time Academic Email Input Handler
function handleEmailInput(input) {
  const email = input.value.trim();
  const badge = document.getElementById('email-validation-badge');
  if (!badge) return;

  if (!email || !email.includes('@')) {
    badge.classList.add('hidden');
    badge.textContent = '';
    input.classList.remove('border-red-500', 'border-emerald-500/60');
    input.classList.add('border-slate-700');
    return;
  }

  const parts = email.split('@');
  const domain = parts[1] || '';

  if (!isValidEmailStructure(email) || !domain.includes('.')) {
    badge.classList.add('hidden');
    input.classList.remove('border-red-500', 'border-emerald-500/60');
    input.classList.add('border-slate-700');
    return;
  }

  if (isDisposableDomain(domain)) {
    badge.className = 'text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300';
    badge.textContent = '✕ Disposable Email Blocked';
    badge.classList.remove('hidden');
    input.classList.remove('border-slate-700', 'border-emerald-500/60');
    input.classList.add('border-red-500');
    return;
  }

  input.classList.remove('border-red-500');

  if (isAcademicDomain(domain)) {
    badge.className = 'text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
    badge.textContent = '✓ Academic / Verified Institution';
    badge.classList.remove('hidden');
    input.classList.remove('border-slate-700');
    input.classList.add('border-emerald-500/60');
  } else {
    badge.className = 'text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300';
    badge.textContent = 'Standard Researcher Access';
    badge.classList.remove('hidden');
    input.classList.remove('border-emerald-500/60');
    input.classList.add('border-slate-700');
  }
}

// Real-time Delivery Email Input Handler
function handleDeliveryEmailInput(input) {
  const email = input.value.trim();
  const badge = document.getElementById('delivery-email-validation-badge');
  if (!badge) return;

  if (!email || !email.includes('@')) {
    badge.classList.add('hidden');
    badge.textContent = '';
    input.classList.remove('border-red-500', 'border-emerald-500/60');
    input.classList.add('border-slate-700');
    return;
  }

  const parts = email.split('@');
  const domain = parts[1] || '';

  if (!isValidEmailStructure(email) || !domain.includes('.')) {
    badge.classList.add('hidden');
    input.classList.remove('border-red-500', 'border-emerald-500/60');
    input.classList.add('border-slate-700');
    return;
  }

  if (isDisposableDomain(domain)) {
    badge.className = 'text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300';
    badge.textContent = '✕ Disposable Email Blocked';
    badge.classList.remove('hidden');
    input.classList.remove('border-slate-700', 'border-emerald-500/60');
    input.classList.add('border-red-500');
    return;
  }

  badge.className = 'text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
  badge.textContent = '✓ Valid Delivery Destination';
  badge.classList.remove('hidden');
  input.classList.remove('border-red-500', 'border-slate-700');
  input.classList.add('border-emerald-500/60');
}

// Cohort Capacity Counter (Safeguard)
function updateCapacityProgress(claimed = 0) {
  const progressBar = document.getElementById('cohort-progress-bar');
  if (progressBar) {
    const currentClaimed = Number(claimed) || 0;
    const percentage = Math.min(100, Math.round((currentClaimed / 80) * 100));
    progressBar.style.width = `${percentage}%`;
  }
  const textElem = document.getElementById('cohort-progress-text');
  if (textElem) {
    textElem.textContent = `Spots Claimed: ${claimed}`;
  }
  const remainingElem = document.getElementById('cohort-remaining-text');
  if (remainingElem) {
    remainingElem.textContent = `Seats Remaining: ${claimed}`;
  }
}

// Modal Controls
function openWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  if (!modal) return;
  modal.classList.remove('opacity-0', 'pointer-events-none');
  const modalBox = modal.querySelector('.glass-modal');
  if (modalBox) modalBox.classList.remove('scale-95');
  document.body.classList.add('overflow-hidden');

  const b1 = document.getElementById('email-validation-badge');
  const b2 = document.getElementById('delivery-email-validation-badge');
  const academicInput = document.getElementById('academicEmail');
  const deliveryInput = document.getElementById('primary-delivery-email');
  if (b1 && academicInput && !academicInput.value.trim()) b1.classList.add('hidden');
  if (b2 && deliveryInput && !deliveryInput.value.trim()) b2.classList.add('hidden');

  // Auto focus first input
  setTimeout(() => {
    const input = document.getElementById('fullName');
    if (input) input.focus();
  }, 100);
}

function closeWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  if (!modal) return;
  modal.classList.add('opacity-0', 'pointer-events-none');
  const modalBox = modal.querySelector('.glass-modal');
  if (modalBox) modalBox.classList.add('scale-95');
  document.body.classList.remove('overflow-hidden');
}

// Reset Form and Return to Overview
function resetAndCloseWaitlistModal() {
  closeWaitlistModal();
  setTimeout(() => {
    const form = document.getElementById('waitlist-form');
    if (form) form.reset();
    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('waitlist-success-view') || document.getElementById('modal-success-view');
    if (formView) formView.classList.remove('hidden');
    if (successView) successView.classList.add('hidden');
    
    const b1 = document.getElementById('email-validation-badge');
    const b2 = document.getElementById('delivery-email-validation-badge');
    if (b1) b1.classList.add('hidden');
    if (b2) b2.classList.add('hidden');
    
    const errAlert = document.getElementById('form-error-alert');
    if (errAlert) {
      errAlert.classList.add('hidden');
      errAlert.textContent = '';
    }
  }, 350);
}

// Escape Key Listener to close modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWaitlistModal();
  }
});

// Domain change handler
function handleDomainChange(selectElem) {
  const otherContainer = document.getElementById('domain-other-container');
  const otherInput = document.getElementById('researchDomainOther');
  if (!otherContainer || !otherInput) return;
  if (selectElem.value === 'Other') {
    otherContainer.classList.remove('hidden');
    otherInput.required = true;
    otherInput.focus();
  } else {
    otherContainer.classList.add('hidden');
    otherInput.required = false;
  }
}

// Char count update
function updateCharCount(textarea) {
  const counter = document.getElementById('char-count');
  if (!counter) return;
  const length = textarea.value.trim().length;
  if (length < 20) {
    counter.textContent = `${length}/20 min chars required`;
    counter.className = 'text-[11px] font-mono text-amber-400';
  } else {
    counter.textContent = `${length} characters (Good technical depth)`;
    counter.className = 'text-[11px] font-mono text-emerald-400';
  }
}

// Handle Form Submit
async function handleWaitlistSubmit(e) {
  e.preventDefault();
  
  const errorAlert = document.getElementById('form-error-alert');
  if (errorAlert) {
    errorAlert.classList.add('hidden');
    errorAlert.textContent = '';
  }

  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitSpinner = document.getElementById('submit-spinner');

  // Extract Form Values
  const fullName = document.getElementById('fullName')?.value.trim() || '';
  const academicEmail = document.getElementById('academicEmail')?.value.trim() || '';
  const delivery_email = document.getElementById('primary-delivery-email')?.value.trim() || '';
  const academicRole = document.getElementById('academicRole')?.value || '';
  const researchDomainSelect = document.getElementById('researchDomain')?.value || '';
  const researchDomainOther = document.getElementById('researchDomainOther')?.value.trim() || '';
  const researchDomain = researchDomainSelect === 'Other' ? (researchDomainOther || 'Other') : researchDomainSelect;
  const researchQuestion = document.getElementById('researchQuestion')?.value.trim() || '';
  const feedbackSession = document.querySelector('input[name="feedbackSession"]:checked')?.value === 'yes';

  // Validation check: Required fields
  if (!fullName || !academicEmail || !delivery_email || !academicRole || !researchDomain || !researchQuestion) {
    if (errorAlert) {
      errorAlert.textContent = 'Please fill out all required academic screening fields.';
      errorAlert.classList.remove('hidden');
    }
    return;
  }

  // 1. Validate Academic Email
  const academicEmailInput = document.getElementById('academicEmail');
  const academicDomain = academicEmail.split('@')[1] || '';
  if (!isValidEmailStructure(academicEmail) || isDisposableDomain(academicDomain)) {
    if (errorAlert) {
      errorAlert.textContent = 'Please enter a valid institution or work email address.';
      errorAlert.classList.remove('hidden');
    }
    if (academicEmailInput) academicEmailInput.focus();
    return;
  }

  // 2. Validate Primary Delivery Email
  const deliveryEmailInput = document.getElementById('primary-delivery-email');
  const deliveryDomain = delivery_email.split('@')[1] || '';
  if (!isValidEmailStructure(delivery_email)) {
    if (errorAlert) {
      errorAlert.textContent = 'Please enter a valid personal or delivery email address.';
      errorAlert.classList.remove('hidden');
    }
    if (deliveryEmailInput) deliveryEmailInput.focus();
    return;
  }
  if (isDisposableDomain(deliveryDomain)) {
    if (errorAlert) {
      errorAlert.textContent = 'Disposable email addresses are not permitted. Please enter a valid delivery email.';
      errorAlert.classList.remove('hidden');
    }
    if (deliveryEmailInput) deliveryEmailInput.focus();
    return;
  }

  // Length check on research problem
  if (researchQuestion.length < 20) {
    if (errorAlert) {
      errorAlert.textContent = 'Please provide a descriptive research question or thesis problem (at least 20 characters).';
      errorAlert.classList.remove('hidden');
    }
    return;
  }

  // Generate Reference Code
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const trackingCode = `AXIOM-C1-${randNum}`;

  const payload = {
    application_id: trackingCode,
    full_name: fullName,
    email: academicEmail,
    delivery_email: delivery_email,
    academic_level: academicRole,
    research_domain: researchDomain,
    research_problem: researchQuestion,
    feedback_session: feedbackSession,
    submitted_at: new Date().toISOString()
  };

  // Set Loading State
  if (submitBtn) submitBtn.disabled = true;
  if (submitBtnText) submitBtnText.textContent = 'Submitting Application...';
  if (submitSpinner) submitSpinner.classList.remove('hidden');

  try {
    // Dispatch POST request to backend /api/waitlist endpoint
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || 'Server could not process submission.');
      }
    } catch (networkErr) {
      // If running as a purely static preview (file:// protocol), warn and continue with local receipt
      if (window.location.protocol === 'file:') {
        console.warn('Running in static file preview mode:', networkErr);
      } else {
        throw networkErr;
      }
    }

    lastSubmission = payload;

    // Artificial smooth transition delay
    await new Promise(r => setTimeout(r, 450));

    // Update receipt data in success view
    const receiptId = document.getElementById('receipt-id');
    const receiptName = document.getElementById('receipt-name');
    const receiptEmail = document.getElementById('receipt-email');
    const receiptDelivery = document.getElementById('receipt-delivery-email');
    if (receiptId) receiptId.textContent = payload.application_id;
    if (receiptName) receiptName.textContent = payload.full_name;
    if (receiptEmail) receiptEmail.textContent = payload.email;
    if (receiptDelivery) receiptDelivery.textContent = payload.delivery_email;

    // Smooth transition: hide form view, show confirmation screen
    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('waitlist-success-view') || document.getElementById('modal-success-view');
    if (formView) formView.classList.add('hidden');
    if (successView) successView.classList.remove('hidden');
  } catch (err) {
    if (errorAlert) {
      errorAlert.textContent = err.message || 'An unexpected error occurred while transmitting. Please try again.';
      errorAlert.classList.remove('hidden');
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (submitBtnText) submitBtnText.textContent = 'Submit Application';
    if (submitSpinner) submitSpinner.classList.add('hidden');
  }
}

// Copy Receipt ID
function copyReceiptId() {
  if (!lastSubmission) return;
  navigator.clipboard.writeText(lastSubmission.application_id);
  const btn = document.getElementById('btn-copy-receipt');
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="text-emerald-400">✓ Copied!</span>`;
  setTimeout(() => { btn.innerHTML = orig; }, 2000);
}

// Download Receipt JSON
function downloadReceiptJSON() {
  if (!lastSubmission) return;
  const blob = new Blob([JSON.stringify(lastSubmission, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${lastSubmission.application_id}_receipt.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Interactive Preview Tabs
function switchPreviewTab(tabId) {
  const tabs = ['synthesis', 'diagram', 'pipeline_view', 'notebooklm'];
  tabs.forEach(t => {
    const content = document.getElementById(`tab-content-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (!content || !btn) return;
    if (t === tabId) {
      content.classList.remove('hidden');
      btn.className = 'px-2.5 py-1 rounded bg-brand-600 text-white font-medium transition-colors whitespace-nowrap';
    } else {
      content.classList.add('hidden');
      btn.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap';
    }
  });
}
