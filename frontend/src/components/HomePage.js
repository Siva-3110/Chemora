import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div className="homepage">
      {/* Header / Navigation */}
      <header className="homepage-header">
        <div className="container">
          <div className="nav-brand">
            <div className="logo-container">
              <img src="/chemora image.jpg" alt="Chemora Logo" className="logo" width="24" height="24" />
            </div>
            <span className="brand-name">Chemora</span>
          </div>
          <div className="nav-auth-buttons">
            <button onClick={() => onNavigate('login')} className="nav-login-btn">Login</button>
            <button onClick={() => onNavigate('signup')} className="nav-signup-btn">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                 Intelligent Chemical Data Analytics
              </h1>
              <p className="hero-description">
                Upload CSV files containing chemical equipment parameters such as flowrate, 
                pressure, and temperature, and explore meaningful insights using interactive 
                charts and advanced safety analytics.
              </p>
              <div className="hero-buttons">
                <button onClick={() => onNavigate('dashboard')} className="btn-primary-large">
                  Upload CSV & Analyze
                </button>
                <button onClick={() => onNavigate('demo')} className="btn-secondary-large">
                  View Sample Dashboard
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="modern-chart-scene">
                <div className="chart-window">
                  {/* 3D Bar Chart */}
                  <div className="chart-3d-container">
                    <div className="chart-background-glow"></div>
                    
                    {/* Chart grid and axes */}
                    <div className="chart-grid">
                    </div>
                    
                    {/* Chart title */}
                    <div className="chart-title">
                      <h3>Chemical Equipment Performance</h3>
                      <div className="chart-subtitle">Real-time Analytics Dashboard</div>
                    </div>
                    
                    {/* 3D Bars */}
                    <div className="bars-3d-group">
                      <div className="bar-3d bar-3d-1" style={{height: '75%'}}>
                        <div className="bar-top red"></div>
                        <div className="bar-front red-front"></div>
                        <div className="bar-side red-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-2" style={{height: '60%'}}>
                        <div className="bar-top orange"></div>
                        <div className="bar-front orange-front"></div>
                        <div className="bar-side orange-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-3" style={{height: '85%'}}>
                        <div className="bar-top yellow"></div>
                        <div className="bar-front yellow-front"></div>
                        <div className="bar-side yellow-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-4" style={{height: '45%'}}>
                        <div className="bar-top green"></div>
                        <div className="bar-front green-front"></div>
                        <div className="bar-side green-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-5" style={{height: '70%'}}>
                        <div className="bar-top cyan"></div>
                        <div className="bar-front cyan-front"></div>
                        <div className="bar-side cyan-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-6" style={{height: '55%'}}>
                        <div className="bar-top blue"></div>
                        <div className="bar-front blue-front"></div>
                        <div className="bar-side blue-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-7" style={{height: '90%'}}>
                        <div className="bar-top purple"></div>
                        <div className="bar-front purple-front"></div>
                        <div className="bar-side purple-side"></div>
                      </div>
                      <div className="bar-3d bar-3d-8" style={{height: '40%'}}>
                        <div className="bar-top pink"></div>
                        <div className="bar-front pink-front"></div>
                        <div className="bar-side pink-side"></div>
                      </div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="x-axis-labels">
                      <span className="x-label">Reactor</span>
                      <span className="x-label">Pump</span>
                      <span className="x-label">Heat</span>
                      <span className="x-label">Valve</span>
                      <span className="x-label">Sensor</span>
                      <span className="x-label">Filter</span>
                      <span className="x-label">Tank</span>
                      <span className="x-label">Mixer</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3>Interactive Charts</h3>
              <p>Visualize equipment data with bar charts, line graphs, scatter plots, and pie charts for comprehensive analysis.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10"/>
                  <path d="M18 20V4"/>
                  <path d="M6 20v-4"/>
                </svg>
              </div>
              <h3>Parameter Analysis</h3>
              <p>Analyze flowrate, pressure, temperature relationships across different equipment types with statistical summaries.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h3>CSV Data Import</h3>
              <p>Upload CSV files with equipment parameters and automatically generate structured datasets for analysis.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3>Hybrid Platform</h3>
              <p>Access analytics through both web interface and desktop application with synchronized data and features.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <h3>PDF Reports</h3>
              <p>Generate comprehensive PDF reports with charts, statistics, and equipment data for documentation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.06 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1.06H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.06-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.06 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1.06H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1.06z"/>
                </svg>
              </div>
              <h3>Data History</h3>
              <p>Track and manage multiple datasets with search, filter, and comparison capabilities across uploads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="demo-steps-cards">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload CSV Data</h3>
                <p>Import CSV files containing equipment parameters: Name, Type, Flowrate, Pressure, Temperature</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Automatic Processing</h3>
                <p>Data is validated, processed, and stored with automatic generation of summary statistics</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Interactive Analysis</h3>
                <p>Explore data through multiple chart types, filter by equipment type, and search specific items</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Generate Reports</h3>
                <p>Export comprehensive PDF reports with visualizations and statistical analysis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo"></div>
              <span>Chemora</span>
            </div>
            <div className="footer-text">
              CSV-based chemical equipment data analysis and intelligent visualization<br></br>
              Crafted for Engineers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;