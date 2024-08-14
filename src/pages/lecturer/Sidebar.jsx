// src/components/Sidebar.jsx
import React from 'react';
import { FaChalkboardTeacher, FaVideo, FaBook, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import Swal from 'sweetalert2';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
   
    auth.signOut();
    Swal.fire({ title: 'Success!',
      text: 'Password reset email sent.',
      icon: 'success',
      confirmButtonText: 'OK'})
    navigate('/login');
  };

  return (
    <div className={`bg-gray-800 text-white fixed h-screen z-50 p-5 flex flex-col ${isOpen ? 'w-64' : 'w-0 -ml-20'} transition-width duration-300`}>
      <button className="text-white mb-5 fixed left-6 bg-primary p-3 rounded-full " onClick={toggleSidebar}>
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
                  <span>Upload Video</span>
                </button>
              </li>
              <li className="mb-4">
                <button
                  className="flex items-center space-x-3 font-semibold"
                  onClick={() => navigate('/lecturer-dashboard/ebooks')}
                >
                  <FaBook />
                  <span>Upload Ebook</span>
                </button>
              </li>
              {/* <li className="mb-4 mt-16">
                <button
                  className="flex items-center space-x-3 font-semibold"
                  onClick={() => navigate('/lecturer-dashboard/materials')}
                >
                  <FaGear />
                  <span>Settings</span>
                </button>
              </li> */}
              <li className="mb-4">

              <button
                  className="flex items-center space-x-3 font-semibold my-16 text-orange-600"
                  onClick={handleLogout}
                >
                <FaSignOutAlt />
              <span className='text-orange-600'>Logout</span>
            </button>
              </li>
            </ul>
          </nav>
         
        </>
      )}
    </div>
  );
};

export default Sidebar;
