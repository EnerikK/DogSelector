import pytest
from rest_framework.test import APIClient
from contact.models import ContactSubmission
from dogs.models import Breed, Description, Dog

@pytest.mark.django_db
def test_create_contact_submission_api():
    client = APIClient()
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Gentle")
    dog = Dog.objects.create(name="Nala", breed=breed, description=desc)

    payload = {
        "dog": dog.id,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+49123456789",
        "country": "Germany",
        "city": "Berlin",
        "message": "Looking for a dog",
        "household": "Apartment near a park",
        "dog_experience": "Had rescue dogs before",
        "preferred_contact_method": "email",
    }

    response = client.post("/api/v1/contact-submission/", payload, format="json")

    assert response.status_code == 201
    assert ContactSubmission.objects.count() == 1
    submission = ContactSubmission.objects.get()
    assert submission.dog == dog
    assert submission.status == "NEW"
