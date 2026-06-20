from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Staff, MissionDuty, WastePickupDuty
from .serializers import StaffSerializer, MissionDutySerializer, WastePickupDutySerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

class MissionDutyViewSet(viewsets.ModelViewSet):
    queryset = MissionDuty.objects.all()
    serializer_class = MissionDutySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            return MissionDuty.objects.filter(staff_id=staff_id)
        return MissionDuty.objects.all()
    
    def perform_create(self, serializer):
        # Auto-set duty_date and duty_time from mission if not provided
        mission = self.request.data.get('mission')
        if mission:
            try:
                mission_obj = Mission.objects.get(id=mission)
                duty_date = self.request.data.get('duty_date') or mission_obj.date
                duty_time = self.request.data.get('duty_time') or mission_obj.time
                serializer.save(duty_date=duty_date, duty_time=duty_time)
            except Mission.DoesNotExist:
                serializer.save()
        else:
            serializer.save()

class WastePickupDutyViewSet(viewsets.ModelViewSet):
    queryset = WastePickupDuty.objects.all()
    serializer_class = WastePickupDutySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            return WastePickupDuty.objects.filter(staff_id=staff_id)
        return WastePickupDuty.objects.all()
    
    def perform_create(self, serializer):
        # Auto-set duty_date and duty_time from waste_pickup's preferred_date/time
        waste_pickup_id = self.request.data.get('waste_pickup')
        if waste_pickup_id:
            try:
                pickup = WastePickup.objects.get(id=waste_pickup_id)
                duty_date = self.request.data.get('duty_date') or pickup.preferred_date
                duty_time = self.request.data.get('duty_time') or pickup.preferred_time
                serializer.save(duty_date=duty_date, duty_time=duty_time)
            except WastePickup.DoesNotExist:
                serializer.save()
        else:
            serializer.save()

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    staff_id = request.data.get('staff_id')
    password = request.data.get('password')
    
    if not staff_id or not password:
        return Response({'error': 'Staff ID and Password required'}, status=400)
    
    try:
        staff = Staff.objects.get(id=staff_id)
        
        if not staff.password:
            return Response({'error': 'Password not set. Contact admin.'}, status=401)
        
        if not check_password(password, staff.password):
            return Response({'error': 'Invalid password'}, status=401)
        
        username = f"staff_{staff_id}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': staff.email or f"{username}@harithamission.org"}
        )
        if created:
            user.set_password(password)
            user.save()
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        return Response({
            'success': True,
            'staff_id': staff.id,
            'name': staff.name,
            'staff': StaffSerializer(staff).data,
            'access': access_token,
            'refresh': str(refresh)
        })
    except Staff.DoesNotExist:
        return Response({'error': 'Invalid Staff ID'}, status=401)