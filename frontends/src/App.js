import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// Contexts
import { OfflineProvider } from './contexts/OfflineContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    login(userData.email, userData.password);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <div className="loading-app">Loading...</div>;
  }

  return (
    <OfflineProvider>
      <div className="App">
        <FloatingBackground />
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
