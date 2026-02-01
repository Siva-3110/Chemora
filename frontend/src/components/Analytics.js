import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Analytics({ datasets, selectedDataset, onDatasetSelect, apiBase, onDatasetChange }) {
  const [equipmentData, setEquipmentData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Upload states
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (datasets.length > 0 && !selectedDataset) {
      onDatasetSelect(datasets[0].id);
    }
  }, [datasets, selectedDataset, onDatasetSelect]);

  useEffect(() => {
    if (selectedDataset) {
      loadAnalyticsData(selectedDataset);
    }
  }, [selectedDataset]);

  // Upload functions
  const validateFile = (file) => {
    if (!file) return 'No file selected';
    if (file.type !== 'text/csv') return 'Only .csv files are allowed';
    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
    setError('');
    setUploadResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${apiBase}/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const datasetsResponse = await axios.get(`${apiBase}/datasets/`);
      const latestDataset = datasetsResponse.data[0];
      
      setUploadResult({
        name: selectedFile.name,
        equipmentCount: latestDataset?.equipment_count || 0
      });
      
      setSelectedFile(null);
      onDatasetChange();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Upload failed';
      if (errorMsg.includes('columns')) {
        setError('Required columns missing: Equipment Name, Type, Flowrate, Pressure, Temperature');
      } else {
        setError(errorMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  const loadAnalyticsData = async (datasetId) => {
    try {
      setLoading(true);
      const [equipmentResponse, summaryResponse] = await Promise.all([
        axios.get(`${apiBase}/equipment/${datasetId}/`),
        axios.get(`${apiBase}/summary/${datasetId}/`)
      ]);
      
      setEquipmentData(equipmentResponse.data);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!summary || !equipmentData.length) return null;

    // Equipment Type vs Count (Bar Chart)
    const typeData = {
      labels: Object.keys(summary.type_distribution),
      datasets: [{
        label: 'Equipment Count',
        data: Object.values(summary.type_distribution),
        backgroundColor: [
          'linear-gradient(180deg, #ff6b6b 0%, #e74c3c 100%)',
          'linear-gradient(180deg, #ffa726 0%, #f57c00 100%)',
          'linear-gradient(180deg, #ffeb3b 0%, #ff9800 100%)',
          'linear-gradient(180deg, #66bb6a 0%, #388e3c 100%)',
          'linear-gradient(180deg, #26c6da 0%, #0097a7 100%)',
          'linear-gradient(180deg, #42a5f5 0%, #1976d2 100%)',
          'linear-gradient(180deg, #ab47bc 0%, #7b1fa2 100%)',
          'linear-gradient(180deg, #ec407a 0%, #c2185b 100%)'
        ],
        borderColor: [
          '#e74c3c', '#f57c00', '#ff9800', '#388e3c', 
          '#0097a7', '#1976d2', '#7b1fa2', '#c2185b'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };

    // Flowrate vs Pressure (Line Chart)
    const scatterData = {
      labels: equipmentData.map((item, index) => `Equipment ${index + 1}`),
      datasets: [{
        label: 'Flowrate',
        data: equipmentData.map(item => item.flowrate),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }, {
        label: 'Pressure',
        data: equipmentData.map(item => item.pressure),
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10b981',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }]
    };

    // Type Distribution (Pie Chart)
    const pieData = {
      labels: Object.keys(summary.type_distribution),
      datasets: [{
        data: Object.values(summary.type_distribution),
        backgroundColor: [
          '#ff6b6b', '#ffa726', '#ffeb3b', '#66bb6a',
          '#26c6da', '#42a5f5', '#ab47bc', '#ec407a'
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 10,
      }]
    };

    return { typeData, scatterData, pieData };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: '#64748b',
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: '#64748b'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutCubic'
    }
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: '#64748b',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: '#64748b'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutCubic'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '600'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const backgroundColor = dataset.backgroundColor[i];
                return {
                  text: label,
                  fillStyle: backgroundColor,
                  strokeStyle: backgroundColor,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutCubic'
    }
  };

  // Filter equipment data
  const filteredData = equipmentData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = [...new Set(equipmentData.map(item => item.type))];
  const chartData = getChartData();

  return (
    <div className="fade-in">
      {/* Upload Section */}
      <div className="card analytics-section">
        <div className="card-header">
          <h3 className="card-title">📤 Upload Dataset</h3>
        </div>
        <div className="card-content">
          <div 
            className={`upload-zone ${dragOver ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            {selectedFile ? (
              <div>
                <div className="upload-icon" style={{ color: '#10b981' }}>✅</div>
                <div className="upload-text" style={{ color: '#10b981' }}>
                  {selectedFile.name}
                </div>
                <div className="upload-subtext">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div>
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  Drag & drop your CSV file here
                </div>
                <div className="upload-subtext">
                  or click to browse files
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              fontSize: '0.875rem'
            }}>
              ❌ {error}
            </div>
          )}

          {uploadResult && (
            <div style={{
              background: '#ecfdf5',
              color: '#059669',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              fontSize: '0.875rem'
            }}>
              ✅ Upload success! Dataset "{uploadResult.name}" uploaded with {uploadResult.equipmentCount} equipment records.
            </div>
          )}

          {selectedFile && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn btn-primary"
                style={{ marginRight: '1rem' }}
              >
                {uploading ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: '0.5rem', width: '16px', height: '16px' }}></span>
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setError('');
                  setUploadResult(null);
                }}
                className="btn btn-secondary"
              >
                Clear
              </button>
            </div>
          )}

          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#eff6ff',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <strong>📋 Required CSV Columns:</strong><br />
            Equipment Name, Type, Flowrate, Pressure, Temperature
          </div>
        </div>
      </div>

      {datasets.length === 0 ? (
        <div className="card">
          <div className="card-content text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
            <h3>No Data Available</h3>
            <p style={{ color: '#64748b' }}>Upload CSV data above to see analytics</p>
          </div>
        </div>
      ) : (
        <>
          {/* Dataset Selector */}
          <div className="card analytics-section">
            <div className="card-header">
              <h3 className="card-title">Recent Datasets</h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {datasets.map(dataset => (
                  <button
                    key={dataset.id}
                    onClick={() => onDatasetSelect(dataset.id)}
                    className={`btn ${selectedDataset === dataset.id ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {dataset.name} ({dataset.equipment_count} items)
                  </button>
                ))}
              </div>
            </div>
          </div>

      {loading ? (
        <div className="card">
          <div className="card-content text-center">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      ) : summary && chartData ? (
        <>
          {/* Summary Cards */}
          <div className="stats-grid analytics-section">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Total Equipment</div>
                <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  🔧
                </div>
              </div>
              <div className="stat-value">{summary.total_count}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Avg Flowrate</div>
                <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  💧
                </div>
              </div>
              <div className="stat-value">{summary.avg_flowrate.toFixed(1)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Avg Pressure</div>
                <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                  ⚡
                </div>
              </div>
              <div className="stat-value">{summary.avg_pressure.toFixed(1)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Avg Temperature</div>
                <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                  🌡️
                </div>
              </div>
              <div className="stat-value">{summary.avg_temperature.toFixed(1)}°</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Equipment Types</div>
                <div className="stat-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}>
                  🏭
                </div>
              </div>
              <div className="stat-value">{Object.keys(summary.type_distribution).length}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Equipment Type vs Count</h3>
              <div className="chart-container">
                <Bar data={chartData.typeData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Flowrate vs Pressure Trends</h3>
              <div className="chart-container">
                <Line data={chartData.scatterData} options={scatterOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Type Distribution</h3>
              <div className="chart-container">
                <Pie data={chartData.pieData} options={pieOptions} />
              </div>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="card analytics-section">
            <div className="card-header">
              <h3 className="card-title">Equipment Details</h3>
            </div>
            <div className="card-content">
              {/* Search and Filter */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search by equipment name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Equipment Name</th>
                      <th>Type</th>
                      <th>Flowrate</th>
                      <th>Pressure</th>
                      <th>Temperature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>{item.name}</td>
                        <td>
                          <span style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {item.type}
                          </span>
                        </td>
                        <td>{item.flowrate.toFixed(2)}</td>
                        <td>{item.pressure.toFixed(2)}</td>
                        <td>{item.temperature.toFixed(2)}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredData.length === 0 && (
                <div className="text-center" style={{ padding: '2rem', color: '#64748b' }}>
                  No equipment found matching your search criteria.
                </div>
              )}
              
              {filteredData.length > 0 && filteredData.length !== equipmentData.length && (
                <div className="text-center mt-2" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Showing {filteredData.length} of {equipmentData.length} equipment items
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="card-content text-center">
            <h3>Select a dataset to view analytics</h3>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default Analytics;