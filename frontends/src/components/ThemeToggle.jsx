import React from 'react';
import { useTheme } from '../App';
import '../styles/ThemeToggle.css';

/**
 * ThemeToggle component provides a toggle button to switch between dark and light themes
 * @returns {JSX.Element} A toggle button for theme switching
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-toggle ${theme === 'dark' ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <div className="toggle-track">
          <div className="toggle-indicator">
            <span className="toggle-icon">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;