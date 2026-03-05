from rest_framework.routers import DefaultRouter
from .views import ContactSubmissionViewSet

router = DefaultRouter()
router.register(r"contact-submission", ContactSubmissionViewSet)

urlpatterns = router.urls