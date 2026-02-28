from rest_framework import serializers
from .models import Breed,Description,Dog

class BreedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breed
        fields = ["id","text"]

class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = ["id","text"]

class DogSerializer(serializers.ModelSerializer):
    breed_name = serializers.CharField(source="breed.name", read_only=True)
    description_text = serializers.CharField(source="description.text",read_only=True)

    class Meta: 
        model = Dog
        fields = [
            "id",
            "status",
            "breed",
            "breed_name",
            "description",
            "description_text",
            "rating",
            "note",
            "created_at",
            "updated_at", 
        ]

    def validate_rating(self,value: int) -> int:
        if value < 0 or value > 5:
            raise serializers.ValidationError("Rating must be between 0 and 5")
        return value