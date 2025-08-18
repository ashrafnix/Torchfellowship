

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Navigate, useLocation } = ReactRouterDOM as any;
import { useAuth } from '../hooks/useAuth';
import Spinner from './ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Spinner /></div>;
  }
  
  const isTryingToAccessAdmin = location.pathname.startsWith('/admin');

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isTryingToAccessAdmin && !isAdmin) {
    // If a non-admin user tries to access an admin route, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;