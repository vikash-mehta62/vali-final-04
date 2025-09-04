"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Plus, Trash, Package, DollarSign, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/utils/formatters"
import { getAllProductAPI } from "@/services2/operations/product"
import { getAllVendorsAPI } from "@/services2/operations/vendor"
import { getSinglePurchaseOrderAPI, updatePurchaseOrderAPI } from "@/services2/operations/purchaseOrder"
import Sidebar from "@/components/layout/Sidebar"

interface PurchaseItemForm {
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  qualityStatus?: string
  lb: number
  totalWeight: number
}

const EditPurchaseOrder = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex  overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 overflow-auto">
        <EditPurchaseOrderForm />
      </div>
    </div>
  )
}

const EditPurchaseOrderForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()

  // Form state
  const [vendorId, setVendorId] = useState("")
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<PurchaseItemForm[]>([
    { productId: "", quantity: 0, unitPrice: 0, totalPrice: 0, lb: 0, totalWeight: 0 },
  ])

  const [totalAmount, setTotalAmount] = useState(0)
  const [totalUnitType, setTotalUnitType] = useState(0)
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch purchase order data
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        setLoading(true)
        const response = await getSinglePurchaseOrderAPI(id)
        console.log(response)

        if (response) {
          setVendorId(response.vendorId?._id || response.vendorId)
          setPurchaseOrderNumber(response.purchaseOrderNumber)
          setPurchaseDate(new Date(response.purchaseDate).toISOString().split("T")[0])
          setDeliveryDate(response.deliveryDate ? new Date(response.deliveryDate).toISOString().split("T")[0] : "")
          setNotes(response.notes || "")

          // Format items with totalWeight calculation
          const formattedItems = response.items.map((item) => ({
            productId: item.productId?._id || item.productId,
            quantity: item.quantity || 0,
            unitPrice: item.unitPrice || 0,
            qualityStatus: item.qualityStatus,
            lb: item.lb || 0,
            totalWeight: (item.quantity || 0) * (item.lb || 0),
            totalPrice: item.totalPrice || (item.quantity || 0) * (item.unitPrice || 0),
          }))

          setItems(formattedItems)
          setTotalAmount(response.totalAmount || 0)
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

  // Fetch products and vendors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, vendorsResponse] = await Promise.all([getAllProductAPI(), getAllVendorsAPI()])

        if (productsResponse) {
          const updatedProducts = productsResponse.map((product) => ({
            ...product,
            id: product._id,
            price: product.pricePerBox,
            lastUpdated: product?.updatedAt,
          }))
          setProducts(updatedProducts)
        }

        if (vendorsResponse) {
          const formattedData = vendorsResponse.map((vendor) => ({
            ...vendor,
            id: vendor._id,
          }))
          setVendors(formattedData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Calculate total amount and weight whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    const totalWeight = items.reduce((sum, item) => sum + (item.totalWeight || 0), 0)
    setTotalAmount(total)
    setTotalUnitType(totalWeight)
  }, [items])

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const price = product.price

    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      productId,
      unitPrice: price,
      totalPrice: updatedItems[index].quantity * price,
      totalWeight: updatedItems[index].quantity * updatedItems[index].lb,
    }

    setItems(updatedItems)
  }

  const handleQuantityChange = (index: number, quantity: string) => {
    const qty = Number.parseFloat(quantity) || 0
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: qty,
      totalPrice: qty * updatedItems[index].unitPrice,
      totalWeight: qty * updatedItems[index].lb,
    }
    setItems(updatedItems)
  }

  const handleUnitPriceChange = (index: number, price: string) => {
    const unitPrice = Number.parseFloat(price) || 0
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      unitPrice,
      totalPrice: updatedItems[index].quantity * unitPrice,
    }

    setItems(updatedItems)
  }

  const handleLbChange = (index: number, lbValue: number) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      lb: lbValue,
      totalWeight: updatedItems[index].quantity * lbValue,
    }
    setItems(updatedItems)
  }

  const addItemRow = () => {
    setItems([...items, { productId: "", quantity: 0, unitPrice: 0, totalPrice: 0, lb: 0, totalWeight: 0 }])
  }

  const removeItemRow = (index: number) => {
    if (items.length === 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove item",
        description: "A purchase order must have at least one item.",
      })
      return
    }

    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!vendorId) {
      toast({
        variant: "destructive",
        title: "Missing vendor",
        description: "Please select a vendor for this purchase.",
      })
      return
    }

    const invalidItems = items.filter((item) => !item.productId || item.quantity <= 0)
    if (invalidItems.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid items",
        description: "Please ensure all items have a product selected and a quantity greater than zero.",
      })
      return
    }

    try {
      setSaving(true)
      const payload = {
        vendorId,
        purchaseOrderNumber,
        purchaseDate,
        deliveryDate,
        notes,
        items,
        totalAmount,
      }

      await updatePurchaseOrderAPI(id, payload)

      toast({
        title: "Purchase order updated",
        description: "The purchase order has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating purchase order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update purchase order. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  const getProductUnitType = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.unit : ""
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

  return (
    <div className="container space-y-6">
      <Button variant="ghost" onClick={() => navigate("/vendors")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Purchases
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Purchase Order</h1>
          <p className="text-muted-foreground">Update purchase order details and items</p>
        </div>
        <Package className="h-5 w-5 text-primary" />
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={vendorId} onValueChange={setVendorId}>
                    <SelectTrigger id="vendor">
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="poNumber">Purchase Order Number</Label>
                  <Input
                    id="poNumber"
                    value={purchaseOrderNumber}
                    onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="purchaseDate"
                      type="date"
                      className="pl-10"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deliveryDate"
                      type="date"
                      className="pl-10"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this purchase order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-[100px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Order Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-4">
                      <Label htmlFor={`product-${index}`}>Product</Label>
                      <Select value={item.productId} onValueChange={(value) => handleProductChange(index, value)}>
                        <SelectTrigger id={`product-${index}`}>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <Label htmlFor={`quantity-${index}`} className="text-sm font-medium">
                        Qty
                      </Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="0"
                        step="1"
                        disabled={item.qualityStatus === "approved"}
                        value={item.quantity || ""}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="h-10 text-sm"
                      />
                      {item.qualityStatus === "approved" && (
                        <p className="text-xs text-red-600 italic">Approved – can't edit</p>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Label htmlFor={`lb-${index}`}>{getProductUnitType(item.productId) || "Unit"}</Label>
                      <Input
                        id={`lb-${index}`}
                        type="number"
                        min="0"
                        step="1"
                        disabled={item.qualityStatus === "approved"}

                        value={item.lb || ""}
                        onChange={(e) => handleLbChange(index, Number(e.target.value))}
                      />
                        {item.qualityStatus === "approved" && (
                        <p className="text-xs text-red-600 italic">Approved – can't edit</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`unitPrice-${index}`}>Box Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`unitPrice-${index}`}
                          type="number"
                          min="0"
                        disabled={item.qualityStatus === "approved"}
                          step="0.01"
                          className="pl-8"
                          value={item.unitPrice || ""}
                          onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(item.totalPrice || 0)}</span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Total Weight</div>
                        <span className="font-medium">
                          {(item.totalWeight || 0).toFixed(2)} {getProductUnitType(item.productId) || "lbs"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeItemRow(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <div className="text-right space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                    <div className="text-lg font-semibold">{totalUnitType.toFixed(2)} lbs</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/vendors")}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Purchase Order
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default EditPurchaseOrder
