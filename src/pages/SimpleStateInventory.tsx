import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllProductSummaryAPI } from '@/services2/operations/product';
import { getAllOrderAPI } from '@/services2/operations/order';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

const SimpleStateInventory: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const token = useSelector((state: RootState) => state.auth?.token);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching data...');
      
      const [ordersRes, productsRes] = await Promise.all([
        getAllOrderAPI(token, 'limit=1000'),
        getAllProductSummaryAPI('?limit=1000')
      ]);

      console.log('Orders response:', ordersRes);
      console.log('Products response:', productsRes);

      if (ordersRes?.orders) {
        setOrders(ordersRes.orders);
      }

      if (productsRes?.products || productsRes?.data) {
        const productData = productsRes.products || productsRes.data || productsRes;
        setProducts(productData);
      }

      // Auto-select first state
      if (ordersRes?.orders?.length > 0 && !selectedState) {
        const firstState = ordersRes.orders[0]?.store?.state;
        if (firstState) {
          setSelectedState(firstState);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Get available states
  const availableStates = [...new Set(orders.map(order => order.store?.state).filter(Boolean))];

  // Filter data by selected state
  const stateOrders = orders.filter(order => order.store?.state === selectedState);
  const stateStores = [...new Set(stateOrders.map(order => order.store?.storeName).filter(Boolean))];
  const totalRevenue = stateOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const lowStockProducts = products.filter(p => (p.summary?.totalRemaining || 0) < 10);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container px-4 py-6 mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">State Inventory Dashboard</h1>
              <p className="text-muted-foreground">
                View inventory and orders by state
              </p>
            </div>

            {/* Controls */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStates.map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" onClick={fetchData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>

                {/* Status */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Orders:</span>
                    <div className="font-medium">{orders.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Products:</span>
                    <div className="font-medium">{products.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available States:</span>
                    <div className="font-medium">{availableStates.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Low Stock Items:</span>
                    <div className="font-medium text-red-600">{lowStockProducts.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* State Stats */}
            {selectedState && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders in {selectedState}</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stateOrders.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stores in {selectedState}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stateStores.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue from {selectedState}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data Tables */}
            {selectedState && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders from {selectedState}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {stateOrders.slice(0, 10).map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{order.orderNumber || `Order #${index + 1}`}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.store?.storeName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${order.total}</div>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                      {stateOrders.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No orders found for {selectedState}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Low Stock Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {lowStockProducts.slice(0, 10).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.category || 'No category'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-600">
                              {product.summary?.totalRemaining || 0} remaining
                            </div>
                            <Badge variant="destructive">Low Stock</Badge>
                          </div>
                        </div>
                      ))}
                      {lowStockProducts.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                          All products have sufficient stock
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* No State Selected */}
            {!selectedState && availableStates.length > 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a State</h3>
                  <p className="text-muted-foreground">
                    Choose a state from the dropdown to view inventory and orders
                  </p>
                </CardContent>
              </Card>
            )}

            {/* No Data */}
            {availableStates.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Data Available</h3>
                  <p className="text-muted-foreground">
                    No orders found. Make sure your backend is running and you have order data.
                  </p>
                  <Button className="mt-4" onClick={fetchData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimpleStateInventory;