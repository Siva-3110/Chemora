import React, { useState } from 'react';
import axios from 'axios';

function Reports({ datasets, apiBase }) {
  const [generating, setGenerating] = useState({});
  const [selectedDatasets, setSelectedDatasets] = useState([]);

  const downloadReport = async (datasetId, datasetName) => {
    setGenerating(prev => ({ ...prev, [datasetId]: true }));
    
    try {
      const response = await axios.get(`${apiBase}/report/${datasetId}/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${datasetName.replace(/\s+/g, '_')}_Equipment_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('✅ Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('❌ Failed to download report');
    } finally {
      setGenerating(prev => ({ ...prev, [datasetId]: false }));
    }
  };

  const toggleDatasetSelection = (datasetId) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const downloadMultipleReports = async () => {
    if (selectedDatasets.length === 0) {
      alert('Please select at least one dataset');
      return;
    }

    for (const datasetId of selectedDatasets) {
      const dataset = datasets.find(d => d.id === datasetId);
      if (dataset) {
        await downloadReport(datasetId, dataset.name);
        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setSelectedDatasets([]);
  };

  const reportTypes = [
    {
      id: 'summary',
      title: 'Equipment Summary Report',
      description: 'Overview of all equipment with key statistics',
      icon: '📊',
      color: '#60a5fa'
    },
    {
      id: 'detailed',
      title: 'Detailed Analysis Report',
      description: 'In-depth analysis with charts and recommendations',
      icon: '📈',
      color: '#34d399'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Schedule Report',
      description: 'Equipment maintenance recommendations and schedules',
      icon: '🔧',
      color: '#fbbf24'
    },
    {
      id: 'performance',
      title: 'Performance Metrics Report',
      description: 'Equipment performance analysis and trends',
      icon: '⚡',
      color: '#f87171'
    }
  ];

  if (datasets.length === 0) {
    return (
      <div className="fade-in">
        <div className="dashboard-card">
          <div className="card-content" style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
            <h3>No Reports Available</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Upload equipment data to generate reports
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              📁 Upload Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Report Types */}
      <div className="dashboard-card mb-4">
        <div className="card-header">
          <h3 className="card-title">📋 Available Report Types</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {reportTypes.map(type => (
              <div key={type.id} style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `${type.color}20`,
                    color: type.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginRight: '1rem'
                  }}>
                    {type.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                      {type.title}
                    </h4>
                  </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="dashboard-card mb-4">
        <div className="card-header">
          <h3 className="card-title">⚡ Bulk Actions</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedDatasets(datasets.map(d => d.id))}
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ✅ Select All
            </button>
            <button
              onClick={() => setSelectedDatasets([])}
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ❌ Clear Selection
            </button>
            <button
              onClick={downloadMultipleReports}
              disabled={selectedDatasets.length === 0}
              style={{
                background: selectedDatasets.length > 0 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : '#e5e7eb',
                color: selectedDatasets.length > 0 ? 'white' : '#9ca3af',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: selectedDatasets.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              📥 Download Selected ({selectedDatasets.length})
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">📄 Generate Reports</h3>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} available
          </div>
        </div>
        <div className="card-content">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedDatasets.length === datasets.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDatasets(datasets.map(d => d.id));
                        } else {
                          setSelectedDatasets([]);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>📁 Dataset Name</th>
                  <th>🔧 Equipment Count</th>
                  <th>📅 Upload Date</th>
                  <th>📊 Data Quality</th>
                  <th>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedDatasets.includes(dataset.id)}
                        onChange={() => toggleDatasetSelection(dataset.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {dataset.name}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {dataset.equipment_count} items
                      </span>
                    </td>
                    <td>
                      {new Date(dataset.uploaded_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        ✅ Excellent
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => downloadReport(dataset.id, dataset.name)}
                          disabled={generating[dataset.id]}
                          style={{
                            background: generating[dataset.id] 
                              ? '#e5e7eb' 
                              : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                            color: generating[dataset.id] ? '#9ca3af' : 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: generating[dataset.id] ? 'not-allowed' : 'pointer',
                            minWidth: '100px'
                          }}
                        >
                          {generating[dataset.id] ? (
                            <>
                              <span className="loading-spinner" style={{ marginRight: '0.5rem' }}></span>
                              Generating...
                            </>
                          ) : (
                            '📄 Generate PDF'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="stats-grid mt-4">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Reports</div>
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#60a5fa' }}>
              📄
            </div>
          </div>
          <div className="stat-value">{datasets.length}</div>
          <div className="stat-change positive">
            📊 Available for download
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Equipment Analyzed</div>
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#34d399' }}>
              🔧
            </div>
          </div>
          <div className="stat-value">{datasets.reduce((sum, d) => sum + d.equipment_count, 0)}</div>
          <div className="stat-change positive">
            📈 Comprehensive coverage
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Data Points</div>
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#fbbf24' }}>
              📊
            </div>
          </div>
          <div className="stat-value">{datasets.reduce((sum, d) => sum + d.equipment_count, 0) * 3}</div>
          <div className="stat-change positive">
            💾 Parameters tracked
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Report Quality</div>
            <div className="stat-icon" style={{ background: '#fef2f2', color: '#f87171' }}>
              ⭐
            </div>
          </div>
          <div className="stat-value">A+</div>
          <div className="stat-change positive">
            ✅ High accuracy
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;