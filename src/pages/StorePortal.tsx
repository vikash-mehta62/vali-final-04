import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ShoppingCart, ClipboardList, Receipt, ExternalLink, LogOut, Plus, Percent, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Product, Order } from '@/types';
import { mockPriceListItems } from '@/data/productData';
import { mockOrders } from '@/data/orderData';
import OffersBanner from '@/components/store/OffersBanner';
import ProductList from '@/components/store/portal/ProductList';
import OrderHistory from '@/components/store/portal/OrderHistory';
import InvoicesList from '@/components/store/portal/InvoicesList';
import PaymentForm from '@/components/store/portal/PaymentForm';
import ProductFilters from '@/components/store/ProductFilters';

const StorePortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{id: string, amount: number} | null>(null);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15]);
  const [showInStock, setShowInStock] = useState(true);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showOrganic, setShowOrganic] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showBulkDiscount, setShowBulkDiscount] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15);
  
  useEffect(() => {
    const productData = mockPriceListItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: 100,
      unit: item.unit,
      price: item.price,
      threshold: 10,
      lastUpdated: '2023-10-30',
      bulkDiscounts: item.bulkDiscounts || [],
      organic: item.organic || false,
      featuredOffer: item.featuredOffer || false,
      popularityRank: item.popularityRank || 99,
      estimatedProfit: item.estimatedProfit || 20,
      origin: item.origin || '',
    }));
    
    setProducts(productData);
    
    const highestPrice = Math.ceil(Math.max(...productData.map(p => p.price)));
    setMaxPrice(highestPrice);
    setPriceRange([0, highestPrice]);
    
    setOrders(mockOrders);
  }, []);
  
  const filteredProducts = products.filter(product => {
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    if (showInStock && product.quantity <= 0) {
      return false;
    }
    
    if (showOnSale && (!product.bulkDiscounts || product.bulkDiscounts.length === 0)) {
      return false;
    }
    
    if (showOrganic && !product.organic) {
      return false;
    }
    
    if (showPremium && product.category !== 'Premium') {
      return false;
    }
    
    if (showBulkDiscount && (!product.bulkDiscounts || product.bulkDiscounts.length === 0)) {
      return false;
    }
    
    return true;
  });
  
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };
  
  const handleCheckout = () => {
    toast({
      title: "Order Placed",
      description: "Your order has been submitted successfully!",
    });
    
    setCart([]);
    
    setActiveTab('orders');
  };
  
  const handleViewInvoice = (invoiceId: string) => {
    const invoice = {
      id: invoiceId,
      amount: 342.50
    };
    
    setSelectedInvoice(invoice);
  };
  
  const handlePayInvoice = (invoiceId: string) => {
    setSelectedInvoice({
      id: invoiceId, 
      amount: 342.50
    });
    setPaymentModalOpen(true);
  };
  
  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    setSelectedInvoice(null);
    
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });
  };
  
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const { product, quantity } = item;
      
      if (product.bulkDiscounts && product.bulkDiscounts.length > 0) {
        for (const discount of product.bulkDiscounts) {
          if (quantity >= discount.minQuantity) {
            const discountedPrice = product.price * (1 - discount.discountPercent / 100);
            return total + (discountedPrice * quantity);
          }
        }
      }
      
      return total + (product.price * quantity);
    }, 0);
  };
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" loading="lazy" />
            <div>
              <h1 className="text-lg font-bold">Fresh Market Downtown</h1>
              <p className="text-xs text-muted-foreground">Produce Co. Store Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <OffersBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <span>Current Price List</span>
              </CardTitle>
              <CardDescription>
                View your store's personalized prices
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <p className="text-2xl font-bold">{products.length} Items</p>
              <p className="text-sm text-muted-foreground">Last updated: Oct 15, 2023</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Price List
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Percent className="h-5 w-5 text-green-600" />
                <span>Bulk Discounts</span>
              </CardTitle>
              <CardDescription>
                Save more when you buy in bulk
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <p className="text-2xl font-bold">Up to 15% Off</p>
              <p className="text-sm text-muted-foreground">On selected products</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full" variant="outline" onClick={() => setActiveTab('products')}>
                Shop Products
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <span>Next Delivery</span>
              </CardTitle>
              <CardDescription>
                Schedule your next delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <p className="text-2xl font-bold">Thursday</p>
              <p className="text-sm text-muted-foreground">Order by Tuesday for delivery</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Delivery Schedule
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            {activeTab === 'products' && (
              <ProductFilters
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                showInStock={showInStock}
                onShowInStockChange={setShowInStock}
                showOnSale={showOnSale}
                onShowOnSaleChange={setShowOnSale}
                showOrganic={showOrganic}
                onShowOrganicChange={setShowOrganic}
                showPremium={showPremium}
                onShowPremiumChange={setShowPremium}
                showBulkDiscount={showBulkDiscount}
                onShowBulkDiscountChange={setShowBulkDiscount}
                maxPrice={maxPrice}
              />
            )}
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Your Cart
                  </span>
                  <Badge>{cart.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-1">
                      Add products from the list to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between pb-2 border-b">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </p>
                          
                          {item.product.bulkDiscounts && 
                           item.product.bulkDiscounts.length > 0 && 
                           item.quantity >= item.product.bulkDiscounts[0].minQuantity && (
                            <Badge className="bg-green-100 text-green-800 mt-1">
                              {item.product.bulkDiscounts[0].discountPercent}% off
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${calculateCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Invoices
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="space-y-4">
                <ProductList 
                  products={filteredProducts} 
                  onAddToCart={handleAddToCart} 
                />
              </TabsContent>
              
              <TabsContent value="orders" className="space-y-4">
                <OrderHistory 
                  orders={orders}
                  onViewOrder={(id) => console.log(`View order ${id}`)}
                  onViewInvoice={handleViewInvoice}
                  onReorder={(id) => console.log(`Reorder ${id}`)}
                />
              </TabsContent>
              
              <TabsContent value="invoices" className="space-y-4">
                <InvoicesList 
                  onViewInvoice={handleViewInvoice}
                  onPayInvoice={handlePayInvoice}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {selectedInvoice && (
        <PaymentForm 
          isOpen={paymentModalOpen}
          onClose={handlePaymentComplete}
          invoiceId={selectedInvoice.id}
          amount={selectedInvoice.amount}
        />
      )}
      
      <footer className="bg-muted mt-10 py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2023 Produce Co. All rights reserved.</p>
            <p className="mt-2">
              For support, contact your account manager or email <a href="mailto:support@produceco.com" className="text-blue-600 hover:underline">support@produceco.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorePortal;
