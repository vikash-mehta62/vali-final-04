
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Building, 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  DollarSign,
  CircleCheck,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/data';

interface PaymentOptionsProps {
  orderId: string;
  orderTotal: number;
  onComplete: (paymentMethod: string, reference: string) => void;
  onCancel: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  orderId, 
  orderTotal, 
  onComplete, 
  onCancel 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Calculate fees based on payment method
  const calculateFees = () => {
    if (paymentMethod === 'cc') {
      return orderTotal * 0.03; // 3% for credit card
    } else if (paymentMethod === 'ach') {
      return orderTotal * 0.01; // 1% for ACH
    }
    return 0; // No fee for manual/check
  };

  const fees = calculateFees();
  const totalWithFees = orderTotal + fees;

  const handleSendPaymentLink = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address to send the payment link.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentLink(`https://pay.vali-produce.com/${orderId}`);
      
      toast({
        title: "Payment Link Sent",
        description: `A payment link for $${totalWithFees.toFixed(2)} has been sent to ${email}`,
      });
    }, 1500);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      const refNumber = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setReference(refNumber);
      
      toast({
        title: "Payment Processed",
        description: `Payment of ${formatCurrency(totalWithFees)} has been processed successfully.`,
      });
      
      onComplete(paymentMethod, refNumber);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File Uploaded",
        description: `File "${e.target.files[0].name}" has been uploaded.`,
      });
    }
  };

  const handleManualPaymentSubmit = () => {
    if (!file && !notes) {
      toast({
        title: "Information Required",
        description: "Please either upload a check image or provide payment details in the notes.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      const refNumber = `MAN-${Math.floor(100000 + Math.random() * 900000)}`;
      setReference(refNumber);
      
      toast({
        title: "Manual Payment Recorded",
        description: "The manual payment details have been recorded.",
      });
      
      onComplete('manual', refNumber);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Process Payment
        </CardTitle>
        <CardDescription>
          Order #{orderId} - Total: {formatCurrency(orderTotal)}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="paymentMethods" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="paymentMethods">Payment Methods</TabsTrigger>
            <TabsTrigger value="paymentLink">Send Payment Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paymentMethods">
            <div className="space-y-4">
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod} 
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cc" id="cc" />
                  <Label htmlFor="cc" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Credit Card Payment (3% fee)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ach" id="ach" />
                  <Label htmlFor="ach" className="flex items-center gap-2 cursor-pointer">
                    <Building className="h-4 w-4 text-primary" />
                    ACH Bank Transfer (1% fee)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="check" id="check" />
                  <Label htmlFor="check" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-4 w-4 text-primary" />
                    Manual Payment / Check
                  </Label>
                </div>
              </RadioGroup>
              
              <Separator className="my-4" />
              
              {paymentMethod === 'cc' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee (3%):</span>
                    <span>{formatCurrency(fees)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency(totalWithFees)}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Process Credit Card Payment
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {paymentMethod === 'ach' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee (1%):</span>
                    <span>{formatCurrency(fees)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency(totalWithFees)}</span>
                  </div>
                  
                  <div className="rounded-md bg-muted p-4 text-sm">
                    <p className="font-medium mb-2">ACH Payment Instructions</p>
                    <p>Bank Name: Vali Produce Financial</p>
                    <p>Account Name: Vali Produce LLC</p>
                    <p>Routing Number: 123456789</p>
                    <p>Account Number: 987654321</p>
                    <p className="mt-2">Please include Order #{orderId} as the payment reference.</p>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Building className="mr-2 h-4 w-4" />
                        Record ACH Payment
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {paymentMethod === 'check' && (
                <div className="space-y-4">
                  <div className="flex justify-between font-medium">
                    <span>Total Due:</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fileUpload">Upload Check Image</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <div className="text-xs text-muted-foreground">
                      Accepted formats: JPG, PNG, PDF
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Payment Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any details about the payment (check number, amount, date, etc.)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleManualPaymentSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Record Manual Payment
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {reference && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Payment recorded successfully with reference: {reference}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paymentLink">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Customer Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Order Total:</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
              
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="text-muted-foreground">
                  Send a secure payment link to the customer's email. They can pay using credit card or ACH bank transfer.
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSendPaymentLink}
                disabled={isProcessing || !email}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Send Payment Link
                  </>
                )}
              </Button>
              
              {paymentLink && (
                <div className="mt-4">
                  <Label htmlFor="paymentLink" className="text-sm">Payment Link</Label>
                  <div className="flex mt-1">
                    <Input
                      id="paymentLink"
                      value={paymentLink}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button 
                      variant="outline" 
                      className="rounded-l-none"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentLink);
                        toast({
                          title: "Copied!",
                          description: "Payment link copied to clipboard",
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This link has been sent to {email} and is valid for 7 days
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {reference && (
          <Button variant="default" onClick={() => onComplete(paymentMethod, reference)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentOptions;
