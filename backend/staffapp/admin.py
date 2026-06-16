from django.contrib import admin
from .models import Staff

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
        ('Account', {
            'fields': ('user',)
        }),
    )
