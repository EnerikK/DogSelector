from django.contrib import admin
from .models import Breed, Description, Dog, DogPhoto, Shelter

@admin.register(Breed)
class BreedAdmin(admin.ModelAdmin):
    search_fields = ("name",)

@admin.register(Description)
class DescriptionAdmin(admin.ModelAdmin):
    search_fields = ("text",)

@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "adoption_status",
        "breed",
        "shelter",
        "city",
        "country",
        "source_platform",
        "rating",
        "created_at",
    )
    list_filter = (
        "adoption_status",
        "status",
        "source_platform",
        "country",
        "city",
        "breed",
        "description",
    )
    search_fields = (
        "name",
        "breed__name",
        "description__text",
        "note",
        "shelter__name",
        "source_external_id",
    )
    ordering = ("-created_at",)

@admin.register(Shelter)
class ShelterAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "country", "source_platform", "created_at")
    list_filter = ("country", "city", "source_platform")
    search_fields = ("name", "city", "country", "source_external_id")

@admin.register(DogPhoto)
class DogPhotoAdmin(admin.ModelAdmin):
    list_display = ("dog", "sort_order", "image_url")
    search_fields = ("dog__name", "dog__breed__name", "image_url")
