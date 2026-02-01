import React, { useState } from 'react';
import axios from 'axios';

function History({ datasets, onAnalyze, onTabChange, apiBase }) {
  const [generating, setGenerating] = useState({});

  const downloadReport = async (datasetId, datasetName) => {
    setGenerating(prev => ({ ...prev, [datasetId]: true }));
    
    try {
      const response = await axios.get(`${apiBase}/report/${datasetId}/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${datasetName.replace(/\s+/g, '_')}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    } finally {
      setGenerating(prev => ({ ...prev, [datasetId]: false }));
    }
  };

  const handleAnalyze = (datasetId) => {
    onAnalyze(datasetId);
    onTabChange('analytics');
  };

  // Show only last 5 datasets
  const last5Datasets = datasets.slice(0, 5);

  if (datasets.length === 0) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-content text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🕒</div>
            <h3>No Upload History</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Upload CSV files to see your history here
            </p>
            <button 
              onClick={() => onTabChange('upload')}
              className="btn btn-primary"
            >
              Upload Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card analytics-section">
        <div className="card-header">
          <h3 className="card-title">🕒 Last 5 Datasets</h3>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing {last5Datasets.length} of {datasets.length} total datasets
          </div>
        </div>
        <div className="card-content">
          {last5Datasets.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
              <h3>No datasets found</h3>
              <p>Upload your first CSV file to get started</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dataset Name</th>
                    <th>Upload Date</th>
                    <th>Equipment Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {last5Datasets.map((dataset) => (
                    <tr key={dataset.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                          {dataset.name}
                        </div>
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAnalyze(dataset.id)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          >
                            Analyze
                          </button>
                          <button
                            onClick={() => downloadReport(dataset.id, dataset.name)}
                            disabled={generating[dataset.id]}
                            className="btn btn-success"
                            style={{ 
                              fontSize: '0.875rem', 
                              padding: '0.5rem 1rem',
                              minWidth: '120px'
                            }}
                          >
                            {generating[dataset.id] ? (
                              <>
                                <span className="loading-spinner" style={{ marginRight: '0.5rem', width: '12px', height: '12px' }}></span>
                                Generating...
                              </>
                            ) : (
                              'Generate PDF'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {last5Datasets.length > 0 && (
        <div className="stats-grid analytics-section">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Total Datasets</div>
              <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                📁
              </div>
            </div>
            <div className="stat-value">{datasets.length}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Total Equipment</div>
              <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                🔧
              </div>
            </div>
            <div className="stat-value">
              {datasets.reduce((sum, d) => sum + d.equipment_count, 0)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Latest Upload</div>
              <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                🕒
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {new Date(datasets[0].uploaded_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Storage Used</div>
              <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                💾
              </div>
            </div>
            <div className="stat-value">{datasets.length}/5</div>
          </div>
        </div>
      )}

      {/* Storage Warning */}
      {datasets.length >= 5 && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fbbf24',
          color: '#92400e',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          marginTop: '1rem'
        }}>
          ⚠️ <strong>Storage Limit:</strong> You have reached the maximum of 5 datasets. 
          New uploads will replace the oldest dataset.
        </div>
      )}
    </div>
  );
}

export default History;