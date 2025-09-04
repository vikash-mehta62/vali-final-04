
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ShopFormValues } from '../ShopFormTypes';

interface ShopStatusInfoProps {
  form: UseFormReturn<ShopFormValues>;
}

const ShopStatusInfo: React.FC<ShopStatusInfoProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="shopStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Shop Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="open" className="text-green-600">Open</SelectItem>
              <SelectItem value="busy" className="text-amber-600">Busy</SelectItem>
              <SelectItem value="closed" className="text-red-600">Closed</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Status will be shown with color on the map
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ShopStatusInfo;
