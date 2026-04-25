import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRole: 'farmer' | 'buyer';
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('af_token');
  const userStr = localStorage.getItem('af_user');

  // 1. If not logged in at all, kick to Login page
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // 2. If logged in but wrong role, kick to their CORRECT dashboard
    if (user.role !== allowedRole) {
      return <Navigate to={user.role === 'farmer' ? '/dashboard' : '/business'} replace />;
    }
  } catch (error) {
    // Failsafe: if data is corrupted, clear it and kick to login
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
    return <Navigate to="/login" replace />;
  }

  // 3. If everything matches, render the requested route!
  return <Outlet />;
}