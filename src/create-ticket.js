import { supabase } from './supabase.js';
import { translateCategory } from './i18n.js';

// i18n Dictionary
const dictionary = {
  en: {
    brand: "IT Help Desk", backBtn: "← Back to Dashboard",
    createTitle: "Create New Support Ticket", labelTitle: "Title", placeholderTitle: "Brief description of your issue",
    labelCategory: "Category", loadingCat: "Loading categories...", labelPriority: "Priority", selectPriority: "Select priority...",
    low: "Low", medium: "Medium", high: "High", labelDesc: "Description", placeholderDesc: "Provide detailed information...",
    labelAttach: "Attachment (Optional)", helpAttach: "Upload an image if needed (PNG, JPG, GIF)",
    submitBtn: "Create Ticket", cancelBtn: "Cancel", creating: "Creating..."
  },
  bg: {
    brand: "IT Help Desk", backBtn: "← Обратно към Таблото",
    createTitle: "Създай Нов Тикет", labelTitle: "Заглавие", placeholderTitle: "Кратко описание на проблема",
    labelCategory: "Категория", loadingCat: "Зареждане на категории...", labelPriority: "Приоритет", selectPriority: "Изберете приоритет...",
    low: "Нисък", medium: "Среден", high: "Висок", labelDesc: "Описание", placeholderDesc: "Предоставете подробна информация...",
    labelAttach: "Прикачен файл (По желание)", helpAttach: "Качете снимка, ако е нужно (PNG, JPG, GIF)",
    submitBtn: "Създай Тикет", cancelBtn: "Отказ", creating: "Създаване..."
  }
};

let currentLang = localStorage.getItem('lang') || 'en';
let categoriesData = [];

// Authentication check
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) window.location.href = 'login.html';
  return session;
}

// Load categories from database
async function loadCategories() {
  const { data } = await supabase.from('categories').select('*').order('name');
  if (data) {
    categoriesData = data;
    renderCategories();
  }
}

// Render categories dropdown with translations
function renderCategories() {
  const select = document.getElementById('category');
  if (categoriesData.length > 0) {
    select.innerHTML = `<option value="">${currentLang === 'bg' ? 'Изберете категория...' : 'Select a category...'}</option>`;
    categoriesData.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${translateCategory(c.name)}</option>`;
    });
  }
}

// Apply translations to the page
function applyTranslations() {
  const texts = dictionary[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (texts[el.getAttribute('data-i18n')]) {
      el.textContent = texts[el.getAttribute('data-i18n')];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    if (texts[el.getAttribute('data-i18n-placeholder')]) {
      el.placeholder = texts[el.getAttribute('data-i18n-placeholder')];
    }
  });
  document.getElementById('langLabel').textContent = currentLang === 'bg' ? '🌐 BG' : '🌐 EN';
  renderCategories();
}

// Change language
window.changeLanguage = function(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
};

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = dictionary[currentLang].creating;

  try {
    const session = await checkAuth();
    const fileInput = document.getElementById('fileUpload');
    let attachmentUrl = null;

    // Upload attachment if provided
    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const filePath = `${session.user.id}/${Date.now()}.${file.name.split('.').pop()}`;
      await supabase.storage.from('attachments').upload(filePath, file);
      attachmentUrl = supabase.storage.from('attachments').getPublicUrl(filePath).data.publicUrl;
    }

    // Insert ticket into database
    await supabase.from('tickets').insert([{
      user_id: session.user.id,
      user_email: session.user.email,
      category_id: document.getElementById('category').value,
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      priority: document.getElementById('priority').value,
      attachment_url: attachmentUrl,
      status: 'open'
    }]);

    window.location.href = 'dashboard.html';
  } catch (err) {
    alert('Error: ' + err.message);
    btn.disabled = false;
    btn.textContent = dictionary[currentLang].submitBtn;
  }
}

// Initialize the page
async function init() {
  applyTranslations();
  await checkAuth();
  await loadCategories();
  
  document.getElementById('ticketForm').addEventListener('submit', handleFormSubmit);
}

// Run initialization when DOM is ready
init();