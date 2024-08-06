// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen container mx-auto p-4 relative top-8">

        
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1">
        <MainPanel>
          <Outlet />
        </MainPanel>
      </div>
    </div>
  );
};

export default AdminDashboard;
