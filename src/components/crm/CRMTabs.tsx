
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  Megaphone, 
  CalendarCheck, 
  MessageSquare, 
  UserCircle, 
  CheckSquare,
  AlertCircle,
  Calendar,
  Globe
} from 'lucide-react';
import ContactsList from './contacts/ContactsList';
import DealsBoard from './deals/DealsBoard';
import CampaignsList from './campaigns/CampaignsList';
import ActivitiesList from './activities/ActivitiesList';
import MessagingPanel from './messaging/MessagingPanel';
import TeamsList from './team/TeamsList';
import TasksManager from './tasks/TasksManager';
import CalendarView from './calendar/CalendarView';
import WebLeadCapture from './leads/WebLeadCapture';
import ClientCallbacks from './callbacks/ClientCallbacks';
import { useToast } from '@/hooks/use-toast';

const CRMTabs = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [pendingTasks, setPendingTasks] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [pendingCallbacks, setPendingCallbacks] = useState(0);
  const { toast } = useToast();

  // This simulates data that would come from your actual state management
  useEffect(() => {
    // In a real app, this would come from your API or state management
    setPendingTasks(16);
    setUnreadMessages(4);
    setUpcomingEvents(8);
    setPendingCallbacks(5);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Show contextual information based on tab switch
    if (value === 'deals') {
      toast({
        title: "Deal Management",
        description: "You have 3 deals pending approval and 2 ready to close this week.",
      });
    } else if (value === 'calendar') {
      toast({
        title: "Calendar View",
        description: "You have 8 upcoming events scheduled for this week.",
      });
    } else if (value === 'leads') {
      toast({
        title: "Web Lead Capture",
        description: "You have new leads captured from your website forms.",
      });
    } else if (value === 'callbacks') {
      toast({
        title: "Client Callbacks",
        description: "You have 5 pending callbacks scheduled for today.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full sm:w-auto mb-4 flex flex-wrap justify-start gap-1">
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Deals</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-1">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-1">
            <CalendarCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-1 relative">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messaging</span>
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadMessages}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1 relative">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
            {pendingTasks > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
                {pendingTasks}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1 relative">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
            {upcomingEvents > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                {upcomingEvents}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Web Leads</span>
          </TabsTrigger>
          <TabsTrigger value="callbacks" className="flex items-center gap-1 relative">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Callbacks</span>
            {pendingCallbacks > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                {pendingCallbacks}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <ContactsList />
        </TabsContent>
        
        <TabsContent value="deals" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <DealsBoard />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <CampaignsList />
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <ActivitiesList />
        </TabsContent>

        <TabsContent value="messaging" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <MessagingPanel />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <TeamsList />
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <TasksManager />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <CalendarView />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <WebLeadCapture />
        </TabsContent>

        <TabsContent value="callbacks" className="space-y-4 bg-background p-4 rounded-lg border border-muted">
          <ClientCallbacks />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMTabs;
