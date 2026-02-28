import pytest
from rest_framework.test import APIClient
from dogs.models import Breed, Description, Dog

@pytest.mark.django_db
def test_list_dogs_paginates():
    client = APIClient()
    breed = Breed.objects.create(name="Labrador")
    desc = Description.objects.create(text="Playful")

    for _ in range(15):
        Dog.objects.create(breed=breed, description=desc)

    res = client.get("/api/v1/dogs/")
    assert res.status_code == 200
    assert "results" in res.data
    assert len(res.data["results"]) == 10

@pytest.mark.django_db
def test_patch_inline_rating():
    client = APIClient()
    breed = Breed.objects.create(name="Beagle")
    desc = Description.objects.create(text="Friendly")
    dog = Dog.objects.create(breed=breed, description=desc)

    res = client.patch(f"/api/v1/dogs/{dog.id}/", {"rating": 4}, format="json")
    assert res.status_code == 200
    assert res.data["rating"] == 4

@pytest.mark.django_db
def test_bulk_delete():
    client = APIClient()
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Shy")
    d1 = Dog.objects.create(breed=breed, description=desc)
    d2 = Dog.objects.create(breed=breed, description=desc)

    res = client.post("/api/v1/dogs/bulk-delete/", {"ids": [d1.id, d2.id]}, format="json")
    assert res.status_code == 200
    assert res.data["deleted"] == 2