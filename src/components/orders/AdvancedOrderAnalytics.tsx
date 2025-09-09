import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  TrendingUp, 
  MapPin, 
  Package, 
  Clock,
  AlertTriangle,
  BarChart3,
  Route,
  RefreshCw,
  Download,
  Filter,
  Zap,
  Target,
  Truck,
  DollarSign,
  Bot
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllOrderAPI } from '@/services2/operations/order';
import { getAllProductSummaryAPI } from '@/services2/operations/product';
import AutoReorderSystem from './AutoReorderSystem';
import ClientsGuide from '../documentation/guides/ClientsGuide';
import { getAllMembersAPI, userWithOrderDetails } from "@/services2/operations/auth"

interface OrderAnalytics {
  timeframe: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
    frequency: number;
  }>;
  customerInsights: Array<{
    customerId: string;
    customerName: string;
    location: string;
    orderFrequency: number;
    totalSpent: number;
    lastOrderDate: string;
    predictedNextOrder: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  routeOptimization: Array<{
    route: string;
    customers: number;
    totalOrders: number;
    efficiency: number;
    suggestedDay: string;
  }>;
  reorderSuggestions: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    averageWeeklyUsage: number;
    suggestedReorderQuantity: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    estimatedStockoutDate: string;
  }>;
}

const AdvancedOrderAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('thisWeek');
  const [selectedView, setSelectedView] = useState('overview');
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  
  const token = useSelector((state: RootState) => state.auth?.token);

  const timeframes = {
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    last30Days: 'Last 30 Days',
    last90Days: 'Last 90 Days',
    thisYear: 'This Year',
    custom: 'Custom Range'
  };

  // Fetch real data only
const fetchData = async () => {
  setLoading(true);

  try {
    // 1️⃣ Fetch products (no auth required)
    const productsResponse = await getAllProductSummaryAPI('?limit=5000');
    const products = productsResponse?.data || [];

    // Initialize orders & customers
    let orders: any[] = [];
    let customers: any[] = [];

    // 2️⃣ Fetch orders if token is available
    if (token) {
      try {
        const ordersResponse = await getAllOrderAPI(token, '?limit=10000');
        orders = ordersResponse?.orders || [];
      } catch (orderError) {
        console.warn('Could not fetch orders (auth required):', orderError);
      }

      // 3️⃣ Fetch members/customers
      try {
        const membersData = await getAllMembersAPI();
        const filteredData = membersData?.filter((member) => member.role === 'store') || [];

        customers = filteredData.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        console.log(customers, "checks")
      } catch (customerError) {
        console.error('Error fetching members:', customerError);
        customers = [];
      }
    }

    // 4️⃣ Console log everything
    console.log('📊 Fetched real data:', {
      orders: orders.length,
      products: products.length,
      customers, // here you can see all customers
    });

    // 5️⃣ Set state
    setAllOrders(orders);
    setAllProducts(products);
    setAllCustomers(customers);

    // 6️⃣ Generate analytics
    const analyticsData = generateAnalytics(
      orders,
      products,
      selectedTimeframe,
      selectedState,
      selectedRoute
    ); 
    setAnalytics(analyticsData);

  } catch (error) {
    console.error('Error fetching data:', error);
    setAllOrders([]);
    setAllProducts([]);
    setAllCustomers([]);
    setAnalytics(null);
  } finally {
    setLoading(false);
  }
};

const getQuantitySold = (salesHistory: { quantity: number }[]) => {
  return salesHistory?.reduce((total, sale) => total + (sale.quantity ?? 0), 0) ?? 0;
};


  // Generate comprehensive analytics using REAL DATA ONLY
  const generateAnalytics = (orders: any[], products: any[], timeframe: string, state: string, route: string): OrderAnalytics => {
    console.log('📊 Generating analytics with real data:', { orders: orders.length, products: products.length });
    
    // Filter orders by timeframe
    const filteredOrders = filterOrdersByTimeframe(orders, timeframe);
    
    // Filter by state if selected
    const stateFilteredOrders = state === 'all' 
      ? filteredOrders 
      : filteredOrders.filter(order => order.store?.state?.toUpperCase() === state.toUpperCase());
    
    console.log('📊 Analytics Input Data:', {
      totalOrders: orders.length,
      filteredOrders: stateFilteredOrders.length,
      totalProducts: products.length,
      timeframe,
      selectedState,
      selectedRoute
    });
    
    // Calculate basic metrics
    const totalOrders = stateFilteredOrders.length;
    const totalRevenue = stateFilteredOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    console.log('💰 Basic Metrics:', { totalOrders, totalRevenue, averageOrderValue });

    // Analyze top products
    const productAnalysis = analyzeTopProducts(stateFilteredOrders);
    
    // Generate customer insights with AI predictions
    const customerInsights = generateCustomerInsights(stateFilteredOrders);
    
    // Route optimization analysis
    const routeOptimization = analyzeRoutes(stateFilteredOrders);
    
    // Intelligent reorder suggestions (always use real products)
    const reorderSuggestions = generateReorderSuggestions(products, stateFilteredOrders);

    console.log('📈 Generated Analytics Summary:', {
      topProducts: productAnalysis.length,
      customerInsights: customerInsights.length,
      routeOptimization: routeOptimization.length,
      reorderSuggestions: reorderSuggestions.length
    });

    return {
      timeframe,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topProducts: productAnalysis,
      customerInsights,
      routeOptimization,
      reorderSuggestions
    };
  };

  // Filter orders by timeframe
  const filterOrdersByTimeframe = (orders: any[], timeframe: string) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (timeframe) {
      case 'today':
        return orders.filter(order => new Date(order.createdAt) >= startOfToday);
      case 'yesterday':
        const yesterday = new Date(startOfToday);
        yesterday.setDate(yesterday.getDate() - 1);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= yesterday && orderDate < startOfToday;
        });
      case 'thisWeek':
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        return orders.filter(order => new Date(order.createdAt) >= startOfWeek);
      case 'lastWeek':
        const startOfLastWeek = new Date(startOfToday);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - startOfLastWeek.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() + 7);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfLastWeek && orderDate < endOfLastWeek;
        });
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return orders.filter(order => new Date(order.createdAt) >= startOfMonth);
      case 'lastMonth':
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfLastMonth && orderDate < endOfLastMonth;
        });
      case 'last30Days':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return orders.filter(order => new Date(order.createdAt) >= thirtyDaysAgo);
      case 'last90Days':
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return orders.filter(order => new Date(order.createdAt) >= ninetyDaysAgo);
      case 'thisYear':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return orders.filter(order => new Date(order.createdAt) >= startOfYear);
      default:
        return orders;
    }
  };

  // Analyze top products with advanced metrics - REAL DATA ONLY
  const analyzeTopProducts = (orders: any[]) => {
    const productMap = new Map();
    
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        const productId = item.productId;
        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const revenue = quantity * price;
        
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            productId,
            productName: item.productName || item.name || 'Unknown Product',
            quantity: 0,
            revenue: 0,
            frequency: 0,
            orders: new Set()
          });
        }
        
        const product = productMap.get(productId);
        product.quantity += quantity;
        product.revenue += revenue;
        product.orders.add(order._id);
        product.frequency = product.orders.size;
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Generate AI-powered customer insights - REAL DATA ONLY
  const generateCustomerInsights = (orders: any[]) => {
    console.log('🔍 Generating customer insights from orders:', orders.length);
    
    // Debug: Log first few orders to see structure
    if (orders.length > 0) {
      console.log('📋 Sample order structure:', {
        order: orders[0],
        store: orders[0]?.store,
        storeFields: orders[0]?.store ? Object.keys(orders[0].store) : 'No store data'
      });
    }
    
    // If no orders, show registered customers from store management
    if (orders.length === 0) {
      console.log('ℹ️ No orders available - showing registered customers from store management');
      
      // Get customers from the component state (fetched from auth/store system)
      const registeredCustomers = allCustomers.filter(customer => 
        customer.role === 'store' && (customer.storeName || customer.name)
      );
      
      console.log('🏪 Processing registered customers:', registeredCustomers.length);
      
      return registeredCustomers.map(customer => {
        const customerName = customer.storeName || customer.name || 'Unknown Store';
        const city = customer.city || '';
        const state = customer.state || '';
        const location = city && state ? `${city}, ${state}` : 
                        city ? city : 
                        state ? state : 'Unknown Location';
        
        return {
          customerId: customer._id,
          customerName,
          location,
          orderFrequency: 0,
          totalSpent: 0,
          lastOrderDate: 'No orders yet',
          predictedNextOrder: 'Awaiting first order',
          riskLevel: 'new' as const
        };
      }).slice(0, 10); // Show first 10 customers
    }
    
    const customerMap = new Map();
    
    orders.forEach((order, index) => {
      // More flexible customer ID extraction
      const customerId = order.store?._id || order.store?.id || order.store;
      
      // More flexible customer name extraction
      const customerName = order.store?.storeName || 
                          order.store?.name || 
                          order.store?.ownerName || 
                          `Customer ${customerId}` || 
                          'Unknown Customer';
      
      // More flexible location extraction
      const city = order.store?.city || '';
      const state = order.store?.state || '';
      const location = city && state ? `${city}, ${state}` : 
                      city ? city : 
                      state ? state : 
                      'Unknown Location';
      
      // More flexible date and value extraction
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      const orderValue = parseFloat(order.total || order.totalAmount || order.amount || 0);
      
      // Debug logging for first few orders
      if (index < 3) {
        console.log(`📊 Processing order ${index + 1}:`, {
          customerId,
          customerName,
          location,
          orderDate: orderDate.toISOString(),
          orderValue
        });
      }
      
      // Skip if no valid customer ID
      if (!customerId) {
        console.warn('⚠️ Skipping order without customer ID:', order);
        return;
      }
      
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          customerName,
          location,
          orders: [],
          totalSpent: 0,
          lastOrderDate: orderDate,
          firstOrderDate: orderDate
        });
      }
      
      const customer = customerMap.get(customerId);
      customer.orders.push({ date: orderDate, value: orderValue });
      customer.totalSpent += orderValue;
      
      if (orderDate > customer.lastOrderDate) {
        customer.lastOrderDate = orderDate;
      }
      if (orderDate < customer.firstOrderDate) {
        customer.firstOrderDate = orderDate;
      }
    });
    
    console.log(`👥 Found ${customerMap.size} unique customers`);
    
    const insights = Array.from(customerMap.values()).map(customer => {
      const daysSinceLastOrder = Math.floor((new Date().getTime() - customer.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalDays = Math.max(Math.floor((customer.lastOrderDate.getTime() - customer.firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)), 1);
      const orderFrequency = customer.orders.length / Math.max(totalDays / 7, 0.1); // orders per week
      
      // Predict next order date based on frequency
      const averageDaysBetweenOrders = totalDays / Math.max(customer.orders.length - 1, 1);
      const predictedNextOrder = new Date(customer.lastOrderDate.getTime() + (averageDaysBetweenOrders * 24 * 60 * 60 * 1000));
      
      // Calculate risk level
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (daysSinceLastOrder > averageDaysBetweenOrders * 2) {
        riskLevel = 'high';
      } else if (daysSinceLastOrder > averageDaysBetweenOrders * 1.5) {
        riskLevel = 'medium';
      }
      
      return {
        customerId: customer.customerId,
        customerName: customer.customerName,
        location: customer.location,
        orderFrequency: Math.round(orderFrequency * 100) / 100,
        totalSpent: customer.totalSpent,
        lastOrderDate: customer.lastOrderDate.toISOString().split('T')[0],
        predictedNextOrder: predictedNextOrder.toISOString().split('T')[0],
        riskLevel
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
    
    console.log('📈 Generated customer insights:', insights.length, insights.slice(0, 2));
    return insights;
  };

  // Analyze delivery routes for optimization - REAL DATA ONLY
  const analyzeRoutes = (orders: any[]) => {
    console.log('🚚 Analyzing routes from orders:', orders.length);
    
    const routeMap = new Map();
    
    orders.forEach((order, index) => {
      // More flexible location extraction
      const state = order.store?.state || order.billingAddress?.state || order.shippingAddress?.state || 'Unknown';
      const city = order.store?.city || order.billingAddress?.city || order.shippingAddress?.city || 'Unknown';
      const route = city !== 'Unknown' && state !== 'Unknown' ? `${state}-${city}` : 
                   city !== 'Unknown' ? city :
                   state !== 'Unknown' ? state : 'Unknown Route';
      
      // Debug logging for first few orders
      if (index < 3) {
        console.log(`🗺️ Processing route ${index + 1}:`, {
          route,
          state,
          city,
          storeData: order.store
        });
      }
      
      if (!routeMap.has(route)) {
        routeMap.set(route, {
          route,
          customers: new Set(),
          orders: [],
          totalRevenue: 0
        });
      }
      
      const routeData = routeMap.get(route);
      routeData.customers.add(order.store?._id || order.store?.id);
      routeData.orders.push(order);
      routeData.totalRevenue += parseFloat(order.total) || 0;
    });
    
    return Array.from(routeMap.values()).map(route => {
      const efficiency = route.totalRevenue / route.orders.length;
      const orderDays = route.orders.map(order => new Date(order.createdAt).getDay());
      const mostCommonDay = orderDays.reduce((a, b, i, arr) => 
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
      );
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return {
        route: route.route,
        customers: route.customers.size,
        totalOrders: route.orders.length,
        efficiency: Math.round(efficiency * 100) / 100,
        suggestedDay: dayNames[mostCommonDay]
      };
    }).sort((a, b) => b.efficiency - a.efficiency);
  };

  // Generate intelligent reorder suggestions - REAL PRODUCTS with order-based or stock-based analysis
  const generateReorderSuggestions = (products: any[], orders: any[]) => {
    const productUsage = new Map();
    
    // If we have orders, calculate usage from orders
    if (orders.length > 0) {
      orders.forEach(order => {
        order.items?.forEach((item: any) => {
          const productId = item.productId;
          const quantity = item.quantity || 0;
          
          if (!productUsage.has(productId)) {
            productUsage.set(productId, []);
          }
          
          productUsage.get(productId).push({
            date: new Date(order.createdAt),
            quantity
          });
        });
      });
    }
    
    // Generate suggestions for all products
    return products.map(product => {
      const usage = productUsage.get(product._id) || [];
      const currentStock = product.summary?.totalRemaining || product.remaining || product.quantity || 0;
      
      let averageWeeklyUsage = 0;
      let suggestedReorderQuantity = 0;
      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      
      if (usage.length > 0) {
        // Calculate from actual order data
        const totalUsage = usage.reduce((sum, u) => sum + u.quantity, 0);
        const weeksOfData = Math.max(usage.length / 7, 1);
        averageWeeklyUsage = totalUsage / weeksOfData;
        suggestedReorderQuantity = Math.ceil(averageWeeklyUsage * 4 * 1.2);
      } else {
        // Base on current stock levels and thresholds
        const threshold = product.threshold || 10;
        averageWeeklyUsage = Math.max(threshold / 2, 1); // Estimate based on threshold
        suggestedReorderQuantity = Math.max(threshold * 2, 20); // Conservative estimate
      }
      
      // Calculate estimated stockout date
      const daysUntilStockout = averageWeeklyUsage > 0 ? (currentStock / averageWeeklyUsage) * 7 : 999;
      const estimatedStockoutDate = new Date();
      estimatedStockoutDate.setDate(estimatedStockoutDate.getDate() + Math.max(daysUntilStockout, 1));
      
      // Determine urgency based on current stock
      if (currentStock <= 5) urgency = 'critical';
      else if (currentStock <= 15) urgency = 'high';
      else if (currentStock <= 30) urgency = 'medium';
      else if (currentStock <= (product.threshold || 10)) urgency = 'medium';
      
      return {
        productId: product._id,
        productName: product.name || 'Unknown Product',
        currentStock,
        averageWeeklyUsage: Math.round(averageWeeklyUsage * 100) / 100,
        suggestedReorderQuantity,
        urgency,
        estimatedStockoutDate: estimatedStockoutDate.toISOString().split('T')[0]
      };
    }).filter(p => p.urgency !== 'low' || p.currentStock <= (p.suggestedReorderQuantity * 0.3))
      .sort((a, b) => {
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      })
      .slice(0, 50); // Limit to top 50 for performance
    
    // The rest of the original function for when we have orders...
    
    // Calculate weekly usage for each product
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        const productId = item.productId;
        const quantity = item.quantity || 0;
        
        if (!productUsage.has(productId)) {
          productUsage.set(productId, []);
        }
        
        productUsage.get(productId).push({
          date: new Date(order.createdAt),
          quantity
        });
      });
    });
    
    return products.map(product => {
      const usage = productUsage.get(product._id) || [];
      const currentStock = product.summary?.totalRemaining || product.remaining || 0;
      
      // Calculate average weekly usage
      const totalUsage = usage.reduce((sum, u) => sum + u.quantity, 0);
      const weeksOfData = Math.max(usage.length / 7, 1);
      const averageWeeklyUsage = totalUsage / weeksOfData;
      
      // Calculate suggested reorder quantity (4 weeks supply + safety stock)
      const suggestedReorderQuantity = Math.ceil(averageWeeklyUsage * 4 * 1.2);
      
      // Calculate estimated stockout date
      const daysUntilStockout = averageWeeklyUsage > 0 ? (currentStock / averageWeeklyUsage) * 7 : 999;
      const estimatedStockoutDate = new Date();
      estimatedStockoutDate.setDate(estimatedStockoutDate.getDate() + daysUntilStockout);
      
      // Determine urgency
      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (daysUntilStockout <= 3) urgency = 'critical';
      else if (daysUntilStockout <= 7) urgency = 'high';
      else if (daysUntilStockout <= 14) urgency = 'medium';
      
      return {
        productId: product._id,
        productName: product.name || 'Unknown Product',
        currentStock,
        averageWeeklyUsage: Math.round(averageWeeklyUsage * 100) / 100,
        suggestedReorderQuantity,
        urgency,
        estimatedStockoutDate: estimatedStockoutDate.toISOString().split('T')[0]
      };
    }).filter(p => p.urgency !== 'low' || p.currentStock < p.suggestedReorderQuantity)
      .sort((a, b) => {
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      });
  };

  useEffect(() => {
    fetchData();
  }, [selectedTimeframe, selectedState, selectedRoute]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  const getAvailableStates = () => {
    const states = allOrders
      .map(order => order.store?.state)
      .filter(Boolean)
      .map(state => state.toUpperCase());
    return [...new Set(states)];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Advanced Order Analytics</h2>
          <p className="text-muted-foreground">
            AI-powered insights, predictions, and optimization recommendations
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(timeframes).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {getAvailableStates().map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real Data Status */}
      {allOrders.length === 0 && allProducts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Real Product Data - No Orders Yet</h3>
              <p className="text-amber-700 text-sm">
                Showing analytics based on your {allProducts.length} real products. 
                Reorder suggestions are based on current stock levels. Order analytics will appear once you have orders.
              </p>
            </div>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
              Real Data
            </Badge>
          </div>
        </div>
      )}

      {analytics && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="reorder">Reorder</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {timeframes[selectedTimeframe as keyof typeof timeframes]}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {timeframes[selectedTimeframe as keyof typeof timeframes]}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Per order average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.customerInsights.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Unique customers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="text-sm font-medium text-blue-800">Peak Order Day</div>
                    <div className="text-xs text-blue-600">
                      {analytics.routeOptimization.length > 0 
                        ? analytics.routeOptimization[0].suggestedDay 
                        : 'No data available'}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="text-sm font-medium text-green-800">Top Product</div>
                    <div className="text-xs text-green-600">
                      {analytics.topProducts.length > 0 
                        ? analytics.topProducts[0].productName 
                        : 'No data available'}
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded border border-orange-200">
                    <div className="text-sm font-medium text-orange-800">Reorder Alerts</div>
                    <div className="text-xs text-orange-600">
                      {analytics.reorderSuggestions.filter(r => r.urgency === 'critical').length} critical items
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Order Fulfillment</span>
                    <Badge variant="outline">98.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Retention</span>
                    <Badge variant="outline">
                      {analytics.customerInsights.filter(c => c.riskLevel === 'low').length} / {analytics.customerInsights.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Route Efficiency</span>
                    <Badge variant="outline">
                      {analytics.routeOptimization.length > 0 
                        ? `${analytics.routeOptimization[0].efficiency.toFixed(1)}%`
                        : 'N/A'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Insights Tab */}
       <TabsContent value="customers" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="h-5 w-5" />
        Customer Intelligence & Predictions
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        AI-powered customer behavior analysis and churn risk assessment
      </p>
    </CardHeader>
    <CardContent>
      {allCustomers?.flat()?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Customer</th>
                <th className="text-right p-2">Orders/Week</th>
                <th className="text-right p-2">Total Spent</th>
                <th className="text-right p-2">Last Order</th>
                <th className="text-right p-2">Predicted Next</th>
                <th className="text-center p-2">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {allCustomers?.flat()?.slice(0, 10).map((customer, index) => {
                const orderFrequency = customer?.orderFrequency ?? 'N/A';
                const totalSpent = customer?.totalSpent ?? 'N/A';
                const lastOrderDate = customer?.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A';
                const predictedNextOrder = customer?.predictedNextOrder ? new Date(customer.predictedNextOrder).toLocaleDateString() : 'N/A';
                const riskLevel = customer?.riskLevel ?? 'N/A';

                return (
                  <tr key={customer?.id || index} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{customer?.storeName ?? 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">
                          {(customer?.city ?? 'N/A')}, {(customer?.state ?? 'N/A')}
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-2">{orderFrequency}</td>
                    <td className="text-right p-2 font-medium">
                      {totalSpent === 'N/A' ? 'N/A' : `$${totalSpent.toLocaleString()}`}
                    </td>
                    <td className="text-right p-2 text-xs">{lastOrderDate}</td>
                    <td className="text-right p-2 text-xs">{predictedNextOrder}</td>
                    <td className="text-center p-2">
                      <Badge
                        variant={
                          riskLevel === 'high' ? 'destructive' :
                          riskLevel === 'medium' ? 'secondary' :
                          riskLevel === 'new' ? 'default' : 'outline'
                        }
                      >
                        {riskLevel}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Customer Data Available</h3>
          <p className="text-muted-foreground mb-4">
            Customer insights will appear once you have orders from customers.
          </p>
          <p className="text-sm text-muted-foreground">
            Start receiving orders to see AI-powered customer behavior analysis and churn predictions.
          </p>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


     <TabsContent value="products" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        Product Performance Analysis
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Product</th>
              <th className="text-right p-2">Quantity Sold</th>
              <th className="text-right p-2">Revenue</th>
              <th className="text-right p-2">Order Frequency</th>
              <th className="text-right p-2">Avg per Order</th>
            </tr>
          </thead>
          <tbody>
            {allProducts?.flat()?.map((product, index) => {
                const quantitySold = getQuantitySold(product?.salesHistory);

              const orderFrequency = product?.salesHistory?.length ?? 0;
              const revenue = (product?.price ?? 0) * quantitySold;
              const avgPerOrder =
                orderFrequency > 0 ? (quantitySold / orderFrequency).toFixed(1) : 0;

              return (
                <tr key={product?._id || index} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div className="font-medium">{product?.name || "N/A"}</div>
                  </td>
                  <td className="text-right p-2">{quantitySold}</td>
                  <td className="text-right p-2 font-medium">${revenue.toLocaleString()}</td>
                  <td className="text-right p-2">{orderFrequency}</td>
                  <td className="text-right p-2">{avgPerOrder}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</TabsContent>



          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Route Optimization & Delivery Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.routeOptimization.map((route, index) => (
                    <Card key={route.route}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{route.route}</h4>
                          <Badge variant="outline">{route.suggestedDay}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Customers:</span>
                            <span>{route.customers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Orders:</span>
                            <span>{route.totalOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Efficiency:</span>
                            <span>${route.efficiency}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reorder Tab */}
          <TabsContent value="reorder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Intelligent Reorder Recommendations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered inventory predictions and automated reorder suggestions
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Product</th>
                        <th className="text-right p-2">Current Stock</th>
                        <th className="text-right p-2">Weekly Usage</th>
                        <th className="text-right p-2">Suggested Reorder</th>
                        <th className="text-right p-2">Stockout Date</th>
                        <th className="text-center p-2">Urgency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.reorderSuggestions.slice(0, 15).map((suggestion, index) => (
                        <tr key={suggestion.productId} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <div className="font-medium">{suggestion.productName}</div>
                          </td>
                          <td className="text-right p-2">{suggestion.currentStock}</td>
                          <td className="text-right p-2">{suggestion.averageWeeklyUsage}</td>
                          <td className="text-right p-2 font-medium">
                            {suggestion.suggestedReorderQuantity}
                          </td>
                          <td className="text-right p-2 text-xs">
                            {new Date(suggestion.estimatedStockoutDate).toLocaleDateString()}
                          </td>
                          <td className="text-center p-2">
                            <Badge 
                              variant={
                                suggestion.urgency === 'critical' ? 'destructive' :
                                suggestion.urgency === 'high' ? 'secondary' :
                                suggestion.urgency === 'medium' ? 'outline' : 'outline'
                              }
                            >
                              {suggestion.urgency}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <AutoReorderSystem />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedOrderAnalytics;