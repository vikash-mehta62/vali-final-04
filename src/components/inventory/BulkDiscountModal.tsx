import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, formatCurrency } from '@/lib/data';
import { BulkDiscount } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Filter, Plus, Percent, Trash, Save, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertBulkDiscountToFormFormat } from '@/data/clientData';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {updateBulkDiscount} from "@/services2/operations/product"

interface BulkDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProducts: string[];
  onUpdateProducts: (products: Product[]) => void;
}

const BulkDiscountModal: React.FC<BulkDiscountModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProducts,
  onUpdateProducts,
}) => {
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [discounts, setDiscounts] = useState<BulkDiscount[]>([
    { quantity: 5, discountPercentage: 5, minQuantity: 5, discountPercent: 5 },
    { quantity: 10, discountPercentage: 10, minQuantity: 10, discountPercent: 10 },
  ]);
  const { toast } = useToast();
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];
  
  // Filter products by selection or category
  const filteredProducts = products.filter(product => {
    if (selectedProducts.length > 0) {
      // Agar selected products hain, toh sirf wahi show karo jo selected hain
      return selectedProducts.includes(product.id);
    } else {
      // Agar koi product select nahi kiya gaya, toh sirf selected category ke products dikhao
      return categoryFilter !== 'all' ? product.category === categoryFilter : true;
    }
  });
  

  // Add a new discount tier
  const addDiscountTier = () => {
    const lastDiscount = discounts[discounts.length - 1];
    const newMinQuantity = lastDiscount ? lastDiscount.minQuantity * 2 : 5;
    const newDiscountPercent = lastDiscount ? Math.min(lastDiscount.discountPercent + 5, 50) : 5;
    
    setDiscounts([...discounts, { 
      quantity: newMinQuantity, 
      discountPercentage: newDiscountPercent,
      minQuantity: newMinQuantity,
      discountPercent: newDiscountPercent
    }]);
  };
  
  // Remove a discount tier
  const removeDiscountTier = (index: number) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  };
  
  // Update discount tier
  const updateDiscountTier = (index: number, field: 'minQuantity' | 'discountPercent', value: string) => {
    const newValue = parseInt(value);
    if (isNaN(newValue) || newValue <= 0) return;
    
    const updatedDiscounts = [...discounts];
    const discount = {...updatedDiscounts[index]};
    
    if (field === 'minQuantity') {
      discount.minQuantity = newValue;
      discount.quantity = newValue;
    } else {
      discount.discountPercent = newValue;
      discount.discountPercentage = newValue;
    }
    
    updatedDiscounts[index] = discount;
    
    // Sort by min quantity
    setDiscounts(updatedDiscounts.sort((a, b) => (a.minQuantity || a.quantity) - (b.minQuantity || b.quantity)));
  };
  
  // Apply discounts to products
  const applyBulkDiscounts = async() => {
    if (filteredProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select products to apply discounts to",
        variant: "destructive"
      });
      return;
    }
    
    const updatedProducts = [...products];
    

    console.log(discounts)
    await updateBulkDiscount(discounts,filteredProducts,token)
    return
    filteredProducts.forEach(product => {
      const index = updatedProducts.findIndex(p => p.id === product.id);
      if (index !== -1) {
        // Store discounts in product
        updatedProducts[index] = {
          ...updatedProducts[index],
          bulkDiscounts: [...discounts],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
    });
    
    onUpdateProducts(updatedProducts);
    toast({
      title: "Bulk Discounts Applied",
      description: `Discounts applied to ${filteredProducts.length} products`
    });
    onClose();
  };
  
  // Calculate the discounted price
  const getDiscountedPrice = (price: number, quantity: number): { price: number, discount: number } => {
    for (let i = discounts.length - 1; i >= 0; i--) {
      const minQty = discounts[i].minQuantity;
      if (quantity >= minQty) {
        const discountPercent = discounts[i].discountPercent;
        const discountedPrice = price * (1 - discountPercent / 100);
        return { 
          price: discountedPrice, 
          discount: discountPercent 
        };
      }
    }
    return { price, discount: 0 };
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Bulk Buying Discounts
          </DialogTitle>
          <DialogDescription>
            Configure volume discounts for multiple products. Customers will receive discounts when ordering above the specified quantities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{selectedProducts.length > 0 ? `${selectedProducts.length} products selected` : 'Configure discount tiers'}</h3>
            </div>
            
            {selectedProducts.length === 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Filter by category" />
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
            )}
          </div>
          
          {/* Discount tiers configuration */}
          <div className="bg-muted/50 rounded-md p-3 border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Discount Tiers</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addDiscountTier}
                className="h-8"
              >
                <Plus size={14} className="mr-1" />
                Add Tier
              </Button>
            </div>
            
            <div className="space-y-2">
              {discounts.length === 0 ? (
                <div className="text-center py-2 text-muted-foreground">
                  No discount tiers configured. Add a tier to get started.
                </div>
              ) : (
                discounts.map((discount, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Min Quantity</div>
                      <Input
                        type="number"
                        min="1"
                        value={discount.minQuantity}
                        onChange={(e) => updateDiscountTier(index, 'minQuantity', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Discount %</div>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <Percent size={14} />
                        </div>
                        <Input
                          type="number"
                          min="1"
                          max="99"
                          value={discount.discountPercent}
                          onChange={(e) => updateDiscountTier(index, 'discountPercent', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDiscountTier(index)}
                        className="h-10 w-10"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Product preview */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sample Discounts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      {selectedProducts.length > 0 
                        ? "No products selected" 
                        : categoryFilter !== 'all' 
                          ? "No products in this category" 
                          : "No products found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.slice(0, 10).map((product) => {
                    const exampleQuantity = discounts.length > 0 ? discounts[0].minQuantity : 5;
                    const { price: discountedPrice, discount } = getDiscountedPrice(product.price, exampleQuantity);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          {discounts.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              <span>
                                Buy {exampleQuantity}+ for {formatCurrency(discountedPrice)} each
                                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                  Save {discount}%
                                </Badge>
                              </span>
                              {discounts.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  +{discounts.length - 1} more discount tiers
                                </span>
                              )}
                            </div>
                          ) : (
                            "No discounts configured"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                {filteredProducts.length > 10 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-2 text-muted-foreground">
                      +{filteredProducts.length - 10} more products
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between space-x-2">
          <div>
            {filteredProducts.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products will be updated
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={applyBulkDiscounts}
              disabled={discounts.length === 0 || filteredProducts.length === 0}
            >
              <Save size={14} className="mr-2" />
              Apply Discounts
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDiscountModal;
