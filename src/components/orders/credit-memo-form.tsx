"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Receipt, Download, Upload, X, Play, Eye, FileImage, FileVideo, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/data"
import { exportCreditMemoToPDF } from "@/utils/pdf/export-credit-memo-to-pdf"
import { createCreditMemoAPI, updateCreditMemoAPI } from "@/services2/operations/creditMemo"

interface CreditMemoFormProps {
  open: boolean
  onClose: () => void
  order: any
  token: string
  onSuccess?: () => void
  editingMemo?: any // Add editing memo prop
  mode?: "create" | "edit" // Add mode prop
}

interface UploadedFile {
  id: string
  file?: File
  url: string
  type: "image" | "video"
  name: string
  existing?: boolean // Flag for existing files
}

interface CreditMemoItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  reason: string
  uploadedFiles: UploadedFile[]
  notes: string
}

export default function CreditMemoForm({
  open,
  onClose,
  order,
  token,
  onSuccess,
  editingMemo = null,
  mode = "create",
}: CreditMemoFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const [creditMemoData, setCreditMemoData] = useState({
    creditMemoNumber: `CM-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    reason: "",
    notes: "",
    refundMethod: "store_credit",
    totalAmount: 0,
  })

  const [creditItems, setCreditItems] = useState<CreditMemoItem[]>([])
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Initialize form with editing data
  useEffect(() => {
    if (mode === "edit" && editingMemo) {
      setCreditMemoData({
        creditMemoNumber: editingMemo.creditMemoNumber,
        date: editingMemo.date
          ? new Date(editingMemo.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        reason: editingMemo.reason || "",
        notes: editingMemo.notes || "",
        refundMethod: editingMemo.refundMethod || "store_credit",
        totalAmount: editingMemo.totalAmount || 0,
      })

      // Convert existing items to the format expected by the form
      const existingItems: CreditMemoItem[] =
        editingMemo.items?.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          reason: item.reason,
          notes: item.notes || "",
          uploadedFiles:
            item.uploadedFiles?.map((file: any) => ({
              id: file.id || `existing-${Date.now()}-${Math.random()}`,
              url: file.url || file.filePath,
              type: file.type === "image" ? "image" : "video",
              name: file.fileName,
              existing: true,
            })) || [],
        })) || []

      setCreditItems(existingItems)
    } else {
      // Reset form for create mode
      setCreditMemoData({
        creditMemoNumber: `CM-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split("T")[0],
        reason: "",
        notes: "",
        refundMethod: "store_credit",
        totalAmount: 0,
      })
      setCreditItems([])
    }
  }, [mode, editingMemo, open])

  // Add item to credit memo
  const addCreditItem = (item: any) => {
    const existingItem = creditItems.find((ci) => ci.productId === item.product)

    if (existingItem) {
      setCreditItems((prevItems) => {
        const updatedItems = prevItems.map((ci) =>
          ci.productId === item.product
            ? { ...ci, quantity: ci.quantity + 1, total: (ci.quantity + 1) * ci.unitPrice }
            : ci,
        )

        const total = updatedItems.reduce((sum, item) => sum + item.total, 0)
        setCreditMemoData((prev) => ({ ...prev, totalAmount: total }))

        return updatedItems
      })
    } else {
      const newItem: CreditMemoItem = {
        productId: item.product || item.productId,
        productName: item.name || item.productName,
        quantity: 1,
        unitPrice: item.price || item.unitPrice,
        total: item.price || item.unitPrice,
        reason: "defective",
        uploadedFiles: [],
        notes: "",
      }

      setCreditItems((prevItems) => {
        const updatedItems = [...prevItems, newItem]
        const total = updatedItems.reduce((sum, item) => sum + item.total, 0)
        setCreditMemoData((prev) => ({ ...prev, totalAmount: total }))
        return updatedItems
      })
    }
  }

  // Remove item from credit memo
  const removeCreditItem = (productId: string) => {
    const itemToRemove = creditItems.find((item) => item.productId === productId)
    if (itemToRemove) {
      itemToRemove.uploadedFiles.forEach((file) => {
        if (!file.existing && file.url) {
          URL.revokeObjectURL(file.url)
        }
      })
    }

    setCreditItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.productId !== productId)
      const total = updatedItems.reduce((sum, item) => sum + item.total, 0)
      setCreditMemoData((prev) => ({ ...prev, totalAmount: total }))
      return updatedItems
    })
  }

  // Update item quantity
  const updateItemQuantity = (productId: string, quantity: number) => {
    setCreditItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity, total: quantity * item.unitPrice } : item,
      )

      const total = updatedItems.reduce((sum, item) => sum + item.total, 0)
      setCreditMemoData((prev) => ({ ...prev, totalAmount: total }))

      return updatedItems
    })
  }

  // Update item reason
  const updateItemReason = (productId: string, reason: string) => {
    setCreditItems(creditItems.map((item) => (item.productId === productId ? { ...item, reason } : item)))
  }

  // Update item notes
  const updateItemNotes = (productId: string, notes: string) => {
    setCreditItems(creditItems.map((item) => (item.productId === productId ? { ...item, notes } : item)))
  }

  // Handle file upload for specific item
  const handleFileUpload = (productId: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")

      if (!isImage && !isVideo) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only image or video files",
          variant: "destructive",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      const fileUrl = URL.createObjectURL(file)
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        url: fileUrl,
        type: isImage ? "image" : "video",
        name: file.name,
        existing: false,
      }

      newFiles.push(uploadedFile)
    })

    setCreditItems(
      creditItems.map((item) =>
        item.productId === productId ? { ...item, uploadedFiles: [...item.uploadedFiles, ...newFiles] } : item,
      ),
    )

    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully`,
    })
  }

  // Remove uploaded file
  const removeUploadedFile = (productId: string, fileId: string) => {
    setCreditItems(
      creditItems.map((item) => {
        if (item.productId === productId) {
          const fileToRemove = item.uploadedFiles.find((f) => f.id === fileId)
          if (fileToRemove && !fileToRemove.existing && fileToRemove.url) {
            URL.revokeObjectURL(fileToRemove.url)
          }
          return {
            ...item,
            uploadedFiles: item.uploadedFiles.filter((f) => f.id !== fileId),
          }
        }
        return item
      }),
    )
  }

  // Preview file
  const handlePreviewFile = (file: UploadedFile) => {
    setPreviewFile(file)
    setPreviewOpen(true)
  }

  // Check if reason requires file upload
  const reasonRequiresUpload = (reason: string) => {
    return ["damaged", "defective", "quality_issue"].includes(reason)
  }

  // Generate PDF
  const handleGeneratePDF = () => {
    if (creditItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the credit memo",
        variant: "destructive",
      })
      return
    }

    const creditMemoForPDF = {
      ...creditMemoData,
      id: creditMemoData.creditMemoNumber,
      items: creditItems,
      store: order.store,
      billingAddress: order.billingAddress || {},
      shippingAddress: order.shippingAddress || {},
      originalOrderId: order.orderNumber || order.id,
      originalOrderDate: order.date,
    }

    exportCreditMemoToPDF(creditMemoForPDF)
    setPdfGenerated(true)

    toast({
      title: "PDF Generated",
      description: "Credit memo PDF has been downloaded",
    })
  }

  // Submit credit memo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (creditItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the credit memo",
        variant: "destructive",
      })
      return
    }

    // Check if items requiring uploads have files
    const itemsNeedingFiles = creditItems.filter(
      (item) => reasonRequiresUpload(item.reason) && item.uploadedFiles.length === 0,
    )

    if (itemsNeedingFiles.length > 0) {
      toast({
        title: "Missing Files",
        description: `Please upload images/videos for items marked as ${itemsNeedingFiles.map((item) => item.reason).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      // Add credit memo data
      const memoData = {
        ...creditMemoData,
        orderId: order._id,
        orderNumber: order.orderNumber || order.id,
        customerId: order.store?._id,
        customerName: order.store?.storeName,
        status: mode === "edit" ? editingMemo.status : "pending",
        createdAt: mode === "edit" ? editingMemo.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      formData.append("creditMemoData", JSON.stringify(memoData))

      // Add items data and files
      creditItems.forEach((item, itemIndex) => {
        formData.append(
          `items[${itemIndex}]`,
          JSON.stringify({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            reason: item.reason,
            notes: item.notes,
            fileCount: item.uploadedFiles.filter((f) => !f.existing).length,
            existingFiles: item.uploadedFiles
              .filter((f) => f.existing)
              .map((f) => ({
                id: f.id,
                url: f.url,
                type: f.type,
                name: f.name,
              })),
          }),
        )

        // Add only new files for this item
        item.uploadedFiles
          .filter((f) => !f.existing && f.file)
          .forEach((uploadedFile, fileIndex) => {
            formData.append(`item_${itemIndex}_file_${fileIndex}`, uploadedFile.file!)
          })
      })

      let response
      if (mode === "edit") {
        response = await updateCreditMemoAPI(editingMemo._id || editingMemo.id, formData)
      } else {
        response = await createCreditMemoAPI(formData)
      }

      if (!response.ok) {
        throw new Error(`Failed to ${mode} credit memo`)
      }

      toast({
        title: `Credit Memo ${mode === "edit" ? "Updated" : "Created"}`,
        description: `Credit memo ${creditMemoData.creditMemoNumber} has been ${mode === "edit" ? "updated" : "created"} successfully`,
      })

      // Generate PDF automatically after successful creation/update
      const creditMemoForPDF = {
        ...creditMemoData,
        id: creditMemoData.creditMemoNumber,
        items: creditItems,
        store: order.store,
        billingAddress: order.billingAddress || {},
        shippingAddress: order.shippingAddress || {},
        originalOrderId: order.orderNumber || order.id,
        originalOrderDate: order.date,
      }

      exportCreditMemoToPDF(creditMemoForPDF)
      setPdfGenerated(true)

      onSuccess?.()
      onClose()

      // Clean up file URLs
      creditItems.forEach((item) => {
        item.uploadedFiles.forEach((file) => {
          if (!file.existing && file.url) {
            URL.revokeObjectURL(file.url)
          }
        })
      })

      // Reset form only if creating new
      if (mode === "create") {
        setCreditMemoData({
          creditMemoNumber: `CM-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString().split("T")[0],
          reason: "",
          notes: "",
          refundMethod: "store_credit",
          totalAmount: 0,
        })
        setCreditItems([])
      }
    } catch (error) {
    
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {mode === "edit" ? <Edit className="h-5 w-5" /> : <Receipt className="h-5 w-5" />}
              {mode === "edit" ? "Edit" : "Create"} Credit Memo - Order {order?.orderNumber || order?.id}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Credit Memo Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Credit Memo Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditMemoNumber">Credit Memo Number</Label>
                  <Input
                    id="creditMemoNumber"
                    value={creditMemoData.creditMemoNumber}
                    onChange={(e) => setCreditMemoData((prev) => ({ ...prev, creditMemoNumber: e.target.value }))}
                    required
                    disabled={mode === "edit"} // Disable editing memo number
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={creditMemoData.date}
                    onChange={(e) => setCreditMemoData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundMethod">Refund Method</Label>
                  <Select
                    value={creditMemoData.refundMethod}
                    onValueChange={(value) => setCreditMemoData((prev) => ({ ...prev, refundMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select refund method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store_credit">Store Credit</SelectItem>
                      <SelectItem value="cash_refund">Cash Refund</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="original_payment">Original Payment Method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Overall Reason</Label>
                  <Input
                    id="reason"
                    value={creditMemoData.reason}
                    onChange={(e) => setCreditMemoData((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Defective products, Customer complaint"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Items Selection - Only show in create mode */}
            {mode === "create" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Items for Credit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order?.items?.map((item: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.name || item.productName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × {formatCurrency(item.price || item.unitPrice)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addCreditItem(item)}
                              disabled={creditItems.some((ci) => ci.productId === (item.product || item.productId))}
                            >
                              {creditItems.some((ci) => ci.productId === (item.product || item.productId))
                                ? "Added"
                                : "Add"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Credit Items */}
            {creditItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Credit Memo Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {creditItems.map((item, index) => (
                      <div key={item.productId} className="border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div>
                            <Label>Product</Label>
                            <p className="font-medium">{item.productName}</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.productId, Number.parseInt(e.target.value) || 1)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`reason-${index}`}>Reason</Label>
                            <Select
                              value={item.reason}
                              onValueChange={(value) => updateItemReason(item.productId, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="defective">Defective</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="wrong_item">Wrong Item</SelectItem>
                                <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                                <SelectItem value="quality_issue">Quality Issue</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Total</Label>
                              <p className="font-medium">{formatCurrency(item.total)}</p>
                            </div>
                            {mode === "create" && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeCreditItem(item.productId)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Item Notes */}
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${index}`}>Item Notes</Label>
                          <Textarea
                            id={`notes-${index}`}
                            value={item.notes}
                            onChange={(e) => updateItemNotes(item.productId, e.target.value)}
                            placeholder="Add specific notes for this item..."
                            rows={2}
                          />
                        </div>

                        {/* File Upload Section */}
                        {reasonRequiresUpload(item.reason) && (
                          <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">
                                Upload Evidence ({item.reason === "damaged" ? "Damage" : "Issue"} Photos/Videos)
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current[item.productId]?.click()}
                                className="flex items-center gap-2"
                              >
                                <Upload size={16} />
                                Upload Files
                              </Button>
                            </div>

                            <input
                              ref={(el) => (fileInputRefs.current[item.productId] = el)}
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={(e) => handleFileUpload(item.productId, e.target.files)}
                              className="hidden"
                            />

                            {/* Display uploaded files */}
                            {item.uploadedFiles.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {item.uploadedFiles.map((file) => (
                                  <div key={file.id} className="relative border rounded-lg p-2">
                                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                                      {file.type === "image" ? (
                                        <img
                                          src={file.url || "/placeholder.svg"}
                                          alt={file.name}
                                          className="w-full h-full object-cover cursor-pointer"
                                          onClick={() => handlePreviewFile(file)}
                                        />
                                      ) : (
                                        <div
                                          className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer"
                                          onClick={() => handlePreviewFile(file)}
                                        >
                                          <FileVideo size={32} className="text-gray-500" />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        {file.type === "image" ? <FileImage size={14} /> : <FileVideo size={14} />}
                                        <span className="text-xs truncate max-w-[80px]" title={file.name}>
                                          {file.name}
                                        </span>
                                        {file.existing && (
                                          <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
                                            existing
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handlePreviewFile(file)}
                                          className="h-6 w-6 p-0"
                                        >
                                          {file.type === "image" ? <Eye size={12} /> : <Play size={12} />}
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeUploadedFile(item.productId, file.id)}
                                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 size={12} />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                              Upload images or videos showing the {item.reason}. Max file size: 10MB each.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        Total Credit Amount: {formatCurrency(creditMemoData.totalAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={creditMemoData.notes}
                  onChange={(e) => setCreditMemoData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes or comments about this credit memo..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePDF}
                disabled={creditItems.length === 0}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </Button>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || creditItems.length === 0}>
                  {loading
                    ? `${mode === "edit" ? "Updating" : "Creating"}...`
                    : `${mode === "edit" ? "Update" : "Create"} Credit Memo`}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Preview: {previewFile?.name}</span>
              <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
                <X size={16} />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center p-4">
            {previewFile?.type === "image" ? (
              <img
                src={previewFile.url || "/placeholder.svg"}
                alt={previewFile.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : previewFile?.type === "video" ? (
              <video src={previewFile.url} controls className="max-w-full max-h-[70vh]">
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
