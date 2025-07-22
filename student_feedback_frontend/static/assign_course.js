// static/assign_course.js
// Depends on utils.js

document.addEventListener("DOMContentLoaded", async () => {
    ensureAdmin(); // Ensure admin is authenticated

    const studentSelect = document.getElementById("studentSelect");
    const courseSelect = document.getElementById("courseSelect");
    const assignMessage = document.getElementById("assignMessage");
    const assignCourseForm = document.getElementById("assignCourseForm");

    // Function to load students into the dropdown
    async function loadStudents() {
        try {
            const response = await fetch(`${BASE_URL}/users/`, { // Uses the UserViewSet
                method: "GET",
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                studentSelect.innerHTML = '<option value="">-- Select a Student --</option>'; // Reset
                data.forEach(user => {
                    // Only list non-admin users for assignment (optional, adjust as needed)
                    // You might need a more robust way to differentiate students vs staff
                    if (!user.is_staff) { // Assuming admin users have is_staff=True
                        const option = document.createElement("option");
                        option.value = user.id;
                        option.textContent = user.username;
                        studentSelect.appendChild(option);
                    }
                });
                if (studentSelect.options.length <= 1) { // Only contains "Select a Student"
                    studentSelect.innerHTML = '<option value="">-- No students available --</option>';
                    studentSelect.disabled = true;
                }
            } else {
                showMessage("assignMessage", `Failed to load students: ${data.detail || "Unknown error"}`, true);
                studentSelect.innerHTML = '<option value="">-- Error loading students --</option>';
                studentSelect.disabled = true;
            }
        } catch (error) {
            console.error("Error loading students:", error);
            showMessage("assignMessage", "Network error loading students.", true);
            studentSelect.innerHTML = '<option value="">-- Network Error --</option>';
            studentSelect.disabled = true;
        }
    }

    // Function to load courses into the dropdown
    async function loadCourses() {
        try {
            const response = await fetch(`${BASE_URL}/courses/`, { // Uses the CourseViewSet
                method: "GET",
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                courseSelect.innerHTML = '<option value="">-- Select a Course --</option>'; // Reset
                data.forEach(course => {
                    const option = document.createElement("option");
                    option.value = course.id;
                    option.textContent = course.name;
                    courseSelect.appendChild(option);
                });
                 if (courseSelect.options.length <= 1) { // Only contains "Select a Course"
                    courseSelect.innerHTML = '<option value="">-- No courses available --</option>';
                    courseSelect.disabled = true;
                }
            } else {
                showMessage("assignMessage", `Failed to load courses: ${data.detail || "Unknown error"}`, true);
                courseSelect.innerHTML = '<option value="">-- Error loading courses --</option>';
                courseSelect.disabled = true;
            }
        } catch (error) {
            console.error("Error loading courses:", error);
            showMessage("assignMessage", "Network error loading courses.", true);
            courseSelect.innerHTML = '<option value="">-- Network Error --</option>';
            courseSelect.disabled = true;
        }
    }

    // Load data on page load
    await loadStudents();
    await loadCourses();


    // Handle form submission
    assignCourseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const studentId = studentSelect.value;
        const courseId = courseSelect.value;

        if (!studentId || !courseId) {
            showMessage("assignMessage", "Please select both a student and a course.", true);
            return;
        }

        showMessage("assignMessage", "Assigning course...", false);

        try {
            const response = await fetch(`${BASE_URL}/assignments/`, { // POST to AssignmentViewSet
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ student: studentId, course: courseId }),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage("assignMessage", "Course assigned successfully!", false);
                assignCourseForm.reset(); // Clear form
                // Optionally reload students/courses if assignment affects their status
            } else {
                let errorMsg = data.detail || "Failed to assign course.";
                if (data.non_field_errors) {
                    errorMsg = data.non_field_errors.join(", "); // Handles unique_together error
                } else if (data.student) {
                    errorMsg = `Student error: ${data.student.join(", ")}`;
                } else if (data.course) {
                    errorMsg = `Course error: ${data.course.join(", ")}`;
                }
                showMessage("assignMessage", errorMsg, true);
            }
        } catch (error) {
            console.error("Assignment error:", error);
            showMessage("assignMessage", "Network error during assignment. Please try again.", true);
        }
    });
});