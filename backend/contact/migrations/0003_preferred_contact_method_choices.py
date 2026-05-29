# Generated manually for application contact method choices.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("contact", "0002_adoption_application_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contactsubmission",
            name="preferred_contact_method",
            field=models.CharField(
                choices=[
                    ("email", "Email"),
                    ("phone", "Phone"),
                    ("whatsapp", "WhatsApp"),
                ],
                default="email",
                max_length=40,
            ),
        ),
    ]
