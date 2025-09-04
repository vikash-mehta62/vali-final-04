
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Store, Building } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ShopFormValues } from '../ShopFormTypes';

interface ShopBasicInfoProps {
  form: UseFormReturn<ShopFormValues>;
}

const ShopBasicInfo: React.FC<ShopBasicInfoProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Shop Name</FormLabel>
            <FormControl>
              <div className="flex items-center relative">
                <Store className="h-4 w-4 absolute left-3 text-muted-foreground" />
                <Input placeholder="Enter shop name" className="pl-9" {...field} />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Company</FormLabel>
            <FormControl>
              <div className="flex items-center relative">
                <Building className="h-4 w-4 absolute left-3 text-muted-foreground" />
                <Input placeholder="Enter company name" className="pl-9" {...field} />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ShopBasicInfo;
