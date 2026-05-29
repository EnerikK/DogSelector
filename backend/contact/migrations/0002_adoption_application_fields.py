# Generated manually for dog-specific adoption applications.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("dogs", "0003_adoption_foundation"),
        ("contact", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactsubmission",
            name="city",
            field=models.CharField(blank=True, default="", max_length=120),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="country",
            field=models.CharField(blank=True, default="", max_length=80),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="dog",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="applications",
                to="dogs.dog",
            ),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="dog_experience",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="household",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=60),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="preferred_contact_method",
            field=models.CharField(blank=True, default="email", max_length=40),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="status",
            field=models.CharField(
                choices=[
                    ("NEW", "New"),
                    ("REVIEWING", "Reviewing"),
                    ("APPROVED", "Approved"),
                    ("DECLINED", "Declined"),
                    ("WITHDRAWN", "Withdrawn"),
                ],
                db_index=True,
                default="NEW",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="contactsubmission",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddIndex(
            model_name="contactsubmission",
            index=models.Index(fields=["status"], name="contact_con_status_4168ae_idx"),
        ),
        migrations.AddIndex(
            model_name="contactsubmission",
            index=models.Index(fields=["country", "city"], name="contact_con_country_f88bdb_idx"),
        ),
    ]
