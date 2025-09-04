
import React, { useState } from 'react';
import NewVendorForm from '@/components/vendors/NewVendorForm';
import Sidebar from '@/components/layout/Sidebar';

const NewVendor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <NewVendorForm />
      </div>
    </div>
  );
};

export default NewVendor;
