
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  TrendingUp,
  Box,
  AlertTriangle,
  ArrowRight,
  Package,
  DollarSign,
  Truck,
  LineChart,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AiInsights from '@/components/ai/AiInsights';
import { useNavigate } from 'react-router-dom';

// Import data and functions
import { 
  getRecentOrders, 
  getOrderCountByStatus, 
  getTotalInventoryValue,
  getLowStockProducts,
  aiInsights
} from '@/lib/data';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // This is a mock effect to simulate real-time notification
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "New Order Received",
        description: "Order #ORD-2023-089 was just placed by City Market",
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  const recentOrders = getRecentOrders();
  const orderCounts = getOrderCountByStatus();
  const inventoryValue = getTotalInventoryValue();
  const lowStockItems = getLowStockProducts();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container max-w-full px-4 py-4">
            <PageHeader 
              title="Dashboard" 
              description="Overview of your business performance"
              icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
            >
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/insights')}>
                  <LineChart size={16} className="mr-2" />
                  View Reports
                </Button>
              </div>
            </PageHeader>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <Box className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-green-600">+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold">{inventoryValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</h3>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-green-100 rounded-md">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-600">+5%</span>
                  </div>
                  <h3 className="text-2xl font-bold">$24,782</h3>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-100 rounded-md">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-green-600">+8%</span>
                  </div>
                  <h3 className="text-2xl font-bold">32</h3>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-amber-100 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-red-600">+2</span>
                  </div>
                  <h3 className="text-2xl font-bold">{lowStockItems.length}</h3>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pending Orders</span>
                        <span className="font-medium">{orderCounts.pending}</span>
                      </div>
                      <Progress value={orderCounts.pending * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Processing</span>
                        <span className="font-medium">{orderCounts.processing}</span>
                      </div>
                      <Progress value={orderCounts.processing * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Shipped</span>
                        <span className="font-medium">{orderCounts.shipped}</span>
                      </div>
                      <Progress value={orderCounts.shipped * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Delivered</span>
                        <span className="font-medium">{orderCounts.delivered}</span>
                      </div>
                      <Progress value={orderCounts.delivered * 10} className="h-2" />
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/orders')}>
                      <Truck size={16} className="mr-2" />
                      Manage Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">Order #{order.orderId}</p>
                          <p className="text-sm text-muted-foreground">{order.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/orders')}>
                      <DollarSign size={16} className="mr-2" />
                      View All Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">AI Insights</h2>
                <Button variant="link" size="sm" className="text-primary flex items-center" onClick={() => navigate('/insights')}>
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div><AiInsights insights={aiInsights} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
