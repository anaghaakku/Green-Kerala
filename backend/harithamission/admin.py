# from django.contrib import admin
# from django.utils.html import format_html
# from .models import (
#     Mission, Volunteer, WastePickup, MissionRegistration,
#     ContactMessage, Reward, RewardRedemption
# )

# # Custom admin header
# admin.site.site_header = "🌿 HarithaMission Admin Panel"
# admin.site.site_title = "HarithaMission"
# admin.site.index_title = "Welcome to HarithaMission Dashboard"

# @admin.register(Mission)
# class MissionAdmin(admin.ModelAdmin):
#     list_display = ['title', 'location', 'date', 'spots_available', 'status']
#     list_filter = ['status', 'location']
#     search_fields = ['title']

# @admin.register(Volunteer)
# class VolunteerAdmin(admin.ModelAdmin):
#     list_display = ['user', 'phone', 'city', 'total_points', 'is_active']
#     list_filter = ['city', 'is_active']
#     search_fields = ['user__username', 'phone']

# @admin.register(WastePickup)
# class WastePickupAdmin(admin.ModelAdmin):
#     list_display = ['id', 'volunteer', 'waste_type', 'status', 'preferred_date']
#     list_filter = ['status', 'waste_type']
#     search_fields = ['volunteer__user__username']

# @admin.register(MissionRegistration)
# class MissionRegistrationAdmin(admin.ModelAdmin):
#     list_display = ['volunteer', 'mission', 'registered_date', 'status']
#     list_filter = ['status']
#     search_fields = ['volunteer__user__username']

# @admin.register(ContactMessage)
# class ContactMessageAdmin(admin.ModelAdmin):
#     list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
#     list_filter = ['is_read']
#     search_fields = ['name', 'email']

# @admin.register(Reward)
# class RewardAdmin(admin.ModelAdmin):
#     list_display = ['name', 'category', 'points_required', 'stock']
#     list_filter = ['category']
#     search_fields = ['name']

# @admin.register(RewardRedemption)
# class RewardRedemptionAdmin(admin.ModelAdmin):
#     list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
#     list_filter = ['status']
#     search_fields = ['volunteer__user__username']

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# ========== CUSTOM USER ADMIN (REMOVES FIRST_NAME & LAST_NAME) ==========
class CustomUserAdmin(UserAdmin):
    """Custom User Admin without first_name and last_name"""
    
    list_display = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email',)}),  # Removed first_name, last_name
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    search_fields = ('username', 'email')
    ordering = ('username',)

# Unregister default User admin and register custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# ========== CUSTOM ADMIN HEADER ==========
admin.site.site_header = "🌿 HarithaMission Admin Panel"
admin.site.site_title = "HarithaMission"
admin.site.index_title = "Welcome to HarithaMission Dashboard"

# ========== MODEL ADMINS ==========
@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'status']
    list_filter = ['status', 'location']
    search_fields = ['title']

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'is_active']
    list_filter = ['city', 'is_active']
    search_fields = ['user__username', 'phone']

@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'status', 'preferred_date']
    list_filter = ['status', 'waste_type']
    search_fields = ['volunteer__user__username']

@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'mission', 'registered_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read']
    search_fields = ['name', 'email']

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock']
    list_filter = ['category']
    search_fields = ['name']

@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']