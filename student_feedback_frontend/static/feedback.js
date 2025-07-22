// static/feedback.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", () => {
  ensureAuthenticated(); // Ensure the user is logged in

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');
  const courseName = urlParams.get('course_name');

  const courseInput = document.getElementById("course");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const feedbackForm = document.getElementById("feedbackForm");
  const messageInput = document.getElementById("message");
  const ratingSelect = document.getElementById("rating");
  const submitButton = feedbackForm.querySelector('button[type="submit"]');


  if (courseId && courseName) {
    courseInput.value = decodeURIComponent(courseName);
    courseInput.dataset.courseId = courseId; // Store course ID in a data attribute
  } else {
    courseInput.value = "Course Not Selected";
    showMessage("feedbackMessage", "No course selected for feedback. Please go back to dashboard.", true);
    // Disable form elements if no course is selected
    courseInput.disabled = true;
    messageInput.disabled = true;
    ratingSelect.disabled = true;
    submitButton.disabled = true;
  }

  // Handle feedback form submission
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedCourseId = courseInput.dataset.courseId; // Get course ID from data attribute
    const comments = messageInput.value;
    const rating = ratingSelect.value;

    if (!selectedCourseId) {
      showMessage("feedbackMessage", "Course not properly selected. Cannot submit feedback.", true);
      return;
    }
    if (!rating) {
        showMessage("feedbackMessage", "Please select a rating.", true);
        return;
    }

    try {
      const response = await fetch(`${BASE_URL}/feedback/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ course: selectedCourseId, comments: comments, rating: parseInt(rating) }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("feedbackMessage", "Feedback submitted successfully.", false);
        feedbackForm.reset();

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      } else {
        let errorMsg = data.detail || "Failed to submit feedback.";
        if (data.course) errorMsg = `Course error: ${data.course.join(", ")}`;
        else if (data.comments) errorMsg = `Comments error: ${data.comments.join(", ")}`;
        else if (data.rating) errorMsg = `Rating error: ${data.rating.join(", ")}`;
        showMessage("feedbackMessage", errorMsg, true);
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      showMessage("feedbackMessage", "An error occurred. Please try again later.", true);
    }
  });
});