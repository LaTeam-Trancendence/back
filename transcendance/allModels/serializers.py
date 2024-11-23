from rest_framework import serializers
from .models import Player, Match

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'win', 'lose']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'player1', 'player2', 'player1_score', 
                  'player2_score', 'winner', 'date', 'duration']


