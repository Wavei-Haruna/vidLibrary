import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { FaThumbsUp, FaComment, FaShare, FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [expandedTranscripts, setExpandedTranscripts] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [editingVideo, setEditingVideo] = useState(null);

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

  const getYouTubeVideoId = (url) => {
    const regex = /^.*(youtu.be\/|v\/|u\/w\/|embed\/|watch\?v=|watch\?.+&v=|\/videos\/|\/video\/|\/shorts\/|\/videos\/|\/playlist\/|\/playlist\?list=)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[2] : null;
  };

  const toggleTranscript = (id) => {
    setExpandedTranscripts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = async (id) => {
    const videoRef = doc(db, 'videos', id);
    const video = videos.find((video) => video.id === id);
    
    // Check if the user has already liked the video
    const userHasLiked = video.likedBy?.includes('currentUserId'); // Replace 'currentUserId' with actual user ID
    
    if (!userHasLiked) {
      await updateDoc(videoRef, {
        likes: (video.likes || 0) + 1,
        likedBy: [...(video.likedBy || []), 'currentUserId'], // Add the current user ID to the list
      });
      setVideos((prev) =>
        prev.map((video) =>
          video.id === id ? { ...video, likes: (video.likes || 0) + 1, likedBy: [...(video.likedBy || []), 'currentUserId'] } : video
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
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
  };

  const handleSaveEdit = async () => {
    const videoRef = doc(db, 'videos', editingVideo.id);
    await updateDoc(videoRef, {
      title: editingVideo.title,
      description: editingVideo.description,
    });
    setVideos((prev) =>
      prev.map((video) =>
        video.id === editingVideo.id
          ? { ...video, title: editingVideo.title, description: editingVideo.description }
          : video
      )
    );
    setEditingVideo(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 w-full">
        <h1 className="text-3xl font-header mb-8 text-center">Video List</h1>
        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-6 shadow-md rounded-lg">
              <Skeleton height={200} />
              <Skeleton height={24} className="mt-4" />
              <Skeleton count={3} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-header mb-8 text-center">Video List</h1>
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
        {videos.map((video) => {
          const videoId = getYouTubeVideoId(video.url);
          const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

          return (
            <div key={video.id} className="bg-white p-4 shadow-md rounded-lg relative">
              {editingVideo && editingVideo.id === video.id ? (
                <div className="absolute top-0 right-0 p-2 bg-white shadow-md rounded-lg z-10">
                  <textarea
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="w-full mb-2 border border-gray-300 p-2 rounded"
                    placeholder="Edit title"
                  />
                  <textarea
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                    className="w-full mb-2 border border-gray-300 p-2 rounded"
                    placeholder="Edit description"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="bg-primary text-white py-1 px-3 rounded hover:bg-secondary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingVideo(null)}
                    className="bg-red-500 text-white py-1 px-3 rounded ml-2 hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                  <p className="text-gray-700 mb-4">{video.description}</p>
                  {embedUrl ? (
                    <div className="relative mb-4">
                      <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-red-500">Invalid video URL</p>
                  )}
                  <p className="text-gray-500 text-sm mb-4">{moment(video.timestamp?.toDate()).fromNow()}</p>
                  <p className="text-gray-700 mb-4">
                    {(video.transcript || '').length > 200
                      ? `${(video.transcript || '').substring(0, 200)}...`
                      : video.transcript || ''}
                    {video.transcript && video.transcript.length > 200 && (
                      <button
                        onClick={() => toggleTranscript(video.id)}
                        className="text-primary hover:underline ml-2"
                      >
                        {expandedTranscripts[video.id] ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </p>
                  {expandedTranscripts[video.id] && video.transcript.length > 200 && (
                    <p className="text-gray-700 mb-4">{video.transcript}</p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(video.id)}
                      className="flex items-center text-primary hover:text-secondary"
                    >
                      <FaThumbsUp className="mr-1" /> Like {video.likes || 0}
                    </button>
                    <button
                      onClick={() => handleComment(video.id)}
                      className="flex items-center text-primary hover:text-secondary"
                    >
                      <FaComment className="mr-1" /> Comment
                    </button>
                    <button className="flex items-center text-primary hover:text-secondary">
                      <FaShare className="mr-1" /> Share
                    </button>
                    <button
                      onClick={() => handleEdit(video)}
                      className="flex items-center text-green-600 hover:text-green-800"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={commentText[video.id] || ''}
                      onChange={(e) => setCommentText((prev) => ({ ...prev, [video.id]: e.target.value }))}
                      className="border border-gray-300 p-2 rounded w-full"
                      placeholder="Add a comment"
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoList;
