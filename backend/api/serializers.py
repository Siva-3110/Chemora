from rest_framework import serializers
from .models import Dataset, Equipment

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'

class DatasetSerializer(serializers.ModelSerializer):
    equipment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Dataset
        fields = ['id', 'name', 'uploaded_at', 'equipment_count']
    
    def get_equipment_count(self, obj):
        return obj.equipment.count()