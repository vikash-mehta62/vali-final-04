
import { Reorder } from '../types';
import { reorders } from './mockData';
import { products } from './mockData';

export const createReorder = (reorderData: Omit<Reorder, 'id' | 'dateCreated' | 'expectedDelivery' | 'status'>): Reorder => {
  const today = new Date();
  const expectedDate = new Date(today);
  expectedDate.setDate(today.getDate() + (reorderData.expedited ? 2 : 5));
  
  const newReorder: Reorder = {
    id: `r${String(reorders.length + 1).padStart(3, '0')}`,
    dateCreated: today.toISOString().split('T')[0],
    expectedDelivery: expectedDate.toISOString().split('T')[0],
    status: 'pending',
    ...reorderData
  };
  
  reorders.unshift(newReorder);
  return newReorder;
};

export const getReorders = (status?: Reorder['status']): Reorder[] => {
  if (status) {
    return reorders.filter(r => r.status === status);
  }
  return reorders;
};

export const getProductReorders = (productId: string): Reorder[] => {
  return reorders.filter(r => r.productId === productId);
};

export const updateReorderStatus = (reorderId: string, newStatus: Reorder['status']): Reorder | undefined => {
  const reorderIndex = reorders.findIndex(r => r.id === reorderId);
  if (reorderIndex !== -1) {
    reorders[reorderIndex].status = newStatus;
    
    // If the reorder is received, update product quantity
    if (newStatus === 'received') {
      const productIndex = products.findIndex(p => p.id === reorders[reorderIndex].productId);
      if (productIndex !== -1) {
        products[productIndex].quantity += reorders[reorderIndex].quantity;
        products[productIndex].lastUpdated = new Date().toISOString().split('T')[0];
      }
    }
    
    return reorders[reorderIndex];
  }
  return undefined;
};
