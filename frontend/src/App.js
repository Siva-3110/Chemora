import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App_fixed.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const parsed = JSON.parse(auth);
      
      // Check if user exists in local storage or is demo user
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const localUser = users.find(user => user.username === parsed.username);
      
      if (localUser || parsed.username === 'admin') {
        setUser({ username: parsed.username });
        setIsAuthenticated(true);
        // Set Authorization header for all users
        const authHeader = `Basic ${btoa(`${parsed.username}:${parsed.password}`)}`;
        axios.defaults.headers.common['Authorization'] = authHeader;
      }
    }
    setLoading(false);
  };

  const handleLogin = async (credentials) => {
    // Always allow admin/admin for demo purposes
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      localStorage.setItem('auth', JSON.stringify(credentials));
      setUser({ username: credentials.username });
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return { success: true };
    }
    
    try {
      // Try API authentication
      const response = await axios.post(`${API_BASE}/login/`, {
        username: credentials.username,
        password: credentials.password
      });
      
      if (response.data.success) {
        const auth = btoa(`${credentials.username}:${credentials.password}`);
        axios.defaults.headers.common['Authorization'] = `Basic ${auth}`;
        
        localStorage.setItem('auth', JSON.stringify(credentials));
        setUser({ username: credentials.username });
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        return { success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to local users
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const localUser = users.find(user => 
        user.username === credentials.username && user.password === credentials.password
      );
      
      if (localUser) {
        localStorage.setItem('auth', JSON.stringify(credentials));
        setUser({ username: credentials.username });
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        return { success: true };
      }
      
      return { success: false, error: 'Connection failed. Please check if the server is running.' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
    delete axios.defaults.headers.common['Authorization'];
  };

  const handleNavigate = (page) => {
    if (page === 'dashboard' && !isAuthenticated) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (currentPage === 'home') {
    return <HomePage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'login' || (!isAuthenticated && currentPage === 'dashboard')) {
    return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'signup') {
    return <Signup onNavigate={handleNavigate} />;
  }

  if (currentPage === 'dashboard' && isAuthenticated) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        apiBase={API_BASE}
      />
    );
  }

  return <HomePage onNavigate={handleNavigate} />;
}

export default App;