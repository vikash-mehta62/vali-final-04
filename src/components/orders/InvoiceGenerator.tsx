import React, { useState } from "react";
import { Order, formatCurrency, formatDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Printer,
  Download,
  Mail,
  Copy,
  Share2,
  CalendarClock,
  BadgeCheck,
  Settings2,
  ChevronDown,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { exportInvoiceToPDF } from "@/utils/pdf";
import { Badge } from "../ui/badge";
// import { CreditCard, Cash } from 'lucide-react';  // Import icons from lucide-react
import {updateOrderShippingAPI,senInvoiceAPI} from "@/services2/operations/order"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface InvoiceGeneratorProps {
  orderSingle: Order;
  open: boolean;
  onClose: () => void;
  fetchOrders: () => void;
  onViewClientProfile?: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  orderSingle,
  open,
  onClose,
  fetchOrders,
  onViewClientProfile,
}) => {
  const { toast } = useToast();
  const [invoiceOptions, setInvoiceOptions] = useState({
    includeHeader: true,
    includeCompanyDetails: true,
    includePaymentTerms: true,
    includeLogo: true,
    includeSignature: false,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
    invoiceTemplate: "standard",
  });
  const [showOptions, setShowOptions] = useState(false);
  const [order, setOrder] = useState(orderSingle);
  const [showShipping, setShowShipping] = useState(true);
  const [shippingCost, setShippingCost] = useState(order.shippinCost || 0);
  const [plateCount, setPlateCount] = useState('');
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  


  const handlePrint = () => {
    window.print();
    toast({
      title: "Print requested",
      description: "The invoice has been sent to your printer.",
    });
  };

  const updateShipping = async (cost: number, plates: number) => {
    console.log("Shipping cost:", cost);
    console.log("Plate count:", plates);

    // Prepare the form object with required data
    const form = {
        orderId: order._id,  // Assuming 'order' is available in this context
        newShippingCost: cost,
        plateCount: plates,
    };

    // Assuming 'token' is available in the current scope, you can replace 'yourToken' with the actual token value
 
    // Call the update API with form data
    const response = await updateOrderShippingAPI(form, token);

    if (response) {
        console.log("Shipping updated successfully:", response);

        // Assuming the response contains the 'orderNumber' and whole order data
        const updatedOrder = response; // This assumes the full order data is returned in response

        // Now, only update the order ID with the 'orderNumber' from the response
        if (updatedOrder?.orderNumber) {
            setOrder(prevOrder => ({
                ...updatedOrder,  // Update the order with the new response data
                id: updatedOrder.orderNumber,  // Replace the id with orderNumber
                date: updatedOrder.createdAt,  // Replace the id with orderNumber
            }));
            setShowShipping(false)
          
        }

        // Optionally, you can perform additional actions here with the updated order
    } else {
        console.log("Failed to update shipping");
    }
};

  
 
  const handleDownload = () => {
    console.log(order)
    exportInvoiceToPDF({
      id: order.orderNumber as any,
      clientId: (order.store as any)._id,
      clientName: (order.store as any).storeName,
      shippinCost: order.shippinCost || 0,
      date: order.date,
      shippingAddress: order?.shippingAddress,
      billingAddress: order?.billingAddress,
      status: order.status,
      items: order.items,
      total: order.total,
      paymentStatus: order.paymentStatus || "pending",
      subtotal: order.total,
      store: order.store,
      paymentDetails:order.paymentDetails || {}
    });

    toast({
      title: "Download initiated",
      description: "The invoice is being downloaded as a PDF.",
    });
    // In a real app, this would generate and download a PDF
  };

  const handleEmail = async() => {
    await senInvoiceAPI(order._id,token)
    // toast({
    //   title: "Email sent",
    //   description: `Invoice has been emailed to the client.`,
    // });
    // In a real app, this would send an email with the invoice
  };

  const handleCopyLink = () => {
    toast({
      title: "Link copied",
      description: "Invoice link has been copied to clipboard.",
    });
    // In a real app, this would copy a link to the clipboard
  };

  const handleShare = () => {
    toast({
      title: "Share options opened",
      description: "Choose how you want to share this invoice.",
    });
    // In a real app, this would open sharing options
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionChange = (key: keyof typeof invoiceOptions, value: any) => {
    setInvoiceOptions({
      ...invoiceOptions,
      [key]: value,
    });
  };


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <CreditCard size={16} className="text-green-500" />;
      case 'pending':
        return <DollarSign size={16} className="text-yellow-500" />;
      default:
        return <CreditCard size={16} className="text-gray-500" />;
    }
  };

  const getTotalWithTax = () => {
    // Calculate tax (for demonstration, using 8.5% tax rate)
    const taxRate = 0;
    const taxAmount = invoiceOptions.includePaymentTerms
      ? order.total * taxRate
      : 0;
    return order.total + taxAmount;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Invoice #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleOptions}
            className="flex items-center gap-1"
          >
            <Settings2 className="h-4 w-4" />
            Options
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {showOptions && (
          <div className="mb-6 p-4 border rounded-md bg-muted/20">
            <h3 className="font-medium mb-3">Invoice Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeHeader">Include Header</Label>
                  <Switch
                    id="includeHeader"
                    checked={invoiceOptions.includeHeader}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeHeader", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeCompanyDetails">Company Details</Label>
                  <Switch
                    id="includeCompanyDetails"
                    checked={invoiceOptions.includeCompanyDetails}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeCompanyDetails", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includePaymentTerms">
                    Include Tax & Terms
                  </Label>
                  <Switch
                    id="includePaymentTerms"
                    checked={invoiceOptions.includePaymentTerms}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includePaymentTerms", checked)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeLogo">Include Logo</Label>
                  <Switch
                    id="includeLogo"
                    checked={invoiceOptions.includeLogo}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeLogo", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeSignature">Include Signature</Label>
                  <Switch
                    id="includeSignature"
                    checked={invoiceOptions.includeSignature}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeSignature", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceOptions.dueDate}
                    onChange={(e) =>
                      handleOptionChange("dueDate", e.target.value)
                    }
                    className="w-36"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="invoiceTemplate" className="mb-2 block">
                  Template Style
                </Label>
                <Select
                  value={invoiceOptions.invoiceTemplate}
                  onValueChange={(value) =>
                    handleOptionChange("invoiceTemplate", value)
                  }
                >
                  <SelectTrigger id="invoiceTemplate">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}


{showShipping && (
  <div className="p-4 bg-gray-100 rounded-lg space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
      <input
        type="number"
        value={shippingCost}
        onChange={(e) => setShippingCost(e.target.value)}
        placeholder="Enter shipping cost"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">How Much Pallet</label>
      <input
        type="number"
        value={plateCount}
        onChange={(e) => setPlateCount(e.target.value)}
        placeholder="Enter plate count"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <button
      onClick={() => updateShipping(shippingCost, plateCount)}
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      Submit
    </button>
  </div>
)}



      { !showShipping && <div
          className={`invoice-container p-6 border rounded-md bg-white ${
            invoiceOptions.invoiceTemplate === "minimal"
              ? "font-sans"
              : invoiceOptions.invoiceTemplate === "professional"
              ? "font-serif"
              : ""
          }`}
        >
          {invoiceOptions.includeHeader && (
            <div className="flex justify-between mb-8">
              <div>
                <h2
                  className={`text-2xl font-bold text-gray-800 ${
                    invoiceOptions.invoiceTemplate === "professional"
                      ? "text-primary"
                      : ""
                  }`}
                >
                  INVOICE
                </h2>
                <p className="text-sm text-gray-600">Invoice #{order.id}</p>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(order.date)}
                </p>
                {/* {invoiceOptions.includePaymentTerms && (
                  <p className="text-sm text-gray-600">Due Date: {formatDate(invoiceOptions.dueDate)}</p>
                )} */}
              </div>
              {invoiceOptions.includeCompanyDetails && (
                <div className="text-right">
                  {invoiceOptions.includeLogo && (
                    <div
                      className={`${
                        invoiceOptions.invoiceTemplate === "professional"
                          ? "bg-primary/10 p-2 rounded"
                          : ""
                      } mb-2`}
                    >
                      <h3 className="text-xl font-bold text-primary">
                        Vali Produce
                      </h3>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">4300 Pleasantdale Rd,</p>
                  <p className="text-sm text-gray-600">Atlanta, GA 30340, USA,</p>
                  <p className="text-sm text-gray-600">
                    order@valiproduce.shop
                  </p>
                </div>
              )}
            </div>
          )}

          <div
            className={`mb-8 flex justify-between gap-4 ${
              invoiceOptions.invoiceTemplate === "professional"
                ? "bg-primary/5 p-4 rounded-md"
                : ""
            }`}
          >
            {/* Sold To Section */}
            <div className="w-1/2">
              <h4 className="text-gray-600 font-medium mb-2">Sold To:</h4>
              <p className="font-medium">
                {order?.billingAddress?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {order?.billingAddress?.address || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {order?.billingAddress?.city || ""},{" "}
                {order?.billingAddress?.state || ""}{" "}
                {order?.billingAddress?.postalCode || ""}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {order?.billingAddress?.phone || "N/A"}
              </p>
            </div>

            {/* Ship To Section */}
            <div className="w-1/2">
              <h4 className="text-gray-600 font-medium mb-2">Ship To:</h4>
              <p className="font-medium">
                {order?.shippingAddress?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.address || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.city || ""},{" "}
                {order?.shippingAddress?.state || ""}{" "}
                {order?.shippingAddress?.postalCode || ""}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {order?.shippingAddress?.phone || "N/A"}
              </p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr
                className={`border-b ${
                  invoiceOptions.invoiceTemplate === "professional"
                    ? "bg-primary/10 text-primary"
                    : "border-gray-300"
                }`}
              >
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Quantity</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 &&
                    invoiceOptions.invoiceTemplate === "detailed"
                      ? "bg-muted/20"
                      : "border-gray-200"
                  }`}
                >
                  <td className="py-3">{item.productName || item.name}</td>
                  <td className="text-right py-3">
                    {" "}
                    {item.quantity}
                    {item.pricingType && item.pricingType !== "box"
  ? " " + (item.pricingType === "unit" ? "LB" : item.pricingType)
  : ""}

                  </td>
                  <td className="text-right py-3">
                    {formatCurrency(item.unitPrice || item.price)}
                  </td>
                  <td className="text-right py-3">
                    {formatCurrency(
                      item.quantity * (item.unitPrice || item.price)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div
              className={`w-64 ${
                invoiceOptions.invoiceTemplate === "professional"
                  ? "border p-4 rounded-md shadow-sm"
                  : ""
              }`}
            >
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>
                  {formatCurrency(order.total - (order.shippinCost || 0))}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Shipping Cost:</span>
                <span>{formatCurrency(order.shippinCost || 0)}</span>
              </div>
             

    

    

              {/* {invoiceOptions.includePaymentTerms && (
                <div className="flex justify-between py-2">
                  <span className="font-medium">Tax (8.5%):</span>
                  <span>{formatCurrency(order.total * 0.085)}</span>
                </div>
              )} */}
              <div className="flex justify-between py-2 border-t border-gray-300">
                <span className="font-bold">Total:</span>
                <span className="font-bold">
                  {formatCurrency(getTotalWithTax())}
                </span>
              </div>
           
           
              {/* <div className="flex items-center gap-3 mt-2 sm:mt-0">
  <Badge className={getStatusColor(order.status)}>
    <div className="flex items-center">
      {getPaymentIcon(order.paymentStatus || "pending")}
      <span className="capitalize">{order.paymentStatus || "pending"}</span>
    </div>
  </Badge>

  {order.paymentStatus === "paid" && (
    <div className="flex items-center">
      <span className="font-semibold ml-2">Payment Method: </span>
      <span className="capitalize">{order.paymentDetails?.method}</span>

      {order.paymentDetails?.method === "cash" && order.paymentDetails?.notes && (
        <span className="text-sm text-gray-600 ml-2">Notes: {order.paymentDetails.notes}</span>
      )}
      {order.paymentDetails?.method === "creditcard" && order.paymentDetails?.transactionId && (
        <span className="text-sm text-gray-600 ml-2">Transaction ID: {order.paymentDetails.transactionId}</span>
      )}
    </div>
  )}
</div> */}
            </div>
          </div>


      
          {invoiceOptions.includePaymentTerms && (
            <div className="mt-8 pt-8 border-t border-gray-300 text-center text-gray-600 text-sm">
              <p className="mb-2">Thank you for your business!</p>

              {invoiceOptions.invoiceTemplate === "detailed" && (
                <div className="flex items-center justify-center mt-2 text-primary">
                  <BadgeCheck className="h-4 w-4 mr-1" />
                  <span>Approved and Ready for Payment</span>
                </div>
              )}
            </div>
          )}

          {invoiceOptions.includeSignature && (
            <div className="mt-8 pt-4 border-t border-gray-300">
              <div className="flex justify-end">
                <div className="w-64 text-center">
                  <div className="border-b border-dashed mb-2 pb-4">
                    <p className="text-gray-400 italic">Digital Signature</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Authorized Representative
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>}

     { !showShipping &&  <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="flex gap-2 flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Schedule Invoice</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="scheduleDate">Date</Label>
                    <Input id="scheduleDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scheduleTime">Time</Label>
                    <Input id="scheduleTime" type="time" />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Invoice Scheduled",
                        description:
                          "The invoice has been scheduled for delivery.",
                      });
                    }}
                  >
                    Confirm Schedule
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>

          <div className="flex gap-2 flex-1">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
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

            <Button onClick={handleEmail} className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>

            <Button
              variant="secondary"
              onClick={handleShare}
              className="flex-none"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceGenerator;
