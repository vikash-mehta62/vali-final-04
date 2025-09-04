
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/shared/PageHeader';
import TeamsList from '@/components/crm/team/TeamsList';
import TeamPerformanceMetrics from '@/components/crm/team/TeamPerformanceMetrics';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, BarChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContactsProvider } from '@/contexts/ContactsContext';

const Team = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <PageHeader
              title="Team Management"
              description="Manage your team members, assign tasks and track performance."
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
              <TabsList>
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Team Members</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Performance Dashboard</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="mt-6 animate-fade-in">
                <ContactsProvider>
                  <TeamsList />
                </ContactsProvider>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6 animate-fade-in">
                <TeamPerformanceMetrics />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Team;
