import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import ManageUsers from './pages/admin/ManageUsers';
import EbookManagement from './pages/admin/EbookManagement';
import AllVideos from './components/AllVideos';
import AllEbooks from './components/AllEbooks';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="pt-16  overflow-x-hidden mx-auto from-gray-800 to-gray-900"> {/* Adjust padding to account for the fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/videos" element={<AllVideos/>} />
            <Route path="/ebooks" element={<AllEbooks/>} />
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
                <Route path="user-management" element={<ManageUsers />} />
                <Route path="video-management" element={<VideoManagement />} />
                <Route path="ebook-management" element={<EbookManagement />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
