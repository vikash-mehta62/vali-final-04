import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { apiConnector } from '@/services2/apiConnector';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const sampleWarehouses = [
  {
    name: "Atlanta Distribution Center",
    code: "ATL-01",
    state: "GA",
    city: "Atlanta",
    address: {
      street: "4300 Pleasantdale Rd",
      city: "Atlanta",
      state: "GA",
      zipCode: "30340",
      country: "USA"
    },
    coordinates: {
      latitude: 33.7490,
      longitude: -84.3880
    },
    capacity: {
      total: 50000,
      available: 35000
    },
    zones: [
      { name: "Receiving", temperature: 70, capacity: 5000, currentUtilization: 60 },
      { name: "Cold Storage", temperature: 35, capacity: 15000, currentUtilization: 80 },
      { name: "Dry Storage", temperature: 70, capacity: 20000, currentUtilization: 65 },
      { name: "Shipping", temperature: 70, capacity: 10000, currentUtilization: 45 }
    ],
    deliveryRadius: 150,
    operatingHours: {
      monday: { open: "06:00", close: "18:00" },
      tuesday: { open: "06:00", close: "18:00" },
      wednesday: { open: "06:00", close: "18:00" },
      thursday: { open: "06:00", close: "18:00" },
      friday: { open: "06:00", close: "18:00" },
      saturday: { open: "08:00", close: "16:00" },
      sunday: { open: "08:00", close: "14:00" }
    },
    timezone: "America/New_York",
    manager: {
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "(404) 555-0123"
    }
  },
  {
    name: "Miami Fresh Hub",
    code: "MIA-01",
    state: "FL",
    city: "Miami",
    address: {
      street: "2500 NW 72nd Ave",
      city: "Miami",
      state: "FL",
      zipCode: "33122",
      country: "USA"
    },
    coordinates: {
      latitude: 25.7617,
      longitude: -80.1918
    },
    capacity: {
      total: 40000,
      available: 28000
    },
    zones: [
      { name: "Receiving", temperature: 75, capacity: 4000, currentUtilization: 70 },
      { name: "Cold Storage", temperature: 38, capacity: 18000, currentUtilization: 85 },
      { name: "Frozen Storage", temperature: -10, capacity: 8000, currentUtilization: 60 },
      { name: "Shipping", temperature: 75, capacity: 10000, currentUtilization: 50 }
    ],
    deliveryRadius: 120,
    operatingHours: {
      monday: { open: "05:00", close: "17:00" },
      tuesday: { open: "05:00", close: "17:00" },
      wednesday: { open: "05:00", close: "17:00" },
      thursday: { open: "05:00", close: "17:00" },
      friday: { open: "05:00", close: "17:00" },
      saturday: { open: "07:00", close: "15:00" },
      sunday: { open: "07:00", close: "13:00" }
    },
    timezone: "America/New_York",
    manager: {
      name: "Maria Rodriguez",
      email: "maria.rodriguez@company.com",
      phone: "(305) 555-0456"
    }
  },
  {
    name: "Dallas Regional Center",
    code: "DAL-01",
    state: "TX",
    city: "Dallas",
    address: {
      street: "1200 Industrial Blvd",
      city: "Dallas",
      state: "TX",
      zipCode: "75207",
      country: "USA"
    },
    coordinates: {
      latitude: 32.7767,
      longitude: -96.7970
    },
    capacity: {
      total: 60000,
      available: 42000
    },
    zones: [
      { name: "Receiving", temperature: 75, capacity: 6000, currentUtilization: 55 },
      { name: "Cold Storage", temperature: 40, capacity: 25000, currentUtilization: 75 },
      { name: "Dry Storage", temperature: 75, capacity: 20000, currentUtilization: 70 },
      { name: "Shipping", temperature: 75, capacity: 9000, currentUtilization: 60 }
    ],
    deliveryRadius: 200,
    operatingHours: {
      monday: { open: "06:00", close: "19:00" },
      tuesday: { open: "06:00", close: "19:00" },
      wednesday: { open: "06:00", close: "19:00" },
      thursday: { open: "06:00", close: "19:00" },
      friday: { open: "06:00", close: "19:00" },
      saturday: { open: "08:00", close: "17:00" },
      sunday: { open: "09:00", close: "15:00" }
    },
    timezone: "America/Chicago",
    manager: {
      name: "Robert Johnson",
      email: "robert.johnson@company.com",
      phone: "(214) 555-0789"
    }
  }
];

const WarehouseSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{name: string, success: boolean, message: string}>>([]);
  const token = useSelector((state: RootState) => state.auth?.token);

  const createSampleWarehouses = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const promises = sampleWarehouses.map(async (warehouse) => {
        try {
          const response = await apiConnector(
            'POST',
            `${import.meta.env.VITE_APP_BASE_URL}/warehouse/create`,
            warehouse,
            { Authorization: `Bearer ${token}` }
          );
          
          return {
            name: warehouse.name,
            success: response.data.success,
            message: response.data.message || 'Created successfully'
          };
        } catch (error: any) {
          return {
            name: warehouse.name,
            success: false,
            message: error.response?.data?.message || 'Failed to create'
          };
        }
      });
      
      const results = await Promise.all(promises);
      setResults(results);
      
    } catch (error) {
      console.error('Error creating warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Warehouse Setup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create sample warehouses to get started with multi-state inventory management
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {sampleWarehouses.map((warehouse, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{warehouse.name}</div>
                <div className="text-sm text-muted-foreground">
                  {warehouse.city}, {warehouse.state} • Code: {warehouse.code}
                </div>
              </div>
              {results.find(r => r.name === warehouse.name) && (
                <div className="flex items-center gap-2">
                  {results.find(r => r.name === warehouse.name)?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">
                    {results.find(r => r.name === warehouse.name)?.message}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={createSampleWarehouses} 
          disabled={loading || !token}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Warehouses...
            </>
          ) : (
            'Create Sample Warehouses'
          )}
        </Button>
        
        {!token && (
          <p className="text-sm text-red-600 text-center">
            Please log in to create warehouses
          </p>
        )}
        
        {results.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium mb-2">Setup Results:</div>
            <div className="text-sm">
              ✅ Success: {results.filter(r => r.success).length} warehouses
              {results.filter(r => !r.success).length > 0 && (
                <><br />❌ Failed: {results.filter(r => !r.success).length} warehouses</>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WarehouseSetup;