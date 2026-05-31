from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from dogs.models import Shelter, SourcePlatform

User = get_user_model()


class ShelterSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = [
            "id",
            "name",
            "country",
            "city",
            "postcode",
            "website",
            "email",
            "phone",
            "is_verified",
        ]


class AuthUserSerializer(serializers.ModelSerializer):
    shelter = ShelterSummarySerializer(source="shelter_profile", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "shelter"]


class ShelterRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField()
    shelter_name = serializers.CharField(max_length=180)
    country = serializers.CharField(max_length=80)
    city = serializers.CharField(max_length=120, required=False, allow_blank=True)
    postcode = serializers.CharField(max_length=32, required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=60, required=False, allow_blank=True)

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        shelter_data = {
            "name": validated_data.pop("shelter_name"),
            "country": validated_data.pop("country"),
            "city": validated_data.pop("city", ""),
            "postcode": validated_data.pop("postcode", ""),
            "website": validated_data.pop("website", ""),
            "phone": validated_data.pop("phone", ""),
        }
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        shelter = Shelter.objects.create(
            user=user,
            source_platform=SourcePlatform.MANUAL,
            email=user.email,
            **shelter_data,
        )
        tokens = RefreshToken.for_user(user)
        return {
            "access": str(tokens.access_token),
            "refresh": str(tokens),
            "user": user,
            "shelter": shelter,
        }


class ShelterLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["username"],
            password=attrs["password"],
        )
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        attrs["user"] = user
        return attrs

    def create(self, validated_data):
        user = validated_data["user"]
        shelter = getattr(user, "shelter_profile", None)
        tokens = RefreshToken.for_user(user)
        return {
            "access": str(tokens.access_token),
            "refresh": str(tokens),
            "user": user,
            "shelter": shelter,
        }
