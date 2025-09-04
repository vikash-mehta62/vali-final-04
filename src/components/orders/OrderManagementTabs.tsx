
/**
 * Order Management Tabs
 * Main navigation component for the order management system
 */

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RouteOptimization from './RouteOptimization';
import TruckWeightManagement from './TruckWeightManagement';
import OrderTracking from './OrderTracking';
import OrderMergeSuggestions from './OrderMergeSuggestions';
import { Truck, Map, MergeIcon, Package } from 'lucide-react';

interface OrderManagementTabsProps {
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
}

const OrderManagementTabs: React.FC<OrderManagementTabsProps> = ({ 
  selectedTab = 'routes',
  onTabChange
}) => {
  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs 
      defaultValue={selectedTab} 
      value={selectedTab}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <TabsList className="w-full max-w-md grid grid-cols-4 mb-4">
        <TabsTrigger value="routes" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          <span className="hidden sm:inline">Route Optimization</span>
          <span className="sm:hidden">Routes</span>
        </TabsTrigger>
        
        <TabsTrigger value="weight" className="flex items-center gap-1">
          <Truck className="h-4 w-4" />
          <span className="hidden sm:inline">Truck Weight</span>
          <span className="sm:hidden">Weight</span>
        </TabsTrigger>
        
        <TabsTrigger value="merge" className="flex items-center gap-1">
          <MergeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Merge Orders</span>
          <span className="sm:hidden">Merge</span>
        </TabsTrigger>
        
        <TabsTrigger value="tracking" className="flex items-center gap-1">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Order Tracking</span>
          <span className="sm:hidden">Tracking</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="routes" className="space-y-4">
        <RouteOptimization />
      </TabsContent>
      
      <TabsContent value="weight" className="space-y-4">
        <TruckWeightManagement />
      </TabsContent>
      
      <TabsContent value="merge" className="space-y-4">
        <OrderMergeSuggestions />
      </TabsContent>
      
      <TabsContent value="tracking" className="space-y-4">
        <OrderTracking />
      </TabsContent>
    </Tabs>
  );
};

export default OrderManagementTabs;
