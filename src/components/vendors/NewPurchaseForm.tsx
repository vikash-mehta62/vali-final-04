"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Save, Plus, Trash, Package, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/utils/formatters"
import PageHeader from "@/components/shared/PageHeader"
import { getAllProductAPI } from "@/services2/operations/product"
import { getAllVendorsAPI } from "@/services2/operations/vendor"
import { createPurchaseOrderAPI } from "@/services2/operations/purchaseOrder"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import Select2, { GroupBase, Options } from "react-select";

// Mock vendor pricing data
const mockVendorPricing = [
  { vendorId: "v1", productId: "prod1", price: 1.2 }, // Green Valley Farms - Apples
  { vendorId: "v2", productId: "prod1", price: 1.35 }, // Organic Supply - Apples
  { vendorId: "v1", productId: "prod2", price: 1.4 }, // Green Valley Farms - Pears
  { vendorId: "v3", productId: "prod3", price: 1.9 }, // Fresh Produce - Tomatoes
  { vendorId: "v3", productId: "prod5", price: 0.95 }, // Fresh Produce - Bell Peppers
]

interface PurchaseItemForm {
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  lb: number
  totalWeight: number
}

const NewPurchaseForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search)
  const suggestedProductId = queryParams.get("productId")
  const isSuggested = queryParams.get("suggested") === "true"

  // Form state
  const [vendorId, setVendorId] = useState("")
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("")
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0])
  const [deliveryDate, setDeliveryDate] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<PurchaseItemForm[]>([
    { productId: "", quantity: 0, unitPrice: 0, totalPrice: 0, lb: 0, totalWeight: 0 },
  ])

  const [totalAmount, setTotalAmount] = useState(0)
  const [totalUnitType, setTotalUnitType] = useState(0)
  const [suggestedVendors, setSuggestedVendors] = useState<string[]>([])
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const token = useSelector((state: RootState) => state.auth?.token ?? null)

  const fetchProducts = async () => {
    try {
      const response = await getAllProductAPI()
      console.log(response)

      if (response) {
        const updatedProducts = response.map((product) => ({
          ...product,
          id: product._id,
          price: product.pricePerBox,
          lastUpdated: product?.updatedAt,
        }))
        setProducts(updatedProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchVendors = async () => {
    const data = await getAllVendorsAPI()
    console.log(data)

    const formattedData = data.map((vendor) => ({
      ...vendor,
      id: vendor._id,
    }))

    setVendors(formattedData)
  }

  useEffect(() => {
    fetchVendors()
    fetchProducts()
  }, [])

  // Generate PO number when the component mounts
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    setPurchaseOrderNumber(`PO-${currentYear}-${randomNum}`)

    // If there's a suggested product, set it up
    if (isSuggested && suggestedProductId) {
      const product = products.find((p) => p.id === suggestedProductId)
      if (product) {
        const vendorsForProduct = mockVendorPricing
          .filter((vp) => vp.productId === suggestedProductId)
          .map((vp) => vp.vendorId)

        setSuggestedVendors(vendorsForProduct)

        if (vendorsForProduct.length === 1) {
          setVendorId(vendorsForProduct[0])
        }

        const updatedItems = [...items]
        updatedItems[0] = {
          ...updatedItems[0],
          productId: suggestedProductId,
          unitPrice: product.price,
          quantity: 100,
          totalPrice: 100 * product.price,
          totalWeight: 0,
        }

        setItems(updatedItems)
      }
    }
  }, [isSuggested, suggestedProductId])

  // Calculate total amount and weight whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalWeight = items.reduce((sum, item) => sum + item.totalWeight, 0)
    setTotalAmount(total)
    setTotalUnitType(totalWeight)
  }, [items])

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    let price = product.price
    if (vendorId) {
      const vendorPricing = mockVendorPricing.find((vp) => vp.vendorId === vendorId && vp.productId === productId)
      if (vendorPricing) {
        price = vendorPricing.price
      }
    }

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

  const handleVendorChange = (vendorId: string) => {
    setVendorId(vendorId)

    const updatedItems = items.map((item) => {
      if (!item.productId) return item

      const vendorPricing = mockVendorPricing.find((vp) => vp.vendorId === vendorId && vp.productId === item.productId)

      if (vendorPricing) {
        return {
          ...item,
          unitPrice: vendorPricing.price,
          totalPrice: item.quantity * vendorPricing.price,
          totalWeight: item.quantity * item.lb,
        }
      }

      return item
    })

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

    const payload = {
      vendorId,
      purchaseOrderNumber,
      purchaseDate,
      deliveryDate,
      notes,
      items,
      totalAmount,
    }
    await createPurchaseOrderAPI(payload, token)

    navigate("/vendors")
  }

  const getProductUnitType = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.unit : ""
  }
  const productOptions: {
    value: string;
    label: string;
    pricePerBox: number;
    pricePerUnit: number;
    shippinCost: number
  }[] = products.map((product) => ({
    value: product.id,
    label: product.name,
    pricePerBox: Number(product.pricePerBox),
    pricePerUnit: Number(product.price), // Make sure this exists in product
    shippinCost: Number(product.shippinCost || 0), // Make sure this exists in product
  }));
  const isRecommendedVendor = (vendorId: string) => {
    return suggestedVendors.includes(vendorId)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/vendors")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Purchases
      </Button>

      <PageHeader
        title="New Purchase Order"
        description="Create a new purchase order for products from vendors or farmers"
        icon={<Package className="h-5 w-5 text-primary" />}
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
              <div>
  <Label htmlFor="vendor">Vendor</Label>
  <Select2
    options={vendors.map((vendor) => ({
      value: vendor.id,
      label: isRecommendedVendor(vendor.id)
        ? `${vendor.name} (Recommended)`
        : vendor.name,
    }))}
    value={vendors
      .map((vendor) => ({
        value: vendor.id,
        label: isRecommendedVendor(vendor.id)
          ? `${vendor.name} (Recommended)`
          : vendor.name,
      }))
      .find((opt) => opt.value === vendorId)}
    onChange={(selectedOption) => {
      handleVendorChange(selectedOption.value);
    }}
  />
</div>
  <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={vendorId} onValueChange={handleVendorChange}>
                    <SelectTrigger id="vendor">
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem
                          key={vendor.id}
                          value={vendor.id}
                          className={isRecommendedVendor(vendor.id) ? "text-green-600 font-medium" : ""}
                        >
                          {vendor.name}
                          {isRecommendedVendor(vendor.id) && " (Recommended)"}
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
                      <Select2
                        options={productOptions}
                        value={productOptions.find((opt) => opt.value === item.productId)}
                        onChange={(selectedOption) => {
                          // Just send productId like before
                          handleProductChange(index, selectedOption.value);
                        }}
                      />

                    </div>

                    <div className="col-span-1">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="0"
                        step="1"
                        value={item.quantity || ""}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </div>

                    <div className="col-span-1">
                      <Label htmlFor={`lb-${index}`}>{getProductUnitType(item.productId) || "Unit"}</Label>
                      <Input
                        id={`lb-${index}`}
                        type="number"
                        min="0"
                        step="1"
                        value={item.lb || ""}
                        onChange={(e) => handleLbChange(index, Number(e.target.value))}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`unitPrice-${index}`}>Box Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`unitPrice-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-8"
                          value={item.unitPrice || ""}
                          onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Total Weight</div>
                        <span className="font-medium">
                          {item.totalWeight.toFixed(2)} {getProductUnitType(item.productId) || "lbs"}
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
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default NewPurchaseForm
