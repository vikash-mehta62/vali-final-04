
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  Users, 
  AlertCircle, 
  Phone,
  Briefcase
} from 'lucide-react';
import AdminDashboardPanel from './AdminDashboardPanel';
import LeadAssignmentPanel from './LeadAssignmentPanel';
import StaffActivityMonitor from './StaffActivityMonitor';
import CallAnalyticsPanel from './CallAnalyticsPanel';

const AdminTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Activity
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Lead Assignment
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Call Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboardPanel />
        </TabsContent>
        
        <TabsContent value="staff">
          <StaffActivityMonitor />
        </TabsContent>
        
        <TabsContent value="leads">
          <LeadAssignmentPanel />
        </TabsContent>
        
        <TabsContent value="calls">
          <CallAnalyticsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTab;
