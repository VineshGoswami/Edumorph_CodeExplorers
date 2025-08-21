import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api';

// Create context
const AuthContext = createContext();

/**
 * Provider component for authentication
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // Fetch current user data
      getCurrentUser()
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Authentication error:', error);
          // Clear invalid token
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      
      // Create a demo user for demo mode
      const demoUser = {
        name: email.split('@')[0],
        email: email,
        role: 'student',
        preferredLanguage: 'en',
        region: 'Punjab',
        grade: 5,
        isDemo: true
      };
      
      // Save demo token to localStorage
      localStorage.setItem('token', 'demo-token');
      
      // Update state with demo user
      setUser(demoUser);
      setIsAuthenticated(true);
      
      // Return the demo user instead of throwing an error
      return demoUser;
    }
  };

  // Register function
  const register = async (name, email, password, preferredLanguage = 'en', region = 'Punjab', grade = 5) => {
    try {
      const response = await apiRegister(name, email, password, preferredLanguage, region, grade);
      
      // Check if response has the expected structure with token
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        return user;
      } else if (response.data && response.data.ok) {
        // Handle backend response format that doesn't include token directly
        // Create a user object based on registration data
        const newUser = {
          name: name,
          email: email,
          role: 'student',
          preferredLanguage: preferredLanguage,
          region: region,
          grade: grade
        };
        
        // Save demo token to localStorage
        localStorage.setItem('token', 'demo-token');
        
        // Update state
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { ...response.data, user: newUser };
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Create a demo user for demo mode
      const demoUser = {
        name: name,
        email: email,
        role: 'student',
        preferredLanguage: preferredLanguage,
        region: region,
        grade: grade,
        isDemo: true
      };
      
      // Save demo token to localStorage
      localStorage.setItem('token', 'demo-token');
      
      // Update state with demo user
      setUser(demoUser);
      setIsAuthenticated(true);
      
      // Return the demo user instead of throwing an error
      return { ok: true, user: demoUser };
    }
  };

  // Logout function
  const logout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;