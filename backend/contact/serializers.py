from rest_framework import serializers
from .models import ContactSubmission

class ContactSubmissionSerializer(serializers.ModelSerializer):
    dog_name = serializers.CharField(source="dog.name", read_only=True)
    dog_breed = serializers.CharField(source="dog.breed.name", read_only=True)
    shelter_name = serializers.CharField(source="dog.shelter.name", read_only=True)

    class Meta:
        model = ContactSubmission
        fields = [
            "id",
            "dog",
            "dog_name",
            "dog_breed",
            "shelter_name",
            "name",
            "email",
            "phone",
            "country",
            "city",
            "message",
            "household",
            "dog_experience",
            "preferred_contact_method",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "dog_name",
            "dog_breed",
            "shelter_name",
            "status",
            "created_at",
            "updated_at",
        ]

