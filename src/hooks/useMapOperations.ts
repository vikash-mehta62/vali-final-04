
import { useState, useCallback } from 'react';
import { Client, StoreLocation } from '@/types';
import { getCoordinatesForState } from '@/data/clientData';

interface MapOperations {
  startPoint: StoreLocation | null;
  isCalculating: boolean;
  setStartLocation: (location: string) => void;
  optimizeRoute: (stores: Client[]) => Promise<void>;
}

export const useMapOperations = (): MapOperations => {
  const [startPoint, setStartPoint] = useState<StoreLocation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const setStartLocation = useCallback((location: string) => {
    // For demo purposes, using fixed coordinates
    setStartPoint({ lat: 38.8977, lng: -77.0365 });
  }, []);

  const optimizeRoute = useCallback(async (stores: Client[]) => {
    if (!startPoint) return;
    setIsCalculating(true);
    
    try {
      // Simulate route calculation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally call your route optimization service
      console.log('Optimizing route for', stores.length, 'stores');
      
    } finally {
      setIsCalculating(false);
    }
  }, [startPoint]);

  return {
    startPoint,
    isCalculating,
    setStartLocation,
    optimizeRoute,
  };
};
