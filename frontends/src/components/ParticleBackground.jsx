import React, { useEffect, useRef } from 'react';
import '../styles/ParticleBackground.css';

/**
 * ParticleBackground component creates an animated particle effect in the background
 * @returns {JSX.Element} A canvas element with particle animations
 */
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize canvas size
    setCanvasDimensions();
    
    // Handle window resize
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(230, 230, 250, ${Math.random() * 0.5})`; // Lavender with random opacity
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particle array
    const particles = [];
    // Reduce particle count to improve performance
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines if they are close enough
    const connectParticles = () => {
      // Reduce max distance to reduce number of connections
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        // Limit the number of connections per particle to improve performance
        let connections = 0;
        const maxConnections = 3;
        
        for (let j = i; j < particles.length; j++) {
          if (connections >= maxConnections) break;
          
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            connections++;
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(230, 230, 250, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop with throttling for better performance
    let lastTime = 0;
    const fpsLimit = 30; // Limit frames per second
    
    const animate = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime > 1000 / fpsLimit) {
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        connectParticles();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="particle-background"
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;