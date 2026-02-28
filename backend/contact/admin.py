from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "name", "created_at")
    search_fields = ("name", "email", "message")
    ordering = ("-created_at",)

