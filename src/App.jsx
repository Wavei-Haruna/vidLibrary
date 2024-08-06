import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserManagement from './pages/admin/UserManagement';
import VideoManagement from './pages/admin/VideoManagement';
import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerVideos from './pages/lecturer/LecturerVideos';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContextProvider';
import LecturerOverview from './pages/lecturer/LecturerOverview';
import AdminDashboard from './pages/admin/AdminDashboard';
import Overview from './pages/admin/Overview';
import Profile from './pages/admin/Profile';
import Logout from './pages/admin/Logout';
import EbookUploadForm from './pages/lecturer/EbookUpLoadForm';

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
            <Route path="/lecturer-dashboard/*" element={<PrivateRoute allowedRoles={['lecturer']} />}>
              <Route path="" element={<LecturerDashboard />}>
                <Route path="overview" element={<LecturerOverview />} />
                <Route path="videos" element={<LecturerVideos />} />
                <Route path="ebooks" element={<EbookUploadForm />} />
              </Route>
            </Route>
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
