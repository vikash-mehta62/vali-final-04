import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TruckIcon, Weight, AlertTriangle, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from "@/lib/utils";

export interface TruckData {
  id: string;
  name: string;
  maxCapacity: number;
  currentWeight: number;
  packingEfficiency: number;
  orders: number;
  status: string;
}

interface TruckWeightTableProps {
  trucks: TruckData[];
}

type SortField = 'id' | 'weight' | 'efficiency' | 'orders';
type SortDirection = 'asc' | 'desc';

const TruckWeightTable: React.FC<TruckWeightTableProps> = ({ trucks }) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'underutilized':
        return <AlertTriangle size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'optimal':
        return "text-green-600";
      case 'warning':
        return "text-amber-500";
      case 'underutilized':
        return "text-blue-500";
      default:
        return "";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal':
        return "Optimal";
      case 'warning':
        return "Near Capacity";
      case 'underutilized':
        return "Underutilized";
      default:
        return status;
    }
  };
  
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return "bg-green-600";
      case 'warning':
        return "bg-amber-500";
      case 'underutilized':
        return "bg-blue-500";
      default:
        return "";
    }
  };
  
  const getWeightPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTrucks = [...trucks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'weight':
        const aPercentage = a.currentWeight / a.maxCapacity;
        const bPercentage = b.currentWeight / b.maxCapacity;
        comparison = aPercentage - bPercentage;
        break;
      case 'efficiency':
        comparison = a.packingEfficiency - b.packingEfficiency;
        break;
      case 'orders':
        comparison = a.orders - b.orders;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('id')}
            >
              <div className="flex items-center">
                Truck ID
                <ArrowUpDown size={14} className="ml-2" />
              </div>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('weight')}
            >
              <div className="flex items-center">
                Capacity Usage
                <ArrowUpDown size={14} className="ml-2" />
              </div>
            </TableHead>
            <TableHead>Weight (lb)</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('efficiency')}
            >
              <div className="flex items-center">
                Efficiency
                <ArrowUpDown size={14} className="ml-2" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('orders')}
            >
              <div className="flex items-center">
                Orders
                <ArrowUpDown size={14} className="ml-2" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTrucks.map((truck) => (
            <TableRow key={truck.id}>
              <TableCell className="font-medium">{truck.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TruckIcon size={16} />
                  {truck.name}
                </div>
              </TableCell>
              <TableCell className="w-[180px]">
                <div className="space-y-1">
                  <Progress 
                    value={getWeightPercentage(truck.currentWeight, truck.maxCapacity)} 
                    className={cn("h-2", getProgressColor(truck.status))}
                  />
                  <div className="text-xs text-muted-foreground">
                    {getWeightPercentage(truck.currentWeight, truck.maxCapacity)}% of max capacity
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Weight size={14} className="text-muted-foreground" />
                  <span>{truck.currentWeight} / {truck.maxCapacity} lb</span>
                </div>
              </TableCell>
              <TableCell>{truck.packingEfficiency}%</TableCell>
              <TableCell>{truck.orders} orders</TableCell>
              <TableCell>
                <div className={`flex items-center gap-1 ${getStatusClass(truck.status)}`}>
                  {getStatusIcon(truck.status)}
                  <span>{getStatusText(truck.status)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TruckWeightTable;
