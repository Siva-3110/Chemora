# Chemical Equipment Parameter Visualizer

A hybrid web and desktop application for visualizing chemical equipment data with Django backend, React frontend, and PyQt5 desktop client.

## Features

- CSV file upload and data parsing
- Data visualization with charts and tables
- Summary statistics and analytics
- PDF report generation
- Basic authentication
- History management (last 5 datasets)
- Cross-platform desktop and web access

## Tech Stack

- **Backend**: Django + Django REST Framework
- **Web Frontend**: React.js + Chart.js
- **Desktop Frontend**: PyQt5 + Matplotlib
- **Database**: SQLite
- **Data Processing**: Pandas

## Setup Instructions

### 1. Backend Setup (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend will run on `http://localhost:8000`

### 2. Web Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

The web app will run on `http://localhost:3000`

### 3. Desktop App Setup (PyQt5)

```bash
cd desktop
pip install -r requirements.txt
python main.py
```

## Usage

### Authentication
- Create a user account using Django admin or the createsuperuser command
- Use these credentials to login in both web and desktop applications

### CSV Format
Your CSV file must contain these columns:
- Equipment Name
- Type
- Flowrate
- Pressure
- Temperature

### Sample Data
Use the provided `sample_equipment_data.csv` file for testing.

## API Endpoints

- `POST /api/upload/` - Upload CSV file
- `GET /api/datasets/` - Get user's datasets
- `GET /api/equipment/<id>/` - Get equipment data
- `GET /api/summary/<id>/` - Get summary statistics
- `GET /api/report/<id>/` - Download PDF report

## Project Structure

```
chemical_equipment_visualizer/
├── backend/                 # Django backend
│   ├── api/                # API app
│   ├── equipment_api/      # Django project
│   └── requirements.txt
├── frontend/               # React web app
│   ├── src/
│   ├── public/
│   └── package.json
├── desktop/                # PyQt5 desktop app
│   ├── main.py
│   └── requirements.txt
└── sample_equipment_data.csv
```

## Development

1. Start the Django backend first
2. Launch either the React web app or PyQt5 desktop app
3. Login with your Django user credentials
4. Upload CSV files and visualize data

## Demo

The application demonstrates:
- File upload functionality
- Data table display
- Interactive charts (bar charts, pie charts, scatter plots)
- Summary statistics
- PDF report generation
- Authentication and session management