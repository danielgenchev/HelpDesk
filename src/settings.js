import { supabase } from './supabase.js';
import { requireAuth } from './auth.js';

const alertContainer = document.getElementById('alertContainer');
const darkModeSwitch = document.getElementById('darkModeSwitch');
const passwordForm = document.getElementById('passwordForm');
const updateBtn = document.getElementById('updateBtn');
const htmlEl = document.documentElement;

// Initialize dark mode switch state
function initDarkMode() {
  if (localStorage.getItem('theme') === 'dark') {
    darkModeSwitch.checked = true;
  }
}

// Show alert message
function showAlert(message, type = 'danger') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// Handle dark mode toggle
darkModeSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    htmlEl.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    htmlEl.removeAttribute('data-bs-theme');
    localStorage.setItem('theme', 'light');
  }
});

// Handle password update form submission
passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertContainer.innerHTML = '';

  const newPwd = document.getElementById('newPassword').value;
  const confirmPwd = document.getElementById('confirmPassword').value;

  // Validate passwords match
  if (newPwd !== confirmPwd) {
    showAlert('Passwords do not match!', 'danger');
    return;
  }

  updateBtn.disabled = true;
  updateBtn.textContent = 'Updating...';

  try {
    const { error } = await supabase.auth.updateUser({ password: newPwd });

    if (error) {
      showAlert(error.message || 'Failed to update password', 'danger');
    } else {
      showAlert('Password updated successfully!', 'success');
      passwordForm.reset();
    }
  } catch (err) {
    showAlert(err.message || 'An unexpected error occurred', 'danger');
  } finally {
    updateBtn.disabled = false;
    updateBtn.textContent = 'Update Password';
  }
});

// Initialize the page
async function init() {
  try {
    await requireAuth();
    initDarkMode();
  } catch (err) {
    showAlert('An error occurred: ' + err.message);
  }
}

// Run initialization when DOM is ready
init();