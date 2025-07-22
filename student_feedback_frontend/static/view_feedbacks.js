// static/view_feedbacks.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", async () => {
    ensureAdmin();

    const feedbackListAdmin = document.getElementById("feedbackListAdmin");

    try {
        const response = await fetch(`${BASE_URL}/all-feedbacks/`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
            if (data.length === 0) {
                feedbackListAdmin.innerHTML = "<p>No feedback submitted yet.</p>";
            } else {
                feedbackListAdmin.innerHTML = data.map(feedback => `
                    <div class="feedback-card">
                        <h3>Course: ${feedback.course_name}</h3>
                        <p><strong>By:</strong> ${feedback.user}</p>
                        <p><strong>Rating:</strong> ${'⭐'.repeat(feedback.rating)} (${feedback.rating}/5)</p>
                        <p><strong>Comments:</strong> ${feedback.comments || "N/A"}</p>
                        <p class="timestamp">Submitted on: ${new Date(feedback.created_at).toLocaleDateString()} at ${new Date(feedback.created_at).toLocaleTimeString()}</p>
                    </div>
                `).join('');
            }
        } else {
            showMessage("feedbackListAdmin", `Failed to load feedback: ${data.detail || "Unknown error"}`, true);
        }
    } catch (error) {
        console.error("Error fetching all feedback:", error);
        showMessage("feedbackListAdmin", "An error occurred while loading feedback.", true);
    }
});