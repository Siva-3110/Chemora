# Chemical Equipment Visualizer - Demo Instructions

## Quick Start Demo

### Prerequisites
- Python 3.8+ installed
- Node.js 14+ installed (for web frontend)
- Git installed

### Demo Steps

1. **Start the Backend Server**
   ```
   Double-click: start_backend.bat
   ```
   - This will create an admin user (username: admin, password: admin)
   - Backend will run on http://localhost:8000

2. **Option A: Web Frontend Demo**
   ```
   Double-click: start_frontend.bat
   ```
   - Web app will open at http://localhost:3000
   - Login with: admin/admin

3. **Option B: Desktop App Demo**
   ```
   Double-click: start_desktop.bat
   ```
   - Desktop app will launch
   - Login with: admin/admin

### Demo Flow

1. **Login**: Use admin/admin credentials
2. **Upload CSV**: Use the provided `sample_equipment_data.csv`
3. **View Data**: Click on uploaded dataset to see:
   - Equipment data table
   - Summary statistics
   - Interactive charts
4. **Download Report**: Generate PDF report
5. **Test Both Interfaces**: Try both web and desktop versions

### Sample Data
The `sample_equipment_data.csv` contains:
- 10 pieces of chemical equipment
- Equipment types: Reactor, Heat Exchanger, Pump, Column, etc.
- Parameters: Flowrate, Pressure, Temperature

### Features Demonstrated
- ✅ CSV Upload (Web & Desktop)
- ✅ Data Visualization (Charts.js & Matplotlib)
- ✅ Summary Statistics
- ✅ PDF Report Generation
- ✅ Basic Authentication
- ✅ History Management (last 5 datasets)
- ✅ Responsive Web UI
- ✅ Native Desktop UI

### API Testing
You can also test the API directly:
- GET http://localhost:8000/api/datasets/ (with Basic Auth)
- POST http://localhost:8000/api/upload/ (with CSV file)

### Troubleshooting
- If ports are busy, change them in the code
- Ensure all dependencies are installed
- Check that Django migrations are applied

### Video Demo Script
1. Show project structure
2. Start backend server
3. Demo web interface:
   - Login
   - Upload CSV
   - View charts and data
   - Download PDF
4. Demo desktop app:
   - Same functionality in native app
   - Show matplotlib charts
5. Highlight key features and code structure