import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from dogs.models import Shelter

User = get_user_model()


@pytest.mark.django_db
def test_register_shelter_account_returns_token():
    client = APIClient()

    payload = {
        "username": "athensrescue",
        "password": "secret123",
        "email": "team@example.com",
        "shelter_name": "Athens Rescue",
        "country": "Greece",
        "city": "Athens",
    }

    response = client.post("/api/v1/auth/register/", payload, format="json")

    assert response.status_code == 201
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["shelter"]["name"] == "Athens Rescue"
    assert Shelter.objects.filter(name="Athens Rescue").exists()


@pytest.mark.django_db
def test_login_returns_existing_token_and_user():
    user = User.objects.create_user(username="athensrescue", password="secret123", email="team@example.com")
    Shelter.objects.create(name="Athens Rescue", country="Greece", user=user)
    client = APIClient()

    response = client.post(
        "/api/v1/auth/login/",
        {"username": "athensrescue", "password": "secret123"},
        format="json",
    )

    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["username"] == "athensrescue"


@pytest.mark.django_db
def test_me_requires_token():
    client = APIClient()
    response = client.get("/api/v1/auth/me/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_refresh_returns_new_access_token():
    user = User.objects.create_user(username="athensrescue", password="secret123", email="team@example.com")
    Shelter.objects.create(name="Athens Rescue", country="Greece", user=user)
    client = APIClient()
    login = client.post(
        "/api/v1/auth/login/",
        {"username": "athensrescue", "password": "secret123"},
        format="json",
    )

    refresh_response = client.post(
        "/api/v1/auth/refresh/",
        {"refresh": login.data["refresh"]},
        format="json",
    )

    assert refresh_response.status_code == 200
    assert "access" in refresh_response.data
