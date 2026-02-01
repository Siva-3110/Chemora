import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TestChart() {
  const data = {
    labels: ['📈 Sample Data', '🔧 Test Equipment', '📊 Analytics'],
    datasets: [
      {
        label: '🎆 Chart.js Integration Test',
        data: [85, 92, 78],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(16, 172, 132, 0.8)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(16, 172, 132, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
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
        text: '✅ Chart.js Successfully Loaded!',
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
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem',
      borderRadius: '15px',
      marginBottom: '2rem',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{
        color: '#333',
        marginBottom: '1rem',
        fontSize: '1.2rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        📊 Visualization System Status
      </h3>
      <div style={{ height: '200px' }}>
        <Bar data={data} options={options} />
      </div>
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(16, 172, 132, 0.1)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#10ac84',
        textAlign: 'center',
        fontWeight: '600'
      }}>
        ✅ Chart.js is working perfectly! Your data visualizations will appear here.
      </div>
    </div>
  );
}

export default TestChart;