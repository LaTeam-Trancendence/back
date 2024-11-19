from .serializers import CustomUserSerializer
from rest_framework import viewsets
from .models import CustomUser
from rest_framework import generics


class RegisterUserViewset(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    
    def get_queryset(self):
        return CustomUser.objects.all()
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
