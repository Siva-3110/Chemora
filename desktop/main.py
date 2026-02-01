import sys
import requests
import base64
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

class LoginDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer - Login")
        self.setFixedSize(350, 200)
        
        layout = QVBoxLayout()
        
        title = QLabel("Chemical Equipment Visualizer")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 16px; font-weight: bold; margin: 10px;")
        
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username (admin)")
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password (admin)")
        self.password_input.setEchoMode(QLineEdit.Password)
        
        login_btn = QPushButton("Login")
        login_btn.clicked.connect(self.accept)
        login_btn.setStyleSheet("QPushButton { background-color: #007bff; color: white; padding: 8px; }")
        
        layout.addWidget(title)
        layout.addWidget(QLabel("Username:"))
        layout.addWidget(self.username_input)
        layout.addWidget(QLabel("Password:"))
        layout.addWidget(self.password_input)
        layout.addWidget(login_btn)
        
        self.setLayout(layout)
    
    def get_credentials(self):
        return self.username_input.text(), self.password_input.text()

class TextChartsWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        
        self.charts_widget = QWidget()
        self.charts_layout = QVBoxLayout()
        self.charts_widget.setLayout(self.charts_layout)
        
        scroll.setWidget(self.charts_widget)
        layout.addWidget(scroll)
        
        self.setLayout(layout)
    
    def create_bar_chart(self, title, data, labels, colors=None):
        chart_widget = QGroupBox(title)
        chart_layout = QVBoxLayout()
        
        if not data or not labels:
            chart_layout.addWidget(QLabel("No data available"))
            chart_widget.setLayout(chart_layout)
            return chart_widget
        
        max_value = max(data) if data else 1
        chart_width = 40
        
        for i, (label, value) in enumerate(zip(labels, data)):
            row_layout = QHBoxLayout()
            
            label_widget = QLabel(f"{label}:")
            label_widget.setFixedWidth(100)
            label_widget.setAlignment(Qt.AlignRight)
            
            bar_length = int((value / max_value) * chart_width) if max_value > 0 else 0
            bar_text = "█" * bar_length + "░" * (chart_width - bar_length)
            bar_widget = QLabel(bar_text)
            bar_widget.setFont(QFont("Courier", 8))
            
            if colors and i < len(colors):
                bar_widget.setStyleSheet(f"color: {colors[i]};")
            
            value_widget = QLabel(f" {value:.2f}")
            value_widget.setFixedWidth(80)
            
            row_layout.addWidget(label_widget)
            row_layout.addWidget(bar_widget)
            row_layout.addWidget(value_widget)
            row_layout.addStretch()
            
            chart_layout.addLayout(row_layout)
        
        chart_widget.setLayout(chart_layout)
        return chart_widget
    
    def create_pie_chart(self, title, data_dict):
        chart_widget = QGroupBox(title)
        chart_layout = QVBoxLayout()
        
        if not data_dict:
            chart_layout.addWidget(QLabel("No data available"))
            chart_widget.setLayout(chart_layout)
            return chart_widget
        
        total = sum(data_dict.values())
        colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
        
        for i, (label, value) in enumerate(data_dict.items()):
            percentage = (value / total) * 100 if total > 0 else 0
            
            row_layout = QHBoxLayout()
            
            color_label = QLabel("●")
            color_label.setStyleSheet(f"color: {colors[i % len(colors)]}; font-size: 16px;")
            color_label.setFixedWidth(20)
            
            text_label = QLabel(f"{label}: {value} ({percentage:.1f}%)")
            text_label.setFixedWidth(200)
            
            bar_length = int(percentage / 2)
            bar_text = "█" * bar_length
            bar_label = QLabel(bar_text)
            bar_label.setStyleSheet(f"color: {colors[i % len(colors)]};")
            bar_label.setFont(QFont("Courier", 8))
            
            row_layout.addWidget(color_label)
            row_layout.addWidget(text_label)
            row_layout.addWidget(bar_label)
            row_layout.addStretch()
            
            chart_layout.addLayout(row_layout)
        
        chart_widget.setLayout(chart_layout)
        return chart_widget
    
    def create_scatter_plot(self, title, x_data, y_data, x_label, y_label):
        chart_widget = QGroupBox(title)
        chart_layout = QVBoxLayout()
        
        if not x_data or not y_data:
            chart_layout.addWidget(QLabel("No data available"))
            chart_widget.setLayout(chart_layout)
            return chart_widget
        
        info_text = f"""{x_label} vs {y_label} Analysis:

Data Points: {len(x_data)}
{x_label} Range: {min(x_data):.2f} - {max(x_data):.2f}
{y_label} Range: {min(y_data):.2f} - {max(y_data):.2f}

Correlation: {'Positive' if sum(x*y for x,y in zip(x_data, y_data)) > 0 else 'Negative'}"""
        
        info_label = QLabel(info_text)
        info_label.setStyleSheet("background-color: #f8f9fa; padding: 10px; border-radius: 5px;")
        chart_layout.addWidget(info_label)
        
        scatter_text = "Scatter Plot Visualization:\n\n"
        
        if x_data and y_data:
            x_min, x_max = min(x_data), max(x_data)
            y_min, y_max = min(y_data), max(y_data)
            
            grid_size = 10
            grid = [['·' for _ in range(grid_size)] for _ in range(grid_size)]
            
            for x, y in zip(x_data, y_data):
                if x_max > x_min and y_max > y_min:
                    x_pos = int(((x - x_min) / (x_max - x_min)) * (grid_size - 1))
                    y_pos = int(((y - y_min) / (y_max - y_min)) * (grid_size - 1))
                    grid[grid_size - 1 - y_pos][x_pos] = '●'
            
            for row in grid:
                scatter_text += ''.join(row) + '\n'
        
        scatter_label = QLabel(scatter_text)
        scatter_label.setFont(QFont("Courier", 10))
        scatter_label.setStyleSheet("background-color: #ffffff; padding: 10px; border: 1px solid #ddd;")
        chart_layout.addWidget(scatter_label)
        
        chart_widget.setLayout(chart_layout)
        return chart_widget
    
    def plot_data(self, data, summary):
        for i in reversed(range(self.charts_layout.count())): 
            self.charts_layout.itemAt(i).widget().setParent(None)
        
        if not data or not summary:
            no_data_label = QLabel("No data available for visualization")
            no_data_label.setAlignment(Qt.AlignCenter)
            no_data_label.setStyleSheet("font-size: 14px; color: #666; padding: 50px;")
            self.charts_layout.addWidget(no_data_label)
            return
        
        avg_labels = ['Flowrate', 'Pressure', 'Temperature']
        avg_values = [summary['avg_flowrate'], summary['avg_pressure'], summary['avg_temperature']]
        avg_colors = ['#FF6384', '#36A2EB', '#FFCE56']
        
        avg_chart = self.create_bar_chart("📊 Average Parameters", avg_values, avg_labels, avg_colors)
        self.charts_layout.addWidget(avg_chart)
        
        type_chart = self.create_pie_chart("🏭 Equipment Type Distribution", summary['type_distribution'])
        self.charts_layout.addWidget(type_chart)
        
        flowrates = [item['flowrate'] for item in data]
        pressures = [item['pressure'] for item in data]
        scatter_chart = self.create_scatter_plot("📈 Flowrate vs Pressure Analysis", 
                                               flowrates, pressures, "Flowrate", "Pressure")
        self.charts_layout.addWidget(scatter_chart)
        
        temperatures = [item['temperature'] for item in data]
        temp_stats = f"""🌡️ Temperature Distribution Analysis:

Count: {len(temperatures)}
Minimum: {min(temperatures):.2f}°
Maximum: {max(temperatures):.2f}°
Average: {sum(temperatures)/len(temperatures):.2f}°
Range: {max(temperatures) - min(temperatures):.2f}°"""
        
        temp_widget = QGroupBox("Temperature Statistics")
        temp_layout = QVBoxLayout()
        temp_label = QLabel(temp_stats)
        temp_label.setStyleSheet("background-color: #fff3cd; padding: 15px; border-radius: 5px;")
        temp_layout.addWidget(temp_label)
        temp_widget.setLayout(temp_layout)
        
        self.charts_layout.addWidget(temp_widget)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer - Desktop")
        self.setGeometry(100, 100, 1200, 800)
        
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
        
        self.chart_widget = TextChartsWidget()
        self.tab_widget.addTab(self.chart_widget, "📊 Charts & Analysis")
        
        self.pdf_btn = QPushButton("📄 Download PDF Report")
        self.pdf_btn.clicked.connect(self.download_pdf)
        self.pdf_btn.setEnabled(False)
        self.pdf_btn.setStyleSheet("QPushButton { background-color: #28a745; color: white; padding: 10px; font-weight: bold; }")
        
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