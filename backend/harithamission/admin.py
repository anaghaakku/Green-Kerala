from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# Customize Admin Panel Header
admin.site.site_header = "🌿 HarithaMission Admin Panel"
admin.site.site_title = "HarithaMission"
admin.site.index_title = "Welcome to HarithaMission Dashboard"

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'status', 'colored_status']
    list_filter = ['status', 'location']
    search_fields = ['title']
    list_editable = ['spots_available', 'status']
    
    def colored_status(self, obj):
        colors = {'upcoming': 'orange', 'ongoing': 'blue', 'completed': 'green', 'cancelled': 'red'}
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', 
                          colors.get(obj.status, 'gray'), obj.status.upper())
    colored_status.short_description = 'Status'

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'is_active']
    list_filter = ['city', 'is_active']
    search_fields = ['user__username', 'phone']
    list_editable = ['total_points']

@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'status', 'preferred_date']
    list_filter = ['status', 'waste_type']
    search_fields = ['volunteer__user__username']
    list_editable = ['status']

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
    list_editable = ['is_read']

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock']
    list_filter = ['category']
    search_fields = ['name']
    list_editable = ['points_required', 'stock']

@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']