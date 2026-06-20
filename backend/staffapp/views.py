# from rest_framework import viewsets, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth.models import User
# from .models import Staff, MissionDuty, WastePickupDuty
# from .serializers import StaffSerializer, MissionDutySerializer, WastePickupDutySerializer

# class StaffViewSet(viewsets.ModelViewSet):
#     queryset = Staff.objects.all()
#     serializer_class = StaffSerializer
#     permission_classes = [IsAuthenticated]

# class MissionDutyViewSet(viewsets.ModelViewSet):
#     queryset = MissionDuty.objects.all()
#     serializer_class = MissionDutySerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         staff_id = self.request.query_params.get('staff_id')
#         if staff_id:
#             return MissionDuty.objects.filter(staff_id=staff_id)
#         return MissionDuty.objects.all()

# class WastePickupDutyViewSet(viewsets.ModelViewSet):
#     queryset = WastePickupDuty.objects.all()
#     serializer_class = WastePickupDutySerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         staff_id = self.request.query_params.get('staff_id')
#         if staff_id:
#             return WastePickupDuty.objects.filter(staff_id=staff_id)
#         return WastePickupDuty.objects.all()

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def staff_login(request):
#     staff_id = request.data.get('staff_id')
#     name = request.data.get('name')
    
#     if not staff_id or not name:
#         return Response({'error': 'Staff ID and Name required'}, status=400)
    
#     try:
#         staff = Staff.objects.get(id=staff_id, name=name)
        
#         # Create or get user for token
#         username = f"staff_{staff_id}"
#         user, created = User.objects.get_or_create(
#             username=username,
#             defaults={'email': staff.email or f"{username}@harithamission.org"}
#         )
#         if created:
#             user.set_password(f"staff_{staff_id}_pass")
#             user.save()
        
#         # Generate token
#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)
        
#         return Response({
#             'success': True,
#             'staff_id': staff.id,
#             'name': staff.name,
#             'staff': StaffSerializer(staff).data,
#             'access': access_token,
#             'refresh': str(refresh)
#         })
#     except Staff.DoesNotExist:
#         return Response({'error': 'Invalid Staff ID or Name'}, status=401)

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
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
    password = request.data.get('password')  # Changed from 'name' to 'password'
    
    if not staff_id or not password:
        return Response({'error': 'Staff ID and Password required'}, status=400)
    
    try:
        staff = Staff.objects.get(id=staff_id)
        
        # Check if password is set
        if not staff.password:
            return Response({'error': 'Password not set. Please contact admin.'}, status=401)
        
        # Verify password
        if not check_password(password, staff.password):
            return Response({'error': 'Invalid password'}, status=401)
        
        # Create or get user for token
        username = f"staff_{staff_id}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': staff.email or f"{username}@harithamission.org"}
        )
        if created:
            user.set_password(password)
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
        return Response({'error': 'Invalid Staff ID'}, status=401)