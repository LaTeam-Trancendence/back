from django.urls import path
from .views import stats_match
from .views import stats_player

urlpatterns = [
    path('matches/', stats_match.as_view(), name='create_match'),
]

urlpatterns += [
    path('players/<int:player_id>/stats/', stats_player.as_view(), name='player_stats'),
]
