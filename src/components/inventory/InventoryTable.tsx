"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteProductAPI } from "@/services2/operations/product"
import {
  ChevronDown,
  ChevronUp,
  Trash,
  FileEdit,
  MoreHorizontal,
  Package,
  ShoppingCart,
  TrendingUp,
  Archive,
  BarChart3,
  Box,
  ImageIcon,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { isAfter, isBefore, addDays } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import AddProductForm from "./AddProductForm"
import { 
  getSingleProductOrderAPI,
  trashProductQuanityAPI,
  refreshSingleProductAPI,
  addQuantityProductAPI
 } from "@/services2/operations/product"
import Swal from "sweetalert2"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify';

interface Product {
  id: string
  _id?: string
  name: string
  category: string
  quantity: number
  totalSell?: number
  totalPurchase?: number
  unit: string
  price: number
  threshold?: number
  lastUpdated: string
  description?: string
  image?: string
  summary?: {
    totalRemaining?: number
    totalPurchase?: number
    totalSell?: number
    unitPurchase?: number
    unitRemaining?: number
    unitSell?: number
  }
  weightVariation?: number
  expiryDate?: string
  batchInfo?: string
  origin?: string
  organic?: boolean
  storageInstructions?: string
  boxSize?: number
  shippinCost?: number
  pricePerBox?: number
  featuredOffer?: boolean
  popularityRank?: number
  estimatedProfit?: number
  recommendedOrder?: number
  enablePromotions?: boolean
  palette?: string
}

interface InventoryTableProps {
  products: Product[]
  onProductsSelect: (ids: string[]) => void
  selectedProducts: string[]
  onReorderProduct: (product: Product) => void
  fetchProducts: () => void
  endDate?:string
  startDate?:string
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  onProductsSelect,
  selectedProducts,
  onReorderProduct,
  fetchProducts,
  startDate,endDate
}) => {
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editProduct, setEditProduct] = useState(null)
  const [isEditProduct, setIsEditProduct] = useState(false)
  const [orderDetails, setOrderDetails] = useState(false)
  const [productOrderData, setProductOrderData] = useState(null)

  // New state for summary popup
  const [summaryPopup, setSummaryPopup] = useState(false)
  const [summaryData, setSummaryData] = useState<{
    type: "purchased" | "sell" | "remaining"
    product: Product
  } | null>(null)

const [trashForm, setTrashForm] = useState({
  quantity: "",
  type: "box",
  reason: ""
})
const [addQuaForm, setAddQuaForm] = useState({
  quantity: "",
  type: "box",
  reason: ""
})
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField as keyof Product]
    let bValue = b[sortField as keyof Product]

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue === bValue) return 0

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      onProductsSelect([])
    } else {
      onProductsSelect(products.map((p) => p.id))
    }
  }

  const handleSelectProduct = (id: string) => {
    const isSelected = selectedProducts.includes(id)
    if (isSelected) {
      onProductsSelect(selectedProducts.filter((p) => p !== id))
    } else {
      onProductsSelect([...selectedProducts, id])
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  // Check if a product is nearing expiry (within 7 days)
  const isNearingExpiry = (product: Product) => {
    if (!product.expiryDate) return false
    const today = new Date()
    const expiryDate = new Date(product.expiryDate)
    const warningDate = addDays(today, 7) // 7 days from now
    return isBefore(expiryDate, warningDate) && isAfter(expiryDate, today)
  }

  const handleDelete = async (id) => {
    await deleteProductAPI(id)
    fetchProducts()
  }

  // Check if a product is expired
  const isExpired = (product: Product) => {
    if (!product.expiryDate) return false
    const today = new Date()
    const expiryDate = new Date(product.expiryDate)
    return isBefore(expiryDate, today)
  }

 const fetchProductOrder = async (id: string, ) => {
  const response = await getSingleProductOrderAPI(id, startDate, endDate);
  if (!response) return;

  console.log("Fetched Order Data:", response);
  setProductOrderData(response);
  setOrderDetails(true);
};


  // Handle summary popup
  const handleSummaryClick = (type: "purchased" | "sell" | "remaining", product: Product) => {
    setSummaryData({ type, product })
    setSummaryPopup(true)
  }

  // Get summary popup content
  const getSummaryContent = () => {
    if (!summaryData) return null

    const { type, product } = summaryData
    const summary = product.summary || {}

    switch (type) {
      case "purchased":
        return {
          title: "Purchased Details",
          icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
          total: summary.totalPurchase || 0,
          unit: summary.unitPurchase || 0,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        }
      case "sell":
        return {
          title: "Sell Details",
          icon: <TrendingUp className="h-6 w-6 text-green-600" />,
          total: summary.totalSell || 0,
          unit: summary.unitSell || 0,
          color: "text-green-600",
          bgColor: "bg-green-50",
        }
      case "remaining":
        return {
          title: "Remaining Details",
          icon: <Archive className="h-6 w-6 text-orange-600" />,
          total: summary.totalRemaining || 0,
          unit: summary.unitRemaining || 0,
          product:product,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        }
      default:
        return null
    }
  }
  
const handleTrashSubmit = async () => {
  const { quantity, type, reason } = trashForm;

  // 💬 Validate inputs with toast
  if (!quantity || !type || !reason) {
    toast.warning("Please fill out all fields before submitting.");
    return;
  }

  try {
    // 🛠️ Submit to API
    await trashProductQuanityAPI(
      {
        productId: summaryData.product._id,
        quantity: Number(quantity),
        type,
        reason,
      },
      token
    );


    // 🔄 Reset UI
    setSummaryPopup(false);
    await fetchProducts()
    setTrashForm({ quantity: "", type: "box", reason: "" });
  } catch (err) {
    console.error("❌ Trash Submit Error:", err);
    toast.error("Something went wrong while submitting."); // ❌ error toast
  }
};








const handleAddQuantitySubmit = async () => {
  const { quantity, type, reason } = addQuaForm;

  // 💬 Validate inputs with toast
  if (!quantity || !type ) {
    toast.warning("Please fill out all fields before submitting.");
    return;
  }

  try {
    // 🛠️ Submit to API
    await addQuantityProductAPI(
      {
        productId: summaryData.product._id,
        quantity: Number(quantity),
        type,
        reason,
      },
      token
    );


    // 🔄 Reset UI
    setSummaryPopup(false);
    await fetchProducts()
    setAddQuaForm({ quantity: "", type: "box", reason: "" });
  } catch (err) {
    console.error("❌ Trash Submit Error:", err);
    toast.error("Something went wrong while submitting."); // ❌ error toast
  }
};
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[60px]">Image</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              <div className="flex items-center">Product {renderSortIcon("name")}</div>
            </TableHead>
            <TableHead className="text-right cursor-pointer">
              <div className="flex items-center justify-end">Purchased</div>
            </TableHead>
            <TableHead className="text-right cursor-pointer">
              <div className="flex items-center justify-end">Sell</div>
            </TableHead>
            <TableHead className="text-right cursor-pointer">
              <div className="flex items-center justify-end">Remaining</div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end">Price</div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("lastUpdated")}>
              <div className="flex items-center justify-end">Updated {renderSortIcon("lastUpdated")}</div>
            </TableHead>
            <TableHead className="text-right">Order Actions</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow
                key={product.id}
                className={`
                  ${selectedProducts.includes(product.id) ? "bg-muted/40" : ""}
                  ${isExpired(product) ? "bg-red-50 dark:bg-red-950/20" : ""}
                  ${isNearingExpiry(product) && !isExpired(product) ? "bg-amber-50 dark:bg-amber-950/20" : ""}
                `}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell>
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground/70" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium truncate max-w-[200px]">{product.name}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.palette && (
                      <div
                        className="w-3 h-3 rounded-full inline-block mr-1"
                        style={{ backgroundColor: product.palette }}
                      />
                    )}
                    {product.organic && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                        Organic
                      </Badge>
                    )}
                    {product.origin && (
                      <Badge variant="outline" className="text-xs">
                        {product.origin}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className="text-right cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => handleSummaryClick("purchased", product)}
                >
                  <div className="font-medium text-blue-600 hover:text-blue-800">
                    {product?.summary?.totalPurchase || 0}
                  </div>
                </TableCell>
                <TableCell
                  className="text-right cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => handleSummaryClick("sell", product)}
                >
                  <div className="font-medium text-green-600 hover:text-green-800">
                    {product?.summary?.totalSell || 0}
                  </div>
                </TableCell>
                <TableCell
                  className="text-right cursor-pointer hover:bg-orange-50 transition-colors"
                  onClick={() => handleSummaryClick("remaining", product)}
                >
                  <div className="font-medium text-orange-600 hover:text-orange-800">
                    {product?.summary?.totalRemaining || 0}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {product.pricePerBox && product.boxSize ? (
                    <div className="flex items-center justify-end gap-1">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">${product.pricePerBox.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(product.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell
                  onClick={() => fetchProductOrder(product?._id)}
                  className="text-right text-muted-foreground cursor-pointer underline text-blue-800"
                >
                  Total
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditProduct(product.id)
                            setIsEditProduct(true)
                          }}
                        >
                          <FileEdit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProduct} onOpenChange={setIsEditProduct}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
          </DialogHeader>
          <AddProductForm
            onSuccess={() => {
              fetchProducts()
              setIsEditProduct(false)
            }}
            editProduct={editProduct}
            isEditProduct={isEditProduct}
          />
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDetails} onOpenChange={setOrderDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Order Details {startDate}- {endDate}</DialogTitle>
          </DialogHeader>
          {productOrderData && (
            <div className="space-y-4">
             <div className="flex items-center justify-between gap-4">
  {/* Left Side: Image and Title */}
  <div className="flex items-center gap-4">
    <img
      src={productOrderData.productImage || "/placeholder.svg"}
      alt={productOrderData.productTitle}
      className="w-16 h-16 object-cover rounded-md"
    />
    <h3 className="text-lg font-medium">{productOrderData.productTitle}</h3>
  </div>

  {/* Right Side: Refresh Button */}
  <button
    onClick={async () => {
      await refreshSingleProductAPI(productOrderData?.productId);
      fetchProducts();
    }}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
  >
    Refresh History
  </button>
</div>


              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Buyers</h4>
                {productOrderData.buyers && productOrderData.buyers.length > 0 ? (
                  <div className="space-y-3">
                    {productOrderData.buyers.map((buyer, index) => (
                      <div key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className="font-medium">{buyer.name}</span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {buyer.quantity}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(buyer.orderDate).toLocaleDateString()} at{" "}
                          {new Date(buyer.orderDate).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No orders in the last 7 days</p>
                )}
              </div>
              <div>Total Orders - {productOrderData?.totalOrdersThisWeek}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Popup Dialog */}
      <Dialog open={summaryPopup} onOpenChange={setSummaryPopup} >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              {getSummaryContent()?.icon}
              {getSummaryContent()?.title}
              
            </DialogTitle>
          </DialogHeader>
          {summaryData && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={summaryData.product.image || "/placeholder.svg"}
                  alt={summaryData.product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium text-sm">{summaryData.product.name}</h3>
                  <p className="text-xs text-muted-foreground">{summaryData.product.category}</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${getSummaryContent()?.bgColor} border-opacity-20`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className={`h-5 w-5 ${getSummaryContent()?.color}`} />
                    <span className="text-sm font-medium text-gray-700">Total</span>
                  </div>
                  <div className={`text-2xl font-bold ${getSummaryContent()?.color}`}>{getSummaryContent()?.total}</div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${getSummaryContent()?.bgColor} border-opacity-20`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Box className={`h-5 w-5 ${getSummaryContent()?.color}`} />
                    <span className="text-sm font-medium text-gray-700">Unit</span>
                  </div>
                  <div className={`text-2xl font-bold ${getSummaryContent()?.color}`}>{getSummaryContent()?.unit}</div>
                  <div className="text-xs text-muted-foreground mt-1">{summaryData.product.unit}</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">{new Date(summaryData.product.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Trash Quantity Update Form - Only for Remaining */}
{getSummaryContent()?.title === "Remaining Details SDG" && (
  <div className="pt-4 border-t">
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-600">
      <Trash2 className="w-4 h-4" />
      Move Quantity to Trash
    </h4>

    <div className="space-y-3">
      {/* Quantity Input */}
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          min={1}
          value={trashForm.quantity}
          onChange={(e) => setTrashForm({ ...trashForm, quantity: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      {/* Type Select */}
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={trashForm.type}
          onChange={(e) => setTrashForm({ ...trashForm, type: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="box">Box</option>
          <option value="unit">Unit</option>
        </select>
      </div>

      {/* Reason Input */}
      <div>
        <label className="block text-sm font-medium">Reason</label>
        <input
          type="text"
          value={trashForm.reason}
          onChange={(e) => setTrashForm({ ...trashForm, reason: e.target.value })}
          placeholder="e.g. Expired or Broken"
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleTrashSubmit}
        className="w-full mt-2 bg-red-600 text-white py-2 rounded-md text-sm font-medium hover:bg-red-700"
      >
        Update Trash
      </button>
    </div>
  </div>
)}


























{getSummaryContent()?.title === "Remaining Details DFG" && (
  <div className="pt-4 border-t">
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-600">
      <Trash2 className="w-4 h-4" />
      Add Quantity to Manually
    </h4>

    <div className="space-y-3">
      {/* Quantity Input */}
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          min={1}
          value={addQuaForm.quantity}
          onChange={(e) => setAddQuaForm({ ...addQuaForm, quantity: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      {/* Type Select */}
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={addQuaForm.type}
          onChange={(e) => setAddQuaForm({ ...addQuaForm, type: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="box">Box</option>
          <option value="unit">Unit</option>
        </select>
      </div>


<div className=" flex flex-col">
<p>  Previous Update Box  : {getSummaryContent()?.product?.manuallyAddBox?.quantity || 0}</p>
<p>Previous Update Unit : {getSummaryContent()?.product?.manuallyAddUnit?.quantity || 0}</p>
</div>
      {/* Submit Button */}
      <button
        onClick={handleAddQuantitySubmit}
        className="w-full mt-2 bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700"
      >
        Update Quantity
      </button>
    </div>
  </div>
)}















        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InventoryTable
