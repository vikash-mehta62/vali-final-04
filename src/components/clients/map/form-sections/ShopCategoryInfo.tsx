
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ShopFormValues } from '../ShopFormTypes';
import { StoreCategory } from '@/types';

interface ShopCategoryInfoProps {
  form: UseFormReturn<ShopFormValues>;
}

const ShopCategoryInfo: React.FC<ShopCategoryInfoProps> = ({ form }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return 'text-blue-500';
      case 'B': return 'text-purple-500';
      case 'C': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Store Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <div className="flex items-center">
                <Store 
                  className={`h-4 w-4 absolute ml-2 z-10 ${getCategoryColor(field.value)}`} 
                />
                <SelectTrigger className="pl-8">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent>
              <SelectItem value="A" className="flex items-center">
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-blue-500" />
                  Category A
                </div>
              </SelectItem>
              <SelectItem value="B" className="flex items-center">
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-purple-500" />
                  Category B
                </div>
              </SelectItem>
              <SelectItem value="C" className="flex items-center">
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-orange-500" />
                  Category C
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Select the store's category classification (A, B, or C)
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ShopCategoryInfo;
