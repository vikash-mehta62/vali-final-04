
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User,
  Users,
  ArrowRight,
  Clock,
  RefreshCw,
  MoreHorizontal,
  Calendar,
  AlertTriangle,
  Trash,
  Search,
  FilterX,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data - Leads awaiting assignment or with issues
const pendingLeads = [
  {
    id: 'ld001',
    name: 'Robert Johnson',
    company: 'Innovative Tech',
    source: 'Website',
    created: 'Today, 10:30 AM',
    interest: 'Product Demo',
    status: 'new',
    priority: 'high',
    notes: 'Interested in our enterprise solution'
  },
  {
    id: 'ld002',
    name: 'Emily Williams',
    company: 'Global Services Inc.',
    source: 'Trade Show',
    created: 'Today, 9:15 AM',
    interest: 'Pricing',
    status: 'new',
    priority: 'medium',
    notes: 'Requested pricing for 100+ units'
  },
  {
    id: 'ld003',
    name: 'James Martinez',
    company: 'Retail Solutions',
    source: 'Referral',
    created: 'Yesterday',
    interest: 'Consultation',
    status: 'contacted',
    priority: 'medium',
    notes: 'Called once, no answer - needs follow-up'
  },
  {
    id: 'ld004',
    name: 'Linda Chen',
    company: 'StartupXYZ',
    source: 'LinkedIn',
    created: '2 days ago',
    interest: 'Partnership',
    status: 'unresponsive',
    priority: 'low',
    notes: 'Attempted contact 3 times - no response'
  },
  {
    id: 'ld005',
    name: 'Michael Taylor',
    company: 'City Manufacturing',
    source: 'Email Campaign',
    created: '3 days ago',
    interest: 'Product Info',
    status: 'contacted',
    priority: 'high',
    notes: 'Requested call back next Monday'
  }
];

// Team members for assignment
const teamMembers = [
  { id: 'tm1', name: 'John Smith', role: 'Sales Representative', workload: '8 active leads' },
  { id: 'tm2', name: 'Sarah Johnson', role: 'Senior Sales Rep', workload: '12 active leads' },
  { id: 'tm3', name: 'Michael Wong', role: 'Sales Manager', workload: '5 active leads' },
  { id: 'tm4', name: 'Lisa Brown', role: 'Customer Success', workload: '10 active leads' },
  { id: 'tm5', name: 'David Chen', role: 'Sales Representative', workload: '6 active leads' },
];

const LeadAssignmentPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Leads Refreshed",
        description: "Lead information has been updated",
      });
    }, 1000);
  };

  const handleSelectLead = (id: string) => {
    const newSelected = [...selectedLeads];
    const index = newSelected.indexOf(id);
    if (index === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(index, 1);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleOpenAssignDialog = (id: string) => {
    setSelectedLeadId(id);
    setIsAssignDialogOpen(true);
  };

  const handleAssignLead = () => {
    const leadId = selectedLeadId || '';
    const leadName = pendingLeads.find(l => l.id === leadId)?.name || '';
    const teamMemberName = teamMembers.find(t => t.id === selectedTeamMember)?.name || '';
    
    toast({
      title: "Lead Assigned",
      description: `Lead "${leadName}" assigned to ${teamMemberName}`,
    });
    
    setIsAssignDialogOpen(false);
    setSelectedTeamMember('');
  };

  const handleBulkAssign = () => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No Leads Selected",
        description: "Please select at least one lead to assign",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedLeadId('bulk');
    setIsAssignDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <Badge className="bg-green-100 text-green-800">
            New
          </Badge>
        );
      case 'contacted':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Contacted
          </Badge>
        );
      case 'unresponsive':
        return (
          <Badge className="bg-red-100 text-red-800">
            Unresponsive
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Low
          </Badge>
        );
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Apply filters
  const filteredLeads = pendingLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Lead Assignment</span>
            <Badge className="ml-2">
              {pendingLeads.length} leads pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select 
                value={priorityFilter} 
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="unresponsive">Unresponsive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleClearFilters}
                className="h-10 w-10"
              >
                <FilterX className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                isLoading={isRefreshing}
                className="h-10 w-10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={handleSelectAllLeads}
                      />
                    </div>
                  </TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No leads found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{lead.created}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenAssignDialog(lead.id)}>
                              <User className="h-4 w-4 mr-2 text-blue-600" />
                              Assign to Team Member
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2 text-green-600" />
                              Schedule Follow-up
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash className="h-4 w-4 mr-2 text-red-600" />
                              Remove Lead
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
          
          {selectedLeads.length > 0 && (
            <div className="mt-4 bg-muted/30 p-3 rounded flex items-center justify-between">
              <div>
                <span className="font-medium">{selectedLeads.length} leads selected</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedLeads([])}
                >
                  Clear
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkAssign}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assign Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedLeadId === 'bulk' 
                ? `Assign ${selectedLeads.length} Leads` 
                : `Assign Lead: ${pendingLeads.find(l => l.id === selectedLeadId)?.name}`}
            </DialogTitle>
            <DialogDescription>
              Select a team member to assign this lead to:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 mb-3 last:mb-0">
                  <RadioGroupItem value={member.id} id={member.id} />
                  <Label htmlFor={member.id} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.role} • {member.workload}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
            <Button 
              disabled={!selectedTeamMember} 
              onClick={handleAssignLead}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Assign Lead{selectedLeadId === 'bulk' ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadAssignmentPanel;
