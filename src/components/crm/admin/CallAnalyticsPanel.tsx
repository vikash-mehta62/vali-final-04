
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Phone,
  X,
  CheckCircle,
  Calendar,
  Clock,
  User,
  RefreshCw,
  Download,
  Search,
  Filter,
  BarChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock call data
const callsData = [
  {
    id: 'call1',
    agent: 'John Smith',
    client: 'Sarah Miller',
    duration: '5:23',
    date: '2023-07-12',
    time: '10:30 AM',
    status: 'completed',
    notes: 'Discussed pricing options for enterprise plan',
    outcome: 'positive',
    type: 'outbound'
  },
  {
    id: 'call2',
    agent: 'Lisa Johnson',
    client: 'Robert Chen',
    duration: '3:12',
    date: '2023-07-12',
    time: '11:45 AM',
    status: 'completed',
    notes: 'Client had questions about delivery timeframes',
    outcome: 'neutral',
    type: 'inbound'
  },
  {
    id: 'call3',
    agent: 'Michael Wong',
    client: 'Emily Davis',
    duration: '7:05',
    date: '2023-07-11',
    time: '2:15 PM',
    status: 'completed',
    notes: 'Product demonstration and feature explanation',
    outcome: 'positive',
    type: 'outbound'
  },
  {
    id: 'call4',
    agent: 'Sarah Johnson',
    client: 'Thomas Wilson',
    duration: '2:30',
    date: '2023-07-11',
    time: '9:20 AM',
    status: 'completed',
    notes: 'Client complained about shipping delay',
    outcome: 'negative',
    type: 'inbound'
  },
  {
    id: 'call5',
    agent: 'John Smith',
    client: 'Jessica Williams',
    duration: '4:15',
    date: '2023-07-10',
    time: '3:45 PM',
    status: 'completed',
    notes: 'Follow-up call to discuss implementation',
    outcome: 'positive',
    type: 'outbound'
  },
  {
    id: 'call6',
    agent: 'Lisa Johnson',
    client: 'Alex Martinez',
    duration: '1:50',
    date: '2023-07-10',
    time: '10:10 AM',
    status: 'completed',
    notes: 'Quick call about invoice payment',
    outcome: 'neutral',
    type: 'inbound'
  }
];

const CallAnalyticsPanel: React.FC = () => {
  const [calls, setCalls] = useState(callsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Call analytics stats
  const totalCalls = calls.length;
  const totalDuration = calls.reduce((total, call) => {
    const [minutes, seconds] = call.duration.split(':').map(Number);
    return total + (minutes * 60) + seconds;
  }, 0);
  
  const averageDuration = Math.floor(totalDuration / totalCalls);
  const averageMins = Math.floor(averageDuration / 60);
  const averageSecs = averageDuration % 60;
  
  const positiveOutcomes = calls.filter(call => call.outcome === 'positive').length;
  const positivePercentage = Math.round((positiveOutcomes / totalCalls) * 100);
  
  const inboundCalls = calls.filter(call => call.type === 'inbound').length;
  const outboundCalls = calls.filter(call => call.type === 'outbound').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Call data refreshed",
        description: "Call analytics have been updated"
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Call analytics data is being exported"
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setOutcomeFilter('all');
    setTypeFilter('all');
  };

  // Apply filters to calls data
  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = dateFilter === 'all' || call.date === dateFilter;
    const matchesOutcome = outcomeFilter === 'all' || call.outcome === outcomeFilter;
    const matchesType = typeFilter === 'all' || call.type === typeFilter;
    
    return matchesSearch && matchesDate && matchesOutcome && matchesType;
  });

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case 'neutral':
        return <Badge className="bg-blue-100 text-blue-800">Neutral</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getCallTypeBadge = (type: string) => {
    switch (type) {
      case 'inbound':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-blue-300">
            <ArrowDownRight className="h-3 w-3 text-blue-500" />
            Inbound
          </Badge>
        );
      case 'outbound':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-emerald-300">
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            Outbound
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMins}:{averageSecs < 10 ? `0${averageSecs}` : averageSecs}</div>
            <p className="text-xs text-muted-foreground mt-1">Minutes:Seconds</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Positive Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positivePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">{positiveOutcomes} of {totalCalls} calls</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Call Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              <ArrowDownRight className="h-4 w-4 text-blue-500" />
              {inboundCalls}
              <span className="mx-1 text-muted-foreground">/</span>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              {outboundCalls}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Inbound / Outbound</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Call History & Analytics</CardTitle>
            <div className="flex gap-2">
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
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <CardDescription>
            View and analyze call data from your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select 
                value={dateFilter} 
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2023-07-12">Today</SelectItem>
                  <SelectItem value="2023-07-11">Yesterday</SelectItem>
                  <SelectItem value="2023-07-10">2 Days Ago</SelectItem>
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
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Call Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleClearFilters}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No calls found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{call.agent}</span>
                        </div>
                      </TableCell>
                      <TableCell>{call.client}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{call.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{call.time}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{call.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCallTypeBadge(call.type)}
                      </TableCell>
                      <TableCell>
                        {getOutcomeBadge(call.outcome)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {call.notes}
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

export default CallAnalyticsPanel;
