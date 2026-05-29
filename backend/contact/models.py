from django.db import models
from dogs.models import Dog

class ApplicationStatus(models.TextChoices):
    NEW = "NEW", "New"
    REVIEWING = "REVIEWING", "Reviewing"
    APPROVED = "APPROVED", "Approved"
    DECLINED = "DECLINED", "Declined"
    WITHDRAWN = "WITHDRAWN", "Withdrawn"

class PreferredContactMethod(models.TextChoices):
    EMAIL = "email", "Email"
    PHONE = "phone", "Phone"
    WHATSAPP = "whatsapp", "WhatsApp"


class ContactSubmission(models.Model):
    dog = models.ForeignKey(
        Dog,
        on_delete=models.SET_NULL,
        related_name="applications",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=60, blank=True, default="")
    country = models.CharField(max_length=80, blank=True, default="")
    city = models.CharField(max_length=120, blank=True, default="")
    message = models.TextField()
    household = models.TextField(blank=True, default="")
    dog_experience = models.TextField(blank=True, default="")
    preferred_contact_method = models.CharField(
        max_length=40,
        choices=PreferredContactMethod.choices,
        default=PreferredContactMethod.EMAIL,
    )
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.NEW,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["country", "city"]),
        ]

    def __str__(self) -> str:
        dog_name = self.dog.name if self.dog and self.dog.name else "general inquiry"
        return f"{self.name} <{self.email}> - {dog_name}"
