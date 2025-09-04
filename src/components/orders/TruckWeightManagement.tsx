
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TruckWeightHeader, { TruckFilters } from './weight/TruckWeightHeader';
import TruckWeightTable from './weight/TruckWeightTable';
import TruckStatusCards from './weight/TruckStatusCards';
import { trucks } from './weight/truckData';
import { TruckData } from './weight/TruckWeightTable';

const TruckWeightManagement = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<TruckFilters>({
    search: '',
    status: 'all',
    capacityThreshold: 'all',
  });
  
  const handleRebalance = () => {
    toast({
      title: "Trucks Rebalanced",
      description: "Load distribution has been optimized across all trucks",
    });
  };

  const filteredTrucks = useMemo(() => {
    return trucks.filter(truck => {
      // Filter by search term
      const matchesSearch = 
        filters.search === '' || 
        truck.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        truck.id.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        filters.status === 'all' || 
        truck.status === filters.status;
      
      // Filter by capacity
      const utilizationPercentage = (truck.currentWeight / truck.maxCapacity) * 100;
      let matchesCapacity = true;
      
      if (filters.capacityThreshold === 'high') {
        matchesCapacity = utilizationPercentage > 75;
      } else if (filters.capacityThreshold === 'medium') {
        matchesCapacity = utilizationPercentage >= 25 && utilizationPercentage <= 75;
      } else if (filters.capacityThreshold === 'low') {
        matchesCapacity = utilizationPercentage < 25;
      }
      
      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [filters, trucks]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Truck Weight Management</CardTitle>
          <CardDescription>
            Optimize load distribution and maximize truck capacity utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TruckWeightHeader 
            onRebalance={handleRebalance} 
            onFilterChange={setFilters}
          />
          
          {filteredTrucks.length === 0 ? (
            <div className="bg-muted/20 rounded-md p-8 text-center mt-6">
              <p className="text-muted-foreground">No trucks match the current filters</p>
            </div>
          ) : (
            <>
              <div className="mt-6">
                <TruckWeightTable trucks={filteredTrucks} />
              </div>
              <TruckStatusCards trucks={filteredTrucks} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TruckWeightManagement;
