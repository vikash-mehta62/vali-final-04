
// This file re-exports all data-related functionality from the refactored modules
// to maintain backward compatibility with existing code

// Re-export all types
export * from '../types';

// Re-export mock data
export * from '../data/mockData';

// Re-export product operations
export * from '../data/productData';

// Re-export client operations
export * from '../data/clientData';

// Re-export order operations
export * from '../data/orderData';

// Re-export reorder operations
export * from '../data/reorderData';

// Re-export activity operations
export * from '../data/activityData';

// Re-export formatting utilities
export * from '../utils/formatters';

// Re-export the helper functions - fix ambiguity by explicitly naming exports
export { 
  getRecentOrders, 
  getOrderCountByStatus, 
  getTotalInventoryValue, 
  getLowStockProducts ,
  getReorders
} from '../data/mockData';
