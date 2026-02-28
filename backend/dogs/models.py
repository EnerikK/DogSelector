from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Breed(TimeStampedModel):
    name = models.CharField(max_length=120,unique=True)

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

class Dog(TimeStampedModel):
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

    class Meta: 
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["rating"])
        ]
    
    def __str__(self) -> str:
        return f"{self.breed} - {self.description}({self.status})"