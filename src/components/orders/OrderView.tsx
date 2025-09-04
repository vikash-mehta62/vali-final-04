import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Package, Truck, CheckCircle2, XCircle, CreditCard, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { Link } from 'react-router-dom';

// Types


interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  userRole: 'admin' | 'user';
}

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return "bg-amber-100 text-amber-700";
    case 'processing':
      return "bg-blue-100 text-blue-700";
    case 'shipped':
      return "bg-purple-100 text-purple-700";
    case 'delivered':
      return "bg-green-100 text-green-700";
    case 'cancelled':
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return "bg-green-100 text-green-700";
    case 'pending':
      return "bg-amber-100 text-amber-700";
    case 'failed':
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, open, onClose, userRole }) => {
  if (!order) return null;

  const totalQuantity = order.items.reduce((sum, item) => {
    if (order?.isDelete) {
      return sum + Number(item.deletedQuantity || 0);
    } else {
      return sum + Number(item.quantity || 0);
    }
  }, 0);

  console.log(order)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id}</span>
            <Badge
              className={cn(
                "ml-2 flex items-center gap-1 px-2 py-1",
                getStatusClass(order.status)
              )}
            >
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Placed on {formatDate(order.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Customer Information */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Customer Information</h3>
            <p className="font-medium">{(order.store as any).storeName || (order.store as any).ownerName || 'N/A'}</p>
            <p className="font-medium">{(order.store as any).phone || 'N/A'}</p>
            <p className="font-medium">{(order.store as any).email || 'N/A'}</p>

            {order.clientId && (
              <p className="text-sm text-muted-foreground">Customer ID: {order.clientId}</p>
            )}
          </div>

          {/* Payment Information */}
          {/* <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Payment Information</h3>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>{order.paymentMethod || 'N/A'}</span>
            </div>
            <Badge 
              className={cn(
                "flex items-center w-fit gap-1 px-2 py-0.5",
                getPaymentStatusClass(order.paymentStatus)
              )}
            >
              <span className="capitalize">{order.paymentStatus}</span>
            </Badge>
          </div> */}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Shipping Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{order.shippingAddress.address} {order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
              {order.trackingNumber && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Tracking:</span> {order.trackingNumber}
                </p>
              )}
            </div>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Billing Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{order.billingAddress.street}</p>
                  <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div>
          {order?.isDelete && order.deleted?.reason && (
            <div className="text-sm text-red-600 italic">
              📝 Void Reason: {order.deleted.reason}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-medium mb-3">Order Items</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted/40 text-sm font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <Separator />
            {order.items.map((item, index) => (
              <div key={index}>
                <div className="grid grid-cols-12 gap-2 p-3 text-sm">
                  <div className="col-span-6">
                    <p className="font-medium">{item.name || item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.productId || item.product}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.unitPrice || item.price)}
                  </div>
                  <div className="col-span-2 text-right">{order?.isDelete ? item.deletedQuantity : item.quantity} {item.pricingType === "unit" ? "unit" : ""}</div>
                  <div className="col-span-2 text-right font-medium">
                    {order?.isDelete ? (
                      <>
                        <span className="line-through text-muted-foreground">
                          {formatCurrency(item.deletedTotal)}
                        </span>
                        <br />
                        <span className="text-xs text-red-500">Voided</span>
                      </>
                    ) : (
                      formatCurrency(item.total || (item.quantity * (item.unitPrice || item.price)))
                    )}
                  </div>

                </div>
                {index < order.items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency((order.subtotal || order.total) - order.shippinCost)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping Cost</span>
            <span>{formatCurrency(order.shippinCost)}</span>
          </div>
          {order.tax !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          )}
          {order.shipping !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
          )}
          {order.discount !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>  {order?.isDelete
              ? formatCurrency(order?.deleted?.amount)
              : formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Notes</h3>
            <p className="text-sm p-3 bg-muted/30 rounded-md">{order.notes}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {userRole === 'admin' && (
            <Button>

              <Link to={`/orders/edit/${order._id}`}>Edit Order</Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
