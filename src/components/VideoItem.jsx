import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AiFillLike, AiOutlineEdit, AiOutlineDelete, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import moment from 'moment';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const VideoItem = ({ video, onEdit, onDelete }) => {
  const { currentUser } = useAuth();
  const [expandedTranscript, setExpandedTranscript] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(video.comments || []);
  const [showMoreComments, setShowMoreComments] = useState(false);
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

  const toggleTranscript = () => {
    setExpandedTranscript((prev) => !prev);
  };

  const toggleDescription = () => {
    setExpandedDescription((prev) => !prev);
  };

  const handleSaveEdit = async () => {
    const videoRef = doc(db, 'videos', editingVideo.id);
    await updateDoc(videoRef, {
      title: editingVideo.title,
      description: editingVideo.description,
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

  const handleCommentChange = (e) => {
    setCommentText(e.target.value); // Update comment text
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(), // Unique ID for the comment
        text: commentText,
        username: currentUser?.displayName || 'Anonymous',
        timestamp: new Date().toISOString(), // Client-side timestamp
        replies: [], // Initialize replies array
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
                id: Date.now().toString(), // Unique ID for the reply
                text: replyText[commentId],
                username: currentUser?.displayName || 'Anonymous',
                timestamp: new Date().toISOString(), // Client-side timestamp
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

  const handleShowMoreComments = () => {
    setShowMoreComments((prev) => !prev);
  };

  // Get paginated comments
  const displayedComments = showMoreComments ? comments : comments.slice(0, commentsPerPage);

  return (
    <div key={video.id} className="bg-white p-4 shadow-md rounded-lg relative font-body">
      {editingVideo && editingVideo.id === video.id ? (
        <div className="absolute top-0 right-0 p-4 bg-white shadow-md rounded-lg z-10 w-80">
          <textarea
            value={editingVideo.title}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full mb-2 border border-gray-300 p-2 rounded"
            placeholder="Edit title"
          />
          <textarea
            value={editingVideo.description}
            onChange={(e) => setEditingVideo((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full mb-2 border border-gray-300 p-2 rounded"
            placeholder="Edit description"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="bg-primary text-white py-1 px-3 rounded hover:bg-secondary"
            >
              Save
            </button>
            <button
              onClick={() => setEditingVideo(null)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='flex justify-between'>
            <h2 className="text-xl font-semibold mb-2 text-secondary font-header">{video.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{moment(video.timestamp?.toDate()).fromNow()}</p>
          </div>
          <hr className="mb-4" />
          <div className="mb-4">
            <p className={`text-gray-700 ${expandedDescription ? '' : 'truncate'}`}>
              {video.description.length > 250 && !expandedDescription
                ? `${video.description.slice(0, 250)}...`
                : video.description}
            </p>
            {video.description.length > 250 && (
              <button
                onClick={toggleDescription}
                className="text-primary hover:text-secondary"
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
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p className="text-red-500">Invalid video URL</p>
          )}
          <div className="mb-4">
            <p className={`text-gray-700 ${expandedTranscript ? '' : 'truncate'}`}>
              {video.transcript.length > 250 && !expandedTranscript
                ? `${video.transcript.slice(0, 250)}...`
                : video.transcript}
            </p>
            {video.transcript.length > 250 && (
              <button
                onClick={toggleTranscript}
                className="text-primary hover:text-secondary"
              >
                {expandedTranscript ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
          <div className="flex space-x-4 mt-4">
            <button onClick={() => onLike(video.id)} className="flex items-center text-primary hover:text-secondary">
              <AiFillLike className="mr-1" /> Like {video.likes || 0}
            </button>
            <button className="flex items-center text-primary hover:text-secondary">
              <AiOutlineComment className="mr-1" /> Comment {comments.length || 0}
            </button>
            <button className="flex items-center text-primary hover:text-secondary">
              <AiOutlineShareAlt className="mr-1" /> Share
            </button>
            {currentUser && currentUser.uid === video.userId && (
              <>
                <button onClick={() => setEditingVideo(video)} className="flex items-center text-primary hover:text-secondary">
                  <AiOutlineEdit className="mr-1" /> 
                </button>
                <button onClick={handleDelete} className="flex items-center text-red-500 hover:text-red-600">
                  <AiOutlineDelete className="mr-1" /> 
                </button>
              </>
            )}
          </div>
          <div className="mt-4">
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-800  transition-all ease-out"
                placeholder="Add a comment..."
                rows="3"
              />
              <button
                type="submit"
                className="bg-primary text-white py-1 px-3 rounded mt-2 hover:bg-secondary"
              >
                comment
              </button>
            </form>
            <div>
              {displayedComments.map((comment) => (
                <div key={comment.id} className="mb-4 p-2 border border-gray-300 rounded">
                  <p className="font-semibold">{comment.username}</p>
                  <p className="text-gray-700 mb-2">{comment.text}</p>
                  {comment.replies.length > 0 && (
                    <div className="pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="mb-2 p-2 border border-gray-200 rounded">
                          <p className="font-semibold">{reply.username}</p>
                          <p className="text-gray-700">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={(e) => handleReplySubmit(comment.id, e)} className="mt-2">
                    <textarea
                      value={replyText[comment.id] || ''}
                      onChange={(e) => handleReplyChange(comment.id, e)}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-800  transition-all ease-out"
                      placeholder="Reply..."
                      rows="2"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white py-1 px-3 rounded mt-2 hover:bg-secondary"
                    >
                      Reply
                    </button>
                  </form>
                  {currentUser && currentUser.uid === video.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 mt-2 hover:text-red-600"
                    >
                      Delete Comment
                    </button>
                  )}
                </div>
              ))}
              {comments.length > commentsPerPage && (
                <button
                  onClick={handleShowMoreComments}
                  className="text-primary hover:text-secondary"
                >
                  {showMoreComments ? 'Show Less Comments' : 'Show More Comments'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoItem;
