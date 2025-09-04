
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Fuel, CircleDollarSign, Route, Map, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

interface RouteSummaryProps {
  route: {
    distance: number;
    duration: number;
    stops: number;
    fuelSaved: number;
    costSaved: number;
    isCustom?: boolean;
  };
}

const RouteSummary: React.FC<RouteSummaryProps> = ({ route }) => {
  const handleExportRoute = () => {
    // In a real application, this would export the route to a file format like GPX or KML
    alert('Route export functionality would be implemented here');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          {route.isCustom ? 'Custom Route Summary' : 'Optimized Route Summary'}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-primary/10 p-3 rounded-md flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Stops</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{route.stops}</span>
            </div>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Distance</span>
            <div className="flex items-center gap-1.5">
              <Route className="h-4 w-4 text-primary" />
              <span className="font-medium">{route.distance} miles</span>
            </div>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Duration</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{route.duration} hours</span>
            </div>
          </div>
          
          <div className="bg-green-100 p-3 rounded-md flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Fuel Saved</span>
            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4 text-green-600" />
              <span className="font-medium">{route.fuelSaved} gallons</span>
            </div>
          </div>
          
          <div className="bg-green-100 p-3 rounded-md flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Cost Saved</span>
            <div className="flex items-center gap-1.5">
              <CircleDollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium">{formatCurrency(route.costSaved)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {route.isCustom 
              ? `This custom route includes ${route.stops} stops over ${route.distance} miles.`
              : `This optimized route reduces travel distance by approximately 15% compared to a standard route.`
            }
          </p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5"
              onClick={handleExportRoute}
            >
              <Share2 className="h-3.5 w-3.5" />
              Export
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center gap-1.5"
            >
              <Map className="h-3.5 w-3.5" />
              Directions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteSummary;
