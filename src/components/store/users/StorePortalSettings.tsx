
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  ShieldCheck, 
  Globe, 
  Clock, 
  BookOpen, 
  RefreshCw, 
  ExternalLink, 
  LinkIcon, 
  Save 
} from 'lucide-react';

const StorePortalSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    portalEnabled: true,
    customDomain: false,
    domainName: '',
    sessionTimeout: 60,
    priceListsVisible: true,
    orderHistoryVisible: true,
    multipleUserSessions: false,
    autoRefreshLists: true,
    requirePasswordChange: true
  });

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings saved",
      description: "Portal settings have been updated successfully."
    });
  };

  const handleGeneratePreviewLink = () => {
    toast({
      title: "Preview link generated",
      description: "A preview link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Portal Configuration
          </CardTitle>
          <CardDescription>
            Configure how the store portal works and what features are available to users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="portalEnabled" className="flex flex-col space-y-1">
              <span>Enable Store Portal</span>
              <span className="font-normal text-sm text-muted-foreground">
                Turn the entire portal on or off for all stores
              </span>
            </Label>
            <Switch
              id="portalEnabled"
              checked={settings.portalEnabled}
              onCheckedChange={(checked) => handleSwitchChange('portalEnabled', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domain Settings
            </h3>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="customDomain" className="flex flex-col space-y-1">
                <span>Use Custom Domain</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow stores to access the portal via custom domain
                </span>
              </Label>
              <Switch
                id="customDomain"
                checked={settings.customDomain}
                onCheckedChange={(checked) => handleSwitchChange('customDomain', checked)}
              />
            </div>
            
            {settings.customDomain && (
              <div className="space-y-2">
                <Label htmlFor="domainName">Domain Name</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="domainName"
                    name="domainName"
                    placeholder="portal.yourdomain.com"
                    value={settings.domainName}
                    onChange={handleInputChange}
                  />
                  <Button variant="outline" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stores will access the portal at [store-id].{settings.domainName || 'portal.yourdomain.com'}
                </p>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Security Settings
            </h3>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sessionTimeout" className="flex flex-col space-y-1">
                <span>Session Timeout (minutes)</span>
                <span className="font-normal text-sm text-muted-foreground">
                  How long until inactive users are logged out
                </span>
              </Label>
              <Input
                id="sessionTimeout"
                name="sessionTimeout"
                type="number"
                min={5}
                max={240}
                className="w-20"
                value={settings.sessionTimeout}
                onChange={handleNumberInputChange}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="multipleUserSessions" className="flex flex-col space-y-1">
                <span>Allow Multiple Sessions</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow users to be logged in from multiple devices
                </span>
              </Label>
              <Switch
                id="multipleUserSessions"
                checked={settings.multipleUserSessions}
                onCheckedChange={(checked) => handleSwitchChange('multipleUserSessions', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="requirePasswordChange" className="flex flex-col space-y-1">
                <span>Require Password Change</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Force new users to change their password on first login
                </span>
              </Label>
              <Switch
                id="requirePasswordChange"
                checked={settings.requirePasswordChange}
                onCheckedChange={(checked) => handleSwitchChange('requirePasswordChange', checked)}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Content Settings
            </h3>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="priceListsVisible" className="flex flex-col space-y-1">
                <span>Price Lists Visible</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow stores to see their price lists in the portal
                </span>
              </Label>
              <Switch
                id="priceListsVisible"
                checked={settings.priceListsVisible}
                onCheckedChange={(checked) => handleSwitchChange('priceListsVisible', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="orderHistoryVisible" className="flex flex-col space-y-1">
                <span>Order History Visible</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow stores to see their order history in the portal
                </span>
              </Label>
              <Switch
                id="orderHistoryVisible"
                checked={settings.orderHistoryVisible}
                onCheckedChange={(checked) => handleSwitchChange('orderHistoryVisible', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="autoRefreshLists" className="flex flex-col space-y-1">
                <span>Auto-refresh Content</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Automatically refresh price lists and orders data
                </span>
              </Label>
              <Switch
                id="autoRefreshLists"
                checked={settings.autoRefreshLists}
                onCheckedChange={(checked) => handleSwitchChange('autoRefreshLists', checked)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleGeneratePreviewLink}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Generate Preview Link
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Portal Activity
          </CardTitle>
          <CardDescription>
            View recent activity in the store portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-8 rounded-lg text-center">
            <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Activity Monitoring</h3>
            <p className="text-muted-foreground">
              Portal activity monitoring will be implemented in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorePortalSettings;
