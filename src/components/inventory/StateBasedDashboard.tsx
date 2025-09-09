import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle, 
  MapPin,
  Truck,
  BarChart3,
  RefreshCw,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  getAllWarehousesAPI, 
  getWarehousesByStateAPI,
  getInventoryByStateAPI,
  getReorderAlertsAPI 
} from '@/services2/operations/warehouse';
import { toast } from 'react-toastify';

// US States list
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface StateInventoryData {
  state: string;
  warehouses: number;
  summary: {
    totalProducts: number;
    totalBoxes: number;
    totalUnits: number;
    availableBoxes: number;
    availableUnits: number;
  };
  inventory: any[];
  count: number;
}

interface WarehouseData {
  _id: string;
  name: string;
  code: string;
  state: string;
  city: string;
  isActive: boolean;
  totalProducts: number;
  totalValue: number;
}

const StateBasedDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateInventory, setStateInventory] = useState<StateInventoryData | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  // Load all warehouses on component mount
  useEffect(() => {
    loadAllWarehouses();
  }, [token]);

  // Load state-specific data when state is selected
  useEffect(() => {
    if (selectedState) {
      loadStateData();
    }
  }, [selectedState, token]);

  const loadAllWarehouses = async () => {
    try {
      const response = await getAllWarehousesAPI(token);
      setWarehouses(response || []);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    }
  };

  const loadStateData = async () => {
    if (!selectedState) return;
    
    setLoading(true);
    try {
      // Load state inventory
      const inventoryResponse = await getInventoryByStateAPI(selectedState, '', token);
      setStateInventory(inventoryResponse);

      // Load reorder alerts for all warehouses in state
      const stateWarehouses = warehouses.filter(w => w.state === selectedState);
      const alertPromises = stateWarehouses.map(warehouse => 
        getReorderAlertsAPI(warehouse._id, token)
      );
      const alertResponses = await Promise.all(alertPromises);
      const allAlerts = alertResponses.flat();
      setReorderAlerts(allAlerts);

    } catch (error) {
      console.error('Error loading state data:', error);
      toast.error('Failed to load state data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStateData();
  };

  const getStateWarehouses = () => {
    return warehouses.filter(w => w.state === selectedState);
  };

  const getStatesWithWarehouses = () => {
    const statesWithWarehouses = [...new Set(warehouses.map(w => w.state))];
    return US_STATES.filter(state => statesWithWarehouses.includes(state));
  };

  const MetricCard = ({ title, value, icon, color = "blue", subtitle = "" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`text-${color}-600`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const InventoryTable = ({ inventory }) => (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Product</th>
              <th className="text-right p-3 font-medium">Total Boxes</th>
              <th className="text-right p-3 font-medium">Available Boxes</th>
              <th className="text-right p-3 font-medium">Total Units</th>
              <th className="text-right p-3 font-medium">Available Units</th>
              <th className="text-center p-3 font-medium">Warehouses</th>
              <th className="text-center p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{item.productName}</div>
                </td>
                <td className="text-right p-3">{item.totalBoxes.toLocaleString()}</td>
                <td className="text-right p-3">{item.availableBoxes.toLocaleString()}</td>
                <td className="text-right p-3">{item.totalUnits.toLocaleString()}</td>
                <td className="text-right p-3">{item.availableUnits.toLocaleString()}</td>
                <td className="text-center p-3">
                  <Badge variant="outline">{item.warehouses.length}</Badge>
                </td>
                <td className="text-center p-3">
                  {item.needsReorder ? (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Reorder
                    </Badge>
                  ) : (
                    <Badge variant="secondary">OK</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const WarehouseList = ({ warehouses }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {warehouses.map((warehouse) => (
        <Card key={warehouse._id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{warehouse.name}</CardTitle>
              <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                {warehouse.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {warehouse.code} • {warehouse.city}, {warehouse.state}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Products:</span>
                <span className="font-medium">{warehouse.totalProducts || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Value:</span>
                <span className="font-medium">${(warehouse.totalValue || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Multi-State Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage inventory across different states and warehouses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {getStatesWithWarehouses().map(state => (
                <SelectItem key={state} value={state}>
                  {state} ({warehouses.filter(w => w.state === state).length} warehouses)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedState && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      {/* State Overview Cards */}
      {selectedState && stateInventory && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Warehouses"
            value={stateInventory.warehouses}
            icon={<Warehouse className="h-4 w-4" />}
            color="blue"
            subtitle={`in ${selectedState}`}
          />
          <MetricCard
            title="Total Products"
            value={stateInventory.summary.totalProducts?.toLocaleString() || '0'}
            icon={<Package className="h-4 w-4" />}
            color="green"
            subtitle="unique products"
          />
          <MetricCard
            title="Available Boxes"
            value={stateInventory.summary.availableBoxes?.toLocaleString() || '0'}
            icon={<BarChart3 className="h-4 w-4" />}
            color="purple"
            subtitle="ready to ship"
          />
          <MetricCard
            title="Reorder Alerts"
            value={reorderAlerts.length}
            icon={<AlertTriangle className="h-4 w-4" />}
            color="red"
            subtitle="need attention"
          />
        </div>
      )}

      {/* Main Content */}
      {selectedState ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {stateInventory && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Inventory Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {stateInventory.summary.totalBoxes?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-blue-600">Total Boxes</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {stateInventory.summary.availableBoxes?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-green-600">Available</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {stateInventory.summary.totalUnits?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-purple-600">Total Units</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {stateInventory.summary.availableUnits?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-orange-600">Available</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reorder Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Reorder Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reorderAlerts.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {reorderAlerts.slice(0, 10).map((alert, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{alert.productInfo?.[0]?.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {alert.warehouseInfo?.[0]?.name}
                              </div>
                            </div>
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          </div>
                        ))}
                        {reorderAlerts.length > 10 && (
                          <div className="text-center text-sm text-muted-foreground">
                            +{reorderAlerts.length - 10} more alerts
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        No reorder alerts
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            {stateInventory && (
              <Card>
                <CardHeader>
                  <CardTitle>State Inventory ({selectedState})</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showing {stateInventory.count} products across {stateInventory.warehouses} warehouses
                  </p>
                </CardHeader>
                <CardContent>
                  {stateInventory.inventory.length > 0 ? (
                    <InventoryTable inventory={stateInventory.inventory} />
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No inventory found for this state
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="warehouses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Warehouses in {selectedState}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getStateWarehouses().length} warehouses found
                </p>
              </CardHeader>
              <CardContent>
                {getStateWarehouses().length > 0 ? (
                  <WarehouseList warehouses={getStateWarehouses()} />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No warehouses found for this state
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        /* No State Selected */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a State</h3>
            <p className="text-muted-foreground text-center mb-4">
              Choose a state from the dropdown above to view inventory and warehouse information
            </p>
            <div className="text-sm text-muted-foreground">
              Available states: {getStatesWithWarehouses().join(', ')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StateBasedDashboard;