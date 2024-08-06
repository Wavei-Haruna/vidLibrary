// src/pages/admin/AdminOverview.jsx
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { FaUser, FaVideo, FaBook } from 'react-icons/fa';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const videosSnapshot = await getDocs(collection(db, 'videos'));
        const ebooksSnapshot = await getDocs(collection(db, 'ebooks'));

        setUsers(usersSnapshot.docs.map(doc => doc.data()));
        setVideos(videosSnapshot.docs.map(doc => doc.data()));
        setEbooks(ebooksSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
      {loading ? (
        <Skeleton width="100%" height="150px" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <FaUser className="text-3xl mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <p className="text-xl">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <FaVideo className="text-3xl mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Videos</h2>
            <p className="text-xl">{videos.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <FaBook className="text-3xl mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">E-Books</h2>
            <p className="text-xl">{ebooks.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
