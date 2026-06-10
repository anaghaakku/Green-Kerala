from django.contrib import admin
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# Don't import Staff from here - Staff is in staffapp

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'spots_total', 'status']
    list_filter = ['status', 'location', 'date']
    search_fields = ['title', 'description', 'location']
    list_editable = ['spots_available', 'status']
    date_hierarchy = 'date'

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'total_hours', 'joined_date']
    list_filter = ['city', 'joined_date', 'is_active']
    search_fields = ['user__username', 'user__email', 'phone', 'city']
    list_editable = ['total_points', 'total_hours']

@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'estimated_weight', 'points_earned', 'status', 'preferred_date']
    list_filter = ['status', 'waste_type', 'preferred_date', 'city']
    search_fields = ['volunteer__user__username', 'address', 'city']
    list_editable = ['status', 'points_earned']
    date_hierarchy = 'preferred_date'

@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'mission', 'registered_date', 'status', 'hours_contributed']
    list_filter = ['status', 'registered_date']
    search_fields = ['volunteer__user__username', 'mission__title']
    list_editable = ['status', 'hours_contributed']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock', 'is_popular']
    list_filter = ['category', 'is_popular']
    search_fields = ['name', 'description']
    list_editable = ['points_required', 'stock', 'is_popular']

@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
    list_filter = ['status', 'redeemed_date']
    search_fields = ['volunteer__user__username', 'reward__name']
    list_editable = ['status']