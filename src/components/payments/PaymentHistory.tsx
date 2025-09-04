
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { orders } from '@/lib/data';
import PaymentHistoryHeader from './history/PaymentHistoryHeader';
import PaymentHistoryFilters from './history/PaymentHistoryFilters';
import PaymentHistoryTable from './history/PaymentHistoryTable';

// Generate sample payment data based on orders
const generatePayments = () => {
  const paymentStatuses = ['completed', 'processing', 'pending', 'failed'];
  const paymentMethods = ['credit_card', 'bank_transfer', 'manual'];
  
  return orders.map((order, index) => ({
    id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
    orderId: order.id,
    clientId: order.clientId,
    clientName: order.clientName,
    amount: order.total,
    method: paymentMethods[index % paymentMethods.length],
    status: paymentStatuses[index % paymentStatuses.length],
    date: new Date(Date.now() - (index * 86400000)).toISOString(), // Spread out over days
    reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
  }));
};

const payments = generatePayments();

const PaymentHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  
  const handleClearFilters = () => {
    setStatusFilter('all');
    setMethodFilter('all');
    setSearchQuery('');
  };
  
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      <Card>
        <PaymentHistoryHeader />
        <CardContent>
          <PaymentHistoryFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            handleClearFilters={handleClearFilters}
          />
          
          <PaymentHistoryTable 
            payments={payments} 
            filteredPayments={filteredPayments} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
