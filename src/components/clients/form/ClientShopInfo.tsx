
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from './ClientFormTypes';

interface ClientShopInfoProps {
  form: UseFormReturn<ClientFormValues>;
}

const ClientShopInfo: React.FC<ClientShopInfoProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border p-4 rounded-md bg-muted/20">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
              Store Category
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="A">Category A</SelectItem>
                <SelectItem value="B">Category B</SelectItem>
                <SelectItem value="C">Category C</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Classify the store by its category (A, B, or C)
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shopStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shop Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Current operating status of the shop
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClientShopInfo;
