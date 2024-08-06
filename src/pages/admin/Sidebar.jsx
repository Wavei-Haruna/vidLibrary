// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaVideo, FaUserCog, FaHome, FaSignOutAlt, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 top-24 transform ${isOpen ? '-translate-x-3' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-primary w-64 rounded-t-xl`}>
      <div className="p-4 flex items-center justify-between">
        <span className="text-white text-2xl font-bold my-6">Admin</span>
        <button
          className={`text-white fixed top-1 p-2 rounded-full bg-gray-500 transform z-50 transition-transform duration-200 ease-in-out ${
            isOpen ? 'left-52' : 'translate-x-64'
          }`}
          onClick={toggleSidebar}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      <nav className="p-4">
        <Link to="/admin/overview" className="block py-2.5 px-4 rounded hover:bg-secondary text-white flex items-center">
          <FaHome className="mr-3" /> Overview
        </Link>
        <Link to="/admin/profile" className="block py-2.5 px-4 rounded hover:bg-secondary text-white flex items-center">
          <FaUser className="mr-3" /> Profile
        </Link>
        <Link to="/admin/user-management" className="block py-2.5 px-4 rounded hover:bg-secondary text-white flex items-center">
          <FaUserCog className="mr-3" /> User Management
        </Link>
        <Link to="/admin/video-management" className="block py-2.5 px-4 rounded hover:bg-secondary text-white flex items-center">
          <FaVideo className="mr-3" /> Video Management
        </Link>
        <Link to="/admin/logout" className="block py-2.5 px-4 rounded hover:bg-secondary text-white flex items-center">
          <FaSignOutAlt className="mr-3" /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
