from django.urls import path

from .views import (
    ShelterLoginView,
    ShelterLogoutView,
    ShelterMeView,
    ShelterRegisterView,
    ShelterTokenRefreshView,
)


urlpatterns = [
    path("auth/register/", ShelterRegisterView.as_view(), name="auth-register"),
    path("auth/login/", ShelterLoginView.as_view(), name="auth-login"),
    path("auth/me/", ShelterMeView.as_view(), name="auth-me"),
    path("auth/logout/", ShelterLogoutView.as_view(), name="auth-logout"),
    path("auth/refresh/", ShelterTokenRefreshView.as_view(), name="auth-refresh"),
]
