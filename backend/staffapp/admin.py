# # from django.contrib import admin
# # from .models import Staff, MissionDuty, WastePickupDuty

# # @admin.register(Staff)
# # class StaffAdmin(admin.ModelAdmin):
# #     list_display = ['id', 'name', 'phone', 'email', 'role', 'is_available']
# #     list_filter = ['role', 'is_available']
# #     search_fields = ['name', 'phone', 'email']

# # @admin.register(MissionDuty)
# # class MissionDutyAdmin(admin.ModelAdmin):
# #     list_display = ['staff', 'mission', 'duty_date', 'status']
# #     list_filter = ['status', 'duty_date']
# #     search_fields = ['staff__name', 'mission__title']

# # @admin.register(WastePickupDuty)
# # class WastePickupDutyAdmin(admin.ModelAdmin):
# #     list_display = ['staff', 'waste_pickup', 'duty_date', 'status']
# #     list_filter = ['status', 'duty_date']
# #     search_fields = ['staff__name']


# from django.contrib import admin
# from django.contrib.auth.hashers import make_password
# from .models import Staff, MissionDuty, WastePickupDuty

# @admin.register(Staff)
# class StaffAdmin(admin.ModelAdmin):
#     list_display = ['id', 'name', 'phone', 'email', 'role', 'is_available']
#     list_filter = ['role', 'is_available']
#     search_fields = ['name', 'phone', 'email']
#     list_editable = ['is_available']
    
#     fieldsets = (
#         ('Personal Information', {
#             'fields': ('name', 'phone', 'email', 'profile_picture')
#         }),
#         ('Login Credentials', {
#             'fields': ('password',)
#         }),
#         ('Work Information', {
#             'fields': ('role', 'is_available')
#         }),
#     )
    
#     def save_model(self, request, obj, form, change):
#         # Hash password when saving
#         if obj.password and not obj.password.startswith('pbkdf2_'):
#             obj.password = make_password(obj.password)
#         super().save_model(request, obj, form, change)

# @admin.register(MissionDuty)
# class MissionDutyAdmin(admin.ModelAdmin):
#     list_display = ['staff', 'mission', 'duty_date', 'status']
#     list_filter = ['status', 'duty_date']
#     search_fields = ['staff__name', 'mission__title']

# @admin.register(WastePickupDuty)
# class WastePickupDutyAdmin(admin.ModelAdmin):
#     list_display = ['staff', 'waste_pickup', 'duty_date', 'status']
#     list_filter = ['status', 'duty_date']
#     search_fields = ['staff__name']


from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Staff, MissionDuty, WastePickupDuty

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'email', 'role', 'is_available']
    list_filter = ['role', 'is_available']
    search_fields = ['name', 'phone', 'email']
    list_editable = ['is_available']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'phone', 'email', 'profile_picture')
        }),
        ('Login Credentials', {
            'fields': ('password',)
        }),
        ('Work Information', {
            'fields': ('role', 'is_available')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if obj.password and not obj.password.startswith('pbkdf2_'):
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

@admin.register(MissionDuty)
class MissionDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'mission', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name', 'mission__title']
    
    fieldsets = (
        ('Assignment', {
            'fields': ('staff', 'mission')
        }),
        ('Schedule (Auto-set)', {
            'fields': ('duty_date', 'duty_time')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Auto-set duty_date to tomorrow if not set
        if not obj.duty_date:
            obj.duty_date = timezone.now().date() + timedelta(days=1)
        # Auto-set duty_time to 9:00 AM if not set
        if not obj.duty_time:
            obj.duty_time = timezone.now().time().replace(hour=9, minute=0, second=0)
        super().save_model(request, obj, form, change)

@admin.register(WastePickupDuty)
class WastePickupDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'waste_pickup', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name']
    
    fieldsets = (
        ('Assignment', {
            'fields': ('staff', 'waste_pickup')
        }),
        ('Schedule (Auto-set)', {
            'fields': ('duty_date', 'duty_time')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Auto-set duty_date to tomorrow if not set
        if not obj.duty_date:
            obj.duty_date = timezone.now().date() + timedelta(days=1)
        # Auto-set duty_time to 10:00 AM if not set
        if not obj.duty_time:
            obj.duty_time = timezone.now().time().replace(hour=10, minute=0, second=0)
        super().save_model(request, obj, form, change)