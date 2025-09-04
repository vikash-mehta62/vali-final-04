
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building, FileText, Shield, CheckCircle2, Trash2, PlusCircle, Settings, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentMethods = () => {
  const [showAddCreditCard, setShowAddCreditCard] = useState(false);
  const [showAddBankAccount, setShowAddBankAccount] = useState(false);
  const { toast } = useToast();
  
  const handleSaveCreditCard = () => {
    toast({
      title: "Credit Card Added",
      description: "Your credit card has been saved successfully.",
    });
    setShowAddCreditCard(false);
  };
  
  const handleSaveBankAccount = () => {
    toast({
      title: "Bank Account Added",
      description: "Your bank account information has been saved successfully.",
    });
    setShowAddBankAccount(false);
  };
  
  const handleDeletePaymentMethod = (id: string, type: string) => {
    toast({
      title: "Payment Method Removed",
      description: `Your ${type} has been removed successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cc" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cc">
            <CreditCard className="h-4 w-4 mr-2" />
            Credit Cards
          </TabsTrigger>
          <TabsTrigger value="ach">
            <Building className="h-4 w-4 mr-2" />
            Bank Accounts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cc" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Credit Cards
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddCreditCard(true)}
                  className={showAddCreditCard ? 'hidden' : ''}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Card
                </Button>
              </CardTitle>
              <CardDescription>Manage your credit cards for payments</CardDescription>
            </CardHeader>
            <CardContent>
              {showAddCreditCard ? (
                <div className="space-y-4 bg-muted/30 p-4 rounded-md">
                  <h3 className="text-md font-medium flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Credit Card
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Smith" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiration">Expiration Date</Label>
                        <Input id="expiration" placeholder="MM/YY" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="defaultCard" />
                      <Label htmlFor="defaultCard">Make this my default payment method</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowAddCreditCard(false)}>Cancel</Button>
                    <Button onClick={handleSaveCreditCard}>Save Card</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <CreditCardItem 
                    id="cc-1"
                    last4="4242"
                    name="John Smith"
                    expiry="09/25"
                    type="Visa"
                    isDefault={true}
                    onDelete={handleDeletePaymentMethod}
                  />
                  <Separator />
                  <CreditCardItem 
                    id="cc-2"
                    last4="1234"
                    name="John Smith"
                    expiry="12/24"
                    type="Mastercard"
                    isDefault={false}
                    onDelete={handleDeletePaymentMethod}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/20 flex flex-col items-start">
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 mt-0.5" />
                <div>
                  Your payment information is encrypted and securely stored. We use industry-standard security practices to protect your data.
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ach" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Bank Accounts
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddBankAccount(true)}
                  className={showAddBankAccount ? 'hidden' : ''}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </CardTitle>
              <CardDescription>Manage your bank accounts for ACH transfers</CardDescription>
            </CardHeader>
            <CardContent>
              {showAddBankAccount ? (
                <div className="space-y-4 bg-muted/30 p-4 rounded-md">
                  <h3 className="text-md font-medium flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Bank Account
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input id="accountName" placeholder="John Smith" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input id="routingNumber" placeholder="123456789" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="987654321" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input type="radio" id="checking" name="accountType" className="mr-2" />
                          <Label htmlFor="checking">Checking</Label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="savings" name="accountType" className="mr-2" />
                          <Label htmlFor="savings">Savings</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="defaultBank" />
                      <Label htmlFor="defaultBank">Make this my default payment method</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowAddBankAccount(false)}>Cancel</Button>
                    <Button onClick={handleSaveBankAccount}>Save Bank Account</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <BankAccountItem 
                    id="ba-1"
                    last4="4321"
                    name="John Smith"
                    bankName="Chase Bank"
                    accountType="Checking"
                    isDefault={true}
                    onDelete={handleDeletePaymentMethod}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/20 flex flex-col items-start">
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5" />
                <div>
                  ACH transfers typically process within 3-5 business days. There is a 1% fee for all ACH payments.
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Payment Method Settings
          </CardTitle>
          <CardDescription>Configure payment preferences and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Default to Credit Card</h3>
                <p className="text-xs text-muted-foreground">Always use credit card as the default payment method</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Save Payment Methods</h3>
                <p className="text-xs text-muted-foreground">Save payment methods for future orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Payment Confirmations</h3>
                <p className="text-xs text-muted-foreground">Email receipt when payment is processed</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CreditCardItemProps {
  id: string;
  last4: string;
  name: string;
  expiry: string;
  type: string;
  isDefault: boolean;
  onDelete: (id: string, type: string) => void;
}

const CreditCardItem: React.FC<CreditCardItemProps> = ({ 
  id, 
  last4, 
  name, 
  expiry, 
  type, 
  isDefault,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-md">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="font-medium">{type} ending in {last4}</div>
          <div className="text-sm text-muted-foreground">{name} · Expires {expiry}</div>
        </div>
        {isDefault && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Default
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        {!isDefault && (
          <Button variant="ghost" size="sm">Set Default</Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(id, 'credit card')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface BankAccountItemProps {
  id: string;
  last4: string;
  name: string;
  bankName: string;
  accountType: string;
  isDefault: boolean;
  onDelete: (id: string, type: string) => void;
}

const BankAccountItem: React.FC<BankAccountItemProps> = ({ 
  id, 
  last4, 
  name, 
  bankName, 
  accountType, 
  isDefault,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-md">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="font-medium">{bankName} · {accountType} ····{last4}</div>
          <div className="text-sm text-muted-foreground">{name}</div>
        </div>
        {isDefault && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Default
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        {!isDefault && (
          <Button variant="ghost" size="sm">Set Default</Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(id, 'bank account')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
