import sys
import requests
import base64
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

class LoginDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemora - Desktop Login")
        self.setFixedSize(400, 300)
        self.setStyleSheet("""
            QDialog {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:1, 
                    stop:0 #667eea, stop:1 #764ba2);
            }
            QLabel {
                color: white;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            QLineEdit {
                padding: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                background: rgba(255,255,255,0.9);
                font-size: 14px;
            }
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #4facfe, stop:1 #00f2fe);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 14px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #43a3f5, stop:1 #00d9fe);
            }
        """)
        
        layout = QVBoxLayout()
        layout.setSpacing(20)
        layout.setContentsMargins(40, 40, 40, 40)
        
        # Logo and title
        logo_layout = QHBoxLayout()
        logo_layout.setAlignment(Qt.AlignCenter)
        
        title = QLabel("🧪 Chemora Desktop")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 24px; font-weight: bold; margin: 20px; color: white;")
        
        subtitle = QLabel("Chemical Equipment Analytics Platform")
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 20px;")
        
        # Input fields
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username (default: admin)")
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password (default: admin)")
        self.password_input.setEchoMode(QLineEdit.Password)
        
        login_btn = QPushButton("🚀 Launch Dashboard")
        login_btn.clicked.connect(self.accept)
        
        demo_label = QLabel("💡 Demo: admin / admin")
        demo_label.setAlignment(Qt.AlignCenter)
        demo_label.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 10px;")
        
        layout.addWidget(title)
        layout.addWidget(subtitle)
        layout.addWidget(QLabel("Username:"))
        layout.addWidget(self.username_input)
        layout.addWidget(QLabel("Password:"))
        layout.addWidget(self.password_input)
        layout.addWidget(login_btn)
        layout.addWidget(demo_label)
        
        self.setLayout(layout)
    
    def get_credentials(self):
        return self.username_input.text(), self.password_input.text()

class ChartsWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        
        # Create scroll area for charts
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("""
            QScrollArea {
                border: none;
                background-color: #f8f9fa;
            }
        """)
        
        self.charts_widget = QWidget()
        self.charts_layout = QVBoxLayout()
        self.charts_widget.setLayout(self.charts_layout)
        
        scroll.setWidget(self.charts_widget)
        layout.addWidget(scroll)
        
        self.setLayout(layout)
    
    def create_matplotlib_chart(self, chart_type, title, data, labels=None, colors=None):
        """Create matplotlib chart widget"""
        fig = Figure(figsize=(10, 6), dpi=100)
        fig.patch.set_facecolor('white')
        
        ax = fig.add_subplot(111)
        
        if chart_type == 'bar':
            bars = ax.bar(labels, data, color=colors or ['#4facfe', '#00f2fe', '#43a3f5'])
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
            ax.set_ylabel('Values', fontsize=12)
            
            # Add value labels on bars
            for bar, value in zip(bars, data):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + max(data)*0.01,
                       f'{value:.2f}', ha='center', va='bottom', fontweight='bold')
        
        elif chart_type == 'pie':
            colors = colors or ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            wedges, texts, autotexts = ax.pie(data, labels=labels, colors=colors, autopct='%1.1f%%',
                                            startangle=90, textprops={'fontsize': 10})
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
            
            # Make percentage text bold
            for autotext in autotexts:
                autotext.set_color('white')
                autotext.set_fontweight('bold')
        
        elif chart_type == 'scatter':
            x_data, y_data = data
            scatter = ax.scatter(x_data, y_data, c='#4facfe', alpha=0.7, s=60, edgecolors='white', linewidth=1)
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
            ax.set_xlabel(labels[0] if labels else 'X', fontsize=12)
            ax.set_ylabel(labels[1] if labels else 'Y', fontsize=12)
            ax.grid(True, alpha=0.3)
            
            # Add trend line
            if len(x_data) > 1:
                z = np.polyfit(x_data, y_data, 1)
                p = np.poly1d(z)
                ax.plot(x_data, p(x_data), "--", color='#ff6b6b', alpha=0.8, linewidth=2)
        
        elif chart_type == 'line':
            ax.plot(range(len(data)), data, marker='o', linewidth=3, markersize=8, 
                   color='#4facfe', markerfacecolor='#00f2fe', markeredgecolor='white', markeredgewidth=2)
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
            ax.set_xlabel('Equipment Index', fontsize=12)
            ax.set_ylabel('Temperature (°C)', fontsize=12)
            ax.grid(True, alpha=0.3)
            ax.fill_between(range(len(data)), data, alpha=0.3, color='#4facfe')
        
        # Style the plot
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#ddd')
        ax.spines['bottom'].set_color('#ddd')
        ax.tick_params(colors='#666')
        
        fig.tight_layout()
        
        canvas = FigureCanvas(fig)
        canvas.setMinimumHeight(400)
        
        return canvas
    
    def create_stats_card(self, title, stats_data):
        """Create a statistics card widget"""
        card = QGroupBox()
        card.setStyleSheet("""
            QGroupBox {
                background-color: white;
                border: 2px solid #e9ecef;
                border-radius: 12px;
                margin: 10px;
                padding: 20px;
            }
        """)
        
        layout = QVBoxLayout()
        
        title_label = QLabel(title)
        title_label.setStyleSheet("""
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
        """)
        
        stats_text = "\n".join([f"{key}: {value}" for key, value in stats_data.items()])
        stats_label = QLabel(stats_text)
        stats_label.setStyleSheet("""
            font-size: 14px;
            color: #34495e;
            line-height: 1.6;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
        """)
        
        layout.addWidget(title_label)
        layout.addWidget(stats_label)
        card.setLayout(layout)
        
        return card
    
    def plot_data(self, data, summary):
        """Plot all charts with the provided data"""
        # Clear existing charts
        for i in reversed(range(self.charts_layout.count())): 
            self.charts_layout.itemAt(i).widget().setParent(None)
        
        if not data or not summary:
            no_data_label = QLabel("📈 No data available for visualization")
            no_data_label.setAlignment(Qt.AlignCenter)
            no_data_label.setStyleSheet("""
                font-size: 18px; 
                color: #6c757d; 
                padding: 100px;
                background-color: white;
                border-radius: 12px;
                margin: 20px;
            """)
            self.charts_layout.addWidget(no_data_label)
            return
        
        # 1. Average Parameters Bar Chart
        avg_labels = ['Flowrate', 'Pressure', 'Temperature']
        avg_values = [summary['avg_flowrate'], summary['avg_pressure'], summary['avg_temperature']]
        avg_colors = ['#4facfe', '#00f2fe', '#43a3f5']
        
        avg_chart = self.create_matplotlib_chart('bar', '📈 Average Equipment Parameters', 
                                                avg_values, avg_labels, avg_colors)
        self.charts_layout.addWidget(avg_chart)
        
        # 2. Equipment Type Distribution Pie Chart
        if summary['type_distribution']:
            type_labels = list(summary['type_distribution'].keys())
            type_values = list(summary['type_distribution'].values())
            
            pie_chart = self.create_matplotlib_chart('pie', '🏢 Equipment Type Distribution', 
                                                    type_values, type_labels)
            self.charts_layout.addWidget(pie_chart)
        
        # 3. Flowrate vs Pressure Scatter Plot
        flowrates = [item['flowrate'] for item in data]
        pressures = [item['pressure'] for item in data]
        
        scatter_chart = self.create_matplotlib_chart('scatter', '🔄 Flowrate vs Pressure Correlation', 
                                                    (flowrates, pressures), ['Flowrate', 'Pressure'])
        self.charts_layout.addWidget(scatter_chart)
        
        # 4. Temperature Trend Line Chart
        temperatures = [item['temperature'] for item in data]
        temp_chart = self.create_matplotlib_chart('line', '🌡️ Temperature Distribution Across Equipment', 
                                                 temperatures)
        self.charts_layout.addWidget(temp_chart)
        
        # 5. Statistics Cards
        temp_stats = {
            f"📈 Total Equipment": f"{len(data)} items",
            f"🌡️ Min Temperature": f"{min(temperatures):.2f}°C",
            f"🌡️ Max Temperature": f"{max(temperatures):.2f}°C",
            f"🌡️ Avg Temperature": f"{sum(temperatures)/len(temperatures):.2f}°C",
            f"📉 Temperature Range": f"{max(temperatures) - min(temperatures):.2f}°C"
        }
        
        flow_stats = {
            f"💧 Min Flowrate": f"{min(flowrates):.2f}",
            f"💧 Max Flowrate": f"{max(flowrates):.2f}",
            f"💧 Avg Flowrate": f"{sum(flowrates)/len(flowrates):.2f}",
            f"📉 Flowrate Range": f"{max(flowrates) - min(flowrates):.2f}"
        }
        
        pressure_stats = {
            f"⚙️ Min Pressure": f"{min(pressures):.2f}",
            f"⚙️ Max Pressure": f"{max(pressures):.2f}",
            f"⚙️ Avg Pressure": f"{sum(pressures)/len(pressures):.2f}",
            f"📉 Pressure Range": f"{max(pressures) - min(pressures):.2f}"
        }
        
        # Create horizontal layout for stats cards
        stats_widget = QWidget()
        stats_layout = QHBoxLayout()
        
        stats_layout.addWidget(self.create_stats_card("🌡️ Temperature Analysis", temp_stats))
        stats_layout.addWidget(self.create_stats_card("💧 Flowrate Analysis", flow_stats))
        stats_layout.addWidget(self.create_stats_card("⚙️ Pressure Analysis", pressure_stats))
        
        stats_widget.setLayout(stats_layout)
        self.charts_layout.addWidget(stats_widget)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("🧪 Chemora - Desktop Analytics Platform")
        self.setGeometry(100, 100, 1400, 900)
        
        # Modern styling
        self.setStyleSheet("""
            QMainWindow {
                background-color: #f8f9fa;
            }
            QGroupBox {
                font-weight: bold;
                border: 2px solid #dee2e6;
                border-radius: 8px;
                margin: 5px;
                padding-top: 10px;
                background-color: white;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 8px 0 8px;
                color: #495057;
            }
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #4facfe, stop:1 #00f2fe);
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 13px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #43a3f5, stop:1 #00d9fe);
            }
            QPushButton:disabled {
                background-color: #6c757d;
                color: #adb5bd;
            }
            QListWidget {
                border: 1px solid #dee2e6;
                border-radius: 6px;
                background-color: white;
                selection-background-color: #e3f2fd;
            }
            QListWidget::item {
                padding: 12px;
                border-bottom: 1px solid #f1f3f4;
            }
            QListWidget::item:selected {
                background-color: #e3f2fd;
                color: #1976d2;
            }
            QTableWidget {
                gridline-color: #dee2e6;
                background-color: white;
                alternate-background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 6px;
            }
            QTabWidget::pane {
                border: 1px solid #dee2e6;
                border-radius: 6px;
                background-color: white;
            }
            QTabBar::tab {
                background: #e9ecef;
                color: #495057;
                padding: 12px 20px;
                margin-right: 2px;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
            }
            QTabBar::tab:selected {
                background: white;
                color: #007bff;
                border-bottom: 2px solid #007bff;
            }
            QStatusBar {
                background-color: #343a40;
                color: white;
                border: none;
            }
        """)
        
        self.api_base = "http://localhost:8000/api"
        self.auth_header = None
        
        if not self.login():
            sys.exit()
        
        self.init_ui()
        self.load_datasets()
    
    def login(self):
        dialog = LoginDialog()
        if dialog.exec_() == QDialog.Accepted:
            username, password = dialog.get_credentials()
            if not username:
                username = "admin"
            if not password:
                password = "admin"
                
            auth_string = base64.b64encode(f"{username}:{password}".encode()).decode()
            self.auth_header = {"Authorization": f"Basic {auth_string}"}
            
            try:
                response = requests.get(f"{self.api_base}/datasets/", headers=self.auth_header, timeout=5)
                if response.status_code == 200:
                    return True
            except Exception as e:
                print(f"Connection error: {e}")
            
            QMessageBox.warning(self, "Error", "Login failed! Make sure Django server is running on localhost:8000")
            return False
        return False
    
    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_splitter = QSplitter(Qt.Horizontal)
        
        # Left panel
        left_panel = QWidget()
        left_layout = QVBoxLayout()
        
        upload_group = QGroupBox("📁 Upload CSV File")
        upload_layout = QVBoxLayout()
        
        file_layout = QHBoxLayout()
        self.file_path_label = QLabel("No file selected")
        self.file_path_label.setStyleSheet("padding: 5px; background-color: #f0f0f0; border-radius: 3px;")
        select_file_btn = QPushButton("Select File")
        select_file_btn.setStyleSheet("QPushButton { background-color: #6c757d; color: white; padding: 8px; }")
        
        file_layout.addWidget(self.file_path_label)
        file_layout.addWidget(select_file_btn)
        
        upload_btn = QPushButton("Upload CSV")
        upload_btn.setStyleSheet("QPushButton { background-color: #007bff; color: white; padding: 10px; font-weight: bold; }")
        
        select_file_btn.clicked.connect(self.select_file)
        upload_btn.clicked.connect(self.upload_file)
        
        upload_layout.addLayout(file_layout)
        upload_layout.addWidget(upload_btn)
        upload_group.setLayout(upload_layout)
        
        datasets_group = QGroupBox("📊 Your Datasets")
        datasets_layout = QVBoxLayout()
        
        self.datasets_list = QListWidget()
        self.datasets_list.itemClicked.connect(self.load_equipment_data)
        self.datasets_list.setStyleSheet("QListWidget::item { padding: 8px; margin: 2px; }")
        
        datasets_layout.addWidget(self.datasets_list)
        datasets_group.setLayout(datasets_layout)
        
        left_layout.addWidget(upload_group)
        left_layout.addWidget(datasets_group)
        left_panel.setLayout(left_layout)
        
        # Right panel
        right_panel = QWidget()
        right_layout = QVBoxLayout()
        
        self.summary_label = QLabel("📈 Select a dataset to view analysis")
        self.summary_label.setStyleSheet("background-color: #e9ecef; padding: 15px; border-radius: 5px; font-size: 12px;")
        self.summary_label.setWordWrap(True)
        
        self.tab_widget = QTabWidget()
        
        self.data_table = QTableWidget()
        self.tab_widget.addTab(self.data_table, "📋 Data Table")
        
        self.chart_widget = ChartsWidget()
        self.tab_widget.addTab(self.chart_widget, "📊 Charts & Analysis")
        
        self.pdf_btn = QPushButton("📄 Generate PDF Report")
        self.pdf_btn.clicked.connect(self.download_pdf)
        self.pdf_btn.setEnabled(False)
        self.pdf_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #dc3545, stop:1 #fd7e14);
                padding: 12px;
                font-size: 14px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #c82333, stop:1 #e8650e);
            }
            QPushButton:disabled {
                background-color: #6c757d;
                color: #adb5bd;
            }
        """)
        
        right_layout.addWidget(self.summary_label)
        right_layout.addWidget(self.tab_widget)
        right_layout.addWidget(self.pdf_btn)
        right_panel.setLayout(right_layout)
        
        main_splitter.addWidget(left_panel)
        main_splitter.addWidget(right_panel)
        main_splitter.setSizes([300, 900])
        
        layout = QHBoxLayout()
        layout.addWidget(main_splitter)
        central_widget.setLayout(layout)
        
        self.selected_file = None
        self.selected_dataset_id = None
        
        self.statusBar().showMessage("Ready - Upload a CSV file to get started")
    
    def select_file(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select CSV File", "", "CSV Files (*.csv)")
        if file_path:
            self.selected_file = file_path
            filename = file_path.split('\\')[-1]
            self.file_path_label.setText(f"Selected: {filename}")
            self.statusBar().showMessage(f"File selected: {filename}")
    
    def upload_file(self):
        if not self.selected_file:
            QMessageBox.warning(self, "Error", "Please select a CSV file first!")
            return
        
        self.statusBar().showMessage("Uploading file...")
        
        try:
            with open(self.selected_file, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{self.api_base}/upload/", 
                                       files=files, headers=self.auth_header, timeout=10)
            
            if response.status_code == 200:
                QMessageBox.information(self, "Success", "File uploaded successfully!")
                self.load_datasets()
                self.selected_file = None
                self.file_path_label.setText("No file selected")
                self.statusBar().showMessage("File uploaded successfully")
            else:
                error_msg = response.json().get('error', 'Unknown error') if response.content else 'Server error'
                QMessageBox.warning(self, "Error", f"Upload failed: {error_msg}")
                self.statusBar().showMessage("Upload failed")
        
        except Exception as e:
            QMessageBox.warning(self, "Error", f"Upload failed: {str(e)}")
            self.statusBar().showMessage("Upload failed")
    
    def load_datasets(self):
        try:
            response = requests.get(f"{self.api_base}/datasets/", headers=self.auth_header, timeout=5)
            if response.status_code == 200:
                datasets = response.json()
                self.datasets_list.clear()
                
                for dataset in datasets:
                    item_text = f"📁 {dataset['name']}\\n   Equipment: {dataset['equipment_count']} items"
                    item = QListWidgetItem(item_text)
                    item.setData(Qt.UserRole, dataset['id'])
                    self.datasets_list.addItem(item)
                
                self.statusBar().showMessage(f"Loaded {len(datasets)} datasets")
            else:
                QMessageBox.warning(self, "Error", "Failed to load datasets")
        
        except Exception as e:
            QMessageBox.warning(self, "Error", f"Failed to load datasets: {str(e)}")
    
    def load_equipment_data(self, item):
        dataset_id = item.data(Qt.UserRole)
        self.selected_dataset_id = dataset_id
        
        self.statusBar().showMessage("Loading equipment data...")
        
        try:
            equipment_response = requests.get(f"{self.api_base}/equipment/{dataset_id}/", 
                                            headers=self.auth_header, timeout=10)
            summary_response = requests.get(f"{self.api_base}/summary/{dataset_id}/", 
                                          headers=self.auth_header, timeout=10)
            
            if equipment_response.status_code == 200 and summary_response.status_code == 200:
                equipment_data = equipment_response.json()
                summary_data = summary_response.json()
                
                type_dist = ", ".join([f"{k}: {v}" for k, v in summary_data['type_distribution'].items()])
                summary_text = f"""📊 DATASET ANALYSIS SUMMARY

🔢 Total Equipment: {summary_data['total_count']} items
📈 Average Flowrate: {summary_data['avg_flowrate']:.2f}
📊 Average Pressure: {summary_data['avg_pressure']:.2f}
🌡️ Average Temperature: {summary_data['avg_temperature']:.2f}

🏭 Equipment Types: {type_dist}

Click on the 'Charts & Analysis' tab to see detailed visualizations!"""
                self.summary_label.setText(summary_text)
                
                self.update_table(equipment_data)
                self.chart_widget.plot_data(equipment_data, summary_data)
                
                self.pdf_btn.setEnabled(True)
                
                self.statusBar().showMessage(f"Loaded {len(equipment_data)} equipment records")
            else:
                QMessageBox.warning(self, "Error", "Failed to load equipment data")
                self.statusBar().showMessage("Failed to load data")
        
        except Exception as e:
            QMessageBox.warning(self, "Error", f"Failed to load equipment data: {str(e)}")
            self.statusBar().showMessage("Error loading data")
    
    def update_table(self, data):
        if not data:
            return
        
        self.data_table.setRowCount(len(data))
        self.data_table.setColumnCount(5)
        self.data_table.setHorizontalHeaderLabels(['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature'])
        
        for row, item in enumerate(data):
            self.data_table.setItem(row, 0, QTableWidgetItem(str(item['name'])))
            self.data_table.setItem(row, 1, QTableWidgetItem(str(item['type'])))
            self.data_table.setItem(row, 2, QTableWidgetItem(f"{item['flowrate']:.2f}"))
            self.data_table.setItem(row, 3, QTableWidgetItem(f"{item['pressure']:.2f}"))
            self.data_table.setItem(row, 4, QTableWidgetItem(f"{item['temperature']:.2f}"))
        
        self.data_table.resizeColumnsToContents()
        self.data_table.setAlternatingRowColors(True)
    
    def download_pdf(self):
        if not self.selected_dataset_id:
            return
        
        self.statusBar().showMessage("Generating PDF report...")
        
        try:
            response = requests.get(f"{self.api_base}/report/{self.selected_dataset_id}/", 
                                  headers=self.auth_header, timeout=10)
            
            if response.status_code == 200:
                file_path, _ = QFileDialog.getSaveFileName(self, "Save PDF Report", 
                                                         f"equipment_report_{self.selected_dataset_id}.pdf", 
                                                         "PDF Files (*.pdf)")
                if file_path:
                    with open(file_path, 'wb') as f:
                        f.write(response.content)
                    QMessageBox.information(self, "Success", f"PDF report saved successfully!\\n\\nSaved to: {file_path}")
                    self.statusBar().showMessage("PDF report saved")
            else:
                QMessageBox.warning(self, "Error", "Failed to generate PDF report")
                self.statusBar().showMessage("PDF generation failed")
        
        except Exception as e:
            QMessageBox.warning(self, "Error", f"Failed to download PDF: {str(e)}")
            self.statusBar().showMessage("PDF download failed")

def main():
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    
    app.setApplicationName("Chemical Equipment Visualizer")
    app.setApplicationVersion("1.0")
    
    window = MainWindow()
    window.show()
    
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()