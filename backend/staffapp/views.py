from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Staff, StaffDuty
from .serializers import StaffSerializer, StaffDutySerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

class StaffDutyViewSet(viewsets.ModelViewSet):
    queryset = StaffDuty.objects.all()
    serializer_class = StaffDutySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # If staff user, only show their duties
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            return StaffDuty.objects.filter(staff_id=staff_id)
        return StaffDuty.objects.all()

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_login(request):
    staff_id = request.data.get('staff_id')
    name = request.data.get('name')
    
    if not staff_id or not name:
        return Response({'error': 'Staff ID and Name required'}, status=400)
    
    try:
        staff = Staff.objects.get(id=staff_id, name=name)
        return Response({
            'success': True,
            'staff_id': staff.id,
            'name': staff.name,
            'staff': StaffSerializer(staff).data
        })
    except Staff.DoesNotExist:
        return Response({'error': 'Invalid Staff ID or Name'}, status=401)