import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatCurrency } from "@/lib/data"

export const exportCreditMemoToPDF = (
  creditMemo: any,
  options: {
    includeHeader?: boolean
    includeCompanyDetails?: boolean
    includeLogo?: boolean
    includeSignature?: boolean
    creditMemoTemplate?: string
  } = {},
) => {
  const {
    includeHeader = true,
    includeCompanyDetails = true,
    includeLogo = true,
    includeSignature = false,
    creditMemoTemplate = "standard",
  } = options

  const doc = new jsPDF()

  const PAGE_WIDTH = doc.internal.pageSize.width
  const MARGIN = 12
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN
  const centerX = PAGE_WIDTH / 2
  const rightX = PAGE_WIDTH - MARGIN
  const leftX = MARGIN

  let yPos = 15

  // Add logo
  if (includeLogo) {
    const logoUrl = "/logg.png"
    const logoHeight = 23
    const logoWidth = 0

    const centerX = PAGE_WIDTH / 2
    doc.addImage(logoUrl, "PNG", centerX - 23 / 2, 5, logoWidth, logoHeight)
  }

  // ----------- LEFT SIDE: CREDIT MEMO DETAILS -----------
  if (creditMemo) {
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(41, 98, 255)
    doc.text("CREDIT MEMO", leftX, yPos + 2)

    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text(`Credit Memo #: ${creditMemo.id}`, leftX, yPos + 7)
    const dateObj = new Date(creditMemo.date);
const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
doc.text(`Date: ${formattedDate}`, leftX, yPos + 11);

    doc.text(`Original Order #: ${creditMemo.originalOrderId}`, leftX, yPos + 15)
    const originalDate = new Date(creditMemo.originalOrderDate);
const formattedOriginalDate = `${String(originalDate.getMonth() + 1).padStart(2, '0')}/${String(originalDate.getDate()).padStart(2, '0')}/${originalDate.getFullYear()}`;
doc.text(`Original Order Date: ${formattedOriginalDate}`, leftX, yPos + 19);

  }

  // ----------- RIGHT SIDE: COMPANY DETAILS -----------
  if (includeCompanyDetails) {
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(41, 98, 255)
    doc.text("Vali Produce", rightX, yPos + 2, { align: "right" })

    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(100, 100, 100)
    doc.text("4300 Pleasantdale Rd,", rightX, yPos + 7, { align: "right" })
    doc.text("Atlanta, GA 30340, USA", rightX, yPos + 11, { align: "right" })
    doc.text("order@valiproduce.shop", rightX, yPos + 15, { align: "right" })
  }

  yPos += 30

  // Customer Info Box
  doc.setFillColor(245, 245, 245)
  if (creditMemoTemplate === "professional") {
    doc.setFillColor(240, 247, 255)
  }

  const boxHeight = 40
  doc.roundedRect(MARGIN, yPos, CONTENT_WIDTH, boxHeight, 2, 2, "F")

  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)

  const customerX = MARGIN + 4
  const customerY = yPos + 6

  doc.setFont("helvetica", "bold")
  doc.text("Customer:", customerX, customerY)

  doc.setFont("helvetica", "bold")
  doc.text(creditMemo?.billingAddress?.name || creditMemo?.store?.storeName || "N/A", customerX, customerY + 6)
  doc.text(creditMemo?.billingAddress?.address || "N/A", customerX, customerY + 11)
  doc.text(
    `${creditMemo?.billingAddress?.city || ""}, ${creditMemo?.billingAddress?.state || ""} ${creditMemo?.billingAddress?.postalCode || ""}`,
    customerX,
    customerY + 16,
  )
  doc.text(`Phone: ${creditMemo?.billingAddress?.phone || "N/A"}`, customerX, customerY + 21)

  const refundX = PAGE_WIDTH / 2 + 4
  const refundY = yPos + 6

  doc.setFont("helvetica", "bold")
  doc.text("Refund Details:", refundX, refundY)

  doc.setFont("helvetica", "bold")

  let refundMethodDisplay = "Unknown"
  switch (creditMemo.refundMethod) {
    case "store_credit":
      refundMethodDisplay = "Store Credit"
      break
    case "cash_refund":
      refundMethodDisplay = "Cash Refund"
      break
    case "bank_transfer":
      refundMethodDisplay = "Bank Transfer"
      break
    case "original_payment":
      refundMethodDisplay = "Original Payment Method"
      break
  }

  doc.text(`Refund Method: ${refundMethodDisplay}`, refundX, refundY + 6)

  if (creditMemo.reason) {
    doc.text(`Reason: ${creditMemo.reason}`, refundX, refundY + 11)
  }

  yPos += boxHeight + 5

  // Enhanced table headers to include evidence column
  const tableHeaders = [
    { header: "Item", dataKey: "item" },
    { header: "Qty", dataKey: "quantity" },
    { header: "Price", dataKey: "unitPrice" },
    { header: "Reason", dataKey: "reason" },
    { header: "Evidence", dataKey: "evidence" },
    { header: "Amount", dataKey: "amount" },
  ]

  const formatReason = (reason: string) => {
    switch (reason) {
      case "defective":
        return "Defective"
      case "damaged":
        return "Damaged"
      case "wrong_item":
        return "Wrong Item"
      case "customer_complaint":
        return "Customer Complaint"
      case "quality_issue":
        return "Quality Issue"
      case "other":
        return "Other"
      default:
        return reason
    }
  }

  const formatEvidence = (item: any) => {
    if (!item.uploadedFiles || item.uploadedFiles.length === 0) {
      return "None"
    }

    const imageCount = item.uploadedFiles.filter((f: any) => f.type === "image").length
    const videoCount = item.uploadedFiles.filter((f: any) => f.type === "video").length

    const parts = []
    if (imageCount > 0) parts.push(`${imageCount} image${imageCount > 1 ? "s" : ""}`)
    if (videoCount > 0) parts.push(`${videoCount} video${videoCount > 1 ? "s" : ""}`)

    return parts.join(", ")
  }

  const tableRows = creditMemo.items.map((item: any) => [
    item.productName,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    formatReason(item.reason),
    formatEvidence(item),
    formatCurrency(item.total),
  ])

  const headerStyles: any = {
    fillColor: [41, 98, 255],
    textColor: [255, 255, 255],
    fontStyle: "bold" as const,
    lineWidth: 0.4,
    lineColor: [50, 50, 50],
    fontSize: 8,
  }

  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders.map((col) => col.header)],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: headerStyles,
    bodyStyles: {
      lineWidth: 0.4,
      lineColor: [50, 50, 50],
      fontSize: 9,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 15, halign: "right" },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 30, halign: "left" },
      4: { cellWidth: 25, halign: "left" },
      5: { cellWidth: 25, halign: "right" },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    didDrawPage: () => {
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, doc.internal.pageSize.height - 8, { align: "right" })
      }
    },
  })

  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    yPos = doc.lastAutoTable.finalY + 8
  } else {
    yPos += 50
  }

  // Total amount
  const totalAmount = creditMemo.totalAmount

  doc.setLineWidth(0.5)
  doc.line(PAGE_WIDTH - MARGIN - 60, yPos - 2, PAGE_WIDTH - MARGIN, yPos - 2)

  doc.setFont("helvetica", "bold")
  doc.setTextColor(41, 98, 255)
  doc.text("Total Credit Amount:", PAGE_WIDTH - MARGIN - 60, yPos + 4)
  doc.text(formatCurrency(totalAmount), PAGE_WIDTH - MARGIN, yPos + 4, { align: "right" })

  yPos += 15

  // Add item-specific notes if available
  const itemsWithNotes = creditMemo.items.filter((item: any) => item.notes && item.notes.trim())
  if (itemsWithNotes.length > 0) {
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text("Item Notes:", MARGIN, yPos)
    yPos += 5

    itemsWithNotes.forEach((item: any) => {
      doc.setFont("helvetica", "bold")
      doc.setTextColor(100, 100, 100)
      doc.text(`• ${item.productName}:`, MARGIN + 5, yPos)
      yPos += 4

      doc.setFont("helvetica", "normal")
      const splitNotes = doc.splitTextToSize(item.notes, CONTENT_WIDTH - 10)
      doc.text(splitNotes, MARGIN + 10, yPos)
      yPos += splitNotes.length * 4 + 3
    })

    yPos += 5
  }

  // Add general notes if available
  if (creditMemo.notes) {
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text("General Notes:", MARGIN, yPos)
    yPos += 5

    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    const splitNotes = doc.splitTextToSize(creditMemo.notes, CONTENT_WIDTH)
    doc.text(splitNotes, MARGIN, yPos)
    yPos += splitNotes.length * 5 + 5
  }

  // Add evidence summary
  const itemsWithEvidence = creditMemo.items.filter((item: any) => item.uploadedFiles && item.uploadedFiles.length > 0)
  if (itemsWithEvidence.length > 0) {
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text("Evidence Summary:", MARGIN, yPos)
    yPos += 5

    itemsWithEvidence.forEach((item: any) => {
      doc.setFont("helvetica", "normal")
      doc.setTextColor(100, 100, 100)
      const evidenceText = `• ${item.productName}: ${formatEvidence(item)} uploaded`
      doc.text(evidenceText, MARGIN + 5, yPos)
      yPos += 4
    })

    yPos += 5
  }

  if (includeSignature) {
    yPos += 15
    doc.setLineWidth(0.1)
    doc.line(PAGE_WIDTH - MARGIN - 60, yPos, PAGE_WIDTH - MARGIN, yPos)
    yPos += 4
    doc.setFontSize(7)
    doc.text("Authorized Signature", PAGE_WIDTH - MARGIN - 30, yPos, { align: "center" })
  }

  const footerY = doc.internal.pageSize.height - 10
  doc.setFontSize(7)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(150, 150, 150)
  doc.text("This is a computer-generated document. No signature is required.", PAGE_WIDTH / 2, footerY, {
    align: "center",
  })

  // Add watermark
  doc.setGState(doc.GState({ opacity: 0.1 }))
  doc.setFont("helvetica", "bold")
  doc.setFontSize(60)
  doc.setTextColor(41, 98, 255)
  doc.text("CREDIT MEMO", PAGE_WIDTH / 2, PAGE_WIDTH / 2, {
    align: "center",
    angle: 45,
  })

  doc.save(`credit-memo-${creditMemo.id}.pdf`)

  return doc
}
