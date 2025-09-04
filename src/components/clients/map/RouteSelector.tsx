
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CornerRightDown, Plus, Wand2, Route, MapPin } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';

interface RouteSelectorProps {
  onToggleCustomRoute: (enabled: boolean) => void;
  isCalculating: boolean;
  route: any | null;
  onReset: () => void;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({
  onToggleCustomRoute,
  isCalculating,
  route,
  onReset
}) => {
  const [customRouteEnabled, setCustomRouteEnabled] = useState(false);
  const { toast } = useToast();
  
  const handleToggleCustom = () => {
    const newValue = !customRouteEnabled;
    setCustomRouteEnabled(newValue);
    onToggleCustomRoute(newValue);
  };

  return (
    <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] w-11/12 max-w-md shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Route className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Route Planning</h3>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Toggle 
                  pressed={customRouteEnabled} 
                  onPressedChange={handleToggleCustom}
                  disabled={isCalculating}
                  aria-label="Toggle custom route"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Custom
                </Toggle>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset}
                disabled={isCalculating || !route}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          
          {customRouteEnabled ? (
            <div className="bg-primary/10 p-3 rounded text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Custom Route Enabled</p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                    <li>Click on map to add stops to your route</li>
                    <li>Click existing stops to remove or show alternatives</li>
                    <li>Drag stops to reorder your route</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-100 p-3 rounded text-sm">
              <div className="flex items-start space-x-2">
                <Wand2 className="h-4 w-4 text-blue-700 mt-0.5" />
                <div>
                  <p className="font-medium">Automatic Route Optimization</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    System will calculate the most efficient route through all stops
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {route && route.isCustom && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {route.stops} stops • {route.distance} miles • {route.duration} hours
              </div>
              <Button variant="ghost" size="sm" className="text-primary h-7 px-2">
                <CornerRightDown className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteSelector;
