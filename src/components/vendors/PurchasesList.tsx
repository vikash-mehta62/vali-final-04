"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Eye,
  FileCheck,
  FileX,
  Calendar,
  ShoppingCart,
  FileUp,
  DollarSign,
  ShoppingBag,
  BarChart,
  RefreshCw,
  MoreVertical,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/utils/formatters"
import { getAllPurchaseOrdersAPI,deletePurchaseOrderAPI } from "@/services2/operations/purchaseOrder"
import { PaymentStatusPopup } from "../orders/PaymentUpdateModel"
import { Progress } from "@radix-ui/react-progress"
import DateFilterDialog from "../orders/DateFilterPopup"
import { useToast } from "@/hooks/use-toast"

const PurchasesList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showReorderSuggestions, setShowReorderSuggestions] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const { toast } = useToast()

  // PAYMENT MODEL
  const [open, setOpen] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [paymentOrder, setpaymentOrder] = useState<any>(null)
  const [orderIdDB, setOrderIdDB] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)

  //STAtus
  const [summary, setSummary] = useState(null)
  // REFETCH
  const [startDate, setStartDate] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalOrders, setTotalOrders] = useState(0)

  //DETAILS
  const [selectedUserData, setSelectedUserData] = useState(null)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)

  const fetchPurchase = async () => {
    try {
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", pageSize.toString())
      params.append("paymentStatus", paymentFilter.toString())

      if (debouncedSearchQuery) {
        params.append("search", debouncedSearchQuery)
      }
      if (startDate) {
        params.append("startDate", startDate)
      }
      if (endDate) {
        params.append("endDate", endDate)
      }

      const res = await getAllPurchaseOrdersAPI(params.toString())
      console.log(res)
      if (res.orders) {
        const transformed = res.orders.map((order) => ({
          ...order,
          id: order._id,
          vendorName: order.vendorId?.name || "",
          vendorId: order.vendorId?._id || "",
        }))
        setPurchaseOrders(transformed)
        setSummary(res.summary)
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error)
    }
  }

  useEffect(() => {
    fetchPurchase()
  }, [currentPage, pageSize, debouncedSearchQuery, paymentFilter, endDate, startDate])

  // Filter purchases based on search term and status
  const filteredPurchases = purchaseOrders.filter((purchase) => {
    const matchesSearch =
      purchase.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.purchaseOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter

    return matchesSearch && matchesStatus
  })

  console.log(filteredPurchases)
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

  const handleUploadInvoice = (purchaseId) => {
    // In a real app, this would open a file upload dialog
    console.log(`Upload invoice for purchase ${purchaseId}`)
    // Mock updating the invoice status
    const purchaseIndex = purchaseOrders.findIndex((p) => p.id === purchaseId)
    if (purchaseIndex !== -1) {
      purchaseOrders[purchaseIndex].invoiceUploaded = true
      // Force a re-render
      setSearchTerm(searchTerm)
    }
  }

  const handleCreateReorder = (product) => {
    navigate(`/vendors/new-purchase?productId=${product.id}&suggested=true`)
  }

  const receivedPercentage =
    summary && summary.totalAmount > 0 ? Math.round((summary.totalPaid / summary.totalAmount) * 100) : 0

  const handleResetDates = () => {
    setStartDate("")
    setEndDate("")
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Purchase Orders</CardTitle>
          <CardDescription>Track and manage purchases from vendors</CardDescription>
          {/* <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchases..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="quality-check">Quality Check</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
          </div> */}

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="pending">Unpaid</option>
              </select>
              {/* Custom Date Range Filters */}
              <DateFilterDialog
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleResetDates={handleResetDates}
              />

              <Button size="sm" variant="outline" className="h-10" onClick={fetchPurchase} disabled={loading}>
                {loading ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <RefreshCw size={16} className="mr-2" />
                )}
                Refresh
              </Button>
            </div>
            <Button onClick={() => navigate("/vendors/new-purchase")} className="shrink-0">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Purchase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(summary?.totalOrders ?? 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time orders</p>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {(summary?.totalAmount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">All time sales</p>
              </CardContent>
            </Card>

            {/* Received Amount */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendor Received Amount </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {(summary?.totalPaid ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{receivedPercentage}% of total</span>
                    <span className="text-muted-foreground">
                      $
                      {(summary?.totalPending ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      pending
                    </span>
                  </div>
                  <Progress value={receivedPercentage} className="h-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase Order</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Payment</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No purchases found. Try adjusting your filters or create a new purchase order.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.purchaseOrderNumber}</TableCell>
                    <TableCell
                    // onClick={() => fetchUserDetailsOrder(group?.id || group?._id)}
                    >
                      {purchase.vendor.name || purchase.vendor.contactName}
                    </TableCell>
                    <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
                    {/* <TableCell>
                      {getStatusBadge(purchase.status)}
                    </TableCell> */}
                    <TableCell>
                      {getPaymentStatusBadge(purchase.paymentStatus)}
                      <button
                        onClick={() => {
                          setOrderId(purchase.purchaseOrderNumber)
                          setOpen(true)
                          setTotalAmount(purchase.totalAmount)
                          setOrderIdDB(purchase?._id || purchase?.id)
                          setpaymentOrder(purchase)
                        }}
                        className="mt-1 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        {purchase.paymentStatus === "pending" ? "Pay Now" : "Edit"}
                      </button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/vendors/purchase/${purchase.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Purchase
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/vendors/edit-purchase/${purchase.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Purchase
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async() => await deletePurchaseOrderAPI(purchase.id) }>
                            <Edit className="mr-2 h-4 w-4" />
                            Delete Purchase
                          </DropdownMenuItem>

                          {purchase.status === "quality-check" && (
                            <DropdownMenuItem onClick={() => navigate(`/vendors/quality-control/${purchase.id}`)}>
                              <FileCheck className="mr-2 h-4 w-4 text-green-600" />
                              Quality Check
                            </DropdownMenuItem>
                          )}

                          {(purchase.status === "approved" || purchase.status === "received") &&
                            !purchase.invoiceUploaded && (
                              <DropdownMenuItem onClick={() => handleUploadInvoice(purchase.id)}>
                                <FileUp className="mr-2 h-4 w-4 text-blue-600" />
                                Upload Invoice
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentStatusPopup
        open={open}
        onOpenChange={setOpen}
        orderId={orderId}
        totalAmount={totalAmount}
        id={orderIdDB}
        fetchOrders={fetchPurchase}
        onPayment={() => console.log("ONPAYMENT")}
        paymentOrder={paymentOrder}
        purchase={true}
      />
    </div>
  )
}

export default PurchasesList
