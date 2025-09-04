import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ListFilter, Store, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceListTemplates from "@/components/inventory/pricelist/PriceListTemplates";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PriceListTemplate } from "@/components/inventory/forms/formTypes";
import StoreOrderView from "@/components/inventory/pricelist/StoreOrderView";

// Example store data
const stores = [
  { id: "store1", name: "Fresh Market Downtown" },
  { id: "store2", name: "Green Grocers Uptown" },
  { id: "store3", name: "City Supermarket" },
  { id: "store4", name: "Health Foods Co." },
];

const PriceList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [isStoreViewOpen, setIsStoreViewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PriceListTemplate | null>(null);
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenStoreView = (template: PriceListTemplate) => {
    setSelectedTemplate(template);
    setIsStoreViewOpen(true);
  };

  return (
    <div className="flex bg-muted/30">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col ">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 ">
          <div className="container px-4 py-6 mx-auto max-w-7xl">
            <div className="mb-6">
              <PageHeader
                title="Price Lists"
                description="Create and manage price lists to share with stores"
              >
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                    onClick={() => {
                      // This would be a demo for how a store would view and order from a price list
                      // In a real application, this would be accessed from the store interface
                      if (selectedTemplate) {
                        handleOpenStoreView(selectedTemplate);
                      }
                    }}
                  >
                    <Store size={16} className="mr-2" />
                    Store Demo
                  </Button>
                </div>
              </PageHeader>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="templates">
                  <ListFilter size={16} className="mr-2" />
                  Price List Templates
                </TabsTrigger>
                <TabsTrigger value="sent">
                  <Store size={16} className="mr-2" />
                  Sent to Stores
                </TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-4">
                <PriceListTemplates />
              </TabsContent>

              <TabsContent value="sent">
                <div className="bg-muted p-8 rounded-lg text-center">
                  <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sent Price Lists</h3>
                  <p className="text-muted-foreground">
                    Track which price lists have been sent to stores and monitor
                    ordering activity.
                  </p>
                  <p className="text-muted-foreground mt-1 mb-4">
                    This feature would be implemented in a full application.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Store View Dialog */}
            <Dialog open={isStoreViewOpen} onOpenChange={setIsStoreViewOpen}>
              <DialogContent className="max-w-6xl p-0 bg-transparent border-none shadow-none">
                {selectedTemplate && (
                  <StoreOrderView
                    template={selectedTemplate}
                    storeName={selectedStore.name}
                    onClose={() => setIsStoreViewOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PriceList;
