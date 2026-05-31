from rest_framework import filters, mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Description, Dog, Breed, Shelter
from .pagination import DogPagination
from .permissions import IsShelterAccount, IsShelterDogOwner
from .serializers import BreedSerializer, DescriptionSerializer, DogSerializer, ShelterSerializer


class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Breed.objects.all()
    serializer_class = BreedSerializer


class DescriptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Description.objects.all()
    serializer_class = DescriptionSerializer


class PublicDogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dog.objects.select_related("breed", "description", "shelter").prefetch_related("photos").all()
    serializer_class = DogSerializer
    pagination_class = DogPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
        "breed__name",
        "description__text",
        "city",
        "country",
        "shelter__name",
    ]
    ordering_fields = [
        "id",
        "name",
        "adoption_status",
        "created_at",
        "breed__name",
        "country",
        "city",
        "age_group",
        "size",
    ]
    ordering = ["-created_at"]


class DashboardDogViewSet(viewsets.ModelViewSet):
    serializer_class = DogSerializer
    pagination_class = DogPagination
    permission_classes = [permissions.IsAuthenticated, IsShelterAccount, IsShelterDogOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
        "breed__name",
        "description__text",
        "note",
        "city",
        "country",
    ]
    ordering_fields = [
        "id",
        "name",
        "status",
        "adoption_status",
        "rating",
        "created_at",
        "breed__name",
        "country",
        "city",
    ]
    ordering = ["-created_at"]

    def get_queryset(self):
        shelter = self.request.user.shelter_profile
        return Dog.objects.select_related("breed", "description", "shelter").prefetch_related("photos").filter(
            shelter=shelter
        )

    def perform_create(self, serializer):
        shelter = self.request.user.shelter_profile
        serializer.save(
            shelter=shelter,
            country=serializer.validated_data.get("country") or shelter.country,
            city=serializer.validated_data.get("city") or shelter.city,
            postcode=serializer.validated_data.get("postcode") or shelter.postcode,
        )

    @action(methods=["post"], detail=False, url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        if not isinstance(ids, list) or not ids:
            return Response({"detail": "ids must be a non empty list."}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = self.get_queryset().filter(id__in=ids).delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)


class ShelterViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = ShelterSerializer
    permission_classes = [permissions.IsAuthenticated, IsShelterAccount]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "country", "city", "postcode"]
    ordering_fields = ["name", "country", "city", "created_at"]
    ordering = ["country", "city", "name"]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Shelter.objects.all()
        return Shelter.objects.filter(id=self.request.user.shelter_profile.id)
