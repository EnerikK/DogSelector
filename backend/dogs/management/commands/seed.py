from django.core.management.base import BaseCommand
from dogs.models import Breed, Description, Dog, DogStatus
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

        dogs_to_create = []
        for i in range(5000):
            dogs_to_create.append(
                Dog(
                    breed=random.choice(breed_objs),
                    description=random.choice(desc_objs),
                    status=random.choice([
                        DogStatus.PENDING,
                        DogStatus.ACCEPTED,
                        DogStatus.REJECTED,
                    ]),
                    rating=random.randint(0, 5),
                    note=f"Dog #{i}"
                )
            )

        Dog.objects.bulk_create(dogs_to_create, batch_size=1000)
                

        self.stdout.write(self.style.SUCCESS("Seed complete"))