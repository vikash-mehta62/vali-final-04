import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Edit3,
  Eye,
  Calendar,
  BarChart3,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllOrderAPI } from '@/services2/operations/order';
import { getAllProductSummaryAPI } from '@/services2/operations/product';
import { 
  getAllProductLocationsAPI, 
  getLowStockAlertsAPI, 
  getInventorySummaryAPI,
  getAllWarehousesAPI,
  seedInventoryDataAPI 
} from '@/services2/operations/inventory';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
// Removed modal imports to prevent errors - will add simple inline editing

interface OrderData {
  _id: string;
  orderNumber: string;
  store: {
    storeName: string;
    ownerName: string;
    state: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    pricingType: string;
    unitPrice: number;
    total: number;
  }>;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  orderType: string;
}

interface ProductData {
  _id: string;
  name: string;
  category: string;
  summary: {
    totalRemaining: number;
    totalPurchase: number;
    totalSell: number;
  };
  price: number;
  pricePerBox: number;
}

interface StorePattern {
  storeId: string;
  storeName: string;
  state: string;
  weeklyOrders: number;
  avgOrderValue: number;
  lastOrderDate: string;
  topProducts: Array<{
    productName: string;
    totalQuantity: number;
  }>;
  orderFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Irregular';
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface InventoryLocation {
  _id: string;
  productInfo: {
    name: string;
    category: string;
  };
  warehouseInfo: {
    name: string;
    state: string;
  };
  zone: string;
  binLocation: string;
  quantities: {
    totalBoxes: number;
    totalUnits: number;
    availableBoxes: number;
    availableUnits: number;
    allocatedBoxes: number;
    allocatedUnits: number;
    damagedBoxes: number;
    damagedUnits: number;
  };
  reorderPoint: {
    boxes: number;
    units: number;
  };
  needsReorderBoxes?: boolean;
  needsReorderUnits?: boolean;
}

interface LowStockAlert {
  productName: string;
  productCategory: string;
  warehouseName: string;
  warehouseState: string;
  zone: string;
  binLocation: string;
  availableBoxes: number;
  availableUnits: number;
  reorderPointBoxes: number;
  reorderPointUnits: number;
  urgencyLevel: 'Critical' | 'High' | 'Medium';
}

const OrderInventoryManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [storePatterns, setStorePatterns] = useState<StorePattern[]>([]);
  const [inventoryLocations, setInventoryLocations] = useState<InventoryLocation[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [inventoryInitialized, setInventoryInitialized] = useState(false);
  // Removed modal states - using simple alerts for now

  const token = useSelector((state: RootState) => state.auth?.token);

  // Initialize inventory data if needed
  const initializeInventoryData = async () => {
    if (!token) return;
    
    try {
      console.log('🌱 Initializing inventory data...');
      setLoading(true);
      
      const response = await seedInventoryDataAPI(token);
      console.log('✅ Inventory data initialized:', response);
      
      // Refresh data after seeding
      await fetchData();
    } catch (error) {
      console.error('❌ Error initializing inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Fetching orders, products, and inventory...');
      
      const [ordersResponse, productsResponse, inventoryResponse, lowStockResponse] = await Promise.all([
        getAllOrderAPI(token, 'limit=500'),
        getAllProductSummaryAPI('?limit=500'),
        getAllProductLocationsAPI(token, 'limit=100').catch(() => ({ data: [] })),
        getLowStockAlertsAPI(token).catch(() => ({ data: [] }))
      ]);

      console.log('📦 Orders Response:', ordersResponse);
      console.log('🏷️ Products Response:', productsResponse);
      console.log('📍 Inventory Response:', inventoryResponse);
      console.log('⚠️ Low Stock Response:', lowStockResponse);

      if (ordersResponse?.orders) {
        setOrders(ordersResponse.orders);
        analyzeStorePatterns(ordersResponse.orders);
        console.log('✅ Orders loaded:', ordersResponse.orders.length);
      } else {
        console.log('⚠️ No orders in response');
        setOrders([]);
      }

      if (productsResponse?.products || productsResponse?.data) {
        const productData = productsResponse.products || productsResponse.data || productsResponse;
        setProducts(productData);
        console.log('✅ Products loaded:', productData.length);
      } else {
        console.log('⚠️ No products in response');
        setProducts([]);
      }

      if (inventoryResponse?.data) {
        setInventoryLocations(inventoryResponse.data);
        setInventoryInitialized(true);
        console.log('✅ Inventory locations loaded:', inventoryResponse.data.length);
      } else {
        console.log('⚠️ No inventory locations found');
        setInventoryLocations([]);
      }

      if (lowStockResponse?.data) {
        setLowStockAlerts(lowStockResponse.data);
        console.log('✅ Low stock alerts loaded:', lowStockResponse.data.length);
      } else {
        setLowStockAlerts([]);
      }

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      // Don't break the UI, just log the error
      setOrders([]);
      setProducts([]);
      setInventoryLocations([]);
      setLowStockAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // Analyze store ordering patterns
  const analyzeStorePatterns = (orderData: OrderData[]) => {
    if (!orderData || orderData.length === 0) {
      setStorePatterns([]);
      return;
    }

    const storeMap = new Map();
    
    orderData.forEach(order => {
      // Skip orders without proper store data
      if (!order.store?.storeName) return;
      
      const storeId = order.store.storeName;
      const orderDate = new Date(order.createdAt);
      
      if (!storeMap.has(storeId)) {
        storeMap.set(storeId, {
          storeId,
          storeName: order.store.storeName,
          state: order.store.state || 'Unknown',
          orders: [],
          totalValue: 0,
          lastOrderDate: orderDate
        });
      }
      
      const storeData = storeMap.get(storeId);
      storeData.orders.push(order);
      storeData.totalValue += (order.total || 0);
      
      if (orderDate > storeData.lastOrderDate) {
        storeData.lastOrderDate = orderDate;
      }
    });

    const patterns: StorePattern[] = Array.from(storeMap.values()).map(store => {
      const weeklyOrders = store.orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }).length;

      const avgOrderValue = store.totalValue / store.orders.length;
      
      // Determine order frequency
      const daysSinceLastOrder = Math.floor((new Date().getTime() - store.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
      let orderFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Irregular' = 'Irregular';
      let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

      if (weeklyOrders >= 1) {
        orderFrequency = 'Weekly';
        riskLevel = 'Low';
      } else if (daysSinceLastOrder <= 14) {
        orderFrequency = 'Bi-weekly';
        riskLevel = 'Low';
      } else if (daysSinceLastOrder <= 30) {
        orderFrequency = 'Monthly';
        riskLevel = 'Medium';
      } else {
        orderFrequency = 'Irregular';
        riskLevel = 'High';
      }

      // Get top products for this store
      const productMap = new Map();
      store.orders.forEach(order => {
        order.items.forEach(item => {
          const productName = item.name;
          if (!productMap.has(productName)) {
            productMap.set(productName, 0);
          }
          productMap.set(productName, productMap.get(productName) + item.quantity);
        });
      });

      const topProducts = Array.from(productMap.entries())
        .map(([productName, totalQuantity]) => ({ productName, totalQuantity }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 3);

      return {
        storeId: store.storeId,
        storeName: store.storeName,
        state: store.state,
        weeklyOrders,
        avgOrderValue,
        lastOrderDate: store.lastOrderDate.toISOString(),
        topProducts,
        orderFrequency,
        riskLevel
      };
    });

    setStorePatterns(patterns.sort((a, b) => b.weeklyOrders - a.weeklyOrders));
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Filter functions
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.store?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || order.store?.state === selectedState;
    return matchesSearch && matchesState;
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStores = storePatterns.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || store.state === selectedState;
    return matchesSearch && matchesState;
  });

  // Get low stock products (more flexible threshold)
  const lowStockProducts = products.filter(product => {
    const remaining = product.summary?.totalRemaining || 0;
    const threshold = product.threshold || 10; // Use product's threshold or default to 10
    return remaining < threshold && remaining >= 0;
  });

  // Get recent orders (last 30 days to show more data)
  const recentOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return orderDate >= monthAgo;
  });

  // Handle order edit - simple alert for now
  const handleEditOrder = (order: OrderData) => {
    alert(`Edit Order: ${order.orderNumber}\nStore: ${order.store?.storeName}\nTotal: $${order.total}`);
  };

  // Handle inventory adjustment - simple alert for now
  const handleAdjustInventory = (product: ProductData) => {
    alert(`Adjust Inventory: ${product.name}\nRemaining: ${product.summary?.totalRemaining || 0}`);
  };

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
              <h1 className="text-3xl font-bold">Order & Inventory Management</h1>
              <p className="text-muted-foreground">
                Unified dashboard for managing orders, inventory, and customer patterns
              </p>
            </div>

            {/* Data Status */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Orders:</span>
                    <div className="font-medium text-lg">{orders.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Products:</span>
                    <div className="font-medium text-lg">{products.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Inventory Locations:</span>
                    <div className="font-medium text-lg">{inventoryLocations.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Low Stock Alerts:</span>
                    <div className={`font-medium text-lg ${lowStockAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {lowStockAlerts.length}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Store Patterns:</span>
                    <div className="font-medium text-lg">{storePatterns.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className={`font-medium ${loading ? 'text-yellow-600' : orders.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {loading ? 'Loading...' : orders.length > 0 ? 'Data Loaded' : 'No Data'}
                    </div>
                  </div>
                </div>
                
                {/* Inventory Initialization */}
                {!inventoryInitialized && inventoryLocations.length === 0 && !loading && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Initialize Inventory System</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          No inventory data found. Click to create sample warehouses and inventory locations.
                        </p>
                      </div>
                      <Button 
                        onClick={initializeInventoryData}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Initialize Inventory
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{lowStockAlerts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {lowStockAlerts.filter(alert => alert.urgencyLevel === 'Critical').length} Critical
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storePatterns.length}</div>
                  <p className="text-xs text-muted-foreground">Total customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${recentOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search orders, stores, or products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {Array.from(new Set(orders.map(o => o.store?.state).filter(Boolean))).map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={fetchData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
                <TabsTrigger value="inventory">Inventory ({inventoryLocations.length})</TabsTrigger>
                <TabsTrigger value="patterns">Store Patterns ({storePatterns.length})</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Low Stock Alert */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Low Stock Alert
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {lowStockProducts.slice(0, 5).map(product => (
                          <div key={product._id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Remaining: {product.summary?.totalRemaining || 0}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAdjustInventory(product)}
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Adjust
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Recent Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {recentOrders.slice(0, 5).map(order => (
                          <div key={order._id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">{order.orderNumber}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.store?.storeName} • ${order.total}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Order #</th>
                            <th className="text-left p-2">Store</th>
                            <th className="text-left p-2">State</th>
                            <th className="text-right p-2">Total</th>
                            <th className="text-center p-2">Status</th>
                            <th className="text-center p-2">Date</th>
                            <th className="text-center p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.slice(0, 20).map(order => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-medium">{order.orderNumber}</td>
                              <td className="p-2">{order.store?.storeName}</td>
                              <td className="p-2">{order.store?.state}</td>
                              <td className="p-2 text-right">${order.total}</td>
                              <td className="p-2 text-center">
                                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="p-2 text-center">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button size="sm" variant="outline" onClick={() => handleEditOrder(order)}>
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory">
                <div className="space-y-6">
                  {/* Low Stock Alerts */}
                  {lowStockAlerts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Low Stock Alerts ({lowStockAlerts.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {lowStockAlerts.slice(0, 6).map((alert, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-200">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-red-900">{alert.productName}</h4>
                                <Badge variant="destructive">{alert.urgencyLevel}</Badge>
                              </div>
                              <p className="text-sm text-red-700 mb-1">{alert.warehouseName} - {alert.zone}</p>
                              <p className="text-sm text-red-600">
                                Available: {alert.availableBoxes} boxes, {alert.availableUnits} units
                              </p>
                              <p className="text-xs text-red-500">
                                Reorder at: {alert.reorderPointBoxes} boxes, {alert.reorderPointUnits} units
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Inventory Locations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Locations</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Real-time inventory across all warehouse locations
                      </p>
                    </CardHeader>
                    <CardContent>
                      {inventoryLocations.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Product</th>
                                <th className="text-left p-2">Warehouse</th>
                                <th className="text-left p-2">Zone</th>
                                <th className="text-left p-2">Location</th>
                                <th className="text-right p-2">Available Boxes</th>
                                <th className="text-right p-2">Available Units</th>
                                <th className="text-center p-2">Status</th>
                                <th className="text-center p-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventoryLocations.slice(0, 20).map(location => {
                                const needsReorder = location.needsReorderBoxes || location.needsReorderUnits;
                                const isCritical = location.quantities.availableBoxes === 0 || location.quantities.availableUnits === 0;
                                
                                return (
                                  <tr key={location._id} className={`border-b hover:bg-gray-50 ${isCritical ? 'bg-red-50' : needsReorder ? 'bg-yellow-50' : ''}`}>
                                    <td className="p-2 font-medium">{location.productInfo?.name}</td>
                                    <td className="p-2">{location.warehouseInfo?.name}</td>
                                    <td className="p-2">{location.zone}</td>
                                    <td className="p-2 font-mono text-sm">{location.binLocation}</td>
                                    <td className="p-2 text-right">{location.quantities.availableBoxes}</td>
                                    <td className="p-2 text-right">{location.quantities.availableUnits}</td>
                                    <td className="p-2 text-center">
                                      <Badge variant={
                                        isCritical ? 'destructive' : 
                                        needsReorder ? 'secondary' : 'default'
                                      }>
                                        {isCritical ? 'Critical' : needsReorder ? 'Low Stock' : 'Good'}
                                      </Badge>
                                    </td>
                                    <td className="p-2 text-center">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => alert(`Adjust Inventory\nProduct: ${location.productInfo?.name}\nWarehouse: ${location.warehouseInfo?.name}\nAvailable: ${location.quantities.availableBoxes} boxes, ${location.quantities.availableUnits} units`)}
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Inventory Data</h3>
                          <p className="text-muted-foreground mb-4">
                            Initialize the inventory system to start tracking warehouse locations.
                          </p>
                          {!inventoryInitialized && (
                            <Button onClick={initializeInventoryData} disabled={loading}>
                              <Package className="h-4 w-4 mr-2" />
                              Initialize Inventory System
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Store Patterns Tab */}
              <TabsContent value="patterns">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Ordering Patterns</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Analyze customer ordering behavior and identify trends
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStores.map(store => (
                        <Card key={store.storeId} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{store.storeName}</CardTitle>
                              <Badge 
                                variant={
                                  store.riskLevel === 'Low' ? 'default' : 
                                  store.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                                }
                              >
                                {store.riskLevel} Risk
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{store.state}</p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Weekly Orders:</span>
                                <div className="font-medium">{store.weeklyOrders}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Avg Value:</span>
                                <div className="font-medium">${store.avgOrderValue.toFixed(0)}</div>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-sm text-muted-foreground">Frequency:</span>
                              <Badge variant="outline" className="ml-2">
                                {store.orderFrequency}
                              </Badge>
                            </div>
                            
                            <div>
                              <span className="text-sm text-muted-foreground">Last Order:</span>
                              <div className="text-sm">
                                {new Date(store.lastOrderDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-sm text-muted-foreground">Top Products:</span>
                              <div className="mt-1 space-y-1">
                                {store.topProducts.slice(0, 2).map((product, idx) => (
                                  <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {product.productName} ({product.totalQuantity})
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modals removed - using simple alerts for now */}
    </div>
  );
};

export default OrderInventoryManagement;