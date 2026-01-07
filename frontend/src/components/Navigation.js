import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { username, logout, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="main-navigation">
      <div className="nav-brand">
        <h1>Grievance Management System</h1>
      </div>
      <nav className="nav-links">
        <button
          onClick={() => navigate('/grievances')}
          className={`nav-button ${isActive('/grievances') ? 'active' : ''}`}
        >
          Grievance Details
        </button>
        {!isGuest && (
          <>
            <button
              onClick={() => navigate('/bookmarks')}
              className={`nav-button ${isActive('/bookmarks') ? 'active' : ''}`}
            >
              Bookmarks
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`nav-button ${isActive('/profile') ? 'active' : ''}`}
            >
              User Profile
            </button>
          </>
        )}
      </nav>
      <div className="nav-user">
        <span className="username">Welcome, {username}</span>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Navigation;

