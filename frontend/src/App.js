import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App_fixed.css';

const API_BASE = 'http://localhost:8000/api';

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
      setUser({ username: parsed.username });
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`${parsed.username}:${parsed.password}`)}`;
    }
    setLoading(false);
  };

  const handleLogin = async (credentials) => {
    try {
      const auth = btoa(`${credentials.username}:${credentials.password}`);
      axios.defaults.headers.common['Authorization'] = `Basic ${auth}`;
      
      await axios.get(`${API_BASE}/datasets/`);
      
      localStorage.setItem('auth', JSON.stringify(credentials));
      setUser({ username: credentials.username });
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
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