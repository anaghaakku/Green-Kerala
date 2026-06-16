from django.db import models
from django.contrib.auth.models import User
from harithamission.models import Mission

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    role = models.CharField(max_length=50, choices=[
        ('collection', 'Collection Staff'),
        ('driver', 'Driver'),
        ('supervisor', 'Supervisor'),
        ('manager', 'Manager')
    ], default='collection')
    is_available = models.BooleanField(default=True)
    profile_picture = models.ImageField(upload_to='staff/', null=True, blank=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class StaffDuty(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='duties')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='staff_duties')
    duty_date = models.DateField()
    duty_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='pending')
    notes = models.TextField(blank=True)
    assigned_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.staff.name} - {self.mission.title} ({self.duty_date})"