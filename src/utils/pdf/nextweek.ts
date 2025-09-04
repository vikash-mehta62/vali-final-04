
import { toast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Sample interface for the order type based on the provided data
interface OrderItem {
  product: string
  productId?: string
  name: string
  productName?: string
  price: number
  unitPrice?: number
  quantity: number
  total?: number
  pricingType: string
}

interface Order {
  id: string
  orderNumber: string
  clientName: string
  orderType: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  status: string
  total: number
  // other fields omitted for brevity
}

export default function OrderPdfDownload({ orders }: { orders: Order[] }) {
  const handleDownloadMergedProducts = () => {
    // Filter only NextWeek orders
    const nextWeekOrders = orders.filter((order) => order.orderType === "NextWeek")

    if (nextWeekOrders.length === 0) {
      toast({
        title: "No orders found",
        description: "There are no Next Week orders to download",
        variant: "destructive",
      })
      return
    }

    // Find oldest and newest order dates
    const orderDates = nextWeekOrders.map((order) => new Date(order.createdAt))
    const oldestDate = new Date(Math.min(...orderDates.map((date) => date.getTime())))
    const newestDate = new Date(Math.max(...orderDates.map((date) => date.getTime())))

    // Format dates for display
 const formatDate = (date: Date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};


    const dateRangeText = `Next Week Orders (${formatDate(oldestDate)} - ${formatDate(newestDate)})`

    // Create a map to store merged product quantities
    const productMap = new Map()

    // Loop through all NextWeek orders and their items
    nextWeekOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product || item.productId || ""
        const productName = item.name || item.productName || ""

        if (productMap.has(productId)) {
          // If product already exists in map, add to its quantity
          const existingProduct = productMap.get(productId)
          existingProduct.quantity += item.quantity
          existingProduct.totalPrice += item.total || item.price * item.quantity
        } else {
          // If product doesn't exist in map, add it
          productMap.set(productId, {
            id: productId,
            name: productName,
            quantity: item.quantity,
            unitPrice: item.price || item.unitPrice || 0,
            totalPrice: item.total || item.price * item.quantity,
            pricingType: item.pricingType || "unit",
          })
        }
      })
    })

    // Convert map to array
    const mergedProducts = Array.from(productMap.values())

    // Create PDF document
    const doc = new jsPDF()

    // Add title with date range
    doc.setFontSize(16)
    doc.text(dateRangeText, 14, 20)

    // Add order count information
    doc.setFontSize(12)
    doc.text(`Total Orders: ${nextWeekOrders.length}`, 14, 30)

    // Prepare data for table
    const tableData = mergedProducts.map((product) => [
      product.id,
      product.name,
      product.quantity.toString(),
      `$${product.unitPrice.toFixed(2)}`,
      `$${product.totalPrice.toFixed(2)}`,
      product.pricingType,
    ])

    // Calculate total value of all products
    const totalValue = mergedProducts.reduce((sum, product) => sum + product.totalPrice, 0)

    // Add table to PDF
    autoTable(doc, {
      head: [["Product ID", "Product Name", "Quantity", "Unit Price", "Total Price", "Pricing Type"]],
      body: tableData,
      startY: 40,
        bodyStyles: {
      lineWidth: 0.4,          
  lineColor: [50, 50, 50],  
      fontSize: 10, // Smaller font size for table body
      fontStyle: 'bold' // Make body text bold
    },
      foot: [["", "", "", "Grand Total:", `$${totalValue.toFixed(2)}`, ""]],
      theme: "striped",
      headStyles: { fillColor: [66, 66, 66] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
    })

    // Save the PDF
    doc.save(`next-week-orders-${new Date().toISOString().split("T")[0]}.pdf`)

    toast({
      title: "PDF Download Started",
      description: `Merged product quantities for ${nextWeekOrders.length} NextWeek orders`,
    })
  }


}
