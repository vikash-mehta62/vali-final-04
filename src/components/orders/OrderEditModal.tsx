import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Save, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateOrderAPI } from '@/services2/operations/order';
import { toast } from 'react-toastify';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  pricingType: string;
  unitPrice: number;
  total: number;
}

interface OrderEditModalProps {
  order: {
    _id: string;
    orderNumber: string;
    store: {
      storeName: string;
      state: string;
    };
    items: OrderItem[];
    total: number;
    status: string;
    paymentStatus: string;
    shippinCost?: number;
  };
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const OrderEditModal: React.FC<OrderEditModalProps> = ({ order, open, onClose, onSave }) => {
  const [editedOrder, setEditedOrder] = useState(order);
  const [loading, setLoading] = useState(false);
  const [inventoryWarnings, setInventoryWarnings] = useState<string[]>([]);
  
  const token = useSelector((state: RootState) => state.auth?.token);

  useEffect(() => {
    setEditedOrder(order);
    checkInventoryAvailability();
  }, [order]);

  const checkInventoryAvailability = () => {
    // This would check against actual inventory
    // For now, we'll simulate some warnings
    const warnings: string[] = [];
    
    editedOrder.items.forEach(item => {
      if (item.quantity > 50) { // Simulate low stock warning
        warnings.push(`${item.name}: Quantity ${item.quantity} may exceed available stock`);
      }
    });
    
    setInventoryWarnings(warnings);
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    const updatedItems = [...editedOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
      total: newQuantity * updatedItems[index].unitPrice
    };
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0) + (editedOrder.shippinCost || 0);
    
    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: newTotal
    });
    
    checkInventoryAvailability();
  };

  const updateItemPrice = (index: number, newPrice: number) => {
    const updatedItems = [...editedOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      unitPrice: newPrice,
      total: updatedItems[index].quantity * newPrice
    };
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0) + (editedOrder.shippinCost || 0);
    
    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = editedOrder.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0) + (editedOrder.shippinCost || 0);
    
    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: newTotal
    });
    
    checkInventoryAvailability();
  };

  const updateShippingCost = (newShippingCost: number) => {
    const itemsTotal = editedOrder.items.reduce((sum, item) => sum + item.total, 0);
    
    setEditedOrder({
      ...editedOrder,
      shippinCost: newShippingCost,
      total: itemsTotal + newShippingCost
    });
  };

  const updateOrderStatus = (newStatus: string) => {
    setEditedOrder({
      ...editedOrder,
      status: newStatus
    });
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const updateData = {
        items: editedOrder.items,
        total: editedOrder.total,
        status: editedOrder.status,
        shippinCost: editedOrder.shippinCost || 0
      };
      
      const response = await updateOrderAPI(updateData, token, editedOrder._id);
      
      if (response) {
        toast.success('Order updated successfully');
        onSave();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Order: {editedOrder.orderNumber}</span>
            <Badge variant="outline">{editedOrder.store.storeName}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inventory Warnings */}
          {inventoryWarnings.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Inventory Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {inventoryWarnings.map((warning, index) => (
                    <li key={index} className="text-sm text-orange-700">• {warning}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Order Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select value={editedOrder.status} onValueChange={updateOrderStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="shipping">Shipping Cost</Label>
              <Input
                id="shipping"
                type="number"
                step="0.01"
                value={editedOrder.shippinCost || 0}
                onChange={(e) => updateShippingCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editedOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded">
                    <div className="col-span-4">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Type: {item.pricingType}
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItemPrice(index, parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label className="text-xs">Total</Label>
                      <div className="h-8 flex items-center font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Order Total:</span>
                  <span className="text-xl font-bold">${editedOrder.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Items: ${editedOrder.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)} + 
                  Shipping: ${(editedOrder.shippinCost || 0).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderEditModal;