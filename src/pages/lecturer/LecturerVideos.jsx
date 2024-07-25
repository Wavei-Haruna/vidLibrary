import React from 'react';
import VideoUploadForm from './VideoUploadForm';
// import VideoList from './VideoList';

const LecturerVideos = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Videos</h1>
      <p>Here you can upload, update, and delete lecture videos.</p>
      {/* upload video */}
    {/* <VideoList/> */}
      <VideoUploadForm/>
    </div>
  );
};

export default LecturerVideos;
