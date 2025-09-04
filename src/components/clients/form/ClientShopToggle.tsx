
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Store } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from './ClientFormTypes';

interface ClientShopToggleProps {
  form: UseFormReturn<ClientFormValues>;
  onShopTypeChange: (checked: boolean) => void;
}

const ClientShopToggle: React.FC<ClientShopToggleProps> = ({ form, onShopTypeChange }) => {
  return (
    <div className="flex items-start space-x-2">
      <FormField
        control={form.control}
        name="isShop"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onShopTypeChange(checked as boolean);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center">
                <Store className="h-4 w-4 mr-1 text-muted-foreground" />
                This is a Shop/Store location
              </FormLabel>
              <FormDescription>
                Shops can be displayed on the map and included in route planning
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClientShopToggle;
