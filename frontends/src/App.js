import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LessonPage from './components/LessonPage';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineIndicator from './components/OfflineIndicator';
import AccessibilitySettings from './components/AccessibilitySettings';
import CulturalAdaptationSettings from './components/CulturalAdaptationSettings';
import TranslationSettings from './components/TranslationSettings';
import UserProfile from './components/UserProfile';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import About from './components/About';
import Help from './components/Help';
import Navigation from './components/Navigation';
import FloatingBackground from './components/FloatingBackground';
import ParticleBackground from './components/ParticleBackground';

// Contexts
import { OfflineProvider } from './contexts/OfflineContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Theme context
const ThemeContext = React.createContext();

export const useTheme = () => React.useContext(ThemeContext);

function App() {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });
  
  // Apply theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    login(userData.email, userData.password);
  };

  const handleLogout = () => {
    logout();
  };

  // State to track if browser is having performance issues
  const [hasPerformanceIssues, setHasPerformanceIssues] = useState(false);
  
  useEffect(() => {
    // Don't run performance monitoring during loading
    if (isLoading) return;
    
    // Check if browser is Chrome and might have performance issues
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    
    // Simple FPS counter to detect performance issues
    let lastTime = performance.now();
    let frames = 0;
    let belowThresholdCount = 0;
    
    const checkPerformance = () => {
      const now = performance.now();
      frames++;
      
      if (now > lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        lastTime = now;
        frames = 0;
        
        // If FPS is consistently below 30, consider it a performance issue
        if (fps < 30) {
          belowThresholdCount++;
          if (belowThresholdCount >= 3) {
            setHasPerformanceIssues(true);
          }
        } else {
          belowThresholdCount = Math.max(0, belowThresholdCount - 1);
        }
      }
      
      if (!hasPerformanceIssues) {
        requestAnimationFrame(checkPerformance);
      }
    };
    
    // Only run performance check in Chrome
    if (isChrome) {
      requestAnimationFrame(checkPerformance);
    }
    
    return () => {
      // Cleanup
      belowThresholdCount = 0;
    };
  }, [isLoading, hasPerformanceIssues]);
  
  // Show loading indicator while authentication state is being determined
  if (isLoading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  return (
    <OfflineProvider>
      <div className={`App ${theme}-theme`}>
        {!hasPerformanceIssues && <ParticleBackground />}
        {!hasPerformanceIssues && <FloatingBackground />}
        <OfflineIndicator />
        <Navigation />
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Register onLogin={handleLogin} />
              } 
            />
            
            {/* Routes accessible without login */}
            <Route 
              path="/dashboard" 
              element={<Dashboard user={user} />} 
            />
            <Route 
              path="/lessons/:id" 
              element={<LessonPage />} 
            />
            <Route 
              path="/teacher-dashboard" 
              element={<TeacherDashboard user={user} />} 
            />
            
            {/* User Profile */}
            <Route 
              path="/profile" 
              element={<UserProfile />} 
            />
            
            {/* Settings Routes */}
            <Route 
              path="/settings/accessibility" 
              element={<AccessibilitySettings onClose={() => window.history.back()} />} 
            />
            <Route 
              path="/settings/cultural" 
              element={<CulturalAdaptationSettings userPreferences={user?.preferences} onPreferencesUpdated={() => {}} />} 
            />
            <Route 
              path="/settings/translation" 
              element={<TranslationSettings onClose={() => window.history.back()} />} 
            />
            
            {/* Information Pages */}
            <Route 
              path="/faq" 
              element={<FAQ />} 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="/help" 
              element={<Help />} 
            />
            
            {/* Redirect root to dashboard */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Routes>
        </div>
    </OfflineProvider>
  );
}

export default App;
