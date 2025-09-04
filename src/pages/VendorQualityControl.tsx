
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QualityControlForm from '@/components/vendors/QualityControlForm';
import Sidebar from '@/components/layout/Sidebar';

const VendorQualityControl = () => {
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  if (!id) {
    return <div>Missing purchase ID</div>;
  }
  

 
  return (
    <div className="flex h-screen overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <QualityControlForm purchaseId={id} />
      </div>
    </div>
  );
};

export default VendorQualityControl;
