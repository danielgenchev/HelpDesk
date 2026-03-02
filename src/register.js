import { supabase } from './supabase.js';

const form = document.getElementById('registerForm');
const alertContainer = document.getElementById('alertContainer');
const submitBtn = document.getElementById('submitBtn');

// Show alert message
function showAlert(message, type = 'danger') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertContainer.innerHTML = '';
  submitBtn.disabled = true;

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate passwords match
  if (password !== confirmPassword) {
    showAlert('Passwords do not match!', 'danger');
    submitBtn.disabled = false;
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      showAlert(error.message || 'Registration failed.');
      submitBtn.disabled = false;
      return;
    }

    showAlert('Registration successful! Redirecting to login...', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  } catch (err) {
    showAlert(err.message || 'Unexpected error occurred');
    submitBtn.disabled = false;
  }
});