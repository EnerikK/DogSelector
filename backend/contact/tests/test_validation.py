import pytest

@pytest.mark.django_db
def test_contact_serializer_invalid_email():
    from contact.serializers import ContactSubmissionSerializer

    data = {
        "name": "John",
        "email": "invalid-email",
        "message": "hello"
    }

    serializer = ContactSubmissionSerializer(data=data)

    assert not serializer.is_valid()
    assert "email" in serializer.errors