from rest_framework.serializers import ModelSerializer
from .models import CustomUser

class CustomUserSerializer(ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'image']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            image=validated_data.get('image', None),
        )
        return user
