import { supabase } from './supabase.js';

const actionButtons = document.getElementById('action-buttons');
const loading = document.getElementById('loading');

// Check if user is already logged in
async function checkAuth() {
  actionButtons.classList.add('d-none');
  loading.classList.remove('d-none');

  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // User is logged in, redirect to dashboard
    window.location.href = 'dashboard.html';
  } else {
    // User is not logged in, show action buttons
    loading.classList.add('d-none');
    actionButtons.classList.remove('d-none');
  }
}

// Run authentication check when page loads
checkAuth();