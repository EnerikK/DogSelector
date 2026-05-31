# Generated manually for shelter account ownership.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("dogs", "0004_rename_dogs_dog_adoptio_739fc8_idx_dogs_dog_adoptio_7a4e18_idx_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="shelter",
            name="is_verified",
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name="shelter",
            name="user",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="shelter_profile",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
