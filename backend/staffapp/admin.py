from django.contrib import admin
from .models import Staff

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_available', 'assigned_pickups']
    list_filter = ['is_available']
    search_fields = ['name', 'phone']
    list_editable = ['is_available']