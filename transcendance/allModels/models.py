from django.db import models
from django.conf import settings
# from django.contrib.auth.models import User
#from stats import settings

# //____________Player______________//

# dans AbstractUser les champs username et password sont deja crees
# username = max 150 char et password = deja hashe
# ajouter pour limiter la taille :
#       short_name = models.CharField(unique=True, max_length=15)
# Reste a gerer les amis en intergrant une liste

class Player(models.Model):

    profile_picture = models.TextField(null=True)
    language = models.CharField(max_length=2, default="FR")
    
    #friends
    status = models.BooleanField(default=False)
    
    #total_matches = models.IntegerField(default=0)
    
    win_pong = models.IntegerField(default=0)
    lose_pong = models.IntegerField(default=0)
    
    win_tictactoe = models.IntegerField(default=0)
    lose_tictactoe = models.IntegerField(default=0)
    
    def __str__(self):
        return self.username

# //____________Match______________//

# foreignkey= plusieur match pour 1 seul player 
# auth.user = ref model propre a django
# on_delete=models.CASCADE = gestion du player/adv suprime 
#         cascade = match supprimes
# related_name='user_matches' = accede a tous les matchs d un joueur

# class Match(models.Model):
    
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE, 
#                         related_name='user_matches')
#     adv = models.ForeignKey('auth.User', on_delete=models.SET_NULL, 
#                         null=True, related_name='adv_matches')
    
#     user_score = models.IntegerField(default=0)
#     adv_score = models.IntegerField(default=0)
#     result = models.IntegerField(default=0)
    
#     date = models.DateTimeField(null=True)
#     start_match = models.DateTimeField(null=True)
#     end_match = models.DateTimeField(null=True)
    
#     def _str_(self):
#         return f"Match {self.id} - {self.user} vs {self.adv}"
    
# //___________friends________________//

# class Friends(models.Model):
    
    

# Create your models here.
