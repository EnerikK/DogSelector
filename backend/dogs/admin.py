from django.contrib import admin
from .models import Breed,Description,Dog

@admin.register(Breed)
class BreedAdmin(admin.ModelAdmin):
    search_fields = ("name",)

@admin.register(Description)
class DescriptionAdmin(admin.ModelAdmin):
    search_fields = ("text",)

@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "breed", "description", "rating", "created_at")
    list_filter = ("status", "breed", "description")
    search_fields = ("breed__name", "description__text", "note")
    ordering = ("-created_at",)