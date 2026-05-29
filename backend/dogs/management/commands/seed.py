from django.core.management.base import BaseCommand
from dogs.models import (
    AdoptionStatus,
    AgeGroup,
    Breed,
    Description,
    Dog,
    DogSex,
    DogSize,
    DogStatus,
    Shelter,
    SourcePlatform,
)
import random
class Command(BaseCommand):
    help = "Seed database with initial data"

    def handle(self, *args, **options):
        breeds = [
            "Labrador Retriever", "Golden Retriever", "German Shepherd",
            "French Bulldog", "Bulldog", "Poodle", "Beagle", "Rottweiler",
            "Yorkshire Terrier", "Boxer", "Dachshund", "Siberian Husky",
            "Great Dane", "Doberman", "Corgi", "Shih Tzu", "Chihuahua",
            "Border Collie", "Australian Shepherd", "Cocker Spaniel",
            "Maltese", "Pug", "Boston Terrier", "Akita", "Saint Bernard",
            "Bloodhound", "Basset Hound", "Weimaraner", "Newfoundland",
            "Samoyed", "Chow Chow", "Dalmatian", "Greyhound",
            "Whippet", "Bull Terrier", "Airedale Terrier",
            "Miniature Schnauzer", "Irish Setter", "English Setter",
            "Bernese Mountain Dog", "Alaskan Malamute",
            "Cane Corso", "Shiba Inu", "Belgian Malinois",
            "Vizsla", "Rhodesian Ridgeback", "Papillon",
            "Havanese", "Lhasa Apso", "Mixed"
        ]
        descriptions = [
            "Friendly", "Calm", "Playful", "Shy", "Energetic",
            "Protective", "Loyal", "Affectionate", "Independent",
            "Curious", "Alert", "Intelligent", "Gentle",
            "Confident", "Social", "Quiet", "Brave",
            "Patient", "Stubborn", "Adaptable",
            "Cheerful", "Obedient", "Strong",
            "Athletic", "Watchful", "Clumsy",
            "Hyperactive", "Lazy", "Sweet",
            "Territorial", "Cuddly", "Fearless",
            "Reserved", "Goofy", "Sensitive",
            "Focused", "Determined", "Mischievous",
            "Polite", "Eager to please"
        ]
        breed_objs = [Breed.objects.get_or_create(name=b)[0] for b in breeds]
        desc_objs = [Description.objects.get_or_create(text=t)[0] for t in descriptions]
        shelters = [
            {
                "name": "Athens Happy Tails Rescue",
                "country": "Greece",
                "city": "Athens",
                "postcode": "10431",
                "website": "https://example.org/athens-happy-tails",
            },
            {
                "name": "Berlin Hunde Hilfe",
                "country": "Germany",
                "city": "Berlin",
                "postcode": "10115",
                "website": "https://example.org/berlin-hunde-hilfe",
            },
            {
                "name": "Barcelona Dog Rescue",
                "country": "Spain",
                "city": "Barcelona",
                "postcode": "08001",
                "website": "https://example.org/barcelona-dog-rescue",
            },
            {
                "name": "Dublin Paw Match",
                "country": "Ireland",
                "city": "Dublin",
                "postcode": "D01",
                "website": "https://example.org/dublin-paw-match",
            },
        ]
        shelter_objs = [
            Shelter.objects.get_or_create(
                name=shelter["name"],
                defaults={
                    **shelter,
                    "source_platform": SourcePlatform.PARTNER_IMPORT,
                    "source_external_id": shelter["name"].lower().replace(" ", "-"),
                },
            )[0]
            for shelter in shelters
        ]
        dog_names = [
            "Nala", "Max", "Luna", "Bruno", "Milo", "Bella", "Aris", "Ruby",
            "Leo", "Maya", "Rocky", "Daisy", "Oscar", "Iris", "Toby", "Cleo",
        ]

        dogs_to_create = []
        for i in range(5000):
            shelter = random.choice(shelter_objs)
            dogs_to_create.append(
                Dog(
                    name=f"{random.choice(dog_names)} {i}",
                    breed=random.choice(breed_objs),
                    description=random.choice(desc_objs),
                    status=random.choice([
                        DogStatus.PENDING,
                        DogStatus.ACCEPTED,
                        DogStatus.REJECTED,
                    ]),
                    shelter=shelter,
                    adoption_status=random.choice([
                        AdoptionStatus.AVAILABLE,
                        AdoptionStatus.AVAILABLE,
                        AdoptionStatus.AVAILABLE,
                        AdoptionStatus.RESERVED,
                    ]),
                    sex=random.choice([DogSex.FEMALE, DogSex.MALE, DogSex.UNKNOWN]),
                    age_group=random.choice([
                        AgeGroup.PUPPY,
                        AgeGroup.YOUNG,
                        AgeGroup.ADULT,
                        AgeGroup.SENIOR,
                    ]),
                    size=random.choice([
                        DogSize.SMALL,
                        DogSize.MEDIUM,
                        DogSize.LARGE,
                        DogSize.EXTRA_LARGE,
                    ]),
                    country=shelter.country,
                    city=shelter.city,
                    postcode=shelter.postcode,
                    profile_url=shelter.website,
                    source_platform=SourcePlatform.PARTNER_IMPORT,
                    source_external_id=f"seed-{i}",
                    vaccinated=random.choice([True, False, None]),
                    neutered=random.choice([True, False, None]),
                    good_with_children=random.choice([True, False, None]),
                    good_with_dogs=random.choice([True, False, None]),
                    good_with_cats=random.choice([True, False, None]),
                    rating=random.randint(0, 5),
                    note=f"Dog #{i}"
                )
            )

        Dog.objects.bulk_create(dogs_to_create, batch_size=1000)
                

        self.stdout.write(self.style.SUCCESS("Seed complete"))
