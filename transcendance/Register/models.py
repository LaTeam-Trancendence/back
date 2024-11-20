from django.db import models

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    image = models.ImageField(upload_to='images_pics/', blank=True, null=True)
    
    def __str__(self):
        return self.username


