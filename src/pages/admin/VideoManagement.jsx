import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FaTrash, FaPlayCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import Swal from 'sweetalert2';
import 'react-loading-skeleton/dist/skeleton.css';

const VideoManagement = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); // State to track the active video

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosSnapshot = await getDocs(collection(db, 'videos'));
        setVideos(videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const deleteVideo = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'videos', id));
        setVideos(videos.filter(video => video.id !== id));
        Swal.fire('Deleted!', 'The video has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting video:', error);
        Swal.fire('Error!', 'There was an issue deleting the video.', 'error');
      }
    }
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getYouTubeVideoId = (url) => {
    if (typeof url !== 'string') {
      return null;
    }
  
    const regex = /^.*(youtu.be\/|v\/|u\/w\/|embed\/|watch\?v=|watch\?.+&v=|\/videos\/|\/video\/|\/shorts\/|\/videos\/|\/playlist\/|\/playlist\?list=)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[2] : null;
  };

  const closeIframe = () => {
    setActiveVideo(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Video Management</h1>
      {loading ? (
        <Skeleton count={5} height="200px" />
      ) : (
        <>
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded shadow-lg w-full max-w-3xl">
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(activeVideo.url)}`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button
                  onClick={closeIframe}
                  className="absolute top-0 right-0 m-2 text-gray-700 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map(video => (
              <div
                key={video.id}
                className="bg-white p-6 rounded-lg shadow-lg relative hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                style={{ height: '300px' }} // Ensure all cards are the same height
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-700">{video.title}</h2>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-300"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mt-2 flex-grow">
                  {truncateText(video.description, 100)}
                </p>
                {video.description?.length > 100 && (
                  <button
                    onClick={() => Swal.fire(video.title, video.description, 'info')}
                    className="text-primary hover:text-primary-dark mt-2"
                  >
                    Read More
                  </button>
                )}
                <div className="mt-4">
                  <FaPlayCircle
                    size={48}
                    className="text-primary mx-auto cursor-pointer hover:text-primary-dark transition-colors duration-300"
                    onClick={() => setActiveVideo(video)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoManagement;
