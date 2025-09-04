
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Filter, ListFilter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TruckWeightHeaderProps {
  onRebalance: () => void;
  onFilterChange: (filters: TruckFilters) => void;
}

export interface TruckFilters {
  search: string;
  status: string;
  capacityThreshold: string;
}

const TruckWeightHeader: React.FC<TruckWeightHeaderProps> = ({ onRebalance, onFilterChange }) => {
  const [filters, setFilters] = useState<TruckFilters>({
    search: '',
    status: 'all',
    capacityThreshold: 'all',
  });

  const handleFilterChange = (key: keyof TruckFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="sm:w-64">
          <Input 
            placeholder="Search trucks..." 
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <Button onClick={onRebalance}>
          <RefreshCw size={16} className="mr-2" />
          Rebalance Trucks
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-muted/40 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <ListFilter size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="optimal">Optimal</SelectItem>
              <SelectItem value="warning">Near Capacity</SelectItem>
              <SelectItem value="underutilized">Underutilized</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.capacityThreshold} 
            onValueChange={(value) => handleFilterChange('capacityThreshold', value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Capacities</SelectItem>
              <SelectItem value="high">High ({'>'}75%)</SelectItem>
              <SelectItem value="medium">Medium (25-75%)</SelectItem>
              <SelectItem value="low">Low ({'<'}25%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TruckWeightHeader;
