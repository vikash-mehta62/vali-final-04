import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Client } from '@/types';
import { getCoordinatesForState } from '@/data/clientData';
import { useToast } from '@/hooks/use-toast';

interface RouteCalculatorProps {
  startPoint: [number, number];
  clients: Client[];
  onRouteCalculated: (route: any) => void;
}

export interface RouteCalculatorRef {
  toggleCustomRoute: (enabled: boolean) => void;
}

const RouteCalculator = forwardRef<RouteCalculatorRef, RouteCalculatorProps>(({ 
  startPoint, 
  clients, 
  onRouteCalculated 
}, ref) => {
  const map = useMap();
  const [selectedRoutePoints, setSelectedRoutePoints] = useState<[number, number][]>([]);
  const [isCustomRoute, setIsCustomRoute] = useState(false);
  const { toast } = useToast();
  
  useImperativeHandle(ref, () => ({
    toggleCustomRoute: (enabled: boolean) => {
      setIsCustomRoute(enabled);
      if (enabled) {
        setSelectedRoutePoints([]);
        
        toast({
          title: "Custom Route Enabled",
          description: "Click on the map to add stops to your custom route",
        });
      } else {
        toast({
          title: "Automatic Route Enabled",
          description: "Route will be automatically optimized",
        });
      }
    }
  }));
  
  useEffect(() => {
    if (!startPoint || clients.length === 0) return;
    
    const timer = setTimeout(() => {
      // Clear existing layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          if (layer._leaflet_id !== 'baseLayer') {
            map.removeLayer(layer);
          }
        }
      });
      
      const clientPoints = clients.map(client => getCoordinatesForState(client.state));
      
      // If custom route is active and we have selected points, use them
      // Otherwise use the auto-optimized route
      const usePoints = isCustomRoute && selectedRoutePoints.length > 0 
        ? selectedRoutePoints 
        : shufflePoints(clientPoints);
      
      // Create the full route including start point
      const routePoints = [startPoint, ...usePoints];
      
      if (!isCustomRoute) {
        // Add start point at the end to return to start for auto routes
        routePoints.push(startPoint);
      }
      
      // Calculate total distance for reporting
      let totalDistance = 0;
      for (let i = 0; i < routePoints.length - 1; i++) {
        const point1 = L.latLng(routePoints[i][0], routePoints[i][1]);
        const point2 = L.latLng(routePoints[i+1][0], routePoints[i+1][1]);
        totalDistance += point1.distanceTo(point2) / 1000; // in km
      }
      
      // Convert to miles
      const distanceInMiles = Math.round(totalDistance * 0.621371);
      
      // Add main route polyline
      const polyline = L.polyline(routePoints, { 
        color: '#4f46e5', 
        weight: 3,
        opacity: 0.7,
        dashArray: isCustomRoute ? undefined : '5, 5',
      });
      
      polyline.addTo(map);
      
      // Add markers for each stop with numbers
      routePoints.forEach((point, index) => {
        if (index > 0 && (index < routePoints.length - 1 || isCustomRoute)) {
          const stopMarker = L.circleMarker(point, {
            radius: 8,
            fillColor: '#4f46e5',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          });
          
          stopMarker.addTo(map);
          
          // Add stop number
          const stopNumber = L.divIcon({
            html: `<div style="color: white; font-weight: bold; font-size: 10px;">${index}</div>`,
            className: 'stop-number-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          L.marker(point, { icon: stopNumber }).addTo(map);
          
          // Add click handler to markers for custom routes
          if (isCustomRoute) {
            stopMarker.on('click', () => {
              handleMarkerClick(point, index);
            });
          }
        }
      });
      
      // Add start/end marker
      const startMarker = L.marker(startPoint, {
        icon: L.divIcon({
          html: '<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
          className: 'start-end-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map);
      
      // Setup click handlers for custom route creation
      if (isCustomRoute) {
        setupMapClickHandlers();
      }
      
      // Fit bounds with padding
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      
      // Calculate metrics to display
      const fuelSaved = Math.round(distanceInMiles * 0.05); // Assuming 0.05 gallons per mile saved
      const costSaved = Math.round(fuelSaved * 4); // Assuming $4 per gallon
      const hoursRequired = Math.round(distanceInMiles / 45); // Average 45 mph
      
      onRouteCalculated({
        distance: distanceInMiles,
        duration: hoursRequired,
        stops: isCustomRoute ? selectedRoutePoints.length : clients.length,
        fuelSaved: fuelSaved,
        costSaved: costSaved,
        polyline: polyline,
        isCustom: isCustomRoute
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [startPoint, clients, map, onRouteCalculated, selectedRoutePoints, isCustomRoute]);
  
  const shufflePoints = (points: [number, number][]) => {
    const shuffledPoints = [...points];
    for (let i = shuffledPoints.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPoints[i], shuffledPoints[j]] = [shuffledPoints[j], shuffledPoints[i]];
    }
    return shuffledPoints;
  };
  
  const handleMarkerClick = (point: [number, number], index: number) => {
    if (!isCustomRoute) return;
    
    const popup = L.popup()
      .setLatLng(point)
      .setContent(`
        <div class="custom-popup">
          <p class="font-semibold mb-2">Stop #${index}</p>
          <button class="remove-stop px-2 py-1 bg-red-500 text-white text-xs rounded mb-1 w-full">Remove Stop</button>
          <button class="alternate-stop px-2 py-1 bg-blue-500 text-white text-xs rounded w-full">Show Alternates</button>
        </div>
      `)
      .openOn(map);
      
    document.querySelector('.remove-stop')?.addEventListener('click', () => {
      removePoint(index);
      map.closePopup();
    });
    
    document.querySelector('.alternate-stop')?.addEventListener('click', () => {
      showAlternateRoutes(point, index);
      map.closePopup();
    });
  };
  
  const removePoint = (index: number) => {
    const newPoints = [...selectedRoutePoints];
    newPoints.splice(index - 1, 1);
    setSelectedRoutePoints(newPoints);
    
    toast({
      title: "Stop Removed",
      description: `Stop #${index} has been removed from your route`,
    });
  };
  
  const showAlternateRoutes = (point: [number, number], index: number) => {
    const availablePoints = clients.map(client => getCoordinatesForState(client.state))
      .filter(coords => !selectedRoutePoints.some(p => p[0] === coords[0] && p[1] === coords[1]));
    
    const alternatives = findClosestPoints(point, availablePoints, 3);
    
    alternatives.forEach((alt, idx) => {
      const altMarker = L.circleMarker(alt, {
        radius: 8,
        fillColor: '#10b981',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      
      const dashLine = L.polyline([point, alt], {
        color: '#10b981',
        weight: 2,
        opacity: 0.6,
        dashArray: '3, 5'
      }).addTo(map);
      
      altMarker.on('click', () => {
        selectAlternative(alt, index);
        
        map.eachLayer((layer: any) => {
          if (layer === altMarker || layer === dashLine) {
            map.removeLayer(layer);
          }
        });
      });
    });
    
    toast({
      title: "Alternative Stops",
      description: `Showing ${alternatives.length} alternative stops. Click one to add it to your route.`,
    });
  };
  
  const findClosestPoints = (point: [number, number], points: [number, number][], count: number) => {
    const pointLatLng = L.latLng(point[0], point[1]);
    
    return points
      .map(p => ({
        point: p,
        distance: pointLatLng.distanceTo(L.latLng(p[0], p[1]))
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count)
      .map(item => item.point);
  };
  
  const selectAlternative = (point: [number, number], index: number) => {
    const newPoints = [...selectedRoutePoints];
    newPoints.splice(index, 0, point);
    setSelectedRoutePoints(newPoints);
    
    toast({
      title: "Stop Added",
      description: "New stop has been added to your route",
    });
  };
  
  const setupMapClickHandlers = () => {
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!isCustomRoute) return;
      
      const clickedPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      
      const clientPoints = clients.map(client => getCoordinatesForState(client.state));
      const nearbyPoint = findNearbyClientPoint(clickedPoint, clientPoints);
      
      if (nearbyPoint) {
        if (selectedRoutePoints.some(p => p[0] === nearbyPoint[0] && p[1] === nearbyPoint[1])) {
          toast({
            title: "Stop Already Added",
            description: "This location is already in your route",
            variant: "destructive"
          });
          return;
        }
        
        setSelectedRoutePoints([...selectedRoutePoints, nearbyPoint]);
        
        toast({
          title: "Stop Added",
          description: "New stop has been added to your route",
        });
      } else {
        setSelectedRoutePoints([...selectedRoutePoints, clickedPoint]);
        
        toast({
          title: "Custom Stop Added",
          description: "Custom location has been added to your route",
        });
      }
    });
    
    return () => {
      map.off('click');
    };
  };
  
  const findNearbyClientPoint = (point: [number, number], clientPoints: [number, number][], threshold: number = 20) => {
    const clickLatLng = L.latLng(point[0], point[1]);
    
    for (const clientPoint of clientPoints) {
      const clientLatLng = L.latLng(clientPoint[0], clientPoint[1]);
      const distance = clickLatLng.distanceTo(clientLatLng);
      
      if (distance < threshold * 1000) {
        return clientPoint;
      }
    }
    
    return null;
  };
  
  return null;
});

RouteCalculator.displayName = "RouteCalculator";

export default RouteCalculator;
