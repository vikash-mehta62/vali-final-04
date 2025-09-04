
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  MoreHorizontal, 
  Eye, 
  FileText, 
  RefreshCw, 
  ArrowUpDown,
  Settings,
  Users,
  BarChart3,
  DollarSign,
  CreditCard,
  XCircle,
  AlertTriangle,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PaymentOptions from './PaymentOptions';
import PurchaseSalesMetrics from './PurchaseSalesMetrics';

const StoreDashboardTabs = () => {
  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <ShoppingBag size={16} />
          <span className="hidden sm:inline">Orders</span>
        </TabsTrigger>
        <TabsTrigger value="inventory" className="flex items-center gap-2">
          <Package size={16} />
          <span className="hidden sm:inline">Products</span>
        </TabsTrigger>
        <TabsTrigger value="customers" className="flex items-center gap-2">
          <Users size={16} />
          <span className="hidden sm:inline">Customers</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 size={16} />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="orders" className="space-y-4">
        <PurchaseSalesMetrics />
        <StoreOrdersTable />
      </TabsContent>
      
      <TabsContent value="inventory">
        <StoreProductsList />
      </TabsContent>
      
      <TabsContent value="customers">
        <StoreCustomersList />
      </TabsContent>
      
      <TabsContent value="analytics">
        <div className="space-y-6">
          <PurchaseSalesMetrics />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Store Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">View detailed statistics and performance metrics for your store.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Top Selling Product</h3>
                  <p className="font-semibold">Organic Apples</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Most Active Customer</h3>
                  <p className="font-semibold">John's Grocery</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Average Order Value</h3>
                  <p className="font-semibold">$78.45</p>
                </div>
              </div>
              <Button className="mt-4">
                <BarChart3 size={16} className="mr-2" />
                View Detailed Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const StoreProductsList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample products data
  const products = [
    { id: 'P001', name: 'Organic Apples', category: 'Fruits', stock: 145, price: 2.99 },
    { id: 'P002', name: 'Fresh Carrots', category: 'Vegetables', stock: 89, price: 1.49 },
    { id: 'P003', name: 'Whole Wheat Bread', category: 'Bakery', stock: 34, price: 3.29 },
    { id: 'P004', name: 'Milk', category: 'Dairy', stock: 56, price: 2.79 },
  ];
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Products Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button>
            <Package size={16} className="mr-2" />
            Add New Product
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock} units</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const StoreCustomersList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample customers data
  const customers = [
    { id: 'C001', name: 'John\'s Grocery', email: 'contact@johnsgrocery.com', orders: 12, spent: 1250.50 },
    { id: 'C002', name: 'City Market', email: 'orders@citymarket.com', orders: 8, spent: 876.25 },
    { id: 'C003', name: 'Fresh Foods', email: 'info@freshfoods.com', orders: 5, spent: 450.75 },
  ];
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button>
            <Users size={16} className="mr-2" />
            Add New Customer
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.spent.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const StoreOrdersTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedOrderTotal, setSelectedOrderTotal] = useState(0);
  const { toast } = useToast();
  
  // Sample order data
  const orders = [
    { 
      id: 'ORD-001', 
      customer: 'John Smith', 
      date: '2023-10-15', 
      status: 'pending', 
      total: 150.99,
      items: 3,
      paymentStatus: 'unpaid'
    },
    { 
      id: 'ORD-002', 
      customer: 'Sarah Johnson', 
      date: '2023-10-14', 
      status: 'processing', 
      total: 89.50,
      items: 2,
      paymentStatus: 'paid'
    },
    { 
      id: 'ORD-003', 
      customer: 'Michael Brown', 
      date: '2023-10-13', 
      status: 'shipped', 
      total: 210.75,
      items: 4,
      paymentStatus: 'paid'
    },
    { 
      id: 'ORD-004', 
      customer: 'Emily Davis', 
      date: '2023-10-12', 
      status: 'delivered', 
      total: 45.25,
      items: 1,
      paymentStatus: 'unpaid'
    },
  ];
  
  const handleViewDetails = (orderId: string) => {
    toast({
      title: "View Order Details",
      description: `Viewing details for order ${orderId}`,
    });
  };
  
  const handleGenerateInvoice = (orderId: string) => {
    toast({
      title: "Generate Invoice",
      description: `Generating invoice for order ${orderId}`,
    });
  };
  
  const handleUpdateStatus = (orderId: string, status: string) => {
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status updated to ${status}`,
    });
  };

  const handleProcessPayment = (orderId: string, total: number) => {
    setSelectedOrderId(orderId);
    setSelectedOrderTotal(total);
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentComplete = (paymentMethod: string, reference: string) => {
    toast({
      title: "Payment Completed",
      description: `Payment for order ${selectedOrderId} processed via ${paymentMethod} with reference: ${reference}`,
    });
    setIsPaymentModalOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock size={12} className="mr-1" /> Pending
        </Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <RefreshCw size={12} className="mr-1" /> Processing
        </Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <Truck size={12} className="mr-1" /> Shipped
        </Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 size={12} className="mr-1" /> Delivered
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <DollarSign size={12} className="mr-1" /> Paid
        </Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle size={12} className="mr-1" /> Unpaid
        </Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          <AlertTriangle size={12} className="mr-1" /> Partial
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button>
              <FileText size={16} className="mr-2" />
              Export Orders
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">
                    Order ID
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Customer
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                            <Eye size={14} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateInvoice(order.id)}>
                            <FileText size={14} className="mr-2" />
                            Generate Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'processing')}>
                            <RefreshCw size={14} className="mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProcessPayment(order.id, order.total)}>
                            <CreditCard size={14} className="mr-2" />
                            Process Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">Showing {filteredOrders.length} of {orders.length} orders</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>

        {/* Payment Processing Dialog */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="max-w-md p-0">
            <PaymentOptions 
              orderId={selectedOrderId}
              orderTotal={selectedOrderTotal}
              onComplete={handlePaymentComplete}
              onCancel={() => setIsPaymentModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StoreDashboardTabs;
