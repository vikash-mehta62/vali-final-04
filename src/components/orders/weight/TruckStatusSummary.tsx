
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TruckStatusSummaryProps {
  status: string;
  count: number;
  efficiency: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const TruckStatusSummary: React.FC<TruckStatusSummaryProps> = ({
  status,
  count,
  efficiency,
  bgColor,
  textColor,
  borderColor,
}) => {
  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardContent className="p-4">
        <div className={`text-sm font-medium ${textColor}`}>{status}</div>
        <div className={`text-2xl font-bold ${textColor}`}>{count} Truck{count !== 1 ? 's' : ''}</div>
        <div className={`text-xs ${textColor} mt-1`}>{efficiency}% average efficiency</div>
      </CardContent>
    </Card>
  );
};

export default TruckStatusSummary;
