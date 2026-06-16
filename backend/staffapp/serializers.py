from rest_framework import serializers
from .models import Staff, MissionDuty, WastePickupDuty
from harithamission.models import Mission, WastePickup

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ['id', 'name', 'phone', 'email', 'role', 'is_available', 'profile_picture', 'joined_date']

class MissionDutySerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    mission_title = serializers.CharField(source='mission.title', read_only=True)
    mission_location = serializers.CharField(source='mission.location', read_only=True)
    
    class Meta:
        model = MissionDuty
        fields = ['id', 'staff', 'staff_name', 'mission', 'mission_title', 'mission_location', 
                  'duty_date', 'duty_time', 'status', 'notes', 'assigned_date']

class WastePickupDutySerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    pickup_address = serializers.CharField(source='waste_pickup.address', read_only=True)
    pickup_city = serializers.CharField(source='waste_pickup.city', read_only=True)
    
    class Meta:
        model = WastePickupDuty
        fields = ['id', 'staff', 'staff_name', 'waste_pickup', 'pickup_address', 'pickup_city',
                  'duty_date', 'duty_time', 'status', 'notes', 'assigned_date']