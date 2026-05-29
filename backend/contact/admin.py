from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "dog", "status", "country", "city", "created_at")
    list_filter = ("status", "country", "city", "preferred_contact_method", "created_at")
    search_fields = (
        "name",
        "email",
        "phone",
        "message",
        "household",
        "dog_experience",
        "dog__name",
        "dog__breed__name",
        "dog__shelter__name",
    )
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

