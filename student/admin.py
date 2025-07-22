# student/admin.py
from django.contrib import admin
from .models import Course, Feedback, StudentCourseAssignment

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'course__name', 'comments')

@admin.register(StudentCourseAssignment)
class StudentCourseAssignmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'assigned_at')
    search_fields = ('student__username', 'course__name')
    list_filter = ('assigned_at',)
