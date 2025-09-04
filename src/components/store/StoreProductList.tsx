
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from './CartContext';
import { 
  Search, 
  ShoppingCart, 
  Tag, 
  Percent, 
  Plus, 
  Minus,
  Info
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

interface BulkDiscount {
  minQuantity: number;
  discountPercent: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  shippinCost?: number;
  pricePerBox?: number;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  image?: string;
  bulkDiscount?: BulkDiscount[];
}

interface StoreProductListProps {
  products: Product[];
}

const StoreProductList: React.FC<StoreProductListProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];
  
  // Filter products based on search term and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product._id] || 1;
    
    if (quantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    // Find applicable discount
    let discountPercentage: number | undefined = undefined;
    
    if (product.bulkDiscount && product.bulkDiscount.length > 0) {
      // Sort discounts in descending order by minQuantity
      const sortedDiscounts = [...product.bulkDiscount].sort((a, b) => b.minQuantity - a.minQuantity);
      
      // Find the first applicable discount
      for (const discount of sortedDiscounts) {
        if (quantity >= discount.minQuantity) {
          discountPercentage = discount.discountPercent;
          break;
        }
      }
    }
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.pricePerBox,
      quantity,
      image: product.image || `https://source.unsplash.com/400x300/?${product.category.toLowerCase()}`,
      category: product.category,
      discountPercentage,
      shippinCost:product.shippinCost || 0
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
    
    // Reset quantity
    setQuantities(prev => ({
      ...prev,
      [product._id]: 1
    }));
  };
  
  // Handle quantity change
  const incrementQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };
  
  const decrementQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1)
    }));
  };
  
  const getQuantity = (productId: string) => {
    return quantities[productId] || 1;
  };
  
  // Calculate discounted price for display
  const getDiscountedPrice = (product: Product, quantity: number) => {
    if (!product.bulkDiscount || product.bulkDiscount.length === 0) {
      return product.pricePerBox;
    }
    
    // Sort discounts and find applicable one
    const sortedDiscounts = [...product.bulkDiscount].sort((a, b) => b.minQuantity - a.minQuantity);
    
    for (const discount of sortedDiscounts) {
      if (quantity >= discount.minQuantity) {
        return product.pricePerBox * (1 - discount.discountPercent / 100);
      }
    }
    
    return product.pricePerBox;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const quantity = getQuantity(product._id);
            const hasBulkDiscount = product.bulkDiscount && product.bulkDiscount.length > 0;
            const discountedPrice = getDiscountedPrice(product, quantity);
            const isDiscounted = discountedPrice < product.pricePerBox;
            
            return (
              <Card key={product._id} className="overflow-hidden group transition-all hover:shadow-md">
                <div className="aspect-video relative bg-muted overflow-hidden">
                  <img 
                    src={product.image || `https://source.unsplash.com/400x300/?${product.category.toLowerCase()}`}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {hasBulkDiscount && (
                    <Badge className="absolute top-2 right-2 bg-primary text-white">
                      <Percent className="h-3 w-3 mr-1" />
                      Bulk Discounts
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm">
                    {product.category}
                  </Badge>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                    <Badge variant="outline">{product.unit}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <div className="flex items-baseline space-x-2 mb-2">
                    {isDiscounted ? (
                      <>
                        <span className="text-xl font-bold">${discountedPrice.toFixed(2)}</span>
                        <span className="text-muted-foreground line-through">${product.pricePerBox.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">${product.pricePerBox.toFixed(2)}</span>
                    )}
                    <span className="text-sm text-muted-foreground">/{product.unit}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Bulk discount details */}
                  {hasBulkDiscount && (
                    <div className="mt-3">
                      <p className="text-sm font-medium flex items-center mb-1">
                        <Tag className="h-4 w-4 mr-1 text-primary" />
                        Bulk Discounts Available
                      </p>
                      <div className="text-sm space-y-1 bg-muted/40 p-2 rounded">
                        {product.bulkDiscount.map((discount, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center ${quantity >= discount.minQuantity ? 'text-green-600 font-semibold' : 'text-muted-foreground'}`}
                          >
                            <Percent className="h-3 w-3 inline mr-1" />
                            {discount.minQuantity}+ units: {discount.discountPercent}% off  
                            {quantity >= discount.minQuantity && " (Applied)"}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                  <div className="flex items-center border rounded-md w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => decrementQuantity(product._id)}
                      className="px-3"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <div className="flex-1 text-center font-medium">{quantity}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => incrementQuantity(product._id)}
                      className="px-3"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => handleAddToCart(product)} 
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isDiscounted 
                      ? `Add with ${Math.round((1 - discountedPrice/product.pricePerBox) * 100)}% Off` 
                      : 'Add to Cart'
                    }
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StoreProductList;
