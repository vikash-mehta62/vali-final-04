
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import OrdersTable from '@/components/orders/OrdersTable';
import OrderManagementTabs from '@/components/orders/OrderManagementTabs';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, FileText, Receipt } from 'lucide-react';
import { getAllOrderAPI } from "@/services2/operations/order";
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Loader2 } from "lucide-react";

const Orders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const [loading, setLoading] = useState(false); // Step 1

  const fetchOrders = async () => {
    setLoading(true); // Step 2
    try {
      const res = await getAllOrderAPI(token);
      console.log(res);

      const formattedOrders = res.map(order => ({
        id: order?.orderNumber || `#${order._id.toString().slice(-5)}`,
        date: new Date(order.createdAt).toLocaleDateString(),
        clientName: order.store?.storeName || "Unknown",
        ...order
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); // Step 3
    }
  };
  useEffect(() => {


    fetchOrders(); // Call the function
  }, [token]);


  const deleteOrderById = async (idToDelete: string) => {
    try {
      // Backend API call to delete order

      // Frontend state se bhi order hata do
      setOrders(prevOrders => prevOrders.filter(order => order._id !== idToDelete));

      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };


  const updateOrderPaymentStatus = async (orderId: string, paymentMethod: any) => {
    try {
      // Backend API call to update paymentStatus

      console.log(paymentMethod)
      // Frontend state mein bhi update karo
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, paymentStatus: "paid", paymentDetails: paymentMethod } : order
        )
      );

      console.log("Payment status updated to paid");
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };



  const handleNewOrder = () => {
    navigate('/orders/new');
  };

  return (
    <div className="flex  overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container max-w-full px-4 py-4">
            <PageHeader
              title="Order Management"
              description="Manage orders, generate invoices, and track shipments"
            >
              {user.role === "admin" && <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleNewOrder}>
                  <Plus size={16} className="mr-2" />
                  New Order
                </Button>

              </div>}
            </PageHeader>

            <Tabs defaultValue="orders" className="mt-6">
              {user.role === "admin" && <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
                <TabsTrigger value="orders" className="flex items-center">
                  <FileText size={16} className="mr-2" />
                  Orders List
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center">
                  <Receipt size={16} className="mr-2" />
                  Advanced Management
                </TabsTrigger>
              </TabsList>}

              <TabsContent value="orders">
                {
                  <div className="p-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                      </div>
                    ) : (

                      <OrdersTable orders={orders} fetchOrders={fetchOrders} onDelete={deleteOrderById} onPayment={updateOrderPaymentStatus} />
                    )}
                  </div>
                }
              </TabsContent>

              <TabsContent value="advanced">
                <OrderManagementTabs />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
