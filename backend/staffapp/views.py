from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .models import Staff
from .serializers import StaffSerializer
import json

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAdminUser]

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    try:
        # Get data from request
        staff_id = request.data.get('staff_id')
        name = request.data.get('name')
        
        print("Staff login attempt:", staff_id, name)  # Debug print
        
        if not staff_id or not name:
            return Response({
                'success': False, 
                'error': 'Staff ID and Name are required'
            }, status=400)
        
        # Convert staff_id to integer
        try:
            staff_id = int(staff_id)
        except ValueError:
            return Response({
                'success': False, 
                'error': 'Invalid Staff ID'
            }, status=400)
        
        # Find staff member
        try:
            staff = Staff.objects.get(id=staff_id, name=name)
            return Response({
                'success': True,
                'staff_id': staff.id,
                'name': staff.name,
                'is_available': staff.is_available
            })
        except Staff.DoesNotExist:
            return Response({
                'success': False, 
                'error': 'Invalid Staff ID or Name'
            }, status=401)
            
    except Exception as e:
        print("Error in staff_login:", str(e))  # Debug print
        return Response({
            'success': False, 
            'error': str(e)
        }, status=500)