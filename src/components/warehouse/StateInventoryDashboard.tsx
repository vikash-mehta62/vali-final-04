import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Warehouse, 
  Package, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllProductSummaryAPI } from '@/services2/operations/product';
import { getAllOrderAPI } from '@/services2/operations/order';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

interface StateInventoryData {
  state: string;
  stores: number;
  summary: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockItems: number;
  };
  inventory: Array<{
    productName: string;
    productCategory: string;
    totalPurchase: number;
    totalSell: number;
    totalRemaining: number;
    needsReorder: boolean;
    price: number;
  }>;
  topStores: Array<{
    storeName: string;
    orderCount: number;
    totalSpent: number;
  }>;
}

const StateInventoryDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateData, setStateData] = useState<StateInventoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  
  const token = useSelector((state: RootState) => state.auth?.token);

  // Fetch all data with improved error handling and data processing
  const fetchAllData = async () => {
    console.log('🔍 Starting fetchAllData...');
    console.log('🔑 Token present:', !!token);
    
    if (!token) {
      setError('No authentication token found');
      console.log('❌ No token found, stopping fetch');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Fetching orders and products...');
      
      // Use larger limit and better error handling
      const [ordersResponse, productsResponse] = await Promise.all([
        getAllOrderAPI(token, 'limit=5000&page=1'),
        getAllProductSummaryAPI('?limit=5000')
      ]);
      
      console.log('✅ API calls completed');
      console.log('📦 Orders Response Structure:', {
        hasOrders: !!ordersResponse?.orders,
        ordersCount: ordersResponse?.orders?.length || 0,
        totalOrders: ordersResponse?.totalOrders || 0,
        summary: ordersResponse?.summary || null
      });
      
      console.log('🏷️ Products Response Structure:', {
        hasData: !!productsResponse?.data,
        productsCount: productsResponse?.data?.length || 0,
        isArray: Array.isArray(productsResponse)
      });
      
      // Handle orders response with better validation
      let processedOrders = [];
      if (ordersResponse?.orders && Array.isArray(ordersResponse.orders)) {
        processedOrders = ordersResponse.orders.filter(order => 
          order && order.store && !order.isDelete
        );
        console.log('✅ Valid orders loaded:', processedOrders.length);
      } else {
        console.log('⚠️ No valid orders found in response');
      }
      
      setAllOrders(processedOrders);

      // Handle products response with better validation
      let processedProducts = [];
      if (productsResponse?.data && Array.isArray(productsResponse.data)) {
        processedProducts = productsResponse.data.filter(product => product && product.name);
        console.log('✅ Valid products loaded:', processedProducts.length);
      } else if (Array.isArray(productsResponse)) {
        processedProducts = productsResponse.filter(product => product && product.name);
        console.log('✅ Products loaded (direct array):', processedProducts.length);
      } else {
        console.log('⚠️ No valid products found in response');
      }
      
      setAllProducts(processedProducts);

      // Debug first order structure and payment data
      if (processedOrders.length > 0) {
        const firstOrder = processedOrders[0];
        console.log('🔍 First order FULL structure:', JSON.stringify(firstOrder, null, 2));
        console.log('🔍 Store object structure:', JSON.stringify(firstOrder.store, null, 2));
        
        // Check all possible store ID fields
        console.log('🆔 Store ID variations:', {
          'store._id': firstOrder.store?._id,
          'store.id': firstOrder.store?.id,
          'store (if string)': typeof firstOrder.store === 'string' ? firstOrder.store : 'not string',
          'store type': typeof firstOrder.store
        });
        
        // Check payment status distribution
        const paymentStats = processedOrders.reduce((acc, order) => {
          const status = order.paymentStatus || 'pending';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        console.log('💰 Payment Status Distribution:', paymentStats);
        
        // Check unique store identification
        const uniqueStoreIds = new Set();
        const uniqueStoreNames = new Set();
        processedOrders.forEach(order => {
          const storeId = order.store?._id || order.store?.id || order.store;
          const storeName = order.store?.storeName;
          if (storeId) uniqueStoreIds.add(storeId);
          if (storeName) uniqueStoreNames.add(storeName);
        });
        
        console.log('🏪 Unique Store Analysis:', {
          uniqueStoreIds: uniqueStoreIds.size,
          uniqueStoreNames: uniqueStoreNames.size,
          storeIdsList: Array.from(uniqueStoreIds),
          storeNamesList: Array.from(uniqueStoreNames)
        });
      }

      // Auto-select first available state or ALL
      if (processedOrders.length > 0 && !selectedState) {
        const availableStates = [...new Set(
          processedOrders
            .map(order => order.store?.state)
            .filter(Boolean)
            .map(state => state.toUpperCase())
        )];
        
        if (availableStates.length > 0) {
          setSelectedState(availableStates[0]);
          console.log('🎯 Auto-selected state:', availableStates[0]);
        } else {
          setSelectedState('ALL');
          console.log('🎯 No states found in orders, using ALL view to show all customer data');
        }
      } else if (processedOrders.length > 0 && selectedState === '') {
        // Force ALL view if we have orders but no state selected
        setSelectedState('ALL');
        console.log('🎯 Forcing ALL view for customer data');
      }
      
    } catch (error: any) {
      console.error('❌ Error fetching data:', error);
      let errorMessage = 'Failed to fetch data';
      
      if (error.message?.includes('Token') || error.message?.includes('token')) {
        errorMessage = 'Authentication token is invalid or expired. Please log out and log back in.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please contact support.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Analyze data by state with improved calculations
  const analyzeStateData = (state: string) => {
    if (!state) return null;
    
    console.log('🔍 Analyzing state:', state);
    console.log('📊 Available orders:', allOrders.length);
    console.log('📦 Available products:', allProducts.length);

    // Filter orders by state (case insensitive) or show all if state is 'ALL'
    const stateOrders = state === 'ALL' 
      ? allOrders 
      : allOrders.filter(order => {
          const orderState = order.store?.state;
          return orderState && orderState.toUpperCase() === state.toUpperCase();
        });
    
    console.log('🎯 Orders for state', state, ':', stateOrders.length);
    
    // Analyze stores/customers with detailed financial data
    const storeAnalysis = new Map();
    
    stateOrders.forEach(order => {
      // Try multiple ways to get store ID
      let storeId = null;
      let storeName = 'Unknown Store';
      let storeInfo = null;
      
      if (order.store) {
        if (typeof order.store === 'string') {
          // Store is just an ID string
          storeId = order.store;
          storeName = `Customer ${order.store.slice(-4)}`;
        } else if (typeof order.store === 'object') {
          // Store is an object with details
          storeId = order.store._id || order.store.id;
          storeName = order.store.storeName || order.store.name || `Customer ${(storeId || '').slice(-4)}`;
          storeInfo = order.store;
        }
      }
      
      // If we still don't have a store ID, create one from order data
      if (!storeId) {
        console.warn('⚠️ No store ID found for order:', order.orderNumber);
        return;
      }
      
      if (!storeAnalysis.has(storeId)) {
        storeAnalysis.set(storeId, {
          storeId,
          storeName,
          storeInfo,
          orderCount: 0,
          totalSpent: 0,
          totalPaid: 0,
          balanceDue: 0,
          lastOrderDate: null,
          paymentStatus: {
            paid: 0,
            partial: 0,
            pending: 0
          }
        });
      }
      
      const store = storeAnalysis.get(storeId);
      const orderTotal = parseFloat(order.total) || 0;
      const paymentAmount = parseFloat(order.paymentAmount) || 0;
      
      // Update store metrics
      store.orderCount += 1;
      store.totalSpent += orderTotal;
      
      // Calculate payments and balance based on payment status
      switch (order.paymentStatus) {
        case 'paid':
          store.totalPaid += orderTotal;
          store.paymentStatus.paid += 1;
          break;
        case 'partial':
          store.totalPaid += paymentAmount;
          store.balanceDue += (orderTotal - paymentAmount);
          store.paymentStatus.partial += 1;
          break;
        case 'pending':
        default:
          store.balanceDue += orderTotal;
          store.paymentStatus.pending += 1;
          break;
      }
      
      // Track last order date
      const orderDate = new Date(order.createdAt);
      if (!store.lastOrderDate || orderDate > store.lastOrderDate) {
        store.lastOrderDate = orderDate;
      }
    });

    // Convert to array and sort by total spent
    const topStores = Array.from(storeAnalysis.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Calculate financial summary
    const totalRevenue = stateOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    const totalReceived = Array.from(storeAnalysis.values())
      .reduce((sum, store) => sum + store.totalPaid, 0);
    const totalOutstanding = Array.from(storeAnalysis.values())
      .reduce((sum, store) => sum + store.balanceDue, 0);

    // Analyze inventory with better categorization
    const inventory = allProducts.map(product => {
      const totalRemaining = product.summary?.totalRemaining || product.remaining || 0;
      const totalSell = product.summary?.totalSell || product.totalSell || 0;
      const totalPurchase = product.summary?.totalPurchase || product.totalPurchase || 0;
      const threshold = product.threshold || 10;
      
      return {
        productName: product.name || 'Unknown Product',
        productCategory: product.category || 'Uncategorized',
        totalPurchase,
        totalSell,
        totalRemaining,
        needsReorder: totalRemaining < threshold,
        price: product.pricePerBox || product.price || 0,
        turnoverRate: totalPurchase > 0 ? (totalSell / totalPurchase) * 100 : 0
      };
    });

    const lowStockItems = inventory.filter(item => item.needsReorder).length;
    const outOfStockItems = inventory.filter(item => item.totalRemaining === 0).length;

    return {
      state,
      stores: storeAnalysis.size,
      summary: {
        totalProducts: allProducts.length,
        totalOrders: stateOrders.length,
        totalRevenue,
        totalReceived,
        totalOutstanding,
        lowStockItems,
        outOfStockItems,
        averageOrderValue: stateOrders.length > 0 ? totalRevenue / stateOrders.length : 0
      },
      inventory,
      topStores,
      financialBreakdown: {
        paidOrders: stateOrders.filter(o => o.paymentStatus === 'paid').length,
        partialOrders: stateOrders.filter(o => o.paymentStatus === 'partial').length,
        pendingOrders: stateOrders.filter(o => o.paymentStatus === 'pending').length
      }
    };
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  useEffect(() => {
    console.log('🔄 useEffect triggered:', { 
      selectedState, 
      ordersCount: allOrders.length, 
      productsCount: allProducts.length,
      availableStates: getAvailableStates().length 
    });
    
    if (selectedState && selectedState !== '') {
      console.log('🎯 Analyzing data for state:', selectedState);
      const data = analyzeStateData(selectedState);
      setStateData(data);
      console.log('📊 State data set:', data);
    } else if (allOrders.length > 0 && selectedState === '') {
      // Auto-trigger ALL analysis if we have orders but no state selected
      console.log('🔄 Auto-triggering ALL analysis');
      const data = analyzeStateData('ALL');
      setStateData(data);
      setSelectedState('ALL');
    }
  }, [selectedState, allOrders, allProducts]);

  const getAvailableStates = () => {
    const states = allOrders
      .map(order => order.store?.state)
      .filter(Boolean)
      .map(state => state.toUpperCase()); // Normalize to uppercase
    const uniqueStates = [...new Set(states)];
    console.log('🗺️ Available states:', uniqueStates);
    return uniqueStates;
  };

  const lowStockProducts = stateData?.inventory?.filter(item => item.needsReorder) || [];
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container px-4 py-6 mx-auto max-w-7xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {allOrders.length > 0 
                      ? (getAvailableStates().length > 0 ? 'Multi-State Customer Dashboard' : 'Customer & Inventory Dashboard')
                      : 'Inventory Management Dashboard'
                    }
                  </h2>
                  <p className="text-muted-foreground">
                    {allOrders.length > 0
                      ? (getAvailableStates().length > 0 
                          ? 'Analyze orders and customer distribution by state from your central warehouse'
                          : 'Analyze orders and inventory from your central warehouse'
                        )
                      : `Manage your ${allProducts.length} products. Customer analytics will appear after orders are created.`
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={getAvailableStates().length > 0 ? "Select State" : "No states found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableStates().length > 0 ? (
                        getAvailableStates().map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))
                      ) : (
                        // Fallback: Show common US states if no data available
                        <>
                          <SelectItem value="no-states" disabled>
                            No states detected in orders
                          </SelectItem>
                          {['GA', 'FL', 'TX', 'CA', 'NY', 'NC', 'SC'].map(state => (
                            <SelectItem key={state} value={state}>
                              {state} (Test)
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={fetchAllData}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      console.log('🧪 Testing API connectivity...');
                      try {
                        const testResponse = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/product/getAllSummary?limit=5`);
                        const testData = await testResponse.json();
                        console.log('🧪 Test API Response:', testData);
                        alert(`API Test: ${testResponse.ok ? 'SUCCESS' : 'FAILED'} - Check console for details`);
                      } catch (error) {
                        console.error('🧪 Test API Error:', error);
                        alert('API Test FAILED - Check console for details');
                      }
                    }}
                  >
                    Test API
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      console.log('🔐 Testing Order API with token...');
                      console.log('🔐 Token value:', token);
                      console.log('🔐 Token type:', typeof token);
                      try {
                        const testResponse = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/order/getAll?limit=5`, {
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        const testData = await testResponse.json();
                        console.log('🔐 Order API Response:', testData);
                        alert(`Order API Test: ${testResponse.ok ? 'SUCCESS' : 'FAILED'} - Check console for details`);
                      } catch (error) {
                        console.error('🔐 Order API Error:', error);
                        alert('Order API Test FAILED - Check console for details');
                      }
                    }}
                  >
                    Test Order API
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      console.log('🔄 Manual analysis trigger');
                      console.log('📊 Raw orders data:', allOrders);
                      console.log('📦 Raw products data:', allProducts);
                      
                      // Quick manual calculation
                      const totalRevenue = allOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
                      const uniqueCustomers = new Set();
                      allOrders.forEach(order => {
                        let storeId = null;
                        if (order.store) {
                          if (typeof order.store === 'string') {
                            storeId = order.store;
                          } else if (typeof order.store === 'object') {
                            storeId = order.store._id || order.store.id;
                          }
                        }
                        if (storeId) uniqueCustomers.add(storeId);
                      });
                      
                      console.log('🧮 Manual calculations:', {
                        totalOrders: allOrders.length,
                        uniqueCustomers: uniqueCustomers.size,
                        totalRevenue,
                        customerIds: Array.from(uniqueCustomers)
                      });
                      
                      const data = analyzeStateData('ALL');
                      setStateData(data);
                      setSelectedState('ALL');
                    }}
                    disabled={allOrders.length === 0}
                  >
                    Analyze All Data
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/auth';
                    }}
                  >
                    Logout & Re-login
                  </Button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Error: {error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status & Debug Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Token:</span>
                      <div className={`font-medium ${token ? 'text-green-600' : 'text-red-600'}`}>
                        {token ? 'Present' : 'Missing'}
                      </div>
                      {token && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Length: {token.length}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Orders:</span>
                      <div className="font-medium">{allOrders.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Products:</span>
                      <div className="font-medium">{allProducts.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">States:</span>
                      <div className="font-medium">{getAvailableStates().length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Selected:</span>
                      <div className="font-medium">{selectedState || 'None'}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Base URL:</span>
                      <div className="font-medium text-xs break-all">{import.meta.env.VITE_APP_BASE_URL}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loading:</span>
                      <div className={`font-medium ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                        {loading ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Error:</span>
                      <div className={`font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>
                        {error || 'None'}
                      </div>
                    </div>
                  </div>
                  
                  {getAvailableStates().length > 0 && (
                    <div className="mt-4">
                      <span className="text-muted-foreground text-sm">Available States: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getAvailableStates().map(state => (
                          <Badge key={state} variant="outline" className="text-xs">
                            {state}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Sample Data Preview */}
                  {allOrders.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="text-sm font-medium mb-2">Sample Order Data:</div>
                      <div className="text-xs space-y-1">
                        <div>Order #: {allOrders[0]?.orderNumber || 'N/A'}</div>
                        <div>Store Type: {typeof allOrders[0]?.store}</div>
                        <div>Store ID: {allOrders[0]?.store?._id || allOrders[0]?.store?.id || allOrders[0]?.store || 'N/A'}</div>
                        <div>Store Name: {allOrders[0]?.store?.storeName || 'N/A'}</div>
                        <div>State: {allOrders[0]?.store?.state || 'N/A'}</div>
                        <div>Total: ${allOrders[0]?.total || 0}</div>
                        <div>Payment Status: {allOrders[0]?.paymentStatus || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Customer Count Debug */}
                  {allOrders.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                      <div className="text-sm font-medium mb-2">Customer Analysis Debug:</div>
                      <div className="text-xs space-y-1">
                        <div>Total Orders: {allOrders.length}</div>
                        <div>Unique Customers: {(() => {
                          const uniqueCustomers = new Set();
                          allOrders.forEach(order => {
                            let storeId = null;
                            if (order.store) {
                              if (typeof order.store === 'string') {
                                storeId = order.store;
                              } else if (typeof order.store === 'object') {
                                storeId = order.store._id || order.store.id;
                              }
                            }
                            if (storeId) uniqueCustomers.add(storeId);
                          });
                          return uniqueCustomers.size;
                        })()}</div>
                        <div>Analysis State: {selectedState || 'None'}</div>
                        <div>State Data: {stateData ? 'Generated' : 'Missing'}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Missing State Data Warning */}
                  {allOrders.length > 0 && getAvailableStates().length === 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <div className="text-sm font-medium mb-2 text-yellow-800">⚠️ No State Information Found</div>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <div>Your orders don't have state information in the store data.</div>
                        <div>To enable state-based analysis, ensure customer records have state information.</div>
                        <div>For now, you can view all data in the overview below.</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products-Only Dashboard */}
              {!loading && allOrders.length === 0 && allProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Overview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Your product inventory is ready. Customer data will appear once orders are created.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-blue-600">{allProducts.length}</div>
                        <div className="text-sm text-muted-foreground">Total Products</div>
                        <div className="text-xs text-muted-foreground mt-1">Ready for sale</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {allProducts.filter(p => (p.summary?.totalRemaining || p.remaining || 0) > 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">In Stock</div>
                        <div className="text-xs text-muted-foreground mt-1">Available products</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-yellow-600">
                          {allProducts.filter(p => {
                            const remaining = p.summary?.totalRemaining || p.remaining || 0;
                            const threshold = p.threshold || 10;
                            return remaining > 0 && remaining < threshold;
                          }).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Low Stock</div>
                        <div className="text-xs text-muted-foreground mt-1">Need reorder</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-red-600">
                          {allProducts.filter(p => (p.summary?.totalRemaining || p.remaining || 0) === 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Out of Stock</div>
                        <div className="text-xs text-muted-foreground mt-1">Need restocking</div>
                      </div>
                    </div>
                    
                    {/* Product Categories */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Product Categories</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {(() => {
                          const categories = allProducts.reduce((acc, product) => {
                            const category = product.category || 'Uncategorized';
                            acc[category] = (acc[category] || 0) + 1;
                            return acc;
                          }, {});
                          
                          return Object.entries(categories).map(([category, count]) => (
                            <div key={category} className="text-center p-2 bg-muted rounded">
                              <div className="font-medium">{count}</div>
                              <div className="text-xs text-muted-foreground">{category}</div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    
                    {/* Advanced Analytics Promotion */}
                    <div className="mb-6">
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-lg text-blue-900 mb-2">🚀 Ready for Advanced Analytics?</h4>
                              <p className="text-blue-700 mb-3">
                                Once you have orders, unlock powerful AI-driven insights including:
                              </p>
                              <ul className="text-sm text-blue-600 space-y-1">
                                <li>• Customer behavior predictions & churn analysis</li>
                                <li>• Intelligent reorder recommendations</li>
                                <li>• Route optimization & delivery planning</li>
                                <li>• Automated inventory management</li>
                              </ul>
                            </div>
                            <div className="ml-6">
                              <Button 
                                onClick={() => window.location.href = '/advanced-order-analytics'}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
                              >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Explore Analytics
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sample Products */}
                    <div>
                      <h4 className="font-medium mb-3">Sample Products</h4>
                      <div className="space-y-2">
                        {allProducts.slice(0, 5).map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Category: {product.category || 'Uncategorized'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                Stock: {product.summary?.totalRemaining || product.remaining || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ${product.pricePerBox || product.price || 0}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced All Data Overview */}
              {!loading && allOrders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Business Overview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getAvailableStates().length > 0 
                        ? 'Select a state above to see state-specific data, or view overall summary below'
                        : 'Overall business summary - no state data available in orders'
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold">{allOrders.length}</div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Avg: ${allOrders.length > 0 ? (allOrders.reduce((sum, order) => sum + (order.total || 0), 0) / allOrders.length).toFixed(2) : 0}
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold">
                          {(() => {
                            const uniqueCustomers = new Set();
                            allOrders.forEach(order => {
                              let storeId = null;
                              if (order.store) {
                                if (typeof order.store === 'string') {
                                  storeId = order.store;
                                } else if (typeof order.store === 'object') {
                                  storeId = order.store._id || order.store.id;
                                }
                              }
                              if (storeId) uniqueCustomers.add(storeId);
                            });
                            return uniqueCustomers.size;
                          })()}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Customers</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {allProducts.length} Products
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold">
                          ${allOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                        <div className="text-xs text-green-600 mt-1">
                          Received: ${allOrders.reduce((sum, order) => {
                            const total = parseFloat(order.total) || 0;
                            const paid = parseFloat(order.paymentAmount) || 0;
                            return sum + (order.paymentStatus === 'paid' ? total : order.paymentStatus === 'partial' ? paid : 0);
                          }, 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          ${allOrders.reduce((sum, order) => {
                            const total = parseFloat(order.total) || 0;
                            const paid = parseFloat(order.paymentAmount) || 0;
                            return sum + (order.paymentStatus === 'paid' ? 0 : order.paymentStatus === 'partial' ? (total - paid) : total);
                          }, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Outstanding</div>
                        <div className="text-xs text-red-600 mt-1">
                          {allOrders.filter(o => o.paymentStatus === 'pending').length} pending
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Status Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                        <div className="text-lg font-bold text-green-700">
                          {allOrders.filter(o => o.paymentStatus === 'paid').length}
                        </div>
                        <div className="text-sm text-green-600">Paid Orders</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="text-lg font-bold text-yellow-700">
                          {allOrders.filter(o => o.paymentStatus === 'partial').length}
                        </div>
                        <div className="text-sm text-yellow-600">Partial Payments</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
                        <div className="text-lg font-bold text-red-700">
                          {allOrders.filter(o => o.paymentStatus === 'pending').length}
                        </div>
                        <div className="text-sm text-red-600">Pending Payments</div>
                      </div>
                    </div>
                    
                    {/* Recent Orders with Payment Status */}
                    {allOrders.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Recent Orders</h4>
                        <div className="space-y-2">
                          {allOrders.slice(0, 8).map((order, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50">
                              <div className="flex-1">
                                <div className="font-medium">{order.orderNumber}</div>
                                <div className="text-sm text-muted-foreground">
                                  {order.store?.storeName} • {order.store?.city}, {order.store?.state}
                                </div>
                              </div>
                              <div className="text-center mx-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.paymentStatus === 'paid' 
                                    ? 'bg-green-100 text-green-700' 
                                    : order.paymentStatus === 'partial'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {order.paymentStatus || 'pending'}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${parseFloat(order.total || 0).toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                {order.paymentStatus === 'partial' && (
                                  <div className="text-xs text-orange-600">
                                    Due: ${(parseFloat(order.total || 0) - parseFloat(order.paymentAmount || 0)).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Enhanced State Overview Cards */}
              {stateData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stateData.stores}</div>
                        <p className="text-xs text-muted-foreground">
                          Customers in {selectedState}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stateData.summary?.totalOrders || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          Orders from {selectedState}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Avg: ${stateData.summary?.averageOrderValue?.toFixed(2) || 0}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${stateData.summary?.totalRevenue?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          Revenue from {selectedState}
                        </p>
                        <div className="text-xs text-green-600 mt-1">
                          Received: ${stateData.summary?.totalReceived?.toLocaleString() || 0}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          ${stateData.summary?.totalOutstanding?.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Amount due from {selectedState}
                        </p>
                        <div className="text-xs text-red-600 mt-1">
                          {stateData.financialBreakdown?.pendingOrders || 0} pending orders
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Payment Status Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-green-600">Paid Orders:</span>
                            <span className="font-medium">{stateData.financialBreakdown?.paidOrders || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-yellow-600">Partial Payments:</span>
                            <span className="font-medium">{stateData.financialBreakdown?.partialOrders || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-red-600">Pending Payments:</span>
                            <span className="font-medium">{stateData.financialBreakdown?.pendingOrders || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Inventory Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Products:</span>
                            <span className="font-medium">{stateData.summary?.totalProducts || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-yellow-600">Low Stock:</span>
                            <span className="font-medium">{stateData.summary?.lowStockItems || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-red-600">Out of Stock:</span>
                            <span className="font-medium">{stateData.summary?.outOfStockItems || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Collection Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {stateData.summary?.totalRevenue > 0 
                              ? ((stateData.summary.totalReceived / stateData.summary.totalRevenue) * 100).toFixed(1)
                              : 0}%
                          </div>
                          <p className="text-xs text-muted-foreground">Payment collection rate</p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{
                                width: `${stateData.summary?.totalRevenue > 0 
                                  ? (stateData.summary.totalReceived / stateData.summary.totalRevenue) * 100
                                  : 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Customers Table */}
                  {stateData.topStores && stateData.topStores.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Customers by Revenue</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Showing top customers with detailed financial information
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Customer</th>
                                <th className="text-right p-2">Orders</th>
                                <th className="text-right p-2">Total Spent</th>
                                <th className="text-right p-2">Paid</th>
                                <th className="text-right p-2">Balance Due</th>
                                <th className="text-right p-2">Last Order</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stateData.topStores.slice(0, 8).map((store, index) => (
                                <tr key={store.storeId} className="border-b hover:bg-muted/50">
                                  <td className="p-2">
                                    <div>
                                      <div className="font-medium">{store.storeName}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {store.storeInfo?.city}, {store.storeInfo?.state}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-right p-2 font-medium">{store.orderCount}</td>
                                  <td className="text-right p-2 font-medium">
                                    ${store.totalSpent.toLocaleString()}
                                  </td>
                                  <td className="text-right p-2 text-green-600">
                                    ${store.totalPaid.toLocaleString()}
                                  </td>
                                  <td className="text-right p-2">
                                    <span className={store.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}>
                                      ${store.balanceDue.toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="text-right p-2 text-xs text-muted-foreground">
                                    {store.lastOrderDate ? new Date(store.lastOrderDate).toLocaleDateString() : 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* No Orders but Products Available */}
              {!loading && allOrders.length === 0 && allProducts.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="text-center py-8">
                    <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-blue-800">Products Ready - No Orders Yet</h3>
                    <p className="text-blue-700 mb-4">
                      You have {allProducts.length} products in your inventory, but no customer orders have been created yet.
                    </p>
                    <div className="text-left max-w-md mx-auto mb-4">
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>✅ {allProducts.length} products loaded successfully</div>
                        <div>📦 Inventory system is ready</div>
                        <div>🛒 Waiting for first customer orders</div>
                        <div>👥 Customer data will appear after orders are created</div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button onClick={() => window.location.href = '/orders/new'} className="bg-blue-600 hover:bg-blue-700">
                        <Package className="h-4 w-4 mr-2" />
                        Create First Order
                      </Button>
                      <Button variant="outline" onClick={() => window.location.href = '/admin/inventory'}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Inventory
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/advanced-order-analytics'}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Advanced Analytics
                      </Button>
                      <Button variant="outline" onClick={fetchAllData}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Data State */}
              {!loading && allOrders.length === 0 && allProducts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Data Available</h3>
                    <p className="text-muted-foreground mb-4">
                      No orders or products found. This could be because:
                    </p>
                    <div className="text-left max-w-md mx-auto mb-4">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• No orders have been created yet</li>
                        <li>• No products have been added to the system</li>
                        <li>• Authentication token is invalid or expired</li>
                        <li>• Backend server is not running on port 8080</li>
                        <li>• Database connection issues</li>
                      </ul>
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button onClick={fetchAllData}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                      <Button variant="outline" onClick={() => window.location.href = '/admin/orders'}>
                        Go to Orders
                      </Button>
                      <Button variant="outline" onClick={() => window.location.href = '/admin/inventory'}>
                        Go to Inventory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data Available but No Analysis */}
              {!loading && (allOrders.length > 0 || allProducts.length > 0) && !stateData && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-yellow-800">Data Found - Analysis Pending</h3>
                    <p className="text-yellow-700 mb-4">
                      We found {allOrders.length} orders and {allProducts.length} products, but analysis hasn't started yet.
                    </p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button 
                        onClick={() => {
                          const data = analyzeStateData('ALL');
                          setStateData(data);
                          setSelectedState('ALL');
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Start Analysis
                      </Button>
                      <Button variant="outline" onClick={fetchAllData}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Data
                      </Button>
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

// Fixed export issue
export default StateInventoryDashboard;