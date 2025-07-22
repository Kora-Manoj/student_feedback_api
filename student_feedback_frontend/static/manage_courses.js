// static/manage_courses.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", async () => {
    ensureAdmin();

    const courseListAdmin = document.getElementById("courseListAdmin");

    try {
        const response = await fetch(`${BASE_URL}/courses/`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
            if (data.length === 0) {
                courseListAdmin.innerHTML = "<p>No courses found.</p>";
            } else {
                courseListAdmin.innerHTML = data.map(course => `
                    <div class="course-card">
                        <h3>${course.name}</h3>
                        <p>${course.description || "No description provided."}</p>
                        </div>
                `).join('');
            }
        } else {
            showMessage("courseListAdmin", `Failed to load courses: ${data.detail || "Unknown error"}`, true);
        }
    } catch (error) {
        console.error("Error fetching admin courses:", error);
        showMessage("courseListAdmin", "An error occurred while loading courses.", true);
    }
});