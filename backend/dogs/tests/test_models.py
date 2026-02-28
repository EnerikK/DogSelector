import pytest
from dogs.models import Breed, Description, Dog, DogStatus

@pytest.mark.django_db
def test_dog_defaults():
    breed = Breed.objects.create(name="Beagle")
    desc = Description.objects.create(text="Friendly")
    dog = Dog.objects.create(breed=breed, description=desc)

    assert dog.status == DogStatus.PENDING
    assert dog.rating == 0
    assert dog.note == ""