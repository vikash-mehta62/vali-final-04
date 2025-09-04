import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ClientsList from "@/components/clients/ClientsList";
import ClientsByState from "@/components/clients/ClientsByState";
import ClientsMap from "@/components/clients/ClientsMap";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Map, List, BarChart3 } from "lucide-react";
import { clients as initialClients, Client } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { StoreProvider } from "@/contexts/StoreContext";

const Clients = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddClient = (clientData: Omit<Client, "id">) => {
    const newClient: Client = {
      ...clientData,
      id: `c${String(clients.length + 1).padStart(3, "0")}`,
    };

    setClients([...clients, newClient]);
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added successfully.`,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader
              title="Client Management"
              description="Manage your clients and customer relationships"
            />

            <StoreProvider>
              <Tabs defaultValue="list" className="w-full mb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="list" className="flex items-center">
                    <List size={16} className="mr-2" />
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="state" className="flex items-center">
                    <BarChart3 size={16} className="mr-2" />
                    By State
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center">
                    <Map size={16} className="mr-2" />
                    Map View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                  <ClientsList
                    clients={clients}
                    onAddClient={handleAddClient}
                  />
                </TabsContent>

                <TabsContent value="state">
                  <ClientsByState clients={clients} />
                </TabsContent>

                <TabsContent value="map">
                  <ClientsMap clients={clients} />
                </TabsContent>
              </Tabs>
            </StoreProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Clients;
