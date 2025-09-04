
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Users,
  Package,
  BarChart2,
  Settings,
  Briefcase,
  Store as StoreIcon,
  FileText,
  Wand2,
  Mail,
  Truck,
  AlertTriangle
} from 'lucide-react';

import DashboardGuide from './guides/DashboardGuide';
import OrdersGuide from './guides/OrdersGuide';
import ClientsGuide from './guides/ClientsGuide';
import InventoryGuide from './guides/InventoryGuide';
import CRMGuide from './guides/CRMGuide';
import WebsiteGeneratorGuide from './guides/WebsiteGeneratorGuide';
import PdfExportGuide from './guides/PdfExportGuide';
import EmailCommunicationGuide from './guides/EmailCommunicationGuide';
import TroubleshootingGuide from './guides/TroubleshootingGuide';

const UserGuideContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6 pb-10">
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 overflow-x-auto">
          <TabsList className="inline-flex h-auto p-1 w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 px-3 py-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1.5 px-3 py-1.5">
              <ShoppingCart className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-1.5 px-3 py-1.5">
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-1.5 px-3 py-1.5">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-1.5 px-3 py-1.5">
              <Briefcase className="h-4 w-4" />
              <span>CRM</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-1.5 px-3 py-1.5">
              <StoreIcon className="h-4 w-4" />
              <span>Store</span>
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-1.5 px-3 py-1.5">
              <Wand2 className="h-4 w-4" />
              <span>Website Generator</span>
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1.5 px-3 py-1.5">
              <FileText className="h-4 w-4" />
              <span>PDF Exports</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1.5 px-3 py-1.5">
              <Mail className="h-4 w-4" />
              <span>Email & Communication</span>
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="flex items-center gap-1.5 px-3 py-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Troubleshooting</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <TabsContent value="dashboard">
              <DashboardGuide />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersGuide />
            </TabsContent>
            
            <TabsContent value="clients">
              <ClientsGuide />
            </TabsContent>
            
            <TabsContent value="inventory">
              <InventoryGuide />
            </TabsContent>
            
            <TabsContent value="crm">
              <CRMGuide />
            </TabsContent>
            
            <TabsContent value="store">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Store Management</h2>
                <p className="text-muted-foreground">
                  Our store management functionality allows you to run an online store or sales
                  platform efficiently. You can manage products, handle orders, and process payments.
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Product catalog management</li>
                    <li>Shopping cart functionality</li>
                    <li>Discount and promotion management</li>
                    <li>Order processing</li>
                    <li>Payment integration</li>
                    <li>Customer account management</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
                  <h4 className="font-medium text-amber-800 flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Pro Tips
                  </h4>
                  <p className="text-amber-700 text-sm">
                    Use the bulk discount features to incentivize larger orders. The system automatically
                    calculates appropriate discounts based on quantity thresholds you set.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="website">
              <WebsiteGeneratorGuide />
            </TabsContent>
            
            <TabsContent value="pdf">
              <PdfExportGuide />
            </TabsContent>
            
            <TabsContent value="email">
              <EmailCommunicationGuide />
            </TabsContent>
            
            <TabsContent value="troubleshooting">
              <TroubleshootingGuide />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default UserGuideContent;
