import { requireAuth, logoutUser, isAdmin } from './auth.js';
import { getTickets, updateTicketStatus } from './api.js';
import { dictionary, getCurrentLang, setLang } from './i18n.js';

let currentUser = null;
let userIsAdmin = false;

const alertContainer = document.getElementById('alertContainer');
const ticketTableCard = document.getElementById('ticketTableCard');
const ticketTbody = document.getElementById('ticket-table-body');
const noTicketsEl = document.getElementById('noTickets');

// Apply translations to the page
function applyTranslations() {
  const lang = getCurrentLang();
  const texts = dictionary[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) el.textContent = texts[key];
  });
  document.getElementById('langLabel').textContent = lang === 'bg' ? '🌐 BG' : '🌐 EN';
  if (currentUser) {
    document.getElementById('dashboardTitle').textContent = userIsAdmin ? texts.allTicketsTitle : texts.myTicketsTitle;
  }
}

// Change language globally
window.changeLanguage = function(lang) {
  setLang(lang);
  applyTranslations();
  if (currentUser) renderTickets();
};

// Show alert message
function showAlert(msg, type = 'danger') {
  alertContainer.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">${msg} <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

// Get status badge HTML
function getStatusBadge(status) {
  const map = { 'open': 'success', 'in-progress': 'primary', 'in progress': 'primary', 'closed': 'secondary', 'resolved': 'info' };
  const lang = getCurrentLang();
  const trStatus = dictionary[lang][`status_${status.replace('-', '').replace(' ', '')}`] || status;
  return `<span class="badge bg-${map[status] || 'secondary'} text-capitalize">${trStatus}</span>`;
}

// Get priority badge HTML
function getPriorityBadge(priority) {
  const map = { 'low': 'info', 'medium': 'warning', 'high': 'danger' };
  const trPriority = dictionary[getCurrentLang()][`priority_${priority}`] || priority;
  return `<span class="badge bg-${map[priority] || 'secondary'} text-capitalize">${trPriority}</span>`;
}

// Render tickets table
async function renderTickets() {
  ticketTbody.innerHTML = '';
  noTicketsEl.classList.add('d-none');
  
  try {
    const tickets = await getTickets(currentUser, userIsAdmin);

    if (!tickets || tickets.length === 0) {
      ticketTableCard.classList.add('d-none');
      noTicketsEl.classList.remove('d-none');
      return;
    }

    ticketTableCard.classList.remove('d-none');
    const t = dictionary[getCurrentLang()];

    for (const ticket of tickets) {
      const tr = document.createElement('tr');
      const dateText = ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '';
      const authorEmail = ticket.user_email || 'Unknown';

      // Status dropdown for admins, badge for regular users
      let statusHtml = userIsAdmin ? `
          <select class="form-select form-select-sm status-dropdown" data-id="${ticket.id}" style="width: 140px; cursor: pointer;">
            <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>${t.status_open}</option>
            <option value="in progress" ${ticket.status === 'in progress' || ticket.status === 'in-progress' ? 'selected' : ''}>${t.status_inprogress}</option>
            <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>${t.status_resolved}</option>
            <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>${t.status_closed}</option>
          </select>` : getStatusBadge(ticket.status);

      tr.innerHTML = `
        <td class="ps-4 fw-medium">${String(ticket.title).replace(/</g, '&lt;')}</td>
        <td><span class="text-muted small">${authorEmail}</span></td>
        <td>${getPriorityBadge(ticket.priority)}</td>
        <td>${statusHtml}</td>
        <td class="text-muted small">${dateText}</td>
        <td class="text-end pe-4">
          <a class="btn btn-sm btn-outline-primary" href="view-ticket.html?id=${ticket.id}">${t.viewBtn}</a>
        </td>
      `;
      ticketTbody.appendChild(tr);
    }

    // Add event listeners for admin status dropdowns
    if (userIsAdmin) {
      document.querySelectorAll('.status-dropdown').forEach(select => {
        select.addEventListener('change', async (e) => {
          const ticketId = e.target.getAttribute('data-id');
          const newStatus = e.target.value;
          e.target.disabled = true;
          
          try {
            await updateTicketStatus(ticketId, newStatus);
          } catch (err) {
            showAlert('Failed to update status: ' + err.message);
          }
          
          e.target.disabled = false;
        });
      });
    }
  } catch (error) {
    showAlert('Failed to load tickets: ' + error.message);
  }
}

// Initialize the dashboard
async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;
  
  userIsAdmin = isAdmin(currentUser);
  document.getElementById('userEmail').textContent = currentUser.email || '';
  
  applyTranslations();
  await renderTickets();
  
  // Setup event listeners
  document.getElementById('logoutBtn').addEventListener('click', logoutUser);
}

// Run initialization when DOM is ready
init();