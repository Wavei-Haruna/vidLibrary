import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserManagement from './pages/admin/UserManagement';
import VideoManagement from './pages/admin/VideoManagement';
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/video-management" element={<VideoManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
