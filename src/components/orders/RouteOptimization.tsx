
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, RotateCw, Route, TruckIcon, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const routeData = [
  { id: 'R001', name: 'North Route', stops: 12, distance: '78 miles', estimatedTime: '3h 45m', fuelSaving: '12%' },
  { id: 'R002', name: 'South Route', stops: 8, distance: '56 miles', estimatedTime: '2h 20m', fuelSaving: '18%' },
  { id: 'R003', name: 'East Route', stops: 15, distance: '92 miles', estimatedTime: '4h 10m', fuelSaving: '8%' },
];

const RouteOptimization = () => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Routes Optimized",
        description: "Routes have been optimized for maximum efficiency",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Route Optimization</CardTitle>
          <CardDescription>
            Optimize delivery routes to reduce distance, fuel consumption, and delivery time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <div className="text-sm font-medium">Starting Location</div>
              <div className="flex">
                <Input placeholder="Enter starting warehouse location" />
                <Button variant="outline" size="icon" className="ml-2">
                  <MapPin size={16} />
                </Button>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleOptimize} disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <RotateCw size={16} className="mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Route size={16} className="mr-2" />
                    Optimize Routes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route ID</TableHead>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Est. Time</TableHead>
                  <TableHead>Fuel Saving</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routeData.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.id}</TableCell>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>{route.stops} stops</TableCell>
                    <TableCell>{route.distance}</TableCell>
                    <TableCell>{route.estimatedTime}</TableCell>
                    <TableCell className="text-green-600 font-medium">{route.fuelSaving}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4 p-3 bg-green-50 text-green-800 rounded-md">
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span className="text-sm font-medium">Potential savings: $243.50 and 38.2 gallons of fuel this week</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8 bg-white text-green-800">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteOptimization;
