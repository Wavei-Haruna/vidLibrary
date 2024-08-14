import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Document, Page } from 'react-pdf';
import { FaDownload, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const EbookManagement = () => {
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'ebooks', id));
      setEbooks(ebooks.filter(ebook => ebook.id !== id));
      Swal.fire({
        title: 'Deleted!',
        text: 'eBook has been deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePreview = (url) => {
    setPdfUrl(url);
    setSelectedPdf(url);
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  return (
    <section className='p-6'>
      <h1 className='text-center text-2xl font-header font-bold text-accent mb-6'>eBook Management</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {ebooks.map(ebook => (
          <div key={ebook.id} className='bg-black bg-opacity-30 border border-accent rounded-xl p-4'>
            <h2 className='text-xl font-bold text-white mb-2'>{ebook.title}</h2>
            <p className='text-white mb-2'>{ebook.description}</p>
            <p className='text-white mb-2'><strong>Lecturer:</strong> {ebook.displayName || 'Anonymous'}</p>
            <div className='mb-4'>
              <button
                onClick={() => handleDownload(ebook.url)}
                className='bg-green-500 text-white py-2 px-4 rounded mr-2'>
                Download <FaDownload />
              </button>
              <button
                onClick={() => handleDelete(ebook.id)}
                className='bg-red-500 text-white py-2 px-4 rounded'>
                Delete <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedPdf && (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center'>
          <div className='bg-white p-4 rounded-lg'>
            <Document
              file={pdfUrl}
              className='mb-4'
            >
              <Page pageNumber={1} />
            </Document>
            <button
              onClick={() => setSelectedPdf(null)}
              className='bg-red-500 text-white py-2 px-4 rounded'>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EbookManagement;
