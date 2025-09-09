import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllOrderAPI } from '@/services2/operations/order';
import { useToast } from '@/hooks/use-toast';

interface CustomerData {
  _id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessDescription?: string;
  customerSince: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  status: 'active' | 'inactive' | 'at-risk';
  riskLevel: 'low' | 'medium' | 'high';
  preferredProducts?: string[];
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  deliveryInstructions?: string;
  route?: string;
  creditLimit?: number;
  paymentTerms?: string;
  discountRate?: number;
  notes?: string;
}

interface CustomerInsight {
  customerId: string;
  customerName: string;
  location: string;
  orderFrequency: number;
  totalSpent: number;
  lastOrderDate: string;
  predictedNextOrder: string;
  riskLevel: 'low' | 'medium' | 'high';
  loyaltyScore: number;
  preferredCategories: string[];
  seasonalTrends: any[];
}

const CustomerDataManager: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsight[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { token } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomerData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery, statusFilter, riskFilter]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch stores/customers from auth system
      const customersResponse = await fetch('/api/v1/auth/all-stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        const stores = customersData?.stores || [];
        
        // Fetch orders to calculate customer metrics
        const ordersResponse = await getAllOrderAPI(token, 'limit=10000');
        const orders = ordersResponse?.orders || [];
        
        // Process customer data with analytics
        const processedCustomers = await processCustomerData(stores, orders);
        const insights = generateCustomerInsights(orders);
        
        setCustomers(processedCustomers);
        setCustomerInsights(insights);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processCustomerData = async (stores: any[], orders: any[]): Promise<CustomerData[]> => {
    return stores.map(store => {
      const customerOrders = orders.filter(order => 
        order.store?._id === store._id || order.store?.id === store._id
      );
      
      const totalRevenue = customerOrders.reduce((sum, order) => 
        sum + (parseFloat(order.total) || 0), 0
      );
      
      const avgOrderValue = customerOrders.length > 0 ? totalRevenue / customerOrders.length : 0;
      
      const lastOrder = customerOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      const daysSinceLastOrder = lastOrder 
        ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let status: 'active' | 'inactive' | 'at-risk' = 'active';
      
      if (daysSinceLastOrder > 60) {
        riskLevel = 'high';
        status = 'at-risk';
      } else if (daysSinceLastOrder > 30) {
        riskLevel = 'medium';
        status = 'at-risk';
      } else if (daysSinceLastOrder > 90) {
        status = 'inactive';
      }
      
      return {
        _id: store._id,
        storeName: store.storeName || 'Unknown Store',
        ownerName: store.ownerName || store.name || 'Unknown Owner',
        email: store.email,
        phone: store.phone,
        address: store.address,
        city: store.city,
        state: store.state,
        zipCode: store.zipCode,
        businessDescription: store.businessDescription,
        customerSince: store.createdAt || new Date().toISOString(),
        lastOrderDate: lastOrder?.createdAt,
        totalOrders: customerOrders.length,
        totalRevenue,
        avgOrderValue,
        status,
        riskLevel,
        communicationPreferences: {
          email: true,
          sms: false,
          phone: true
        },
        creditLimit: 5000,
        paymentTerms: 'Net 30',
        discountRate: 0
      };
    });
  };

  const generateCustomerInsights = (orders: any[]): CustomerInsight[] => {
    const customerMap = new Map();
    
    orders.forEach(order => {
      const customerId = order.store?._id || order.store?.id;
      const customerName = order.store?.storeName || 'Unknown Customer';
      
      if (!customerId) return;
      
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          customerName,
          location: `${order.store?.city || ''}, ${order.store?.state || ''}`.trim(),
          orders: [],
          totalSpent: 0,
          categories: new Map()
        });
      }
      
      const customer = customerMap.get(customerId);
      const orderValue = parseFloat(order.total) || 0;
      const orderDate = new Date(order.createdAt || Date.now());
      
      customer.orders.push({ date: orderDate, value: orderValue });
      customer.totalSpent += orderValue;
      
      // Track product categories
      if (order.items) {
        order.items.forEach((item: any) => {
          const category = item.category || 'Other';
          customer.categories.set(category, (customer.categories.get(category) || 0) + item.quantity);
        });
      }
    });
    
    return Array.from(customerMap.values()).map(customer => {
      const sortedOrders = customer.orders.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
      const lastOrderDate = sortedOrders[0]?.date || new Date();
      const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate order frequency (orders per month)
      const totalDays = Math.max(
        Math.floor((lastOrderDate.getTime() - sortedOrders[sortedOrders.length - 1]?.date.getTime()) / (1000 * 60 * 60 * 24)),
        30
      );
      const orderFrequency = (customer.orders.length / totalDays) * 30;
      
      // Predict next order
      const avgDaysBetweenOrders = totalDays / Math.max(customer.orders.length - 1, 1);
      const predictedNextOrder = new Date(lastOrderDate.getTime() + (avgDaysBetweenOrders * 24 * 60 * 60 * 1000));
      
      // Calculate loyalty score (0-100)
      const loyaltyScore = Math.min(100, 
        (customer.orders.length * 10) + 
        (customer.totalSpent / 100) + 
        (orderFrequency * 5) - 
        (daysSinceLastOrder * 0.5)
      );
      
      // Get preferred categories
      const preferredCategories = Array.from(customer.categories.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);
      
      // Risk assessment
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (daysSinceLastOrder > avgDaysBetweenOrders * 2) {
        riskLevel = 'high';
      } else if (daysSinceLastOrder > avgDaysBetweenOrders * 1.5) {
        riskLevel = 'medium';
      }
      
      return {
        customerId: customer.customerId,
        customerName: customer.customerName,
        location: customer.location,
        orderFrequency: Math.round(orderFrequency * 100) / 100,
        totalSpent: customer.totalSpent,
        lastOrderDate: lastOrderDate.toISOString().split('T')[0],
        predictedNextOrder: predictedNextOrder.toISOString().split('T')[0],
        riskLevel,
        loyaltyScore: Math.round(loyaltyScore),
        preferredCategories,
        seasonalTrends: [] // Could be enhanced with seasonal analysis
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  };

  const filterCustomers = () => {
    let filtered = customers;
    
    if (searchQuery) {
      filtered = filtered.filter(customer => 
        customer.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    if (riskFilter !== 'all') {
      filtered = filtered.filter(customer => customer.riskLevel === riskFilter);
    }
    
    setFilteredCustomers(filtered);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'at-risk': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Data Management</h1>
          <p className="text-muted-foreground">Comprehensive customer insights and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              {/* Add customer form would go here */}
              <div className="text-center py-8 text-muted-foreground">
                Customer creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {customers.filter(c => c.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customers.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: ${Math.round(customers.reduce((sum, c) => sum + c.avgOrderValue, 0) / customers.length || 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {customers.filter(c => c.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Loyalty Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(customerInsights.reduce((sum, c) => sum + c.loyaltyScore, 0) / customerInsights.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 100
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Customer Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Customer</th>
                      <th className="text-left p-3">Contact</th>
                      <th className="text-left p-3">Location</th>
                      <th className="text-right p-3">Orders</th>
                      <th className="text-right p-3">Revenue</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Risk</th>
                      <th className="text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{customer.storeName}</div>
                            <div className="text-sm text-muted-foreground">{customer.ownerName}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="text-sm">{customer.email}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm">{customer.city}, {customer.state}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="font-medium">{customer.totalOrders}</div>
                          <div className="text-sm text-muted-foreground">
                            Avg: ${customer.avgOrderValue.toFixed(0)}
                          </div>
                        </td>
                        <td className="p-3 text-right font-medium">
                          ${customer.totalRevenue.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <Badge variant={getStatusBadgeColor(customer.status) as any}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={getRiskBadgeColor(customer.riskLevel) as any}>
                            {customer.riskLevel}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedCustomer(customer)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-3 w-3" />
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
        
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Customer Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Customer</th>
                      <th className="text-right p-3">Loyalty Score</th>
                      <th className="text-right p-3">Order Frequency</th>
                      <th className="text-left p-3">Preferred Categories</th>
                      <th className="text-left p-3">Next Order Prediction</th>
                      <th className="text-left p-3">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerInsights.slice(0, 20).map((insight) => (
                      <tr key={insight.customerId} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{insight.customerName}</div>
                            <div className="text-sm text-muted-foreground">{insight.location}</div>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="font-medium">{insight.loyaltyScore}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="font-medium">{insight.orderFrequency}/month</div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {insight.preferredCategories.slice(0, 2).map((category, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{insight.predictedNextOrder}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={getRiskBadgeColor(insight.riskLevel) as any}>
                            {insight.riskLevel}
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
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>High Value (>$5000)</span>
                    <Badge>{customers.filter(c => c.totalRevenue > 5000).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium Value ($1000-$5000)</span>
                    <Badge>{customers.filter(c => c.totalRevenue >= 1000 && c.totalRevenue <= 5000).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Low Value (<$1000)</span>
                    <Badge>{customers.filter(c => c.totalRevenue < 1000).length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Low Risk</span>
                    <Badge variant="default">{customers.filter(c => c.riskLevel === 'low').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium Risk</span>
                    <Badge variant="secondary">{customers.filter(c => c.riskLevel === 'medium').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>High Risk</span>
                    <Badge variant="destructive">{customers.filter(c => c.riskLevel === 'high').length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCustomer.storeName} - Customer Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      <span>{selectedCustomer.storeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{selectedCustomer.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedCustomer.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-medium">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-medium">${selectedCustomer.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value:</span>
                      <span className="font-medium">${selectedCustomer.avgOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Since:</span>
                      <span className="font-medium">{new Date(selectedCustomer.customerSince).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={getStatusBadgeColor(selectedCustomer.status) as any}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {selectedCustomer.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedCustomer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerDataManager;