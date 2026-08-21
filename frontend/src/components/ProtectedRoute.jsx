import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, role, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const requiredRole = role || allowedRoles;

  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!rolesArray.includes(user?.role)) {
      // Redirect based on actual user role
      if (user?.role === 'owner') {
        return <Navigate to="/owner-dashboard" replace />;
      } else {
        return <Navigate to="/tenant-dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
