import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Document, Page } from 'react-pdf';
import { FaDownload } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const AllEbooks = () => {
  const { currentUser } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ebooks'));
        const ebooksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEbooks(ebooksData);
      } catch (error) {
        console.error('Error fetching eBooks: ', error);
      }
    };
    fetchEbooks();
  }, []);

  const handlePreview = (url) => {
    setPdfUrl(url);
    setSelectedPdf(url);
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  return (
    <section className='p-8 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen'>
      <h1 className='text-center text-3xl font-bold text-white mb-8'>eBook Management</h1>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {ebooks.map(ebook => (
          <div key={ebook.id} className='bg-white bg-opacity-10 border border-gray-600 rounded-lg p-6 shadow-md'>
            <img
              src={ebook.imageUrl}
              alt={ebook.title}
              className='object-cover w-full h-48 rounded-lg mb-4'
            />
            <h2 className='text-xl font-semibold text-white mb-2'>{ebook.title}</h2>
            <p className='text-gray-300 mb-4'>{ebook.description}</p>
            <div className='flex justify-between'>
              <button
                onClick={() => handleDownload(ebook.url)}
                className='flex items-center bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition-colors duration-300'>
                Download <FaDownload className='ml-2' />
              </button>
              {/* <button
                onClick={() => handlePreview(ebook.url)}
                className='bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition-colors duration-300'>
                Preview
              </button> */}
            </div>
          </div>
        ))}
      </div>
      {selectedPdf && (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full'>
            <Document
              file={pdfUrl}
              className='mb-4'
            >
              <Page pageNumber={1} />
            </Document>
            <button
              onClick={() => setSelectedPdf(null)}
              className='bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition-colors duration-300'>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllEbooks;
