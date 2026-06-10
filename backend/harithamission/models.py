from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Mission(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=300)
    date = models.DateField()
    time = models.TimeField()
    spots_available = models.IntegerField(default=0)
    spots_total = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    image = models.ImageField(upload_to='missions/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    @property
    def spots_filled(self):
        return self.spots_total - self.spots_available

class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='volunteer_profile')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    profile_picture = models.ImageField(upload_to='volunteers/', blank=True, null=True)
    total_points = models.IntegerField(default=0)
    total_hours = models.IntegerField(default=0)
    joined_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.total_points} points"
    
    def add_points(self, points):
        self.total_points += points
        self.save()

class WastePickup(models.Model):
    WASTE_TYPES = [
        ('plastic', 'Plastic Waste'),
        ('paper', 'Paper & Cardboard'),
        ('glass', 'Glass Bottles'),
        ('metal', 'Metal Scrap'),
        ('ewaste', 'E-Waste'),
        ('organic', 'Organic Waste'),
        ('mixed', 'Mixed Recyclables'),
    ]
    
    WEIGHT_CHOICES = [
        ('1-5', '1-5 kg'),
        ('5-10', '5-10 kg'),
        ('10-20', '10-20 kg'),
        ('20+', '20+ kg'),
    ]
    
    TIME_CHOICES = [
        ('morning', 'Morning (9AM - 12PM)'),
        ('afternoon', 'Afternoon (2PM - 5PM)'),
        ('evening', 'Evening (5PM - 7PM)'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='pickups')
    waste_type = models.CharField(max_length=20, choices=WASTE_TYPES)
    estimated_weight = models.CharField(max_length=10, choices=WEIGHT_CHOICES)
    actual_weight = models.FloatField(null=True, blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    preferred_date = models.DateField()
    preferred_time = models.CharField(max_length=20, choices=TIME_CHOICES)
    notes = models.TextField(blank=True)
    points_earned = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Pickup by {self.volunteer.user.username} - {self.waste_type}"
    
    def calculate_points(self):
        points_map = {
            'plastic': 30, 'paper': 25, 'glass': 40, 'metal': 50,
            'ewaste': 60, 'organic': 20, 'mixed': 35
        }
        weight_map = {'1-5': 50, '5-10': 100, '10-20': 200, '20+': 350}
        return points_map.get(self.waste_type, 30) + weight_map.get(self.estimated_weight, 50)

class MissionRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='registrations')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='registrations')
    registered_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    hours_contributed = models.IntegerField(default=0)
    points_earned = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ['volunteer', 'mission']
    
    def __str__(self):
        return f"{self.volunteer.user.username} - {self.mission.title}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.name} - {self.subject}"

class Reward(models.Model):
    CATEGORY_CHOICES = [
        ('eco', 'Eco Products'),
        ('merchandise', 'Merchandise'),
        ('vouchers', 'Vouchers & Events'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    points_required = models.IntegerField()
    icon = models.CharField(max_length=10, default='🎁')
    stock = models.IntegerField(default=0)
    is_popular = models.BooleanField(default=False)
    image = models.ImageField(upload_to='rewards/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.points_required} points"

class RewardRedemption(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='redemptions')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    points_spent = models.IntegerField()
    redeemed_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    
    def __str__(self):
        return f"{self.volunteer.user.username} redeemed {self.reward.name}"