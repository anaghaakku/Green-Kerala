from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register('missions', views.MissionViewSet)
router.register('pickups', views.WastePickupViewSet)
router.register('contact', views.ContactMessageViewSet)
router.register('rewards', views.RewardViewSet)
router.register('redemptions', views.RewardRedemptionViewSet)
router.register('mission-registrations', views.MissionRegistrationViewSet)  


urlpatterns = [
    path('', include(router.urls)),
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('test-register/', views.test_register, name='test-register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.get_current_user, name='me'),
    path('volunteer-profile/', views.get_volunteer_profile, name='volunteer-profile'),
    # Admin
    path('admin-stats/', views.admin_stats, name='admin-stats'),
    path('users/', views.list_all_users, name='list-users'),
    path('block-user/<int:user_id>/', views.block_user, name='block-user'),
    path('make-admin/<int:user_id>/', views.make_admin, name='make-admin'),
    path('remove-admin/<int:user_id>/', views.remove_admin, name='remove-admin'),
]