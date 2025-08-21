import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';
import ThemeToggle from './ThemeToggle';
import '../styles/Navigation.css';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const { theme } = useTheme();
  
  return (
    <nav className={`main-navigation ${theme}-theme`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/dashboard" onClick={closeMobileMenu}>
            <span className="logo-text">EduMorph</span>
          </Link>
        </div>
        
        <ThemeToggle />

        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <Link 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            </li>
            
            {user && user.role === 'teacher' && (
              <li>
                <Link 
                  to="/teacher-dashboard" 
                  className={isActive('/teacher-dashboard') ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Teacher Dashboard
                </Link>
              </li>
            )}
            
            <li>
              <Link 
                to="/about" 
                className={isActive('/about') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            
            <li>
              <Link 
                to="/help" 
                className={isActive('/help') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Help
              </Link>
            </li>
            
            <li>
              <Link 
                to="/faq" 
                className={isActive('/faq') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                FAQ
              </Link>
            </li>
            
            <li>
              <Link 
                to="/contact" 
                className={isActive('/contact') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="profile-link"
                  onClick={closeMobileMenu}
                >
                  <div className="profile-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="profile-name">{user?.name || 'User'}</span>
                </Link>
                <button 
                  className="logout-button" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="login-link"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="register-link"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;