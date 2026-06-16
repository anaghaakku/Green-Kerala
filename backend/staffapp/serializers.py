from rest_framework import serializers
from .models import Staff, StaffDuty
from harithamission.models import Mission

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ['id', 'user', 'name', 'phone', 'email', 'role', 'is_available', 'profile_picture', 'joined_date']

class StaffDutySerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    mission_title = serializers.CharField(source='mission.title', read_only=True)
    mission_location = serializers.CharField(source='mission.location', read_only=True)
    
    class Meta:
        model = StaffDuty
        fields = ['id', 'staff', 'staff_name', 'mission', 'mission_title', 'mission_location', 
                  'duty_date', 'duty_time', 'status', 'notes', 'assigned_date']