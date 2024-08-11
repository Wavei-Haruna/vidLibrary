import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAuth from '../hooks/useAuth';
import EbookItem from './EbookItem';

const EbookList = () => {
  const { currentUser } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const fetchEbooks = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const ebookCollection = collection(db, 'ebooks');
        const q = query(ebookCollection, where('userId', '==', currentUser.uid));
        const ebookSnapshot = await getDocs(q);
        const ebookList = ebookSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEbooks(ebookList);
        console.log(ebookList);
        console.log(currentUser);
      } catch (error) {
        console.error('Error fetching ebooks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, [currentUser]);

  const handleLike = async (id) => {
    const ebookRef = doc(db, 'ebooks', id);
    const ebook = ebooks.find((ebook) => ebook.id === id);
    
    const userHasLiked = ebook.likedBy?.includes(currentUser.uid);
    
    if (!userHasLiked) {
      await updateDoc(ebookRef, {
        likes: (ebook.likes || 0) + 1,
        likedBy: [...(ebook.likedBy || []), currentUser.uid],
      });
      setEbooks((prev) =>
        prev.map((ebook) =>
          ebook.id === id ? { ...ebook, likes: (ebook.likes || 0) + 1, likedBy: [...(ebook.likedBy || []), currentUser.uid] } : ebook
        )
      );
    }
  };

  const handleComment = async (id) => {
    const ebookRef = doc(db, 'ebooks', id);
    await updateDoc(ebookRef, {
      comments: [
        ...(ebooks.find((ebook) => ebook.id === id).comments || []),
        {
          id: Date.now().toString(),
          text: commentText[id],
          username: currentUser?.displayName || 'Anonymous',
          timestamp: new Date().toISOString(),
          replies: [],
        }
      ],
    });
    setEbooks((prev) =>
      prev.map((ebook) =>
        ebook.id === id
          ? { ...ebook, comments: [...(ebook.comments || []), {
              id: Date.now().toString(),
              text: commentText[id],
              username: currentUser?.displayName || 'Anonymous',
              timestamp: new Date().toISOString(),
              replies: [],
            }] }
          : ebook
      )
    );
    setCommentText((prev) => ({ ...prev, [id]: '' }));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'ebooks', id));
    setEbooks((prev) => prev.filter((ebook) => ebook.id !== id));
  };

  const handleEdit = (ebook) => {
    setEbooks((prev) =>
      prev.map((e) => (e.id === ebook.id ? ebook : e))
    );
  };

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (!currentUser) {
    return <h1>You are logged out</h1>;
  }

  if (ebooks.length === 0) {
    return <p>No ebooks found.</p>;
  }

  return (
    <section>
      <h1 className='text-center'>Hello See your Ebooks</h1>
      <div className="gap-10 my-6 grid lg:grid-cols-2">
        {ebooks.map((ebook) => (
          <EbookItem
            key={ebook.id}
            ebook={ebook}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComment={handleComment}
            onLike={handleLike}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        ))}
      </div>
    </section>
  );
};

export default EbookList;
