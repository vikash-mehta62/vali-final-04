
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  FileText, 
  Truck, 
  CreditCard, 
  Store,
  Calendar,
  BadgeCheck,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Client, formatCurrency, formatDate } from '@/lib/data';
import { getClientById } from '@/data/clientData';
import PageHeader from '@/components/shared/PageHeader';
import EditClientModal from '@/components/clients/EditClientModal';

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Get client data
  const client = getClientById(id || '');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  if (!client) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto bg-muted/30">
            <div className="page-container">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/clients')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clients
              </Button>
              
              <div className="flex items-center justify-center h-[60vh]">
                <Card className="max-w-md w-full">
                  <CardHeader>
                    <CardTitle>Client Not Found</CardTitle>
                    <CardDescription>
                      The client with ID {id} does not exist.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate('/clients')} className="w-full">
                      Return to Clients List
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  const handleEditClient = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateClient = (updatedData: Omit<Client, 'id'>) => {
    toast({
      title: "Client Updated",
      description: "Client information has been updated successfully.",
    });
    setIsEditModalOpen(false);
  };
  
  const handleViewOrders = () => {
    navigate(`/orders?clientId=${client.id}`);
  };
  
  const handleCreateOrder = () => {
    navigate(`/orders/new?clientId=${client.id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/clients')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{client.name}</CardTitle>
                    <CardDescription className="text-lg">{client.company}</CardDescription>
                  </div>
                  <Button onClick={handleEditClient}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Client
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <div>{client.state}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Client Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium capitalize ${
                            client.status === 'active' ? 'text-green-600' : 'text-amber-600'
                          }`}>{client.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Spent:</span>
                          <span className="font-medium">{formatCurrency(client.totalSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Order:</span>
                          <span>{formatDate(client.lastOrder)}</span>
                        </div>
                        {client.isShop && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Store Type:</span>
                              <div className="flex items-center gap-1">
                                <Store className="h-4 w-4 text-primary" />
                                <span>Shop/Store Location</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Category:</span>
                              <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4 text-primary" />
                                <span className="capitalize">Category {client.category}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Shop Status:</span>
                              <span className={`font-medium capitalize ${
                                client.shopStatus === 'open' ? 'text-green-600' : 
                                client.shopStatus === 'busy' ? 'text-amber-600' : 'text-red-600'
                              }`}>{client.shopStatus}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={handleViewOrders} variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      View Orders
                    </Button>
                    <Button onClick={handleCreateOrder}>
                      <Truck className="mr-2 h-4 w-4" />
                      Create New Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="orders">
                <TabsList className="mb-4">
                  <TabsTrigger value="orders" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Order History
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Summary
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground text-center py-8">
                        Order history will be displayed here.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground text-center py-8">
                        Payment history and summary will be displayed here.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground text-center py-8">
                        Timeline of client activities will be displayed here.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      {client && (
        <EditClientModal
          client={client}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateClient}
        />
      )}
    </div>
  );
};

export default ClientProfile;
