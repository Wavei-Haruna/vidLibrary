// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserManagement from './pages/admin/UserManagement';
import VideoManagement from './pages/admin/VideoManagement';
import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* Adjust padding to account for the fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Sign Up */}
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/video-management" element={<VideoManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
