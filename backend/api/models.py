from django.db import models
from django.contrib.auth.models import User

class Dataset(models.Model):
    name = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_path = models.CharField(max_length=500)
    
    class Meta:
        ordering = ['-uploaded_at']

class Equipment(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='equipment')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    flowrate = models.FloatField()
    pressure = models.FloatField()
    temperature = models.FloatField()
    
    def __str__(self):
        return f"{self.name} ({self.type})"