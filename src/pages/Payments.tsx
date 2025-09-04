
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Building, Receipt, FileText, Plus, BadgeDollarSign, Wallet, CheckSquare, Filter } from 'lucide-react';
import PaymentsOverview from '@/components/payments/PaymentsOverview';
import PaymentHistory from '@/components/payments/PaymentHistory';
import PaymentMethods from '@/components/payments/PaymentMethods';
import PaymentInvoices from '@/components/payments/PaymentInvoices';
import { orders } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [isBatchPaymentOpen, setIsBatchPaymentOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [batchSearchTerm, setBatchSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewPayment = () => {
    setIsNewPaymentOpen(true);
  };

  const handleBatchPayment = () => {
    setIsBatchPaymentOpen(true);
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (order.clientName && order.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const batchFilteredOrders = orders.filter(order => 
    (order.id.toLowerCase().includes(batchSearchTerm.toLowerCase()) || 
    (order.clientName && order.clientName.toLowerCase().includes(batchSearchTerm.toLowerCase()))) &&
    order.status !== 'cancelled'
  );

  const handleProcessPayment = () => {
    if (!selectedOrderId) {
      toast({
        title: "Order Required",
        description: "Please select an order to process payment for.",
        variant: "destructive"
      });
      return;
    }
    
    setIsNewPaymentOpen(false);
    navigate(`/payments/new?orderId=${selectedOrderId}`);
  };

  const handleProcessBatchPayment = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Orders Required",
        description: "Please select at least one order to process.",
        variant: "destructive"
      });
      return;
    }
    
    setIsBatchPaymentOpen(false);
    
    // In a real app, we would process the batch payment through an API
    // For now, we'll just show a success message
    toast({
      title: "Batch Payment Initiated",
      description: `Processing payments for ${selectedOrders.length} orders.`,
    });
    
    // Clear selected orders
    setSelectedOrders([]);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === batchFilteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(batchFilteredOrders.map(order => order.id));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader 
              title="Payment Management" 
              description="Process payments, manage invoices, and track payment history"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleNewPayment}>
                  <Plus size={16} className="mr-2" />
                  New Payment
                </Button>
                <Button variant="outline" onClick={handleBatchPayment}>
                  <CheckSquare size={16} className="mr-2" />
                  Batch Processing
                </Button>
                <Button variant="outline" onClick={() => navigate('/store/dashboard')}>
                  <BadgeDollarSign size={16} className="mr-2" />
                  Store Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/orders')}>
                  <Receipt size={16} className="mr-2" />
                  Orders
                </Button>
              </div>
            </PageHeader>
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="w-full max-w-md grid grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="flex items-center">
                  <DollarSign size={16} className="mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center">
                  <FileText size={16} className="mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="methods" className="flex items-center">
                  <CreditCard size={16} className="mr-2" />
                  Methods
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center">
                  <Receipt size={16} className="mr-2" />
                  Invoices
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <PaymentsOverview />
              </TabsContent>
              
              <TabsContent value="history">
                <PaymentHistory />
              </TabsContent>
              
              <TabsContent value="methods">
                <PaymentMethods />
              </TabsContent>
              
              <TabsContent value="invoices">
                <PaymentInvoices />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Single Payment Dialog */}
      <Dialog open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process New Payment</DialogTitle>
            <DialogDescription>
              Select an order to process payment for or enter a custom amount.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="order-search">Search Orders</Label>
              <Input 
                id="order-search" 
                placeholder="Search by order ID or client name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order-select">Select Order</Label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {filteredOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.clientName} (${order.total.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Or create a custom payment without an order
              </span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment}>
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Payment Dialog */}
      <Dialog open={isBatchPaymentOpen} onOpenChange={setIsBatchPaymentOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Batch Payment Processing</DialogTitle>
            <DialogDescription>
              Select multiple orders to process payments in batch.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="batch-order-search">Search Orders</Label>
                <Input 
                  id="batch-order-search" 
                  placeholder="Search by order ID or client name" 
                  value={batchSearchTerm}
                  onChange={(e) => setBatchSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="icon" className="mb-2">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="p-3 border-b bg-muted/50 flex items-center">
                <div className="flex items-center">
                  <Checkbox 
                    id="select-all" 
                    checked={selectedOrders.length > 0 && selectedOrders.length === batchFilteredOrders.length} 
                    onCheckedChange={handleSelectAllOrders}
                  />
                  <Label htmlFor="select-all" className="ml-2 text-sm font-medium">
                    Select All ({batchFilteredOrders.length})
                  </Label>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Selected: {selectedOrders.length}
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {batchFilteredOrders.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No orders found matching your search criteria.
                  </div>
                ) : (
                  batchFilteredOrders.map((order) => (
                    <div key={order.id} className="p-3 border-b last:border-0 flex items-center">
                      <Checkbox 
                        id={`order-${order.id}`} 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleOrderSelection(order.id)}
                      />
                      <Label htmlFor={`order-${order.id}`} className="ml-2 flex-1 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{order.id} - {order.clientName}</span>
                          <span className="text-xs text-muted-foreground">
                            Status: <span className="capitalize">{order.status}</span> • Total: ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm">Total Orders:</span>
                <span className="text-sm font-medium">{selectedOrders.length}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm">Total Amount:</span>
                <span className="text-sm font-medium">
                  ${orders
                    .filter(order => selectedOrders.includes(order.id))
                    .reduce((sum, order) => sum + order.total, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchPaymentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessBatchPayment}
              disabled={selectedOrders.length === 0}
            >
              Process {selectedOrders.length} Payments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
