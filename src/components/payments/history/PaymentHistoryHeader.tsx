
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PaymentHistoryHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Payment History</CardTitle>
      <CardDescription>Track and manage all payment transactions</CardDescription>
    </CardHeader>
  );
};

export default PaymentHistoryHeader;
