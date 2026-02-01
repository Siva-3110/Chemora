import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Analytics from './Analytics';
import History from './History';
import '../Dashboard.css';

function Dashboard({ user, onLogout, apiBase }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBase}/datasets/`);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { id: 'analytics', label: 'Data Analytics', icon: '' },
    { id: 'history', label: 'History', icon: '' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <Analytics 
            datasets={datasets} 
            selectedDataset={selectedDataset}
            onDatasetSelect={setSelectedDataset}
            onDatasetChange={loadDatasets}
            apiBase={apiBase} 
          />
        );
      case 'history':
        return (
          <History 
            datasets={datasets} 
            onAnalyze={setSelectedDataset}
            onTabChange={setActiveTab}
            apiBase={apiBase} 
          />
        );
      default:
        return (
          <Analytics 
            datasets={datasets} 
            selectedDataset={selectedDataset}
            onDatasetSelect={setSelectedDataset}
            onDatasetChange={loadDatasets}
            apiBase={apiBase} 
          />
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>🔬 Chemora</h1>
          <p>Analytics Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h4>{user.username}</h4>
              <p>User</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <h1 className="page-title">
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          
          <div className="top-bar-actions">
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;