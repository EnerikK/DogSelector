from rest_framework import serializers
from .models import ContactSubmission

class ContactSubmissionSerialziers(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        field = ["id","name","email","message","created_at"]
        read_only_fields = ["id","created_at"]

