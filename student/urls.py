from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TestView,
    RegisterView,
    FeedbackViewSet,
    AssignedCoursesView,
    AllAssignmentsView,
    UserDetailsView,
    CourseViewSet, # Import CourseViewSet
    AllFeedbacksView, # Import AllFeedbacksView
    UserViewSet, # Import UserViewSet
    StudentCourseAssignmentViewSet, # Import StudentCourseAssignmentViewSet
)

# 🔄 Router for ViewSets
router = DefaultRouter()
router.register('feedback', FeedbackViewSet, basename='feedback')
router.register('courses', CourseViewSet, basename='course') # Register CourseViewSet
router.register('users', UserViewSet, basename='user')
router.register('assignments', StudentCourseAssignmentViewSet, basename='assignment') # Register new ViewSet

urlpatterns = [
    path('test/', TestView.as_view(), name='test'),
    path('register/', RegisterView.as_view(), name='register'),
    path('assigned-courses/', AssignedCoursesView.as_view(), name='assigned-courses'),
    path('all-assignments/', AllAssignmentsView.as_view(), name='all-assignments'),
    path('all-feedbacks/', AllFeedbacksView.as_view(), name='all-feedbacks'), # New admin endpoint
    path('me/', UserDetailsView.as_view(), name='user-details'),
    path('', include(router.urls)),  # feedback/ and courses/ routes
]