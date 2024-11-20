from rest_framework.viewsets import ReadOnlyModelViewSet

from profils.models import Stat
from profils.serializers import StatSerializer

#que en lecture
class StatViewset(ReadOnlyModelViewSet):
    
    serializer_class = StatSerializer
    
    def get_queryset(self):
        return Stat.objects.all()
