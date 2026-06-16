from django.contrib import admin
from .models import Staff, StaffDuty

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'email', 'role', 'is_available']
    list_filter = ['role', 'is_available']
    search_fields = ['name', 'phone', 'email']
    list_editable = ['is_available']
    ordering = ['-id']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'phone', 'email', 'profile_picture')
        }),
        ('Work Information', {
            'fields': ('role', 'is_available')
        }),
    )

@admin.register(StaffDuty)
class StaffDutyAdmin(admin.ModelAdmin):
    list_display = ['staff', 'mission', 'duty_date', 'status']
    list_filter = ['status', 'duty_date']
    search_fields = ['staff__name', 'mission__title']
    date_hierarchy = 'duty_date'