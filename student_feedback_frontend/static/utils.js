// static/utils.js
const BASE_URL = "http://localhost:8000/api"; // Consistent URL

// Save JWT token to localStorage
function saveToken(token) {
  localStorage.setItem("accessToken", token); // Standardize on 'accessToken'
}

// Get JWT token
function getToken() {
  return localStorage.getItem("accessToken");
}

// Get refresh token
function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

// Set Auth header for secure requests
function getAuthHeaders() {
  const token = getToken();
  return token ? {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  } : {
    "Content-Type": "application/json"
  };
}

// Show messages to user
function showMessage(id, msg, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'message ' + (isError ? 'error' : 'success'); // Apply classes for styling
}

// Redirect if not authenticated
function ensureAuthenticated() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

// Redirect if not admin
function ensureAdmin() {
    ensureAuthenticated(); // Must be authenticated first
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
        // Optionally redirect to a different page or show an error
        window.location.href = "dashboard.html"; // Redirect to student dashboard if not admin
    }
}

// Logout function
function logoutUser() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin"); // Clear admin status on logout
    window.location.href = "login.html";
}