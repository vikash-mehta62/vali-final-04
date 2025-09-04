
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Route, RotateCw, Search } from 'lucide-react';

interface MapControlsProps {
  startLocation: string;
  onLocationChange: (location: string) => void;
  onSetLocation: () => void;
  onOptimizeRoute: () => void;
  isCalculating: boolean;
  hasStartPoint: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  startLocation,
  onLocationChange,
  onSetLocation,
  onOptimizeRoute,
  isCalculating,
  hasStartPoint
}) => {
  return (
    <div className="bg-muted/20 p-4 rounded-lg mb-6 border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium flex items-center gap-1">
            <MapPin size={16} className="text-primary" />
            <span>Starting Location</span>
          </div>
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter your starting location" 
                value={startLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="secondary" className="ml-2 bg-secondary/80" onClick={onSetLocation}>
              <MapPin size={16} />
            </Button>
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <Button 
            onClick={onOptimizeRoute} 
            disabled={isCalculating || !hasStartPoint}
            className={`${!hasStartPoint ? 'opacity-70' : 'hover:bg-primary/90'} transition-all`}
          >
            {isCalculating ? (
              <>
                <RotateCw size={16} className="mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Route size={16} className="mr-2" />
                Optimize Route
              </>
            )}
          </Button>
        </div>
      </div>
      
      {!hasStartPoint && (
        <div className="mt-2 text-xs text-muted-foreground italic">
          Set your starting location to enable route optimization
        </div>
      )}
    </div>
  );
};

export default MapControls;
