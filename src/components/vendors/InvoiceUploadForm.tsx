
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Upload, FileUp, Save, FileText, Calendar, DollarSign
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
  return {
    id,
    vendorId: 'v1',
    vendorName: 'Green Valley Farms',
    date: '2025-04-01',
    status: 'approved',
    items: [
      {
        productId: 'prod1',
        productName: 'Organic Apples',
        quantity: 200,
        unit: 'lb',
        unitPrice: 1.25,
        totalPrice: 250,
        qualityStatus: 'approved'
      },
      {
        productId: 'prod2',
        productName: 'Pears',
        quantity: 150,
        unit: 'lb',
        unitPrice: 1.50,
        totalPrice: 225,
        qualityStatus: 'approved'
      }
    ],
    totalAmount: 475,
    purchaseOrderNumber: 'PO-2025-001',
    deliveryDate: '2025-04-03'
  };
};

const InvoiceUploadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const purchaseOrder = getMockPurchase(id || '');
  
  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(purchaseOrder.totalAmount.toString());
  const [paymentTerms, setPaymentTerms] = useState('net30');
  const [notes, setNotes] = useState('');
  const [fileSelected, setFileSelected] = useState(false);
  
  // Calculate default due date (30 days from today)
  React.useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileSelected(e.target.files && e.target.files.length > 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!invoiceNumber) {
      toast({
        variant: "destructive",
        title: "Missing invoice number",
        description: "Please enter the invoice number."
      });
      return;
    }
    
    if (!fileSelected) {
      toast({
        variant: "destructive",
        title: "Missing invoice file",
        description: "Please upload the invoice document."
      });
      return;
    }
    
    // In a real app, this would call an API to upload the invoice
    toast({
      title: "Invoice uploaded",
      description: `Invoice ${invoiceNumber} has been uploaded for purchase order ${purchaseOrder.purchaseOrderNumber}.`,
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
        title="Upload Invoice"
        description={`Upload vendor invoice for purchase order ${purchaseOrder.purchaseOrderNumber}`}
        icon={<FileUp className="h-5 w-5 text-primary" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>
                  Enter invoice information from {purchaseOrder.vendorName}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Enter vendor's invoice number"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="invoiceDate"
                        type="date"
                        className="pl-10"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dueDate">Payment Due Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dueDate"
                        type="date"
                        className="pl-10"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="totalAmount">Total Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="totalAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger id="paymentTerms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15 Days</SelectItem>
                      <SelectItem value="net30">Net 30 Days</SelectItem>
                      <SelectItem value="net45">Net 45 Days</SelectItem>
                      <SelectItem value="net60">Net 60 Days</SelectItem>
                      <SelectItem value="immediate">Due Immediately</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="invoiceFile">Upload Invoice Document</Label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-primary-dark">
                          <span>Upload a file</span>
                          <Input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  {fileSelected && (
                    <p className="mt-2 text-sm text-green-600">File selected</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this invoice..."
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
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Invoice
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Purchase Order Number</h3>
                <p className="text-lg font-semibold">{purchaseOrder.purchaseOrderNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
                <p>{purchaseOrder.vendorName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Purchase Date</h3>
                <p>{new Date(purchaseOrder.date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                <p className="text-lg font-semibold">{formatCurrency(purchaseOrder.totalAmount)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
                <ul className="mt-2 space-y-2">
                  {purchaseOrder.items.map((item, index) => (
                    <li key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span>{item.productName}</span>
                        <span>{formatCurrency(item.totalPrice)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUploadForm;
