
import { StoreCategory, ShopStatus } from '@/types';

export interface ShopFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  state: string;
  isShop: boolean;
  shopStatus: ShopStatus;
  category: StoreCategory;
}
