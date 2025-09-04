import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Package, DollarSign, User, Truck, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface PalletData {
  worker: string;
  palletCount: number;
  boxesPerPallet: Record<string, number>;
  totalBoxes: number;
  chargePerPallet: number;
  totalPalletCharge: number;
  selectedItems: string[];
}

interface PalletTrackingFormProps {
  orderItems: Array<{productId: string, productName: string, quantity: number}>;
  onSave: (palletData: PalletData) => void;
  initialData?: PalletData;
}

const mockWorkers = [
  { id: 'w1', name: 'John Smith' },
  { id: 'w2', name: 'Maria Garcia' },
  { id: 'w3', name: 'David Johnson' },
  { id: 'w4', name: 'Sarah Williams' },
  { id: 'w5', name: 'Michael Brown' },
];

const PalletTrackingForm: React.FC<PalletTrackingFormProps> = ({ 
  orderItems, 
  onSave,
  initialData 
}) => {
  const { toast } = useToast();
  
  const [worker, setWorker] = useState(initialData?.worker || '');
  const [palletCount, setPalletCount] = useState(initialData?.palletCount || 1);
  const [chargePerPallet, setChargePerPallet] = useState(initialData?.chargePerPallet || 15);
  const [selectedItems, setSelectedItems] = useState<string[]>(initialData?.selectedItems || []);
  const [boxesPerPallet, setBoxesPerPallet] = useState<Record<string, number>>(
    initialData?.boxesPerPallet || {}
  );
  
  // Calculate totals
  const totalBoxes = Object.values(boxesPerPallet).reduce((sum, count) => sum + count, 0);
  const totalPalletCharge = palletCount * chargePerPallet;
  
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
      if (!boxesPerPallet[itemId]) {
        setBoxesPerPallet(prev => ({
          ...prev,
          [itemId]: 1
        }));
      }
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      setBoxesPerPallet(prev => {
        const newState = {...prev};
        delete newState[itemId];
        return newState;
      });
    }
  };
  
  const handleBoxCountChange = (itemId: string, count: number) => {
    setBoxesPerPallet(prev => ({
      ...prev,
      [itemId]: count
    }));
  };
  
  const incrementPalletCount = () => {
    setPalletCount(prev => prev + 1);
  };
  
  const decrementPalletCount = () => {
    setPalletCount(prev => prev > 1 ? prev - 1 : 1);
  };
  
  const handleSubmit = () => {
    if (!worker) {
      toast({
        title: "Worker Required",
        description: "Please select a worker responsible for this order",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedItems.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to include",
        variant: "destructive"
      });
      return;
    }
    
    const palletData: PalletData = {
      worker,
      palletCount,
      boxesPerPallet,
      totalBoxes,
      chargePerPallet,
      totalPalletCharge,
      selectedItems
    };
    
    onSave(palletData);
    
    toast({
      title: "Pallet Information Saved",
      description: `Saved pallet information for ${palletCount} pallets with ${totalBoxes} total boxes`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Worker Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          <div>
  <Label htmlFor="worker">Assigned Worker</Label>
  <Input
    id="worker"
    type="text"
    className="w-60"
    value={worker}
    onChange={(e) => setWorker(e.target.value)}
    placeholder="Enter worker name "
  />
</div>

          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Selection &amp; Box Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              {orderItems.map(item => (
                <div key={item.productId} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`item-${item.productId}`}
                      checked={selectedItems.includes(item.productId)}
                      onCheckedChange={(checked) => handleSelectItem(item.productId, !!checked)}
                    />
                    <Label htmlFor={`item-${item.productId}`} className="font-medium">
                      {item.productName}
                    </Label>
                  </div>
                  
                  {selectedItems.includes(item.productId) && (
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`boxes-${item.productId}`} className="text-sm">Boxes:</Label>
                      <Input
                        id={`boxes-${item.productId}`}
                        type="number"
                        min="1"
                        className="w-20"
                        value={boxesPerPallet[item.productId] || 1}
                        onChange={(e) => handleBoxCountChange(item.productId, parseInt(e.target.value) || 1)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <div className="bg-muted px-3 py-2 rounded-md text-sm">
                Total Boxes: <span className="font-semibold">{totalBoxes}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Pallet Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="palletCount">Number of Pallets</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementPalletCount}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="palletCount"
                  type="number"
                  min="1"
                  className="w-20 text-center"
                  value={palletCount}
                  onChange={(e) => setPalletCount(parseInt(e.target.value) || 1)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementPalletCount}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="chargePerPallet">Charge Per Pallet ($)</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="chargePerPallet"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-10"
                  value={chargePerPallet}
                  onChange={(e) => setChargePerPallet(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center font-medium">
              <span>Total Pallet Charge:</span>
              <span className="text-xl">${totalPalletCharge.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Save Pallet Information</Button>
      </div>
    </div>
  );
};

export default PalletTrackingForm;
