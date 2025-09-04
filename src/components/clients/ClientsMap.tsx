import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Store, User, Warehouse } from 'lucide-react';
import { Client, StoreCategory } from '@/types';
import { getTopClients, getCoordinatesForState } from '@/data/clientData';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MapControls from './map/MapControls';
import RouteSummary from './map/RouteSummary';
import ShopForm from './map/ShopForm';
import StoreManagement from './stores/StoreManagement';
import RouteCalculator, { RouteCalculatorRef } from './map/RouteCalculator';
import RouteSelector from './map/RouteSelector';
import { useStore } from '@/contexts/StoreContext';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper component to set the initial map view
const SetMapView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Function to get category-specific marker
const getCategoryMarker = (category?: StoreCategory) => {
  let color = '#4f46e5'; // default blue for no category
  
  if (category === 'A') {
    color = '#3b82f6'; // blue
  } else if (category === 'B') {
    color = '#8b5cf6'; // purple
  } else if (category === 'C') {
    color = '#f97316'; // orange
  }
  
  return L.divIcon({
    html: `<div style="color: white; background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
               <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
               <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
               <path d="M2 7h20"></path>
             </svg>
           </div>`,
    className: 'store-category-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Get text color for category for use in popups
const getCategoryTextColor = (category?: StoreCategory) => {
  switch (category) {
    case 'A': return 'text-blue-500';
    case 'B': return 'text-purple-500';
    case 'C': return 'text-orange-500';
    default: return 'text-primary';
  }
};

// Create a warehouse marker icon
const getWarehouseMarker = () => {
  return L.divIcon({
    html: `<div style="color: white; background-color: #16a34a; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"></path>
               <path d="M6 18h12"></path>
               <path d="M6 14h12"></path>
               <rect x="6" y="10" width="12" height="12"></rect>
             </svg>
           </div>`,
    className: 'warehouse-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Create a type-safe CategoryMarker component that handles the icon prop correctly
const CategoryMarker: React.FC<{
  position: [number, number];
  category?: StoreCategory;
  children: React.ReactNode;
}> = ({ position, category, children }) => {
  const icon = getCategoryMarker(category);
  
  // Using type assertion to work around the TypeScript error
  const markerProps = { position, icon } as any;
  
  return (
    <Marker {...markerProps}>
      {children}
    </Marker>
  );
};

// Create a type-safe WarehouseMarker component
const WarehouseMarker: React.FC<{
  position: [number, number];
  children: React.ReactNode;
}> = ({ position, children }) => {
  const icon = getWarehouseMarker();
  
  // Using type assertion to work around the TypeScript error
  const markerProps = { position, icon } as any;
  
  return (
    <Marker {...markerProps}>
      {children}
    </Marker>
  );
};

interface ClientsMapProps {
  clients: Client[];
}

const ClientsMap: React.FC<ClientsMapProps> = ({ clients }) => {
  const [startLocation, setStartLocation] = useState('');
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [route, setRoute] = useState<any>(null);
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [displayClients, setDisplayClients] = useState<Client[]>([]);
  const [isCustomRoute, setIsCustomRoute] = useState(false);
  const [warehouseLocation] = useState<[number, number]>([39.0997, -94.5786]); // Kansas City (central US) as default warehouse location
  const routeCalculatorRef = useRef<RouteCalculatorRef>(null);
  const { stores, updateStore, deleteStore, filters, setFilters, getFilteredStores } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const storeClients = clients.filter(client => client.isShop);
    const topRegularClients = getTopClients(10).filter(client => !client.isShop);
    const combinedClients = [...storeClients, ...topRegularClients];
    
    const uniqueClients = Array.from(
      new Map(combinedClients.map(client => [client.id, client])).values()
    );
    
    setDisplayClients(uniqueClients);
  }, [clients]);
  
  const handleStartLocationSet = () => {
    if (!startLocation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a starting location",
        variant: "destructive"
      });
      return;
    }
    
    setStartPoint([38.8977, -77.0365]);
    toast({
      title: "Location Set",
      description: `Starting point set to ${startLocation}`
    });
  };
  
  const handleOptimizeRoute = () => {
    if (!startPoint) {
      toast({
        title: "Error",
        description: "Please set a starting location first",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    setRoute(null);
  };
  
  const handleRouteCalculated = (routeData: any) => {
    setIsCalculating(false);
    setRoute(routeData);
    
    toast({
      title: routeData.isCustom ? "Custom Route Created" : "Route Optimized",
      description: `${routeData.stops} stops, ${routeData.distance} miles total distance`
    });
  };

  const handleToggleStoreStatus = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      updateStore(storeId, { 
        status: store.status === 'active' ? 'inactive' : 'active' 
      });
      
      toast({
        title: "Store Status Updated",
        description: "Store status has been successfully updated"
      });
    }
  };
  
  const handleViewProfile = (clientId: string) => {
    navigate(`/clients/profile/${clientId}`);
  };
  
  const handleToggleCustomRoute = (enabled: boolean) => {
    setIsCustomRoute(enabled);
    
    // Access the RouteCalculator's toggleCustomRoute method via ref
    if (routeCalculatorRef.current) {
      routeCalculatorRef.current.toggleCustomRoute(enabled);
    }
  };
  
  const handleResetRoute = () => {
    setRoute(null);
    setIsCalculating(false);
    
    // If we were in custom route mode, toggle it back
    if (isCustomRoute) {
      handleToggleCustomRoute(false);
    }
    
    toast({
      title: "Route Reset",
      description: "Your route has been reset"
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Store Locations & Route Optimization
        </CardTitle>
        <Button 
          variant="outline" 
          onClick={() => setIsAddingShop(!isAddingShop)}
          className="flex items-center gap-1"
        >
          <Store className="h-4 w-4" />
          {isAddingShop ? 'Cancel' : 'Add Store'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <StoreManagement
              stores={getFilteredStores()}
              onToggleStatus={handleToggleStoreStatus}
              onDeleteStore={deleteStore}
              onViewProfile={handleViewProfile}
            />
          </div>
          
          <div className="space-y-6">
            <MapControls 
              startLocation={startLocation}
              onLocationChange={setStartLocation}
              onSetLocation={handleStartLocationSet}
              onOptimizeRoute={handleOptimizeRoute}
              isCalculating={isCalculating}
              hasStartPoint={!!startPoint}
            />
          
            <div className="h-[500px] border rounded-md overflow-hidden mb-4 relative">
              <ShopForm 
                isOpen={isAddingShop} 
                onClose={() => setIsAddingShop(false)} 
              />
              
              <MapContainer 
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <SetMapView center={[39.8283, -98.5795]} zoom={4} />
                
                {startPoint && (
                  <Marker position={startPoint}>
                    <Popup>Starting Location: {startLocation}</Popup>
                  </Marker>
                )}
                
                {/* Add warehouse location marker */}
                <WarehouseMarker position={warehouseLocation}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-semibold text-base mb-1 flex items-center">
                        <Warehouse className="h-4 w-4 mr-1 text-green-600" />
                        Main Warehouse
                      </h3>
                      <p className="text-sm">Central distribution facility</p>
                      <p className="text-sm mt-1">Kansas City, MO</p>
                    </div>
                  </Popup>
                </WarehouseMarker>
                
                {getFilteredStores().map((store) => {
                  const position = getCoordinatesForState(store.state);
                  
                  return (
                    <CategoryMarker 
                      key={store.id} 
                      position={position}
                      category={store.category}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-semibold text-base mb-1">{store.name}</h3>
                          <div className="text-sm space-y-1">
                            <p>Company: {store.company}</p>
                            <p>State: {store.state}</p>
                            {store.category && (
                              <p>
                                Category: 
                                <span className={`capitalize font-medium ml-1 ${getCategoryTextColor(store.category)}`}>
                                  {store.category}
                                </span>
                              </p>
                            )}
                            <p>Status: <span className={`capitalize font-medium ${
                              store.status === 'active' ? 'text-green-600' : 'text-gray-600'
                            }`}>{store.status}</span></p>
                            {store.isShop && store.shopStatus && (
                              <p>
                                Shop Status: <span className={`capitalize font-medium ${
                                  store.shopStatus === 'open' ? 'text-green-600' : 
                                  store.shopStatus === 'busy' ? 'text-amber-600' : 'text-red-600'
                                }`}>{store.shopStatus}</span>
                              </p>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2 w-full" 
                              onClick={() => handleViewProfile(store.id)}
                            >
                              <User className="h-3 w-3 mr-1" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    </CategoryMarker>
                  );
                })}
                
                {startPoint && isCalculating && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg z-[1000]">
                    <p className="text-center font-medium">Calculating optimized route...</p>
                  </div>
                )}
                
                {startPoint && !isCalculating && (
                  <RouteCalculator 
                    ref={routeCalculatorRef}
                    startPoint={startPoint} 
                    clients={getFilteredStores().filter(store => store.isShop && store.status === 'active')} 
                    onRouteCalculated={handleRouteCalculated}
                  />
                )}
                
                {startPoint && (
                  <RouteSelector
                    onToggleCustomRoute={handleToggleCustomRoute}
                    isCalculating={isCalculating}
                    route={route}
                    onReset={handleResetRoute}
                  />
                )}
              </MapContainer>
            </div>
            
            {route && <RouteSummary route={route} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsMap;
