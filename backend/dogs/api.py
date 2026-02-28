from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Dog,Breed,Description
from .serializers import DogSerializer,BreedSerializer,DescriptionSerializer

class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Breed.objects.all()
    serializer_class = BreedSerializer

class DescriptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Description.objects.all()
    serializer_class = DescriptionSerializer

class DogViewSet(viewsets.ModelViewSet):
    queryset = Dog.objects.select_related("breed","description").all()
    serializer_class = DogSerializer
    
    #We search by breed+Description here
    search_fields = ["breed__name","description__text"]

    #We are sorting by columns
    ordering_fields = ["id","status","rating","created__at","breed__name","description__text"]
    ordering = ["-created_at"]

    @action(methods=["post"],detail=False,url_path="bulk-delete")
    def bulk_delete(self,request):
        ids = request.data.get("ids",[])
        if not isinstance(ids,list) or not ids:
            return Response({"detail": "ids must be a non empty list."},status=status.HTTP_400_BAD_REQUEST)
        
        deleted_count, _ = Dog.objects.filter(id__in=ids).delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)