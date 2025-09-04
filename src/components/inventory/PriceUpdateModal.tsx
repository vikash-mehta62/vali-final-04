
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/lib/data';
import { ArrowUp, ArrowDown, Percent, DollarSign } from 'lucide-react';

interface PriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  allProducts: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

type UpdateMethod = 'percentage' | 'fixed' | 'market';
type Direction = 'increase' | 'decrease';

const PriceUpdateModal: React.FC<PriceUpdateModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  allProducts,
  onUpdateProducts,
}) => {
  const [updateMethod, setUpdateMethod] = useState<UpdateMethod>('percentage');
  const [updateValue, setUpdateValue] = useState<string>('5');
  const [direction, setDirection] = useState<Direction>('increase');
  const [applyToAll, setApplyToAll] = useState<boolean>(false);
  const [applyToCategory, setApplyToCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Get unique categories from products
  const categories = [...new Set(allProducts.map(product => product.category))];
  
  // Calculate total products that will be affected
  const getAffectedProducts = (): Product[] => {
    if (applyToAll) {
      return allProducts;
    }
    
    if (applyToCategory && selectedCategory) {
      return allProducts.filter(product => product.category === selectedCategory);
    }
    
    return selectedProducts;
  };
  
  const affectedProducts = getAffectedProducts();
  
  // Calculate new price for preview
  const calculateNewPrice = (currentPrice: number): number => {
    const value = parseFloat(updateValue) || 0;
    
    if (updateMethod === 'percentage') {
      return direction === 'increase' 
        ? currentPrice * (1 + value / 100)
        : currentPrice * (1 - value / 100);
    }
    
    if (updateMethod === 'fixed') {
      return direction === 'increase'
        ? currentPrice + value
        : Math.max(currentPrice - value, 0);
    }
    
    // Market adjustment (simplified simulation)
    return currentPrice * (1 + (Math.random() * 0.1 - 0.05));
  };
  
  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  // Handle price update
  const handlePriceUpdate = () => {
    const updatedProducts = [...allProducts];
    
    affectedProducts.forEach(product => {
      const index = updatedProducts.findIndex(p => p.id === product.id);
      if (index !== -1) {
        const newPrice = calculateNewPrice(product.price);
        updatedProducts[index] = {
          ...updatedProducts[index],
          price: Math.round(newPrice * 100) / 100, // Round to 2 decimal places
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
    });
    
    onUpdateProducts(updatedProducts);
    onClose();
  };
  
  // Preview changes
  const totalValueChange = affectedProducts.reduce((total, product) => {
    const newPrice = calculateNewPrice(product.price);
    return total + ((newPrice - product.price) * product.quantity);
  }, 0);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Smart Price Update</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Update Method</Label>
            <Select value={updateMethod} onValueChange={(value) => setUpdateMethod(value as UpdateMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage Change</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="market">Market Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {updateMethod !== 'market' && (
            <>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={direction} onValueChange={(value) => setDirection(value as Direction)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">
                      <div className="flex items-center">
                        <ArrowUp size={16} className="mr-2 text-green-500" />
                        Increase
                      </div>
                    </SelectItem>
                    <SelectItem value="decrease">
                      <div className="flex items-center">
                        <ArrowDown size={16} className="mr-2 text-red-500" />
                        Decrease
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Value {updateMethod === 'percentage' ? '(%)' : '($)'}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {updateMethod === 'percentage' ? <Percent size={16} /> : <DollarSign size={16} />}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    step={updateMethod === 'percentage' ? '1' : '0.01'}
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}
          
          {updateMethod === 'market' && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              Market adjustment will apply small random variations (±5%) to simulate market price fluctuations.
            </div>
          )}
          
          <div className="space-y-3 border-t pt-3">
            <Label>Apply To</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="apply-selected" className="cursor-pointer">
                Selected Products ({selectedProducts.length})
              </Label>
              <Switch
                id="apply-selected"
                checked={!applyToAll && !applyToCategory}
                onCheckedChange={() => {
                  setApplyToAll(false);
                  setApplyToCategory(false);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="apply-category" className="cursor-pointer">
                By Category
              </Label>
              <Switch
                id="apply-category"
                checked={applyToCategory}
                onCheckedChange={(checked) => {
                  setApplyToCategory(checked);
                  if (checked) {
                    setApplyToAll(false);
                    if (categories.length > 0 && !selectedCategory) {
                      setSelectedCategory(categories[0]);
                    }
                  }
                }}
              />
            </div>
            
            {applyToCategory && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="apply-all" className="cursor-pointer">
                All Products ({allProducts.length})
              </Label>
              <Switch
                id="apply-all"
                checked={applyToAll}
                onCheckedChange={(checked) => {
                  setApplyToAll(checked);
                  if (checked) {
                    setApplyToCategory(false);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Preview section */}
          <div className="border rounded-md p-3 space-y-2 mt-2">
            <h4 className="font-medium text-sm">Preview</h4>
            <div className="text-sm">
              <p>Products affected: <span className="font-semibold">{affectedProducts.length}</span></p>
              {affectedProducts.length > 0 && updateMethod !== 'market' && (
                <p className="mt-1">
                  Inventory value change: <span className={`font-semibold ${totalValueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPrice(totalValueChange)}
                  </span>
                </p>
              )}
              {affectedProducts.length > 0 && affectedProducts.length <= 3 && (
                <div className="mt-2 space-y-1">
                  {affectedProducts.map(product => (
                    <div key={product.id} className="flex justify-between text-xs">
                      <span>{product.name}</span>
                      <span>
                        {formatPrice(product.price)} → {updateMethod === 'market' 
                          ? '(Market adjusted)' 
                          : formatPrice(calculateNewPrice(product.price))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePriceUpdate}
            disabled={affectedProducts.length === 0}
          >
            Update Prices
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceUpdateModal;
