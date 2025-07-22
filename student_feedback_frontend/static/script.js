// Base API URL (adjust if your backend is running on a different port)
const BASE_URL = "http://localhost:8000/api";

// Save JWT token to localStorage
function saveToken(token) {
  localStorage.setItem("accessToken", token);
}

// Get JWT token
function getToken() {
  return localStorage.getItem("accessToken");
}

// Set Auth header for secure requests
function getAuthHeaders() {
  const token = getToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Show messages to user
function showMessage(id, msg, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "crimson" : "green";
}

// Login handler
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(`${BASE_URL}/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          saveToken(data.access);
          showMessage("loginMessage", "Login successful.");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        } else {
          showMessage("loginMessage", data.detail || "Login failed.", true);
        }
      } catch (err) {
        showMessage("loginMessage", "Server error.", true);
      }
    });
  }
});

// Register handler
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(`${BASE_URL}/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("registerMessage", "Registration successful. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        } else {
          showMessage("registerMessage", data.detail || "Registration failed.", true);
        }
      } catch (err) {
        showMessage("registerMessage", "Server error.", true);
      }
    });
  }
});
