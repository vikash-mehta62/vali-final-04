import { Client, BulkDiscount } from '../types';
import { clients } from './mockData';

export const getClientById = (id: string): Client | undefined => {
  return clients.find(client => client.id === id);
};

export const getTopClients = (count: number = 5): Client[] => {
  return [...clients]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, count);
};

export const getClientsByState = (): Record<string, Client[]> => {
  const clientsByState: Record<string, Client[]> = {};
  
  clients.forEach(client => {
    if (!clientsByState[client.state]) {
      clientsByState[client.state] = [];
    }
    clientsByState[client.state].push(client);
  });
  
  return clientsByState;
};

export const getClientStates = (): string[] => {
  const states = new Set<string>();
  clients.forEach(client => states.add(client.state));
  return Array.from(states);
};

// Rename getStateCoordinates to getCoordinatesForState for consistency
export const getCoordinatesForState = (state: string): [number, number] => {
  const stateCoordinates: Record<string, [number, number]> = {
    'NY': [40.7128, -74.0060],
    'CA': [36.7783, -119.4179],
    'TX': [31.9686, -99.9018],
    'FL': [27.6648, -81.5158],
    'IL': [41.8781, -87.6298],
    'PA': [41.2033, -77.1945],
    'OH': [40.4173, -82.9071],
    'GA': [33.0406, -83.6431],
    'NC': [35.7596, -79.0193],
    'MI': [44.3148, -85.6024],
  };

  if (stateCoordinates[state]) {
    return [
      stateCoordinates[state][0] + (Math.random() - 0.5) * 0.5,
      stateCoordinates[state][1] + (Math.random() - 0.5) * 0.5
    ];
  }
  
  return [37.0902, -95.7129];
};

// Helper for BulkDiscount conversion
export const convertBulkDiscountToFormFormat = (bulkDiscounts: BulkDiscount[] = []): BulkDiscount[] => {
  return bulkDiscounts.map(discount => ({
    quantity: discount.quantity,
    discountPercentage: discount.discountPercentage,
    minQuantity: discount.minQuantity,
    discountPercent: discount.discountPercent
  }));
};
