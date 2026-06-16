# from django.db import models
# from django.contrib.auth.models import User
# from harithamission.models import Mission, WastePickup

# class Staff(models.Model):
#     name = models.CharField(max_length=100)
#     phone = models.CharField(max_length=15)
#     email = models.EmailField()
#     role = models.CharField(max_length=50, choices=[
#         ('collection', 'Collection Staff'),
#         ('driver', 'Driver'),
#         ('supervisor', 'Supervisor'),
#         ('manager', 'Manager')
#     ], default='collection')
#     is_available = models.BooleanField(default=True)
#     profile_picture = models.ImageField(upload_to='staff/', null=True, blank=True)
#     joined_date = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return f"{self.id} - {self.name}"

# class MissionDuty(models.Model):
#     staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='mission_duties')
#     mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='staff_duties')
#     duty_date = models.DateField()
#     duty_time = models.TimeField()
#     status = models.CharField(max_length=20, choices=[
#         ('pending', 'Pending'),
#         ('confirmed', 'Confirmed'),
#         ('in_progress', 'In Progress'),
#         ('completed', 'Completed'),
#         ('cancelled', 'Cancelled')
#     ], default='pending')
#     notes = models.TextField(blank=True)
#     assigned_date = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return f"{self.staff.name} - {self.mission.title} ({self.duty_date})"

# class WastePickupDuty(models.Model):
#     staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='waste_duties')
#     waste_pickup = models.ForeignKey(WastePickup, on_delete=models.CASCADE, related_name='staff_duties')
#     duty_date = models.DateField()
#     duty_time = models.TimeField()
#     status = models.CharField(max_length=20, choices=[
#         ('pending', 'Pending'),
#         ('confirmed', 'Confirmed'),
#         ('in_progress', 'In Progress'),
#         ('completed', 'Completed'),
#         ('cancelled', 'Cancelled')
#     ], default='pending')
#     notes = models.TextField(blank=True)
#     assigned_date = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return f"{self.staff.name} - Pickup #{self.waste_pickup.id} ({self.duty_date})"


from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
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

class WastePickupDutyViewSet(viewsets.ModelViewSet):
    queryset = WastePickupDuty.objects.all()
    serializer_class = WastePickupDutySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            return WastePickupDuty.objects.filter(staff_id=staff_id)
        return WastePickupDuty.objects.all()

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    staff_id = request.data.get('staff_id')
    name = request.data.get('name')
    
    if not staff_id or not name:
        return Response({'error': 'Staff ID and Name required'}, status=400)
    
    try:
        staff = Staff.objects.get(id=staff_id, name=name)
        
        # Create or get user for token
        username = f"staff_{staff_id}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': staff.email or f"{username}@harithamission.org"}
        )
        if created:
            user.set_password(f"staff_{staff_id}_pass")
            user.save()
        
        # Generate token
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
        return Response({'error': 'Invalid Staff ID or Name'}, status=401)