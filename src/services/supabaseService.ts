
import { supabase } from '@/integrations/supabase/client';
import {
  ProductRow, ProductInsert, ProductUpdate,
  ClientRow, ClientInsert, ClientUpdate,
  OrderRow, OrderInsert, OrderUpdate,
  OrderItemRow, OrderItemInsert, OrderItemUpdate,
  ReorderRow, ReorderInsert, ReorderUpdate,
  ActivityRow, ActivityInsert,
  BulkDiscountRow, BulkDiscountInsert, BulkDiscountUpdate
} from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

// Product services
export const productService = {
  getAll: async (): Promise<ProductRow[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch products: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    return data || [];
  },
  
  getById: async (id: string): Promise<ProductRow | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to fetch product: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    return data;
  },
  
  create: async (product: ProductInsert): Promise<ProductRow> => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: `Failed to create product: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product created successfully',
    });
    
    return data;
  },
  
  update: async (id: string, product: ProductUpdate): Promise<ProductRow> => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating product ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to update product: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product updated successfully',
    });
    
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to delete product: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Product deleted successfully',
    });
  }
};

// Client services
export const clientService = {
  getAll: async (): Promise<ClientRow[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch clients: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    return data || [];
  },
  
  getById: async (id: string): Promise<ClientRow | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to fetch client: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    return data;
  },
  
  create: async (client: ClientInsert): Promise<ClientRow> => {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Error',
        description: `Failed to create client: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Client created successfully',
    });
    
    return data;
  },
  
  update: async (id: string, client: ClientUpdate): Promise<ClientRow> => {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to update client: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Client updated successfully',
    });
    
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to delete client: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Client deleted successfully',
    });
  }
};

// Add similar services for orders, order items, reorders, activities, and bulk discounts as needed
