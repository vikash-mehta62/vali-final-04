
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import CRMTabs from '@/components/crm/CRMTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  PieChart, 
  Users, 
  Briefcase, 
  Calendar, 
  Bell, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  MoveRight,
  Globe,
  PhoneCall,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { ContactsProvider } from '@/contexts/ContactsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CRM = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [overviewTab, setOverviewTab] = useState('main');
  const [isExpandedView, setIsExpandedView] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [leadSource, setLeadSource] = useState('website');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleExpandedView = () => {
    setIsExpandedView(!isExpandedView);
  };
  
  const handleRefreshDashboard = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Updated",
        description: "CRM dashboard data has been refreshed",
      });
    }, 1200);
  };

  const handleCaptureLead = () => {
    toast({
      title: "Lead Capture Module",
      description: "The lead capture integration would be connected here.",
    });
  };

  const upcomingCallbacks = [
    {
      clientName: "Sarah Johnson",
      company: "Tech Innovations",
      phone: "(555) 987-6543",
      time: "2:30 PM",
      date: "Today",
      purpose: "Follow-up on proposal"
    },
    {
      clientName: "John Smith",
      company: "Acme Corp",
      phone: "(555) 123-4567",
      time: "11:00 AM",
      date: "Tomorrow",
      purpose: "Discuss contract renewal"
    },
    {
      clientName: "Michael Wong",
      company: "Global Solutions",
      phone: "(555) 456-7890",
      time: "3:15 PM",
      date: "Tomorrow",
      purpose: "Product demo"
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
              <PageHeader 
                title="CRM Management" 
                description="Manage your client relationships, campaigns, and activities"
              />
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshDashboard}
                  disabled={isRefreshing}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleExpandedView}
                  className="flex items-center gap-1"
                >
                  {isExpandedView ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Collapse</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Expand</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Business Email Domains Button - Added for quick access */}
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Find the messaging tab and select domains subtab
                  const crmTab = document.querySelector('[data-value="messaging"]') as HTMLElement;
                  if (crmTab) crmTab.click();
                  
                  // Small delay to ensure the tab is changed
                  setTimeout(() => {
                    const domainsTab = document.querySelector('[data-value="domains"]') as HTMLElement;
                    if (domainsTab) domainsTab.click();
                  }, 100);
                }}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Business Email Domains
              </Button>
            </div>
            
            {isExpandedView && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <Tabs value={overviewTab} onValueChange={setOverviewTab} className="w-full">
                    <TabsList className="mb-4 flex-wrap">
                      <TabsTrigger value="main" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        CRM Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="metrics" className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Key Metrics
                      </TabsTrigger>
                      <TabsTrigger value="deals" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Deal Summaries
                      </TabsTrigger>
                      <TabsTrigger value="calendar" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Calendar View
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="main" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <h3 className="text-xl font-medium text-green-800">Open Deals</h3>
                          <p className="text-3xl font-bold text-green-700">24</p>
                          <p className="text-sm text-green-600">+8% from last week</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="text-xl font-medium text-blue-800">Active Contacts</h3>
                          <p className="text-3xl font-bold text-blue-700">187</p>
                          <p className="text-sm text-blue-600">+12 new this month</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <h3 className="text-xl font-medium text-amber-800">Pending Tasks</h3>
                          <p className="text-3xl font-bold text-amber-700">42</p>
                          <p className="text-sm text-amber-600">16 due today</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium">Upcoming Activities</h3>
                            <Button variant="ghost" size="sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              View Calendar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                              <div>
                                <p className="font-medium">Team Meeting</p>
                                <p className="text-sm text-muted-foreground">Today, 2:00 PM</p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">Meeting</Badge>
                            </div>
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div>
                                <p className="font-medium">Call with Acme Corp</p>
                                <p className="text-sm text-muted-foreground">Tomorrow, 11:30 AM</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Call</Badge>
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button variant="link" size="sm" className="flex items-center gap-1 text-primary">
                                See all activities
                                <MoveRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium">Recent Notifications</h3>
                            <Button variant="ghost" size="sm">
                              <Bell className="h-4 w-4 mr-1" />
                              View All
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
                              <p className="font-medium">New lead created</p>
                              <p className="text-sm text-muted-foreground">Sarah Johnson from Tech Innovations</p>
                            </div>
                            <div className="p-2 border-l-4 border-green-500 bg-green-50 rounded">
                              <p className="font-medium">Deal moved to negotiation</p>
                              <p className="text-sm text-muted-foreground">Global Solutions service contract</p>
                            </div>
                            <div className="p-2 border-l-4 border-amber-500 bg-amber-50 rounded">
                              <p className="font-medium">Task assigned to you</p>
                              <p className="text-sm text-muted-foreground">Follow up with City Retail Group</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Globe className="h-5 w-5 text-blue-500" />
                              Website Lead Capture
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Lead Source:</span>
                                <Select value={leadSource} onValueChange={setLeadSource}>
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="website">Website Form</SelectItem>
                                    <SelectItem value="landing">Landing Page</SelectItem>
                                    <SelectItem value="chat">Live Chat</SelectItem>
                                    <SelectItem value="contact">Contact Page</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleCaptureLead} className="w-full">
                                Configure Lead Capture
                              </Button>
                              <p className="text-xs text-muted-foreground">
                                Connect your website forms to automatically create leads in your CRM
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <PhoneCall className="h-5 w-5 text-green-500" />
                              Upcoming Callbacks
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 max-h-[150px] overflow-y-auto">
                              {upcomingCallbacks.map((callback, index) => (
                                <div key={index} className="flex items-center justify-between bg-muted/40 p-2 rounded">
                                  <div>
                                    <p className="font-medium">{callback.clientName}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>{callback.date}, {callback.time}</span>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Call
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance" className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">Team Performance Overview</h3>
                        <p className="text-sm text-muted-foreground">
                          View detailed team performance metrics in the Team tab.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="metrics" className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">CRM Key Metrics</h3>
                        <p className="text-sm text-muted-foreground">
                          Customer acquisition cost, lifetime value, and conversion rates.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="deals" className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">Deal Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          Weekly deal summaries and forecasting.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="calendar" className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Calendar & Follow-ups</h3>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Add Event
                            </Button>
                          </div>
                          <div className="bg-muted/50 p-6 rounded-lg text-center">
                            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Calendar integration shows all your follow-ups and scheduled calls in one place.
                            </p>
                            <Button variant="link" className="mt-2">
                              Connect Calendar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            <ContactsProvider>
              <CRMTabs />
            </ContactsProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CRM;
