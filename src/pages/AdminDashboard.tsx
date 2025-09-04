
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import AdminTab from '@/components/crm/admin/AdminTab';
import { useDispatch } from 'react-redux';
import { logout } from '@/services2/operations/auth';
import { Card, CardContent } from '@/components/ui/card';
import DashboardDynamically from '@/components/DashboardDynamically';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        


        <main className="flex-1 overflow-y-auto bg-muted/30">
        <DashboardDynamically />
          <div className="page-container max-w-full px-4 py-4">
            {/* <PageHeader 
              title="Admin Dashboard" 
              description="Manage your admin operations"
              icon={<ShieldAlert className="h-6 w-6 text-primary" />}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            </PageHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <ShieldAlert className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <h3 className="text-2xl font-bold">245</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <ShieldAlert className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                      <h3 className="text-2xl font-bold">32</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <ShieldAlert className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <h3 className="text-2xl font-bold">1,204</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
             */}
            {/* <div className="mt-6">
              <AdminTab />
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
