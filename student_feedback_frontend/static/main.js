// static/main.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", () => {
    // Login form handler
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            showMessage("loginMessage", "Logging in...");

            try {
                // Step 1: Get JWT token from backend
                const tokenResponse = await fetch(`${BASE_URL}/token/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const tokenData = await tokenResponse.json();

                if (!tokenResponse.ok) {
                    showMessage("loginMessage", tokenData.detail || "Login failed.", true);
                    return; // Stop if token acquisition failed
                }

                // Save tokens
                saveToken(tokenData.access);
                localStorage.setItem("refreshToken", tokenData.refresh);

                // Step 2: Fetch user details from backend to get actual admin status
                const userDetailsResponse = await fetch(`${BASE_URL}/me/`, {
                    method: "GET",
                    headers: getAuthHeaders(), // Use the newly saved access token
                });

                const userDetailsData = await userDetailsResponse.json();

                if (userDetailsResponse.ok) {
                    // Set isAdmin status in localStorage based on backend response
                    localStorage.setItem("isAdmin", userDetailsData.is_admin ? "true" : "false");
                    showMessage("loginMessage", "Login successful.", false);

                    setTimeout(() => {
                        // Redirect based on isAdmin status
                        if (localStorage.getItem("isAdmin") === "true") {
                            window.location.href = "admin_dashboard.html";
                        } else {
                            window.location.href = "dashboard.html";
                        }
                    }, 1000); // Redirect after 1 second
                } else {
                    // If user details can't be fetched, consider it a failure and log out
                    logoutUser();
                    showMessage("loginMessage", "Failed to verify user permissions. Please try again.", true);
                }

            } catch (err) {
                console.error("Login error:", err);
                showMessage("loginMessage", "Server error. Please try again later.", true);
            }
        });
    }

    // Register form handler
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            showMessage("registerMessage", "Registering...");

            try {
                const response = await fetch(`${BASE_URL}/register/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage("registerMessage", "Registration successful. Redirecting to login...", false);
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500); // Redirect after 1.5 seconds
                } else {
                    let errorMsg = data.detail || "Registration failed.";
                    if (data.username) errorMsg = `Username: ${data.username.join(", ")}`;
                    else if (data.email) errorMsg = `Email: ${data.email.join(", ")}`;
                    else if (data.password) errorMsg = `Password: ${data.password.join(", ")}`;
                    showMessage("registerMessage", errorMsg, true);
                }
            } catch (err) {
                console.error("Registration error:", err);
                showMessage("registerMessage", "Network error. Please try again.", true);
            }
        });
    }

    // Global logout functionality (attach to all elements that match the selector and contain "Logout" text)
    const logoutLinks = document.querySelectorAll('a[href="login.html"]');
    logoutLinks.forEach(link => {
        if (link.textContent.includes('Logout')) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                logoutUser(); // Call the logout utility function
            });
        }
    });
});