
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PageHeader from "@/components/shared/PageHeader";
import StoreDashboardTabs from "@/components/store/StoreDashboardTabs";
import { Store, ShoppingBag, Users, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { getAllOrderAPI } from "@/services2/operations/order";

const StoreDashboard = () => {
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrderAPI(token);
        // Filter orders that belong to this store if needed
        setOrders(res);
        setOrderCount(res.length);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load order data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, toast]);

  return (
    <div className="flex h-screen overflow-">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1  bg-muted/30 overflow-y-scroll">
          <div className="page-container max-w-full px-4 py-4">
            <PageHeader 
              title={`Welcome ${user?.storeName || "to Store Dashboard"}`} 
              description="Manage your store, orders, and inventory"
              icon={<Store className="h-6 w-6 text-primary" />}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => toast({ title: "Settings", description: "Settings page functionality coming soon" })}>
                  <Settings size={16} className="mr-2" />
                  Store Settings
                </Button>
              </div>
            </PageHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <h3 className="text-2xl font-bold">{loading ? "..." : orderCount}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customers</p>
                      <h3 className="text-2xl font-bold">24</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Products</p>
                      <h3 className="text-2xl font-bold">48</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <StoreDashboardTabs />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StoreDashboard;
