from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# ========== CUSTOM ADMIN HEADER ==========
admin.site.site_header = "🌿 HarithaMission Admin Panel"
admin.site.site_title = "HarithaMission"
admin.site.index_title = "Welcome to HarithaMission Dashboard"

# ========== CUSTOM USER ADMIN ==========
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'get_points', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    def get_points(self, obj):
        try:
            volunteer = Volunteer.objects.get(user=obj)
            return volunteer.total_points
        except:
            return 0
    get_points.short_description = 'Eco Points'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# ========== MISSION ADMIN ==========
@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'status']
    list_filter = ['status', 'location']
    search_fields = ['title']

# ========== VOLUNTEER ADMIN ==========
@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'is_active']
    list_filter = ['city', 'is_active']
    search_fields = ['user__username', 'phone']

# ========== WASTE PICKUP ADMIN ==========
@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'status', 'preferred_date']
    list_filter = ['status', 'waste_type']
    search_fields = ['volunteer__user__username']

# ========== MISSION REGISTRATION ADMIN ==========
@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'mission', 'registered_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']

# ========== CONTACT MESSAGE ADMIN ==========
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read']
    search_fields = ['name', 'email']

# ========== REWARD ADMIN ==========
@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock']
    list_filter = ['category']
    search_fields = ['name']

# ========== REWARD REDEMPTION ADMIN ==========
@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']