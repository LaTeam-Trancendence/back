# from django.shortcuts import render
from .models import Match, Player
from django.contrib.auth.models import User

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from models.serializers import PlayerSerializer, MatchSerializer
from rest_framework import status

from .services import up_player_stats

# class UserListView(APIView):
#     def get(self, request):
#         users = User.objects.all()
#         serializer = UserSerializer(users, many=True)
#         return Response(serializer.data)

def up_player_stats(match):
    user = match.user
    adv = match.adv
    
    user.total_matches += 1
    adv.total_matches += 1
    
    if match.winner == user:
        user.total_win += 1
        user.total_lose += 1
    else:
        adv.total_win += 1
        adv.total_lose += 1
        
    user.save()
    adv.save()
    
    # A voir pour ranking (placer avant save)
    # user_score += match.player_score
    # adv_score += match.adv_score

class stats_player(APIView):
    def get(self, request, player_id):
        try:
            player = Player.objects.get(id=player_id)
            serializer = PlayerSerializer(player)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)

class stats_match(APIView):
    def post(self, request):
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            match = serializer.save()
            up_player_stats(match)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MatchListView(APIView):
    def get(self, request):
        matches = Match.objects.all()
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
