<<<<<<< HEAD
// src/App.jsx
=======
// src/App.js
>>>>>>> 00ef353f5b91a9189fa8ab4861b668cfffa8d6e3
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserManagement from './pages/admin/UserManagement';
import VideoManagement from './pages/admin/VideoManagement';
import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp';
<<<<<<< HEAD
import Login from './pages/auth/Login';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerVideos from './pages/lecturer/LecturerVideos';
import LecturerMaterials from './pages/lecturer/LecturerMaterials';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/useAuthContext';
import LecturerOverview from './pages/lecturer/LecturerOverview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="pt-16"> {/* Adjust padding to account for the fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* Lecturer */}
            <Route path="/lecturer-dashboard" element={<PrivateRoute allowedRoles={['lecturer']} />}>
              <Route path="" element={<LecturerDashboard />}>
                <Route path="" element={<LecturerOverview/>} />
                <Route path="videos" element={<LecturerVideos />} />
                <Route path="materials" element={<LecturerMaterials />} />
              </Route>
            </Route>
            {/* Admin */}
            <Route path="/admin/user-management" element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route index element={<UserManagement />} />
            </Route>
            <Route path="/admin/video-management" element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route index element={<VideoManagement />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
=======

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
>>>>>>> 00ef353f5b91a9189fa8ab4861b668cfffa8d6e3
  );
}

export default App;
