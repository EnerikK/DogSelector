import pytest
from contact.serializers import ContactSubmissionSerializer

@pytest.mark.django_db
def test_contact_serializer_valid():
    data = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "country": "Germany",
        "city": "Hamburg",
        "message": "Interested in adopting"
    }

    serializer = ContactSubmissionSerializer(data=data)

    assert serializer.is_valid()
    instance = serializer.save()

    assert instance.name == data["name"]
    assert instance.email == data["email"]
    assert instance.status == "NEW"