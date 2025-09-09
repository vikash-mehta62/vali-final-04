import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllOrderAPI } from '@/services2/operations/order';
import { getAllProductSummaryAPI } from '@/services2/operations/product';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Package, ShoppingCart, Users, TrendingUp, RefreshCw } from 'lucide-react';

const TestDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = useSelector((state: RootState) => state.auth?.token);
  const user = useSelector((state: RootState) => state.auth?.user);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Fetching data...');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('User:', user);

      // Test orders API
      const ordersResponse = await getAllOrderAPI(token, 'limit=10');
      console.log('📦 Orders Response:', ordersResponse);
      
      if (ordersResponse?.orders) {
        setOrders(ordersResponse.orders);
        console.log('✅ Orders loaded:', ordersResponse.orders.length);
      }

      // Test products API
      const productsResponse = await getAllProductSummaryAPI('?limit=10');
      console.log('🏷️ Products Response:', productsResponse);
      
      if (productsResponse?.products || productsResponse?.data) {
        const productData = productsResponse.products || productsResponse.data || productsResponse;
        setProducts(productData);
        console.log('✅ Products loaded:', productData.length);
      }

    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Get states from orders
  const getStatesFromOrders = () => {
    const states = orders
      .map(order => order.store?.state)
      .filter(Boolean);
    return [...new Set(states)];
  };

  const states = getStatesFromOrders();
  const lowStockProducts = products.filter(p => (p.summary?.totalRemaining || 0) < 10);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container px-4 py-6 mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">System Test Dashboard</h1>
              <p className="text-muted-foreground">
                Testing API connections and data flow
              </p>
            </div>

            {/* Connection Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${token ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Authentication: {token ? 'Connected' : 'Not Connected'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${orders.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>Orders API: {orders.length > 0 ? 'Working' : 'No Data'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${products.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>Products API: {products.length > 0 ? 'Working' : 'No Data'}</span>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                    Error: {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">Loaded from API</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">In inventory</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">States</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{states.length}</div>
                  <p className="text-xs text-muted-foreground">Different states</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Data Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{order.orderNumber || `Order #${index + 1}`}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.store?.storeName} • {order.store?.state}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${order.total}</div>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No orders found</p>
                  )}
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <div className="space-y-3">
                      {products.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.category || 'No category'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {product.summary?.totalRemaining || 0} remaining
                            </div>
                            <Badge 
                              variant={(product.summary?.totalRemaining || 0) < 10 ? 'destructive' : 'secondary'}
                            >
                              {(product.summary?.totalRemaining || 0) < 10 ? 'Low Stock' : 'Good'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No products found</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* States List */}
            {states.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Available States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {states.map((state, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debug Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>User Role: {user?.role || 'Unknown'}</div>
                  <div>User Email: {user?.email || 'Unknown'}</div>
                  <div>API Base URL: {import.meta.env.VITE_APP_BASE_URL}</div>
                  <div>Token Present: {token ? 'Yes' : 'No'}</div>
                  <div>Orders Loaded: {orders.length}</div>
                  <div>Products Loaded: {products.length}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestDashboard;