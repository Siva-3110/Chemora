import React from 'react';

function DataTable({ data, loading }) {
  if (loading) {
    return (
      <div className="data-table">
        <h3>📋 Equipment Data Table</h3>
        <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
          <div className="loading">🔄 Loading equipment data...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table">
        <h3>📋 Equipment Data Table</h3>
        <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
          <p>📂 No equipment data available</p>
          <p style={{fontSize: '0.9rem'}}>Upload a CSV file and select a dataset to view data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table">
      <h3>📋 Equipment Data Table ({data.length} items)</h3>
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th>🔧 Equipment Name</th>
              <th>🏢 Type</th>
              <th>💧 Flowrate</th>
              <th>⚡ Pressure</th>
              <th>🌡️ Temperature</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{fontWeight: '600', color: '#333'}}>{item.name}</td>
                <td>
                  <span style={{
                    background: getTypeColor(item.type),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500'
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
      
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(102, 126, 234, 0.05)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        📈 <strong>Quick Stats:</strong> Showing {data.length} equipment records with real-time parameter monitoring
      </div>
    </div>
  );
}

// Helper function to get color for equipment type
function getTypeColor(type) {
  const colors = {
    'Reactor': '#667eea',
    'Heat Exchanger': '#764ba2',
    'Pump': '#10ac84',
    'Column': '#ff6b6b',
    'Compressor': '#ffa726',
    'Mixer': '#ab47bc',
    'Separator': '#26c6da'
  };
  return colors[type] || '#666';
}

export default DataTable;