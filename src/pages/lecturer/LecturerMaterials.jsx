import React, { useState } from 'react';
import { db, storage } from '../../firebase'; // Ensure these imports are correct
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

const LecturerMaterials = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type and size
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setMaterialFile(null);
      } else if (file.size > 7 * 1024 * 1024) { // 7MB in bytes
        setError('File size should not exceed 7MB.');
        setMaterialFile(null);
      } else {
        setError('');
        setMaterialFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!materialFile) {
      setError('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    try {
      const storageRef = ref(storage, `course_materials/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(storageRef, materialFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prog);
        },
        (error) => {
          throw new Error(error.message);
        },
        async () => {
          // Handle successful upload
          const materialUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await setDoc(doc(db, 'course_materials', uuidv4()), {
            title,
            description,
            url: materialUrl,
            timestamp: serverTimestamp(),
          });

          setTitle('');
          setDescription('');
          setMaterialFile(null);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Course material uploaded successfully!',
          });
        }
      );
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
      <h2 className="text-2xl font-header mb-4 text-center text-primary">Upload Course Material</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none"
            placeholder="Enter material title"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none"
            placeholder="Enter material description"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload PDF File (Max 7MB)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded focus:ring-2 focus:ring-primary outline-none"
            required
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        {progress > 0 && progress < 100 && (
          <div className="mt-2">
            <p className="text-primary">Uploading: {progress}%</p>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-primary bg-primary-light">
                  {progress}%
                </div>
              </div>
              <div className="flex">
                <div
                  className="w-full bg-primary-light rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  <div
                    className="text-xs font-semibold text-white text-center p-1 leading-none rounded-full bg-primary"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          className={`w-full py-2 bg-btn text-white rounded hover:bg-primary-dark ${loading && 'opacity-50 cursor-not-allowed'}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

export default LecturerMaterials;
