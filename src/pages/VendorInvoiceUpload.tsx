
import React, { useState } from 'react';
import InvoiceUploadForm from '@/components/vendors/InvoiceUploadForm';
import Sidebar from '@/components/layout/Sidebar';

const VendorInvoiceUpload = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <InvoiceUploadForm />
      </div>
    </div>
  );
};

export default VendorInvoiceUpload;
