import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from dogs.models import AdoptionStatus, Breed, Description, Dog, Shelter

User = get_user_model()

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
    assert res.status_code == 405

@pytest.mark.django_db
def test_list_dogs_includes_adoption_fields():
    client = APIClient()
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Gentle")
    shelter = Shelter.objects.create(name="Athens Rescue", country="Greece", city="Athens")
    Dog.objects.create(
        name="Nala",
        breed=breed,
        description=desc,
        shelter=shelter,
        adoption_status=AdoptionStatus.AVAILABLE,
        country="Greece",
        city="Athens",
    )

    res = client.get("/api/v1/dogs/")

    assert res.status_code == 200
    dog = res.data["results"][0]
    assert dog["name"] == "Nala"
    assert dog["adoption_status"] == AdoptionStatus.AVAILABLE
    assert dog["shelter_name"] == "Athens Rescue"
    assert dog["country"] == "Greece"
    assert dog["city"] == "Athens"

@pytest.mark.django_db
def test_bulk_delete():
    client = APIClient()
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Shy")
    d1 = Dog.objects.create(breed=breed, description=desc)
    d2 = Dog.objects.create(breed=breed, description=desc)

    res = client.post("/api/v1/dogs/bulk-delete/", {"ids": [d1.id, d2.id]}, format="json")
    assert res.status_code == 405


@pytest.mark.django_db
def test_dashboard_dogs_are_scoped_to_shelter_user():
    client = APIClient()
    user = User.objects.create_user(username="shelter1", password="secret123")
    shelter = Shelter.objects.create(name="Athens Rescue", country="Greece", user=user)
    other_shelter = Shelter.objects.create(name="Berlin Rescue", country="Germany")
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Calm")
    owned_dog = Dog.objects.create(name="Nala", breed=breed, description=desc, shelter=shelter)
    Dog.objects.create(name="Bruno", breed=breed, description=desc, shelter=other_shelter)

    client.force_authenticate(user=user)
    res = client.get("/api/v1/dashboard/dogs/")

    assert res.status_code == 200
    assert res.data["count"] == 1
    assert res.data["results"][0]["id"] == owned_dog.id


@pytest.mark.django_db
def test_dashboard_dog_update_requires_owner():
    client = APIClient()
    user = User.objects.create_user(username="shelter1", password="secret123")
    other_user = User.objects.create_user(username="shelter2", password="secret123")
    shelter = Shelter.objects.create(name="Athens Rescue", country="Greece", user=user)
    other_shelter = Shelter.objects.create(name="Berlin Rescue", country="Germany", user=other_user)
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Calm")
    dog = Dog.objects.create(name="Nala", breed=breed, description=desc, shelter=other_shelter)

    client.force_authenticate(user=user)
    res = client.patch(f"/api/v1/dashboard/dogs/{dog.id}/", {"name": "Changed"}, format="json")

    assert res.status_code == 404


@pytest.mark.django_db
def test_dashboard_bulk_delete_only_deletes_owned_dogs():
    client = APIClient()
    user = User.objects.create_user(username="shelter1", password="secret123")
    shelter = Shelter.objects.create(name="Athens Rescue", country="Greece", user=user)
    breed = Breed.objects.create(name="Mixed")
    desc = Description.objects.create(text="Calm")
    d1 = Dog.objects.create(name="Nala", breed=breed, description=desc, shelter=shelter)
    d2 = Dog.objects.create(name="Bruno", breed=breed, description=desc, shelter=shelter)

    client.force_authenticate(user=user)
    res = client.post("/api/v1/dashboard/dogs/bulk-delete/", {"ids": [d1.id, d2.id]}, format="json")

    assert res.status_code == 200
    assert res.data["deleted"] == 2
