"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import InventoryTable from "@/components/inventory/InventoryTable"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Download,
  Upload,
  AlertTriangle,
  Truck,
  ListFilter,
  Tags,
  Store,
  Loader,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  XCircle,
  RotateCcw,
} from "lucide-react"
import { getLowStockProducts, type Product, createReorder, getReorders, type Reorder } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddProductForm from "@/components/inventory/AddProductForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InventoryStats from "@/components/inventory/InventoryStats"
import BulkActions from "@/components/inventory/BulkActions"
import { Badge } from "@/components/ui/badge"
import ReorderForm from "@/components/inventory/ReorderForm"
import PriceUpdateModal from "@/components/inventory/PriceUpdateModal"
import PriceListUpdateModal from "@/components/inventory/PriceListUpdateModal"
import BulkDiscountModal from "@/components/inventory/BulkDiscountModal"
import { useNavigate } from "react-router-dom"
import { getAllProductSummaryAPI } from "@/services2/operations/product"
import { getAllCategoriesAPI } from "@/services2/operations/category"
import { useDispatch } from "react-redux"
import Swal from "sweetalert2"

interface FilterState {
  search: string
  category: string
  sortBy: string
  sortOrder: "asc" | "desc"
  stockLevel: string
  startDate: string
  endDate: string
}

interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

const Inventory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [lowStockAlertOpen, setLowStockAlertOpen] = useState(false)
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false)
  const [selectedProductForReorder, setSelectedProductForReorder] = useState<Product | null>(null)
  const [reorders, setReorders] = useState<Reorder[]>(getReorders())
  const [isPriceUpdateOpen, setIsPriceUpdateOpen] = useState(false)
  const [isPriceListOpen, setIsPriceListOpen] = useState(false)
  const [isBulkDiscountOpen, setIsBulkDiscountOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  // Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })


  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Get Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Shift to Monday

    // Get Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format as yyyy-mm-dd
    const format = (date: Date) => date.toISOString().split("T")[0];

    return {
      startDate: format(monday),
      endDate: format(sunday),
    };
  };

  const { startDate, endDate } = getCurrentWeekRange();

  // Filter and Sort State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    sortBy: "name",
    sortOrder: "asc",
    stockLevel: "all",
    startDate, endDate
  })

  // Debounced search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [debouncedSearch, filters.category, filters.stockLevel, filters.startDate, filters.endDate])

  const fetchProducts = async (hard = false) => {
    setLoading(true)
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.category !== "all" && { categoryId: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        ...(filters.stockLevel !== "all" && { stockLevel: filters.stockLevel }),
      })

      // Replace this with your actual paginated API call
      const response = await getAllProductSummaryAPI(`?${queryParams.toString()}&hard=${hard}`)

      console.log("Paginated response:", response)

      if (response) {
        const updatedProducts = (response.products || response.data || response).map((product) => ({
          ...product,
          id: product._id,
          lastUpdated: product?.updatedAt,
          orderFrequency: Math.floor(Math.random() * 100),
          totalOrders: Math.floor(Math.random() * 50),
        }))

        setProducts(updatedProducts)
        console.log(response)
        // Update pagination info from response
        setPagination((prev) => ({
          ...prev,
          total: response.total || response.totalCount || updatedProducts.length,
          totalPages: response.totalPages || Math.ceil((response.total || updatedProducts.length) / prev.limit),
        }))
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }




  const handleHardRefresh = async () => {
    const result = await Swal.fire({
      title: "Hard Refresh",
      text: "This process may take time. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
      background: "#f9fafb",
      customClass: {
        popup: "rounded-xl shadow-lg",
      },
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await fetchProducts(true);
        Swal.fire({
          title: "Refreshed!",
          text: "Product list has been updated.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Error", "Failed to refresh products.", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };


  // Fetch products when pagination or filters change
  useEffect(() => {
    fetchProducts()
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    filters.category,
    filters.stockLevel,
    filters.startDate,
    filters.endDate,
    filters.sortBy,
    filters.sortOrder,
  ])

  // Get unique categories from products
  const [categories, setCategories] = useState([])
  const getAllCategories = async () => {
    try {
      const response = await dispatch(getAllCategoriesAPI())
      console.log("Categories:", response)
      // Ensure we're setting an array of category objects
      setCategories(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  const lowStockProducts = getLowStockProducts()

  useEffect(() => {
    if (lowStockProducts.length > 0 && !lowStockAlertOpen) {
      setTimeout(() => {
        setLowStockAlertOpen(true)
      }, 1000)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSortOrderToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      sortBy: "name",
      sortOrder: "asc",
      stockLevel: "all",
    startDate, endDate
    })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  const handleLimitChange = (newLimit: string) => {
    setPagination((prev) => ({
      ...prev,
      limit: Number.parseInt(newLimit),
      page: 1, // Reset to first page when changing limit
    }))
  }

  const handleExport = () => {
    if (products.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no products in the table to export.",
        variant: "default",
      });
      return;
    }

    toast({
      title: "Exporting Inventory",
      description: "Your inventory data is being exported to CSV...",
    });

    const headers = ["product name", "Purchased", "Sell", "Remaining", "Price"];
    // Map your product data to match the CSV headers
    console.log(products)
    const csvData = products.map(product => {
      // Assuming 'product' has properties like 'name', 'purchased', 'sold', 'quantity', 'price'
      // You may need to adjust these property names based on your actual Product type structure
      const productName = product.name || '';
      const summary = product.summary || {};

      const purchased = summary.totalPurchase || 0;
      const sold = summary.totalSell || 0;
      const remaining = summary.totalRemaining || 0;


      const price = product.price || 0; // Price might still be directly on product


      return [
        `"${productName.replace(/"/g, '""')}"`, // Handle commas and quotes in product names
        purchased,
        sold,
        remaining,
        price
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory_data.csv');
    link.click();

    URL.revokeObjectURL(url); // Clean up the URL object
    toast({
      title: "Export Complete",
      description: "Inventory data has been successfully downloaded.",
      variant: "success",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Inventory",
      description: "Please select a CSV file to import",
    })
  }

  const handleAddProduct = (newProduct: Product) => {
    // Refresh the current page to show the new product
    fetchProducts()
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory`,
    })
  }

  const handleProductsSelect = (productIds: string[]) => {
    setSelectedProducts(productIds)
  }

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    // Refresh the current page to show updated products
    fetchProducts()
  }

  const handleOpenReorderDialog = (product: Product) => {
    setSelectedProductForReorder(product)
    setIsReorderDialogOpen(true)
  }

  const handleReorder = (
    reorderData: Omit<Reorder, "id" | "dateCreated" | "expectedDelivery" | "status" | "productName">,
  ) => {
    if (!selectedProductForReorder) return

    const newReorder = createReorder({
      ...reorderData,
      productName: selectedProductForReorder.name,
    })

    setReorders((prev) => [newReorder, ...prev])

    toast({
      title: "Reorder Created",
      description: `${reorderData.quantity} ${selectedProductForReorder.unit} of ${selectedProductForReorder.name} has been reordered`,
    })
  }

  const handleBulkReorder = () => {
    if (selectedProducts.length === 0) return

    const productToReorder = products.find((p) => p.id === selectedProducts[0])
    if (productToReorder) {
      handleOpenReorderDialog(productToReorder)
    }
  }

  const handleOpenPriceUpdate = () => {
    if (selectedProducts.length > 0 || products.length > 0) {
      setIsPriceUpdateOpen(true)
    } else {
      toast({
        title: "No Products Available",
        description: "There are no products to update prices for",
        variant: "destructive",
      })
    }
  }

  const handleOpenPriceList = () => {
    setIsPriceListOpen(true)
  }

  const handleOpenBulkDiscount = () => {
    setIsBulkDiscountOpen(true)
  }

  const navigateToPriceList = () => {
    navigate("/price-list")
  }

  // Pagination component
  const PaginationControls = () => (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100, 1000].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={pagination.page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="container px-4 py-6 mx-auto max-w-7xl">
            <div className="mb-6">
              <PageHeader title="Inventory Management" description="Manage your product inventory efficiently">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleExport}>
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleImport}>
                    <Upload size={16} className="mr-2" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hidden sm:flex"
                    onClick={handleOpenPriceList}
                  >
                    <ListFilter size={16} className="mr-2" />
                    Price List
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hidden sm:flex"
                    onClick={handleOpenBulkDiscount}
                  >
                    <Tags size={16} className="mr-2" />
                    Volume Discounts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hidden sm:flex"
                    onClick={navigateToPriceList}
                  >
                    <Store size={16} className="mr-2" />
                    Store Price Lists
                  </Button>
                  <Button onClick={() => setIsAddProductOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Product
                  </Button>
                </div>
              </PageHeader>
            </div>

            {/* Enhanced Filter and Search Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id || category.categoryName} value={category._id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date Range Filters */}
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  />

                  <Input
                    type="date"
                    placeholder="End Date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  />

                  {/* Stock Level Filter */}
                  {/* <Select value={filters.stockLevel} onValueChange={(value) => handleFilterChange("stockLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Stock Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock Levels</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock (0)</SelectItem>
                      <SelectItem value="critical">Critical (1-2)</SelectItem>
                      <SelectItem value="very-low">Very Low (1-5)</SelectItem>
                      <SelectItem value="low">Low Stock (Below Reorder Level)</SelectItem>
                      <SelectItem value="medium">Medium Stock (1-3x Reorder Level)</SelectItem>
                      <SelectItem value="high">High Stock (Above 3x Reorder Level)</SelectItem>
                    </SelectContent>
                  </Select> */}


                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Clear Filters
                    </Button>

                    <Button
                      variant="outline"
                      onClick={()=>fetchProducts()}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Refresh
                    </Button>


                    <Button
                      variant="outline"
                      onClick={handleHardRefresh}
                      disabled={loading}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
                    >
                      <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                      {loading ? "Refreshing..." : "Hard Refresh"}
                    </Button>
                  </div>

                </div>

                {/* Filter Summary */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.search && <Badge variant="secondary">Search: "{filters.search}"</Badge>}
                  {/* {filters.category !== "all" && <Badge variant="secondary">Category: {filters.category}</Badge>} */}
                  {filters.startDate && <Badge variant="secondary">From: {filters.startDate}</Badge>}
                  {filters.endDate && <Badge variant="secondary">To: {filters.endDate}</Badge>}
                  {filters.stockLevel !== "all" && (
                    <Badge variant="secondary">
                      Stock:{" "}
                      {filters.stockLevel === "out-of-stock"
                        ? "Out of Stock"
                        : filters.stockLevel === "critical"
                          ? "Critical (1-2)"
                          : filters.stockLevel === "very-low"
                            ? "Very Low (1-5)"
                            : filters.stockLevel === "low"
                              ? "Low Stock"
                              : filters.stockLevel === "medium"
                                ? "Medium Stock"
                                : filters.stockLevel === "high"
                                  ? "High Stock"
                                  : filters.stockLevel.replace("-", " ")}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    Sort: {filters.sortBy.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} (
                    {filters.sortOrder === "asc" ? "A-Z" : "Z-A"})
                  </Badge>
                  <Badge variant="outline">
                    Showing {products.length} of {pagination.total} products
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {lowStockAlertOpen && lowStockProducts.length > 0 && (
              <Card className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/10">
                <CardHeader className="py-3">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-base text-amber-700 dark:text-amber-400">
                        Low Stock Alert: {lowStockProducts.length}{" "}
                        {lowStockProducts.length === 1 ? "Product" : "Products"}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-500 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                        onClick={() => {
                          if (lowStockProducts.length > 0) {
                            handleOpenReorderDialog(lowStockProducts[0])
                          }
                        }}
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Reorder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-500 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                        onClick={() => setLowStockAlertOpen(false)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-0 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {lowStockProducts.slice(0, 3).map((product) => (
                      <Badge
                        key={product.id}
                        variant="outline"
                        className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 cursor-pointer"
                        onClick={() => handleOpenReorderDialog(product)}
                      >
                        {product.name}: {product.quantity} {product.unit} left
                      </Badge>
                    ))}
                    {lowStockProducts.length > 3 && (
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20"
                      >
                        +{lowStockProducts.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <BulkActions
              selectedProducts={selectedProducts}
              onClearSelection={() => setSelectedProducts([])}
              onUpdateProducts={handleUpdateProducts}
              products={products}
              onReorder={handleBulkReorder}
              onPriceUpdate={handleOpenPriceList}
              onBulkDiscount={handleOpenBulkDiscount}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                <div className="flex sm:hidden space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    <Upload size={16} />
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="animate-spin text-gray-600" size={32} />
                    <p className="text-sm text-muted-foreground">Loading products...</p>
                  </div>
                </div>
              ) : (
                <div>
                  <TabsContent value="products" className="space-y-4">
                    <Card>
                      <CardContent className="p-1 sm:p-6">
                        <InventoryTable
                          products={products}
                          onProductsSelect={handleProductsSelect}
                          selectedProducts={selectedProducts}
                          onReorderProduct={handleOpenReorderDialog}
                          fetchProducts={fetchProducts}
                          startDate={filters.startDate}
                          endDate={filters.endDate}
                        />
                      </CardContent>

                      {/* Pagination Controls */}
                      {pagination.totalPages > 1 && (
                        <div className="border-t">
                          <PaginationControls />
                        </div>
                      )}
                    </Card>
                  </TabsContent>
                </div>
              )}

              <TabsContent value="analytics">
                <InventoryStats products={products} />
              </TabsContent>

              <TabsContent value="reorders">
                <Card>
                  <CardContent className="p-4">
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr className="border-b">
                            <th className="p-3 text-left font-medium">Product</th>
                            <th className="p-3 text-left font-medium">Quantity</th>
                            <th className="p-3 text-left font-medium">Created</th>
                            <th className="p-3 text-left font-medium">Expected</th>
                            <th className="p-3 text-left font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reorders.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                No reorders found
                              </td>
                            </tr>
                          ) : (
                            reorders.map((reorder) => (
                              <tr key={reorder.id} className="border-b">
                                <td className="p-3 font-medium">{reorder.productName}</td>
                                <td className="p-3">{reorder.quantity}</td>
                                <td className="p-3">{reorder.dateCreated}</td>
                                <td className="p-3">
                                  {reorder.expectedDelivery}{" "}
                                  {reorder.expedited && (
                                    <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-700 border-blue-300">
                                      Express
                                    </Badge>
                                  )}
                                </td>
                                <td className="p-3">
                                  <Badge
                                    className={`
                                      ${reorder.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-300" : ""}
                                      ${reorder.status === "ordered" ? "bg-blue-100 text-blue-700 border-blue-300" : ""}
                                      ${reorder.status === "received" ? "bg-green-100 text-green-700 border-green-300" : ""}
                                      ${reorder.status === "cancelled" ? "bg-red-100 text-red-700 border-red-300" : ""}
                                    `}
                                  >
                                    {reorder.status.charAt(0).toUpperCase() + reorder.status.slice(1)}
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* All existing dialogs remain the same */}
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Add New Product</DialogTitle>
                </DialogHeader>
                <AddProductForm
                  onSuccess={() => {
                    setIsAddProductOpen(false)
                    fetchProducts()
                  }}
                  onAddProduct={handleAddProduct}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Reorder Product</DialogTitle>
                </DialogHeader>
                {selectedProductForReorder && (
                  <ReorderForm
                    product={selectedProductForReorder}
                    onSuccess={() => setIsReorderDialogOpen(false)}
                    onReorder={handleReorder}
                  />
                )}
              </DialogContent>
            </Dialog>

            <PriceUpdateModal
              isOpen={isPriceUpdateOpen}
              onClose={() => setIsPriceUpdateOpen(false)}
              selectedProducts={
                selectedProducts.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[]
              }
              allProducts={products}
              onUpdateProducts={handleUpdateProducts}
            />

            <PriceListUpdateModal
              isOpen={isPriceListOpen}
              onClose={() => setIsPriceListOpen(false)}
              products={products}
              onUpdateProducts={handleUpdateProducts}
            />

            <BulkDiscountModal
              isOpen={isBulkDiscountOpen}
              onClose={() => setIsBulkDiscountOpen(false)}
              products={products}
              selectedProducts={selectedProducts}
              onUpdateProducts={handleUpdateProducts}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Inventory
