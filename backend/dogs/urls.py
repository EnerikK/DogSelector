from rest_framework.routers import DefaultRouter
from .views import DogViewSet, BreedViewSet, DescriptionViewSet, ShelterViewSet

router = DefaultRouter()
router.register(r"dogs", DogViewSet)
router.register(r"breeds", BreedViewSet)
router.register(r"description", DescriptionViewSet)
router.register(r"shelters", ShelterViewSet)

urlpatterns = router.urls
