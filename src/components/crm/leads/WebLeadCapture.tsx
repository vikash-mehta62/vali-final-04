import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import {
  Globe,
  Code,
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCircle,
  FileEdit,
  UserPlus,
  Filter,
  Bell,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  Info,
  Download,
  Save
} from 'lucide-react';
import { useContacts } from '@/contexts/ContactsContext';
import WebLeadCaptureFormEditor from './WebLeadCaptureFormEditor';

interface WebLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  date: Date;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  score?: number;
  processed: boolean;
}

const WebLeadCapture = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [leadsFilter, setLeadsFilter] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [embedCode, setEmbedCode] = useState(`<form action="https://yourwebsite.com/api/leads" method="POST">
  <input type="text" name="name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="tel" name="phone" placeholder="Phone Number" />
  <textarea name="message" placeholder="Message"></textarea>
  <input type="hidden" name="source" value="contact_form" />
  <button type="submit">Submit</button>
</form>`);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [scoringEnabled, setScoringEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { addContact } = useContacts();

  const [leads, setLeads] = useState<WebLead[]>([
    {
      id: '1',
      name: 'Sarah Miller',
      email: 'sarah.miller@example.com',
      phone: '(555) 123-4567',
      message: 'I am interested in your services for my small business.',
      source: 'contact_form',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'new',
      score: 85,
      processed: false
    },
    {
      id: '2',
      name: 'John Davidson',
      email: 'john.davidson@example.com',
      phone: '(555) 987-6543',
      message: 'Please send me more information about your pricing.',
      source: 'landing_page',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: 'contacted',
      score: 72,
      processed: false
    },
    {
      id: '3',
      name: 'Emily Roberts',
      email: 'emily.roberts@example.com',
      message: 'I would like to schedule a demo of your product.',
      source: 'newsletter',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'qualified',
      score: 91,
      processed: true
    },
    {
      id: '4',
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '(555) 567-8901',
      message: 'Looking for a solution for my e-commerce store.',
      source: 'webinar',
      date: new Date(Date.now() - 1000 * 60 * 60 * 36),
      status: 'unqualified',
      score: 45,
      processed: true
    },
    {
      id: '5',
      name: 'Jessica Williams',
      email: 'jessica.williams@example.com',
      phone: '(555) 234-5678',
      message: 'I need help integrating your API with my website.',
      source: 'contact_form',
      date: new Date(Date.now() - 1000 * 60 * 30),
      status: 'new',
      score: 88,
      processed: false
    }
  ]);

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    source: 'manual_entry'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };

  const handleSourceChange = (value: string) => {
    setNewLead(prev => ({ ...prev, source: value }));
  };

  const handleAddNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!newLead.name || !newLead.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    const lead: WebLead = {
      id: `ld${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || undefined,
      message: newLead.message,
      source: newLead.source,
      date: new Date(),
      status: 'new',
      score: Math.floor(Math.random() * 30) + 60,
      processed: false
    };
    
    setLeads(prev => [lead, ...prev]);
    
    setNewLead({
      name: '',
      email: '',
      phone: '',
      message: '',
      source: 'manual_entry'
    });
    
    toast({
      title: "Lead added",
      description: "New lead has been added successfully"
    });
    
    setIsSubmitting(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Leads refreshed",
        description: "Successfully checked for new leads"
      });
    }, 1000);
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied to clipboard",
      description: "The form embed code has been copied"
    });
  };

  const handleStatusChange = (leadId: string, newStatus: WebLead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    
    toast({
      title: "Lead status updated",
      description: `Lead has been marked as ${newStatus}`
    });
  };

  const convertToContact = useCallback((lead: WebLead) => {
    addContact({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: '',
      type: 'lead',
      status: 'new',
      tags: [lead.source],
      lastContactDate: new Date().toISOString().split('T')[0],
      notes: lead.message
    });
    
    setLeads(leads.map(l => 
      l.id === lead.id ? { ...l, processed: true } : l
    ));
    
    toast({
      title: "Lead converted",
      description: `${lead.name} has been added to your contacts`
    });
  }, [addContact, leads]);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Lead management settings have been updated"
      });
    }, 800);
  };

  const handleDownloadLeads = () => {
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Date', 'Status', 'Score'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone || '',
        lead.source,
        lead.date.toISOString().split('T')[0],
        lead.status,
        lead.score
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `web_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Leads exported",
      description: "CSV file has been downloaded successfully"
    });
  };

  const handleTestWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Testing webhook",
      description: "Sending test payload to webhook URL"
    });
    
    setTimeout(() => {
      toast({
        title: "Webhook test completed",
        description: "Test payload was sent successfully"
      });
    }, 1000);
  };

  const filteredLeads = leadsFilter 
    ? leads.filter(lead => lead.status === leadsFilter)
    : leads;

  const getStatusBadge = (status: WebLead['status']) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'contacted':
        return <Badge className="bg-amber-100 text-amber-800">Contacted</Badge>;
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
      case 'unqualified':
        return <Badge className="bg-red-100 text-red-800">Unqualified</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hours ago`;
    
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} days ago`;
  };

  const handleEmbedCodeChange = (code: string) => {
    setEmbedCode(code);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Web Lead Capture</h2>
          <p className="text-muted-foreground">
            Capture and manage leads from your website
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadLeads}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Select value={leadsFilter || "all"} onValueChange={(value) => setLeadsFilter(value === "all" ? null : value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="unqualified">Unqualified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Captured Leads
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Setup & Integration
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Lead Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Source</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    {scoringEnabled && <TableHead className="hidden md:table-cell">Score</TableHead>}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={scoringEnabled ? 7 : 6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Globe className="h-10 w-10 mb-2" />
                          <p>No leads found</p>
                          <p className="text-sm">Set up web forms to start capturing leads</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map(lead => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">{lead.message.substring(0, 30)}...</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{lead.email}</div>
                          {lead.phone && <div className="text-sm">{lead.phone}</div>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="capitalize">
                            {lead.source.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">{formatRelativeTime(lead.date)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(lead.status)}
                        </TableCell>
                        {scoringEnabled && (
                          <TableCell className="hidden md:table-cell">
                            <div className={`text-sm font-medium ${
                              (lead.score || 0) >= 80 ? 'text-green-600' : 
                              (lead.score || 0) >= 60 ? 'text-amber-600' : 
                              'text-red-600'
                            }`}>
                              {lead.score || 0}%
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select 
                              defaultValue={lead.status}
                              onValueChange={(value) => handleStatusChange(lead.id, value as WebLead['status'])}
                            >
                              <SelectTrigger className="h-8 w-[110px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="unqualified">Unqualified</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => convertToContact(lead)}
                              disabled={lead.processed}
                              className="h-8"
                            >
                              {lead.processed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <span>Convert</span>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Lead</CardTitle>
              <CardDescription>
                Manually add a lead to your CRM system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNewLead} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newLead.name} 
                      onChange={handleInputChange} 
                      placeholder="Jane Doe" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={newLead.email} 
                      onChange={handleInputChange} 
                      placeholder="jane@example.com" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={newLead.phone} 
                      onChange={handleInputChange} 
                      placeholder="(555) 123-4567" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="source">Lead Source</Label>
                    <Select 
                      value={newLead.source} 
                      onValueChange={handleSourceChange}
                    >
                      <SelectTrigger id="source">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual_entry">Manual Entry</SelectItem>
                        <SelectItem value="phone_call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="trade_show">Trade Show</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="social_media">Social Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message/Notes</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={newLead.message} 
                    onChange={handleInputChange} 
                    placeholder="Additional details about this lead..." 
                    rows={4} 
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Lead
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Website Form Builder</CardTitle>
                <CardDescription>
                  Create and customize your lead capture form for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebLeadCaptureFormEditor 
                  initialCode={embedCode}
                  onCodeChange={handleEmbedCodeChange}
                  onCopyCode={handleCopyEmbedCode}
                  webhookUrl={webhookUrl || "https://yourwebsite.com/api/leads"}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Webhooks & API Integration</CardTitle>
                <CardDescription>
                  Connect your website forms or third-party services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <div className="relative">
                      <Input
                        id="webhook"
                        placeholder="https://your-site.com/api/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full"
                        disabled={!webhookUrl}
                        onClick={handleTestWebhook}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-md bg-muted/50">
                    <h4 className="text-sm font-medium mb-2">Available Integrations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                            <MessageSquare className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <span className="text-sm">Contact Form</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                            <MessageSquare className="h-3 w-3" />
                          </div>
                          <span className="text-sm">Landing Pages</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">Configure</Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                            <MessageSquare className="h-3 w-3" />
                          </div>
                          <span className="text-sm">Live Chat</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Management Settings</CardTitle>
              <CardDescription>
                Configure how leads are processed and managed in your CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Lead Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new leads are captured
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-assign Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign new leads to team members
                    </p>
                  </div>
                  <Switch
                    checked={autoAssignEnabled}
                    onCheckedChange={setAutoAssignEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Lead Scoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically score leads based on engagement and information
                    </p>
                  </div>
                  <Switch
                    checked={scoringEnabled}
                    onCheckedChange={setScoringEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-base">Lead Follow-up Schedule</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Initial follow-up</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Immediately</SelectItem>
                          <SelectItem value="1">Within 1 hour</SelectItem>
                          <SelectItem value="24">Within 24 hours</SelectItem>
                          <SelectItem value="48">Within 48 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Secondary follow-up</Label>
                      <Select defaultValue="72">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">After 24 hours</SelectItem>
                          <SelectItem value="48">After 48 hours</SelectItem>
                          <SelectItem value="72">After 3 days</SelectItem>
                          <SelectItem value="168">After 1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lead Sources</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Source
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 w-24 justify-center">34 leads</Badge>
                    <span>Contact Form</span>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800 w-24 justify-center">18 leads</Badge>
                    <span>Landing Page</span>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 w-24 justify-center">7 leads</Badge>
                    <span>Newsletter</span>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 w-24 justify-center">5 leads</Badge>
                    <span>Webinar</span>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebLeadCapture;
