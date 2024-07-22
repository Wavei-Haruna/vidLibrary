// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Sign In', path: '/sign-in' },
    { name: 'Register', path: '/register' }
  ];

  return (
    <nav className="bg-gray-700 text-white p-4 fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <FaHome className="mr-2" />
          Video Library
        </Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-md transition-colors duration-300 ${
                location.pathname === item.path ? 'bg-secondary' : 'hover:bg-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button className="md:hidden text-xl z-50" onClick={toggleNavbar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div
        className={`md:hidden fixed inset-0 bg-gray-700 bg-opacity-75 z-40 transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center mt-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={toggleNavbar}
              className={`block px-4 py-2 my-3 font-body font-semibold  text-center text-white text-lg rounded-md transition-colors duration-300 ${
                location.pathname === item.path ? 'bg-secondary' : 'hover:bg-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
