import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Profile from '../pages/Profile';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  // Hide navbar on landing page when not logged in
  if (!user && location.pathname === '/') return null;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
          <span className="brand-icon">✈</span>
          <span className="brand-name">WanderPlan</span>
        </Link>

        {user ? (
          <>
            <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Trips
              </Link>
              <div className="nav-divider" />
              <button className="nav-user nav-user-btn" onClick={() => setShowProfile(true)}>
                👋 {user.name.split(' ')[0]}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign out
              </button>
            </nav>
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </>
        ) : (
          <nav className="navbar-nav">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
          </nav>
        )}
      </div>
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </header>
  );
};

export default Navbar;
