
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Bell, 
  Shield, 
  Database, 
  Save
} from 'lucide-react';

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader 
              title="Settings" 
              description="Manage your account settings and preferences"
            >
              <Button onClick={handleSaveSettings}>
                <Save size={14} className="mr-1.5" />
                Save Changes
              </Button>
            </PageHeader>
            
            <Tabs defaultValue="account" className="mb-6 animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full sm:w-48 shrink-0">
                  <TabsList className="flex flex-row sm:flex-col h-auto p-0 bg-transparent space-x-2 sm:space-x-0 sm:space-y-1">
                    <TabsTrigger value="account" className="w-full justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                      <User size={16} className="mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="company" className="w-full justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                      <Building size={16} className="mr-2" />
                      Company
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                      <Bell size={16} className="mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="w-full justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                      <Shield size={16} className="mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="data" className="w-full justify-start px-3 py-2 h-9 data-[state=active]:bg-muted">
                      <Database size={16} className="mr-2" />
                      Data Management
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1">
                  <TabsContent value="account" className="p-0 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Manage your personal information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" defaultValue="Alex Johnson" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="example@email.com" defaultValue="alex@freshfarm.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 123-4567" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" placeholder="Manager" defaultValue="Operations Manager" />
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Preferences</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Language</Label>
                                <p className="text-sm text-muted-foreground">Select your preferred language</p>
                              </div>
                              <div className="w-24">
                                <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                                  <option value="en">English</option>
                                  <option value="es">Spanish</option>
                                  <option value="fr">French</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="font-medium">Time Zone</Label>
                                <p className="text-sm text-muted-foreground">Set your local time zone</p>
                              </div>
                              <div className="w-24">
                                <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                                  <option value="utc-8">UTC-8</option>
                                  <option value="utc-5">UTC-5</option>
                                  <option value="utc+0">UTC+0</option>
                                  <option value="utc+1">UTC+1</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="company" className="p-0 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>Manage your company information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" placeholder="Company Name" defaultValue="Fresh Farm Produce" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="business-type">Business Type</Label>
                            <Input id="business-type" placeholder="LLC, Corporation, etc." defaultValue="LLC" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tax-id">Tax ID / EIN</Label>
                            <Input id="tax-id" placeholder="XX-XXXXXXX" defaultValue="12-3456789" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" placeholder="https://example.com" defaultValue="https://freshfarmproduce.com" />
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Location</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="address">Address</Label>
                              <Input id="address" placeholder="Street Address" defaultValue="123 Harvest Road" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input id="city" placeholder="City" defaultValue="Farmington" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State / Province</Label>
                              <Input id="state" placeholder="State" defaultValue="California" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zip">ZIP / Postal Code</Label>
                              <Input id="zip" placeholder="ZIP Code" defaultValue="95123" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input id="country" placeholder="Country" defaultValue="United States" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="p-0 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>Control how you receive notifications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <h3 className="text-base font-medium">Notification Types</h3>
                            
                            <div className="flex items-start justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Order Updates</Label>
                                <p className="text-sm text-muted-foreground">Notifications about new orders and status changes</p>
                              </div>
                              <Switch defaultChecked={true} />
                            </div>
                            
                            <div className="flex items-start justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Inventory Alerts</Label>
                                <p className="text-sm text-muted-foreground">Get alerted when inventory items are low or out of stock</p>
                              </div>
                              <Switch defaultChecked={true} />
                            </div>
                            
                            <div className="flex items-start justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Client Activity</Label>
                                <p className="text-sm text-muted-foreground">Updates about client registrations and interactions</p>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                            
                            <div className="flex items-start justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">System Notifications</Label>
                                <p className="text-sm text-muted-foreground">Notifications about system updates and maintenance</p>
                              </div>
                              <Switch defaultChecked={true} />
                            </div>
                            
                            <div className="flex items-start justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Marketing Updates</Label>
                                <p className="text-sm text-muted-foreground">Receive information about new features and promotions</p>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security" className="p-0 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Manage your account security preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="text-base font-medium">Change Password</h3>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirm New Password</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                            <Button className="w-full sm:w-auto">Update Password</Button>
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">Enable 2FA</Label>
                              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-base font-medium">Session Management</h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">Active Sessions</Label>
                              <p className="text-sm text-muted-foreground">You're currently signed in on 2 devices</p>
                            </div>
                            <Button variant="outline">Manage Sessions</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="data" className="p-0 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                        <CardDescription>Control how your data is stored and used</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="text-base font-medium">Data Export</h3>
                          <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                          <div className="flex gap-2">
                            <Button variant="outline">Export Inventory Data</Button>
                            <Button variant="outline">Export Client Data</Button>
                            <Button variant="outline">Export Orders</Button>
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-base font-medium">Data Retention</h3>
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">Automatic Data Cleanup</Label>
                              <p className="text-sm text-muted-foreground">Automatically remove old records after specified period</p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="order-retention">Order History</Label>
                              <select id="order-retention" className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                                <option value="forever">Keep Forever</option>
                                <option value="7-years">7 Years</option>
                                <option value="5-years">5 Years</option>
                                <option value="3-years">3 Years</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="inventory-retention">Inventory Logs</Label>
                              <select id="inventory-retention" className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                                <option value="forever">Keep Forever</option>
                                <option value="5-years">5 Years</option>
                                <option value="3-years">3 Years</option>
                                <option value="1-year">1 Year</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="activity-retention">Activity Logs</Label>
                              <select id="activity-retention" className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                                <option value="1-year">1 Year</option>
                                <option value="6-months">6 Months</option>
                                <option value="3-months">3 Months</option>
                                <option value="1-month">1 Month</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-base font-medium text-destructive">Danger Zone</h3>
                          <div className="flex items-center justify-between bg-destructive/10 p-3 rounded-md">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">Delete Account Data</Label>
                              <p className="text-sm text-muted-foreground">Permanently delete all account data</p>
                            </div>
                            <Button variant="destructive">Delete Data</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
