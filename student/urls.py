from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestView, RegisterView, FeedbackViewSet

router = DefaultRouter()
router.register('feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('test/', TestView.as_view(), name='test'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
