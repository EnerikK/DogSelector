# Generated manually for the adoption finder foundation.

import django.db.models.deletion
from django.db import migrations, models
from django.db.models import Q


class Migration(migrations.Migration):

    dependencies = [
        ("dogs", "0002_alter_dog_rating"),
    ]

    operations = [
        migrations.CreateModel(
            name="Shelter",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=180)),
                ("country", models.CharField(db_index=True, max_length=80)),
                ("city", models.CharField(blank=True, db_index=True, default="", max_length=120)),
                ("postcode", models.CharField(blank=True, default="", max_length=32)),
                ("website", models.URLField(blank=True, default="")),
                ("email", models.EmailField(blank=True, default="", max_length=254)),
                ("phone", models.CharField(blank=True, default="", max_length=60)),
                (
                    "source_platform",
                    models.CharField(
                        choices=[
                            ("MANUAL", "Manual"),
                            ("RESCUE_GROUPS", "RescueGroups.org"),
                            ("ANIMAL_SHELTER_MANAGER", "Animal Shelter Manager"),
                            ("PARTNER_IMPORT", "Partner import"),
                        ],
                        db_index=True,
                        default="MANUAL",
                        max_length=30,
                    ),
                ),
                ("source_external_id", models.CharField(blank=True, default="", max_length=120)),
            ],
            options={
                "ordering": ["country", "city", "name"],
            },
        ),
        migrations.AddField(
            model_name="dog",
            name="adoption_status",
            field=models.CharField(
                choices=[
                    ("AVAILABLE", "Available"),
                    ("RESERVED", "Reserved"),
                    ("ADOPTED", "Adopted"),
                    ("UNAVAILABLE", "Unavailable"),
                ],
                db_index=True,
                default="AVAILABLE",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="dog",
            name="age_group",
            field=models.CharField(
                choices=[
                    ("UNKNOWN", "Unknown"),
                    ("PUPPY", "Puppy"),
                    ("YOUNG", "Young"),
                    ("ADULT", "Adult"),
                    ("SENIOR", "Senior"),
                ],
                db_index=True,
                default="UNKNOWN",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="dog",
            name="city",
            field=models.CharField(blank=True, db_index=True, default="", max_length=120),
        ),
        migrations.AddField(
            model_name="dog",
            name="country",
            field=models.CharField(blank=True, db_index=True, default="", max_length=80),
        ),
        migrations.AddField(
            model_name="dog",
            name="good_with_cats",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="dog",
            name="good_with_children",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="dog",
            name="good_with_dogs",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="dog",
            name="last_synced_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="dog",
            name="name",
            field=models.CharField(blank=True, default="", max_length=120),
        ),
        migrations.AddField(
            model_name="dog",
            name="neutered",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="dog",
            name="photo_url",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="dog",
            name="postcode",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
        migrations.AddField(
            model_name="dog",
            name="profile_url",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="dog",
            name="sex",
            field=models.CharField(
                choices=[("UNKNOWN", "Unknown"), ("FEMALE", "Female"), ("MALE", "Male")],
                db_index=True,
                default="UNKNOWN",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="dog",
            name="shelter",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="dogs",
                to="dogs.shelter",
            ),
        ),
        migrations.AddField(
            model_name="dog",
            name="size",
            field=models.CharField(
                choices=[
                    ("UNKNOWN", "Unknown"),
                    ("SMALL", "Small"),
                    ("MEDIUM", "Medium"),
                    ("LARGE", "Large"),
                    ("EXTRA_LARGE", "Extra large"),
                ],
                db_index=True,
                default="UNKNOWN",
                max_length=15,
            ),
        ),
        migrations.AddField(
            model_name="dog",
            name="source_external_id",
            field=models.CharField(blank=True, default="", max_length=120),
        ),
        migrations.AddField(
            model_name="dog",
            name="source_platform",
            field=models.CharField(
                choices=[
                    ("MANUAL", "Manual"),
                    ("RESCUE_GROUPS", "RescueGroups.org"),
                    ("ANIMAL_SHELTER_MANAGER", "Animal Shelter Manager"),
                    ("PARTNER_IMPORT", "Partner import"),
                ],
                db_index=True,
                default="MANUAL",
                max_length=30,
            ),
        ),
        migrations.AddField(
            model_name="dog",
            name="vaccinated",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name="DogPhoto",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("image_url", models.URLField()),
                ("caption", models.CharField(blank=True, default="", max_length=180)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                (
                    "dog",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="photos",
                        to="dogs.dog",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.AddIndex(
            model_name="dog",
            index=models.Index(fields=["adoption_status", "country", "city"], name="dogs_dog_adoptio_739fc8_idx"),
        ),
        migrations.AddIndex(
            model_name="dog",
            index=models.Index(fields=["source_platform", "source_external_id"], name="dogs_dog_source__c0e2e0_idx"),
        ),
        migrations.AddConstraint(
            model_name="shelter",
            constraint=models.UniqueConstraint(
                condition=~Q(("source_external_id", "")),
                fields=("source_platform", "source_external_id"),
                name="unique_shelter_source_id",
            ),
        ),
        migrations.AddConstraint(
            model_name="dog",
            constraint=models.UniqueConstraint(
                condition=~Q(("source_external_id", "")),
                fields=("source_platform", "source_external_id"),
                name="unique_dog_source_id",
            ),
        ),
    ]
