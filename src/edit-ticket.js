import { supabase } from './supabase.js';
import { dictionary, getCurrentLang, setLang } from './i18n.js';
import { requireAuth } from './auth.js';

let currentUser = null;
let currentTicketId = new URLSearchParams(window.location.search).get('id');

const alertContainer = document.getElementById('alertContainer');
const editForm = document.getElementById('editTicketForm');
const loadingMessage = document.getElementById('loadingMessage');
const submitBtn = document.getElementById('submitBtn');

// i18n Dictionary for edit-ticket specific strings
const editDictionary = {
  en: {
    brand: "IT Help Desk",
    backBtn: "← Back to Dashboard",
    editTitle: "Edit Support Ticket",
    labelTitle: "Title",
    labelCategory: "Category",
    labelPriority: "Priority",
    low: "Low",
    medium: "Medium",
    high: "High",
    labelDesc: "Description",
    updateBtn: "Update Ticket",
    cancelBtn: "Cancel",
    loadingData: "Loading ticket data...",
    updating: "Updating..."
  },
  bg: {
    brand: "IT Help Desk",
    backBtn: "← Обратно",
    editTitle: "Редакция на Тикет",
    labelTitle: "Заглавие",
    labelCategory: "Категория",
    labelPriority: "Приоритет",
    low: "Нисък",
    medium: "Среден",
    high: "Висок",
    labelDesc: "Описание",
    updateBtn: "Запази Промените",
    cancelBtn: "Отказ",
    loadingData: "Зареждане на данни...",
    updating: "Запазване..."
  }
};

// Apply translations to the page
function applyTranslations() {
  const lang = getCurrentLang();
  const texts = { ...dictionary[lang], ...editDictionary[lang] };
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) el.textContent = texts[key];
  });
}

// Change language globally
window.changeLanguage = function(lang) {
  setLang(lang);
  applyTranslations();
};

// Show alert message
function showAlert(message, type = 'danger') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// Load categories from database
async function loadCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) {
    showAlert('Failed to load categories: ' + error.message);
    return;
  }

  const categorySelect = document.getElementById('category');
  if (data) {
    data.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = c.name;
      categorySelect.appendChild(option);
    });
  }
}

// Load and display ticket data
async function loadTicketData() {
  if (!currentTicketId) {
    window.location.href = 'dashboard.html';
    return;
  }

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', currentTicketId)
    .single();

  if (error || !data) {
    showAlert('Ticket not found!');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    return;
  }

  // Security: Only allow editing if user is author AND ticket status is 'open'
  if (data.status !== 'open' || data.user_id !== currentUser.id) {
    showAlert('You cannot edit this ticket.');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    return;
  }

  // Populate form with ticket data
  document.getElementById('title').value = data.title;
  document.getElementById('category').value = data.category_id;
  document.getElementById('priority').value = (data.priority || 'low').toLowerCase();
  document.getElementById('description').value = data.description;

  // Show form and hide loading message
  loadingMessage.style.display = 'none';
  editForm.style.display = 'block';
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = editDictionary[getCurrentLang()].updating;

  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        category_id: document.getElementById('category').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value
      })
      .eq('id', currentTicketId);

    if (error) throw error;

    // Redirect to ticket view on success
    window.location.href = `view-ticket.html?id=${currentTicketId}`;
  } catch (err) {
    showAlert('Error updating ticket: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = editDictionary[getCurrentLang()].updateBtn;
  }
}

// Initialize the page
async function init() {
  try {
    currentUser = await requireAuth();
    if (!currentUser) return;

    applyTranslations();
    await loadCategories();
    await loadTicketData();

    // Setup form submission
    editForm.addEventListener('submit', handleFormSubmit);
  } catch (err) {
    showAlert('An error occurred: ' + err.message);
  }
}

// Run initialization when DOM is ready
init();