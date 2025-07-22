# student/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Feedback, StudentCourseAssignment, Course # Import Course model

# 🧾 Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

# 👤 User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# 📚 Course Serializer (NEWLY ADDED)
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'description'] # Ensure these fields match your Course model

# 💬 Feedback Serializer (with assignment check and proper fields)
class FeedbackSerializer(serializers.ModelSerializer):
    # Ensure course is serialized by its ID for submission, and can be represented by name for display
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all()) # Expects course ID
    course_name = serializers.CharField(source='course.name', read_only=True) # For displaying course name in GET
    username = serializers.CharField(source='user.username', read_only=True) # For displaying username in GET

    class Meta:
        model = Feedback
        fields = ['id', 'course', 'course_name', 'rating', 'comments', 'created_at', 'username']
        read_only_fields = ['created_at', 'user', 'course_name', 'username'] # 'user' is set in create method

    def validate(self, data):
        user = self.context['request'].user
        course = data.get('course')

        if not StudentCourseAssignment.objects.filter(student=user, course=course).exists():
            raise serializers.ValidationError("You are not assigned to this course.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class StudentCourseAssignmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

    # Optional: Add read-only fields for display in GET requests if needed
    student_username = serializers.CharField(source='student.username', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = StudentCourseAssignment
        fields = ['id', 'student', 'course', 'assigned_at', 'student_username', 'course_name']
        read_only_fields = ['assigned_at', 'student_username', 'course_name'] # assigned_at is auto_now_add