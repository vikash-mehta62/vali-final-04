import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Contact } from '@/contexts/ContactsContext';

const businessCategories = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'store', label: 'Store' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'catering', label: 'Catering' },
  { value: 'other', label: 'Other' },
];

const subcategories = {
  restaurant: [
    { value: 'indian', label: 'Indian' },
    { value: 'italian', label: 'Italian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'american', label: 'American' },
    { value: 'other', label: 'Other' },
  ],
  store: [
    { value: 'a', label: 'Category A (Premium)' },
    { value: 'b', label: 'Category B (Standard)' },
    { value: 'c', label: 'Category C (Economy)' },
    { value: 'specialty', label: 'Specialty' },
    { value: 'organic', label: 'Organic' },
  ],
  wholesale: [
    { value: 'large', label: 'Large Volume' },
    { value: 'medium', label: 'Medium Volume' },
    { value: 'small', label: 'Small Volume' },
  ],
  distributor: [
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
    { value: 'international', label: 'International' },
  ],
  hotel: [
    { value: 'luxury', label: 'Luxury' },
    { value: 'midrange', label: 'Mid-Range' },
    { value: 'budget', label: 'Budget' },
  ],
  catering: [
    { value: 'events', label: 'Events' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'school', label: 'School/Institution' },
  ],
  other: [
    { value: 'other', label: 'Other' },
  ],
};

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  type: z.string(),
  status: z.string(),
  tags: z.string(),
  businessCategory: z.string().min(1, 'Business category is required'),
  businessSubcategory: z.string().optional(),
  purchaseVolume: z.string().optional(),
  preferredDeliveryDay: z.string().optional(),
});

interface ContactFormProps {
  contact: Contact | null;
  onSubmit: (data: any) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSubmit }) => {
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState(
    contact?.businessCategory || 'restaurant'
  );

  const defaultValues = contact ? {
    ...contact,
    tags: contact.tags.join(', '),
    businessCategory: contact.businessCategory || '',
    businessSubcategory: contact.businessSubcategory || '',
    purchaseVolume: contact.purchaseVolume || '',
    preferredDeliveryDay: contact.preferredDeliveryDay || '',
  } : {
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'lead',
    status: 'new',
    tags: '',
    businessCategory: '',
    businessSubcategory: '',
    purchaseVolume: '',
    preferredDeliveryDay: '',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSubmit({
      id: contact?.id,
      ...data,
      tags,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Smith" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Acme Corp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="john@example.com" />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(555) 123-4567" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="businessCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedBusinessCategory(value);
                    form.setValue('businessSubcategory', '');
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {businessCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessSubcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedBusinessCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedBusinessCategory && subcategories[selectedBusinessCategory as keyof typeof subcategories]?.map((subcategory) => (
                      <SelectItem key={subcategory.value} value={subcategory.value}>
                        {subcategory.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
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
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="purchaseVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Volume</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purchase volume" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">High Volume (&gt; 500kg/week)</SelectItem>
                    <SelectItem value="medium">Medium Volume (100-500kg/week)</SelectItem>
                    <SelectItem value="low">Low Volume (&lt; 100kg/week)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredDeliveryDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Delivery Day</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="VIP, Enterprise, Referral" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit">
            {contact ? 'Update Contact' : 'Add Contact'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
