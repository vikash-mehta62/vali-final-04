
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, ShoppingBag, Apple, Carrot, Package, Wheat, Fish, CakeSlice, Crown, Milk } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  itemCounts?: Record<string, number>;
  showBadges?: boolean;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  itemCounts = {},
  showBadges = true,
  className = ''
}) => {
  // Map of category name to icon and color
  const categoryIcons: Record<string, { icon: JSX.Element; color: string }> = {
    all: { icon: <ShoppingBag className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
    Fruits: { icon: <Apple className="h-4 w-4" />, color: "bg-red-100 text-red-700" },
    Vegetables: { icon: <Carrot className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
    Dairy: { icon: <Milk className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-700" },
    Pantry: { icon: <Package className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
    Grains: { icon: <Wheat className="h-4 w-4" />, color: "bg-orange-100 text-orange-700" },
    Seafood: { icon: <Fish className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
    Bakery: { icon: <CakeSlice className="h-4 w-4" />, color: "bg-amber-100 text-amber-700" },
    Premium: { icon: <Crown className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
  };

  // Default icon for unknown categories
  const defaultIcon = { icon: <ShoppingBag className="h-4 w-4" />, color: "bg-gray-100 text-gray-700" };

  const getCategoryDisplay = (category: string) => {
    return category === 'all' ? 'All Categories' : category;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-3 flex items-center">
        <Filter className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Product Categories</span>
      </div>
      <div className="mb-4">
        <Select value={selectedCategory} onValueChange={onSelectCategory}>
          <SelectTrigger className="w-full border-dashed bg-card">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {categories.map(category => {
              const { icon, color } = categoryIcons[category] || defaultIcon;
              const count = itemCounts[category] || 0;
              return (
                <SelectItem key={category} value={category} className="flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Badge variant="outline" className={`mr-2 ${color}`}>
                        {icon}
                      </Badge>
                      {getCategoryDisplay(category)}
                    </div>
                    {count > 0 && (
                      <Badge variant="outline" className="ml-auto">
                        {count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      {/* Show category chips for easy selection */}
      {showBadges && (
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const { icon, color } = categoryIcons[category] || defaultIcon;
            const count = itemCounts[category] || 0;
            const isSelected = selectedCategory === category;
            
            return (
              <Badge 
                key={category}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'bg-primary text-primary-foreground' : color
                }`}
                onClick={() => onSelectCategory(category)}
              >
                <span className="mr-1">{icon}</span>
                {category === 'all' ? 'All' : category}
                {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
