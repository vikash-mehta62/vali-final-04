
export interface Product {
  id: string;
  _id?: string; // For MongoDB compatibility
  name: string;
  category: string;
  quantity: number;
  totalSell?: number;
  totalPurchase?: number;
  unit: string;
  price: number;
  threshold?: number;
  lastUpdated: string; // Added this as required since it's used everywhere
  description?: string;
  image?: string;
  bulkDiscounts?: BulkDiscount[];
  weightVariation?: number;
  expiryDate?: string;
  batchInfo?: string;
  origin?: string;
  organic?: boolean;
  storageInstructions?: string;
  boxSize?: number;
  shippinCost?: number;
  pricePerBox?: number;
  featuredOffer?: boolean;
  popularityRank?: number;
  estimatedProfit?: number;
  recommendedOrder?: number;
  enablePromotions?: boolean;
  palette?: string;
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercent: number;
  quantity?: number;
  discountPercentage?: number;
  _id?: string;
}
export interface Store {
  phone: number;
  
}
 interface PalletData {
  worker: string;
  palletCount: number;
  boxesPerPallet: Record<string, number>;
  totalBoxes: number;
  chargePerPallet: number;
  totalPalletCharge: number;
  selectedItems: string[];
}


export interface PaymentDetails {
  method?: 'cash' | 'creditcard' | 'cheque';
  transactionId?: string;  // Only required if payment method is 'creditcard'
  notes?: string;  
  paymentType?:  "full" | "partial";  
   
  amountPaid?: number;  
}

export interface Order {
  id: string;
  _id?: string;
  orderId?: string;
  orderNumber?: string;
  orderType?: string;
  store?: any;
  customer?: string;
  date: string;
  createdAt?: string;
  creditMemos?: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?:  string;
  paymentStatus: 'paid' | 'pending' | 'failed' | "partial";
  subtotal: number;
  tax?: number;
  paymentAmount?: number;
  shipping?: number;
  discount?: number;
  shippinCost?: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  clientName?: string;
  clientId?: string;
  palletData?:PalletData;
  paymentDetails?: PaymentDetails;  
   // 🆕 Soft delete support
  isDelete?: boolean;
  deleted?: {
    reason?: string;
    amount?: number;
  };


}

// Updated OrderItem with all possible properties used across the app
export interface OrderItem {
  product: string;
  name: string;
  pricingType?: string;
  quantity: number;
  price: number;
  productId?: string;
  productName?: string;
  unitPrice?: number;
  discountedPrice?: number;
  total?: number;
   deletedQuantity?: number;
  deletedTotal?: number;
}

export interface Address {
  street: string;
  address?: string;
  phone?: string;
  name?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Update StoreCategory to include "D" as a valid option
export type StoreCategory = "A" | "B" | "C" | "D";
export type StoreStatus = "active" | "inactive";
export type ShopStatus = "open" | "closed" | "busy";

export interface StoreLocation {
  lat: number;
  lng: number;
}

export interface StoreFilters {
  category?: StoreCategory;
  searchTerm?: string;
  status?: StoreStatus;
}

// Update Reorder status to include "shipped"
export interface Reorder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: "pending" | "ordered" | "received" | "cancelled" | "shipped";
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
  lastOrder?: string;
  totalSpent?: number;
  isShop?: boolean;
  shopStatus?: ShopStatus;
  category?: StoreCategory;
  location?: StoreLocation;
  address?: string;
  city?: string;
  zipCode?: string;
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

// 🆕 Smart State-Based Management Types
export interface StateWarehouse {
  id: string;
  state: string;
  name: string;
  address: Address;
  capacity: number;
  currentStock: number;
  zones: WarehouseZone[];
  deliveryRadius: number; // miles
  operatingHours: {
    open: string;
    close: string;
    timezone: string;
  };
  isActive: boolean;
  manager?: string;
  phone?: string;
}

export interface WarehouseZone {
  id: string;
  name: string; // "Receiving", "Cold Storage", "Dry Storage", "Shipping"
  temperature?: number;
  capacity: number;
  products: string[]; // product IDs
  currentUtilization: number;
}

export interface SmartRoute {
  id: string;
  state: string;
  warehouse: string;
  stops: RouteStop[];
  optimizedDistance: number;
  estimatedTime: number;
  fuelCost: number;
  driver?: string;
  vehicle?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledDate: string;
}

export interface RouteStop {
  orderId: string;
  client: Client;
  address: Address;
  deliveryWindow: {
    start: string;
    end: string;
  };
  products: OrderItem[];
  estimatedDuration: number; // minutes
  priority: 'high' | 'medium' | 'low';
  sequence: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface StateInventoryMetrics {
  state: string;
  totalInventoryValue: number;
  totalProducts: number;
  lowStockItems: number;
  pendingOrders: number;
  todayDeliveries: number;
  routeEfficiency: number;
  warehouseUtilization: number;
}

export interface InventoryTransfer {
  id: string;
  fromWarehouse: string;
  toWarehouse: string;
  products: {
    productId: string;
    quantity: number;
    reason: string;
  }[];
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  requestedBy: string;
  createdAt: string;
  estimatedArrival?: string;
}
