// Core data types for the application
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  threshold: number;
  lastUpdated: string;
  palette?: string;
  bulkDiscounts?: BulkDiscount[];
  image?: string;
  weightVariation?: number; // Variation in weight (percentage)
  expiryDate?: string; // Expiry date for perishable products
  batchInfo?: string; // Information about the product batch
  origin?: string; // Country/region of origin
  organic?: boolean; // Whether the product is organic
  storageInstructions?: string; // How to store the product
  pricePerBox?: number; // Price per box of product
  boxSize?: number; // Size of box in units (e.g., lb)
  featuredOffer?: boolean; // Whether this product is featured as a special offer
  popularityRank?: number; // Popularity ranking
  recommendedOrder?: number; // Recommended order quantity based on historical data
  estimatedProfit?: number; // Estimated profit margin for resellers
  seasonalAvailability?: string; // Seasonal availability information
}

// Update the BulkDiscount interface to have both property sets for compatibility
export interface BulkDiscount {
  minQuantity: number;
  discountPercent: number;
  // Legacy fields for compatibility with existing code
  quantity?: number;
  discountPercentage?: number;
}

export type StoreCategory = "A" | "B" | "C";
export type StoreStatus = "active" | "inactive";
export type ShopStatus = "open" | "closed" | "busy";

export interface StoreLocation {
  lat: number;
  lng: number;
}

export interface StoreFilters {
  category?: StoreCategory;
  status?: StoreStatus;
  searchTerm?: string;
}

export interface Reorder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: "pending" | "ordered" | "received" | "cancelled";
  dateCreated: string;
  expectedDelivery: string;
  supplier?: string;
  expedited: boolean;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  state: string;
  status: StoreStatus;
  lastOrder: string;
  totalSpent: number;
  isShop?: boolean;
  shopStatus?: ShopStatus;
  category?: StoreCategory;
  location?: StoreLocation;
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  store: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  clientId:any,
  clientName:any,
  
}

export interface Activity {
  id: string;
  type: "order" | "inventory" | "client" | "system";
  description: string;
  timestamp: string;
}

export interface AiInsight {
  id: string;
  type: "inventory" | "client" | "sales" | "general";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

// New interfaces for expense tracking
export type ExpenseCategory =
  | "shipping"
  | "salary"
  | "utilities"
  | "rent"
  | "supplies"
  | "maintenance"
  | "other";

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  payee?: string;
  recurring?: boolean;
  recurringFrequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  reference?: string; // For receipt or invoice reference
}

export interface WeeklyFinancialData {
  week: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  expenseBreakdown?: {
    shipping: number;
    salary: number;
    other: number;
  };
}
