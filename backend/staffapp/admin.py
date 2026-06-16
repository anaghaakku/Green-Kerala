from django.contrib import admin
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
        ('Work Information', {
            'fields': ('role', 'is_available')
        }),
    )

@admin.register(MissionDuty)
class MissionDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'mission', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name', 'mission__title']
    date_hierarchy = 'duty_date'
    
    fieldsets = (
        ('Assignment', {
            'fields': ('staff', 'mission')
        }),
        ('Schedule', {
            'fields': ('duty_date', 'duty_time')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
    )

@admin.register(WastePickupDuty)
class WastePickupDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'waste_pickup', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name', 'waste_pickup__id']
    date_hierarchy = 'duty_date'
    
    fieldsets = (
        ('Assignment', {
            'fields': ('staff', 'waste_pickup')
        }),
        ('Schedule', {
            'fields': ('duty_date', 'duty_time')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
    )