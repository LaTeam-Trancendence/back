from rest_framework.serializers import ModelSerializer
from django import forms
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password

class CustomUserSerializer(ModelSerializer):
    password1 = forms.CharField(label="Mot de passe", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirmez le mot de passe", widget=forms.PasswordInput)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'image']
        extra_kwargs = {'password': {'write_only': True}}
 
    def validate_password2(self, value):
        # Vérifier que les mots de passe correspondent
        password1 = self.initial_data.get("password1")
        if value != password1:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        
        # Appliquer la validation Django standard des mots de passe
        validate_password(password1)  # Cela vérifie la conformité au critères de AUTH_PASSWORD_VALIDATORS
        return value

    def create(self, validated_data):
        # Créer l'utilisateur avec le mot de passe validé
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
    
    def create(self, validated_data):
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            image=validated_data.get('image', None),
        )
        return user