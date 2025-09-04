import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, ShoppingCart, Tag, Percent, ArrowDown, Star, TrendingUp, 
  Clock, Zap, Info, DollarSign, Award, ThumbsUp, Sparkles,
  PieChart, LineChart, BarChart3, Plus, Minus
} from 'lucide-react';
import { Product } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CategoryFilter from '../CategoryFilter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculatePotentialSavings, getRecommendedQuantity } from '@/data/productData';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryItemCount, setCategoryItemCount] = useState<Record<string, number>>({});
  
  // Extract unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];

  // Initialize recommended quantities when products load
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    products.forEach(product => {
      // Set initial quantity to recommended quantity if available
      initialQuantities[product.id] = product.recommendedOrder || 
                                       getRecommendedQuantity(product) || 0;
    });
    setQuantities(initialQuantities);
  }, [products]);

  // Filter products based on search, category, and tab
  useEffect(() => {
    const filtered = products.filter(product => {
      // Apply category filter if not 'all'
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Apply search filter
      const searchMatch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.origin && product.origin.toLowerCase().includes(searchTerm.toLowerCase()));

      // Apply tab filter
      const tabMatch = 
        activeTab === 'all' || 
        (activeTab === 'featured' && product.featuredOffer) ||
        (activeTab === 'bestsellers' && product.popularityRank && product.popularityRank <= 5) ||
        (activeTab === 'bulk-deals' && product.bulkDiscounts && product.bulkDiscounts.length > 0);
      
      return categoryMatch && searchMatch && tabMatch;
    });
    
    setFilteredProducts(filtered);
    
    // Update category counts
    const counts: Record<string, number> = { all: filtered.length };
    filtered.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    setCategoryItemCount(counts);
  }, [products, searchTerm, selectedCategory, activeTab]);

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity >= 0) {
      setQuantities({
        ...quantities,
        [productId]: quantity
      });
    }
  };

  const getQuantity = (productId: string) => {
    return quantities[productId] || 0;
  };

  const handleAddToCart = (product: Product) => {
    const quantity = getQuantity(product.id);
    if (quantity > 0) {
      onAddToCart(product, quantity);
      
      // Reset quantity after adding to cart
      setQuantities({
        ...quantities,
        [product.id]: 0
      });
    }
  };

  // Calculate discounted price based on quantity
  const getDiscountedPrice = (product: Product, quantity: number) => {
    if (product.bulkDiscounts && product.bulkDiscounts.length > 0) {
      // Sort discounts by minQuantity in descending order to get the highest applicable discount
      const sortedDiscounts = [...product.bulkDiscounts].sort((a, b) => b.minQuantity - a.minQuantity);
      
      // Find the first discount that applies based on quantity
      for (const discount of sortedDiscounts) {
        if (quantity >= discount.minQuantity) {
          return product.price * (1 - (discount.discountPercent / 100));
        }
      }
    }
    return product.price;
  };

  // Calculate savings based on quantity and discount
  const calculateSavings = (product: Product, quantity: number) => {
    const regularPrice = product.price * quantity;
    const discountedPrice = getDiscountedPrice(product, quantity) * quantity;
    return regularPrice - discountedPrice;
  };

  // Get the highest discount percentage for a product
  const getHighestDiscount = (product: Product) => {
    if (product.bulkDiscounts && product.bulkDiscounts.length > 0) {
      return Math.max(...product.bulkDiscounts.map(d => d.discountPercent));
    }
    return 0;
  };

  // Quick add preset quantities
  const presetQuantities = [5, 10, 25, 50, 100];
  
  const handleQuickAdd = (productId: string, quantity: number) => {
    setQuantities({
      ...quantities,
      [productId]: quantity
    });
  };

  // Set quantity to recommended amount
  const handleUseRecommended = (productId: string, recommendedQty: number) => {
    setQuantities({
      ...quantities,
      [productId]: recommendedQty
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products by name, category, or origin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory}
              itemCounts={categoryItemCount}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>All Products</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>Featured</span>
            </TabsTrigger>
            <TabsTrigger value="bestsellers" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Best Sellers</span>
            </TabsTrigger>
            <TabsTrigger value="bulk-deals" className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              <span>Bulk Deals</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Zap className="h-3.5 w-3.5 mr-1" />
                {filteredProducts.length} products available
              </Badge>
              
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Up to {Math.max(...products.map(p => 
                  p.bulkDiscounts ? Math.max(...p.bulkDiscounts.map(d => d.discountPercent)) : 0
                ))}% savings
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="flex items-center gap-1"
              >
                {showRecommendations ? 
                  <ThumbsUp className="h-3.5 w-3.5" /> : 
                  <Info className="h-3.5 w-3.5" />
                }
                {showRecommendations ? "Hide Recommendations" : "Show Recommendations"}
              </Button>
            </div>
          </div>
          
          {/* Content for all tabs */}
          {renderProductGrid()}
        </Tabs>
      </div>
      
      {/* Bulk Savings Explainer */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-8">
        <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
          <PieChart className="h-5 w-5" />
          <h3>Wholesale Profit Maximization Guide</h3>
        </div>
        <p className="text-blue-600 text-sm mb-4">
          Our tiered wholesale pricing structure lets you maximize your profits. The more you buy, the higher your margins!
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          <div className="bg-white p-3 rounded border border-blue-100 text-center">
            <p className="text-sm font-semibold text-blue-700 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Small Order
            </p>
            <p className="text-xs text-blue-600">5-24 units</p>
            <p className="text-xs text-blue-600">5-10% off</p>
            <p className="text-xs text-green-600 font-semibold mt-1">~15-20% Profit</p>
          </div>
          <div className="bg-white p-3 rounded border border-blue-100 text-center">
            <p className="text-sm font-semibold text-blue-700 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Medium Order
            </p>
            <p className="text-xs text-blue-600">25-49 units</p>
            <p className="text-xs text-blue-600">10-15% off</p>
            <p className="text-xs text-green-600 font-semibold mt-1">~20-30% Profit</p>
          </div>
          <div className="bg-white p-3 rounded border border-blue-100 text-center relative">
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-green-500 text-white">
                <ThumbsUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            </div>
            <p className="text-sm font-semibold text-blue-700 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Large Order
            </p>
            <p className="text-xs text-blue-600">50-99 units</p>
            <p className="text-xs text-blue-600">15-20% off</p>
            <p className="text-xs text-green-600 font-semibold mt-1">~30-40% Profit</p>
          </div>
          <div className="bg-white p-3 rounded border border-blue-100 text-center relative">
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-orange-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Best Value
              </Badge>
            </div>
            <p className="text-sm font-semibold text-blue-700 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Volume Order
            </p>
            <p className="text-xs text-blue-600">100+ units</p>
            <p className="text-xs text-blue-600">20-30% off</p>
            <p className="text-xs text-green-600 font-semibold mt-1">~40-50% Profit</p>
          </div>
        </div>
      </div>

      {products.some(p => p.bulkDiscounts && p.bulkDiscounts.length > 0) && (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-2">
          <div className="flex items-center gap-2 text-orange-700 font-medium mb-2">
            <Clock className="h-5 w-5" />
            <h3>Limited Time Promotion</h3>
          </div>
          <p className="text-orange-600 text-sm">
            <span className="font-semibold">EXCLUSIVE OFFER:</span> Orders over $1000 get free expedited shipping <span className="font-semibold">PLUS</span> a 5% additional discount! Promotion ends this Friday.
          </p>
        </div>
      )}
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No products found matching your search or filters.
        </div>
      )}
    </div>
  );

  function renderProductGrid() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const currentQuantity = getQuantity(product.id);
          const hasDiscount = product.bulkDiscounts && product.bulkDiscounts.length > 0;
          const highestDiscountPercent = hasDiscount ? getHighestDiscount(product) : 0;
          const currentDiscountedPrice = getDiscountedPrice(product, currentQuantity);
          const savings = calculateSavings(product, currentQuantity);
          const hasCurrentDiscount = currentDiscountedPrice < product.price;
          const recommendedQuantity = product.recommendedOrder || getRecommendedQuantity(product);
          const potentialSavings = calculatePotentialSavings(product, recommendedQuantity);
          
          // Calculate estimated profit at current quantity
          const estimatedProfitPercent = product.estimatedProfit || 30; // Default to 30% if not specified
          let effectivePrice = currentDiscountedPrice;
          let estimatedRetailPrice = effectivePrice * (1 + estimatedProfitPercent / 100);
          let estimatedProfitAmount = (estimatedRetailPrice - effectivePrice) * currentQuantity;
          
          return (
            <Card key={product.id} className="overflow-hidden group hover:shadow-md transition-all border-muted">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img 
                  src={`https://source.unsplash.com/400x300/?${product.category.toLowerCase()},${product.name.toLowerCase()}`}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {hasDiscount && (
                  <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-white">
                    <Percent className="h-3.5 w-3.5 mr-1" />
                    Up to {highestDiscountPercent}% OFF
                  </Badge>
                )}
                {product.featuredOffer && (
                  <Badge variant="outline" className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                    Featured
                  </Badge>
                )}
                {product.popularityRank && product.popularityRank <= 3 && (
                  <Badge className="absolute bottom-2 right-2 bg-purple-500 text-white">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    Top {product.popularityRank}
                  </Badge>
                )}
                <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm">
                  {product.category}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.origin && (
                      <p className="text-xs text-muted-foreground">Origin: {product.origin}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
                    {product.unit}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <div className="text-xl font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per {product.unit}
                    </div>
                  </div>
                  
                  {/* Estimated profit display */}
                  {product.estimatedProfit && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-sm text-green-700 gap-1 bg-green-50 px-2 py-1 rounded-md w-fit">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>~{product.estimatedProfit}% Profit Margin</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Estimated profit margin for resale</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {hasDiscount && (
                    <div className="mt-1">
                      {product.bulkDiscounts.map((discount, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center text-sm ${
                            currentQuantity >= discount.minQuantity 
                              ? 'text-green-700 font-medium'
                              : 'text-muted-foreground'
                          } mb-1`}
                        >
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          Buy {discount.minQuantity}+ for ${(product.price * (1 - discount.discountPercent / 100)).toFixed(2)} each ({discount.discountPercent}% off)
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Recommended order section */}
                  {showRecommendations && recommendedQuantity > 0 && (
                    <div className="bg-blue-50 rounded-md p-2 mt-1 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-blue-700 flex items-center">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          <span>Popular Order: {recommendedQuantity} units</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 text-xs p-0 px-2 text-blue-700 hover:bg-blue-100"
                          onClick={() => handleUseRecommended(product.id, recommendedQuantity)}
                        >
                          Use
                        </Button>
                      </div>
                      {potentialSavings > 0 && (
                        <p className="text-xs text-blue-700 mt-1">
                          Save ${potentialSavings.toFixed(2)} with this quantity!
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Quick add buttons */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {presetQuantities.map(qty => (
                      <Button
                        key={qty}
                        variant="outline"
                        size="sm"
                        className={`px-2 py-0 h-7 text-xs ${currentQuantity === qty ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => handleQuickAdd(product.id, qty)}
                      >
                        {qty}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Display current savings if applicable */}
                  {currentQuantity > 0 && hasCurrentDiscount && (
                    <div className="bg-green-50 rounded-md p-2 mt-2 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-green-700">
                          <span className="font-medium">Current Price:</span> ${currentDiscountedPrice.toFixed(2)} each
                        </div>
                        <Popover>
                          <PopoverTrigger>
                            <Info className="h-4 w-4 text-green-500" />
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Your Order Details</h4>
                              <div className="grid grid-cols-2 gap-1 text-sm">
                                <div>Regular Price:</div>
                                <div className="text-right">${(product.price * currentQuantity).toFixed(2)}</div>
                                <div>Discounted Price:</div>
                                <div className="text-right">${(currentDiscountedPrice * currentQuantity).toFixed(2)}</div>
                                <div className="font-medium">Total Savings:</div>
                                <div className="text-right font-medium text-green-600">${savings.toFixed(2)}</div>
                                <div className="pt-2 font-medium">Est. Profit (Resale):</div>
                                <div className="pt-2 text-right font-medium text-green-600">${estimatedProfitAmount.toFixed(2)}</div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <div className="text-sm font-semibold text-green-700">
                          You save ${savings.toFixed(2)}!
                        </div>
                        <div className="text-sm font-semibold text-green-700">
                          Est. profit: ${estimatedProfitAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-2 pt-2">
                <Input
                  type="number"
                  min="0"
                  value={getQuantity(product.id)}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  className="w-20"
                />
                <Button 
                  onClick={() => handleAddToCart(product)}
                  disabled={getQuantity(product.id) <= 0}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }
};

export default ProductList;
