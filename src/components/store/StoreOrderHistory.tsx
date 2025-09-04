
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  RotateCcw, 
  Search,
  CheckCircle,
  ClockIcon, 
  TruckIcon,
  XCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  total?: number;
  unitPrice?:number,
  productName?:string
}

interface Order {
  _id: string;
  orderId: string;
  date: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface StoreOrderHistoryProps {
  orders: Order[];
}

const StoreOrderHistory: React.FC<StoreOrderHistoryProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  console.log(orders)
  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle view order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <ClockIcon className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <RotateCcw className="h-3 w-3 mr-1" />
          Processing
        </Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <TruckIcon className="h-3 w-3 mr-1" />
          Shipped
        </Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Delivered
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Paid
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Payment Pending
        </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Payment Failed
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Status filters
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedStatus === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus(null)}
          >
            All
          </Button>
          
          {statuses.map((status) => (
            <Button 
              key={status} 
              variant={selectedStatus === status ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No orders found matching your search criteria.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="text-right">${Number(order.total).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Order details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>Order #{selectedOrder.orderId} - {formatDate(selectedOrder.date)}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment</p>
                    {getPaymentBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {selectedOrder.items.map((item, index) => {
  const priceToUse = item.unitPrice || item.price; 
  const totalPrice = priceToUse * item.quantity;

  return (
    <TableRow key={index}>
      <TableCell>{item.productName}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>${Number(priceToUse).toFixed(2)}</TableCell>
      <TableCell className="text-right">${Number(totalPrice).toFixed(2)}</TableCell>
    </TableRow>
  );
})}

                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* <DialogFooter className="gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reorder
                </Button>
              </DialogFooter> */}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreOrderHistory;
