import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Charts({ data, summary, loading }) {
  console.log('Charts component - data:', data);
  console.log('Charts component - summary:', summary);
  
  if (loading) {
    return (
      <div className="charts-container">
        <div className="chart">
          <h3>🔄 Loading Charts...</h3>
          <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
            <div className="loading">Generating visualizations...</div>
          </div>
        </div>
        <div className="chart">
          <h3>🔄 Loading Analysis...</h3>
          <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
            <div className="loading">Processing data...</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="charts-container">
        <div className="chart">
          <h3>📈 No Equipment Data Available</h3>
          <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
            <p>📁 Please upload a CSV file and select a dataset to view charts.</p>
            <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>Charts will show parameter analysis and equipment distribution.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="charts-container">
        <div className="chart">
          <h3>🔄 Loading Summary...</h3>
          <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
            <p>Please wait while we calculate the statistics.</p>
          </div>
        </div>
      </div>
    );
  }

  try {
    // Average values bar chart with enhanced styling
    const avgData = {
      labels: ['💧 Flowrate', '⚡ Pressure', '🌡️ Temperature'],
      datasets: [
        {
          label: 'Average Values',
          data: [
            summary.avg_flowrate || 0,
            summary.avg_pressure || 0,
            summary.avg_temperature || 0
          ],
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };

    // Equipment type distribution pie chart with enhanced colors
    const typeLabels = Object.keys(summary.type_distribution || {});
    const typeCounts = Object.values(summary.type_distribution || {});
    
    const typeData = {
      labels: typeLabels.map(label => `🔧 ${label}`),
      datasets: [
        {
          data: typeCounts,
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 10
        },
      ],
    };

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12,
              weight: '600'
            },
            color: '#333',
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: '📈 Average Equipment Parameters',
          font: {
            size: 16,
            weight: '700'
          },
          color: '#333',
          padding: 20
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(102, 126, 234, 0.8)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#666',
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#666',
            font: {
              size: 11,
              weight: '600'
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              size: 12,
              weight: '600'
            },
            color: '#333',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 15
          }
        },
        title: {
          display: true,
          text: '🏢 Equipment Type Distribution',
          font: {
            size: 16,
            weight: '700'
          },
          color: '#333',
          padding: 20
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(102, 126, 234, 0.8)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000
      }
    };

    return (
      <div className="charts-container">
        <div className="chart">
          <div style={{ height: '350px' }}>
            <Bar data={avgData} options={barOptions} />
          </div>
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            📈 <strong>Insights:</strong> Average values across all equipment in your dataset
          </div>
        </div>
        
        <div className="chart">
          <div style={{ height: '350px' }}>
            {typeLabels.length > 0 ? (
              <Pie data={typeData} options={pieOptions} />
            ) : (
              <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
                <p>📂 No equipment type data available</p>
              </div>
            )}
          </div>
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(118, 75, 162, 0.05)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            🏢 <strong>Distribution:</strong> Equipment types and their quantities in your facility
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering charts:', error);
    return (
      <div className="charts-container">
        <div className="chart">
          <h3>❌ Chart Error</h3>
          <div style={{textAlign: 'center', padding: '3rem', color: '#ff6b6b'}}>
            <p>There was an error rendering the charts.</p>
            <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>Data available: {data ? data.length : 0} items</p>
            <p style={{fontSize: '0.9rem'}}>Summary available: {summary ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Charts;