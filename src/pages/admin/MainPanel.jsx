// src/components/MainPanel.jsx
import React from 'react';

const MainPanel = ({ children }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {children}
    </div>
  );
};

export default MainPanel;
