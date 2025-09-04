
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  Clock,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data
const staffActivities = [
  {
    id: '1',
    staff: 'John Smith',
    position: 'Sales Representative',
    activity: 'Phone call with Acme Corp',
    type: 'call',
    client: 'Acme Corp',
    time: '10:45 AM',
    duration: '18m 32s',
    outcome: 'successful',
    followUp: 'Yes - Tomorrow',
    notes: 'Discussed renewal options for upcoming contract'
  },
  {
    id: '2',
    staff: 'Sarah Johnson',
    position: 'Senior Sales Rep',
    activity: 'Meeting with TechInnovations Inc',
    type: 'meeting',
    client: 'TechInnovations Inc',
    time: '9:30 AM',
    duration: '45m',
    outcome: 'successful',
    followUp: 'Yes - Next week',
    notes: 'Presented new product line, client very interested'
  },
  {
    id: '3',
    staff: 'Michael Wong',
    position: 'Sales Manager',
    activity: 'Email follow-up with Global Solutions',
    type: 'email',
    client: 'Global Solutions',
    time: '11:15 AM',
    duration: '-',
    outcome: 'pending',
    followUp: 'No',
    notes: 'Sent price list and product catalog as requested'
  },
  {
    id: '4', 
    staff: 'Lisa Brown',
    position: 'Customer Success',
    activity: 'Training session with City Retail',
    type: 'training',
    client: 'City Retail Group',
    time: '2:00 PM',
    duration: '1h 15m',
    outcome: 'successful',
    followUp: 'Yes - 2 weeks',
    notes: 'Completed onboarding training, team is confident using the system'
  },
  {
    id: '5',
    staff: 'David Chen',
    position: 'Sales Representative',
    activity: 'Voicemail for Sunrise Distributors',
    type: 'call',
    client: 'Sunrise Distributors',
    time: '3:45 PM',
    duration: '2m 20s',
    outcome: 'unsuccessful',
    followUp: 'Yes - Tomorrow',
    notes: 'Left voicemail, trying again tomorrow morning'
  }
];

const StaffActivityMonitor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const { toast } = useToast();

  const handleFeedback = (id: string, feedback: string) => {
    toast({
      title: `Feedback ${feedback === 'positive' ? 'Approved' : 'Sent'}`,
      description: `Your ${feedback} feedback has been sent to the staff member`,
    });
  };

  const handleMarkReviewed = (id: string) => {
    toast({
      title: "Activity Reviewed",
      description: "The activity has been marked as reviewed",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <UserCheck className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'training':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'successful':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Successful
          </Badge>
        );
      case 'unsuccessful':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Unsuccessful
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Pending
          </Badge>
        );
      default:
        return <Badge>{outcome}</Badge>;
    }
  };

  // Apply filters
  const filteredActivities = staffActivities.filter(activity => {
    const matchesSearch = 
      activity.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.activity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesActivity = activityFilter === 'all' || activity.type === activityFilter;
    const matchesOutcome = outcomeFilter === 'all' || activity.outcome === outcomeFilter;
    
    return matchesSearch && matchesActivity && matchesOutcome;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Staff Activity Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff, clients, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={activityFilter} 
                onValueChange={setActivityFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Activity Type</SelectLabel>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="call">Calls</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="email">Emails</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select 
                value={outcomeFilter} 
                onValueChange={setOutcomeFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Outcome</SelectLabel>
                    <SelectItem value="all">All Outcomes</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="unsuccessful">Unsuccessful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="hidden md:table-cell">Follow-up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No activities match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="font-medium">{activity.staff}</div>
                        <div className="text-xs text-muted-foreground">{activity.position}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getActivityIcon(activity.type)}
                          <span>{activity.activity}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Duration: {activity.duration}
                        </div>
                      </TableCell>
                      <TableCell>{activity.client}</TableCell>
                      <TableCell className="hidden md:table-cell">{activity.time}</TableCell>
                      <TableCell>{getOutcomeBadge(activity.outcome)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {activity.followUp}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFeedback(activity.id, 'positive')}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Positive Feedback
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFeedback(activity.id, 'improvement')}>
                              <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                              Improvement Feedback
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkReviewed(activity.id)}>
                              <User className="h-4 w-4 mr-2" />
                              Mark as Reviewed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffActivityMonitor;
