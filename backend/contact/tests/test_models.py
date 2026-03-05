import pytest
from contact.models import ContactSubmission

@pytest.mark.django_db
def test_create_contact_submission():
    contact = ContactSubmission.objects.create(
        name="John Doe",
        email="john@example.com",
        message="I want to adopt a dog"
    )

    assert contact.id is not None
    assert contact.name == "John Doe"
    assert contact.email == "john@example.com"
    assert contact.message == "I want to adopt a dog"