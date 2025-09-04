
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ShoppingCart, Tag, Zap, Package, Percent, Leaf, Clock, DollarSign, Info, Award, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useCart } from './CartContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { isAfter, isBefore, addDays, format } from 'date-fns';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  // Determine if product has individual discount - based on inventory quantity or expiry
  const getProductDiscount = () => {
    // Expiring soon products get 25% discount
    if (product.expiryDate && isNearingExpiry(product)) return 25;
    
    // High-stock products (>100) get 10% discount
    if (product.quantity > 100) return 10;
    
    // Medium-stock products (>50) get 5% discount
    if (product.quantity > 50) return 5;
    
    // Premium or exclusive products in low stock get no discount or custom discounts
    if (product.category === "Premium" && product.quantity < 30) return 0;
    
    // Products in the "Promotional" category get 15% discount
    if (product.category === "Promotional") return 15;
    
    // Default case: no discount
    return 0;
  };
  
  // Check if product is nearing expiry (within 7 days)
  const isNearingExpiry = (product: Product) => {
    if (!product.expiryDate) return false;
    const today = new Date();
    const expiryDate = new Date(product.expiryDate);
    const warningDate = addDays(today, 7); // 7 days from now
    return isBefore(expiryDate, warningDate) && isAfter(expiryDate, today);
  };

  // Check if a product is expired
  const isExpired = (product: Product) => {
    if (!product.expiryDate) return false;
    const today = new Date();
    const expiryDate = new Date(product.expiryDate);
    return isBefore(expiryDate, today);
  };
  
  const discountPercentage = getProductDiscount();
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - discountPercentage / 100) : null;
  
  // Check if product is low in stock (good for creating urgency)
  const isLowStock = product.quantity < product.threshold * 1.5;
  
  // Calculate bulk discount if available
  const getBulkDiscount = () => {
    if (!product.bulkDiscounts || product.bulkDiscounts.length === 0) return null;
    
    // Sort by quantity so we get the best discount for current quantity
    const sortedDiscounts = [...product.bulkDiscounts].sort((a, b) => a.minQuantity - b.minQuantity);
    
    // Find applicable discount
    for (const discount of sortedDiscounts) {
      if (quantity >= discount.minQuantity) {
        return {
          percent: discount.discountPercent,
          price: product.price * (1 - discount.discountPercent / 100)
        };
      }
    }
    
    return null;
  };
  
  const bulkDiscount = getBulkDiscount();
  const hasBulkDiscount = bulkDiscount !== null;
  
  // Get the next available discount tier
  const getNextDiscountTier = () => {
    if (!product.bulkDiscounts || product.bulkDiscounts.length === 0) return null;
    
    // Sort by quantity ascending
    const sortedDiscounts = [...product.bulkDiscounts].sort((a, b) => a.minQuantity - b.minQuantity);
    
    // Find the next tier above current quantity
    for (const discount of sortedDiscounts) {
      if (quantity < discount.minQuantity) {
        const remaining = discount.minQuantity - quantity;
        return {
          percent: discount.discountPercent,
          minQuantity: discount.minQuantity,
          remaining,
          price: product.price * (1 - discount.discountPercent / 100)
        };
      }
    }
    
    // Already at maximum discount tier
    return null;
  };
  
  const nextDiscountTier = getNextDiscountTier();
  
  // Calculate total savings
  const calculateSavings = () => {
    const basePrice = product.price;
    const finalPrice = hasBulkDiscount ? bulkDiscount.price : (hasDiscount ? discountedPrice! : basePrice);
    
    return (basePrice - finalPrice) * quantity;
  };
  
  const savings = calculateSavings();
  const hasSavings = savings > 0;
  
  // If there are multiple discounts, use the better one for display
  const displayPrice = hasBulkDiscount ? bulkDiscount.price : (hasDiscount ? discountedPrice! : product.price);
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: `https://source.unsplash.com/400x300/?${product.category.toLowerCase()}`,
      category: product.category,
      // Apply the discount - bulk discount takes priority over item discount
      discountPercentage: hasBulkDiscount ? bulkDiscount.percent : (hasDiscount ? discountPercentage : undefined),
      shippinCost:product.shippinCost || 0

    });
    
    toast({
      title: hasSavings ? "Added to cart - Great savings!" : "Added to cart",
      description: hasSavings ? 
        `${product.name} added. You're saving ${(savings).toFixed(2)}!` : 
        `${product.name} has been added to your cart.`
    });
    
    // Reset quantity after adding to cart
    setQuantity(1);
  };
  
  // Format price with weight variation
  const formatPriceWithVariation = (price: number) => {
    if (product.weightVariation && product.weightVariation > 0) {
      return `$${price.toFixed(2)} ±${product.weightVariation}%`;
    }
    return `$${price.toFixed(2)}`;
  };
  
  // Handle quantity changes
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-md">
      <div className="aspect-square relative bg-muted overflow-hidden">
        <img 
          src={product.image || `https://source.unsplash.com/400x300/?${product.category.toLowerCase()}`}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {(hasDiscount || hasBulkDiscount) && (
          <Badge className="absolute top-2 right-2 bg-primary text-white">
            <Percent className="h-3 w-3 mr-1" />
            Up to {hasBulkDiscount && product.bulkDiscounts ? 
              Math.max(...product.bulkDiscounts.map(d => d.discountPercent)) : 
              discountPercentage}% OFF
          </Badge>
        )}
        {isLowStock && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            <Zap className="h-3 w-3 mr-1" />
            Limited Stock
          </Badge>
        )}
        {product.organic && (
          <Badge className="absolute bottom-2 left-2 bg-green-600 text-white">
            <Leaf className="h-3 w-3 mr-1" />
            Organic
          </Badge>
        )}
        {isNearingExpiry(product) && (
          <Badge variant="outline" className="absolute bottom-2 right-2 bg-amber-100 text-amber-700 border-amber-300">
            <Clock className="h-3 w-3 mr-1" />
            Best Before {format(new Date(product.expiryDate!), 'MMM d')}
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-muted-foreground text-sm">{product.category}</p>
            {product.origin && (
              <span className="text-xs text-muted-foreground">Origin: {product.origin}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-baseline space-x-2">
          {hasSavings ? (
            <>
              <span className="text-xl font-bold">{formatPriceWithVariation(displayPrice)}</span>
              <span className="text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold">{formatPriceWithVariation(product.price)}</span>
          )}
          <span className="text-sm text-muted-foreground">/{product.unit}</span>
        </div>
        
        {/* Show bulk discount details if available */}
        {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
          <div className="mt-2 text-sm space-y-1">
            {product.bulkDiscounts.map((discount, idx) => (
              <div 
                key={idx} 
                className={`flex items-center ${quantity >= discount.minQuantity ? 'text-green-600 font-semibold' : 'text-muted-foreground'}`}
              >
                <Tag className="h-3 w-3 inline mr-1" />
                {discount.minQuantity}+ units: {discount.discountPercent}% off  
                {quantity >= discount.minQuantity && " (Applied)"}
              </div>
            ))}
          </div>
        )}
        
        {/* Current savings highlight */}
        {hasSavings && (
          <div className="mt-3 bg-green-50 rounded-md p-2 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-700 font-medium flex items-center">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Current Savings
              </div>
              <Popover>
                <PopoverTrigger>
                  <Info className="h-3.5 w-3.5 text-green-700" />
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-semibold mb-2">Your Savings Breakdown</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Regular Price:</span>
                      <span>${(product.price * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discounted Price:</span>
                      <span>${(displayPrice * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-1 border-t mt-1">
                      <span>Total Savings:</span>
                      <span className="text-green-600">${savings.toFixed(2)}</span>
                    </div>
                    {product.estimatedProfit && (
                      <div className="pt-2 mt-1 border-t">
                        <div className="text-xs text-muted-foreground mb-1">Reseller Information</div>
                        <div className="flex justify-between">
                          <span>Est. Profit Margin:</span>
                          <span className="text-green-600">~{product.estimatedProfit}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-sm text-green-700">
              Save <span className="font-bold">${savings.toFixed(2)}</span> with quantity of {quantity}
            </p>
            
            {/* Next discount tier prompt */}
            {nextDiscountTier && (
              <div className="text-xs text-blue-700 mt-1 pt-1 border-t border-green-200">
                <Award className="h-3 w-3 inline mr-1" />
                Add {nextDiscountTier.remaining} more for {nextDiscountTier.percent}% off!
              </div>
            )}
          </div>
        )}
        
        {/* Storage instructions (truncated) */}
        {product.storageInstructions && (
          <div className="mt-2 text-xs text-muted-foreground truncate">
            Store: {product.storageInstructions}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center border rounded-md w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQuantity}
            className="px-3"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <div className="flex-1 text-center font-medium">{quantity}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQuantity}
            className="px-3"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <Button onClick={handleAddToCart} className="w-full" disabled={isExpired(product)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {hasSavings ? `Add & Save $${savings.toFixed(2)}` : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
