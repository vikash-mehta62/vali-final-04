
import { TruckData } from './TruckWeightTable';

export const trucks: TruckData[] = [
  { 
    id: 'T001', 
    name: 'Truck A - North Route', 
    maxCapacity: 22000, 
    currentWeight: 17160, 
    packingEfficiency: 85,
    orders: 24,
    status: 'optimal'
  },
  { 
    id: 'T002', 
    name: 'Truck B - East Route', 
    maxCapacity: 11000, 
    currentWeight: 10560, 
    packingEfficiency: 92,
    orders: 15,
    status: 'warning'
  },
  { 
    id: 'T003', 
    name: 'Truck C - South Route', 
    maxCapacity: 17600, 
    currentWeight: 7480, 
    packingEfficiency: 68,
    orders: 12,
    status: 'underutilized'
  },
  { 
    id: 'T004', 
    name: 'Truck D - West Route', 
    maxCapacity: 26400, 
    currentWeight: 25300, 
    packingEfficiency: 78,
    orders: 31,
    status: 'warning'
  },
  { 
    id: 'T005', 
    name: 'Truck E - Downtown Route', 
    maxCapacity: 16500, 
    currentWeight: 13640, 
    packingEfficiency: 90,
    orders: 22,
    status: 'optimal'
  },
  { 
    id: 'T006', 
    name: 'Truck F - Highway Route', 
    maxCapacity: 19800, 
    currentWeight: 4620, 
    packingEfficiency: 45,
    orders: 8,
    status: 'underutilized'
  },
  { 
    id: 'T007', 
    name: 'Truck G - Rural Route', 
    maxCapacity: 13200, 
    currentWeight: 11220, 
    packingEfficiency: 87,
    orders: 17,
    status: 'optimal'
  },
];
