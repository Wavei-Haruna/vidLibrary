import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Import the custom useAuth hook

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth(); // Use the custom hook to access the current user

  // Check if the current user is authenticated and has an allowed role
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />; // Redirect to the login page if not authenticated or not allowed
  }

  return <Outlet />; // Render the child routes if authenticated and allowed
};

export default PrivateRoute;
