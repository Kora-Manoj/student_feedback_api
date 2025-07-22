# student/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser # Import IsAdminUser
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Feedback, Course, StudentCourseAssignment
from .serializers import (
    FeedbackSerializer,
    RegisterSerializer,
    UserSerializer,
    StudentCourseAssignmentSerializer,  # Import CourseSerializer
    # Assuming you'll add a CourseSerializer
)
from .serializers import CourseSerializer # You need to create this serializer

class UserViewSet(viewsets.ReadOnlyModelViewSet): # ReadOnlyModelViewSet for listing users
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] 


class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated] # User must be logged in

    def get(self, request):
        user = request.user
        # Check if the user is a staff member (Django's default for admin access)
        is_admin = user.is_staff
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'is_admin': is_admin
        })
    
class StudentCourseAssignmentViewSet(viewsets.ModelViewSet):
    queryset = StudentCourseAssignment.objects.all()
    serializer_class = StudentCourseAssignmentSerializer
    permission_classes = [IsAdminUser] 

# Create a simple CourseSerializer in serializers.py for this
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'description'] # Removed 'instructor' as it's not in model


# ✅ Test Endpoint (Check API is running)
class TestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "🎯 Student Feedback API is Live!"})


# ✅ User Registration Endpoint
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Course CRUD (Admin Only)
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUser] # Only admins can manage courses

# ✅ Feedback CRUD — Only Authenticated & Assigned Students
class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return feedback only by the logged-in user
        return Feedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # The serializer's validate method handles assignment check
        # Automatically assign the current user
        serializer.save(user=self.request.user)


# ✅ Assigned Courses List — for the logged-in student
class AssignedCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        assignments = StudentCourseAssignment.objects.filter(student=user).select_related('course')
        courses_data = [{"id": assign.course.id, "name": assign.course.name, "description": assign.course.description} for assign in assignments]
        return Response({"assigned_courses": courses_data})


# ✅ Admin View — List all students assigned to courses (admin only)
class AllAssignmentsView(APIView):
    permission_classes = [IsAdminUser] # Protect this with IsAdminUser

    def get(self, request):
        assignments = StudentCourseAssignment.objects.all().select_related('student', 'course')
        data = [
            {
                "student": assign.student.username,
                "course_id": assign.course.id,
                "course_name": assign.course.name,
                "assigned_at": assign.assigned_at,
            }
            for assign in assignments
        ]
        return Response(data)

# ✅ Admin View — List all feedbacks (admin only)
class AllFeedbacksView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        feedbacks = Feedback.objects.all().select_related('user', 'course')
        data = [
            {
                "id": feedback.id,
                "user": feedback.user.username,
                "course_id": feedback.course.id,
                "course_name": feedback.course.name,
                "rating": feedback.rating,
                "comments": feedback.comments,
                "created_at": feedback.created_at,
            }
            for feedback in feedbacks
        ]
        return Response(data)