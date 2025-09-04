
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Check,
  Phone, 
  Mail, 
  Coffee, 
  FileText,
  Users,
  MessageSquare,
  User
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Sample data
const mockActivities = [
  {
    id: '1',
    type: 'call',
    title: 'Follow-up call with John Smith',
    contactName: 'John Smith',
    contactCompany: 'Acme Corp',
    date: '2024-05-20',
    time: '09:30',
    duration: 30,
    status: 'completed',
    notes: 'Discussed new order possibilities. Client interested in our summer promotion.'
  },
  {
    id: '2',
    type: 'email',
    title: 'Product proposal to Tech Innovations',
    contactName: 'Sarah Johnson',
    contactCompany: 'Tech Innovations',
    date: '2024-05-25',
    time: '14:00',
    duration: 0,
    status: 'planned',
    notes: 'Need to prepare detailed proposal with pricing options.'
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Product demo with Michael Wong',
    contactName: 'Michael Wong',
    contactCompany: 'Global Solutions',
    date: '2024-05-22',
    time: '11:00',
    duration: 60,
    status: 'planned',
    notes: 'Prepare demo of our new product features. Focus on inventory management capabilities.'
  },
  {
    id: '4',
    type: 'note',
    title: 'Customer feedback notes',
    contactName: 'Lisa Brown',
    contactCompany: 'City Retail Group',
    date: '2024-05-18',
    time: '16:30',
    duration: 0,
    status: 'completed',
    notes: 'Customer provided feedback on recent delivery. Some issues with packaging that need to be addressed.'
  },
  {
    id: '5',
    type: 'task',
    title: 'Prepare quotation for enterprise order',
    contactName: 'David Chen',
    contactCompany: 'Innovate Manufacturing',
    date: '2024-05-23',
    time: '10:00',
    duration: 0,
    status: 'in-progress',
    notes: 'Need to include volume discounts and delivery schedule in the quote.'
  },
  {
    id: '6',
    type: 'meeting',
    title: 'Contract renewal discussion',
    contactName: 'John Smith',
    contactCompany: 'Acme Corp',
    date: '2024-05-30',
    time: '13:30',
    duration: 45,
    status: 'planned',
    notes: 'Discuss renewal terms and potential expansion of services.'
  }
];

const ActivitiesList = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    
    toast({
      title: 'Activity deleted',
      description: 'The activity has been deleted successfully.',
      variant: 'destructive'
    });
  };
  
  const handleMarkComplete = (id: string) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, status: 'completed' } : activity
    ));
    
    toast({
      title: 'Activity completed',
      description: 'The activity has been marked as completed.',
    });
  };
  
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         activity.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.contactCompany.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Sort activities by date (upcoming first)
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
  });
  
  // Group activities by date
  const groupedActivities: { [key: string]: typeof sortedActivities } = {};
  sortedActivities.forEach(activity => {
    // Format date for grouping
    const date = new Date(activity.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!groupedActivities[formattedDate]) {
      groupedActivities[formattedDate] = [];
    }
    
    groupedActivities[formattedDate].push(activity);
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={18} className="text-blue-500" />;
      case 'email':
        return <Mail size={18} className="text-purple-500" />;
      case 'meeting':
        return <Users size={18} className="text-green-500" />;
      case 'note':
        return <FileText size={18} className="text-yellow-500" />;
      case 'task':
        return <Check size={18} className="text-red-500" />;
      default:
        return <MessageSquare size={18} className="text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-700">Planned</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-700">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button>
          <Plus size={16} className="mr-2" />
          New Activity
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 bg-muted/40 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={statusFilter === 'all' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All Status
            </Button>
            <Button 
              variant={statusFilter === 'planned' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('planned')}
            >
              Planned
            </Button>
            <Button 
              variant={statusFilter === 'in-progress' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('in-progress')}
            >
              In Progress
            </Button>
            <Button 
              variant={statusFilter === 'completed' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={typeFilter === 'all' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              All Types
            </Button>
            <Button 
              variant={typeFilter === 'call' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setTypeFilter('call')}
            >
              Call
            </Button>
            <Button 
              variant={typeFilter === 'meeting' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setTypeFilter('meeting')}
            >
              Meeting
            </Button>
            <Button 
              variant={typeFilter === 'email' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setTypeFilter('email')}
            >
              Email
            </Button>
            <Button 
              variant={typeFilter === 'task' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setTypeFilter('task')}
            >
              Task
            </Button>
          </div>
        </div>
      </div>
      
      {Object.keys(groupedActivities).length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No activities found
        </div>
      ) : (
        Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <div key={date} className="space-y-3">
            <div className="sticky top-0 z-10 bg-background py-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <h3 className="font-medium">{date}</h3>
              </div>
              <Separator className="mt-2" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {dateActivities.map((activity) => (
                <Card key={activity.id} className={cn(
                  "overflow-hidden transition-colors",
                  activity.status === 'completed' && "bg-muted/30"
                )}>
                  <CardContent className="p-0">
                    <div className="flex items-start p-4">
                      <div className="flex-shrink-0 mr-4">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h3 className={cn(
                            "font-medium",
                            activity.status === 'completed' && "line-through text-muted-foreground"
                          )}>
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(activity.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Edit
                                </DropdownMenuItem>
                                {activity.status !== 'completed' && (
                                  <DropdownMenuItem onClick={() => handleMarkComplete(activity.id)}>
                                    <Check size={14} className="mr-2" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(activity.id)}
                                  className="text-red-600 hover:text-red-700 focus:text-red-700"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm space-x-4">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <User size={14} />
                            {activity.contactName} ({activity.contactCompany})
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm space-x-4">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock size={14} />
                            {formatTime(activity.time)}
                            {activity.duration > 0 && ` (${activity.duration} min)`}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare size={14} />
                            {getTypeLabel(activity.type)}
                          </span>
                        </div>
                        
                        {activity.notes && (
                          <div className="mt-2 p-2 bg-muted/40 rounded-md text-sm">
                            {activity.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivitiesList;
