from rest_framework.routers import DefaultRouter
from .views import BreedViewSet, DashboardDogViewSet, DescriptionViewSet, PublicDogViewSet, ShelterViewSet

router = DefaultRouter()
router.register(r"dogs", PublicDogViewSet, basename="dogs")
router.register(r"dashboard/dogs", DashboardDogViewSet, basename="dashboard-dogs")
router.register(r"breeds", BreedViewSet)
router.register(r"description", DescriptionViewSet)
router.register(r"shelters", ShelterViewSet, basename="shelters")

urlpatterns = router.urls
