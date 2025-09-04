
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/data';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Truck, Package, History, Clock } from 'lucide-react';

// Define the form schema
const reorderFormSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  expedited: z.boolean().default(false),
});

type ReorderFormValues = z.infer<typeof reorderFormSchema>;

interface ReorderFormProps {
  product: Product;
  onSuccess: () => void;
  onReorder: (values: ReorderFormValues) => void;
}

const ReorderForm: React.FC<ReorderFormProps> = ({ product, onSuccess, onReorder }) => {
  const { toast } = useToast();
  
  // Setup form with default values
  const form = useForm<ReorderFormValues>({
    resolver: zodResolver(reorderFormSchema),
    defaultValues: {
      productId: product.id,
      quantity: Math.max(product.threshold * 2 - product.quantity, 10), // Suggested quantity
      supplier: "",
      notes: "",
      expedited: false,
    },
  });

  const onSubmit = (values: ReorderFormValues) => {
    onReorder(values);
    onSuccess();

    toast({
      title: "Reorder Created",
      description: `Reordered ${values.quantity} ${product.unit} of ${product.name}`,
    });
  };

  // Calculate estimated delivery date based on expedited or standard shipping
  const getEstimatedDelivery = () => {
    const expedited = form.watch("expedited");
    const today = new Date();
    let deliveryDate = new Date(today);
    
    // Add days based on shipping method
    deliveryDate.setDate(today.getDate() + (expedited ? 2 : 5));
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-md">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">Current stock: {product.quantity} {product.unit}</p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Quantity ({product.unit})</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Recommended: {Math.max(product.threshold * 2 - product.quantity, 10)} {product.unit}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter supplier name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special instructions or notes" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expedited"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Expedited Shipping</FormLabel>
                <FormDescription>
                  Prioritize this order for faster delivery
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2 mt-4 p-3 bg-muted/50 rounded-md">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Estimated delivery: {getEstimatedDelivery()}</span>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">
            <Truck className="mr-2 h-4 w-4" />
            Create Reorder
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReorderForm;
