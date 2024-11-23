# from django.db import models
# from stats import settings

# class Match(models.Model):
    
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE, 
#                         related_name='user_matches')
#     adv = models.ForeignKey('auth.User', on_delete=models.SET_NULL, 
#                         null=True, related_name='adv_matches')
    
#     player_score = models.IntegerField(default=0)
#     adv_score = models.IntegerField(default=0)
#     winner = models.ForeignKey('auth.User', on_delete=models.CASCADE, 
#                         related_name='win_matches')
    
#     date = models.DateTimeField(null=True)
#     start_match = models.DateTimeField(null=True)
#     end_match = models.DateTimeField(null=True)
    
#     def _str_(self):
#         return f"Match {self.id} - {self.user} vs {self.adv}"
    
# # foreignkey= plusieurs matchs pour 1 seul player 
# # auth.user = ref model propre a django
# # on_delete=models.CASCADE = gestion du player/adv suprime 
# #         cascade = match supprimes
# # related_name='user_matches' = accede a tous les matchs d un joueur
    