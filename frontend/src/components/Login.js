import React, { useState } from 'react';

function Login({ onLogin, onNavigate }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await onLogin(credentials);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="chemora-auth">
      {/* Left Section - Branding */}
      <div className="auth-brand-section">
        <div className="brand-background">
          <div className="molecular-shape shape-1"></div>
          <div className="molecular-shape shape-2"></div>
          <div className="molecular-shape shape-3"></div>
          <div className="glow-effect glow-1"></div>
          <div className="glow-effect glow-2"></div>
        </div>
        
        <div className="brand-content">
          <div className="brand-logo">
            <div className="logo-container-large">
              <img src="/chemora image.jpg" alt="Chemora Logo" className="logo-icon" width="60" height="60" />
            </div>
            <h1 className="brand-name">Chemora</h1>
            <p className="brand-tagline">Intelligent chemical data analytics and visualization</p>
          </div>
          
          <div className="feature-badges">
            <div className="feature-badge">
              Quick Setup
            </div>
            <div className="feature-badge">
              Enterprise Security
            </div>
            <div className="feature-badge">
              Advanced Insights
            </div>
          </div>
        </div>
        
        <button onClick={() => onNavigate && onNavigate('home')} className="home-link">
          ← Back
        </button>
      </div>

      {/* Right Section - Authentication */}
      <div className="auth-form-section">
        <div className="form-container">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your analytics dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Username</label>
              <div className="input-field">
                <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-field">
                <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-alert">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <div className="demo-header">
              <strong>Demo Access</strong>
            </div>
            <p>Username: <code>admin</code> | Password: <code>admin</code></p>
          </div>

          <div className="form-footer">
            <p>Don't have an account? 
              <button 
                type="button" 
                className="text-link"
                onClick={() => onNavigate && onNavigate('signup')}
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;