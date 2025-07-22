// static/admin.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", async () => {
  ensureAdmin(); // Ensure admin is authenticated

  // Fetch and display total courses for the admin dashboard
  async function loadTotalCourses() {
    try {
      const response = await fetch(`${BASE_URL}/courses/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      const totalCoursesElement = document.getElementById("totalCourses");

      if (response.ok && Array.isArray(data)) {
        totalCoursesElement.textContent = data.length;
      } else {
        totalCoursesElement.textContent = "N/A";
        console.error("Failed to load total courses for admin stats:", data.detail || "Unknown error");
      }

    } catch (err) {
      console.error("Error fetching total courses for admin:", err);
      document.getElementById("totalCourses").textContent = "Error";
    }
  }

  // Fetch and display total students (users)
  async function loadTotalStudents() {
      try {
          // Assuming you have an API endpoint to list all users (e.g., /api/users/)
          // You might need to implement a UserViewSet in your backend for this if not already present.
          const response = await fetch(`${BASE_URL}/users/`, {
              method: "GET",
              headers: getAuthHeaders(),
          });
          const data = await response.json();
          if (response.ok && Array.isArray(data)) {
              document.getElementById("totalStudents").textContent = data.length;
          } else {
              document.getElementById("totalStudents").textContent = "N/A";
              console.error("Failed to load total students:", data.detail || "Unknown error");
          }
      } catch (err) {
          console.error("Error fetching total students:", err);
          document.getElementById("totalStudents").textContent = "Error";
      }
  }

  // Fetch and display total feedback
  async function loadTotalFeedback() {
      try {
          const response = await fetch(`${BASE_URL}/all-feedbacks/`, {
              method: "GET",
              headers: getAuthHeaders(),
          });
          const data = await response.json();
          if (response.ok && Array.isArray(data)) {
              document.getElementById("totalFeedback").textContent = data.length;
          } else {
              document.getElementById("totalFeedback").textContent = "N/A";
              console.error("Failed to load total feedback:", data.detail || "Unknown error");
          }
      } catch (err) {
          console.error("Error fetching total feedback:", err);
          document.getElementById("totalFeedback").textContent = "Error";
      }
  }

  // Load all stats on page load
  loadTotalCourses();
  loadTotalStudents();
  loadTotalFeedback();
});