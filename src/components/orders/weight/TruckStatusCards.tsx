
import React from 'react';
import { TruckData } from './TruckWeightTable';
import TruckStatusSummary from './TruckStatusSummary';

interface TruckStatusCardsProps {
  trucks: TruckData[];
}

const TruckStatusCards: React.FC<TruckStatusCardsProps> = ({ trucks }) => {
  // Calculate average efficiency and count for each status
  const statusSummary = trucks.reduce(
    (acc, truck) => {
      if (!acc[truck.status]) {
        acc[truck.status] = {
          count: 0,
          efficiencySum: 0,
        };
      }
      
      acc[truck.status].count += 1;
      acc[truck.status].efficiencySum += truck.packingEfficiency;
      
      return acc;
    },
    {} as Record<string, { count: number; efficiencySum: number }>
  );
  
  // Calculate average efficiency for each status
  const statusData = Object.keys(statusSummary).map(status => ({
    status,
    count: statusSummary[status].count,
    avgEfficiency: Math.round(statusSummary[status].efficiencySum / statusSummary[status].count),
  }));

  const getStatusCardProps = (status: string) => {
    switch (status) {
      case 'optimal':
        return {
          status: 'Optimal Load',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-100',
        };
      case 'warning':
        return {
          status: 'Near Capacity',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-100',
        };
      case 'underutilized':
        return {
          status: 'Underutilized',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-100',
        };
      default:
        return {
          status: 'Other',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-100',
        };
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statusData.map(data => {
        const cardProps = getStatusCardProps(data.status);
        return (
          <TruckStatusSummary
            key={data.status}
            count={data.count}
            efficiency={data.avgEfficiency}
            status={cardProps.status}
            bgColor={cardProps.bgColor}
            textColor={cardProps.textColor}
            borderColor={cardProps.borderColor}
          />
        );
      })}
    </div>
  );
};

export default TruckStatusCards;
