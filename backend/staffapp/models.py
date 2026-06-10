from django.db import models

class Staff(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    is_available = models.BooleanField(default=True)
    assigned_pickups = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {'Available' if self.is_available else 'Busy'}"