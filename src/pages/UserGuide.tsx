
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import UserGuideContent from '@/components/documentation/UserGuideContent';
import { Book } from 'lucide-react';

const UserGuide = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader 
              title="User Guide" 
              description="Comprehensive documentation for all application features"
              icon={<Book className="h-6 w-6 text-primary" />}
            />
            
            <UserGuideContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserGuide;
