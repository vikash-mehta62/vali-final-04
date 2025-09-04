import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  Phone,
  Mail,
  UserCircle,
  MessageSquare,
  CheckCircle2,
  CalendarDays,
  RefreshCw,
  Filter,
  Bell,
  Link,
  CalendarDays as CalendarDaysIcon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useContacts } from '@/contexts/ContactsContext';
import CalendarIntegration from './CalendarIntegration';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'followup' | 'callback';
  contactId?: string;
  contactName?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  duration?: string;
}

const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [showAddEventPopover, setShowAddEventPopover] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<Event['type']>('call');
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPriority, setEventPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [eventDuration, setEventDuration] = useState('30min');
  const [selectedContact, setSelectedContact] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [filterByType, setFilterByType] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'integrations'>('calendar');
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();
  const { contacts } = useContacts();

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Call with John Smith',
      date: new Date(),
      time: '10:00 AM',
      type: 'call',
      contactId: '1',
      contactName: 'John Smith',
      description: 'Discuss contract renewal options',
      completed: false,
      priority: 'high',
      duration: '30min'
    },
    {
      id: '2',
      title: 'Follow up with Sarah',
      date: new Date(),
      time: '2:30 PM',
      type: 'followup',
      contactId: '2',
      contactName: 'Sarah Johnson',
      description: 'Check on the proposal status',
      completed: false,
      priority: 'medium',
      duration: '15min'
    },
    {
      id: '3',
      title: 'Team meeting',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: '9:00 AM',
      type: 'meeting',
      description: 'Weekly sales update',
      completed: false,
      priority: 'medium',
      duration: '60min'
    },
    {
      id: '4',
      title: 'Send proposal to Michael',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: '1:00 PM',
      type: 'email',
      contactId: '3',
      contactName: 'Michael Wong',
      description: 'Send the updated pricing details',
      completed: false,
      priority: 'low',
      duration: '15min'
    },
    {
      id: '5',
      title: 'Callback to James Wilson',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      time: '11:00 AM',
      type: 'callback',
      contactId: '4',
      contactName: 'James Wilson',
      description: 'Return call about new product inquiry',
      completed: false,
      priority: 'high',
      duration: '20min'
    },
    {
      id: '6',
      title: 'Follow up on lead from website',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '3:00 PM',
      type: 'followup',
      contactId: '5',
      contactName: 'Emily Parker',
      description: 'Follow up on contact form submission from website',
      completed: false,
      priority: 'high',
      duration: '25min'
    }
  ]);

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    let filteredEvents = events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
    
    if (filterByType) {
      filteredEvents = filteredEvents.filter(event => event.type === filterByType);
    }
    
    return filteredEvents;
  };

  const selectedDateEvents = getEventsForDate(date);

  const handleAddEvent = () => {
    if (!date || !eventTitle || !eventTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to create an event",
        variant: "destructive"
      });
      return;
    }

    const contactInfo = contacts.find(c => c.id === selectedContact);

    const newEvent: Event = {
      id: String(events.length + 1),
      title: eventTitle,
      date: date,
      time: eventTime,
      type: selectedEventType,
      description: eventDescription || '',
      completed: false,
      priority: eventPriority,
      duration: eventDuration,
      contactId: selectedContact || undefined,
      contactName: contactInfo?.name || undefined
    };

    setEvents([...events, newEvent]);
    setEventTitle('');
    setEventTime('');
    setEventDescription('');
    setSelectedContact('');
    setShowAddEventPopover(false);

    toast({
      title: "Event added",
      description: `${newEvent.title} has been added to your calendar`,
    });
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, completed: !event.completed } 
        : event
    ));

    const targetEvent = events.find(e => e.id === eventId);
    
    toast({
      title: targetEvent?.completed ? "Event marked as incomplete" : "Event completed",
      description: targetEvent?.title,
    });
  };

  const handleRefreshCalendar = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Calendar refreshed",
        description: "Your calendar has been updated with the latest events",
      });
    }, 800);
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-500" />;
      case 'meeting':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4 text-red-500" />;
      case 'followup':
        return <CalendarDays className="h-4 w-4 text-amber-500" />;
      case 'callback':
        return <Phone className="h-4 w-4 text-green-700" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventTypeBadge = (type: Event['type']) => {
    switch (type) {
      case 'call':
        return <Badge className="bg-blue-100 text-blue-800">Call</Badge>;
      case 'meeting':
        return <Badge className="bg-green-100 text-green-800">Meeting</Badge>;
      case 'email':
        return <Badge className="bg-purple-100 text-purple-800">Email</Badge>;
      case 'task':
        return <Badge className="bg-red-100 text-red-800">Task</Badge>;
      case 'followup':
        return <Badge className="bg-amber-100 text-amber-800">Follow-up</Badge>;
      case 'callback':
        return <Badge className="bg-green-200 text-green-900">Callback</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high' | undefined) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">High</Badge>;
      default:
        return null;
    }
  };

  const hasDuplicateEvents = (date: Date): boolean => {
    const eventsForDate = getEventsForDate(date);
    if (eventsForDate.length < 2) return false;
    
    const timeMap: Record<string, boolean> = {};
    for (const event of eventsForDate) {
      if (timeMap[event.time]) return true;
      timeMap[event.time] = true;
    }
    
    return false;
  };

  const renderDateCellContent = (date: Date) => {
    const eventsForDate = getEventsForDate(date);
    const hasEvents = eventsForDate.length > 0;
    const hasDuplicates = hasDuplicateEvents(date);
    
    if (!hasEvents) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
        <div className={cn(
          "h-1 w-1 rounded-full",
          hasDuplicates ? "bg-red-500" : "bg-primary"
        )}/>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Calendar & Follow-ups</h2>
          <p className="text-muted-foreground">
            Schedule and manage your appointments, calls, and follow-ups
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshCalendar}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab(activeTab === 'calendar' ? 'integrations' : 'calendar')}
          >
            {activeTab === 'calendar' ? (
              <>
                <Link className="h-4 w-4 mr-2" />
                Integrations
              </>
            ) : (
              <>
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                Calendar
              </>
            )}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium">Filter by type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(['call', 'meeting', 'email', 'task', 'followup', 'callback'] as Event['type'][]).map(type => (
                    <Button 
                      key={type} 
                      variant={filterByType === type ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilterByType(filterByType === type ? null : type)}
                      className="flex items-center justify-start capitalize"
                    >
                      {getEventTypeIcon(type)}
                      <span className="ml-2">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Tabs 
            value={calendarView} 
            onValueChange={(v) => setCalendarView(v as 'month' | 'week' | 'day')}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-3 w-[200px]">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover open={showAddEventPopover} onOpenChange={setShowAddEventPopover}>
            <PopoverTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Add New Event</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-2">
                    <Button 
                      variant={selectedEventType === 'call' ? 'default' : 'outline'} 
                      size="sm"
                      className="col-span-1 p-1"
                      onClick={() => setSelectedEventType('call')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedEventType === 'meeting' ? 'default' : 'outline'} 
                      size="sm"
                      className="col-span-1 p-1"
                      onClick={() => setSelectedEventType('meeting')}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedEventType === 'email' ? 'default' : 'outline'} 
                      size="sm"
                      className="col-span-1 p-1"
                      onClick={() => setSelectedEventType('email')}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedEventType === 'task' ? 'default' : 'outline'} 
                      size="sm"
                      className="col-span-1 p-1"
                      onClick={() => setSelectedEventType('task')}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedEventType === 'followup' ? 'default' : 'outline'} 
                      size="sm"
                      className="col-span-1 p-1"
                      onClick={() => setSelectedEventType('followup')}
                    >
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedEventType === 'callback' ? 'default' : 'outline'} 
                      size="sm"
                      className="col-span-1 p-1"
                      onClick={() => setSelectedEventType('callback')}
                    >
                      <Phone className="h-4 w-4 rotate-90" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      placeholder="Event title"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground absolute ml-2" />
                          <Input
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={eventPriority} onValueChange={(v) => setEventPriority(v as 'low' | 'medium' | 'high')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={eventDuration} onValueChange={setEventDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15min">15 minutes</SelectItem>
                          <SelectItem value="30min">30 minutes</SelectItem>
                          <SelectItem value="45min">45 minutes</SelectItem>
                          <SelectItem value="60min">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Select value={selectedContact} onValueChange={setSelectedContact}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} - {contact.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Description (optional)"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleAddEvent}>
                  Add to Calendar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {activeTab === 'integrations' ? (
        <CalendarIntegration webhookUrl={webhookUrl} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="md:col-span-5">
              <Card>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="pointer-events-auto"
                    weekStartsOn={1}
                    components={{
                      DayContent: ({ date }) => (
                        <div className="relative h-full w-full flex items-center justify-center">
                          {date.getDate()}
                          {renderDateCellContent(date)}
                        </div>
                      )
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => (
                        <div 
                          key={event.id} 
                          className={cn(
                            "flex items-start p-2 rounded-md",
                            event.completed 
                              ? "bg-muted/40 text-muted-foreground" 
                              : event.priority === 'high'
                                ? "bg-red-50"
                                : event.priority === 'medium'
                                  ? "bg-amber-50"
                                  : "bg-blue-50"
                          )}
                        >
                          <div className="mt-1 mr-3">
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className={cn(
                                "font-medium",
                                event.completed && "line-through"
                              )}>
                                {event.title}
                              </p>
                              <div className="flex gap-1">
                                {getPriorityBadge(event.priority)}
                                {getEventTypeBadge(event.type)}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{event.time}</span>
                              {event.duration && (
                                <span className="ml-2">({event.duration})</span>
                              )}
                            </div>
                            {event.contactName && (
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <UserCircle className="h-3 w-3 mr-1" />
                                <span>{event.contactName}</span>
                              </div>
                            )}
                            {event.description && (
                              <p className="text-xs mt-1">{event.description}</p>
                            )}
                          </div>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleEventCompletion(event.id)}
                            >
                              <CheckCircle2 className={cn(
                                "h-4 w-4",
                                event.completed ? "text-green-500" : "text-muted-foreground"
                              )} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2" />
                      <p>No events scheduled for this date</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => setShowAddEventPopover(true)}
                      >
                        Add an event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Today</h3>
                  <Separator className="mb-2" />
                  <div className="space-y-2">
                    {events
                      .filter(event => 
                        new Date(event.date).toDateString() === new Date().toDateString()
                      )
                      .map(event => (
                        <div key={event.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <div className="flex items-center">
                            {getEventTypeIcon(event.type)}
                            <span className="ml-2">{event.title}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">{event.time}</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Tomorrow</h3>
                  <Separator className="mb-2" />
                  <div className="space-y-2">
                    {events
                      .filter(event => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return new Date(event.date).toDateString() === tomorrow.toDateString();
                      })
                      .map(event => (
                        <div key={event.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <div className="flex items-center">
                            {getEventTypeIcon(event.type)}
                            <span className="ml-2">{event.title}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">{event.time}</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Upcoming Callbacks</h3>
                  <Separator className="mb-2" />
                  <div className="space-y-2">
                    {events
                      .filter(event => 
                        event.type === 'callback' && 
                        new Date(event.date) >= new Date()
                      )
                      .slice(0, 3)
                      .map(event => (
                        <div key={event.id} className="flex items-center justify-between p-2 rounded bg-green-50">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-green-700" />
                            <div className="ml-2">
                              <p className="font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground">{event.contactName}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-xs text-muted-foreground">{format(event.date, 'MMM d')}, {event.time}</p>
                            <Button variant="ghost" size="sm" className="h-7 mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>Call</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CalendarView;
