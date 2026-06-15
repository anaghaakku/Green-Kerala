from rest_framework import generics, viewsets,serializers
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Reward, RewardRedemption, Volunteer,MissionRegistration
from .serializers import RewardRedemptionSerializer,MissionRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Reward, RewardRedemption, Volunteer
from .serializers import RewardRedemptionSerializer
from .models import Mission, Volunteer, WastePickup, ContactMessage, Reward, RewardRedemption, MissionRegistration
from .serializers import (
    MissionSerializer, VolunteerSerializer, WastePickupSerializer,
    ContactMessageSerializer, UserSerializer, RewardSerializer, RewardRedemptionSerializer,
    RegisterSerializer, MissionRegistrationSerializer
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import generics, viewsets, serializers, status  
from .models import Mission, Volunteer, WastePickup, ContactMessage, Reward, RewardRedemption
from .serializers import (
    MissionSerializer, VolunteerSerializer, WastePickupSerializer,
    ContactMessageSerializer, UserSerializer, RewardSerializer, RewardRedemptionSerializer,
    RegisterSerializer
)

# ========== AUTHENTICATION VIEWS ==========

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(UserSerializer(request.user).data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    return Response({
        'total_volunteers': Volunteer.objects.count(),
        'total_pickups': WastePickup.objects.count(),
        'total_rewards': Reward.objects.count(),
        'total_points': Volunteer.objects.aggregate(Sum('total_points'))['total_points__sum'] or 0,
        'total_missions': Mission.objects.count(),
        'total_redemptions': RewardRedemption.objects.count(),
    })

# ========== TEST REGISTER ENDPOINT ==========

@api_view(['POST'])
@permission_classes([AllowAny])
def test_register(request):
    """Test registration endpoint to verify password hashing"""
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not email or not password:
            return Response({'error': 'Missing fields'}, status=400)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        Volunteer.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'username': user.username,
            'message': 'User created successfully'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# ========== USER MANAGEMENT VIEWS (Admin Only) ==========

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_all_users(request):
    users = User.objects.all().values('id', 'username', 'email', 'is_active', 'date_joined')
    user_list = []
    for user in users:
        try:
            volunteer = Volunteer.objects.get(user_id=user['id'])
            user['total_points'] = volunteer.total_points
            user['total_pickups'] = WastePickup.objects.filter(volunteer=volunteer).count()
        except Volunteer.DoesNotExist:
            user['total_points'] = 0
            user['total_pickups'] = 0
        user_list.append(user)
    return Response(user_list)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def block_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        status = 'blocked' if not user.is_active else 'unblocked'
        return Response({'success': True, 'message': f'User {status} successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def make_admin(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_staff = True
        user.save()
        return Response({'success': True, 'message': f'{user.username} is now an admin'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def remove_admin(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_staff = False
        user.save()
        return Response({'success': True, 'message': f'Admin privileges removed from {user.username}'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

# ========== VOLUNTEER PROFILE VIEWS ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_profile(request):
    """Get volunteer profile with points for the logged-in user"""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        return Response({
            'total_points': volunteer.total_points,
            'total_pickups': WastePickup.objects.filter(volunteer=volunteer).count(),
            'total_hours': volunteer.total_hours,
            'joined_date': volunteer.joined_date,
            'is_active': volunteer.is_active
        })
    except Volunteer.DoesNotExist:
        # Create volunteer profile if it doesn't exist
        volunteer = Volunteer.objects.create(user=request.user)
        return Response({
            'total_points': 0,
            'total_pickups': 0,
            'total_hours': 0,
            'joined_date': volunteer.joined_date,
            'is_active': volunteer.is_active
        })

# ========== MISSION VIEWS ==========

class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]

# ========== WASTE PICKUP VIEWS ==========

class WastePickupViewSet(viewsets.ModelViewSet):
    queryset = WastePickup.objects.all()
    serializer_class = WastePickupSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return WastePickup.objects.all()
        return WastePickup.objects.filter(volunteer__user=self.request.user)
    
    def perform_create(self, serializer):
        volunteer, _ = Volunteer.objects.get_or_create(user=self.request.user)
        pickup = serializer.save(volunteer=volunteer)
        points = pickup.calculate_points()
        pickup.points_earned = points
        pickup.save()
        volunteer.total_points += points
        volunteer.save()
# ========== CONTACT MESSAGE VIEWS ==========

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Create contact message with logging"""
        print("=" * 50)
        print("📧 Contact Message Received:")
        print(f"Name: {request.data.get('name')}")
        print(f"Email: {request.data.get('email')}")
        print(f"Subject: {request.data.get('subject')}")
        print(f"Message: {request.data.get('message')}")
        print("=" * 50)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            print("✅ Message saved to database!")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("❌ Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# ========== REWARD VIEWS ==========

class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer
    permission_classes = [AllowAny]

# ========== REWARD REDEMPTION VIEWS ==========
class RewardRedemptionViewSet(viewsets.ModelViewSet):
    queryset = RewardRedemption.objects.all()
    serializer_class = RewardRedemptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return RewardRedemption.objects.all()
        return RewardRedemption.objects.filter(volunteer__user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Get reward ID
        reward_id = request.data.get('reward') or request.data.get('reward_id')
        
        if not reward_id:
            return Response(
                {"error": "reward id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            reward = Reward.objects.get(id=reward_id)
        except Reward.DoesNotExist:
            return Response(
                {"error": "Reward not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        volunteer, _ = Volunteer.objects.get_or_create(user=request.user)
        
        # Check points and stock
        if volunteer.total_points < reward.points_required:
            return Response(
                {"error": f"Insufficient points. Need {reward.points_required}, you have {volunteer.total_points}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if reward.stock <= 0:
            return Response(
                {"error": "Reward out of stock"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create redemption
        redemption = RewardRedemption.objects.create(
            volunteer=volunteer,
            reward=reward,
            points_spent=reward.points_required,
            status='completed'
        )
        
        # Update points and stock
        volunteer.total_points -= reward.points_required
        volunteer.save()
        reward.stock -= 1
        reward.save()
        
        # Return custom response
        return Response({
            'id': redemption.id,
            'points_spent': redemption.points_spent,
            'redeemed_date': redemption.redeemed_date,
            'status': redemption.status,
            'message': f'Successfully redeemed {reward.name}!'
        }, status=status.HTTP_201_CREATED)
    
class MissionRegistrationViewSet(viewsets.ModelViewSet):
    queryset = MissionRegistration.objects.all()
    serializer_class = MissionRegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return MissionRegistration.objects.all()
        return MissionRegistration.objects.filter(volunteer__user=self.request.user)
    
    def perform_create(self, serializer):
        volunteer, _ = Volunteer.objects.get_or_create(user=self.request.user)
        serializer.save(volunteer=volunteer)

class VolunteerViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing volunteers"""
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [AllowAny]  # Allow anyone to view volunteers for leaderboard
    
    def get_queryset(self):
        # Return all volunteers, ordered by total_points descending
        return Volunteer.objects.all().order_by('-total_points')
    

# ========== TEMPORARY ADMIN CREATION (REMOVE AFTER USE) ==========
@api_view(['GET'])
@permission_classes([AllowAny])
def create_admin_superuser(request):
    """Create admin superuser - remove this after first use"""
    try:
        # Try to get existing admin user
        user, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@harithamission.org'})
        user.set_password('admin123')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        return Response({
            'success': True,
            'username': 'admin',
            'password': 'admin123',
            'message': 'Admin superuser created/updated successfully!',
            'created': created
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)