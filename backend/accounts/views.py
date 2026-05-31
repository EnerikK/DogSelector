from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import (
    AuthUserSerializer,
    ShelterLoginSerializer,
    ShelterRegisterSerializer,
)


class ShelterRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ShelterRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.save()
        return Response(
            {
                "access": payload["access"],
                "refresh": payload["refresh"],
                "user": AuthUserSerializer(payload["user"]).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ShelterLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ShelterLoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        payload = serializer.save()
        return Response(
            {
                "access": payload["access"],
                "refresh": payload["refresh"],
                "user": AuthUserSerializer(payload["user"]).data,
            }
        )


class ShelterMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(AuthUserSerializer(request.user).data)


class ShelterLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)


class ShelterTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
