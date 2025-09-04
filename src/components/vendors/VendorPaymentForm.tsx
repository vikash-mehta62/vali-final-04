
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, CheckCircle, DollarSign, Calendar, Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import PageHeader from '@/components/shared/PageHeader';

// Mock purchase order detail for the form
const getMockPurchase = (id: string) => {
  // Default data for when no ID is provided
  const defaultPurchase = {
    id: 'default',
    vendorId: 'v2',
    vendorName: 'Organic Supply Co.',
    date: '2025-03-28',
    status: 'approved',
    items: [
      {
        productId: 'prod3',
        productName: 'Organic Tomatoes',
        quantity: 100,
        unit: 'lb',
        unitPrice: 2.00,
        totalPrice: 200,
        qualityStatus: 'approved'
      }
    ],
    totalAmount: 200,
    purchaseOrderNumber: 'PO-2025-002',
    deliveryDate: '2025-03-30',
    invoiceNumber: 'INV-2025-1234',
    invoiceDate: '2025-04-01',
    dueDate: '2025-05-01',
    invoiceUploaded: true,
    paymentStatus: 'pending'
  };

  if (!id) return defaultPurchase;

  // Look up purchase data based on ID (in a real app, this would fetch from API)
  return {
    id,
    vendorId: 'v2',
    vendorName: 'Organic Supply Co.',
    date: '2025-03-28',
    status: 'approved',
    items: [
      {
        productId: 'prod3',
        productName: 'Organic Tomatoes',
        quantity: 100,
        unit: 'lb',
        unitPrice: 2.00,
        totalPrice: 200,
        qualityStatus: 'approved'
      }
    ],
    totalAmount: 200,
    purchaseOrderNumber: 'PO-2025-002',
    deliveryDate: '2025-03-30',
    invoiceNumber: 'INV-2025-1234',
    invoiceDate: '2025-04-01',
    dueDate: '2025-05-01',
    invoiceUploaded: true,
    paymentStatus: 'pending'
  };
};

const VendorPaymentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const purchase = getMockPurchase(id || '');
  
  // Form state
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState(purchase.totalAmount.toString());
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  
  // Update payment amount if purchase changes
  useEffect(() => {
    setPaymentAmount(purchase.totalAmount.toString());
  }, [purchase.totalAmount]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!paymentMethod || !paymentDate || !paymentAmount) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill all required fields."
      });
      return;
    }
    
    // In a real app, this would call an API to record the payment
    toast({
      title: "Payment recorded",
      description: `Payment of ${formatCurrency(Number(paymentAmount))} to ${purchase.vendorName} has been recorded.`,
    });
    
    // Navigate back to purchases list
    navigate('/vendors');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/vendors')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Purchases
      </Button>
      
      <PageHeader
        title="Process Vendor Payment"
        description="Record payment for vendor invoice"
        icon={<DollarSign className="h-5 w-5 text-primary" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Enter payment information for invoice {purchase.invoiceNumber}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="paymentDate"
                        type="date"
                        className="pl-10"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="paymentAmount">Payment Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="paymentAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="referenceNumber">Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="Check number, transaction ID, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this payment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-[100px]"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/vendors')}>
                  Cancel
                </Button>
                <Button type="submit">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Invoice Number</h3>
                <p className="text-lg font-semibold">{purchase.invoiceNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
                <p>{purchase.vendorName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Invoice Date</h3>
                <p>{new Date(purchase.invoiceDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p>{new Date(purchase.dueDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Amount Due</h3>
                <p className="text-lg font-semibold">{formatCurrency(purchase.totalAmount)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Purchase Order</h3>
                <p>{purchase.purchaseOrderNumber}</p>
              </div>
              
              <Button 
                className="mt-2 w-full" 
                variant="outline"
                onClick={() => window.open(`/invoice-preview/${purchase.id}`, '_blank')}
              >
                <Receipt className="mr-2 h-4 w-4" />
                View Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorPaymentForm;
