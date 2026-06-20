# from django.contrib import admin
# from .models import Staff, MissionDuty, WastePickupDuty

# @admin.register(Staff)
# class StaffAdmin(admin.ModelAdmin):
#     list_display = ['id', 'name', 'phone', 'email', 'role', 'is_available']
#     list_filter = ['role', 'is_available']
#     search_fields = ['name', 'phone', 'email']

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
        # Hash password when saving
        if obj.password and not obj.password.startswith('pbkdf2_'):
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

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