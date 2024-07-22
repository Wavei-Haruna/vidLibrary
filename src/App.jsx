// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserManagement from './pages/admin/UserManagement';
import VideoManagement from './pages/admin/VideoManagement';
import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* Adjust padding to account for the fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Siing Up */}
          <Route path="/register" element={<SignUp />} />

          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/video-management" element={<VideoManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
