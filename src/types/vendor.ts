
export type VendorType = 'farmer' | 'supplier' | 'distributor' | 'other';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  products?: string[]; // List of product IDs typically supplied
  notes?: string;
  rating?: number; // 1-5 rating
  activeStatus: 'active' | 'inactive';
  createdAt: string;
}

export interface VendorPurchase {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  createdAt?: string;
  status: 'pending' | 'received' | 'quality-check' | 'approved' | 'rejected';
  items: PurchaseItem[];
  totalAmount: number;
  purchaseOrderNumber?: string;
  deliveryDate?: string;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  qualityStatus?: 'pending' | 'approved' | 'rejected';
  qualityNotes?: string;
  batchNumber?: string;
}
