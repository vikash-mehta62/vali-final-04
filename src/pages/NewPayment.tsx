import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { ArrowLeft, Check, Receipt, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PaymentOptions from '@/components/store/PaymentOptions';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orders } from '@/lib/data';
import { exportInvoiceToPDF } from '@/utils/pdf';

const NewPayment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // In a real app, we would fetch the order data from the API
    if (orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast({
          title: "Order Not Found",
          description: `Could not find order with ID: ${orderId}`,
          variant: "destructive"
        });
      }
    }
  }, [orderId, toast]);

  const handlePaymentComplete = (method: string, reference: string) => {
    setIsComplete(true);
    setPaymentMethod(method);
    setPaymentReference(reference);
    
    toast({
      title: "Payment Processed",
      description: `Payment processed successfully with reference: ${reference}`,
    });
  };

  const handleReturn = () => {
    navigate(isComplete ? '/payments' : '/orders');
  };

  const handleViewReceipt = () => {
    setIsGeneratingReceipt(true);
    
    setTimeout(() => {
      toast({
        title: "Receipt Generated",
        description: "The payment receipt has been generated and is ready to view or download.",
      });
      setIsGeneratingReceipt(false);
    }, 800);
    // In a real app, this would generate and show a receipt
  };

  const handleDownloadReceipt = () => {
    setIsGeneratingReceipt(true);
    
    setTimeout(() => {
      if (order) {
        try {
          // Create a modified version of the order with receipt data
          const modifiedOrder = {
            ...order,
            id: paymentReference, // Use payment reference as the invoice number
            date: new Date().toISOString(), // Current date as the receipt date
            clientName: order.clientName,
            paymentMethod: paymentMethod === 'cc' ? 'Credit Card' : 
                          paymentMethod === 'ach' ? 'Bank Transfer' : 'Manual Payment',
          };
          
          exportInvoiceToPDF(modifiedOrder, {
            invoiceTemplate: 'standard'
          });
          
          toast({
            title: "Receipt Downloaded",
            description: "The payment receipt has been downloaded successfully.",
          });
        } catch (error) {
          toast({
            title: "Download Failed",
            description: "There was a problem downloading the receipt. Please try again.",
            variant: "destructive"
          });
        }
      }
      setIsGeneratingReceipt(false);
    }, 800);
  };

  const handlePrintReceipt = () => {
    setIsGeneratingReceipt(true);
    
    setTimeout(() => {
      toast({
        title: "Print Requested",
        description: "The payment receipt has been sent to the printer.",
      });
      setIsGeneratingReceipt(false);
      // In a real app, this would print the receipt
    }, 800);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container max-w-5xl mx-auto">
            <PageHeader 
              title={isComplete ? "Payment Complete" : "Process Payment"} 
              description={isComplete 
                ? `Payment for Order #${orderId} has been processed successfully` 
                : `Process payment for Order #${orderId}`
              }
            >
              <Button variant="outline" onClick={handleReturn}>
                <ArrowLeft size={16} className="mr-2" />
                {isComplete ? 'Back to Payments' : 'Back to Orders'}
              </Button>
            </PageHeader>
            
            <div className="mt-8">
              {!order && orderId && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <h2 className="text-xl font-medium text-red-600">Order not found</h2>
                      <p className="text-muted-foreground mt-2">The order you're trying to process does not exist.</p>
                      <Button className="mt-4" onClick={handleReturn}>
                        Return to Orders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {order && !isComplete && (
                <PaymentOptions 
                  orderId={order.id}
                  orderTotal={order.total}
                  onComplete={handlePaymentComplete}
                  onCancel={handleReturn}
                />
              )}
              
              {isComplete && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-green-600">Payment Successful</h2>
                      <p className="text-muted-foreground mt-2">
                        Your payment has been processed successfully.
                      </p>
                      
                      <div className="mt-6 max-w-md mx-auto text-left">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Order ID:</span>
                          <span className="font-medium">{order.id}</span>
                          
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">${order.total.toFixed(2)}</span>
                          
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span className="font-medium capitalize">{
                            paymentMethod === 'cc' ? 'Credit Card' : 
                            paymentMethod === 'ach' ? 'Bank Transfer' : 'Manual Payment'
                          }</span>
                          
                          <span className="text-muted-foreground">Reference:</span>
                          <span className="font-medium">{paymentReference}</span>
                          
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={handleViewReceipt} isLoading={isGeneratingReceipt}>
                          <Receipt size={16} className="mr-2" />
                          View Receipt
                        </Button>
                        <Button variant="outline" onClick={handleDownloadReceipt} isLoading={isGeneratingReceipt}>
                          <Download size={16} className="mr-2" />
                          Download Receipt
                        </Button>
                        <Button variant="outline" onClick={handlePrintReceipt} isLoading={isGeneratingReceipt}>
                          <Printer size={16} className="mr-2" />
                          Print Receipt
                        </Button>
                        <Button variant="secondary" onClick={handleReturn}>
                          Return to Payments
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewPayment;
