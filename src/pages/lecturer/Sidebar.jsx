// src/components/Sidebar.jsx
import React from 'react';
import { FaChalkboardTeacher, FaVideo, FaBook, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    // For example, sign out from Firebase auth
    // auth.signOut();
    navigate('/login');
  };

  return (
    <div className={`bg-gray-800 text-white p-5 flex flex-col ${isOpen ? 'w-64' : 'w-0'} transition-width duration-300`}>
      <button className="text-white mb-5" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      {isOpen && (
        <>
          <h2 className="text-xl font-bold mb-10">Lecturer Dashboard</h2>
          <nav className="flex-1">
            <ul>
              <li className="mb-4">
                <button
                  className="flex items-center space-x-3 font-semibold"
                  onClick={() => navigate('/lecturer-dashboard/overview')}
                >
                  <FaChalkboardTeacher />
                  <span>Overview</span>
                </button>
              </li>
              <li className="mb-4">
                <button
                  className="flex items-center space-x-3 font-semibold"
                  onClick={() => navigate('/lecturer-dashboard/videos')}
                >
                  <FaVideo />
                  <span>Manage Videos</span>
                </button>
              </li>
              <li className="mb-4">
                <button
                  className="flex items-center space-x-3 font-semibold"
                  onClick={() => navigate('/lecturer-dashboard/materials')}
                >
                  <FaBook />
                  <span>Manage Course Materials</span>
                </button>
              </li>
            </ul>
          </nav>
          <button
            className="flex items-center space-x-3 font-semibold mt-10"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
