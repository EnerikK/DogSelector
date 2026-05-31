from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsShelterAccount(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "shelter_profile")
        )


class IsShelterDogOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        shelter = getattr(request.user, "shelter_profile", None)
        return shelter is not None and obj.shelter_id == shelter.id
