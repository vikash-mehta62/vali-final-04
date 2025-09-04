
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Tag, ShoppingCart, Percent, Leaf, Star, Search, X } from 'lucide-react';

interface ProductFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  showInStock: boolean;
  onShowInStockChange: (value: boolean) => void;
  showOnSale: boolean;
  onShowOnSaleChange: (value: boolean) => void;
  showOrganic: boolean;
  onShowOrganicChange: (value: boolean) => void;
  showPremium: boolean;
  onShowPremiumChange: (value: boolean) => void;
  showBulkDiscount: boolean;
  onShowBulkDiscountChange: (value: boolean) => void;
  maxPrice: number;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onResetFilters?: () => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  onPriceRangeChange,
  showInStock,
  onShowInStockChange,
  showOnSale,
  onShowOnSaleChange,
  showOrganic,
  onShowOrganicChange,
  showPremium,
  onShowPremiumChange,
  showBulkDiscount,
  onShowBulkDiscountChange,
  maxPrice = 100,
  searchTerm = '',
  onSearchChange,
  onResetFilters,
  className = ''
}) => {
  const activeFilterCount = [
    showInStock,
    showOnSale, 
    showOrganic, 
    showPremium, 
    showBulkDiscount
  ].filter(Boolean).length;

  const isPriceRangeDefault = priceRange[0] === 0 && priceRange[1] === maxPrice;

  return (
    <div className={`space-y-5 bg-white p-4 rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Filter Products</h3>
        </div>
        
        {(activeFilterCount > 0 || !isPriceRangeDefault || searchTerm) && onResetFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      
      {onSearchChange && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4"
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => onSearchChange('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Tag className="h-4 w-4 mr-2 text-blue-500" />
          Price Range
        </h3>
        <Slider 
          value={priceRange} 
          min={0} 
          max={maxPrice} 
          step={1} 
          onValueChange={onPriceRangeChange as (value: number[]) => void}
          className="my-5"
        />
        <div className="flex justify-between mt-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            ${priceRange[0].toFixed(2)}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            ${priceRange[1].toFixed(2)}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <ShoppingCart className="h-4 w-4 mr-2 text-purple-500" />
          Availability
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-stock" 
                checked={showInStock}
                onCheckedChange={(checked) => onShowInStockChange(!!checked)}
              />
              <Label htmlFor="in-stock" className="text-sm">In Stock</Label>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-600">Available</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="on-sale" 
                checked={showOnSale}
                onCheckedChange={(checked) => onShowOnSaleChange(!!checked)}
              />
              <Label htmlFor="on-sale" className="text-sm">On Sale</Label>
            </div>
            <Badge className="bg-red-500 text-white">Sale</Badge>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Star className="h-4 w-4 mr-2 text-amber-500" />
          Features
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="organic" 
                checked={showOrganic}
                onCheckedChange={(checked) => onShowOrganicChange(!!checked)}
              />
              <Label htmlFor="organic" className="text-sm">Organic</Label>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              <span>Organic</span>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="premium" 
                checked={showPremium}
                onCheckedChange={(checked) => onShowPremiumChange(!!checked)}
              />
              <Label htmlFor="premium" className="text-sm">Premium</Label>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">Premium</Badge>
          </div>
        </div>
      </div>
      
      <div className="pt-2 border-t">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Percent className="h-4 w-4 mr-2 text-orange-500" />
          Special Offers
        </h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="bulk-discount" className="text-sm">Show bulk discount items</Label>
          <Switch 
            id="bulk-discount" 
            checked={showBulkDiscount}
            onCheckedChange={onShowBulkDiscountChange}
          />
        </div>
      </div>
      
      <div className="pt-3 flex flex-wrap gap-2">
        {onResetFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onResetFilters}
            className={`${activeFilterCount === 0 && isPriceRangeDefault && !searchTerm ? 'opacity-50' : ''}`}
            disabled={activeFilterCount === 0 && isPriceRangeDefault && !searchTerm}
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
        
        <Badge className="py-1.5">
          {activeFilterCount} active filters
        </Badge>
      </div>
    </div>
  );
};

export default ProductFilters;
