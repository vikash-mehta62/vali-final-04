
import React, { useState } from 'react';
import { Client, formatCurrency } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClientsByStateProps {
  clients: Client[];
}

const ClientsByState: React.FC<ClientsByStateProps> = ({ clients }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique states and count clients in each state
  const stateMap = clients.reduce((acc, client) => {
    // Filter by search query if provided
    if (
      searchQuery && 
      !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !client.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !client.state.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return acc;
    }
    
    const state = client.state || 'Unknown';
    if (!acc[state]) {
      acc[state] = {
        count: 0,
        active: 0,
        inactive: 0,
        clients: [],
        totalSpent: 0
      };
    }
    
    acc[state].count += 1;
    acc[state].clients.push(client);
    acc[state].totalSpent += client.totalSpent;
    
    if (client.status === 'active') {
      acc[state].active += 1;
    } else {
      acc[state].inactive += 1;
    }
    
    return acc;
  }, {} as Record<string, { 
    count: number, 
    active: number, 
    inactive: number, 
    clients: Client[],
    totalSpent: number
  }>);
  
  // Convert to sorted array for rendering
  const statesArray = Object.entries(stateMap)
    .map(([state, data]) => ({ state, ...data }))
    .sort((a, b) => b.count - a.count);
  
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="relative w-full sm:max-w-xs mb-6">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search states or clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {statesArray.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No clients found matching your search
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statesArray.map(({ state, count, active, inactive, clients, totalSpent }) => (
            <Card key={state} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{state}</CardTitle>
                  <Badge variant="outline" className="text-base bg-primary/10 text-primary">
                    {count} client{count !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Revenue:</span>
                    <span className="font-semibold">{formatCurrency(totalSpent)}</span>
                  </div>
                  
                  <div className="bg-muted/40 p-3 rounded-md flex justify-between">
                    <div className="text-center">
                      <span className={cn(
                        "text-sm font-medium px-2 py-1 rounded-full",
                        "bg-green-100 text-green-700"
                      )}>
                        {active} Active
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={cn(
                        "text-sm font-medium px-2 py-1 rounded-full",
                        "bg-amber-100 text-amber-700"
                      )}>
                        {inactive} Inactive
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Top Clients:</p>
                    <ul className="text-sm divide-y">
                      {clients
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 3)
                        .map((client) => (
                          <li 
                            key={client.id} 
                            className="py-2 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">{client.company}</p>
                            </div>
                            <span className="text-xs">{formatCurrency(client.totalSpent)}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsByState;
