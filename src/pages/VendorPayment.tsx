
import React, { useState } from 'react';
import VendorPaymentForm from '@/components/vendors/VendorPaymentForm';
import Sidebar from '@/components/layout/Sidebar';

const VendorPayment = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <VendorPaymentForm />
      </div>
    </div>
  );
};

export default VendorPayment;
