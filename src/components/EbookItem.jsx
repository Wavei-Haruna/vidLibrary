import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AiFillLike, AiOutlineEdit, AiOutlineDelete, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import moment from 'moment';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const PDFDocument = ({ file }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>PDF content is rendered from URL: {file}</Text> {/* Customize as needed */}
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const EbookItem = ({ ebook, onEdit, onDelete, onLike }) => {
  const { currentUser } = useAuth();
  const [editingEbook, setEditingEbook] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(ebook.comments || []);
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [expandedDescription, setExpandedDescription] = useState(false);
  const commentsPerPage = 5;

  useEffect(() => {
    setComments(ebook.comments || []);
  }, [ebook.comments]);

  const handleSaveEdit = async () => {
    const ebookRef = doc(db, 'ebooks', editingEbook.id);
    await updateDoc(ebookRef, {
      title: editingEbook.title,
      description: editingEbook.description,
    });
    onEdit(editingEbook);
    setEditingEbook(null);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'ebooks', ebook.id));
    onDelete(ebook.id);
  };

  const handleDeleteComment = async (commentId) => {
    const ebookRef = doc(db, 'ebooks', ebook.id);
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    await updateDoc(ebookRef, { comments: updatedComments });
    setComments(updatedComments);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

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
      const ebookRef = doc(db, 'ebooks', ebook.id);
      const updatedComments = [...comments, newComment];
      await updateDoc(ebookRef, { comments: updatedComments });
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
      const ebookRef = doc(db, 'ebooks', ebook.id);
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
      await updateDoc(ebookRef, { comments: updatedComments });
      setComments(updatedComments);
      setReplyText((prev) => ({ ...prev, [commentId]: '' }));
    }
  };

  const handleShowMoreComments = () => {
    setShowMoreComments((prev) => !prev);
  };

  const displayedComments = showMoreComments ? comments : comments.slice(0, commentsPerPage);

  return (
    <div key={ebook.id} className="bg-white w-full p-4 shadow-md overflow-x-hidden rounded-lg relative font-body">
      {editingEbook && editingEbook.id === ebook.id ? (
        <div className="absolute top-0 right-0 p-4 bg-white shadow-md rounded-lg z-10 w-80">
          <textarea
            value={editingEbook.title}
            onChange={(e) => setEditingEbook((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full mb-2 border border-gray-300 p-2 rounded"
            placeholder="Edit title"
          />
          <textarea
            value={editingEbook.description}
            onChange={(e) => setEditingEbook((prev) => ({ ...prev, description: e.target.value }))}
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
              onClick={() => setEditingEbook(null)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='flex justify-between'>
            <h2 className="text-xl font-semibold mb-2 text-secondary font-header">{ebook.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{moment(ebook.timestamp?.toDate()).fromNow()}</p>
          </div>
          <hr className="mb-4" />
          <div className="mb-4">
            <p className={`text-gray-700 ${expandedDescription ? '' : 'truncate'}`}>
              {ebook.description?.length > 250 && !expandedDescription
                ? `${ebook.description.slice(0, 250)}...`
                : ebook.description}
            </p>
            {ebook.description?.length > 250 && (
              <button
                onClick={() => setExpandedDescription((prev) => !prev)}
                className="text-primary hover:text-secondary"
              >
                {expandedDescription ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
          <div className="mb-4">
            <PDFDownloadLink document={<PDFDocument file={ebook.url} />} fileName="download.pdf">
              {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
          <div className="flex space-x-4 mt-4 w-full justify-between">
            <button onClick={() => onLike(ebook.id)} className="flex items-center text-primary hover:text-secondary">
              <AiFillLike className="mr-1" /> <span className='hidden lg:flex'> Like</span> {ebook.likes || 0}
            </button>
            <button className="flex items-center text-primary hover:text-secondary">
              <AiOutlineComment className="mr-1" /> <span className='hidden lg:flex'>Comment </span> {comments?.length || 0}
            </button>
            <button className="flex items-center text-primary hover:text-secondary">
              <AiOutlineShareAlt className="mr-1" /> <span className='hidden lg:flex'> Share </span>
            </button>
            {currentUser && currentUser.uid === ebook.userId && (
              <>
                <button onClick={() => setEditingEbook(ebook)} className="flex items-center text-primary hover:text-secondary">
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
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-800 transition-all ease-out"
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
                  {comment.replies?.length > 0 && (
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
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-800 transition-all ease-out"
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
                  {currentUser && currentUser.uid === ebook.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 mt-2 hover:text-red-600"
                    >
                      Delete Comment
                    </button>
                  )}
                </div>
              ))}
              {comments?.length > commentsPerPage && (
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

export default EbookItem;
