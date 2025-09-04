
import { Database } from '@/integrations/supabase/types';

// Define types based on the database tables
export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ClientRow = Database['public']['Tables']['clients']['Row'];
export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
export type ReorderRow = Database['public']['Tables']['reorders']['Row'];
export type ActivityRow = Database['public']['Tables']['activities']['Row'];
export type BulkDiscountRow = Database['public']['Tables']['bulk_discounts']['Row'];

// Define insert types
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
export type ReorderInsert = Database['public']['Tables']['reorders']['Insert'];
export type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
export type BulkDiscountInsert = Database['public']['Tables']['bulk_discounts']['Insert'];

// Define update types
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update'];
export type ReorderUpdate = Database['public']['Tables']['reorders']['Update'];
export type ActivityUpdate = Database['public']['Tables']['activities']['Update'];
export type BulkDiscountUpdate = Database['public']['Tables']['bulk_discounts']['Update'];

// Define types for expenses (when added to Supabase)
export interface ExpenseRow {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  payee?: string;
  recurring?: boolean;
  recurring_frequency?: string;
  reference?: string;
}

export interface ExpenseInsert {
  id?: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  payee?: string;
  recurring?: boolean;
  recurring_frequency?: string;
  reference?: string;
}

export interface ExpenseUpdate {
  id?: string;
  category?: string;
  amount?: number;
  description?: string;
  date?: string;
  payee?: string;
  recurring?: boolean;
  recurring_frequency?: string;
  reference?: string;
}

// Add Supabase auth types
export interface UserMetadata {
  owner_name?: string;
  store_name?: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
    user_metadata: UserMetadata;
  };
}
