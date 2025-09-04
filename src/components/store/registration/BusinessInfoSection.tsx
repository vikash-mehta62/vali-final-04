
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Store, UserRound, Mail, Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { StoreRegistrationValues } from './types';

interface BusinessInfoSectionProps {
  form: UseFormReturn<StoreRegistrationValues>;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Business Information</h2>
      
      <FormField
        control={form.control}
        name="storeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Store Name</FormLabel>
            <FormControl>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Store className="h-4 w-4" />
                </span>
                <Input 
                  placeholder="Your Store Name" 
                  className="rounded-l-none" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Owner Name</FormLabel>
            <FormControl>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <UserRound className="h-4 w-4" />
                </span>
                <Input 
                  placeholder="Owner's Full Name" 
                  className="rounded-l-none" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <Input 
                  type="email" 
                  placeholder="contact@yourstore.com" 
                  className="rounded-l-none" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Phone className="h-4 w-4" />
                </span>
                <Input 
                  placeholder="(555) 123-4567" 
                  className="rounded-l-none" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="businessDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your business..." 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessInfoSection;
