import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      <Navbar onMenuToggle={handleMenuToggle} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <main className="dashboard-content">
        <div className="dashboard-page">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
