// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserManagement from './pages/admin/UserManagement';
import VideoManagement from './pages/admin/VideoManagement';
import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContextProvider';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/admin/Profile';
import Overview from './pages/admin/Overview';
import Logout from './pages/admin/Logout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* Admin */}
            <Route path="/admin/*" element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="" element={<AdminDashboard />}>
                <Route path="overview" element={<Overview />} />
                <Route path="profile" element={<Profile />} />
                <Route path="logout" element={<Logout />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="video-management" element={<VideoManagement />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
