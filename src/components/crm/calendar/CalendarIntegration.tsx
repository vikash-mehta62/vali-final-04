
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  RefreshCw, 
  Download, 
  Upload, 
  Link, 
  Settings,
  AlertCircle
} from 'lucide-react';
import { 
  calendarProviders, 
  CalendarProvider, 
  CalendarIntegrationConfig, 
  defaultCalendarConfig
} from '@/utils/email';

interface CalendarIntegrationProps {
  webhookUrl?: string;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ webhookUrl }) => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string>(defaultCalendarConfig.provider);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncFrequency, setSyncFrequency] = useState<string>(defaultCalendarConfig.syncFrequency);
  const [exportEvents, setExportEvents] = useState<boolean>(defaultCalendarConfig.exportEvents);
  const [importEvents, setImportEvents] = useState<boolean>(defaultCalendarConfig.importEvents);
  const [icalUrl, setIcalUrl] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);

  const getProviderById = (id: string): CalendarProvider | undefined => {
    return calendarProviders.find(provider => provider.id === id);
  };

  const handleAuthorize = () => {
    const provider = getProviderById(selectedProvider);
    
    if (!provider) {
      toast({
        title: "Provider not found",
        description: "The selected calendar provider could not be found.",
        variant: "destructive",
      });
      return;
    }
    
    if (provider.id === 'custom') {
      // For custom iCal, we just need the URL
      if (!icalUrl) {
        toast({
          title: "iCal URL required",
          description: "Please enter a valid iCal URL to connect to your calendar.",
          variant: "destructive",
        });
        return;
      }
      
      setIsAuthorizing(true);
      
      // Simulate testing the iCal URL
      setTimeout(() => {
        setIsAuthorized(true);
        setIsAuthorizing(false);
        setLastSynced(new Date());
        
        toast({
          title: "Calendar Connected",
          description: `Successfully connected to your custom iCal calendar.`,
        });
      }, 1500);
      
      return;
    }
    
    // For OAuth-based providers
    setIsAuthorizing(true);
    
    // Simulate OAuth flow
    // In a real implementation, we would redirect to the provider's auth URL
    setTimeout(() => {
      // Simulate successful authorization
      setIsAuthorized(true);
      setIsAuthorizing(false);
      setLastSynced(new Date());
      
      toast({
        title: "Calendar Connected",
        description: `Successfully connected to ${provider.name}.`,
      });
    }, 2000);
  };
  
  const handleDisconnect = () => {
    setIsAuthorized(false);
    setLastSynced(null);
    
    toast({
      title: "Calendar Disconnected",
      description: `Successfully disconnected from the calendar service.`,
    });
  };
  
  const handleSync = () => {
    if (!isAuthorized) {
      toast({
        title: "Not Connected",
        description: "Please connect to a calendar service before syncing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date());
      
      toast({
        title: "Sync Complete",
        description: `Calendar events successfully synchronized.`,
      });
    }, 2000);
  };
  
  const handleSaveSyncSettings = () => {
    // In a real implementation, we would save these settings to the backend
    toast({
      title: "Settings Saved",
      description: "Your calendar synchronization settings have been updated.",
    });
  };
  
  const handleTestConnection = () => {
    if (!icalUrl) {
      toast({
        title: "iCal URL required",
        description: "Please enter a valid iCal URL to test the connection.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTestingConnection(true);
    
    // Simulate testing the connection
    setTimeout(() => {
      setIsTestingConnection(false);
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the iCal feed.",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your calendar to sync events with third-party calendar services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connect">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <div className="space-y-4">
              <div>
                <Label htmlFor="calendar-provider">Calendar Provider</Label>
                <Select 
                  value={selectedProvider} 
                  onValueChange={setSelectedProvider}
                  disabled={isAuthorized}
                >
                  <SelectTrigger id="calendar-provider">
                    <SelectValue placeholder="Select a calendar provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendarProviders.map(provider => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center">
                          <div 
                            className="h-3 w-3 rounded-full mr-2" 
                            style={{ backgroundColor: provider.color }}
                          />
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProvider === 'custom' && (
                <div>
                  <Label htmlFor="ical-url">iCal/ICS URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      id="ical-url" 
                      value={icalUrl} 
                      onChange={(e) => setIcalUrl(e.target.value)}
                      placeholder="https://example.com/calendar.ics"
                      disabled={isAuthorized}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={isAuthorized || isTestingConnection || !icalUrl}
                    >
                      {isTestingConnection ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the URL of your calendar's iCal or ICS feed
                  </p>
                </div>
              )}
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Connection Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {isAuthorized 
                        ? `Connected to ${getProviderById(selectedProvider)?.name || 'calendar service'}`
                        : 'Not connected to any calendar service'
                      }
                    </p>
                    {lastSynced && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last synced: {lastSynced.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={isAuthorized ? "default" : "outline"}>
                    {isAuthorized ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between">
                {isAuthorized ? (
                  <>
                    <Button 
                      variant="destructive"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                    <Button 
                      onClick={handleSync}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleAuthorize}
                    disabled={isAuthorizing}
                    className="w-full"
                  >
                    {isAuthorizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Connect to {getProviderById(selectedProvider)?.name || 'Calendar'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                  <p className="text-sm text-muted-foreground">
                    How often to synchronize with your calendar
                  </p>
                </div>
                <Select 
                  value={syncFrequency} 
                  onValueChange={setSyncFrequency}
                >
                  <SelectTrigger id="sync-frequency" className="w-40">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="realtime">Real-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="export-events">Export Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Export CRM events to your calendar
                  </p>
                </div>
                <Switch 
                  id="export-events" 
                  checked={exportEvents} 
                  onCheckedChange={setExportEvents}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="import-events">Import Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Import events from your calendar to CRM
                  </p>
                </div>
                <Switch 
                  id="import-events" 
                  checked={importEvents} 
                  onCheckedChange={setImportEvents}
                />
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSyncSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" className="w-48">
                  <Download className="h-4 w-4 mr-2" />
                  Export Calendar
                </Button>
                <Button variant="outline" className="w-48">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Calendar
                </Button>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <h3 className="font-medium">Advanced Settings</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  These settings are for advanced users. Changing these settings can affect how your calendar syncs with third-party services.
                </p>
              </div>
              
              <div>
                <Label htmlFor="webhook-url">Calendar Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  value={webhookUrl || ''} 
                  readOnly
                  placeholder="No webhook URL configured"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use this URL to receive real-time calendar updates from external services
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Configuration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
