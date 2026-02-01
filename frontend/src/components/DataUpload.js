import React, { useState } from 'react';
import axios from 'axios';

function DataUpload({ onDatasetChange, apiBase }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

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
      
      // Get dataset info to show upload result
      const datasetsResponse = await axios.get(`${apiBase}/datasets/`);
      const latestDataset = datasetsResponse.data[0]; // Most recent dataset
      
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

  return (
    <div className="fade-in">
      {/* Upload Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📤 Upload CSV File</h3>
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

          {/* Validation Messages */}
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

          {/* Upload Button */}
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

          {/* Requirements */}
          <div style={{
            marginTop: '2rem',
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
    </div>
  );
}

export default DataUpload;