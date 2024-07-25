import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
