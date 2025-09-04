import React, { useState } from 'react';
import { Order, formatDate } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Truck, Printer, Upload, ArrowDown, CheckCircle, User, 
  Download, Copy, Share2, MapPin, Receipt, ReceiptText,
  Clipboard, Building, QrCode, AlertCircle, X, FileText,
  ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BillOfLadingForm from './BillOfLadingForm';

interface TransportationReceiptProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onViewClientProfile?: () => void;
}

const transportationSchema = z.object({
  driverName: z.string().min(1, "Driver name is required"),
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  estimatedArrival: z.string().min(1, "Estimated arrival is required"),
  notes: z.string().optional(),
  signature: z.string().min(1, "Signature is required"),
  transportCompany: z.string().optional(),
  deliveryLocation: z.string().optional(),
  routeNumber: z.string().optional(),
  packagingType: z.string().optional().default("Standard"),
  temperatureRequirements: z.string().optional(),
});

type TransportationFormValues = z.infer<typeof transportationSchema>;

const TransportationReceipt: React.FC<TransportationReceiptProps> = ({ 
  order, 
  open, 
  onClose,
  onViewClientProfile
}) => {
  const { toast } = useToast();
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [receiptType, setReceiptType] = useState("standard");
  const [documentType, setDocumentType] = useState<"receipt" | "bol">("receipt");
  const [showBolDialog, setShowBolDialog] = useState(false);
  
  const form = useForm<TransportationFormValues>({
    resolver: zodResolver(transportationSchema),
    defaultValues: {
      driverName: "",
      vehicleId: "",
      departureDate: new Date().toISOString().split('T')[0],
      estimatedArrival: "",
      notes: "",
      signature: "",
      transportCompany: "Fresh Produce Logistics",
      deliveryLocation: "",
      routeNumber: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      packagingType: "Standard",
      temperatureRequirements: "33-40°F (Refrigerated)"
    }
  });
  
  const handlePrint = () => {
    window.print();
    toast({
      title: "Print requested",
      description: "The transportation receipt has been sent to your printer."
    });
  };
  
  const handleSubmit = (data: TransportationFormValues) => {
    // In a real app, this would save the transportation receipt data
    console.log("Transportation receipt data:", data);
    
    setReceiptGenerated(true);
    toast({
      title: "Receipt Generated",
      description: "Transportation receipt has been created successfully."
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download initiated",
      description: "The receipt is being downloaded as a PDF."
    });
    // In a real app, this would generate and download a PDF
  };

  const handleCopyReceipt = () => {
    toast({
      title: "Receipt copied",
      description: "Receipt details have been copied to clipboard."
    });
    // In a real app, this would copy receipt details to clipboard
  };

  const handleShareReceipt = () => {
    toast({
      title: "Share options opened",
      description: "Choose how you want to share this receipt."
    });
    // In a real app, this would open sharing options
  };
  
  const handleNewReceipt = () => {
    setReceiptGenerated(false);
    form.reset();
  };
  
  const handleOpenBOL = () => {
    setShowBolDialog(true);
  };
  
  const handleBolClose = () => {
    setShowBolDialog(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Transportation Documentation for Order #{order.id}
            </DialogTitle>
          </DialogHeader>
          
          {!receiptGenerated ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  variant={documentType === "receipt" ? "default" : "outline"} 
                  onClick={() => setDocumentType("receipt")}
                  className="w-full"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Transportation Receipt
                </Button>
                <Button 
                  variant={documentType === "bol" ? "default" : "outline"} 
                  onClick={handleOpenBOL}
                  className="w-full"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Bill of Lading (BOL)
                </Button>
              </div>
              
              {documentType === "receipt" && (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="details">Basic Details</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery Info</TabsTrigger>
                    <TabsTrigger value="special">Special Requirements</TabsTrigger>
                  </TabsList>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <TabsContent value="details" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="driverName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Driver Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter driver's name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="vehicleId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vehicle ID/License</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter vehicle ID" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="departureDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Departure Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="estimatedArrival"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estimated Arrival</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="transportCompany"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transport Company</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter transport company name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="routeNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Route Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter route number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="delivery" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="deliveryLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Location</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter delivery address" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Order Summary</h4>
                          <p className="text-sm">Client: {order.clientName}</p>
                          <p className="text-sm">Order Date: {formatDate(order.date)}</p>
                          <p className="text-sm">Items: {order.items.length}</p>
                          <p className="text-sm text-muted-foreground">
                            Total Weight: ~{order.items.reduce((acc, item) => acc + item.quantity, 0) * 2} lbs
                          </p>
                          {onViewClientProfile && (
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-sm text-primary" 
                              onClick={onViewClientProfile}
                            >
                              <User className="mr-1 h-3 w-3" />
                              View Client Profile
                            </Button>
                          )}
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Instructions</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Enter any special handling instructions or notes" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="special" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="packagingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Packaging Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select packaging type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Standard">Standard</SelectItem>
                                  <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                                  <SelectItem value="Insulated">Insulated</SelectItem>
                                  <SelectItem value="Cold Chain">Cold Chain</SelectItem>
                                  <SelectItem value="Premium">Premium</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="temperatureRequirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Temperature Requirements</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select temperature requirements" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="33-40°F (Refrigerated)">33-40°F (Refrigerated)</SelectItem>
                                  <SelectItem value="0°F (Frozen)">0°F (Frozen)</SelectItem>
                                  <SelectItem value="60-75°F (Room Temperature)">60-75°F (Room Temperature)</SelectItem>
                                  <SelectItem value="50-60°F (Cool)">50-60°F (Cool)</SelectItem>
                                  <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="signature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Digital Signature</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Type your full name to sign" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground">Receipt Type</p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              type="button"
                              variant={receiptType === "standard" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setReceiptType("standard")}
                              className="flex items-center"
                            >
                              <Receipt className="mr-1 h-4 w-4" />
                              Standard
                            </Button>
                            <Button
                              type="button"
                              variant={receiptType === "detailed" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setReceiptType("detailed")}
                              className="flex items-center"
                            >
                              <ReceiptText className="mr-1 h-4 w-4" />
                              Detailed
                            </Button>
                            <Button
                              type="button"
                              variant={receiptType === "qr" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setReceiptType("qr")}
                              className="flex items-center"
                            >
                              <QrCode className="mr-1 h-4 w-4" />
                              QR Code
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          type="button" 
                          onClick={handleOpenBOL}
                          className="mr-auto"
                        >
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Switch to BOL
                        </Button>
                        <Button type="submit">
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Generate Receipt
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </Tabs>
              )}
            </div>
          ) : (
            <div className="p-6 border rounded-md bg-white space-y-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">TRANSPORTATION RECEIPT</h2>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">•</p>
                    <p className="text-sm text-gray-600">Route #{form.getValues().routeNumber}</p>
                  </div>
                  <p className="text-sm text-gray-600">Date: {formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-primary">{form.getValues().transportCompany}</h3>
                  <p className="text-sm text-gray-600">123 Harvest Lane</p>
                  <p className="text-sm text-gray-600">Farmington, CA 94123</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 border-t border-b py-4">
                <div>
                  <h4 className="font-medium mb-2">Transport Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <p>Driver: {form.getValues().driverName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Truck className="h-4 w-4 text-primary" />
                      <p>Vehicle ID: {form.getValues().vehicleId}</p>
                    </div>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p>Departure: {form.getValues().departureDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p>Est. Arrival: {form.getValues().estimatedArrival}</p>
                    </div>
                  </div>
                  
                  {receiptType === "detailed" && (
                    <div className="mt-4 space-y-1 text-sm">
                      <div className="flex gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        <p>Transport Company: {form.getValues().transportCompany}</p>
                      </div>
                      <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <p>Temperature Requirements: {form.getValues().temperatureRequirements}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Client Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {order.clientName}</p>
                    <p><span className="text-muted-foreground">ID:</span> {order.clientId}</p>
                    <p><span className="text-muted-foreground">Order Date:</span> {formatDate(order.date)}</p>
                    <p><span className="text-muted-foreground">Status:</span> <span className="capitalize">{order.status}</span></p>
                    <p><span className="text-muted-foreground">Delivery Location:</span> {form.getValues().deliveryLocation || "Client Address"}</p>
                  </div>
                  
                  {onViewClientProfile && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary mt-2" 
                      onClick={onViewClientProfile}
                    >
                      <User className="mr-1 h-3 w-3" />
                      View Client Profile
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Cargo Details</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Quantity</th>
                      {receiptType === "detailed" && (
                        <>
                          <th className="text-right py-2">Weight</th>
                          <th className="text-right py-2">Package Type</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{item.productName}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        {receiptType === "detailed" && (
                          <>
                            <td className="text-right py-2">~{item.quantity * 2} lbs</td>
                            <td className="text-right py-2">{form.getValues().packagingType}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {form.getValues().notes && (
                <div>
                  <h4 className="font-medium">Special Instructions</h4>
                  <p className="text-sm border p-2 rounded bg-gray-50">{form.getValues().notes}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Confirmed By:</h4>
                    <p className="text-sm italic">{form.getValues().signature}</p>
                    <p className="text-xs text-gray-500">Digital signature</p>
                  </div>
                  <div className="text-green-600 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <span className="font-medium">RECEIPT CONFIRMED</span>
                  </div>
                </div>
              </div>
              
              {receiptType === "qr" && (
                <div className="flex justify-center mt-4">
                  <div className="text-center">
                    <div className="bg-gray-100 p-4 inline-block">
                      <div className="w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMSAyMSI+PHBhdGggZD0iTTEgMWgzdjNoLTN6bTQgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgydjJoLTJ6bTMgMGgzdjNoLTN6TTEgNWgxdjFoLTF6bTcgMGgxdjJoLTF6bTIgMGgxdjFoLTF6bTMgMGgxdjFoLTF6TTEgN2gxdjFoLTF6bTIgMGgzdjFoLTN6bTIgMWgxdjFoLTF6bTEgMGgxdjFoLTF6bTEgMGgxdjJoLTF6bTEgMGgxdjFoLTF6bTEgMGgxdjFoLTF6TTEgOWgxdjFoLTF6bTIgMGgxdjJoLTF6bTEgMGgxdjFoLTF6bTEgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTUgMGgxdjJoLTF6TTcgMTBoMXYxaC0xek05IDEwaDJ2MWgtMnpNMiAxMWgydjJoLTJ6bTUgMGgxdjFoLTF6TTkgMTFoMXYxaC0xem0yIDBoMnYxaC0yek0xIDEzaDV2MWgtNXptNiAwaDJ2MWgtMnptNCAwaDN2MWgtM3ptNCAwaDN2M2gtM3pNMyAxNWgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgzdjFoLTN6TTEgMTdoM3YzaC0zem00IDBoMnYxaC0yek04IDE3aDJ2MmgtMnptNCAwaDF2MWgtMXptMiAwaDJ2MWgtMnpNNSAxOGgxdjFoLTF6bTggMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6TTEzIDE5aDF2MWgtMXoiLz48L3N2Zz4=')]"></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Scan for digital verification</p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="flex gap-2 flex-1">
                  <Button variant="outline" onClick={handlePrint} className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="flex gap-2 flex-1">
                  <Button variant="outline" onClick={handleCopyReceipt} className="flex-1">
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleShareReceipt} className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={handleNewReceipt}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>New receipt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {showBolDialog && (
        <BillOfLadingForm 
          order={order}
          onClose={handleBolClose}
          open={showBolDialog}
          // Removed the open prop since it's not required
        />
      )}
    </>
  );
};

export default TransportationReceipt;