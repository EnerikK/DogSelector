from rest_framework import serializers
from .models import Breed, Description, Dog, DogPhoto, Shelter

class BreedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breed
        fields = ["id", "name"]

class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = ["id", "text"]

class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = [
            "id",
            "name",
            "country",
            "city",
            "postcode",
            "website",
            "email",
            "phone",
            "is_verified",
            "source_platform",
            "source_external_id",
        ]

class DogPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DogPhoto
        fields = ["id", "image_url", "caption", "sort_order"]

class DogSerializer(serializers.ModelSerializer):
    breed_name = serializers.CharField(source="breed.name", read_only=True)
    description_text = serializers.CharField(source="description.text",read_only=True)
    shelter_name = serializers.CharField(source="shelter.name", read_only=True)
    photos = DogPhotoSerializer(many=True, read_only=True)

    class Meta: 
        model = Dog
        fields = [
            "id",
            "name",
            "status",
            "breed",
            "breed_name",
            "description",
            "description_text",
            "rating",
            "note",
            "shelter",
            "shelter_name",
            "adoption_status",
            "sex",
            "age_group",
            "size",
            "country",
            "city",
            "postcode",
            "photo_url",
            "profile_url",
            "source_platform",
            "source_external_id",
            "last_synced_at",
            "vaccinated",
            "neutered",
            "good_with_children",
            "good_with_dogs",
            "good_with_cats",
            "photos",
            "created_at",
            "updated_at", 
        ]
        read_only_fields = [
            "status",
            "shelter",
            "shelter_name",
            "source_platform",
            "source_external_id",
            "last_synced_at",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self,value: int) -> int:
        if value < 0 or value > 5:
            raise serializers.ValidationError("Rating must be between 0 and 5")
        return value
