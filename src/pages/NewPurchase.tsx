
import React, { useState } from 'react';
import NewPurchaseForm from '@/components/vendors/NewPurchaseForm';
import Sidebar from '@/components/layout/Sidebar';

const NewPurchase = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex  overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <NewPurchaseForm />
      </div>
    </div>
  );
};

export default NewPurchase;
