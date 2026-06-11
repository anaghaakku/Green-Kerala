from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Mission, Volunteer, WastePickup, MissionRegistration,
    ContactMessage, Reward, RewardRedemption
)

# Apply custom CSS to default admin site
admin.site.site_header = "🌿 HarithaMission Admin Panel"
admin.site.site_title = "HarithaMission"
admin.site.index_title = "Welcome to HarithaMission Dashboard"

# Inject custom CSS
extra_css = """
<style>
    #header { background: linear-gradient(95deg, #1B5E20, #4CAF50) !important; }
    #branding h1 a { color: white !important; font-size: 20px !important; }
    .module h2 { background: #2E7D32 !important; color: white !important; }
    .button, input[type=submit] { background: #4CAF50 !important; border-radius: 5px !important; border: none !important; }
    .button:hover, input[type=submit]:hover { background: #1B5E20 !important; }
    a:link, a:visited { color: #2E7D32 !important; }
    .submit-row input { background: #4CAF50 !important; }
    .addlink, .changelink { color: #2E7D32 !important; }
    .dashboard #content { background: #f9f9f9; }
    .dashboard .module table { border-radius: 8px; overflow: hidden; }
</style>
"""

# Inject CSS into admin base template
admin.site.index_template = None
admin.site.login_template = None

# Monkey patch to add CSS
original_each_context = admin.site.each_context
def each_context(self, request):
    context = original_each_context(request)
    context['extra_head'] = extra_css
    return context
admin.site.each_context = each_context

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