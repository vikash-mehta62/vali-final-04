import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Clock, 
  Truck, 
  Route, 
  MapPin, 
  AlertTriangle,
  TrendingUp,
  Warehouse,
  Users,
  RefreshCw
} from 'lucide-react';
import { StateInventoryMetrics, StateWarehouse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import StateRouteMap from './StateRouteMap';
import StateInventoryAlerts from './StateInventoryAlerts';
import WarehouseManagement from './WarehouseManagement';

// US States for multi-state operations
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, onClick }) => (
  <Card className={`transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const StateBasedDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateMetrics, setStateMetrics] = useState<StateInventoryMetrics | null>(null);
  const [warehouses, setWarehouses] = useState<StateWarehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'inventory' | 'warehouses'>('overview');
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  const mockStateMetrics: StateInventoryMetrics = {
    state: selectedState,
    totalInventoryValue: 245000,
    totalProducts: 156,
    lowStockItems: 12,
    pendingOrders: 28,
    todayDeliveries: 15,
    routeEfficiency: 87,
    warehouseUtilization: 73
  };

  const mockWarehouses: StateWarehouse[] = [
    {
      id: 'WH001',
      state: selectedState,
      name: `${selectedState} Main Distribution Center`,
      address: {
        street: '1234 Industrial Blvd',
        city: 'Atlanta',
        state: selectedState,
        country: 'USA',
        postalCode: '30309'
      },
      capacity: 50000,
      currentStock: 36500,
      deliveryRadius: 150,
      operatingHours: {
        open: '06:00',
        close: '22:00',
        timezone: 'EST'
      },
      isActive: true,
      manager: 'John Smith',
      phone: '(555) 123-4567',
      zones: [
        {
          id: 'Z001',
          name: 'Cold Storage',
          temperature: 35,
          capacity: 15000,
          products: [],
          currentUtilization: 68
        },
        {
          id: 'Z002',
          name: 'Dry Storage',
          capacity: 25000,
          products: [],
          currentUtilization: 75
        },
        {
          id: 'Z003',
          name: 'Shipping',
          capacity: 10000,
          products: [],
          currentUtilization: 45
        }
      ]
    }
  ];

  useEffect(() => {
    if (selectedState) {
      fetchStateData();
    }
  }, [selectedState]);

  const fetchStateData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStateMetrics(mockStateMetrics);
      setWarehouses(mockWarehouses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch state data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedState) {
      fetchStateData();
      toast({
        title: "Data Refreshed",
        description: `Updated data for ${selectedState}`,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Multi-State Operations</h1>
          <p className="text-muted-foreground">
            Manage inventory, routes, and deliveries across all states
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading || !selectedState}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* State Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select State Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state to view operations" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedState && (
              <Badge variant="outline" className="text-sm">
                Active State: {selectedState}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* State Metrics */}
      {selectedState && stateMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Inventory Value" 
              value={formatCurrency(stateMetrics.totalInventoryValue)}
              icon={<Package className="h-6 w-6" />}
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard 
              title="Pending Orders" 
              value={stateMetrics.pendingOrders}
              icon={<Clock className="h-6 w-6" />}
              trend={{ value: 8.2, isPositive: false }}
            />
            <MetricCard 
              title="Today's Deliveries" 
              value={stateMetrics.todayDeliveries}
              icon={<Truck className="h-6 w-6" />}
              trend={{ value: 15.3, isPositive: true }}
            />
            <MetricCard 
              title="Route Efficiency" 
              value={`${stateMetrics.routeEfficiency}%`}
              icon={<Route className="h-6 w-6" />}
              trend={{ value: 5.7, isPositive: true }}
            />
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard 
              title="Total Products" 
              value={stateMetrics.totalProducts}
              icon={<Package className="h-6 w-6" />}
            />
            <MetricCard 
              title="Low Stock Alerts" 
              value={stateMetrics.lowStockItems}
              icon={<AlertTriangle className="h-6 w-6" />}
            />
            <MetricCard 
              title="Warehouse Utilization" 
              value={`${stateMetrics.warehouseUtilization}%`}
              icon={<Warehouse className="h-6 w-6" />}
            />
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: <Package className="h-4 w-4" /> },
                { id: 'routes', label: 'Smart Routes', icon: <Route className="h-4 w-4" /> },
                { id: 'inventory', label: 'Inventory Alerts', icon: <AlertTriangle className="h-4 w-4" /> },
                { id: 'warehouses', label: 'Warehouses', icon: <Warehouse className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Route className="h-4 w-4 mr-2" />
                      Optimize Today's Routes
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      Generate Reorder Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Schedule Inventory Transfer
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      View Driver Assignments
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>State Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Delivery Success Rate</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Delivery Time</span>
                        <span className="font-medium">2.3 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="font-medium">4.7/5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fuel Efficiency</span>
                        <span className="font-medium">12.4 MPG</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'routes' && (
              <StateRouteMap state={selectedState} />
            )}

            {activeTab === 'inventory' && (
              <StateInventoryAlerts state={selectedState} />
            )}

            {activeTab === 'warehouses' && (
              <WarehouseManagement state={selectedState} warehouses={warehouses} />
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!selectedState && (
        <Card className="p-12 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a State to Get Started</h3>
          <p className="text-muted-foreground">
            Choose a state from the dropdown above to view operations, inventory, and route optimization data.
          </p>
        </Card>
      )}
    </div>
  );
};

export default StateBasedDashboard;