from rest_framework import viewsets, mixins
from .models import ContactSubmission
from .serializers import ContactSubmissionSerialziers

class ContactSubmissionViewSet(mixins.CreateModelMixin,viewsets.GenericViewSet):
    #We create only endpoint because submissions are viewd in admin
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerialziers