from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('upload/', views.upload_csv, name='upload_csv'),
    path('datasets/', views.get_datasets, name='get_datasets'),
    path('equipment/<int:dataset_id>/', views.get_equipment_data, name='get_equipment_data'),
    path('summary/<int:dataset_id>/', views.get_summary, name='get_summary'),
    path('report/<int:dataset_id>/', views.generate_pdf_report, name='generate_pdf_report'),
]