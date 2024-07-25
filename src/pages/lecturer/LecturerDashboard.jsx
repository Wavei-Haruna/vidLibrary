import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const LecturerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-10 bg-gray-100 overflow-auto">
        <button className="text-gray-800 mb-5" onClick={toggleSidebar}>
          {/* {isSidebarOpen ? <FaTimes /> : <FaBars />} */}
        </button>
        <Outlet />
      </div>
    </div>
  );
};

export default LecturerDashboard;
