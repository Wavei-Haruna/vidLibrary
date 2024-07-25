import React, { useState } from 'react';
import { db, storage } from '../../firebase'; // Ensure these imports are correct
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

const VideoUploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState('');
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
        timestamp: serverTimestamp(),
      });

      setTitle('');
      setDescription('');
      setVideoLink('');
      setVideoFile(null);
      setTranscript('');
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
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video title"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video description"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Video Link (YouTube)</label>
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video link"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Or Upload Video File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Video Transcript</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter video transcript"
            rows="6"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading && 'opacity-50 cursor-not-allowed'}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadForm;
