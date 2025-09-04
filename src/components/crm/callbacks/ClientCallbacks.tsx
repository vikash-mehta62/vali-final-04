
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  MoreHorizontal, 
  Search, 
  Plus, 
  AlertTriangle,
  Filter,
  Mail,
  UserCircle,
  CalendarDays,
  ClipboardList,
  FileCheck
} from 'lucide-react';
import { useContacts } from '@/contexts/ContactsContext';
import { format } from 'date-fns';

interface CallbackRecord {
  id: string;
  contactId: string;
  contactName: string;
  company?: string;
  phone: string;
  email?: string;
  scheduledDate: Date;
  scheduledTime: string;
  purpose: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'missed' | 'rescheduled';
  followUpDate?: Date;
  history?: {
    date: Date;
    action: string;
    notes?: string;
  }[];
}

const ClientCallbacks = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [callbacks, setCallbacks] = useState<CallbackRecord[]>([
    {
      id: '1',
      contactId: '1',
      contactName: 'John Smith',
      company: 'Acme Corp',
      phone: '(555) 123-4567',
      email: 'john@acmecorp.com',
      scheduledDate: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
      scheduledTime: '15:30',
      purpose: 'Discuss contract renewal',
      notes: 'He requested information about the new pricing structure',
      priority: 'high',
      status: 'pending',
      history: [
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          action: 'Email sent',
          notes: 'Sent renewal options via email'
        }
      ]
    },
    {
      id: '2',
      contactId: '2',
      contactName: 'Sarah Johnson',
      company: 'Tech Innovations',
      phone: '(555) 987-6543',
      email: 'sarah@techinnovations.com',
      scheduledDate: new Date(Date.now() + 1000 * 60 * 180), // 3 hours from now
      scheduledTime: '17:00',
      purpose: 'Follow-up on proposal',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: '3',
      contactId: '3',
      contactName: 'Michael Wong',
      company: 'Global Solutions',
      phone: '(555) 456-7890',
      email: 'michael@globalsolutions.com',
      scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      scheduledTime: '10:15',
      purpose: 'Product demo questions',
      notes: 'Has questions about integration capabilities',
      priority: 'medium',
      status: 'missed',
      followUpDate: new Date(Date.now() + 1000 * 60 * 60 * 24) // tomorrow
    },
    {
      id: '4',
      contactId: '4',
      contactName: 'Emily Parker',
      company: 'Retail Group',
      phone: '(555) 234-5678',
      email: 'emily@retailgroup.com',
      scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      scheduledTime: '14:00',
      purpose: 'Discuss new order requirements',
      priority: 'low',
      status: 'completed',
      history: [
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24),
          action: 'Call completed',
          notes: 'Discussed order requirements, will send follow-up email with details'
        }
      ]
    },
    {
      id: '5',
      contactId: '5',
      contactName: 'James Wilson',
      company: 'Wilson Enterprises',
      phone: '(555) 876-5432',
      email: 'james@wilsonenterprises.com',
      scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      scheduledTime: '11:30',
      purpose: 'New product inquiry',
      priority: 'high',
      status: 'pending'
    }
  ]);
  
  const { contacts } = useContacts();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [selectedCallback, setSelectedCallback] = useState<CallbackRecord | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCallback, setNewCallback] = useState({
    contactId: '',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '12:00',
    purpose: '',
    priority: 'medium',
    notes: ''
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (callback: CallbackRecord, newStatus: CallbackRecord['status']) => {
    setCallbacks(callbacks.map(cb => 
      cb.id === callback.id ? { ...cb, status: newStatus } : cb
    ));
    
    toast({
      title: `Callback ${newStatus}`,
      description: `Callback with ${callback.contactName} marked as ${newStatus}`
    });
  };

  const openCallDialog = (callback: CallbackRecord) => {
    setSelectedCallback(callback);
    setShowCallDialog(true);
  };

  const closeCallDialog = () => {
    setSelectedCallback(null);
    setShowCallDialog(false);
    setCallNotes('');
    setCallOutcome('');
  };

  const handleCompleteCall = () => {
    if (!selectedCallback) return;
    
    const history = selectedCallback.history || [];
    const updatedCallback: CallbackRecord = {
      ...selectedCallback,
      status: 'completed',
      history: [
        ...history,
        {
          date: new Date(),
          action: 'Call completed',
          notes: callNotes
        }
      ]
    };
    
    setCallbacks(callbacks.map(cb => 
      cb.id === selectedCallback.id ? updatedCallback : cb
    ));
    
    toast({
      title: "Call completed",
      description: `Call with ${selectedCallback.contactName} has been marked as completed`
    });
    
    closeCallDialog();
  };

  const handleRescheduleCall = () => {
    if (!selectedCallback) return;
    
    const history = selectedCallback.history || [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const updatedCallback: CallbackRecord = {
      ...selectedCallback,
      status: 'rescheduled',
      scheduledDate: tomorrow,
      followUpDate: tomorrow,
      history: [
        ...history,
        {
          date: new Date(),
          action: 'Call rescheduled',
          notes: callNotes
        }
      ]
    };
    
    setCallbacks(callbacks.map(cb => 
      cb.id === selectedCallback.id ? updatedCallback : cb
    ));
    
    toast({
      title: "Call rescheduled",
      description: `Call with ${selectedCallback.contactName} has been rescheduled for tomorrow`
    });
    
    closeCallDialog();
  };

  const handleAddCallback = () => {
    const contact = contacts.find(c => c.id === newCallback.contactId);
    if (!contact) {
      toast({
        title: "Error",
        description: "Please select a valid contact",
        variant: "destructive"
      });
      return;
    }
    
    const [year, month, day] = newCallback.scheduledDate.split('-').map(Number);
    const scheduledDate = new Date(year, month - 1, day);
    
    const newCb: CallbackRecord = {
      id: String(callbacks.length + 1),
      contactId: contact.id,
      contactName: contact.name,
      company: contact.company,
      phone: contact.phone,
      email: contact.email,
      scheduledDate,
      scheduledTime: newCallback.scheduledTime,
      purpose: newCallback.purpose,
      notes: newCallback.notes,
      priority: newCallback.priority as 'low' | 'medium' | 'high',
      status: 'pending'
    };
    
    setCallbacks([...callbacks, newCb]);
    setShowAddDialog(false);
    
    toast({
      title: "Callback scheduled",
      description: `Callback with ${contact.name} has been scheduled`
    });
    
    // Reset form
    setNewCallback({
      contactId: '',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '12:00',
      purpose: '',
      priority: 'medium',
      notes: ''
    });
  };

  // Filtered callbacks based on tab and search
  const filteredCallbacks = callbacks.filter(callback => {
    // Filter by tab (status)
    if (activeTab !== 'all' && callback.status !== activeTab) return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        callback.contactName.toLowerCase().includes(query) ||
        (callback.company && callback.company.toLowerCase().includes(query)) ||
        callback.phone.includes(query) ||
        (callback.email && callback.email.toLowerCase().includes(query)) ||
        callback.purpose.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
    }
  };

  const getStatusBadge = (status: CallbackRecord['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      case 'rescheduled':
        return <Badge className="bg-amber-100 text-amber-800">Rescheduled</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Client Callbacks & Follow-ups</h2>
          <p className="text-muted-foreground">
            Manage scheduled callbacks and client follow-ups
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search callbacks..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Callback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a Callback</DialogTitle>
                <DialogDescription>
                  Add a new callback or follow-up with a client
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Select 
                    value={newCallback.contactId} 
                    onValueChange={(value) => setNewCallback({...newCallback, contactId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} - {contact.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      type="date" 
                      id="date" 
                      value={newCallback.scheduledDate}
                      onChange={(e) => setNewCallback({...newCallback, scheduledDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      type="time" 
                      id="time" 
                      value={newCallback.scheduledTime}
                      onChange={(e) => setNewCallback({...newCallback, scheduledTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input 
                    id="purpose" 
                    placeholder="E.g., Discuss contract renewal" 
                    value={newCallback.purpose}
                    onChange={(e) => setNewCallback({...newCallback, purpose: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newCallback.priority} 
                    onValueChange={(value) => setNewCallback({...newCallback, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any additional notes or context" 
                    value={newCallback.notes}
                    onChange={(e) => setNewCallback({...newCallback, notes: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddCallback}>Schedule Callback</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
          <TabsTrigger value="missed" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Missed</span>
          </TabsTrigger>
          <TabsTrigger value="rescheduled" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Rescheduled</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="p-6">
            {filteredCallbacks.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No callbacks found</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowAddDialog(true)}
                >
                  Schedule a callback
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCallbacks.map(callback => (
                  <div 
                    key={callback.id} 
                    className={`border rounded-lg p-4 ${
                      callback.status === 'pending' && callback.priority === 'high' ? 'border-red-200 bg-red-50' : 
                      callback.status === 'missed' ? 'border-red-100 bg-red-50/50' : 
                      callback.status === 'completed' ? 'border-green-100 bg-green-50/50' : 
                      callback.status === 'rescheduled' ? 'border-amber-100 bg-amber-50/50' : 
                      'border-muted bg-muted/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{callback.contactName}</h3>
                          {callback.company && (
                            <p className="text-sm text-muted-foreground">{callback.company}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(callback.priority)}
                        {getStatusBadge(callback.status)}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <a href={`tel:${callback.phone}`} className="text-sm hover:underline">
                          {callback.phone}
                        </a>
                      </div>
                      
                      {callback.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                          <a href={`mailto:${callback.email}`} className="text-sm hover:underline">
                            {callback.email}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">
                          {format(callback.scheduledDate, 'MMM d, yyyy')} at {callback.scheduledTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm">
                        <span className="font-medium">Purpose:</span> {callback.purpose}
                      </p>
                      {callback.notes && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Notes:</span> {callback.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        {callback.history && callback.history.length > 0 && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <ClipboardList className="h-3 w-3 mr-1" />
                            <span>View History ({callback.history.length})</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {callback.status === 'pending' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => openCallDialog(callback)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {callback.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(callback, 'completed')}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Mark as completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(callback, 'missed')}>
                                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                  Mark as missed
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => setShowAddDialog(true)}>
                              <CalendarDays className="h-4 w-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileCheck className="h-4 w-4 mr-2" />
                              Edit details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
      
      <Dialog open={showCallDialog} onOpenChange={closeCallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call in Progress</DialogTitle>
            <DialogDescription>
              Calling {selectedCallback?.contactName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCallback && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">{selectedCallback.contactName}</h3>
                {selectedCallback.company && (
                  <p className="text-muted-foreground">{selectedCallback.company}</p>
                )}
                <p className="text-xl font-medium mt-2">{selectedCallback.phone}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Call Notes</h4>
                <Textarea
                  placeholder="Add notes about your conversation..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Outcome</h4>
                <Select value={callOutcome} onValueChange={setCallOutcome}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="successful">Call successful</SelectItem>
                    <SelectItem value="voicemail">Left voicemail</SelectItem>
                    <SelectItem value="unavailable">Contact unavailable</SelectItem>
                    <SelectItem value="wrong_number">Wrong number</SelectItem>
                    <SelectItem value="no_answer">No answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button variant="outline" onClick={handleRescheduleCall}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button onClick={handleCompleteCall}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Call
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientCallbacks;
