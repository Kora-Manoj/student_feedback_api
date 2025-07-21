from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Feedback
from .serializers import FeedbackSerializer, UserSerializer

# ✅ Simple Test Endpoint
class TestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "Student Feedback API is Live!"})


# ✅ Register Endpoint
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


# ✅ Feedback CRUD - Only Authenticated Users
class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Link feedback to current user

    def get_queryset(self):
        # Optionally: limit feedbacks to the user
        return Feedback.objects.filter(user=self.request.user)
