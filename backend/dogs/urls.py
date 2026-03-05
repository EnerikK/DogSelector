from rest_framework.routers import DefaultRouter
from .views import DogViewSet, BreedViewSet, DescriptionViewSet

router = DefaultRouter()
router.register(r"dogs", DogViewSet)
router.register(r"breeds", BreedViewSet)
router.register(r"description", DescriptionViewSet)

urlpatterns = router.urls