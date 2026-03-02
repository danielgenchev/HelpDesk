import { supabase } from './supabase.js';

const form = document.getElementById('loginForm');
const alertContainer = document.getElementById('alertContainer');
const submitBtn = document.getElementById('submitBtn');
const demoLoginBtn = document.getElementById('demoLoginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Auto-redirect if already logged in
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) window.location.href = 'dashboard.html';
});

// Show alert message
function showAlert(message, type = 'danger') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// Main login handler
async function handleLogin(email, password) {
  alertContainer.innerHTML = '';
  submitBtn.disabled = true;
  demoLoginBtn.disabled = true;
  submitBtn.textContent = 'Signing in...';

  // Shortcut: If user enters "demo", convert to "demo@helpdesk.local"
  let finalEmail = email.trim();
  if (finalEmail.toLowerCase() === 'demo') {
    finalEmail = 'demo@helpdesk.local';
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: finalEmail,
      password: password,
    });

    if (error) {
      showAlert(error.message || 'Invalid login credentials.');
      submitBtn.disabled = false;
      demoLoginBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
      return;
    }

    // Successful login -> redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('An unexpected error occurred.');
    submitBtn.disabled = false;
    demoLoginBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}

// Listen for standard form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleLogin(emailInput.value, passwordInput.value);
});

// Listen for 1-Click Demo button
demoLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  emailInput.value = 'demo';
  passwordInput.value = 'demo123';
  handleLogin('demo', 'demo123');
});