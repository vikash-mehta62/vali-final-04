
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ShopFormValues } from '../ShopFormTypes';
import { getClientStates } from '@/data/clientData';

interface ShopLocationInfoProps {
  form: UseFormReturn<ShopFormValues>;
}

const ShopLocationInfo: React.FC<ShopLocationInfoProps> = ({ form }) => {
  const states = getClientStates();
  
  return (
    <FormField
      control={form.control}
      name="state"
      render={({ field }) => (
        <FormItem>
          <FormLabel>State</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 absolute ml-2 z-10 text-muted-foreground" />
                <SelectTrigger className="pl-8">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Shop will be placed on the map based on state
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ShopLocationInfo;
