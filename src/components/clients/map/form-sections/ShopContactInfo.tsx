
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ShopFormValues } from '../ShopFormTypes';

interface ShopContactInfoProps {
  form: UseFormReturn<ShopFormValues>;
}

const ShopContactInfo: React.FC<ShopContactInfoProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Mail className="h-4 w-4 absolute ml-2 text-muted-foreground" />
                <Input placeholder="Email" className="pl-8" {...field} />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Phone className="h-4 w-4 absolute ml-2 text-muted-foreground" />
                <Input placeholder="Phone" className="pl-8" {...field} />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ShopContactInfo;
