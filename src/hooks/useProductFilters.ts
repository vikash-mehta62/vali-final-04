
import { useState, useCallback, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  bulkDiscounts?: Array<{ minQuantity: number; discountPercent: number }>;
  organic?: boolean;
  [key: string]: any;
}

interface FilterOptions {
  priceRange?: [number, number];
  category?: string;
  showInStock?: boolean;
  showOnSale?: boolean;
  showOrganic?: boolean;
  showPremium?: boolean;
  showBulkDiscount?: boolean;
  searchTerm?: string;
}

export function useProductFilters(initialProducts: Product[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100],
    category: 'all',
    showInStock: true,
    showOnSale: false,
    showOrganic: false,
    showPremium: false,
    showBulkDiscount: false,
    searchTerm: '',
  });

  const updateFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 100],
      category: 'all',
      showInStock: true,
      showOnSale: false,
      showOrganic: false,
      showPremium: false,
      showBulkDiscount: false,
      searchTerm: '',
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Price range filter
      if (
        filters.priceRange && 
        (product.price < filters.priceRange[0] || product.price > filters.priceRange[1])
      ) {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // In stock filter
      if (filters.showInStock && product.quantity <= 0) {
        return false;
      }

      // On sale filter
      if (filters.showOnSale && (!product.bulkDiscounts || product.bulkDiscounts.length === 0)) {
        return false;
      }

      // Organic filter
      if (filters.showOrganic && !product.organic) {
        return false;
      }

      // Premium filter
      if (filters.showPremium && product.category !== 'Premium') {
        return false;
      }

      // Bulk discount filter
      if (filters.showBulkDiscount && (!product.bulkDiscounts || product.bulkDiscounts.length === 0)) {
        return false;
      }

      // Search term filter
      if (
        filters.searchTerm && 
        !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !product.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [initialProducts, filters]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProducts.length };
    
    initialProducts.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    
    return counts;
  }, [initialProducts]);

  // Get all unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(['all']);
    initialProducts.forEach(product => uniqueCategories.add(product.category));
    return Array.from(uniqueCategories);
  }, [initialProducts]);

  // Calculate highest price
  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...initialProducts.map(p => p.price), 0));
  }, [initialProducts]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredProducts,
    categories,
    categoryCounts,
    maxPrice
  };
}
