from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'status', 'status_badge']
    list_filter = ['status', 'location', 'date']
    search_fields = ['title', 'description', 'location']
    list_editable = ['spots_available', 'status']
    date_hierarchy = 'date'
    
    def status_badge(self, obj):
        colors = {
            'upcoming': '#FF9800',
            'ongoing': '#2196F3',
            'completed': '#4CAF50',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 15px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'is_active']
    list_filter = ['city', 'is_active']
    search_fields = ['user__username', 'phone', 'city']
    list_editable = ['total_points']
    list_per_page = 25

@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'points_earned', 'status', 'preferred_date']
    list_filter = ['status', 'waste_type', 'preferred_date']
    search_fields = ['volunteer__user__username', 'address']
    list_editable = ['status']
    list_per_page = 25

@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'mission', 'registered_date', 'status']
    list_filter = ['status', 'registered_date']
    search_fields = ['volunteer__user__username', 'mission__title']
    list_editable = ['status']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
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