import jsPDF from "jspdf"
import "jspdf-autotable"
import { format, differenceInDays } from "date-fns"
import autoTable from "jspdf-autotable"
import { toZonedTime } from "date-fns-tz"

interface OrderItem {
  orderNumber: string
  date: string
  amount: number
  paymentStatus: string
  productCount: number
}

interface MonthSummary {
  orders: OrderItem[]
  totalAmount: number
  totalPaid: number
  totalPending: number
  totalProducts: number
}

interface StatementData {
  closingBalance: number
  summaryByMonth: Record<string, MonthSummary>
  totalPaid: number
  totalPending: number
  totalProductsOrdered: number
  filters?: {
    paymentStatus: string
    startMonth: string
    endMonth: string
  }
  user?: {
    email: string
    name: string
    phone: string
    storeName: string
    address: string
    city: string
    state: string
    zipCode: string
  }
}

export const generateStatementPDF = async (data: StatementData) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const MARGIN = 10
    const PAGE_WIDTH = doc.internal.pageSize.getWidth()
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight()
    const usTimeZone = "America/New_York"
    const nowUS = toZonedTime(new Date(), usTimeZone)
    const agingDate = format(nowUS, "M/d/yyyy")

    const logoUrl = "/logg.png"
    const logoHeight = 23
    const logoWidth = 0

    const centerX = PAGE_WIDTH / 2
    doc.addImage(logoUrl, "PNG", MARGIN, MARGIN, logoWidth, logoHeight)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("CUSTOMER STATEMENT", centerX, MARGIN + 10, { align: "center" })

    const rightX = PAGE_WIDTH - MARGIN
    const customerName = data.user?.storeName || ""
    const customerAddress = `${data.user?.address || ""}, ${data.user?.city || ""}`
    const customerCityLine = `${data.user?.city || ""}, ${data.user?.state || ""} ${data.user?.zipCode || ""}`
    const customerPhone = data.user?.phone || ""
    const customerContact = data.user?.name || ""

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(customerName, rightX, MARGIN + 5, { align: "right" })

    doc.setFont("helvetica", "normal")
    doc.text(customerAddress, rightX, MARGIN + 10, { align: "right" })
    doc.text(customerCityLine, rightX, MARGIN + 15, { align: "right" })
    doc.text(`Phone : ${customerPhone}`, rightX, MARGIN + 20, { align: "right" })
    doc.text(`Contact : ${customerContact}`, rightX, MARGIN + 25, { align: "right" })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text(`Aging Date:`, centerX - 20, MARGIN + 20)
    doc.setFont("helvetica", "normal")
    doc.text(agingDate, centerX + 10, MARGIN + 20)

    doc.setFontSize(9)
    doc.text(
      "4300 Pleasantdale Rd, Atlanta, GA 30340, USA    |    Phone: +1 501 559 0123    |    Email: order@valiproduce.shop",
      MARGIN,
      MARGIN + 30,
    )

    const headers = [
      [
        "Posting Date",
        "Due Date",
        "Document",
        "Days Past Due",
        "Original Amount",
        "Applied Amount",
        "Balance Due",
        "Cuml.Bal",
        "0 - 7",
        "8 - 14",
        "15 - 21",
        "22 - 28",
        "29+",
      ],
    ]

    const tableData = []
    let totalAmount = 0
    let total0to7 = 0,
      total8to14 = 0,
      total15to21 = 0,
      total22to28 = 0,
      total29plus = 0
    let totalOriginalAmount = 0
    let totalAppliedAmount = 0
    let totalBalanceDue = 0

    const allOrders: OrderItem[] = []
    Object.values(data.summaryByMonth).forEach((month) => {
      allOrders.push(...month.orders)
    })

    allOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    allOrders.forEach((order) => {
      const orderDate = toZonedTime(new Date(order.date), usTimeZone)
      const dueDate = orderDate
      const daysPastDue = differenceInDays(nowUS, orderDate)

      let amount0to7 = 0,
        amount8to14 = 0,
        amount15to21 = 0,
        amount22to28 = 0,
        amount29plus = 0

      // Calculate appliedAmount and balanceDue correctly
      let balanceDue = order.amount
      let appliedAmount = "$0.00"

      if (order.paymentStatus === "paid") {
        appliedAmount = `$${order.amount.toFixed(2)}`
        balanceDue = 0
      } else if (order.paymentStatus === "partial") {
        const paidAmount = Number(order.paymentAmount || 0)
        appliedAmount = `$${paidAmount.toFixed(2)}`
        balanceDue = order.amount - paidAmount
      } else if (order.paymentStatus === "pending") {
        appliedAmount = "$0.00"
        balanceDue = order.amount
      }

      // Use balanceDue for aging buckets, not order.amount
      if (daysPastDue <= 7) {
        amount0to7 = balanceDue
        total0to7 += balanceDue
      } else if (daysPastDue <= 14) {
        amount8to14 = balanceDue
        total8to14 += balanceDue
      } else if (daysPastDue <= 21) {
        amount15to21 = balanceDue
        total15to21 += balanceDue
      } else if (daysPastDue <= 28) {
        amount22to28 = balanceDue
        total22to28 += balanceDue
      } else {
        amount29plus = balanceDue
        total29plus += balanceDue
      }

      totalAmount += balanceDue          // total outstanding balance
      totalOriginalAmount += order.amount // original sum of all orders
      totalAppliedAmount += order.amount - balanceDue // sum of paid amounts
      totalBalanceDue += balanceDue        // sum of outstanding balances

      tableData.push([
        format(orderDate, "MM/dd/yyyy"),
        format(dueDate, "MM/dd/yyyy"),
        `IN ${order.orderNumber}`,
        daysPastDue.toString(),
        `$${order.amount.toFixed(2)}`,
        appliedAmount,
        `$${balanceDue.toFixed(2)}`,
        `$${totalAmount.toFixed(2)}`,
        `$${amount0to7.toFixed(2)}`,
        `$${amount8to14.toFixed(2)}`,
        `$${amount15to21.toFixed(2)}`,
        `$${amount22to28.toFixed(2)}`,
        `$${amount29plus.toFixed(2)}`,
      ])
    })


    tableData.push(
      [
        "Total:",
        "",
        "",
        "",
        `$${totalOriginalAmount.toFixed(2)}`,
        `$${totalAppliedAmount.toFixed(2)}`,
        `$${totalBalanceDue.toFixed(2)}`,
        `$${totalAmount.toFixed(2)}`,
        `$${total0to7.toFixed(2)}`,
        `$${total8to14.toFixed(2)}`,
        `$${total15to21.toFixed(2)}`,
        `$${total22to28.toFixed(2)}`,
        `$${total29plus.toFixed(2)}`,
      ],
      [
        "Aging %",
        "",
        "",
        "",
        "100%",
        `${((totalAppliedAmount / totalOriginalAmount) * 100).toFixed(2)}%`,
        `${((totalBalanceDue / totalOriginalAmount) * 100).toFixed(2)}%`,
        "100%",
        `${((total0to7 / totalAmount) * 100).toFixed(2)}%`,
        `${((total8to14 / totalAmount) * 100).toFixed(2)}%`,
        `${((total15to21 / totalAmount) * 100).toFixed(2)}%`,
        `${((total22to28 / totalAmount) * 100).toFixed(2)}%`,
        `${((total29plus / totalAmount) * 100).toFixed(2)}%`,
      ],
    )


    autoTable(doc, {
      startY: MARGIN + 35,
      margin: { left: MARGIN, right: MARGIN },
      head: headers,
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 98, 255],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      }, bodyStyles: {
        lineWidth: 0.4,
        lineColor: [50, 50, 50],
        fontSize: 10, // Smaller font size for table body
        fontStyle: 'bold' // Make body text bold
      },
      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "right" },
        9: { halign: "right" },
        10: { halign: "right" },
        11: { halign: "right" },
        12: { halign: "right" },
      },
      didDrawPage: () => {
        const str = `Page ${doc.getNumberOfPages()}`
        doc.setFontSize(8)
        doc.text(str, PAGE_WIDTH - MARGIN - 10, PAGE_HEIGHT - MARGIN)
      },
    })

  let finalY = (doc as any).lastAutoTable.finalY + 10
const boxHeight = 40

// If not enough space for the box, add a new page
if (finalY + boxHeight > PAGE_HEIGHT - MARGIN) {
  doc.addPage()
  finalY = MARGIN
}
    const boxTop = PAGE_HEIGHT - boxHeight - MARGIN
    const boxLeft = MARGIN
    const boxWidth = PAGE_WIDTH - 2 * MARGIN

    doc.setDrawColor(0)
    doc.setFillColor(245, 245, 245)
    doc.rect(boxLeft, boxTop, boxWidth, boxHeight, "FD")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Remittance Method", boxLeft + 4, boxTop + 8)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Pay by Email: Send copy of cheque to order@valiproduce.shop", boxLeft + 4, boxTop + 16)
    doc.text("ACH: , Routing: 063114030, Account: 8010002074700", boxLeft + 4, boxTop + 24)
    doc.text("Bank: SouthState Bank", boxLeft + 4, boxTop + 32)

    const fileName = `Statement_${customerName.replace(/\s+/g, "_")}_${agingDate.replace(/\//g, "-")}.pdf`
    doc.save(fileName)

    const pdfBase64 = doc.output("datauristring").split(",")[1]
    return pdfBase64
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
}
