import pytest
from dogs.models import Breed, Description, Dog
from dogs.serializers import DogSerializer

@pytest.mark.django_db
def test_dog_serializer_rating_validation():
    breed = Breed.objects.create(name="Poodle")
    desc = Description.objects.create(text="Calm")
    dog = Dog.objects.create(breed=breed, description=desc)

    ser = DogSerializer(dog, data={"rating": 6}, partial=True)
    assert ser.is_valid() is False
    assert "rating" in ser.errors