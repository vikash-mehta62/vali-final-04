
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Lightbulb, TrendingUp, ShieldCheck, Database, BarChart3, Check, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Store = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePurchase = (plan: string) => {
    toast({
      title: "Upgrade Requested",
      description: `Your request to upgrade to ${plan} has been sent. This is a demo feature.`,
    });
  };

  const handleGoToDashboard = () => {
    navigate('/store/dashboard');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader 
              title="Upgrade Your Experience" 
              description="Choose the right plan for your business needs"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleGoToDashboard}>
                  Store Dashboard
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </PageHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Free Plan */}
              <Card className="border-muted">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Free</CardTitle>
                      <CardDescription>Basic features for small businesses</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-muted/50">Current Plan</Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Basic inventory management</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Simple order tracking</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Customer management</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <Check size={18} className="mr-2 opacity-30" />
                      <span>Limited AI insights (3/month)</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                </CardFooter>
              </Card>
              
              {/* Pro Plan */}
              <Card className="border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-md">
                  POPULAR
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Pro</CardTitle>
                      <CardDescription>Advanced features for growing businesses</CardDescription>
                    </div>
                    <Zap size={22} className="text-primary" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Advanced inventory forecasting</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Full AI insights</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Advanced analytics dashboards</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Route optimization</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handlePurchase("Pro")}>Upgrade to Pro</Button>
                </CardFooter>
              </Card>
              
              {/* Enterprise Plan */}
              <Card className="border-muted">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Enterprise</CardTitle>
                      <CardDescription>Custom solutions for large operations</CardDescription>
                    </div>
                    <ShieldCheck size={22} className="text-blue-600" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$199</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Dedicated support team</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Advanced security features</span>
                    </li>
                    <li className="flex items-center">
                      <Check size={18} className="mr-2 text-green-500" />
                      <span>Unlimited users</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => handlePurchase("Enterprise")}>Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Compare Features</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Advanced Analytics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Access detailed insights about your business performance with customizable dashboards and real-time data.
                    </p>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-sm font-medium text-primary mb-1">Pro Feature</p>
                      <p className="text-xs text-muted-foreground">Get deep insights into customer behavior, inventory trends, and sales patterns.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Let our AI analyze your business data and provide actionable recommendations to increase efficiency.
                    </p>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-sm font-medium text-primary mb-1">Pro Feature</p>
                      <p className="text-xs text-muted-foreground">Unlimited AI insights to help optimize inventory, predict sales, and improve customer satisfaction.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Advanced Data Storage</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Increased data storage and retention for comprehensive historical analysis and reporting.
                    </p>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-sm font-medium text-primary mb-1">Pro Feature</p>
                      <p className="text-xs text-muted-foreground">Store up to 5 years of historical data and access advanced reporting capabilities.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Store;
