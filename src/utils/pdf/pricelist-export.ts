import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { PriceListTemplate, PriceListProduct } from "@/components/inventory/forms/formTypes"

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable
    lastAutoTable: {
      finalY?: number
    }
  }
}

export const exportPriceListToPDF = (template: PriceListTemplate, price: string) => {
  const doc = new jsPDF()

  // Adaptive sizing based on total product count
  const totalProducts = template.products.length
  const isLargeDataset = totalProducts > 100 // Lower threshold to use smaller fonts

  const MARGIN = 15
  const TABLE_FONT_SIZE = isLargeDataset ? 8.0 : 9.0 // Smaller font for better space usage
  const HEADER_FONT_SIZE = 7.8
  const ROW_PADDING = isLargeDataset ? 0.2 : 0.3 // Reduce padding for better space usage

  const today = new Date()
  const logoUrl = "/logg.png"
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Adjust column width for large datasets
  const columnGap = isLargeDataset ? 6 : 8 // Smaller gap between columns
  const columnWidth = (pageWidth - MARGIN * 2 - columnGap) / 2
  const leftColumnX = MARGIN
  const rightColumnX = leftColumnX + columnWidth + columnGap
  const startY = 25
  const HEADER_HEIGHT = 20
  const FOOTER_HEIGHT = 10
  const MAX_Y = pageHeight - MARGIN - FOOTER_HEIGHT // Maximum Y position before footer

  const drawHeader = () => {
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, HEADER_HEIGHT + 2, "F")

    doc.addImage(logoUrl, "PNG", MARGIN, 0, 30, 15)

    doc.setFontSize(HEADER_FONT_SIZE)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(60, 60, 60)
   const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
doc.text(`Effective from: ${formattedToday}`, MARGIN, 18);

    doc.text("Whatsapp: +1 501 400 2406", pageWidth - MARGIN, 8, { align: "right" })
    doc.text("Phone: +1 501 559 0123", pageWidth - MARGIN, 12, { align: "right" })
    doc.text("Email: order@valiproduce.shop", pageWidth - MARGIN, 16, { align: "right" })

    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.3)
    doc.line(MARGIN, HEADER_HEIGHT, pageWidth - MARGIN, HEADER_HEIGHT)

    doc.setFontSize(5)
    doc.text(
      `Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`,
      pageWidth - MARGIN,
      HEADER_HEIGHT - 2,
      { align: "right" },
    )
  }

  const formatCurrencyValue = (val: number) => `$${val?.toFixed(2)}`

  // Group products by category and sort alphabetically within each category
  const productsByCategory: Record<string, PriceListProduct[]> = {}
  template.products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = []
    }
    productsByCategory[product.category].push(product)
  })

  // Sort products alphabetically within each category
  Object.keys(productsByCategory).forEach((category) => {
    productsByCategory[category].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Get all categories and sort them
  const allCategories = Object.keys(productsByCategory)

  // Sort categories by priority (you can adjust this order as needed)
  const categoryPriority: Record<string, number> = {
    VEGETABLE: 1,
    FRUITS: 2,
    "INDIAN SNACKS": 3,
    "JUICES & DRINKS": 4,
    PEPPERS: 5,
    ONIONS: 6,
    POTATOES: 7,
    "GINGER & GARLIC": 8,
    LETTUCE: 9,
  }

  // Sort categories by priority, then by size for categories without explicit priority
  const sortedCategories = allCategories.sort((a, b) => {
    const priorityA = categoryPriority[a.toUpperCase()] || 100
    const priorityB = categoryPriority[b.toUpperCase()] || 100

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    // If same priority or no priority defined, sort by number of products
    return productsByCategory[b].length - productsByCategory[a].length
  })

  // Draw header on first page
  drawHeader()
  const SINGLE_ROW_HEIGHT = (() => {
    const tempDoc = new jsPDF()
    autoTable(tempDoc, {
      startY: 0,
      head: [],
      body: [["SAMPLE", "$0.00", ""]],
      tableWidth: columnWidth,
      styles: { fontSize: TABLE_FONT_SIZE, cellPadding: ROW_PADDING },
    })
    return tempDoc.lastAutoTable?.finalY ?? 4
  })()
  
  const CATEGORY_HEADER_HEIGHT = (() => {
    const tempDoc = new jsPDF()
    autoTable(tempDoc, {
      startY: 0,
      body: [[{ content: "CATEGORY", colSpan: 3 }]],
      tableWidth: columnWidth,
      styles: { fontSize: TABLE_FONT_SIZE, cellPadding: ROW_PADDING },
    })
    return tempDoc.lastAutoTable?.finalY ?? 6
  })()
  
  const TABLE_HEADER_HEIGHT = (() => {
    const tempDoc = new jsPDF()
    autoTable(tempDoc, {
      startY: 0,
      head: [["DESCRIPTION", "PRICE", "QTY"]],
      body: [],
      tableWidth: columnWidth,
      styles: { fontSize: TABLE_FONT_SIZE, cellPadding: ROW_PADDING },
    })
    return tempDoc.lastAutoTable?.finalY ?? 6
  })()
  
  const measureProductHeight = () => SINGLE_ROW_HEIGHT
  const measureCategoryHeaderHeight = () => CATEGORY_HEADER_HEIGHT
  const measureTableHeaderHeight = () => TABLE_HEADER_HEIGHT
  

  // Function to render a category
  const renderCategory = (categoryName: string, products: PriceListProduct[], x: number, y: number): number => {
    const rows = [
      [
        {
          content: categoryName.toUpperCase(),
          colSpan: 3,
          styles: {
            halign: "left",
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            fontSize: TABLE_FONT_SIZE + 1, // Make category header slightly larger
          },
        },
      ],
      ...products.map((product) => [
        { content: product.name.toUpperCase(), styles: { fontStyle: "bold" } },
        {
          content: `${formatCurrencyValue(product[price] || product.pricePerBox)}`,
          styles: { fontStyle: "bold", halign: "center" },
        },
        { content: "", styles: { fontStyle: "bold", halign: "center" } },
      ]),
    ]

    autoTable(doc, {
      startY: y,
      head: products.length > 0 ? [["DESCRIPTION", "PRICE", "QTY"]] : [],
      body: rows,
      margin: { top: HEADER_HEIGHT + 2, left: x, right: MARGIN },
      tableWidth: columnWidth,
      styles: {
        fontSize: TABLE_FONT_SIZE,
        cellPadding: ROW_PADDING,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: columnWidth * 0.55 },
        1: { cellWidth: columnWidth * 0.16, halign: "center" },
        2: { cellWidth: columnWidth * 0.2, halign: "center" },
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        cellPadding: ROW_PADDING,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      didDrawPage: () => drawHeader(),
    })

    return doc.lastAutoTable?.finalY ?? y + 10 // Default if measurement fails
  }

  // Function to calculate category height
  const calculateCategoryHeight = (category: string, products: PriceListProduct[]): number => {
    const categoryHeaderHeight = measureCategoryHeaderHeight(category)
    const tableHeaderHeight = measureTableHeaderHeight()

    let totalProductsHeight = 0
    products.forEach((product) => {
      totalProductsHeight += measureProductHeight(product)
    })

    return categoryHeaderHeight + tableHeaderHeight + totalProductsHeight + 2 // +2 for spacing
  }

  // Improved layout function to maximize space usage
  const layoutCategories = () => {
    let leftY = startY
    let rightY = startY
    let currentPage = 1
  
    const categoriesToProcess = [...sortedCategories]
    let retryCount = 0
    const MAX_RETRIES = 5
  
    while (categoriesToProcess.length > 0) {
      let bestFitFound = false
  
      for (let i = 0; i < categoriesToProcess.length; i++) {
        const category = categoriesToProcess[i]
        const products = productsByCategory[category]
        const categoryHeight = calculateCategoryHeight(category, products)
  
        if (categoryHeight <= MAX_Y - leftY) {
          const newY = renderCategory(category, products, leftColumnX, leftY)
          leftY = newY + 2
          categoriesToProcess.splice(i, 1)
          bestFitFound = true
          retryCount = 0
          break
        }
  
        if (categoryHeight <= MAX_Y - rightY) {
          const newY = renderCategory(category, products, rightColumnX, rightY)
          rightY = newY + 2
          categoriesToProcess.splice(i, 1)
          bestFitFound = true
          retryCount = 0
          break
        }
      }
  
      if (!bestFitFound) {
        retryCount++
        if (retryCount >= MAX_RETRIES) {
          // Force page break
          doc.addPage()
          drawHeader()
          currentPage++
          leftY = startY
          rightY = startY
          retryCount = 0
          continue
        }
  
        const smallestCategory = categoriesToProcess[0]
        const products = productsByCategory[smallestCategory]
        const categoryHeight = calculateCategoryHeight(smallestCategory, products)
  
        if (categoryHeight > MAX_Y - leftY && categoryHeight > MAX_Y - rightY) {
          doc.addPage()
          drawHeader()
          currentPage++
          leftY = startY
          rightY = startY
          retryCount = 0
        } else {
          const leftSpace = MAX_Y - leftY
          const rightSpace = MAX_Y - rightY
          const newY = leftSpace >= rightSpace
            ? renderCategory(smallestCategory, products, leftColumnX, leftY)
            : renderCategory(smallestCategory, products, rightColumnX, rightY)
  
          if (leftSpace >= rightSpace) leftY = newY + 2
          else rightY = newY + 2
  
          categoriesToProcess.shift()
          retryCount = 0
        }
      }
  
      if (MAX_Y - leftY < 30 && MAX_Y - rightY < 30 && categoriesToProcess.length > 0) {
        doc.addPage()
        drawHeader()
        currentPage++
        leftY = startY
        rightY = startY
      }
    }
  }
  

  // Execute the layout algorithm
  layoutCategories()

  // Add footer to all pages
  const totalPagesCount = doc.getNumberOfPages()
  for (let i = 1; i <= totalPagesCount; i++) {
    doc.setPage(i)

    // Add page numbers
    doc.setFontSize(6)
    doc.text(`Page ${i} of ${totalPagesCount}`, pageWidth - MARGIN, 22, { align: "right" })

    // Add footer text
    const footerY = pageHeight - 6
    doc.setFontSize(6)
    doc.setFont("helvetica", "italic")
    doc.text(
      "Pricing and availability subject to change without prior notice. © Vali Produce",
      pageWidth / 2,
      footerY,
      { align: "center" },
    )
  }

  doc.save(`vali-produce-price-list-${template.name.toLowerCase().replace(/\s+/g, "-")}.pdf`)
  return doc
}
