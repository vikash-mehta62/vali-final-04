import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Route, 
  MapPin, 
  Clock, 
  Fuel, 
  Truck, 
  RotateCw, 
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { SmartRoute, RouteStop } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface StateRouteMapProps {
  state: string;
}

const StateRouteMap: React.FC<StateRouteMapProps> = ({ state }) => {
  const [routes, setRoutes] = useState<SmartRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SmartRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  // Mock route data - replace with actual API calls
  const mockRoutes: SmartRoute[] = [
    {
      id: 'RT001',
      state: state,
      warehouse: 'WH001',
      optimizedDistance: 78.5,
      estimatedTime: 225, // minutes
      fuelCost: 45.20,
      driver: 'Mike Johnson',
      vehicle: 'Truck-001',
      status: 'planned',
      createdAt: new Date().toISOString(),
      scheduledDate: new Date().toISOString(),
      stops: [
        {
          orderId: 'ORD001',
          client: {
            id: 'C001',
            name: 'Fresh Market Co',
            company: 'Fresh Market Co',
            email: 'orders@freshmarket.com',
            phone: '(555) 123-4567',
            state: state,
            status: 'active'
          },
          address: {
            street: '123 Market St',
            city: 'Atlanta',
            state: state,
            country: 'USA',
            postalCode: '30309'
          },
          deliveryWindow: {
            start: '09:00',
            end: '11:00'
          },
          products: [],
          estimatedDuration: 30,
          priority: 'high',
          sequence: 1,
          status: 'pending'
        },
        {
          orderId: 'ORD002',
          client: {
            id: 'C002',
            name: 'Green Grocers',
            company: 'Green Grocers LLC',
            email: 'info@greengrocers.com',
            phone: '(555) 234-5678',
            state: state,
            status: 'active'
          },
          address: {
            street: '456 Oak Ave',
            city: 'Marietta',
            state: state,
            country: 'USA',
            postalCode: '30060'
          },
          deliveryWindow: {
            start: '11:30',
            end: '13:30'
          },
          products: [],
          estimatedDuration: 25,
          priority: 'medium',
          sequence: 2,
          status: 'pending'
        }
      ]
    },
    {
      id: 'RT002',
      state: state,
      warehouse: 'WH001',
      optimizedDistance: 92.3,
      estimatedTime: 280,
      fuelCost: 52.80,
      driver: 'Sarah Davis',
      vehicle: 'Truck-002',
      status: 'in-progress',
      createdAt: new Date().toISOString(),
      scheduledDate: new Date().toISOString(),
      stops: [
        {
          orderId: 'ORD003',
          client: {
            id: 'C003',
            name: 'City Supermarket',
            company: 'City Supermarket Chain',
            email: 'logistics@citysupermarket.com',
            phone: '(555) 345-6789',
            state: state,
            status: 'active'
          },
          address: {
            street: '789 Main St',
            city: 'Decatur',
            state: state,
            country: 'USA',
            postalCode: '30030'
          },
          deliveryWindow: {
            start: '08:00',
            end: '10:00'
          },
          products: [],
          estimatedDuration: 35,
          priority: 'high',
          sequence: 1,
          status: 'completed'
        }
      ]
    }
  ];

  useEffect(() => {
    fetchRoutes();
  }, [state]);

  const fetchRoutes = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setRoutes(mockRoutes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch routes",
        variant: "destructive"
      });
    }
  };

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true);
    try {
      // Simulate route optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update routes with optimized data
      const optimizedRoutes = routes.map(route => ({
        ...route,
        optimizedDistance: route.optimizedDistance * 0.85, // 15% improvement
        estimatedTime: route.estimatedTime * 0.9, // 10% time saving
        fuelCost: route.fuelCost * 0.85 // 15% fuel saving
      }));
      
      setRoutes(optimizedRoutes);
      
      toast({
        title: "Routes Optimized!",
        description: "Routes have been optimized for maximum efficiency. Average 15% improvement in distance and fuel costs.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize routes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getStatusIcon = (status: SmartRoute['status']) => {
    switch (status) {
      case 'planned':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: SmartRoute['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Route Optimization Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Smart Route Optimization - {state}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered route optimization for maximum efficiency and cost savings
              </p>
            </div>
            <Button 
              onClick={handleOptimizeRoutes} 
              disabled={isOptimizing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isOptimizing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Optimize All Routes
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Route Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">
                  {routes.reduce((sum, route) => sum + route.optimizedDistance, 0).toFixed(1)} mi
                </p>
              </div>
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold">
                  {formatTime(routes.reduce((sum, route) => sum + route.estimatedTime, 0))}
                </p>
              </div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fuel Cost</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(routes.reduce((sum, route) => sum + route.fuelCost, 0))}
                </p>
              </div>
              <Fuel className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Est. Time</TableHead>
                  <TableHead>Fuel Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow 
                    key={route.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedRoute(route)}
                  >
                    <TableCell className="font-medium">{route.id}</TableCell>
                    <TableCell>{route.driver || 'Unassigned'}</TableCell>
                    <TableCell>{route.vehicle || 'TBD'}</TableCell>
                    <TableCell>{route.stops.length} stops</TableCell>
                    <TableCell>{route.optimizedDistance.toFixed(1)} mi</TableCell>
                    <TableCell>{formatTime(route.estimatedTime)}</TableCell>
                    <TableCell>{formatCurrency(route.fuelCost)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(route.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(route.status)}
                          {route.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Route Details Modal/Panel */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <CardTitle>Route Details - {selectedRoute.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Route Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver:</span>
                    <span>{selectedRoute.driver || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span>{selectedRoute.vehicle || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Distance:</span>
                    <span>{selectedRoute.optimizedDistance.toFixed(1)} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span>{formatTime(selectedRoute.estimatedTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Cost:</span>
                    <span>{formatCurrency(selectedRoute.fuelCost)}</span>
                  </div>
                </div>
              </div>

              {/* Stops List */}
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Stops</h4>
                <div className="space-y-3">
                  {selectedRoute.stops.map((stop, index) => (
                    <div key={stop.orderId} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Stop {stop.sequence}</span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            stop.priority === 'high' ? 'border-red-200 text-red-700' :
                            stop.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                            'border-green-200 text-green-700'
                          }`}
                        >
                          {stop.priority} priority
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{stop.client.name}</div>
                        <div className="text-muted-foreground">
                          {stop.address.street}, {stop.address.city}
                        </div>
                        <div className="text-muted-foreground">
                          Window: {stop.deliveryWindow.start} - {stop.deliveryWindow.end}
                        </div>
                        <div className="text-muted-foreground">
                          Est. Duration: {stop.estimatedDuration} minutes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setSelectedRoute(null)}>
                Close
              </Button>
              <Button>
                <Truck className="h-4 w-4 mr-2" />
                Start Route
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Benefits */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">Optimization Benefits</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15%</div>
              <div className="text-green-700">Distance Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$127</div>
              <div className="text-green-700">Daily Fuel Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.3h</div>
              <div className="text-green-700">Time Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateRouteMap;