from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Staff, StaffDuty
from .serializers import StaffSerializer, StaffDutySerializer
from harithamission.models import Mission

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Staff.objects.all()
        return Staff.objects.filter(user=self.request.user)

class StaffDutyViewSet(viewsets.ModelViewSet):
    queryset = StaffDuty.objects.all()
    serializer_class = StaffDutySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return StaffDuty.objects.all()
        # Get staff profile for this user
        try:
            staff = Staff.objects.get(user=self.request.user)
            return StaffDuty.objects.filter(staff=staff)
        except Staff.DoesNotExist:
            return StaffDuty.objects.none()

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    staff_id = request.data.get('staff_id')
    password = request.data.get('password')
    
    try:
        staff = Staff.objects.get(id=staff_id)
        user = staff.user
        if user.check_password(password):
            # Generate JWT token
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'staff': StaffSerializer(staff).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        return Response({'error': 'Invalid credentials'}, status=401)
    except Staff.DoesNotExist:
        return Response({'error': 'Staff not found'}, status=404)