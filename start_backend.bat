@echo off
echo Starting Chemical Equipment Visualizer Backend...
cd backend
echo Creating superuser (use admin/admin for demo)
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
echo Starting Django server...
python manage.py runserver