from rest_framework.serializers import ModelSerializer

from profils.models import Stat

class StatSerializer(ModelSerializer):
    
    class Meta:
        model = Stat
        fields = '__all__'