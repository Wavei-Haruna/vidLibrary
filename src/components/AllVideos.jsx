import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import VideoItem from './VideoItem';

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = collection(db, 'videos');
        const videoSnapshot = await getDocs(videoCollection);
        const videoList = videoSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videoList);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (!videos || videos.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <div className="gap-10 my-6 grid lg:grid-cols-2">
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          video={video}
          // Add other necessary props here
        />
      ))}
    </div>
  );
};

export default AllVideos;
