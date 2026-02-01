import React, { useState } from 'react';
import axios from 'axios';

function DataManagement({ datasets, onDatasetChange, apiBase }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
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
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`${apiBase}/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('✅ File uploaded successfully!');
      setSelectedFile(null);
      onDatasetChange();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Upload failed';
      alert(`❌ Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadReport = async (datasetId, datasetName) => {
    try {
      const response = await axios.get(`${apiBase}/report/${datasetId}/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${datasetName}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download report');
    }
  };

  const getEquipmentTypeColor = (type) => {
    const colors = {
      'Reactor': '#60a5fa',
      'Heat Exchanger': '#34d399',
      'Pump': '#fbbf24',
      'Column': '#f87171',
      'Compressor': '#a78bfa',
      'Mixer': '#fb7185',
      'Separator': '#06b6d4'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="fade-in">
      {/* Upload Section */}
      <div className="dashboard-card mb-4">
        <div className="card-header">
          <h3 className="card-title">📁 Upload Equipment Data</h3>
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
                  File Selected: {selectedFile.name}
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

          {selectedFile && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.6 : 1
                }}
              >
                {uploading ? '🔄 Uploading...' : '🚀 Upload & Process'}
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: '2px solid #ef4444',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ❌ Clear
              </button>
            </div>
          )}

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#eff6ff',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <strong>📋 Required CSV Format:</strong><br />
            Equipment Name, Type, Flowrate, Pressure, Temperature
          </div>
        </div>
      </div>

      {/* Datasets List */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">📊 Your Datasets ({datasets.length})</h3>
          <button className="card-action" onClick={onDatasetChange}>
            🔄 Refresh
          </button>
        </div>
        <div className="card-content">
          {datasets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
              <h3>No datasets found</h3>
              <p>Upload your first CSV file to get started</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>📁 Dataset Name</th>
                    <th>🔧 Equipment Count</th>
                    <th>📅 Upload Date</th>
                    <th>📊 Status</th>
                    <th>⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((dataset) => (
                    <tr key={dataset.id}>
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
                          day: 'numeric'
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
                          ✅ Active
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => downloadReport(dataset.id, dataset.name)}
                            style={{
                              background: '#f0f9ff',
                              color: '#0369a1',
                              border: '1px solid #0ea5e9',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            📄 Report
                          </button>
                          <button
                            style={{
                              background: '#f0fdf4',
                              color: '#15803d',
                              border: '1px solid #22c55e',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            📈 Analyze
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

      {/* Storage Info */}
      <div className="dashboard-card mt-4">
        <div className="card-header">
          <h3 className="card-title">💾 Storage Information</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Total Datasets
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                {datasets.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Total Equipment
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                {datasets.reduce((sum, d) => sum + d.equipment_count, 0)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Storage Limit
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                5 datasets
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Available Space
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: datasets.length >= 5 ? '#ef4444' : '#10b981' }}>
                {5 - datasets.length} slots
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataManagement;