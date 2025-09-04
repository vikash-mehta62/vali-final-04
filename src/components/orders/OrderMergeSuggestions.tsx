
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Merge, TruckIcon, Route, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { orders } from '@/lib/data';

// Group of orders that can be merged based on route proximity
const mergeableSuggestions = [
  {
    id: 'ms001',
    routeName: 'North Route',
    orders: ['o001', 'o006'],
    distanceSaving: '12 miles',
    fuelSaving: '0.8 gallons',
    costSaving: '$21.50'
  },
  {
    id: 'ms002',
    routeName: 'East Route',
    orders: ['o003', 'o005'],
    distanceSaving: '8 miles',
    fuelSaving: '0.5 gallons',
    costSaving: '$15.75'
  },
];

const OrderMergeSuggestions = () => {
  const { toast } = useToast();
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [mergedSuggestions, setMergedSuggestions] = useState<string[]>([]);
  
  const getOrderDetails = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };
  
  const handleSuggestionSelect = (suggestionId: string) => {
    setSelectedSuggestions(prev => {
      if (prev.includes(suggestionId)) {
        return prev.filter(id => id !== suggestionId);
      } else {
        return [...prev, suggestionId];
      }
    });
  };
  
  const handleMergeSelected = () => {
    if (selectedSuggestions.length === 0) {
      toast({
        title: "No suggestions selected",
        description: "Please select at least one suggestion to merge",
        variant: "destructive",
      });
      return;
    }
    
    setMergedSuggestions(prev => [...prev, ...selectedSuggestions]);
    setSelectedSuggestions([]);
    
    toast({
      title: "Orders Merged",
      description: `${selectedSuggestions.length} shipping routes have been optimized`,
    });
  };
  
  const availableSuggestions = mergeableSuggestions.filter(
    suggestion => !mergedSuggestions.includes(suggestion.id)
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Merge Suggestions</CardTitle>
          <CardDescription>
            Optimize shipping by merging orders on similar routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableSuggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Merge className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <p>No merge suggestions available</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                All available suggestions have been applied
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {availableSuggestions.length} suggestions available
                </p>
                <Button 
                  onClick={handleMergeSelected}
                  disabled={selectedSuggestions.length === 0}
                >
                  <Merge size={16} className="mr-2" />
                  Merge Selected ({selectedSuggestions.length})
                </Button>
              </div>
              
              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Distance Saved</TableHead>
                      <TableHead>Fuel Saved</TableHead>
                      <TableHead>Cost Saved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableSuggestions.map((suggestion) => (
                      <TableRow key={suggestion.id} className="cursor-pointer hover:bg-muted/80">
                        <TableCell>
                          <Checkbox
                            checked={selectedSuggestions.includes(suggestion.id)}
                            onCheckedChange={() => handleSuggestionSelect(suggestion.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Route size={16} className="text-blue-500" />
                            {suggestion.routeName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {suggestion.orders.map((orderId, index) => {
                              const order = getOrderDetails(orderId);
                              return (
                                <React.Fragment key={orderId}>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                                    <TruckIcon size={12} className="mr-1" />
                                    {orderId} - {order?.clientName}
                                  </span>
                                  {index < suggestion.orders.length - 1 && (
                                    <ArrowRight size={12} className="mx-1 text-muted-foreground" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-600">{suggestion.distanceSaving}</TableCell>
                        <TableCell className="text-green-600">{suggestion.fuelSaving}</TableCell>
                        <TableCell className="font-medium text-green-600">{suggestion.costSaving}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
          
          {mergedSuggestions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Applied Merges</h3>
              <div className="space-y-2">
                {mergeableSuggestions
                  .filter(suggestion => mergedSuggestions.includes(suggestion.id))
                  .map(suggestion => (
                    <div 
                      key={suggestion.id}
                      className="flex justify-between items-center p-3 bg-green-50 text-green-800 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        <span>
                          Merged {suggestion.orders.length} orders on {suggestion.routeName}
                        </span>
                      </div>
                      <span className="text-green-700 font-medium">{suggestion.costSaving} saved</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {(availableSuggestions.length > 0 || mergedSuggestions.length > 0) && (
            <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-md">
              <div className="flex items-start gap-3">
                <Merge size={24} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Why merge orders?</h3>
                  <p className="text-sm mt-1">
                    Combining shipments headed in the same direction can reduce transportation costs by 15-30% 
                    and decrease your carbon footprint. Our smart algorithm finds opportunities to consolidate 
                    orders without affecting delivery times.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderMergeSuggestions;
