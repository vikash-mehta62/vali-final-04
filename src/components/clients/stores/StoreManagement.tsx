
import React from 'react';
import { Store, ArrowUpDown, MapPin, CheckCircle, XCircle, User, Store as StoreIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Client } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StoreManagementProps {
  stores: Client[];
  onToggleStatus: (id: string) => void;
  onDeleteStore?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ 
  stores, 
  onToggleStatus, 
  onDeleteStore,
  onViewProfile
}) => {
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getShopStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-amber-100 text-amber-700';
      case 'closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'A': return 'text-blue-500';
      case 'B': return 'text-purple-500';
      case 'C': return 'text-orange-500';
      default: return 'text-primary';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <StoreIcon className="mr-2 h-5 w-5 text-primary" />
            Stores
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="sr-only md:not-sr-only text-xs">Sort</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1">
        <ScrollArea className="h-[400px] px-3">
          <div className="space-y-2">
            {stores.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No stores found
              </div>
            ) : (
              stores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-md border bg-card text-card-foreground shadow-sm p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{store.name}</h3>
                      <p className="text-sm text-muted-foreground">{store.company}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className={getStatusColor(store.status)}>
                        {store.status === 'active' ? (
                          <span className="flex items-center gap-0.5">
                            <CheckCircle size={10} />
                            <span className="ml-0.5">Active</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <XCircle size={10} />
                            <span className="ml-0.5">Inactive</span>
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-xs space-y-1.5 mb-3">
                    <div className="flex items-start gap-1">
                      <MapPin size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                      <span>{store.state}</span>
                    </div>
                    {store.category && (
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Category:</span>
                        <span className="font-medium flex items-center">
                          <StoreIcon size={12} className={`mr-1 ${getCategoryColor(store.category)}`} />
                          {store.category}
                        </span>
                      </div>
                    )}
                    {store.shopStatus && (
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Shop Status:</span>
                        <Badge variant="outline" className={getShopStatusColor(store.shopStatus)}>
                          <span className="capitalize">{store.shopStatus}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7 px-2.5 flex-1"
                      onClick={() => onToggleStatus(store.id)}
                    >
                      {store.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    {onViewProfile && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="text-xs h-7 px-2.5 flex-1"
                        onClick={() => onViewProfile(store.id)}
                      >
                        <User className="mr-1 h-3 w-3" />
                        Profile
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StoreManagement;
