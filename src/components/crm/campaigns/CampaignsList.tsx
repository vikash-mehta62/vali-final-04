
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  Calendar, 
  Clock, 
  Mail, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Target, 
  Users,
  X
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Sample data
const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Promotion 2024',
    type: 'email',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    audience: 'All Customers',
    expectedRevenue: 25000,
    budget: 5000,
    progress: 65,
    metrics: {
      sent: 5000,
      opened: 2100,
      clicked: 850,
      converted: 120,
    }
  },
  {
    id: '2',
    name: 'Product Launch Webinar',
    type: 'event',
    status: 'planned',
    startDate: '2024-07-15',
    endDate: '2024-07-15',
    audience: 'Enterprise Leads',
    expectedRevenue: 40000,
    budget: 8000,
    progress: 30,
    metrics: {
      sent: 2000,
      opened: 900,
      clicked: 450,
      converted: 0,
    }
  },
  {
    id: '3',
    name: 'End of Year Sale',
    type: 'multi-channel',
    status: 'draft',
    startDate: '2024-11-20',
    endDate: '2024-12-31',
    audience: 'All Prospects',
    expectedRevenue: 60000,
    budget: 12000,
    progress: 10,
    metrics: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
    }
  },
  {
    id: '4',
    name: 'Customer Referral Program',
    type: 'referral',
    status: 'active',
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    audience: 'Current Customers',
    expectedRevenue: 30000,
    budget: 3500,
    progress: 45,
    metrics: {
      sent: 3500,
      opened: 2800,
      clicked: 980,
      converted: 85,
    }
  },
  {
    id: '5',
    name: 'Spring Trade Show',
    type: 'event',
    status: 'completed',
    startDate: '2024-04-15',
    endDate: '2024-04-17',
    audience: 'Industry Professionals',
    expectedRevenue: 50000,
    budget: 15000,
    progress: 100,
    metrics: {
      sent: 1500,
      opened: 1500,
      clicked: 400,
      converted: 65,
    }
  },
];

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    startDate: '',
    endDate: '',
    audience: '',
    expectedRevenue: 0,
    budget: 0,
    description: ''
  });
  const { toast } = useToast();
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.audience.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    
    toast({
      title: "Campaign deleted",
      description: "The campaign has been removed successfully.",
      variant: "destructive"
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCampaign(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  const handleCreateCampaign = () => {
    // Validate required fields
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new campaign object
    const campaign = {
      id: String(Date.now()),
      name: newCampaign.name,
      type: newCampaign.type,
      status: 'draft',
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      audience: newCampaign.audience || 'All Customers',
      expectedRevenue: newCampaign.expectedRevenue,
      budget: newCampaign.budget,
      progress: 0,
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      }
    };
    
    // Add new campaign to list
    setCampaigns([campaign, ...campaigns]);
    
    // Reset form and close dialog
    setNewCampaign({
      name: '',
      type: 'email',
      startDate: '',
      endDate: '',
      audience: '',
      expectedRevenue: 0,
      budget: 0,
      description: ''
    });
    setShowNewCampaignDialog(false);
    
    toast({
      title: "Campaign created",
      description: "Your new campaign has been created as a draft."
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-800">Planned</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'referral':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'multi-channel':
        return <Target className="h-5 w-5 text-orange-500" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowNewCampaignDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No campaigns found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <div className="relative">
                <Progress value={campaign.progress} className="h-1 absolute top-0 left-0 right-0 rounded-none" />
              </div>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          {getStatusBadge(campaign.status)}
                          <span className="text-sm text-muted-foreground">
                            {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                          </span>
                          <span className="text-sm flex items-center text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {campaign.audience}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(campaign.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">Budget</div>
                      <div className="text-lg font-semibold">{formatCurrency(campaign.budget)}</div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">Expected Revenue</div>
                      <div className="text-lg font-semibold">{formatCurrency(campaign.expectedRevenue)}</div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="text-lg font-semibold">{formatDate(campaign.startDate)}</div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">End Date</div>
                      <div className="text-lg font-semibold">{formatDate(campaign.endDate)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Campaign Progress</div>
                      <div className="text-sm text-muted-foreground">{campaign.progress}%</div>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{campaign.metrics.sent.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Audience Reached</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{campaign.metrics.opened.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Opens/Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{campaign.metrics.clicked.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Interactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{campaign.metrics.converted.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* New Campaign Dialog */}
      <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="name" className="required">Campaign Name</Label>
              <Input
                id="name"
                name="name"
                value={newCampaign.name}
                onChange={handleInputChange}
                placeholder="Summer Promotion 2024"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Campaign Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="multi-channel">Multi-channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  name="audience"
                  value={newCampaign.audience}
                  onChange={handleInputChange}
                  placeholder="All Customers"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="required">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="required">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={newCampaign.budget.toString()}
                  onChange={handleNumberChange}
                  placeholder="5000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedRevenue">Expected Revenue ($)</Label>
                <Input
                  id="expectedRevenue"
                  name="expectedRevenue"
                  type="number"
                  value={newCampaign.expectedRevenue.toString()}
                  onChange={handleNumberChange}
                  placeholder="25000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newCampaign.description}
                onChange={handleInputChange}
                placeholder="Add details about your campaign..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsList;
