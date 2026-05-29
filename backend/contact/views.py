from rest_framework import viewsets, mixins
from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer

class ContactSubmissionViewSet(mixins.CreateModelMixin,viewsets.GenericViewSet):
    #We create only endpoint because submissions are viewd in admin
    queryset = ContactSubmission.objects.select_related("dog", "dog__breed", "dog__shelter").all()
    serializer_class = ContactSubmissionSerializer