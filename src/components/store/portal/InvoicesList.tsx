
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, CreditCard } from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/data';

// Mock data for invoices
const mockInvoices = [
  { id: 'INV-001', orderId: 'o123', date: '2023-10-15', total: 342.50, status: 'unpaid', dueDate: '2023-10-30' },
  { id: 'INV-002', orderId: 'o124', date: '2023-10-08', total: 289.75, status: 'paid', paidDate: '2023-10-20' },
  { id: 'INV-003', orderId: 'o125', date: '2023-10-01', total: 412.25, status: 'unpaid', dueDate: '2023-10-16' },
  { id: 'INV-004', orderId: 'o126', date: '2023-09-24', total: 356.00, status: 'paid', paidDate: '2023-10-05' },
];

interface InvoicesListProps {
  orders?: Order[];
  onViewInvoice: (invoiceId: string) => void;
  onPayInvoice: (invoiceId: string) => void;
}

const InvoicesList: React.FC<InvoicesListProps> = ({ 
  orders,
  onViewInvoice, 
  onPayInvoice 
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  
  // Use mock data for now, but this would be real invoices in a production app
  const invoices = mockInvoices;
  
  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === filter);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-100 text-yellow-800">Unpaid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>
          View and manage all your invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'unpaid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unpaid')}
          >
            Unpaid
          </Button>
          <Button 
            variant={filter === 'paid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('paid')}
          >
            Paid
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.status === 'unpaid' ? invoice.dueDate : '-'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onViewInvoice(invoice.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'unpaid' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => onPayInvoice(invoice.id)}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesList;
