import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addQuantityProductAPI, trashProductQuanityAPI } from '@/services2/operations/product';
import { toast } from 'react-toastify';

interface InventoryAdjustModalProps {
  product: {
    _id: string;
    name: string;
    category: string;
    summary?: {
      totalRemaining: number;
      totalPurchase: number;
      totalSell: number;
    };
    price: number;
    pricePerBox?: number;
  };
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const InventoryAdjustModal: React.FC<InventoryAdjustModalProps> = ({ product, open, onClose, onSave }) => {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'box' | 'unit'>('box');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const token = useSelector((state: RootState) => state.auth?.token);

  const handleSubmit = async () => {
    if (!quantity || !reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const adjustmentData = {
        productId: product._id,
        quantity: parseInt(quantity),
        type: unit,
        reason
      };

      let response;
      if (adjustmentType === 'add') {
        response = await addQuantityProductAPI(adjustmentData, token);
      } else {
        response = await trashProductQuanityAPI(adjustmentData, token);
      }

      if (response) {
        toast.success(`Inventory ${adjustmentType === 'add' ? 'increased' : 'decreased'} successfully`);
        onSave();
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      toast.error('Failed to adjust inventory');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuantity('');
    setReason('');
    setAdjustmentType('add');
    setUnit('box');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currentStock = product.summary?.totalRemaining || 0;
  const projectedStock = adjustmentType === 'add' 
    ? currentStock + (parseInt(quantity) || 0)
    : currentStock - (parseInt(quantity) || 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Adjust Inventory: {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Product Name</Label>
                  <div className="font-medium">{product.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <div className="font-medium">{product.category}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Current Stock</Label>
                  <div className="font-medium text-lg">{currentStock}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Price per Box</Label>
                  <div className="font-medium">${product.pricePerBox || product.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adjustment Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Inventory Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adjustment Type */}
              <div>
                <Label>Adjustment Type</Label>
                <Select value={adjustmentType} onValueChange={(value: 'add' | 'remove') => setAdjustmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Add Inventory
                      </div>
                    </SelectItem>
                    <SelectItem value="remove">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Remove Inventory
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label>Unit Type</Label>
                  <Select value={unit} onValueChange={(value: 'box' | 'unit') => setUnit(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="unit">Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for adjustment (e.g., Received new shipment, Damaged goods, Inventory correction)"
                  rows={3}
                />
              </div>

              {/* Stock Projection */}
              {quantity && (
                <Card className={`border-2 ${projectedStock < 0 ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm text-muted-foreground">Projected Stock After Adjustment</Label>
                        <div className={`text-2xl font-bold ${projectedStock < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                          {projectedStock}
                        </div>
                      </div>
                      {projectedStock < 0 && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="text-sm font-medium">Negative Stock Warning</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Current: {currentStock} {adjustmentType === 'add' ? '+' : '-'} {quantity} = {projectedStock}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warning for negative stock */}
              {projectedStock < 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Warning</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This adjustment will result in negative stock. Please verify the quantity is correct.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !quantity || !reason}
              className={adjustmentType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {adjustmentType === 'add' ? 'Add' : 'Remove'} Inventory
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryAdjustModal;