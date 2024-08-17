import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AiFillLike, AiOutlineEdit, AiOutlineDelete, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import moment from 'moment';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const VideoItem = ({ video, onEdit, onDelete, onLike }) => {
  const { currentUser } = useAuth();
  const [expandedTranscript, setExpandedTranscript] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(video.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [replyText, setReplyText] = useState({});
  const commentsPerPage = 5;

  useEffect(() => {
    setComments(video.comments || []);
  }, [video.comments]);

  const getYouTubeVideoId = (url) => {
    const regex = /^.*(youtu.be\/|v\/|u\/w\/|embed\/|watch\?v=|watch\?.+&v=|\/videos\/|\/video\/|\/shorts\/|\/videos\/|\/playlist\/|\/playlist\?list=)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[2] : null;
  };

  const embedUrl = getYouTubeVideoId(video.url) ? `https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}` : '';

  const toggleTranscript = () => setExpandedTranscript(!expandedTranscript);
  const toggleDescription = () => setExpandedDescription(!expandedDescription);
  const toggleComments = () => setShowComments(!showComments);

  const handleSaveEdit = async () => {
    const videoRef = doc(db, 'videos', editingVideo.id);
    await updateDoc(videoRef, {
      title: editingVideo.title,
      description: editingVideo.description,
      transcript: editingVideo.transcript,
      courseId: editingVideo.courseId,
      lectureName: editingVideo.lectureName,
      semester: editingVideo.semester,
    });
    onEdit(editingVideo);
    setEditingVideo(null);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'videos', video.id));
    onDelete(video.id);
  };

  const handleDeleteComment = async (commentId) => {
    const videoRef = doc(db, 'videos', video.id);
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    await updateDoc(videoRef, { comments: updatedComments });
    setComments(updatedComments);
  };

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        username: currentUser?.displayName || 'Anonymous',
        timestamp: new Date().toISOString(),
        replies: [],
      };
      const videoRef = doc(db, 'videos', video.id);
      const updatedComments = [...comments, newComment];
      await updateDoc(videoRef, { comments: updatedComments });
      setComments(updatedComments);
      setCommentText('');
    }
  };

  const handleReplyChange = (commentId, e) => {
    setReplyText((prev) => ({ ...prev, [commentId]: e.target.value }));
  };

  const handleReplySubmit = async (commentId, e) => {
    e.preventDefault();
    if (replyText[commentId]?.trim()) {
      const videoRef = doc(db, 'videos', video.id);
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now().toString(),
                text: replyText[commentId],
                username: currentUser?.displayName || 'Anonymous',
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return comment;
      });
      await updateDoc(videoRef, { comments: updatedComments });
      setComments(updatedComments);
      setReplyText((prev) => ({ ...prev, [commentId]: '' }));
    }
  };

  const displayedComments = comments.slice(0, commentsPerPage);
 
  return (
    <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900  shadow-lg rounded-lg relative font-body w-80 mx-auto lg:w-full border border-gray-200">
      {editingVideo && editingVideo.id === video.id ? (
        <div className="absolute top-0 right-0 p-4 bg-white text-green-600 shadow-md rounded-lg z-10 w-96 border border-gray-200">
          <input
            type="text"
            value={editingVideo.title}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full mb-2 border  p-2 rounded"
            placeholder="Edit title"
          />
          <textarea
            value={editingVideo.description}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full mb-2 border t p-2 rounded"
            placeholder="Edit description"
          />
          <textarea
            value={editingVideo.transcript}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, transcript: e.target.value }))}
            className="w-full mb-2 border t p-2 rounded"
            placeholder="Edit transcript"
          />
          <input
            type="text"
            value={editingVideo.courseId}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, courseId: e.target.value }))}
            className="w-full mb-2 border t p-2 rounded"
            placeholder="Edit Course ID"
          />
          <input
            type="text"
            value={editingVideo.lectureName}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, lectureName: e.target.value }))}
            className="w-full mb-2 border t p-2 rounded"
            placeholder="Edit Lecture Name"
          />
          <input
            type="text"
            value={editingVideo.semester}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, semester: e.target.value }))}
            className="w-full mb-2 border text-orange-600 p-2 rounded"
            placeholder="Edit Semester"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className=" bg-white py-1 px-3 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingVideo(null)}
              className="bg-red-500 text-orange-600 py-1 px-3 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-green-600 ">{video.title}</h2>
            <p className="  text-sm text-white">{moment(video.timestamp?.toDate()).fromNow()}</p>
          </div>
          <hr className="mb-4" />
          <div className="mb-4">
            <p className={` ${expandedDescription ? '' : 'truncate'} text-white`}>
              {video.description?.length > 250 && !expandedDescription
                ? `${video.description.slice(0, 250)}...`
                : video.description}
            </p>
            {video.description?.length > 250 && (
              <button
                onClick={toggleDescription}
                className=" hover:text-orange-600"
              >
                {expandedDescription ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
          {embedUrl ? (
            <div className="relative mb-4">
              <iframe
                width="100%"
                height="315"
                src={embedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p className="text-red-500">Invalid video URL</p>
          )}
          <div className="mb-4">
            <h3 className='font-semibold  text-orange-500'>Transcript</h3>
            <p className={`text-white ${expandedTranscript ? '' : 'truncate'}`}>
              {video.transcript?.length > 250 && !expandedTranscript
                ? `${video.transcript.slice(0, 250)}...`
                : video.transcript}
            </p>
            {video.transcript?.length > 250 && (
              <button
                onClick={toggleTranscript}
                className="text-orange-600 hover:text-orange-600" 
              >
                {expandedTranscript ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3">
          <div className="mb-4">
            <p className="font-semibold text-green-600">Course ID:</p>
            <p className="text-orange-600 ">{video.courseId}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-green-600">Lecture Name:</p>
            <p className="text-orange-600 ">{video.lectureName}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-green-600">Semester:</p>
            <p className="text-orange-600 ">{video.semester}</p>
          </div>

          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLike(video.id)}
                className="text-white hover:text-orange-600"
              >
                <AiFillLike />
              </button>
              <span className='text-white'>{video.likes || 0}</span>
            </div>
            <button
              onClick={toggleComments}
              className="flex items-center space-x-1 text-white hover:text-orange-600"
            >
              <AiOutlineComment />
              <span  >{comments.length}</span>
            </button>
            <button
              onClick={() => navigator.share({ title: video.title, url: video.url })}
              className="text-white hover:text-orange-600"
            >
              <AiOutlineShareAlt />
              <span className="hidden lg:flex">Share</span>
            </button>
            {currentUser && currentUser.uid === video.userId && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingVideo(video)}
                  className="text-white hover:text-orange-600"
                >
                  <AiOutlineEdit />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            )}
          </div>
          {showComments && (
            <div className="mt-4 border-t pt-4">
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  className="w-full border text-orange-600 p-2 rounded"
                />
                <button
                  type="submit"
                  className=" text-orange-600 py-1 px-3 rounded mt-2 hover:bg-green-600"
                >
                  Comment
                </button>
              </form>
              {displayedComments.map((comment) => (
                <div key={comment.id} className="mb-4 border-b pb-2">
                  <p className="font-semibold text-green-600">{comment.username}</p>
                  <p className="text-orange-600 ">{comment.text}</p>
                  <p className="text-orange-600  text-sm">{moment(comment.timestamp).fromNow()}</p>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 mt-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="mb-2 border-b pb-2">
                          <p className="font-semibold text-green-600">{reply.username}</p>
                          <p className="text-orange-600 ">{reply.text}</p>
                          <p className="text-orange-600  text-sm">{moment(reply.timestamp).fromNow()}</p>
                        </div>
                      ))}
                      <form onSubmit={(e) => handleReplySubmit(comment.id, e)}>
                        <textarea
                          value={replyText[comment.id] || ''}
                          onChange={(e) => handleReplyChange(comment.id, e)}
                          placeholder="Reply..."
                          className="w-full border text-orange-600 p-2 rounded"
                        />
                        <button
                          type="submit"
                          className=" text-orange-600 py-1 px-3 rounded mt-2 hover:bg-green-600"
                        >
                          Reply
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
              {comments.length > commentsPerPage && (
                <button
                  onClick={toggleComments}
                  className="text-orange-600 hover:text-orange-600"
                >
                  {showComments ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoItem;
