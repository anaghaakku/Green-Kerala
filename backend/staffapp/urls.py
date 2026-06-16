from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('staff', views.StaffViewSet)
router.register('mission-duties', views.MissionDutyViewSet)
router.register('waste-pickup-duties', views.WastePickupDutyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('staff-login/', views.staff_login, name='staff-login'),
]