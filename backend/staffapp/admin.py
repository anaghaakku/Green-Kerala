from django.contrib import admin
from .models import Staff, MissionDuty, WastePickupDuty

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'email', 'role', 'is_available']
    list_filter = ['role', 'is_available']
    search_fields = ['name', 'phone', 'email']

@admin.register(MissionDuty)
class MissionDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'mission', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name', 'mission__title']

@admin.register(WastePickupDuty)
class WastePickupDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'waste_pickup', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name']