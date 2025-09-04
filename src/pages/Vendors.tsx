
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import VendorsList from '@/components/vendors/VendorsList';
import PurchasesList from '@/components/vendors/PurchasesList';
import Sidebar from '@/components/layout/Sidebar';

const Vendors = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vendors');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const headerActions = (
    <div className="flex space-x-2">
      <Button onClick={() => navigate('/vendors/new-vendor')} size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Add Vendor
      </Button>
      <Button onClick={() => navigate('/vendors/new-purchase')} size="sm">
        <FileText className="mr-2 h-4 w-4" />
        New Purchase
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 space-y-6">
          <PageHeader
            title="Vendor Management"
            description="Manage vendors and track purchases from farmers and suppliers"
            actions={headerActions}
          />

          <Tabs defaultValue="vendors" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="vendors">
                <Users className="mr-2 h-4 w-4" />
                Vendors
              </TabsTrigger>
              <TabsTrigger value="purchases">
                <FileText className="mr-2 h-4 w-4" />
                Purchases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendors" className="mt-6">
              <VendorsList />
            </TabsContent>

            <TabsContent value="purchases" className="mt-6">
              <PurchasesList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Vendors;