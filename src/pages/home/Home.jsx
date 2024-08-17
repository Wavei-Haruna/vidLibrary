import React from 'react';
import { FaBook, FaChalkboardTeacher, FaUserGraduate, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeroImage from '../../assets/images/hero.jpg';
import AboutUs from '../../assets/images/about.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="font-body">
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col justify-center items-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-header mb-4">Welcome to AAMUSTED VIDEOLIB</h1>
          <p className="text-lg mb-6">
            Explore our extensive collection of eBooks, attend lectures, and connect with fellow students and faculty. Your gateway to knowledge and learning starts here.
          </p>
          <button
            onClick={() => handleNavigate('/ebooks')}
            className="bg-secondary text-white py-3 px-6 rounded-lg shadow-lg hover:bg-secondary-dark transition duration-300"
          >
            Browse Our Collection
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white text-gray-900 ">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-header mb-8 text-center">About Us</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-lg mb-4">
                 AAMUSTED VIDEOLIB aims to provide a comprehensive and accessible learning environment. We offer a vast range of eBooks, lectures, and resources to support students, lecturers, and researchers in their academic journey.
              </p>
              <p className="text-lg">
                Our platform facilitates seamless access to educational materials, encourages collaborative learning, and fosters an inclusive community.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src={AboutUs} alt="About Us" className="w-full h-96 rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-header mb-8 text-center">Contact Us</h2>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-accent text-2xl mr-4" />
                <p className="text-lg">1234 Library Lane, AAMUSTED, Kumasi, Ghana</p>
              </div>
              <div className="flex items-center mb-4">
                <FaPhone className="text-accent text-2xl mr-4" />
                <p className="text-lg">+233 544 6672 70</p>
              </div>
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-accent text-2xl mr-4" />
                <p className="text-lg">contact@aamustedlibrary.com</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">Send Us a Message</h3>
              <form className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" id="name" className="w-full p-2 border rounded-md" placeholder="Your Name" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" id="email" className="w-full p-2 border rounded-md" placeholder="Your Email" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea id="message" className="w-full p-2 border rounded-md" rows="4" placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" className="bg-accent text-white py-2 px-4 rounded-lg shadow-lg hover:bg-accent-dark transition duration-300">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl font-header mb-4"> AAMUSTED VIDEOLIB</h3>
              <p className="text-lg">Empowering Education through Digital Resources</p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 mb-6 md:mb-0">
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              <a href="/terms" className="hover:underline">Terms of Service</a>
              <a href="/faq" className="hover:underline">FAQ</a>
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark">
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm">&copy; {new Date().getFullYear()}  AAMUSTED VIDEOLIB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
