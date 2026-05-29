from rest_framework import viewsets,status,filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Dog, Breed, Description, Shelter
from .serializers import DogSerializer, BreedSerializer, DescriptionSerializer, ShelterSerializer
from .pagination import DogPagination

class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Breed.objects.all()
    serializer_class = BreedSerializer

class DescriptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Description.objects.all()
    serializer_class = DescriptionSerializer

class ShelterViewSet(viewsets.ModelViewSet):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "country", "city", "postcode"]
    ordering_fields = ["name", "country", "city", "created_at"]
    ordering = ["country", "city", "name"]

class DogViewSet(viewsets.ModelViewSet):
    queryset = Dog.objects.select_related("breed", "description", "shelter").prefetch_related("photos").all()
    serializer_class = DogSerializer
    pagination_class = DogPagination
    
    #We search by breed+Description here
    search_fields = [
        "name",
        "breed__name",
        "description__text",
        "note",
        "city",
        "country",
        "shelter__name",
    ]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    #We are sorting by columns
    ordering_fields = [
        "id",
        "name",
        "status",
        "adoption_status",
        "rating",
        "created_at",
        "breed__name",
        "description__text",
        "country",
        "city",
        "age_group",
        "size",
    ]
    ordering = ["-created_at"]

    @action(methods=["post"],detail=False,url_path="bulk-delete")
    def bulk_delete(self,request):
        ids = request.data.get("ids",[])
        if not isinstance(ids,list) or not ids:
            return Response({"detail": "ids must be a non empty list."},status=status.HTTP_400_BAD_REQUEST)
        
        deleted_count, _ = Dog.objects.filter(id__in=ids).delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)
