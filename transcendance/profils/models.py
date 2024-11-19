from django.db import models

#    utilisateur = models.ForeignKey()
#   pseudo
#   mode de passe
#   image

class   pseudo(models.Model):
    pass

class Stat(models.Model):
    victoire = models.IntegerField(default=0)
    defaite = models.IntegerField(default=0)

''''
class StatTicTac(models.Model):
#    utilisateur = models.ForeignKey()
    victoireTicTac = models.IntegerField(default=0)
    defaiteTicTac = models.IntegerField(default=0)
'''
    
    #visible pour tout utilisateurs Connecte
class    matchHistory(models.Model):
    pass
