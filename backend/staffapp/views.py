# # from rest_framework import viewsets, status
# # from rest_framework.decorators import api_view, permission_classes
# # from rest_framework.permissions import IsAuthenticated, AllowAny
# # from rest_framework.response import Response
# # from rest_framework_simplejwt.tokens import RefreshToken
# # from django.contrib.auth.models import User
# # from .models import Staff, MissionDuty, WastePickupDuty
# # from .serializers import StaffSerializer, MissionDutySerializer, WastePickupDutySerializer

# # class StaffViewSet(viewsets.ModelViewSet):
# #     queryset = Staff.objects.all()
# #     serializer_class = StaffSerializer
# #     permission_classes = [IsAuthenticated]

# # class MissionDutyViewSet(viewsets.ModelViewSet):
# #     queryset = MissionDuty.objects.all()
# #     serializer_class = MissionDutySerializer
# #     permission_classes = [IsAuthenticated]
    
# #     def get_queryset(self):
# #         staff_id = self.request.query_params.get('staff_id')
# #         if staff_id:
# #             return MissionDuty.objects.filter(staff_id=staff_id)
# #         return MissionDuty.objects.all()

# # class WastePickupDutyViewSet(viewsets.ModelViewSet):
# #     queryset = WastePickupDuty.objects.all()
# #     serializer_class = WastePickupDutySerializer
# #     permission_classes = [IsAuthenticated]
    
# #     def get_queryset(self):
# #         staff_id = self.request.query_params.get('staff_id')
# #         if staff_id:
# #             return WastePickupDuty.objects.filter(staff_id=staff_id)
# #         return WastePickupDuty.objects.all()

# # @api_view(['POST'])
# # @permission_classes([AllowAny])
# # def staff_login(request):
# #     staff_id = request.data.get('staff_id')
# #     name = request.data.get('name')
    
# #     if not staff_id or not name:
# #         return Response({'error': 'Staff ID and Name required'}, status=400)
    
# #     try:
# #         staff = Staff.objects.get(id=staff_id, name=name)
        
# #         # Create or get user for token
# #         username = f"staff_{staff_id}"
# #         user, created = User.objects.get_or_create(
# #             username=username,
# #             defaults={'email': staff.email or f"{username}@harithamission.org"}
# #         )
# #         if created:
# #             user.set_password(f"staff_{staff_id}_pass")
# #             user.save()
        
# #         # Generate token
# #         refresh = RefreshToken.for_user(user)
# #         access_token = str(refresh.access_token)
        
# #         return Response({
# #             'success': True,
# #             'staff_id': staff.id,
# #             'name': staff.name,
# #             'staff': StaffSerializer(staff).data,
# #             'access': access_token,
# #             'refresh': str(refresh)
# #         })
# #     except Staff.DoesNotExist:
# #         return Response({'error': 'Invalid Staff ID or Name'}, status=401)

# from rest_framework import viewsets, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import check_password
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
#     password = request.data.get('password')  # Changed from 'name' to 'password'
    
#     if not staff_id or not password:
#         return Response({'error': 'Staff ID and Password required'}, status=400)
    
#     try:
#         staff = Staff.objects.get(id=staff_id)
        
#         # Check if password is set
#         if not staff.password:
#             return Response({'error': 'Password not set. Please contact admin.'}, status=401)
        
#         # Verify password
#         if not check_password(password, staff.password):
#             return Response({'error': 'Invalid password'}, status=401)
        
#         # Create or get user for token
#         username = f"staff_{staff_id}"
#         user, created = User.objects.get_or_create(
#             username=username,
#             defaults={'email': staff.email or f"{username}@harithamission.org"}
#         )
#         if created:
#             user.set_password(password)
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
#         return Response({'error': 'Invalid Staff ID'}, status=401)




from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import datetime
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
        # Auto-set duty_date and duty_time if not provided
        if not self.request.data.get('duty_date'):
            # Set to tomorrow if no date provided
            tomorrow = timezone.now().date() + timezone.timedelta(days=1)
            serializer.save(duty_date=tomorrow)
        else:
            serializer.save()
    
    @action(detail=False, methods=['post'])
    def assign_mission(self, request):
        """Assign mission duty to staff with auto date/time"""
        staff_id = request.data.get('staff_id')
        mission_id = request.data.get('mission_id')
        
        if not staff_id or not mission_id:
            return Response({'error': 'Staff ID and Mission ID required'}, status=400)
        
        try:
            staff = Staff.objects.get(id=staff_id)
            mission = Mission.objects.get(id=mission_id)
            
            # Auto-set date to tomorrow, time to 9:00 AM
            tomorrow = timezone.now().date() + timezone.timedelta(days=1)
            default_time = timezone.now().time().replace(hour=9, minute=0, second=0)
            
            duty = MissionDuty.objects.create(
                staff=staff,
                mission=mission,
                duty_date=tomorrow,
                duty_time=default_time,
                status='pending'
            )
            
            return Response({
                'success': True,
                'message': f'Mission assigned to {staff.name}',
                'duty': MissionDutySerializer(duty).data
            })
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=404)
        except Mission.DoesNotExist:
            return Response({'error': 'Mission not found'}, status=404)

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
        # Auto-set duty_date and duty_time if not provided
        if not self.request.data.get('duty_date'):
            tomorrow = timezone.now().date() + timezone.timedelta(days=1)
            serializer.save(duty_date=tomorrow)
        else:
            serializer.save()
    
    @action(detail=False, methods=['post'])
    def assign_pickup(self, request):
        """Assign waste pickup duty to staff with auto date/time"""
        staff_id = request.data.get('staff_id')
        pickup_id = request.data.get('pickup_id')
        
        if not staff_id or not pickup_id:
            return Response({'error': 'Staff ID and Pickup ID required'}, status=400)
        
        try:
            staff = Staff.objects.get(id=staff_id)
            pickup = WastePickup.objects.get(id=pickup_id)
            
            # Auto-set date to tomorrow, time to 10:00 AM
            tomorrow = timezone.now().date() + timezone.timedelta(days=1)
            default_time = timezone.now().time().replace(hour=10, minute=0, second=0)
            
            duty = WastePickupDuty.objects.create(
                staff=staff,
                waste_pickup=pickup,
                duty_date=tomorrow,
                duty_time=default_time,
                status='pending'
            )
            
            return Response({
                'success': True,
                'message': f'Pickup assigned to {staff.name}',
                'duty': WastePickupDutySerializer(duty).data
            })
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=404)
        except WastePickup.DoesNotExist:
            return Response({'error': 'Pickup not found'}, status=404)

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