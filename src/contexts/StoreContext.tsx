import React, { createContext, useContext, useState, useCallback } from 'react';
import { Client, StoreFilters, StoreCategory } from '@/types';

interface StoreContextType {
  stores: Client[];
  filters: StoreFilters;
  setStores: (stores: Client[]) => void;
  addStore: (store: Omit<Client, 'id'>) => void;
  updateStore: (id: string, updates: Partial<Client>) => void;
  deleteStore: (id: string) => void;
  setFilters: (filters: StoreFilters) => void;
  getFilteredStores: () => Client[];
}

// Demo data generation helper
const generateDemoStores = (count: number = 30): Client[] => {
  const states = [
    'CA', 'TX', 'FL', 'NY', 'IL', 
    'PA', 'OH', 'GA', 'NC', 'MI'
  ];
  
  const categories: StoreCategory[] = ['A', 'B', 'C'];
  const shopStatus = ['open', 'closed', 'busy'];
  const companyPrefixes = ['Metro', 'Valley', 'City', 'Urban', 'Capital', 'Golden', 'Silver', 'Pacific', 'Atlantic', 'Mountain'];
  const companyTypes = ['Market', 'Foods', 'Grocers', 'Supply', 'Provisions', 'Distributors', 'Wholesale', 'Retail', 'Outlet', 'Store'];
  
  const demoStores: Client[] = [];
  
  for (let i = 0; i < count; i++) {
    const stateIndex = Math.floor(Math.random() * states.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const statusIndex = Math.floor(Math.random() * shopStatus.length);
    const prefixIndex = Math.floor(Math.random() * companyPrefixes.length);
    const typeIndex = Math.floor(Math.random() * companyTypes.length);
    
    const companyName = `${companyPrefixes[prefixIndex]} ${companyTypes[typeIndex]}`;
    const ownerName = `Store Owner ${i + 1}`;
    
    demoStores.push({
      id: `s${String(i + 1).padStart(3, '0')}`,
      name: ownerName,
      company: companyName,
      email: `contact@${companyName.toLowerCase().replace(' ', '')}.com`,
      phone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      state: states[stateIndex],
      status: Math.random() > 0.2 ? 'active' : 'inactive', // 80% active
      lastOrder: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      totalSpent: Math.floor(Math.random() * 15000) + 2000,
      isShop: true,
      category: categories[categoryIndex],
      shopStatus: shopStatus[statusIndex] as any
    });
  }
  
  return demoStores;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Client[]>(generateDemoStores(30));
  const [filters, setFilters] = useState<StoreFilters>({});

  const addStore = useCallback((storeData: Omit<Client, 'id'>) => {
    const newStore: Client = {
      ...storeData,
      id: `s${String(stores.length + 1).padStart(3, '0')}`,
    };
    setStores(prev => [...prev, newStore]);
  }, [stores.length]);

  const updateStore = useCallback((id: string, updates: Partial<Client>) => {
    setStores(prev => prev.map(store => 
      store.id === id ? { ...store, ...updates } : store
    ));
  }, []);

  const deleteStore = useCallback((id: string) => {
    setStores(prev => prev.filter(store => store.id !== id));
  }, []);

  const getFilteredStores = useCallback(() => {
    return stores.filter(store => {
      if (!store.isShop) return false;
      if (filters.category && store.category !== filters.category) return false;
      if (filters.status && store.status !== filters.status) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          store.name.toLowerCase().includes(searchLower) ||
          store.company.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [stores, filters]);

  return (
    <StoreContext.Provider value={{
      stores,
      filters,
      setStores,
      addStore,
      updateStore,
      deleteStore,
      setFilters,
      getFilteredStores,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
