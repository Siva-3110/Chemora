import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

function FileUpload({ onUploadSuccess, loading }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    } else {
      alert('Please drop a valid CSV file');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a CSV file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE}/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('✅ File uploaded successfully!');
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Upload failed';
      alert(`❌ Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h2>📁 Upload Equipment Data</h2>
      <form onSubmit={handleUpload}>
        <div 
          className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragOver ? '2px dashed #10ac84' : '2px dashed #667eea',
            background: dragOver ? 'rgba(16, 172, 132, 0.1)' : 'rgba(102, 126, 234, 0.05)',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          {file ? (
            <div>
              <p style={{color: '#10ac84', fontWeight: '600'}}>
                ✅ Selected: {file.name}
              </p>
              <p style={{color: '#666', fontSize: '0.9rem'}}>
                Size: {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div>
              <p style={{color: '#667eea', fontWeight: '600', marginBottom: '0.5rem'}}>
                📄 Drag & drop your CSV file here
              </p>
              <p style={{color: '#999', fontSize: '0.9rem'}}>or click to browse</p>
            </div>
          )}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>
        
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button 
            type="submit" 
            disabled={!file || uploading || loading}
            style={{opacity: (!file || uploading || loading) ? 0.6 : 1}}
          >
            {uploading ? '🔄 Uploading...' : '🚀 Upload & Analyze'}
          </button>
          
          {file && (
            <button 
              type="button" 
              onClick={() => setFile(null)}
              style={{
                background: 'transparent',
                color: '#ff6b6b',
                border: '2px solid #ff6b6b',
                padding: '0.75rem 1.5rem'
              }}
            >
              ❌ Clear
            </button>
          )}
        </div>
        
        <div style={{marginTop: '1rem', fontSize: '0.85rem', color: '#666'}}>
          <p>📝 <strong>Required CSV columns:</strong> Equipment Name, Type, Flowrate, Pressure, Temperature</p>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;