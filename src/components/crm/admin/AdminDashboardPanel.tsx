
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Users, 
  BarChart, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  PhoneCall,
  Calendar,
  Briefcase,
  UserCog,
  RefreshCw,
  Filter,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import StaffActivityMonitor from './StaffActivityMonitor';
import LeadAssignmentPanel from './LeadAssignmentPanel';

// Mock data
const teamPerformance = [
  { 
    name: 'John Smith', 
    role: 'Sales Representative',
    conversion: 42,
    status: 'active'
  },
  { 
    name: 'Sarah Johnson', 
    role: 'Senior Sales Rep',
    conversion: 56,
    status: 'active'
  },
  { 
    name: 'Michael Wong', 
    role: 'Sales Manager',
    conversion: 44,
    status: 'active'
  },
  { 
    name: 'Lisa Brown', 
    role: 'Customer Success',
    conversion: 68,
    status: 'offline'
  }
];

const AdminDashboardPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "Admin dashboard data has been updated",
      });
    }, 1500);
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Report Generation Started",
      description: "Your performance report is being generated and will be available shortly",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl">Admin Dashboard</CardTitle>
            <CardDescription>
              Monitor team performance and manage CRM operations
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select 
              value={timeFrame} 
              onValueChange={setTimeFrame}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-1">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Report</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full flex-wrap justify-start">
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <BarChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-1.5">
              <UserCog className="h-4 w-4" />
              Staff Activity
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              Lead Management
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-1.5">
              <PhoneCall className="h-4 w-4" />
              Call Analytics
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                      <h3 className="text-2xl font-bold mt-1">145</h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      +12%
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conversion Rate</span>
                      <span className="font-medium">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                      <h3 className="text-2xl font-bold mt-1">32</h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      +5%
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Win Rate</span>
                      <span className="font-medium">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                      <h3 className="text-2xl font-bold mt-1">78</h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                    >
                      25 urgent
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">41%</span>
                    </div>
                    <Progress value={41} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Performance</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[300px]">
                  <div className="space-y-4">
                    {teamPerformance.map((member, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{member.conversion}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Team Members
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[300px]">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-100 text-green-800 mt-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </Badge>
                      <div>
                        <p className="font-medium">Deal Closed: Acme Corp</p>
                        <p className="text-sm text-muted-foreground">Sarah Johnson closed a $24,500 deal</p>
                        <p className="text-xs text-muted-foreground">Today, 10:45 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-100 text-blue-800 mt-0.5">
                        <MessageSquare className="h-3 w-3" />
                      </Badge>
                      <div>
                        <p className="font-medium">New Lead Response</p>
                        <p className="text-sm text-muted-foreground">John Smith responded to website inquiry from TechInnovations Inc.</p>
                        <p className="text-xs text-muted-foreground">Today, 9:32 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="bg-amber-100 text-amber-800 mt-0.5">
                        <Clock className="h-3 w-3" />
                      </Badge>
                      <div>
                        <p className="font-medium">Follow-up Scheduled</p>
                        <p className="text-sm text-muted-foreground">Michael Wong scheduled a follow-up call with Global Solutions</p>
                        <p className="text-xs text-muted-foreground">Yesterday, 4:15 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge className="bg-red-100 text-red-800 mt-0.5">
                        <AlertCircle className="h-3 w-3" />
                      </Badge>
                      <div>
                        <p className="font-medium">Missed Deadline</p>
                        <p className="text-sm text-muted-foreground">Proposal for City Retail Group has missed the deadline</p>
                        <p className="text-xs text-muted-foreground">Yesterday, 2:30 PM</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Staff Activity Tab */}
          <TabsContent value="staff">
            <StaffActivityMonitor />
          </TabsContent>
          
          {/* Lead Management Tab */}
          <TabsContent value="leads">
            <LeadAssignmentPanel />
          </TabsContent>
          
          {/* Call Analytics Tab */}
          <TabsContent value="calls">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Call Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Total Calls: 289 | Average Duration: 8m 45s
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <PhoneCall className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Call analytics integration shows all your team's calling activity in one place.
                  </p>
                  <Button variant="link" className="mt-2">
                    Set Up Call Tracking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardPanel;
