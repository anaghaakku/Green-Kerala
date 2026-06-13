from rest_framework import serializers
from rest_framework import serializers
from .models import RewardRedemption

from django.contrib.auth.models import User
from .models import Mission, Volunteer, WastePickup, MissionRegistration, ContactMessage, Reward, RewardRedemption

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'phone', 'city']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists"})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists"})
        
        return data
    
    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        city = validated_data.pop('city', '')
        validated_data.pop('confirm_password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Create volunteer profile with phone and city
        volunteer, created = Volunteer.objects.get_or_create(
            user=user,
            defaults={
                'phone': phone,
                'city': city,
                'total_points': 0,
                'total_hours': 0,
                'is_active': True
            }
        )
        
        if not created and (phone or city):
            if phone:
                volunteer.phone = phone
            if city:
                volunteer.city = city
            volunteer.save()
        
        return user

class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = '__all__'

class VolunteerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Volunteer
        fields = '__all__'

class WastePickupSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.user.username', read_only=True)
    
    class Meta:
        model = WastePickup
        fields = '__all__'
        read_only_fields = ['volunteer', 'points_earned', 'created_at']
        
class MissionRegistrationSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.user.username', read_only=True)
    mission_title = serializers.CharField(source='mission.title', read_only=True)
    
    class Meta:
        model = MissionRegistration
        fields = '__all__'
        read_only_fields = ['volunteer', 'registered_date']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at', 'is_read']
class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'

class RewardRedemptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardRedemption
        fields = ['id', 'points_spent', 'redeemed_date', 'status']
        read_only_fields = ['volunteer', 'points_spent', 'redeemed_date']  
    
    def validate_reward(self, value):
        """Validate reward stock"""
        if value.stock <= 0:
            raise serializers.ValidationError("This reward is out of stock")
        return value