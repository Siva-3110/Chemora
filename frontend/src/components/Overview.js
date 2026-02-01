import React from 'react';

function Overview({ datasets, loading }) {
  const totalEquipment = datasets.reduce((sum, dataset) => sum + dataset.equipment_count, 0);
  const totalDatasets = datasets.length;
  const recentDataset = datasets[0];

  const stats = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      icon: '🔧',
      color: '#60a5fa',
      change: '+12%',
      positive: true
    },
    {
      title: 'Active Datasets',
      value: totalDatasets,
      icon: '📊',
      color: '#34d399',
      change: '+5%',
      positive: true
    },
    {
      title: 'Data Points',
      value: totalEquipment * 3, // Assuming 3 parameters per equipment
      icon: '📈',
      color: '#fbbf24',
      change: '+8%',
      positive: true
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: '✅',
      color: '#10b981',
      change: '99.9%',
      positive: true
    }
  ];

  const recentActivities = [
    {
      icon: '📁',
      title: 'New dataset uploaded',
      description: recentDataset ? `${recentDataset.name} - ${recentDataset.equipment_count} items` : 'No recent uploads',
      time: recentDataset ? new Date(recentDataset.uploaded_at).toLocaleDateString() : 'N/A',
      color: '#60a5fa'
    },
    {
      icon: '📊',
      title: 'Analytics generated',
      description: 'Equipment performance report created',
      time: '2 hours ago',
      color: '#34d399'
    },
    {
      icon: '🔄',
      title: 'Data synchronized',
      description: 'All equipment parameters updated',
      time: '4 hours ago',
      color: '#fbbf24'
    },
    {
      icon: '📄',
      title: 'Report exported',
      description: 'Monthly equipment summary downloaded',
      time: '1 day ago',
      color: '#f87171'
    }
  ];

  if (loading) {
    return (
      <div className="fade-in">
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-title">{stat.title}</div>
              <div 
                className="stat-icon"
                style={{ background: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              <span>{stat.positive ? '↗️' : '↘️'}</span>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">🚀 Quick Actions</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button 
                className="card-action"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📁 Upload New Data
              </button>
              <button 
                className="card-action"
                style={{
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📊 Generate Report
              </button>
              <button 
                className="card-action"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📈 View Analytics
              </button>
              <button 
                className="card-action"
                style={{
                  background: 'linear-gradient(135deg, #f87171, #ef4444)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ⚙️ System Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">📋 Recent Activity</h3>
            <button className="card-action">View All</button>
          </div>
          <div className="card-content">
            <ul className="activity-list">
              {recentActivities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ background: `${activity.color}20`, color: activity.color }}
                  >
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">🏥 System Health</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>API Response Time</span>
                <span style={{ fontSize: '0.875rem', color: '#10b981' }}>125ms</span>
              </div>
              <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#10b981', height: '100%', width: '85%', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Database Performance</span>
                <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Excellent</span>
              </div>
              <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#10b981', height: '100%', width: '92%', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Storage Usage</span>
                <span style={{ fontSize: '0.875rem', color: '#fbbf24' }}>68%</span>
              </div>
              <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#fbbf24', height: '100%', width: '68%', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;