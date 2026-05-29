from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Breed(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)

    class Meta: 
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
        
class Description(TimeStampedModel):
    text = models.CharField(max_length=120,unique=True)

    class Meta:
        ordering = ["text"]

    def __str__(self) -> str:
        return self.text

class DogStatus(models.TextChoices):
    PENDING = "PENDING","Pending"
    ACCEPTED = "ACCEPTED","Accepted"
    REJECTED = "REJECTED","Rejected"

class AdoptionStatus(models.TextChoices):
    AVAILABLE = "AVAILABLE", "Available"
    RESERVED = "RESERVED", "Reserved"
    ADOPTED = "ADOPTED", "Adopted"
    UNAVAILABLE = "UNAVAILABLE", "Unavailable"

class DogSex(models.TextChoices):
    UNKNOWN = "UNKNOWN", "Unknown"
    FEMALE = "FEMALE", "Female"
    MALE = "MALE", "Male"

class AgeGroup(models.TextChoices):
    UNKNOWN = "UNKNOWN", "Unknown"
    PUPPY = "PUPPY", "Puppy"
    YOUNG = "YOUNG", "Young"
    ADULT = "ADULT", "Adult"
    SENIOR = "SENIOR", "Senior"

class DogSize(models.TextChoices):
    UNKNOWN = "UNKNOWN", "Unknown"
    SMALL = "SMALL", "Small"
    MEDIUM = "MEDIUM", "Medium"
    LARGE = "LARGE", "Large"
    EXTRA_LARGE = "EXTRA_LARGE", "Extra large"

class SourcePlatform(models.TextChoices):
    MANUAL = "MANUAL", "Manual"
    RESCUE_GROUPS = "RESCUE_GROUPS", "RescueGroups.org"
    ANIMAL_SHELTER_MANAGER = "ANIMAL_SHELTER_MANAGER", "Animal Shelter Manager"
    PARTNER_IMPORT = "PARTNER_IMPORT", "Partner import"

class Shelter(TimeStampedModel):
    name = models.CharField(max_length=180)
    country = models.CharField(max_length=80, db_index=True)
    city = models.CharField(max_length=120, blank=True, default="", db_index=True)
    postcode = models.CharField(max_length=32, blank=True, default="")
    website = models.URLField(blank=True, default="")
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=60, blank=True, default="")
    source_platform = models.CharField(
        max_length=30,
        choices=SourcePlatform.choices,
        default=SourcePlatform.MANUAL,
        db_index=True,
    )
    source_external_id = models.CharField(max_length=120, blank=True, default="")

    class Meta:
        ordering = ["country", "city", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["source_platform", "source_external_id"],
                condition=~models.Q(source_external_id=""),
                name="unique_shelter_source_id",
            )
        ]

    def __str__(self) -> str:
        location = ", ".join(part for part in [self.city, self.country] if part)
        return f"{self.name} ({location})" if location else self.name

class Dog(TimeStampedModel):
    name = models.CharField(max_length=120, blank=True, default="")
    status = models.CharField(
        max_length=10,
        choices=DogStatus.choices,
        default=DogStatus.PENDING,
        db_index=True,
    )
    breed = models.ForeignKey(Breed,on_delete=models.PROTECT,related_name="dogs")
    description = models.ForeignKey(Description,on_delete=models.PROTECT,related_name="dogs")
    rating = models.PositiveSmallIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(5)
        ]
    )
    note = models.TextField(blank=True,default="")
    shelter = models.ForeignKey(
        Shelter,
        on_delete=models.SET_NULL,
        related_name="dogs",
        null=True,
        blank=True,
    )
    adoption_status = models.CharField(
        max_length=20,
        choices=AdoptionStatus.choices,
        default=AdoptionStatus.AVAILABLE,
        db_index=True,
    )
    sex = models.CharField(
        max_length=10,
        choices=DogSex.choices,
        default=DogSex.UNKNOWN,
        db_index=True,
    )
    age_group = models.CharField(
        max_length=10,
        choices=AgeGroup.choices,
        default=AgeGroup.UNKNOWN,
        db_index=True,
    )
    size = models.CharField(
        max_length=15,
        choices=DogSize.choices,
        default=DogSize.UNKNOWN,
        db_index=True,
    )
    country = models.CharField(max_length=80, blank=True, default="", db_index=True)
    city = models.CharField(max_length=120, blank=True, default="", db_index=True)
    postcode = models.CharField(max_length=32, blank=True, default="")
    photo_url = models.URLField(blank=True, default="")
    profile_url = models.URLField(blank=True, default="")
    source_platform = models.CharField(
        max_length=30,
        choices=SourcePlatform.choices,
        default=SourcePlatform.MANUAL,
        db_index=True,
    )
    source_external_id = models.CharField(max_length=120, blank=True, default="")
    last_synced_at = models.DateTimeField(null=True, blank=True)
    vaccinated = models.BooleanField(null=True, blank=True)
    neutered = models.BooleanField(null=True, blank=True)
    good_with_children = models.BooleanField(null=True, blank=True)
    good_with_dogs = models.BooleanField(null=True, blank=True)
    good_with_cats = models.BooleanField(null=True, blank=True)

    class Meta: 
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["rating"]),
            models.Index(fields=["adoption_status", "country", "city"]),
            models.Index(fields=["source_platform", "source_external_id"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["source_platform", "source_external_id"],
                condition=~models.Q(source_external_id=""),
                name="unique_dog_source_id",
            )
        ]
    
    def __str__(self) -> str:
        display_name = self.name or str(self.breed)
        return f"{display_name} - {self.adoption_status}"

class DogPhoto(TimeStampedModel):
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE, related_name="photos")
    image_url = models.URLField()
    caption = models.CharField(max_length=180, blank=True, default="")
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"Photo for {self.dog_id}"
