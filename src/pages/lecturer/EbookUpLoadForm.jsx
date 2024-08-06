import React, { useState } from 'react';
import { db, storage } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

const EbookUploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ebookFile, setEbookFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => setEbookFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('You must be logged in to upload an eBook.');
      }

      if (!ebookFile) {
        throw new Error('Please upload a PDF file.');
      }

      const fileId = uuidv4();
      const storageRef = ref(storage, `ebooks/${fileId}`);

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, ebookFile);

      // Get the download URL of the uploaded file
      const ebookUrl = await getDownloadURL(storageRef);

      // Store the eBook data in Firestore
      await setDoc(doc(db, 'ebooks', fileId), {
        title,
        description,
        url: ebookUrl,
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
      });

      // Reset form fields
      setTitle('');
      setDescription('');
      setEbookFile(null);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'eBook uploaded successfully!',
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
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload eBook</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter eBook title"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Enter eBook description"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload eBook File (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border rounded focus:ring-2 focus:ring-blue-600 outline-none"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload eBook'}
        </button>
      </form>
    </div>
  );
};

export default EbookUploadForm;
