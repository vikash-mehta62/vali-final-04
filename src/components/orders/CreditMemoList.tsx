"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Receipt,
  Eye,
  Download,
  Calendar,
  DollarSign,
  Package,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Plus,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/data"
import { getCreditMemosByOrderId } from "@/services2/operations/creditMemo"
import { useToast } from "@/hooks/use-toast"
import { exportCreditMemoToPDF } from "@/utils/pdf/export-credit-memo-to-pdf"
import CreditMemoForm from "./credit-memo-form"

interface CreditMemo {
  id?: string
  _id?: string
  creditMemoNumber: string
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  date: string
  totalAmount: number
  status: "pending" | "approved" | "processed" | "cancelled"
  refundMethod: string
  reason: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
    reason: string
    uploadedFiles?: Array<{
      fileName: string
      filePath: string
      fileType: string
    }>
  }>
  createdAt: string
  updatedAt: string
}

interface CreditMemoListProps {
  open: boolean
  onClose: () => void
  order: any
  token: string
}

export default function CreditMemoList({ open, onClose, order, token }: CreditMemoListProps) {
  const { toast } = useToast()
  const [creditMemos, setCreditMemos] = useState<CreditMemo[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMemo, setSelectedMemo] = useState<CreditMemo | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<CreditMemo | null>(null)
  const [editFormOpen, setEditFormOpen] = useState(false)
  const [createFormOpen, setCreateFormOpen] = useState(false)

  // Fetch credit memos when dialog opens
  useEffect(() => {
    if (open && order) {
      fetchCreditMemos()
    }
  }, [open, order])

  const fetchCreditMemos = async () => {
    setLoading(true)
    try {
      const memos = await getCreditMemosByOrderId(order._id || order.id, token)
      console.log(memos)
      setCreditMemos(memos)
    } catch (error) {
      console.error("Error fetching credit memos:", error)
      toast({
        title: "Error",
        description: "Failed to fetch credit memos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "processed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleViewDetails = (memo: CreditMemo) => {
    setSelectedMemo(memo)
    setDetailsOpen(true)
  }

  const handleEditMemo = (memo: CreditMemo) => {
    setEditingMemo(memo)
    setEditFormOpen(true)
  }

  const handleCreateNew = () => {
    setCreateFormOpen(true)
  }

  const handleDownloadPDF = (memo: CreditMemo) => {
    const creditMemoForPDF = {
      ...memo,
      store: order.store,
      billingAddress: order.billingAddress || {},
      shippingAddress: order.shippingAddress || {},
      originalOrderId: order.orderNumber || order.id,
      originalOrderDate: order.date,
    }

    exportCreditMemoToPDF(creditMemoForPDF)

    toast({
      title: "PDF Downloaded",
      description: `Credit memo ${memo.creditMemoNumber} PDF has been downloaded`,
    })
  }

  const handleFormSuccess = () => {
    fetchCreditMemos() // Refresh the list
    toast({
      title: "Success",
      description: "Credit memo updated successfully",
    })
  }

  const totalCreditAmount = creditMemos.reduce((sum, memo) => sum + memo.totalAmount, 0)

  // If no credit memos exist, show create form directly
  if (!loading && creditMemos.length === 0 && open) {
    return (
      <CreditMemoForm
        open={open}
        onClose={onClose}
        order={order}
        token={token}
        onSuccess={() => {
          fetchCreditMemos()
          toast({
            title: "Success",
            description: "Credit memo created successfully",
          })
        }}
        mode="create"
      />
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Credit Memos for Order {order?.orderNumber || order?.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Credit Memo Summary
                  </div>
                  <Button onClick={handleCreateNew} size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{creditMemos.length}</p>
                    <p className="text-sm text-muted-foreground">Total Credit Memos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCreditAmount)}</p>
                    <p className="text-sm text-muted-foreground">Total Credit Amount</p>
                  </div>
                  {/* <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {creditMemos.filter((m) => m.status === "pending").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending Approval</p>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Credit Memos List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading credit memos...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {creditMemos.map((memo) => (
                  <Card key={memo.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{memo.creditMemoNumber}</h3>
                            {/* <Badge className={`flex items-center gap-1 ${getStatusColor(memo.status)}`}>
                              {getStatusIcon(memo.status)}
                              {memo.status.charAt(0).toUpperCase() + memo.status.slice(1)}
                            </Badge> */}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Created: {formatDate(memo.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{formatCurrency(memo.totalAmount)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {memo.items.length} item{memo.items.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          {memo.reason && (
                            <div className="text-sm">
                              <span className="font-medium">Reason: </span>
                              <span className="text-muted-foreground">{memo.reason}</span>
                            </div>
                          )}

                          <div className="text-sm">
                            <span className="font-medium">Refund Method: </span>
                            <span className="text-muted-foreground">
                              {memo.refundMethod.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMemo(memo)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(memo)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPDF(memo)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Memo Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Credit Memo Details - {selectedMemo?.creditMemoNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedMemo && (
            <div className="space-y-6">
              {/* Header Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Memo Number</p>
                      <p className="font-semibold">{selectedMemo.creditMemoNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{formatDate(selectedMemo.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(selectedMemo.status)}`}>
                        {getStatusIcon(selectedMemo.status)}
                        {selectedMemo.status.charAt(0).toUpperCase() + selectedMemo.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-lg">{formatCurrency(selectedMemo.totalAmount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Credit Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedMemo.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.productName}</h4>
                          <span className="font-semibold">{formatCurrency(item.total)}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>Price: {formatCurrency(item.unitPrice)}</span>
                          <span>Reason: {item.reason.replace("_", " ")}</span>
                        </div>
                        {item.uploadedFiles && item.uploadedFiles.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Evidence Files:</p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {item.uploadedFiles.map((file, fileIndex) => (
                                <Badge key={fileIndex} variant="outline" className="text-xs">
                                  {file.type === "image" ? "📷" : "🎥"}{" "}
                                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">
                                    {file.url.split("/").pop()}
                                  </a>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(selectedMemo)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDetailsOpen(false)
                      handleEditMemo(selectedMemo)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Credit Memo Form */}
      {editingMemo && (
        <CreditMemoForm
          open={editFormOpen}
          onClose={() => {
            setEditFormOpen(false)
            setEditingMemo(null)
          }}
          order={order}
          token={token}
          onSuccess={handleFormSuccess}
          editingMemo={editingMemo}
          mode="edit"
        />
      )}

      {/* Create New Credit Memo Form */}
      <CreditMemoForm
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        order={order}
        token={token}
        onSuccess={() => {
          fetchCreditMemos()
          toast({
            title: "Success",
            description: "Credit memo created successfully",
          })
        }}
        mode="create"
      />
    </>
  )
}
