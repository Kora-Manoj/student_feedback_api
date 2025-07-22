// static/add_course.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", () => {
  ensureAdmin(); // Ensure admin is authenticated

  // Handle form submission to add a new course
  document.getElementById("addCourseForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("courseName").value;
    const description = document.getElementById("description").value;
    const msgBox = document.getElementById("courseMessage");
    showMessage("courseMessage", "Adding course...");

    try {
      const response = await fetch(`${BASE_URL}/courses/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("courseMessage", "Course added successfully.", false);
        document.getElementById("addCourseForm").reset();
      } else {
        let errorMsg = data.detail || "Could not add course.";
        if (data.name) errorMsg = `Name error: ${data.name.join(", ")}`;
        else if (data.description) errorMsg = `Description error: ${data.description.join(", ")}`;
        showMessage("courseMessage", errorMsg, true);
      }

    } catch (error) {
      console.error("Add Course error:", error);
      showMessage("courseMessage", "An error occurred. Please try again.", true);
    }
  });
});