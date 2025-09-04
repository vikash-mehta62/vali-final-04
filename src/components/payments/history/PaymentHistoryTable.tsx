
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Building, 
  FileText, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  XCircle,
  DownloadCloud,
  User,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface Payment {
  id: string;
  orderId: string;
  clientId: string;
  clientName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  reference: string;
}

interface PaymentHistoryTableProps {
  payments: Payment[];
  filteredPayments: Payment[];
}

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ payments, filteredPayments }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard size={16} className="text-blue-500" />;
      case 'bank_transfer':
        return <Building size={16} className="text-purple-500" />;
      default:
        return <DollarSign size={16} className="text-green-500" />;
    }
  };
  
  const getMethodName = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer (ACH)';
      case 'manual':
        return 'Manual Payment';
      default:
        return method;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'processing':
        return <Clock size={16} className="text-blue-500" />;
      case 'pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-700";
      case 'processing':
        return "bg-blue-100 text-blue-700";
      case 'pending':
        return "bg-amber-100 text-amber-700";
      case 'failed':
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const handleDownloadReceipt = (paymentId: string) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for payment ${paymentId} has been downloaded`,
    });
  };
  
  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/edit/${orderId}`);
  };
  
  const handleViewClientProfile = (clientId: string) => {
    navigate(`/clients/profile/${clientId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">
              <div className="flex items-center">
                Payment ID
                <ArrowUpDown size={14} className="ml-2" />
              </div>
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No payments found
              </TableCell>
            </TableRow>
          ) : (
            filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>
                  <div 
                    className="flex items-center gap-1 cursor-pointer hover:text-primary hover:underline"
                    onClick={() => handleViewClientProfile(payment.clientId)}
                  >
                    <User size={14} />
                    <span>{payment.clientName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div 
                    className="flex items-center gap-1 cursor-pointer hover:text-primary hover:underline"
                    onClick={() => handleViewOrder(payment.orderId)}
                  >
                    <FileText size={14} />
                    <span>{payment.orderId}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getMethodIcon(payment.method)}
                    <span>{getMethodName(payment.method)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <div className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs w-fit",
                    getStatusClass(payment.status)
                  )}>
                    {getStatusIcon(payment.status)}
                    <span className="capitalize">{payment.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownloadReceipt(payment.id)}
                      disabled={payment.status !== 'completed'}
                      title="Download Receipt"
                    >
                      <DownloadCloud size={16} className="text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentHistoryTable;
