import React, { useEffect, useRef } from 'react';
import '../styles/ProgressAnimation.css';

const ProgressAnimation = ({ progress, size = 120, strokeWidth = 8, animationDuration = 1.5 }) => {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    if (circleRef.current) {
      // Calculate stroke-dashoffset based on progress
      const offset = circumference - (progress / 100) * circumference;
      
      // Reset the animation
      circleRef.current.style.strokeDashoffset = circumference;
      
      // Force a reflow to ensure the animation restarts
      void circleRef.current.getBoundingClientRect();
      
      // Set the transition and new stroke-dashoffset
      circleRef.current.style.transition = `stroke-dashoffset ${animationDuration}s ease-in-out`;
      circleRef.current.style.strokeDashoffset = offset;
    }
  }, [progress, circumference, animationDuration]);

  return (
    <div className="progress-animation-container">
      <svg
        className="progress-ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="progress-ring-circle-bg"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          className="progress-ring-circle"
          stroke="var(--accent-color)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-text">{progress}%</div>
      
      {/* Particles for celebration when progress is 100% */}
      {progress === 100 && (
        <div className="celebration-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.1}s`,
              '--angle': `${i * 30}deg`
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressAnimation;