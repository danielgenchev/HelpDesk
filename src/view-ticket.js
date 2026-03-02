import { supabase } from './supabase.js';
import { dictionary, getCurrentLang, setLang } from './i18n.js';
import { translateCategory } from './i18n.js';
import { requireAuth } from './auth.js';

let currentUser = null;

// Get DOM elements
const alertContainer = document.getElementById('alertContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const ticketContainer = document.getElementById('ticketContainer');

// Apply translations to the page
function applyTranslations() {
  const lang = getCurrentLang();
  const texts = dictionary[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) el.textContent = texts[key];
  });
  document.getElementById('langLabel').textContent = lang === 'bg' ? '🌐 BG' : '🌐 EN';
}

// Change language globally
window.changeLanguage = function(lang) {
  setLang(lang);
  applyTranslations();
  const ticketId = getTicketIdFromUrl();
  if (ticketId && currentUser) loadTicket(ticketId);
};

// Show alert message
function showAlert(msg, type = 'danger') {
  alertContainer.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">${msg} <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

// Get ticket ID from URL parameters
function getTicketIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

// Fetch ticket data from database
async function loadTicket(ticketId) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, categories(name)')
      .eq('id', ticketId)
      .single();

    if (error) {
      loadingSpinner.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      return;
    }

    if (data) displayTicket(data);
  } catch (err) {
    showAlert('Failed to load ticket: ' + err.message);
  }
}

// Display ticket details on the page
function displayTicket(ticket) {
  loadingSpinner.style.display = 'none';
  ticketContainer.style.display = 'block';

  const t = dictionary[getCurrentLang()];
  const statusMap = { 'open': 'success', 'in progress': 'primary', 'closed': 'secondary', 'resolved': 'info' };
  const prMap = { 'low': 'info', 'medium': 'warning', 'high': 'danger' };

  // Normalize status and priority for consistent translation lookup
  const rawStatus = (ticket.status || 'open').toLowerCase().replace('-', ' ');
  const rawPriority = (ticket.priority || 'low').toLowerCase();

  const trStatus = t[`status_${rawStatus.replace(/ /g, '')}`] || rawStatus;
  const trPriority = t[`priority_${rawPriority}`] || rawPriority;

  // Translate category name if it exists
  const categoryName = ticket.categories?.name ? translateCategory(ticket.categories.name) : 'Uncategorized';

  // Build attachment HTML if present
  let attachHtml = '';
  if (ticket.attachment_url) {
    attachHtml = `<div class="mt-4"><h6>${t.lblAttach}</h6><img src="${ticket.attachment_url}" class="img-fluid mt-3 rounded" style="max-height: 400px; object-fit: cover;"></div>`;
  }

  // Build edit button HTML only if user is author AND ticket status is 'open'
  let editButtonHtml = '';
  if (ticket.user_id === currentUser.id && rawStatus === 'open') {
    editButtonHtml = `<a href="edit-ticket.html?id=${ticket.id}" class="btn btn-warning shadow-sm">✏️ ${t.editBtn}</a>`;
  }

  // Render the complete ticket view
  ticketContainer.innerHTML = `
    <div class="card shadow">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h4 class="mb-0">${String(ticket.title).replace(/</g, '&lt;')}</h4>
        <span class="badge bg-${statusMap[rawStatus] || 'secondary'} fs-6 text-capitalize">${trStatus}</span>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <p class="mb-2"><strong>${t.lblAuthor}:</strong> <span class="text-primary">${ticket.user_email || 'Unknown'}</span></p>
          </div>
          <div class="col-md-4">
            <p class="mb-2"><strong>${t.lblPriority}:</strong> <span class="badge bg-${prMap[rawPriority] || 'secondary'} text-capitalize">${trPriority}</span></p>
          </div>
          <div class="col-md-4">
            <p class="mb-2"><strong>${t.lblCategory}:</strong> <span class="badge bg-secondary">${categoryName}</span></p>
          </div>
        </div>
        <p class="text-muted"><strong>${t.lblCreated}:</strong> ${new Date(ticket.created_at).toLocaleString()}</p>
        
        <div class="bg-body-tertiary p-3 rounded mb-3">
          <h6>${t.lblDesc}</h6>
          <p class="mb-0">${String(ticket.description).replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>
        </div>
        
        ${attachHtml}
        
        <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
          <a href="dashboard.html" class="btn btn-outline-primary">${t.backBtn}</a>
          ${editButtonHtml}
        </div>
      </div>
    </div>`;
}

// Initialize the page
async function init() {
  try {
    currentUser = await requireAuth();
    if (!currentUser) return;

    applyTranslations();

    const ticketId = getTicketIdFromUrl();
    if (!ticketId) {
      showAlert('Ticket ID not found. Redirecting...', 'warning');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
      return;
    }

    await loadTicket(ticketId);
  } catch (err) {
    showAlert('An error occurred: ' + err.message);
  }
}

// Run initialization when DOM is ready
init();