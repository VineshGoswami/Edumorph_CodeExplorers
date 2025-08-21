import React, { useEffect, useState } from 'react';
import '../styles/FloatingBackground.css';

/**
 * FloatingBackground component that adds animated floating bubbles
 * and applies a black and sea green theme to the application
 * Optimized for performance in Chrome
 */
const FloatingBackground = () => {
  // Check if the user prefers reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Apply the theme class to the body
    document.body.classList.add('theme-dark-sea');
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes in preference
    const handleMediaChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('theme-dark-sea');
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Render fewer bubbles if user prefers reduced motion
  return (
    <div className="floating-background" style={{ transform: 'translateZ(0)' }}>
      {!prefersReducedMotion && (
        <>
          <div className="floating-bubble"></div>
          <div className="floating-bubble"></div>
          <div className="floating-bubble"></div>
        </>
      )}
      {prefersReducedMotion && (
        <div className="floating-bubble" style={{ animation: 'none', opacity: 0.1 }}></div>
      )}
    </div>
  );
};

export default FloatingBackground;