from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

class Media:
    css = {
        'all': ('admin/css/custom_admin.css',)
    }

# Custom admin header
admin.site.site_header = "🌿 HarithaMission Admin"
admin.site.site_title = "HarithaMission"
admin.site.index_title = "Dashboard"
admin.empty_value_display = '-'

# Custom User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'points_display', 'is_staff', 'is_active')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('username', 'email')
    
    def points_display(self, obj):
        try:
            volunteer = Volunteer.objects.get(user=obj)
            color = '#4CAF50' if volunteer.total_points > 100 else '#FF9800'
            return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 20px;">🏆 {}</span>', 
                             color, volunteer.total_points)
        except:
            return format_html('<span style="background: #999; color: white; padding: 3px 10px; border-radius: 20px;">0</span>')
    points_display.short_description = 'Eco Points'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Mission Admin
@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date', 'spots_available', 'status_badge')
    list_filter = ('status', 'location')
    search_fields = ('title',)
    
    def status_badge(self, obj):
        colors = {
            'ongoing': '#4CAF50',
            'completed': '#2196F3',
            'cancelled': '#F44336',
            'upcoming': '#FF9800'
        }
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 20px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

# Volunteer Admin
@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'city', 'points_badge', 'is_active_badge')
    list_filter = ('city', 'is_active')
    search_fields = ('user__username', 'phone')
    
    def points_badge(self, obj):
        color = '#4CAF50' if obj.total_points > 100 else '#FF9800'
        return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 20px;">🏆 {}</span>', 
                          color, obj.total_points)
    points_badge.short_description = 'Points'
    
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background: #4CAF50; color: white; padding: 3px 10px; border-radius: 20px;">✅ Active</span>')
        return format_html('<span style="background: #F44336; color: white; padding: 3px 10px; border-radius: 20px;">❌ Inactive</span>')
    is_active_badge.short_description = 'Status'

# Waste Pickup Admin
@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ('id', 'volunteer', 'waste_type_icon', 'status_badge', 'preferred_date')
    list_filter = ('status', 'waste_type')
    search_fields = ('volunteer__user__username',)
    
    def waste_type_icon(self, obj):
        icons = {'plastic': '♻️', 'paper': '📄', 'glass': '🥃', 'metal': '🔩', 
                'ewaste': '💻', 'organic': '🌿', 'mixed': '📦'}
        return f"{icons.get(obj.waste_type, '🗑️')} {obj.waste_type.title()}"
    waste_type_icon.short_description = 'Waste Type'
    
    def status_badge(self, obj):
        colors = {'pending': '#FF9800', 'confirmed': '#2196F3', 'completed': '#4CAF50', 'cancelled': '#F44336'}
        return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 20px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

# Contact Message Admin
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'read_badge')
    list_filter = ('is_read',)
    search_fields = ('name', 'email', 'subject')
    actions = ['mark_as_read']
    
    def read_badge(self, obj):
        if obj.is_read:
            return format_html('<span style="background: #4CAF50; color: white; padding: 3px 10px; border-radius: 20px;">✓ Read</span>')
        return format_html('<span style="background: #F44336; color: white; padding: 3px 10px; border-radius: 20px;">● Unread</span>')
    read_badge.short_description = 'Status'
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'✅ {updated} messages marked as read.')
    mark_as_read.short_description = 'Mark selected as read'

# Reward Admin
@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_badge', 'points_required', 'stock_badge', 'popular_badge')
    list_filter = ('category', 'is_popular')
    search_fields = ('name',)
    
    def category_badge(self, obj):
        colors = {'Eco Products': '#4CAF50', 'Merchandise': '#2196F3', 'Vouchers': '#FF9800', 'Events': '#9C27B0'}
        return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 20px;">{}</span>', 
                          colors.get(obj.category, '#999'), obj.category)
    category_badge.short_description = 'Category'
    
    def stock_badge(self, obj):
        if obj.stock <= 10:
            return format_html('<span style="background: #F44336; color: white; padding: 3px 10px; border-radius: 20px;">⚠️ {} left</span>', obj.stock)
        return format_html('<span style="background: #4CAF50; color: white; padding: 3px 10px; border-radius: 20px;">📦 {}</span>', obj.stock)
    stock_badge.short_description = 'Stock'
    
    def popular_badge(self, obj):
        if obj.is_popular:
            return format_html('<span style="background: #FF9800; color: white; padding: 3px 8px; border-radius: 20px;">🔥 Popular</span>')
        return '-'
    popular_badge.short_description = 'Popular'

# Reward Redemption Admin
@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'reward', 'points_spent', 'redeemed_date', 'status_badge')
    list_filter = ('status',)
    search_fields = ('volunteer__user__username',)
    
    def status_badge(self, obj):
        colors = {'pending': '#FF9800', 'completed': '#4CAF50', 'cancelled': '#F44336'}
        return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 20px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

# Mission Registration Admin
@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'mission', 'registered_date', 'status_badge')
    list_filter = ('status',)
    search_fields = ('volunteer__user__username',)
    
    def status_badge(self, obj):
        colors = {'registered': '#4CAF50', 'attended': '#2196F3', 'cancelled': '#F44336'}
        return format_html('<span style="background: {}; color: white; padding: 3px 10px; border-radius: 20px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'