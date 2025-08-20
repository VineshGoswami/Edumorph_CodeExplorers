import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated
 * @param {string} props.redirectPath - Path to redirect to if not authenticated
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ 
  isAuthenticated, 
  redirectPath = '/login',
  children 
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;