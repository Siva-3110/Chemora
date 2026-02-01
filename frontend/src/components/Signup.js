import React, { useState } from 'react';

function Signup({ onNavigate }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onNavigate && onNavigate('login');
      }, 2000);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  if (success) {
    return (
      <div className="chemora-auth">
        <div className="auth-brand-section">
          <div className="brand-background">
            <div className="molecular-shape shape-1"></div>
            <div className="molecular-shape shape-2"></div>
            <div className="molecular-shape shape-3"></div>
            <div className="glow-effect glow-1"></div>
            <div className="glow-effect glow-2"></div>
          </div>
          
          <div className="brand-content">
            <div className="success-animation">
              <div className="success-checkmark">✓</div>
              <h2>Welcome to Chemora!</h2>
              <p>Your account has been created successfully. Redirecting to login...</p>
            </div>
          </div>
        </div>
        
        <div className="auth-form-section">
          <div className="form-container">
            <div className="success-message">
              <h3>Account Created!</h3>
              <p>You can now sign in with your credentials.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chemora-auth signup-variant">
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
            <p className="brand-tagline">Join thousands of professionals using intelligent chemical analytics</p>
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
            <h2>Create Account</h2>
            <p>Start your journey with intelligent chemical analytics</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="input-group">
                <label>First Name</label>
                <div className="input-field">
                  <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <div className="input-field">
                  <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Username</label>
              <div className="input-field">
                <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M20 8v6M23 11h-6"/>
                </svg>
                <input
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-field">
                <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-field">
                <svg className="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showConfirmPassword ? (
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

            <div className="terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>Already have an account? 
              <button 
                type="button" 
                className="text-link"
                onClick={() => onNavigate && onNavigate('login')}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;