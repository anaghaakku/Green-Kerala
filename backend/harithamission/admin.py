from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.urls import reverse
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
    list_display = ('username', 'email', 'points_display', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'date_joined')
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
    
    def points_display(self, obj):
        try:
            volunteer = Volunteer.objects.get(user=obj)
            return format_html('<span style="color: #4CAF50; font-weight: bold;">🏆 {}</span>', volunteer.total_points)
        except:
            return format_html('<span style="color: #999;">0</span>')
    points_display.short_description = 'Eco Points'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# ========== MISSION ADMIN ==========
@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date_display', 'spots_available', 'status_badge', 'registered_count')
    list_filter = ('status', 'location', 'date')
    search_fields = ('title', 'location')
    list_editable = ('spots_available',)
    list_per_page = 20
    date_hierarchy = 'date'
    
    def date_display(self, obj):
        return obj.date.strftime('%d %b %Y')
    date_display.short_description = 'Date'
    
    def status_badge(self, obj):
        colors = {
            'ongoing': '#4CAF50',
            'completed': '#2196F3',
            'cancelled': '#F44336',
            'upcoming': '#FF9800'
        }
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'
    
    def registered_count(self, obj):
        count = MissionRegistration.objects.filter(mission=obj).count()
        return format_html('<span style="font-weight: bold; color: #2196F3;">👥 {}</span>', count)
    registered_count.short_description = 'Registered'

# ========== VOLUNTEER ADMIN ==========
@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('user_link', 'phone', 'city', 'points_display', 'pickups_count', 'is_active_badge')
    list_filter = ('city', 'is_active')
    search_fields = ('user__username', 'phone', 'city')
    readonly_fields = ('total_points', 'total_hours', 'joined_date')
    list_per_page = 20
    
    def user_link(self, obj):
        return format_html('<span style="font-weight: bold;">🌿 {}</span>', obj.user.username)
    user_link.short_description = 'Volunteer'
    
    def points_display(self, obj):
        return format_html('<span style="color: #4CAF50; font-weight: bold;">🏆 {}</span>', obj.total_points)
    points_display.short_description = 'Points'
    
    def pickups_count(self, obj):
        count = WastePickup.objects.filter(volunteer=obj).count()
        return format_html('<span style="color: #2196F3;">🗑️ {}</span>', count)
    pickups_count.short_description = 'Pickups'
    
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">✅ Active</span>')
        return format_html('<span style="background: #F44336; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">❌ Inactive</span>')
    is_active_badge.short_description = 'Status'

# ========== WASTE PICKUP ADMIN ==========
@admin.register(WastePickup)
class WastePickupAdmin(admin.ModelAdmin):
    list_display = ('id', 'volunteer_name', 'waste_type_icon', 'estimated_weight', 'points_earned_display', 'preferred_date', 'status_badge')
    list_filter = ('status', 'waste_type')
    search_fields = ('volunteer__user__username', 'address')
    list_per_page = 20
    
    def volunteer_name(self, obj):
        return format_html('<span style="font-weight: bold;">🌿 {}</span>', obj.volunteer.user.username)
    volunteer_name.short_description = 'Volunteer'
    
    def waste_type_icon(self, obj):
        icons = {
            'plastic': '♻️',
            'paper': '📄',
            'glass': '🥃',
            'metal': '🔩',
            'ewaste': '💻',
            'organic': '🌿',
            'mixed': '📦'
        }
        return format_html('{} {}', icons.get(obj.waste_type, '🗑️'), obj.waste_type.title())
    waste_type_icon.short_description = 'Waste Type'
    
    def points_earned_display(self, obj):
        return format_html('<span style="color: #4CAF50; font-weight: bold;">🏆 {}</span>', obj.points_earned)
    points_earned_display.short_description = 'Points'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FF9800',
            'confirmed': '#2196F3',
            'completed': '#4CAF50',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

# ========== MISSION REGISTRATION ADMIN ==========
@admin.register(MissionRegistration)
class MissionRegistrationAdmin(admin.ModelAdmin):
    list_display = ('volunteer_link', 'mission_link', 'registered_date', 'status_badge')
    list_filter = ('status',)
    search_fields = ('volunteer__user__username', 'mission__title')
    list_per_page = 20
    
    def volunteer_link(self, obj):
        return format_html('<span style="font-weight: bold;">🌿 {}</span>', obj.volunteer.user.username)
    volunteer_link.short_description = 'Volunteer'
    
    def mission_link(self, obj):
        return format_html('<span style="color: #2196F3; font-weight: bold;">🎯 {}</span>', obj.mission.title)
    mission_link.short_description = 'Mission'
    
    def status_badge(self, obj):
        colors = {
            'registered': '#4CAF50',
            'attended': '#2196F3',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'

# ========== CONTACT MESSAGE ADMIN ==========
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject_preview', 'created_date', 'is_read_badge')
    list_filter = ('is_read',)
    search_fields = ('name', 'email', 'subject')
    list_per_page = 20
    actions = ['mark_as_read']
    
    def subject_preview(self, obj):
        return obj.subject[:50] + '...' if len(obj.subject) > 50 else obj.subject
    subject_preview.short_description = 'Subject'
    
    def created_date(self, obj):
        return obj.created_at.strftime('%d %b %Y, %H:%M')
    created_date.short_description = 'Received'
    
    def is_read_badge(self, obj):
        if obj.is_read:
            return format_html('<span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">✓ Read</span>')
        return format_html('<span style="background: #F44336; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">● Unread</span>')
    is_read_badge.short_description = 'Status'
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'✅ {updated} messages marked as read.')
    mark_as_read.short_description = 'Mark selected messages as read'

# ========== REWARD ADMIN ==========
@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_badge', 'points_display', 'stock_display', 'popular_badge')
    list_filter = ('category', 'is_popular')
    search_fields = ('name',)
    list_editable = ('stock',)
    list_per_page = 20
    
    def category_badge(self, obj):
        colors = {
            'Eco Products': '#4CAF50',
            'Merchandise': '#2196F3',
            'Vouchers': '#FF9800',
            'Events': '#9C27B0'
        }
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">{}</span>', 
                          colors.get(obj.category, '#999'), obj.category)
    category_badge.short_description = 'Category'
    
    def points_display(self, obj):
        return format_html('<span style="color: #4CAF50; font-weight: bold;">🪙 {}</span>', obj.points_required)
    points_display.short_description = 'Points'
    
    def stock_display(self, obj):
        if obj.stock <= 10:
            return format_html('<span style="color: #F44336; font-weight: bold;">⚠️ {} left</span>', obj.stock)
        return format_html('<span style="color: #4CAF50;">📦 {}</span>', obj.stock)
    stock_display.short_description = 'Stock'
    
    def popular_badge(self, obj):
        if obj.is_popular:
            return format_html('<span style="background: #FF9800; color: white; padding: 4px 8px; border-radius: 20px; font-size: 11px;">🔥 Popular</span>')
        return '-'
    popular_badge.short_description = 'Status'

# ========== REWARD REDEMPTION ADMIN ==========
@admin.register(RewardRedemption)
class RewardRedemptionAdmin(admin.ModelAdmin):
    list_display = ('volunteer_link', 'reward_link', 'points_display', 'redeemed_date', 'status_badge')
    list_filter = ('status',)
    search_fields = ('volunteer__user__username', 'reward__name')
    list_per_page = 20
    
    def volunteer_link(self, obj):
        return format_html('<span style="font-weight: bold;">🌿 {}</span>', obj.volunteer.user.username)
    volunteer_link.short_description = 'Volunteer'
    
    def reward_link(self, obj):
        return format_html('<span style="color: #4CAF50; font-weight: bold;">🎁 {}</span>', obj.reward.name)
    reward_link.short_description = 'Reward'
    
    def points_display(self, obj):
        return format_html('<span style="color: #F44336; font-weight: bold;">-{} 🪙</span>', obj.points_spent)
    points_display.short_description = 'Points Spent'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FF9800',
            'completed': '#4CAF50',
            'cancelled': '#F44336'
        }
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">{}</span>', 
                          colors.get(obj.status, '#999'), obj.status.upper())
    status_badge.short_description = 'Status'