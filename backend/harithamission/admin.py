from django.contrib import admin
from django.utils.html import format_html
from django.contrib.admin import AdminSite
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# ========== CUSTOM ADMIN SITE WITH BRANDING ==========

class HarithaMissionAdminSite(AdminSite):
    site_header = format_html('<span style="color: #4CAF50; font-size: 24px;">🌿 HarithaMission</span> Admin Panel')
    site_title = "HarithaMission Admin"
    index_title = format_html('<div style="text-align: center;"><h2>Welcome to HarithaMission Dashboard</h2><p style="color: green;">🌍 Together for a Greener Kerala</p></div>')
    site_url = "/"

admin_site = HarithaMissionAdminSite(name='harithamission_admin')

# ========== REGISTER MODELS WITH CUSTOM ADMIN SITE ==========

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'date', 'spots_available', 'status', 'status_badge']
    list_filter = ['status', 'location', 'date']
    search_fields = ['title', 'description', 'location']
    list_editable = ['spots_available', 'status']
    date_hierarchy = 'date'
    list_per_page = 25
    
    def status_badge(self, obj):
        colors = {
            'upcoming': '#FF9800',
            'ongoing': '#2196F3',
            'completed': '#4CAF50',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 3px 12px; border-radius: 20px; font-size: 12px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'total_points', 'points_badge', 'is_active']
    list_filter = ['city', 'is_active', 'joined_date']
    search_fields = ['user__username', 'user__email', 'phone', 'city']
    list_editable = ['total_points']
    list_per_page = 25
    
    def points_badge(self, obj):
        if obj.total_points >= 500:
            color = '#4CAF50'
            medal = '🏆'
        elif obj.total_points >= 100:
            color = '#FF9800'
            medal = '⭐'
        else:
            color = '#9E9E9E'
            medal = '🌱'
        return format_html('<span style="background: {}; color: white; padding: 3px 12px; border-radius: 20px;">{} {} pts</span>', 
                          color, medal, obj.total_points)
    points_badge.short_description = 'Points'

@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ['id', 'volunteer', 'waste_type', 'points_earned', 'status', 'status_badge', 'preferred_date']
    list_filter = ['status', 'waste_type', 'preferred_date', 'city']
    search_fields = ['volunteer__user__username', 'address', 'city']
    list_editable = ['status']
    date_hierarchy = 'preferred_date'
    list_per_page = 25
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FF9800',
            'confirmed': '#2196F3',
            'completed': '#4CAF50',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 3px 12px; border-radius: 20px; font-size: 12px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'mission', 'registered_date', 'status', 'status_badge']
    list_filter = ['status', 'registered_date']
    search_fields = ['volunteer__user__username', 'mission__title']
    list_editable = ['status']
    list_per_page = 25
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FF9800',
            'approved': '#4CAF50',
            'completed': '#2196F3',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 3px 12px; border-radius: 20px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read', 'read_badge']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    list_per_page = 25
    
    def read_badge(self, obj):
        if obj.is_read:
            return format_html('<span style="background: #4CAF50; color: white; padding: 3px 12px; border-radius: 20px;">✓ Read</span>')
        return format_html('<span style="background: #F44336; color: white; padding: 3px 12px; border-radius: 20px;">● Unread</span>')
    read_badge.short_description = 'Status'

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_required', 'stock', 'is_popular', 'icon_display']
    list_filter = ['category', 'is_popular']
    search_fields = ['name', 'description']
    list_editable = ['points_required', 'stock', 'is_popular']
    list_per_page = 25
    
    def icon_display(self, obj):
        return format_html('<span style="font-size: 24px;">{}</span>', obj.icon)
    icon_display.short_description = 'Icon'

@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'reward', 'points_spent', 'redeemed_date', 'status']
    list_filter = ['status', 'redeemed_date']
    search_fields = ['volunteer__user__username', 'reward__name']
    list_editable = ['status']
    list_per_page = 25