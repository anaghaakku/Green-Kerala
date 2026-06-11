from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# Customize admin panel header
admin.site.site_header = "🌿 HarithaMission Admin Panel"
admin.site.site_title = "HarithaMission"
admin.site.index_title = "Welcome to HarithaMission Dashboard"

# Add custom CSS to admin
admin.site.index_template = None

class Media:
    css = {
        'all': ('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',)
    }

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'status', 'colored_status']
    list_filter = ['status', 'location']
    search_fields = ['title']
    list_editable = ['spots_available', 'status']
    
    def colored_status(self, obj):
        colors = {'upcoming': 'orange', 'ongoing': 'blue', 'completed': 'green', 'cancelled': 'red'}
        return format_html('<span style="background: {}; color: white; padding: 3px 8px; border-radius: 12px;">{}</span>', 
                          colors.get(obj.status, 'gray'), obj.status.upper())
    colored_status.short_description = 'Status'

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'active_badge']
    list_filter = ['city', 'is_active']
    search_fields = ['user__username', 'phone']
    list_editable = ['total_points']
    
    def active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background: green; color: white; padding: 3px 8px; border-radius: 12px;">Active</span>')
        return format_html('<span style="background: red; color: white; padding: 3px 8px; border-radius: 12px;">Inactive</span>')
    active_badge.short_description = 'Status'

@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'status', 'status_badge', 'preferred_date']
    list_filter = ['status', 'waste_type']
    search_fields = ['volunteer__user__username']
    list_editable = ['status']
    
    def status_badge(self, obj):
        colors = {'pending': 'orange', 'confirmed': 'blue', 'completed': 'green', 'cancelled': 'red'}
        return format_html('<span style="background: {}; color: white; padding: 3px 8px; border-radius: 12px;">{}</span>', 
                          colors.get(obj.status, 'gray'), obj.status.upper())
    status_badge.short_description = 'Status'

@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'mission', 'registered_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'read_badge']
    list_filter = ['is_read']
    search_fields = ['name', 'email']
    list_editable = ['is_read']
    
    def read_badge(self, obj):
        if obj.is_read:
            return format_html('<span style="background: green; color: white; padding: 3px 8px; border-radius: 12px;">✓ Read</span>')
        return format_html('<span style="background: red; color: white; padding: 3px 8px; border-radius: 12px;">● Unread</span>')
    read_badge.short_description = 'Status'

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock', 'icon_display']
    list_filter = ['category']
    search_fields = ['name']
    list_editable = ['points_required', 'stock']
    
    def icon_display(self, obj):
        return format_html('<span style="font-size: 20px;">{}</span>', obj.icon)
    icon_display.short_description = 'Icon'

@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
    list_filter = ['status']
    search_fields = ['volunteer__user__username']