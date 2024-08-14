import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAuth from '../hooks/useAuth';
import VideoItem from './VideoItem';

const VideoList = () => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      if (!currentUser) return <><h1>You are logged out</h1></>;
      try {
        const videoCollection = collection(db, 'videos');
        const q = query(videoCollection, where('userId', '==', currentUser.uid));
        const videoSnapshot = await getDocs(q);
        const videoList = videoSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videoList);
        setFilteredVideos(videoList); // Initialize filteredVideos with all videos
        console.log(videoList);
        console.log(currentUser);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentUser]);

  useEffect(() => {
    const results = videos.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(results);
  }, [searchQuery, videos]);

  const handleLike = async (id) => {
    const videoRef = doc(db, 'videos', id);
    const video = videos.find((video) => video.id === id);
    
    const userHasLiked = video.likedBy?.includes(currentUser.uid);
    
    if (!userHasLiked) {
      await updateDoc(videoRef, {
        likes: (video.likes || 0) + 1,
        likedBy: [...(video.likedBy || []), currentUser.uid],
      });
      setVideos((prev) =>
        prev.map((video) =>
          video.id === id ? { ...video, likes: (video.likes || 0) + 1, likedBy: [...(video.likedBy || []), currentUser.uid] } : video
        )
      );
    }
  };

  const handleComment = async (id) => {
    const videoRef = doc(db, 'videos', id);
    await updateDoc(videoRef, {
      comments: [
        ...(videos.find((video) => video.id === id).comments || []),
        commentText[id]
      ],
    });
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? { ...video, comments: [...(video.comments || []), commentText[id]] }
          : video
      )
    );
    setCommentText((prev) => ({ ...prev, [id]: '' }));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'videos', id));
    setVideos((prev) => prev.filter((video) => video.id !== id));
    setFilteredVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const handleEdit = (video) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? video : v))
    );
    setFilteredVideos((prev) =>
      prev.map((v) => (v.id === video.id ? video : v))
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (filteredVideos.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <div className='container overflow-x-scroll'>
      <div className="mb-4">
      <input
  type="text"
  value={searchQuery}
  onChange={handleSearchChange}
  placeholder="Search videos..."
  className="w-1/2 md:w-full mx-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
/>

      </div>
      <div className="gap-10 my-6 grid lg:grid-cols-2">
        {filteredVideos.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComment={handleComment}
            onLike={handleLike}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
