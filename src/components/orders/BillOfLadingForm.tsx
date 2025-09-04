import React, { useState } from "react";
import { Order, formatDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Truck,
  FileText,
  Download,
  Copy,
  Share2,
  CheckCircle2,
  Printer,
  Package,
  ClipboardList,
  Clipboard,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  generateBillOfLadingPDF,
  BillOfLadingData,
  generateTransportationReceiptPDF,
} from "@/utils/exportDocuments";

interface BillOfLadingFormProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

const bolSchema = z.object({
  shipperName: z.string().min(1, "Shipper name is required"),
  shipperAddress: z.string().min(1, "Shipper address is required"),
  shipperCity: z.string().min(1, "City is required"),
  shipperState: z.string().min(1, "State is required"),
  shipperZip: z.string().min(1, "ZIP code is required"),

  consigneeName: z.string().min(1, "Consignee name is required"),
  consigneeAddress: z.string().min(1, "Consignee address is required"),
  consigneeCity: z.string().min(1, "City is required"),
  consigneeState: z.string().min(1, "State is required"),
  consigneeZip: z.string().min(1, "ZIP code is required"),
  consigneePhone: z.string().optional(),

  carrierName: z.string().min(1, "Carrier name is required"),
  trailerNumber: z.string().min(1, "Trailer number is required"),
  sealNumber: z.string().optional(),
  freightTerms: z.enum(["Prepaid", "Collect", "Third Party"]),
  specialInstructions: z.string().optional(),
  hazardousMaterials: z.boolean().default(false),
  signatureShipper: z.string().min(1, "Signature is required"),
  serviceLevel: z
    .enum(["Standard", "Expedited", "Same Day"])
    .default("Standard"),
});

type BolFormValues = z.infer<typeof bolSchema>;

const BillOfLadingForm: React.FC<BillOfLadingFormProps> = ({
  order,
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const [bolGenerated, setBolGenerated] = useState(false);
  const [bolNumber, setBolNumber] = useState(
    `BOL-${Math.floor(100000 + Math.random() * 900000)}`
  );
  console.log(order);
  const form = useForm<BolFormValues>({
    resolver: zodResolver(bolSchema),
    defaultValues: {
      shipperName: "Vali Produce",
      shipperAddress: "4300 Pleasantdale Rd",
      shipperCity: "Atlanta",
      shipperState: "GA",
      shipperZip: "30340 , USA",

      consigneeName: order.shippingAddress.name,
      consigneeAddress: order.shippingAddress.address,
      consigneeCity: order.shippingAddress.city,
      consigneeState: order.shippingAddress.country,
      consigneeZip: order.shippingAddress.postalCode,
      consigneePhone: order.shippingAddress.phone,

      carrierName: "Vali Produce",
      trailerNumber: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      sealNumber: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
      freightTerms: "Prepaid",
      specialInstructions: "",
      hazardousMaterials: false,
      signatureShipper: "",
      serviceLevel: "Standard",
    },
  });

  const handleGenerateBOL = (data: BolFormValues) => {
    console.log("BOL data:", data);

    setBolGenerated(true);
    toast({
      title: "BOL Generated",
      description: "Bill of Lading has been created successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print requested",
      description: "The Bill of Lading has been sent to your printer.",
    });
  };
  const calculateTotalPieces = () => {
    return order.items.reduce((acc, item) => acc + item.quantity, 0);
  };
  const handleDownload = () => {
    const formData = form.getValues();

    const bolData: BillOfLadingData = {
      bolNumber: ` ${order.orderNumber}`,

      shipperName: formData.shipperName,
      shipperAddress: formData.shipperAddress,
      shipperCity: formData.shipperCity,
      shipperState: formData.shipperState,
      shipperZip: formData.shipperZip,
      consigneeName: formData.consigneeName,
      consigneeAddress: formData.consigneeAddress,
      consigneeCity: formData.consigneeCity,
      consigneeState: formData.consigneeState,
      consigneeZip: formData.consigneeZip,
      consigneePhone: formData.consigneePhone,
      carrierName: formData.carrierName,
      trailerNumber: formData.trailerNumber,
      sealNumber: formData.sealNumber,
      freightTerms: formData.freightTerms,
      specialInstructions: formData.specialInstructions,
      hazardousMaterials: formData.hazardousMaterials || false,
      signatureShipper: formData.signatureShipper,
      serviceLevel: formData.serviceLevel,
      totalQuantity: calculateTotalPieces(),
    };

    const success = generateBillOfLadingPDF(order, bolData);

    if (success) {
      toast({
        title: "Download successful",
        description: "The Bill of Lading PDF has been downloaded.",
      });
    } else {
      toast({
        title: "Download failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    toast({
      title: "BOL copied",
      description: "BOL details have been copied to clipboard.",
    });
    // In a real app, this would copy BOL details to clipboard
  };

  const handleShare = () => {
    toast({
      title: "Share options opened",
      description: "Choose how you want to share this BOL.",
    });
    // In a real app, this would open sharing options
  };

  const handleNewBOL = () => {
    setBolGenerated(false);
    setBolNumber(`BOL-${Math.floor(100000 + Math.random() * 900000)}`);
    form.reset();
  };

  const getTotalWeight = () => {
    return Math.round(
      order.items.reduce((acc, item) => acc + item.quantity * 2, 0)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            Bill of Lading for Order #{order.id}
          </DialogTitle>
        </DialogHeader>

        {!bolGenerated ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleGenerateBOL)}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipper Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">
                    Shipper Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="shipperName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipper Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipperAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="shipperCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipperState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipperZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Consignee Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">
                    Consignee Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="consigneeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consignee Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consigneeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="consigneeCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consigneeState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consigneeZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Carrier Information */}
              <div className="space-y-4 pt-2">
                <h3 className="font-medium text-lg border-b pb-2">
                  Carrier & Freight Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="carrierName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carrier Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Expedited">Expedited</SelectItem>
                            <SelectItem value="Same Day">Same Day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="trailerNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trailer Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sealNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seal Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="freightTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Freight Terms</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select freight terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Prepaid">Prepaid</SelectItem>
                            <SelectItem value="Collect">Collect</SelectItem>
                            <SelectItem value="Third Party">
                              Third Party
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Special Instructions & Hazardous Materials */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter any special instructions or notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <h3 className="font-medium mb-2">Cargo Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span>Order Number:</span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span>Total Items:</span>
                      <span className="font-medium">
                        {order.items.length} product types
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span>Total Pieces:</span>
                      <span className="font-medium">
                        {calculateTotalPieces()} units
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span>Estimated Weight:</span>
                      <span className="font-medium">
                        {getTotalWeight()} lbs
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span>NMFC Code:</span>
                      <span className="font-medium">157250</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="pt-4">
                <FormField
                  control={form.control}
                  name="signatureShipper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper Signature</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Type your full name to sign"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Bill of Lading
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <div className="p-6 border rounded-md bg-white space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    BILL OF LADING
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    ORIGINAL - NOT NEGOTIABLE
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-sm text-gray-600">
                      B/L Number: {bolNumber}
                    </p>
                    <p className="text-sm text-gray-600">•</p>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(order.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="border border-dashed border-gray-400 p-2 inline-block">
                    <p className="text-xs text-gray-600">
                      For Carrier Use Only
                    </p>
                    <p className="text-xs">
                      Trailer #: {form.getValues().trailerNumber}
                    </p>
                    <p className="text-xs">
                      Seal #: {form.getValues().sealNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border p-3 rounded-md bg-gray-50">
                  <h3 className="font-medium text-sm mb-2 uppercase text-gray-700">
                    Shipper
                  </h3>
                  <p className="font-medium">{form.getValues().shipperName}</p>
                  <p>{form.getValues().shipperAddress}</p>
                  <p>
                    {form.getValues().shipperCity},{" "}
                    {form.getValues().shipperState}{" "}
                    {form.getValues().shipperZip}
                  </p>
                </div>

                <div className="border p-3 rounded-md bg-gray-50">
                  <h3 className="font-medium text-sm mb-2 uppercase text-gray-700">
                    Consignee
                  </h3>
                  <p className="font-medium">
                    {form.getValues().consigneeName}
                  </p>
                  <p>{form.getValues().consigneeAddress}</p>
                  <p>
                    {form.getValues().consigneeCity},{" "}
                    {form.getValues().consigneeState}{" "}
                    {form.getValues().consigneeZip}
                  </p>
                    {form.getValues().consigneePhone}

                  <p>

                  </p>
                </div>
              </div>

              <div className="border p-3 rounded-md bg-gray-50">
                <h3 className="font-medium text-sm mb-2 uppercase text-gray-700">
                  Carrier Information
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <p>
                      <span className="text-gray-600">Carrier Name:</span>{" "}
                      {form.getValues().carrierName}
                    </p>
                    <p>
                      <span className="text-gray-600">Service Level:</span>{" "}
                      {form.getValues().serviceLevel}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="text-gray-600">Freight Terms:</span>{" "}
                      {form.getValues().freightTerms}
                    </p>
                    <p>
                      <span className="text-gray-600">Order Reference:</span>{" "}
                      {order.id}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2 uppercase text-gray-700">
                  Freight Description
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pieces</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Weight (lbs)</TableHead>
                      <TableHead className="text-right">NMFC</TableHead>
                      <TableHead>Class</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity * 2}
                        </TableCell>
                        <TableCell className="text-right">157250</TableCell>
                        <TableCell>50</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">
                        {calculateTotalPieces()}
                      </TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right font-medium">
                        {getTotalWeight()}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {form.getValues().specialInstructions && (
                <div className="border p-3 rounded-md bg-gray-50">
                  <h3 className="font-medium text-sm mb-1 uppercase text-gray-700">
                    Special Instructions
                  </h3>
                  <p>{form.getValues().specialInstructions}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <h3 className="font-medium text-sm mb-2 uppercase text-gray-700">
                    Shipper Certification
                  </h3>
                  <p className="text-sm">
                    This is to certify that the above named materials are
                    properly classified, described, packaged, marked and
                    labeled, and are in proper condition for transportation
                    according to the applicable regulations.
                  </p>
                  <div className="mt-4">
                    <p className="font-medium">
                      {form.getValues().signatureShipper}
                    </p>
                    <p className="text-xs text-gray-600">Digital Signature</p>
                    <p className="text-xs text-gray-600">
                      Date: {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-2 uppercase text-gray-700">
                    Carrier Certification
                  </h3>
                  <p className="text-sm">
                    Carrier acknowledges receipt of packages and required
                    placards. Carrier certifies emergency response information
                    was made available and/or carrier has the appropriate
                    information and training.
                  </p>
                  <div className="mt-4">
                    <p className="text-sm italic text-gray-500">
                      Awaiting carrier signature
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-green-600 flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  <span className="font-medium">DOCUMENT GENERATED</span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Generated on: {formatDate(new Date().toISOString())}</p>
                  <p>Document ID: {bolNumber}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="flex gap-2 flex-1">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="flex-1"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="flex gap-2 flex-1">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1"
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleNewBOL}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New BOL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BillOfLadingForm;
