import csv
import io
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.units import inch
from io import BytesIO
from .models import Dataset, Equipment
from .serializers import DatasetSerializer, EquipmentSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        return Response({
            'success': True,
            'message': 'User created successfully',
            'username': user.username
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    if user:
        return Response({
            'success': True,
            'username': user.username,
            'is_superuser': user.is_superuser
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_csv(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    if not file.name.endswith('.csv'):
        return Response({'error': 'File must be CSV'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Read CSV file
        file_content = file.read().decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(file_content))
        
        required_columns = ['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']
        
        # Check if all required columns exist
        if not all(col in csv_reader.fieldnames for col in required_columns):
            return Response({'error': f'CSV must contain columns: {required_columns}'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Keep only last 5 datasets
        user_datasets = Dataset.objects.filter(uploaded_by=request.user)
        if user_datasets.count() >= 5:
            oldest = user_datasets.last()
            oldest.delete()
        
        # Create dataset
        dataset = Dataset.objects.create(
            name=file.name,
            uploaded_by=request.user,
            file_path=file.name
        )
        
        # Create equipment records
        for row in csv_reader:
            Equipment.objects.create(
                dataset=dataset,
                name=row['Equipment Name'],
                type=row['Type'],
                flowrate=float(row['Flowrate']),
                pressure=float(row['Pressure']),
                temperature=float(row['Temperature'])
            )
        
        return Response({'message': 'File uploaded successfully', 'dataset_id': dataset.id})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_datasets(request):
    datasets = Dataset.objects.filter(uploaded_by=request.user)
    serializer = DatasetSerializer(datasets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_equipment_data(request, dataset_id):
    try:
        dataset = Dataset.objects.get(id=dataset_id, uploaded_by=request.user)
        equipment = dataset.equipment.all()
        serializer = EquipmentSerializer(equipment, many=True)
        return Response(serializer.data)
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_summary(request, dataset_id):
    try:
        dataset = Dataset.objects.get(id=dataset_id, uploaded_by=request.user)
        equipment = dataset.equipment.all()
        
        if not equipment:
            return Response({'error': 'No equipment data found'})
        
        # Calculate summary statistics
        flowrates = [e.flowrate for e in equipment]
        pressures = [e.pressure for e in equipment]
        temperatures = [e.temperature for e in equipment]
        
        type_counts = {}
        for e in equipment:
            type_counts[e.type] = type_counts.get(e.type, 0) + 1
        
        summary = {
            'total_count': len(equipment),
            'avg_flowrate': sum(flowrates) / len(flowrates),
            'avg_pressure': sum(pressures) / len(pressures),
            'avg_temperature': sum(temperatures) / len(temperatures),
            'type_distribution': type_counts
        }
        
        return Response(summary)
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

def create_chart(data, chart_type, title, xlabel, ylabel, filename):
    """Create various types of charts and return as BytesIO object"""
    plt.figure(figsize=(12, 8))  # Increased figure size
    plt.style.use('default')
    
    if chart_type == 'bar':
        bars = plt.bar(data['x'], data['y'], color=['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'])
        # Rotate x-axis labels for better readability
        plt.xticks(rotation=45, ha='right')
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + max(data['y'])*0.01,
                    f'{height:.1f}', ha='center', va='bottom', fontsize=10, fontweight='bold')
    elif chart_type == 'line':
        plt.plot(data['x'], data['y'], marker='o', linewidth=3, markersize=8, color='#60a5fa')
        plt.xticks(rotation=45, ha='right')
    elif chart_type == 'scatter':
        plt.scatter(data['x'], data['y'], alpha=0.7, s=80, color='#60a5fa', edgecolors='white', linewidth=1)
    elif chart_type == 'pie':
        colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#06b6d4', '#8b5cf6', '#f59e0b']
        # Create pie chart with better label positioning
        wedges, texts, autotexts = plt.pie(data['y'], labels=data['x'], autopct='%1.1f%%', 
                                          startangle=90, colors=colors[:len(data['x'])],
                                          pctdistance=0.85, labeldistance=1.1,
                                          textprops={'fontsize': 11, 'fontweight': 'bold'})
        
        # Improve label positioning to avoid overlap
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
            autotext.set_fontsize(10)
        
        # Add legend instead of labels for better readability
        plt.legend(wedges, [f'{label} ({count})' for label, count in zip(data['x'], data['y'])],
                  title="Equipment Types", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1),
                  fontsize=10)
        
        # Remove labels from pie chart to reduce congestion
        for text in texts:
            text.set_text('')
    
    plt.title(title, fontsize=16, fontweight='bold', pad=20)
    if chart_type != 'pie':
        plt.xlabel(xlabel, fontsize=14, fontweight='600')
        plt.ylabel(ylabel, fontsize=14, fontweight='600')
    
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.tight_layout(pad=2.0)  # Increased padding
    
    # Save to BytesIO
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight', facecolor='white')
    img_buffer.seek(0)
    plt.close()
    
    return img_buffer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_pdf_report(request, dataset_id):
    try:
        dataset = Dataset.objects.get(id=dataset_id, uploaded_by=request.user)
        equipment = dataset.equipment.all()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{dataset.name}.pdf"'
        
        # Create PDF document with better margins
        doc = SimpleDocTemplate(response, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            spaceAfter=20,
            textColor=colors.HexColor('#1e293b'),
            alignment=1  # Center alignment
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=15,
            spaceBefore=20,
            textColor=colors.HexColor('#374151'),
            borderWidth=1,
            borderColor=colors.HexColor('#e5e7eb'),
            borderPadding=10,
            backColor=colors.HexColor('#f8fafc')
        )
        
        # Title
        story.append(Paragraph(f"Equipment Analysis Report: {dataset.name}", title_style))
        story.append(Spacer(1, 12))
        
        if equipment:
            # Calculate statistics
            flowrates = [e.flowrate for e in equipment]
            pressures = [e.pressure for e in equipment]
            temperatures = [e.temperature for e in equipment]
            
            avg_flow = sum(flowrates) / len(flowrates)
            avg_pressure = sum(pressures) / len(pressures)
            avg_temp = sum(temperatures) / len(temperatures)
            
            # Equipment type distribution
            type_counts = {}
            for e in equipment:
                type_counts[e.type] = type_counts.get(e.type, 0) + 1
            
            # Executive Summary
            story.append(Paragraph("Executive Summary", heading_style))
            summary_data = [
                ['Metric', 'Value'],
                ['Total Equipment', str(equipment.count())],
                ['Average Flowrate', f"{avg_flow:.2f} L/min"],
                ['Average Pressure', f"{avg_pressure:.2f} bar"],
                ['Average Temperature', f"{avg_temp:.2f} °C"],
                ['Equipment Types', str(len(type_counts))]
            ]
            
            summary_table = Table(summary_data, colWidths=[2*inch, 2*inch])
            summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
            ]))
            story.append(summary_table)
            story.append(Spacer(1, 20))
            
            # Equipment Type Distribution Chart
            story.append(Paragraph("Equipment Type Distribution", heading_style))
            type_chart_data = {
                'x': list(type_counts.keys()),
                'y': list(type_counts.values())
            }
            type_chart = create_chart(type_chart_data, 'pie', 'Equipment Distribution by Type', '', '', 'type_dist')
            story.append(Image(type_chart, width=7*inch, height=5*inch))
            story.append(PageBreak())  # Start new page for parameter analysis
            
            # Parameter Analysis Charts
            story.append(Paragraph("Parameter Analysis", heading_style))
            
            # Flowrate by Equipment Type
            # Create shorter, more readable equipment names
            equipment_list = list(equipment[:8])  # Reduced to 8 items for better readability
            equipment_names = []
            for e in equipment_list:
                name = e.name
                # If name is too long, use equipment type + index
                if len(name) > 12:
                    type_count = sum(1 for eq in equipment_list[:equipment_list.index(e)+1] if eq.type == e.type)
                    equipment_names.append(f"{e.type}-{type_count}")
                else:
                    equipment_names.append(name)
            
            flowrate_chart_data = {
                'x': equipment_names,
                'y': [e.flowrate for e in equipment_list]
            }
            flowrate_chart = create_chart(flowrate_chart_data, 'bar', 'Flowrate by Equipment (Top 8)', 'Equipment', 'Flowrate (L/min)', 'flowrate')
            story.append(Image(flowrate_chart, width=7*inch, height=5*inch))
            story.append(Spacer(1, 25))
            
            # Pressure vs Temperature Scatter Plot
            scatter_data = {
                'x': pressures,
                'y': temperatures
            }
            scatter_chart = create_chart(scatter_data, 'scatter', 'Pressure vs Temperature Correlation', 'Pressure (bar)', 'Temperature (°C)', 'scatter')
            story.append(Image(scatter_chart, width=7*inch, height=5*inch))
            story.append(Spacer(1, 25))
            
            # Add Parameter Comparison Chart
            story.append(Paragraph("Parameter Comparison by Equipment Type", heading_style))
            
            # Group data by equipment type for comparison
            type_avg_data = {}
            for eq_type in type_counts.keys():
                type_equipment = [e for e in equipment if e.type == eq_type]
                if type_equipment:
                    type_avg_data[eq_type] = {
                        'flowrate': sum(e.flowrate for e in type_equipment) / len(type_equipment),
                        'pressure': sum(e.pressure for e in type_equipment) / len(type_equipment),
                        'temperature': sum(e.temperature for e in type_equipment) / len(type_equipment)
                    }
            
            # Create comparison bar chart for average flowrates by type
            if type_avg_data:
                comparison_data = {
                    'x': list(type_avg_data.keys()),
                    'y': [data['flowrate'] for data in type_avg_data.values()]
                }
                comparison_chart = create_chart(comparison_data, 'bar', 'Average Flowrate by Equipment Type', 'Equipment Type', 'Average Flowrate (L/min)', 'comparison')
                story.append(Image(comparison_chart, width=7*inch, height=4*inch))
                story.append(PageBreak())  # Start new page for detailed data
            
            # Detailed Equipment Data Table
            story.append(Paragraph("Detailed Equipment Data", heading_style))
            table_data = [['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']]
            
            for e in equipment[:15]:  # Show first 15 items
                table_data.append([
                    e.name[:20] + '...' if len(e.name) > 20 else e.name,
                    e.type,
                    f"{e.flowrate:.1f}",
                    f"{e.pressure:.1f}",
                    f"{e.temperature:.1f}"
                ])
            
            if equipment.count() > 15:
                table_data.append(['...', '...', '...', '...', '...'])
                table_data.append([f"Total: {equipment.count()} items", '', '', '', ''])
            
            equipment_table = Table(table_data, colWidths=[1.5*inch, 1*inch, 1*inch, 1*inch, 1*inch])
            equipment_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
                ('FONTSIZE', (0, 1), (-1, -1), 9)
            ]))
            story.append(equipment_table)
            story.append(Spacer(1, 20))
            
            # Statistical Analysis
            story.append(Paragraph("Statistical Analysis", heading_style))
            
            # Calculate additional statistics
            flow_std = np.std(flowrates)
            pressure_std = np.std(pressures)
            temp_std = np.std(temperatures)
            
            stats_data = [
                ['Parameter', 'Mean', 'Std Dev', 'Min', 'Max'],
                ['Flowrate (L/min)', f"{avg_flow:.2f}", f"{flow_std:.2f}", f"{min(flowrates):.2f}", f"{max(flowrates):.2f}"],
                ['Pressure (bar)', f"{avg_pressure:.2f}", f"{pressure_std:.2f}", f"{min(pressures):.2f}", f"{max(pressures):.2f}"],
                ['Temperature (°C)', f"{avg_temp:.2f}", f"{temp_std:.2f}", f"{min(temperatures):.2f}", f"{max(temperatures):.2f}"]
            ]
            
            stats_table = Table(stats_data, colWidths=[1.5*inch, 1*inch, 1*inch, 1*inch, 1*inch])
            stats_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
                ('FONTSIZE', (0, 1), (-1, -1), 9)
            ]))
            story.append(stats_table)
            story.append(Spacer(1, 20))
            
            # Recommendations
            story.append(Paragraph("Recommendations & Insights", heading_style))
            recommendations = []
            
            # High temperature equipment
            high_temp_equipment = [e for e in equipment if e.temperature > avg_temp + temp_std]
            if high_temp_equipment:
                recommendations.append(f"• {len(high_temp_equipment)} equipment items are operating at high temperatures (>{avg_temp + temp_std:.1f}°C). Consider reviewing cooling systems.")
            
            # High pressure equipment
            high_pressure_equipment = [e for e in equipment if e.pressure > avg_pressure + pressure_std]
            if high_pressure_equipment:
                recommendations.append(f"• {len(high_pressure_equipment)} equipment items are operating at high pressures (>{avg_pressure + pressure_std:.1f} bar). Monitor for safety compliance.")
            
            # Equipment type recommendations
            most_common_type = max(type_counts, key=type_counts.get)
            recommendations.append(f"• {most_common_type} equipment represents {type_counts[most_common_type]/len(equipment)*100:.1f}% of your fleet. Consider standardization benefits.")
            
            recommendations.append("• Regular maintenance scheduling recommended based on operating parameters.")
            recommendations.append("• Consider implementing real-time monitoring for critical equipment.")
            
            for rec in recommendations:
                story.append(Paragraph(rec, styles['Normal']))
                story.append(Spacer(1, 6))
            
        else:
            story.append(Paragraph("No equipment data available for this dataset.", styles['Normal']))
        
        # Build PDF
        doc.build(story)
        return response
        
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Error generating report: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)