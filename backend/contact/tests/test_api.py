import pytest
from rest_framework.test import APIClient
from contact.models import ContactSubmission

@pytest.mark.django_db
def test_create_contact_submission_api():
    client = APIClient()

    payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Looking for a dog"
    }

    response = client.post("/api/v1/contact-submission/", payload, format="json")

    assert response.status_code == 201
    assert ContactSubmission.objects.count() == 1