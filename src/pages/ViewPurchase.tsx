"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft, Edit, DollarSign, Calendar, Loader2, FileCheck, FileX, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/formatters"
import { useToast } from "@/hooks/use-toast"
import { getSinglePurchaseOrderAPI } from "@/services2/operations/purchaseOrder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"




import Sidebar from '@/components/layout/Sidebar';

const NewPurchase = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen overflow-hidden">
              
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <ViewPurchaseOrder />
      </div>
    </div>
  );
};

export default NewPurchase;



const ViewPurchaseOrder =()=> {
 const navigate = useNavigate();
   const { id } = useParams(); 
  const { toast } = useToast()

  const [purchaseOrder, setPurchaseOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch purchase order data
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        setLoading(true)
        const response = await getSinglePurchaseOrderAPI(id)

        console.log(response)
        if (response) {
          setPurchaseOrder(response)
        }
      } catch (error) {
        console.error("Error fetching purchase order:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load purchase order details.",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPurchaseOrder()
    }
  }, [id, toast])

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: "outline", icon: <Calendar className="h-3 w-3 mr-1" /> },
      received: { variant: "secondary", icon: <ShoppingCart className="h-3 w-3 mr-1" /> },
      "quality-check": { variant: "warning", icon: <Eye className="h-3 w-3 mr-1" /> },
      approved: { variant: "success", icon: <FileCheck className="h-3 w-3 mr-1" /> },
      rejected: { variant: "destructive", icon: <FileX className="h-3 w-3 mr-1" /> },
    }

    const { variant, icon } = variants[status] || variants.pending

    return (
      <Badge variant={variant} className="capitalize flex items-center">
        {icon}
        {(status || "pending").replace("-", " ")}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const variants = {
      paid: { variant: "success", icon: <FileCheck className="h-3 w-3 mr-1" /> },
      pending: { variant: "warning", icon: <DollarSign className="h-3 w-3 mr-1" /> },
      "not-required": { variant: "secondary", icon: <FileX className="h-3 w-3 mr-1" /> },
    }

    const { variant, icon } = variants[status] || variants.pending

    return (
      <Badge variant={variant} className="capitalize flex items-center">
        {icon}
        {(status || "pending").replace("-", " ")}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading purchase order...</p>
        </div>
      </div>
    )
  }

  if (!purchaseOrder) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/vendors")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchases
        </Button>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Purchase order not found</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/vendors")}>
              Return to Purchase Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const vendorName = purchaseOrder.vendorId?.name || "Unknown Vendor"
  const formattedPurchaseDate = new Date(purchaseOrder.purchaseDate).toLocaleDateString()
  const formattedDeliveryDate = purchaseOrder.deliveryDate
    ? new Date(purchaseOrder.deliveryDate).toLocaleDateString()
    : "Not specified"

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/vendors")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Purchases
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Order Details</h1>
          <p className="text-muted-foreground">{purchaseOrder.purchaseOrderNumber}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/vendors/edit-purchase/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                <p>{vendorName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                <p>{formattedPurchaseDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                <p>{formattedDeliveryDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(purchaseOrder.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                <div className="mt-1">{getPaymentStatusBadge(purchaseOrder.paymentStatus)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold">{formatCurrency(purchaseOrder.totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {purchaseOrder.notes || "No notes provided for this purchase order."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>lb</TableHead>
                <TableHead>Total lb</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrder.items.map((item, index) => {
                const productName = item.productId?.name || "Unknown Product"
                const unitType = item.productId?.unit || ""

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{productName}</TableCell>
                    <TableCell>
                      {item.quantity} 
                    </TableCell>
                    <TableCell>
                      {item.lb}
                    </TableCell>
                    <TableCell>
                      {item.totalWeight}
                    </TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.totalPrice || item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(purchaseOrder.totalAmount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
