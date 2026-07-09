from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import datetime, timedelta, time as datetime_time  # ✅ Fixed import
from .models import Staff, MissionDuty, WastePickupDuty


def convert_to_time(time_value):
    """Convert various time formats to time object"""
    if not time_value:
        return None
    
    if isinstance(time_value, datetime_time):
        return time_value
    
    
    if isinstance(time_value, str):
        time_lower = time_value.lower().strip()
        
        # Map string times to actual times
        time_map = {
            'morning': '09:00:00',
            'afternoon': '14:00:00',
            'evening': '17:00:00',
            'night': '20:00:00',
            '9am': '09:00:00',
            '10am': '10:00:00',
            '11am': '11:00:00',
            '12pm': '12:00:00',
            '1pm': '13:00:00',
            '2pm': '14:00:00',
            '3pm': '15:00:00',
            '4pm': '16:00:00',
            '5pm': '17:00:00',
            '6pm': '18:00:00',
            '7pm': '19:00:00',
            '8pm': '20:00:00',
        }
        
        if time_lower in time_map:
            time_str = time_map[time_lower]
        else:
            time_str = time_lower
       
        try:
            if ':' in time_str:
                parts = time_str.split(':')
                if len(parts) == 2:
                    return datetime_time(hour=int(parts[0]), minute=int(parts[1]), second=0)
                elif len(parts) == 3:
                    return datetime_time(hour=int(parts[0]), minute=int(parts[1]), second=int(parts[2]))
            # Try simple hour
            elif time_str.isdigit():
                hour = int(time_str)
                if 0 <= hour <= 23:
                    return datetime_time(hour=hour, minute=0, second=0)
        except (ValueError, IndexError):
            pass
    
    return None

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
    list_display = ['staff', 'mission', 'duty_date', 'duty_time', 'status']
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
        if not obj.duty_date and obj.mission and obj.mission.date:
            obj.duty_date = obj.mission.date
        elif not obj.duty_date:
            obj.duty_date = timezone.now().date() + timedelta(days=1)
        
        if not obj.duty_time:
            if obj.mission and obj.mission.time:
                obj.duty_time = obj.mission.time
            else:
                obj.duty_time = timezone.now().time().replace(hour=9, minute=0, second=0)
        
        super().save_model(request, obj, form, change)

@admin.register(WastePickupDuty)
class WastePickupDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'waste_pickup', 'duty_date', 'duty_time', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name']
    
    fieldsets = (
        ('Assignment', {
            'fields': ('staff', 'waste_pickup')
        }),
        ('Schedule (Auto-set from user)', {
            'fields': ('duty_date', 'duty_time')
        }),
        ('Status', {
            'fields': ('status', 'notes')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        
        if not obj.duty_date and obj.waste_pickup and obj.waste_pickup.preferred_date:
            obj.duty_date = obj.waste_pickup.preferred_date
        elif not obj.duty_date:
            obj.duty_date = timezone.now().date() + timedelta(days=1)
        

        if not obj.duty_time:
            if obj.waste_pickup and obj.waste_pickup.preferred_time:
                
                converted_time = convert_to_time(obj.waste_pickup.preferred_time)
                if converted_time:
                    obj.duty_time = converted_time
                else:
                    obj.duty_time = timezone.now().time().replace(hour=10, minute=0, second=0)
            else:
                obj.duty_time = timezone.now().time().replace(hour=10, minute=0, second=0)
        
        super().save_model(request, obj, form, change)