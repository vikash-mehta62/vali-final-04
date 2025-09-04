
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, formatCurrency } from '@/lib/data';
import { 
  ArrowUp, 
  ArrowDown, 
  Percent, 
  DollarSign, 
  Save, 
  RefreshCw,
  Filter,
  Check,
  X
} from 'lucide-react';
import {updateProductPrice,getAllProductAPI} from "@/services2/operations/product"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


interface PriceListUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

type UpdateMethod = 'percentage' | 'fixed' | 'market';
type Direction = 'increase' | 'decrease';

const PriceListUpdateModal: React.FC<PriceListUpdateModalProps> = ({
  isOpen,
  onClose,

  onUpdateProducts,
}) => {
  const [updateMethod, setUpdateMethod] = useState<UpdateMethod>('percentage');
  const [updateValue, setUpdateValue] = useState<string>('5');
  const [direction, setDirection] = useState<Direction>('increase');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [products, setProduct] = useState<Product[]>([]);
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getAllProductAPI();

      // Transform each product object
      const transformedProducts = res.map(product => ({
        ...product,
        id: product.product_id || product._id, // give preference to product_id
      }));

      setProduct(transformedProducts);
      console.log("Transformed Products:", transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchData();
}, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];
  
  // Filter products by category
  const filteredProducts = products.filter(
    product => categoryFilter === 'all' || product.category === categoryFilter
  );

  // Calculate new price based on method and direction
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
  
  // Apply price calculation to all filtered products
  const applyCalculation = () => {
    const newPrices: Record<string, number> = {};
    
    filteredProducts.forEach(product => {
      const newPrice = Math.round(calculateNewPrice(product.pricePerBox) * 100) / 100;
      newPrices[product.id] = newPrice;
    });
    
    console.log(filteredProducts)
    
    setEditedPrices(newPrices);
    setIsDirty(true);
  };
  
  // Handle manual price edit
  const handlePriceEdit = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setEditedPrices(prev => ({
        ...prev,
        [id]: numValue
      }));
      setIsDirty(true);
    }
  };
  
  // Reset single product price
  const resetPrice = (id: string) => {
    setEditedPrices(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };
  
  // Reset all prices
  const resetAllPrices = () => {
    setEditedPrices({});
    setIsDirty(false);
  };
  
  // Save all price changes
  const saveChanges = async() => {
    const updatedProducts = [...products];
    


    // SUDO implement the server for change the pricing 

  await updateProductPrice(editedPrices,token)
    console.log(editedPrices)
    Object.entries(editedPrices).forEach(([id, newPrice]) => {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          price: newPrice,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
    });
    
    onUpdateProducts(updatedProducts);
    resetAllPrices();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Price List Update</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <div>
                <Select value={updateMethod} onValueChange={(value) => setUpdateMethod(value as UpdateMethod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="market">Market Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {updateMethod !== 'market' && (
                <>
                  <div>
                    <Select value={direction} onValueChange={(value) => setDirection(value as Direction)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase">
                          <div className="flex items-center">
                            <ArrowUp size={14} className="mr-2 text-green-500" />
                            Increase
                          </div>
                        </SelectItem>
                        <SelectItem value="decrease">
                          <div className="flex items-center">
                            <ArrowDown size={14} className="mr-2 text-red-500" />
                            Decrease
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                </>
              )}
              
              {updateMethod === 'market' && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md sm:col-span-2">
                  Market adjustment will apply small random variations (±5%) to simulate market price fluctuations.
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={applyCalculation}
                variant="outline"
              >
                <RefreshCw size={14} className="mr-2" />
                Calculate
              </Button>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">New Price</TableHead>
                  <TableHead className="text-right w-[100px]">Change</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const currentPrice = product.pricePerBox;
                    const newPrice = editedPrices[product.id] !== undefined 
                      ? editedPrices[product.id] 
                      : currentPrice;
                    const priceDiff = newPrice - currentPrice;
                    const percentChange = currentPrice > 0 
                      ? (priceDiff / currentPrice) * 100 
                      : 0;
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">{formatCurrency(currentPrice)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="relative w-24">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                <DollarSign size={14} />
                              </div>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={newPrice}
                                onChange={(e) => handlePriceEdit(product.id, e.target.value)}
                                className="pl-7 h-8 text-right pr-2 w-full"
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={
                            priceDiff > 0 
                              ? "text-green-600" 
                              : priceDiff < 0 
                                ? "text-red-600" 
                                : ""
                          }>
                            {priceDiff !== 0 && (priceDiff > 0 ? "+" : "")}{formatCurrency(priceDiff)}
                            <span className="text-xs ml-1">
                              ({percentChange > 0 ? "+" : ""}{percentChange.toFixed(1)}%)
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          {editedPrices[product.id] !== undefined && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => resetPrice(product.id)}
                              className="h-7 w-7"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between space-x-2">
          <div className="flex items-center gap-2">
            {isDirty && (
              <Button variant="outline" onClick={resetAllPrices}>
                Reset All
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={saveChanges}
              disabled={Object.keys(editedPrices).length === 0}
            >
              <Save size={14} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceListUpdateModal;
