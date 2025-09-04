
import React, { useState } from 'react';
import { PriceListTemplate, PriceListOrderItem } from '@/components/inventory/forms/formTypes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/data';
import { ShoppingCart, FileText, Plus, Minus, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface StoreOrderViewProps {
  template: PriceListTemplate;
  storeName: string;
  onClose: () => void;
}

const StoreOrderView: React.FC<StoreOrderViewProps> = ({ template, storeName, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [orderItems, setOrderItems] = useState<PriceListOrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const categories = [...new Set(template.products.map(p => p.category))];
  
  const filteredProducts = template.products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeTab === 'all' || product.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddToOrder = (productId: string, productName: string, price: number) => {
    const existingItemIndex = orderItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Item already in order, increment quantity
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * price;
      setOrderItems(updatedItems);
    } else {
      // Add new item to order
      setOrderItems([
        ...orderItems,
        {
          productId,
          productName,
          quantity: 1,
          unitPrice: price,
          total: price
        }
      ]);
    }
    
    toast({
      title: "Added to Order",
      description: `${productName} added to order.`
    });
  };
  
  const handleRemoveFromOrder = (productId: string) => {
    const existingItemIndex = orderItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...orderItems];
      
      if (updatedItems[existingItemIndex].quantity > 1) {
        // Decrement quantity
        updatedItems[existingItemIndex].quantity -= 1;
        updatedItems[existingItemIndex].total = 
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
        setOrderItems(updatedItems);
      } else {
        // Remove item completely
        setOrderItems(orderItems.filter(item => item.productId !== productId));
      }
    }
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.total, 0);
  };
  
  const handleSubmitOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add at least one product to your order.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Order Submitted",
        description: "Your order has been submitted successfully.",
      });
      
      // Reset after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };
  
  const getQuantityInOrder = (productId: string) => {
    const item = orderItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {template.name}
          </h1>
          {template.description && (
            <p className="text-gray-500 mt-1">{template.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">Store: {storeName}</p>
        </div>
        
        <div className="text-right">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <p className="text-2xl font-bold text-primary">{formatCurrency(calculateTotal())}</p>
          <p className="text-sm text-muted-foreground">{orderItems.length} items</p>
        </div>
      </div>
      
      {isSuccess ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Order Submitted Successfully!</h2>
              <p className="text-green-600 mb-4">Your order has been received and is being processed.</p>
              <Button onClick={onClose}>Return to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Available Products</CardTitle>
                <div className="mt-2 flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="w-full sm:w-auto overflow-x-auto">
                      <TabsTrigger value="all">All</TabsTrigger>
                      {categories.map(category => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Order</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => {
                          const quantityInOrder = getQuantityInOrder(product.productId);
                          
                          return (
                            <TableRow key={product.productId}>
                              <TableCell className="font-medium">{product.productName}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.unit}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(product.price)}
                                {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
                                  <div className="text-xs text-green-600 font-medium">
                                    Volume discounts available
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {quantityInOrder > 0 ? (
                                  <div className="flex items-center justify-end">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleRemoveFromOrder(product.productId)}
                                      className="h-8 w-8"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="mx-2 text-sm font-medium w-8 text-center">{quantityInOrder}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleAddToOrder(product.productId, product.productName, product.price)}
                                      className="h-8 w-8"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddToOrder(product.productId, product.productName, product.price)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
                <CardDescription>
                  {orderItems.length === 0 
                    ? "Add products to your order" 
                    : `${orderItems.length} ${orderItems.length === 1 ? 'item' : 'items'} in your order`}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {orderItems.length === 0 ? (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Your order is empty</p>
                    <p className="text-sm text-muted-foreground mt-1">Add products from the list to create an order</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.productId} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFromOrder(item.productId)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm">{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAddToOrder(item.productId, item.productName, item.unitPrice)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleSubmitOrder}
                  disabled={orderItems.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Submit Order
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-4 bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-blue-700">Special Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Orders submitted before 2 PM will be processed same day</p>
                  <p>• Volume discounts are automatically applied at checkout</p>
                  <p>• Minimum order value: $100</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOrderView;
