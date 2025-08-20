import React, { useEffect } from 'react';
import '../styles/FloatingBackground.css';

/**
 * FloatingBackground component that adds animated floating bubbles
 * and applies a black and sea green theme to the application
 */
const FloatingBackground = () => {
  useEffect(() => {
    // Apply the theme class to the body
    document.body.classList.add('theme-dark-sea');
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('theme-dark-sea');
    };
  }, []);

  return (
    <div className="floating-background">
      <div className="floating-bubble"></div>
      <div className="floating-bubble"></div>
      <div className="floating-bubble"></div>
      <div className="floating-bubble"></div>
      <div className="floating-bubble"></div>
    </div>
  );
};

export default FloatingBackground;