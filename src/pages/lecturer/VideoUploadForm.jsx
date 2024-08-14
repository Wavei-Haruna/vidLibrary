import React, { useState } from 'react';
import { db, storage } from '../../firebase'; // Ensure these imports are correct
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

const VideoUploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [courseId, setCourseId] = useState('');
  const [lectureName, setLectureName] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setError('You must be logged in to upload a video.');
        setLoading(false);
        return;
      }

      let videoUrl = '';

      if (videoFile) {
        const storageRef = ref(storage, `videos/${uuidv4()}`);
        await uploadBytes(storageRef, videoFile);
        videoUrl = await getDownloadURL(storageRef);
      } else if (videoLink) {
        videoUrl = videoLink;
      } else {
        throw new Error('Please provide a video link or upload a file.');
      }

      await setDoc(doc(db, 'videos', uuidv4()), {
        title,
        description,
        url: videoUrl,
        transcript,
        courseId,
        lectureName,
        semester,
        timestamp: serverTimestamp(),
        userId: user.uid, // Include user ID
        userEmail: user.email, // Optionally include user email
      });

      setTitle('');
      setDescription('');
      setVideoLink('');
      setVideoFile(null);
      setTranscript('');
      setCourseId('');
      setLectureName('');
      setSemester('');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Video uploaded successfully!',
      });
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center  font-header text-orange-500">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video title"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video description"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Video Link (YouTube)</label>
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video link"
          />
        </div>
        <div className='hidden'>
          <label className=" mb-2 text-sm font-medium text-gray-700 ">Or Upload Video File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Video Transcript</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video transcript"
            rows="6"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter course ID"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Lecture Name</label>
          <input
            type="text"
            value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter lecture name"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Semester</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter semester"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className={`w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${loading && 'opacity-50 cursor-not-allowed'}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadForm;
