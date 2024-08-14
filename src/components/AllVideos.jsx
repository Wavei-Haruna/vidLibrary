import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAuth from '../hooks/useAuth';
import VideoItem from './VideoItem';
import Swal from 'sweetalert2';

const AllVideos = () => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleLike = async (id) => {
    if (!currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You must be logged in to like videos.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

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
          video.id === id ? { ...video, likes: (video.likes || 0) + 1 } : video
        )
      );
    }
  };

  const handleComment = async (id) => {
    if (!currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You must be logged in to comment on videos.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(searchQuery) ||
    video.description?.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return <Skeleton count={35} className='flex mr-10' />;
  }

  if (filteredVideos.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <section className=' px-2 mx-auto relative  bg-gradient-to-b w-screen from-gray-800 to-gray-900 overflow-x-hidden '> 
      <div className="mb-2 fixed z-50 top-20 w-72  my-0 shadow-lg mx-auto">

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search videos..."
          className="w-full mx-auto p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-transparent transition duration-300 ease-in-out"
        />
      </div>
      <div className="gap-10 my-6 grid lg:grid-cols-2 mx-auto container relative top-16">
        {filteredVideos.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            onLike={handleLike}
            onComment={handleComment}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        ))}
      </div>
    </section>
  );
};

export default AllVideos;
