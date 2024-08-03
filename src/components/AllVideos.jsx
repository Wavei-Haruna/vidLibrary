import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs,  updateDoc, doc,  } from 'firebase/firestore';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAuth from '../hooks/useAuth';
import VideoItem from './VideoItem';

const AllVideos = () => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  let VideoItems;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = collection(db, 'videos');
        const videoSnapshot = await getDocs(videoCollection);
        const videoList = videoSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videoList);

        console.log(videoList)
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
          video.id === id ? { ...video, likes: (video.likes || 0) + 1 } : video
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

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (videos?.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <div className="gap-10 my-6 grid lg:grid-cols-2">
      {videos.map((video) => (
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
  );
};

export default AllVideos;