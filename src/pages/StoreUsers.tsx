
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ShieldCheck, Store } from 'lucide-react';
import StoreUsersList from '@/components/store/users/StoreUsersList';
import StorePortalSettings from '@/components/store/users/StorePortalSettings';
import AccessPermissionsTab from '@/components/store/users/AccessPermissionsTab';

const StoreUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <PageHeader
              title="Store Users Management"
              description="Create and manage users for store access to the online portal."
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
              <TabsList>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Store Users</span>
                </TabsTrigger>
                <TabsTrigger value="portal" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span>Portal Settings</span>
                </TabsTrigger>
                <TabsTrigger value="permissions" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Access Permissions</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="mt-6">
                <StoreUsersList />
              </TabsContent>
              
              <TabsContent value="portal" className="mt-6">
                <StorePortalSettings />
              </TabsContent>
              
              <TabsContent value="permissions" className="mt-6">
                <AccessPermissionsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StoreUsers;
