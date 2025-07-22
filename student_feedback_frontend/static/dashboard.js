// static/dashboard.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", async () => {
    ensureAuthenticated(); // Ensure user is logged in

    const courseListContainer = document.getElementById("courseList");
    if (!courseListContainer) return;

    try {
        const response = await fetch(`${BASE_URL}/assigned-courses/`, {
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        courseListContainer.innerHTML = ""; // Clear existing content

        if (response.ok) {
            const assignedCourses = data.assigned_courses;

            if (assignedCourses && assignedCourses.length === 0) {
                courseListContainer.innerHTML = `<p>You are not assigned to any courses yet. Please contact your administrator.</p>`;
                return;
            }

            assignedCourses.forEach((course) => {
                const card = document.createElement("div");
                card.className = "course-card";

                card.innerHTML = `
                    <h3>${course.name}</h3>
                    <p><strong>Description:</strong> ${course.description || "N/A"}</p>
                    <a href="submit_feedback.html?course_id=${course.id}&course_name=${encodeURIComponent(course.name)}" class="btn">Give Feedback</a>
                `;
                courseListContainer.appendChild(card);
            });

        } else {
            showMessage("courseList", data.detail || "Failed to load assigned courses.", true);
        }

    } catch (error) {
        console.error("Error loading dashboard:", error);
        showMessage("courseList", "Error loading dashboard. Please try again later.", true);
    }
});