
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Download, 
  SendHorizonal, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Mail, 
  MoreHorizontal, 
  CheckCircle, 
  BadgeDollarSign, 
  XCircle,
  Clock,
  CalendarClock,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
}

const PaymentInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Sample invoice data
  const invoices: Invoice[] = [
    { 
      id: 'INV-001', 
      orderId: 'ORD-001',
      customer: 'John Smith', 
      date: '2023-10-01', 
      dueDate: '2023-10-15',
      amount: '$1,245.80', 
      status: 'paid'
    },
    { 
      id: 'INV-002', 
      orderId: 'ORD-005',
      customer: 'Sarah Johnson', 
      date: '2023-10-02', 
      dueDate: '2023-10-16',
      amount: '$850.40', 
      status: 'pending'
    },
    { 
      id: 'INV-003', 
      orderId: 'ORD-010',
      customer: 'Michael Brown', 
      date: '2023-10-05', 
      dueDate: '2023-10-19',
      amount: '$2,320.50', 
      status: 'paid'
    },
    { 
      id: 'INV-004', 
      orderId: 'ORD-012',
      customer: 'Emily Davis', 
      date: '2023-10-08', 
      dueDate: '2023-10-22',
      amount: '$475.30', 
      status: 'overdue'
    },
    { 
      id: 'INV-005', 
      orderId: 'ORD-015',
      customer: 'Robert Wilson', 
      date: '2023-10-10', 
      dueDate: '2023-10-24',
      amount: '$1,850.75', 
      status: 'paid'
    },
    { 
      id: 'INV-006', 
      orderId: 'ORD-018',
      customer: 'Jennifer Lee', 
      date: '2023-10-12', 
      dueDate: '2023-10-26',
      amount: '$920.45', 
      status: 'pending'
    },
    { 
      id: 'INV-007', 
      orderId: 'ORD-020',
      customer: 'William Taylor', 
      date: '2023-10-15', 
      dueDate: '2023-10-29',
      amount: '$1,245.80', 
      status: 'overdue'
    },
    { 
      id: 'INV-008', 
      orderId: 'ORD-022',
      customer: 'Jessica Martinez', 
      date: '2023-10-18', 
      dueDate: '2023-11-01',
      amount: '$3,450.60', 
      status: 'pending'
    },
    { 
      id: 'INV-009', 
      orderId: 'ORD-025',
      customer: 'David Anderson', 
      date: '2023-10-20', 
      dueDate: '2023-11-03',
      amount: '$785.20', 
      status: 'draft'
    },
    { 
      id: 'INV-010', 
      orderId: 'ORD-030',
      customer: 'Lisa Thomas', 
      date: '2023-10-25', 
      dueDate: '2023-11-08',
      amount: '$1,150.90', 
      status: 'draft'
    },
  ];
  
  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: "View Invoice",
      description: `Viewing invoice ${invoiceId}`,
    });
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoiceId} has been downloaded`,
    });
  };
  
  const handleSendInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoiceId} has been sent to the customer`,
    });
  };
  
  const handleMarkAsPaid = (invoiceId: string) => {
    toast({
      title: "Invoice Marked as Paid",
      description: `Invoice ${invoiceId} has been marked as paid`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle size={12} className="mr-1" /> Paid
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Clock size={12} className="mr-1" /> Pending
        </Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle size={12} className="mr-1" /> Overdue
        </Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <FileText size={12} className="mr-1" /> Draft
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter invoices by status for the tabs
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');
  const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
              <TabsList className="h-10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingInvoices.length})
                </TabsTrigger>
                <TabsTrigger value="paid">
                  Paid ({paidInvoices.length})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  Overdue ({overdueInvoices.length})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Draft ({draftInvoices.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter size={16} />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Calendar size={16} />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>
            
            <InvoiceTable 
              invoices={filteredInvoices} 
              statusFilter="all" 
              getStatusBadge={getStatusBadge}
              onView={handleViewInvoice}
              onDownload={handleDownloadInvoice}
              onSend={handleSendInvoice}
              onMarkAsPaid={handleMarkAsPaid}
            />
            
            <TabsContent value="pending">
              <InvoiceTable 
                invoices={pendingInvoices.filter(invoice => 
                  invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                statusFilter="pending" 
                getStatusBadge={getStatusBadge}
                onView={handleViewInvoice}
                onDownload={handleDownloadInvoice}
                onSend={handleSendInvoice}
                onMarkAsPaid={handleMarkAsPaid}
              />
            </TabsContent>
            
            <TabsContent value="paid">
              <InvoiceTable 
                invoices={paidInvoices.filter(invoice => 
                  invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                statusFilter="paid" 
                getStatusBadge={getStatusBadge}
                onView={handleViewInvoice}
                onDownload={handleDownloadInvoice}
                onSend={handleSendInvoice}
                onMarkAsPaid={handleMarkAsPaid}
              />
            </TabsContent>
            
            <TabsContent value="overdue">
              <InvoiceTable 
                invoices={overdueInvoices.filter(invoice => 
                  invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                statusFilter="overdue" 
                getStatusBadge={getStatusBadge}
                onView={handleViewInvoice}
                onDownload={handleDownloadInvoice}
                onSend={handleSendInvoice}
                onMarkAsPaid={handleMarkAsPaid}
              />
            </TabsContent>
            
            <TabsContent value="draft">
              <InvoiceTable 
                invoices={draftInvoices.filter(invoice => 
                  invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                statusFilter="draft" 
                getStatusBadge={getStatusBadge}
                onView={handleViewInvoice}
                onDownload={handleDownloadInvoice}
                onSend={handleSendInvoice}
                onMarkAsPaid={handleMarkAsPaid}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center pt-4">
            <Button size="sm">
              <FileText size={14} className="mr-2" />
              Create New Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-2" />
              Export Invoices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface InvoiceTableProps {
  invoices: Invoice[];
  statusFilter: string;
  getStatusBadge: (status: string) => React.ReactNode;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onSend: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  statusFilter, 
  getStatusBadge,
  onView,
  onDownload,
  onSend,
  onMarkAsPaid
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            {statusFilter === 'all' && <TableHead>Status</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={statusFilter === 'all' ? 8 : 7} className="text-center py-6 text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.orderId}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {invoice.status === 'overdue' ? (
                      <CalendarClock size={14} className="mr-1 text-red-500" />
                    ) : null}
                    {invoice.dueDate}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{invoice.amount}</TableCell>
                {statusFilter === 'all' && <TableCell>{getStatusBadge(invoice.status)}</TableCell>}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(invoice.id)}>
                        <Eye size={14} className="mr-2" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(invoice.id)}>
                        <Download size={14} className="mr-2" />
                        Download
                      </DropdownMenuItem>
                      {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'draft') && (
                        <DropdownMenuItem onClick={() => onSend(invoice.id)}>
                          <Mail size={14} className="mr-2" />
                          Send to Customer
                        </DropdownMenuItem>
                      )}
                      {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                        <DropdownMenuItem onClick={() => onMarkAsPaid(invoice.id)}>
                          <BadgeDollarSign size={14} className="mr-2" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentInvoices;
