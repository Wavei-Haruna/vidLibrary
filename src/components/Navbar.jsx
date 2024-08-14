import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import if needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
            // Redirect based on role if not already on the correct dashboard
            if (location.pathname === '/login') {
              if (userDoc.data().role === 'student') {
                navigate('/student-dashboard');
              } else if (userDoc.data().role === 'lecturer') {
                navigate('/lecturer-dashboard');
              } else if (userDoc.data().role === 'admin') {
                navigate('/admin');
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error.message);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate, location.pathname]);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const navItems = isAuthenticated
    ? [
        { name: 'Home', path: '/' },
        { name: 'Videos', path: '/videos' },
        { name: 'Ebooks', path: '/ebooks' },
        { name: 'Dashboard', path: userRole === 'student' ? '/student-dashboard' : userRole === 'lecturer' ? '/lecturer-dashboard' : '/admin' },
        { name: 'Log Out', path: '#', onClick: handleLogout }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Sign In', path: '/login' },
        { name: 'Register', path: '/register' }
      ];

  return (
    <nav className="bg-gray-700 text-white p-4 fixed w-screen px-8 overflow-hidden top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <FaHome className="mr-2" />
         AAMUSTED VIDEOLIB
        </Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={item.onClick}
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
              onClick={item.onClick || toggleNavbar}
              className={`block px-4 py-2 my-3 font-body font-semibold text-center text-white text-lg rounded-md transition-colors duration-300 ${
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
