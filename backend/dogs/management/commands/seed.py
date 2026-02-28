from django.core.management.base import BaseCommand
from dogs.models import Breed, Description, Dog, DogStatus

class Command(BaseCommand):
    help = "Seed database with initial data"

    def handle(self, *args, **options):
        breeds = ["Labrador", "Beagle", "German Shepherd", "Poodle", "Mixed"]
        descriptions = ["Friendly", "Calm", "Playful", "Shy", "Energetic"]

        breed_objs = [Breed.objects.get_or_create(name=b)[0] for b in breeds]
        desc_objs = [Description.objects.get_or_create(text=t)[0] for t in descriptions]

        for i in range(1, 41):
            Dog.objects.get_or_create(
                breed=breed_objs[i % len(breed_objs)],
                description=desc_objs[i % len(desc_objs)],
                defaults={
                    "status": DogStatus.PENDING,
                    "rating": 0,
                    "note": "",
                }
            )

        self.stdout.write(self.style.SUCCESS("Seed complete"))