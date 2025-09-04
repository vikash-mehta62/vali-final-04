
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, CheckSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: string;
  amount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  invoiceId,
  amount,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Payment of $${amount.toFixed(2)} for invoice ${invoiceId} has been processed.`,
      });
      
      setIsProcessing(false);
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="credit-card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Credit Card</span>
            </TabsTrigger>
            <TabsTrigger value="bank-transfer" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>Bank Transfer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-card">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input id="expiry" placeholder="MM/YY" className="pl-10" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="John Smith" required />
                </div>
              </div>
              
              <Card className="mt-6 bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <span>Invoice #{invoiceId}</span>
                    <span className="font-semibold">${amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  isLoading={isProcessing}
                  disabled={isProcessing}
                >
                  Pay ${amount.toFixed(2)}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="bank-transfer">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Make a bank transfer to the following account:
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Name</span>
                  <span className="font-medium">Produce Co. LLC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Number</span>
                  <span className="font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Routing Number</span>
                  <span className="font-medium">098765432</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="font-medium">First National Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <span className="font-medium">{invoiceId}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Please include the invoice number as the reference for your payment.
                Once payment is received, your invoice will be marked as paid.
              </p>
              
              <Card className="mt-2 bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <span>Invoice #{invoiceId}</span>
                    <span className="font-semibold">${amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="mt-6">
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
