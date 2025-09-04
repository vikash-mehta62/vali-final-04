import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportWorkOrderToPDF = (order, options, isPreview = false) => {
  const doc = new jsPDF();

  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 12;
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

  const logoUrl = "/logg.png";
  const logoHeight = 23;
  const logoWidth = 0; // Assuming square logo. You can adjust this as per your actual image ratio.
  const rightX = PAGE_WIDTH - MARGIN;
  const leftX = MARGIN;

  let yPos = 15;
  const centerX = PAGE_WIDTH / 2;
  doc.addImage(logoUrl, "PNG", centerX - 23 / 2, 5, logoWidth, logoHeight);

  // ----------- LEFT SIDE: INVOICE DETAILS -----------
  if (true) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41);
    doc.text("WORK ORDER", leftX, yPos + 2);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`WO #: ${order.orderNumber}`, leftX, yPos + 7);
const dateObj = new Date(order.date);
const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // 0-based month
const day = String(dateObj.getDate()).padStart(2, '0');
const year = dateObj.getFullYear();
const formattedDate = `${month}/${day}/${year}`;

doc.text(`Date: ${formattedDate}`, leftX, yPos + 11);

  }

  // ----------- RIGHT SIDE: COMPANY DETAILS -----------
  if (true) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 98, 255);
    doc.text("Vali Produce", rightX, yPos + 2, { align: "right" });

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("4300 Pleasantdale Rd,", rightX, yPos + 7, { align: "right" });
    doc.text("Atlanta, GA 30340, USA", rightX, yPos + 11, { align: "right" });
    doc.text("order@valiproduce.shop", rightX, yPos + 15, { align: "right" });
  }

  yPos += 20;

  // Order and assignment information
  const columnWidth = CONTENT_WIDTH / 2 - 2;

  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN, yPos, columnWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("Order Information:", MARGIN + 4, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`Order #: ${order.id}`, MARGIN + 4, yPos + 12);
  doc.text(`Client: ${order.clientName}`, MARGIN + 4, yPos + 18);
  doc.text(`Order Date: ${order.date}`, MARGIN + 4, yPos + 24);

  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN + columnWidth + 4, yPos, columnWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Assignment Details:", MARGIN + columnWidth + 8, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    `Assigned To: ${options.assignedTo}`,
    MARGIN + columnWidth + 8,
    yPos + 12
  );

  if (options.department) {
    doc.text(
      `Department: ${options.department}`,
      MARGIN + columnWidth + 8,
      yPos + 18
    );
  }

  if (options.priority) {
    const priorityColor = {
      low: [0, 128, 0], // Green
      medium: [255, 165, 0], // Orange
      high: [255, 69, 0], // Red-Orange
      urgent: [255, 0, 0], // Red
    }[options.priority];

    doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Priority: ${options.priority.toUpperCase()}`,
      MARGIN + columnWidth + 8,
      yPos + 24
    );
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
  }

  yPos += 36;

  // Schedule details
  if ((false && options.startDate) || options.dueDate) {
    doc.setFillColor(240, 247, 255);
    doc.rect(MARGIN, yPos, CONTENT_WIDTH, 18, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Schedule Information:", MARGIN + 4, yPos + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    let scheduleText = "";

    if (options.startDate) {
      scheduleText += `Start Date: ${options.startDate}`;
    }

    if (options.startDate && options.dueDate) {
      scheduleText += "   |   ";
    }

    if (options.dueDate) {
      scheduleText += `Due Date: ${options.dueDate}`;
    }

    doc.text(scheduleText, MARGIN + 4, yPos + 14);

    yPos += 24;
  }

  // Equipment needed
  if (false && options.equipmentNeeded && options.equipmentNeeded.length > 0) {
    doc.setFillColor(250, 250, 245);
    doc.rect(
      MARGIN,
      yPos,
      CONTENT_WIDTH,
      18 + (options.equipmentNeeded.length > 2 ? 6 : 0),
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Equipment Needed:", MARGIN + 4, yPos + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const equipmentText = options.equipmentNeeded.join(", ");

    doc.text(equipmentText, MARGIN + 4, yPos + 14, {
      maxWidth: CONTENT_WIDTH - 8,
    });

    yPos += 24 + (options.equipmentNeeded.length > 2 ? 6 : 0);
  }

  // Pallet information section
  if (options.palletData) {
    doc.setFillColor(245, 250, 245); // Light green background
    doc.rect(MARGIN, yPos, CONTENT_WIDTH, 36, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Pallet Information:", MARGIN + 4, yPos + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    doc.text(`Total Pallets:     `, MARGIN + 4, yPos + 14);
    doc.text(`Total Boxes:    `, MARGIN + 70, yPos + 14);
    doc.text(`Charge Per Pallet:   `, MARGIN + 140, yPos + 14);
    doc.text(`Total Pallet Charge:    `, MARGIN + 140, yPos + 22);

    // Box distribution details
    const boxDistribution = Object.entries(options.palletData.boxesPerPallet)
      .map(([productId, count]) => {
        const product = order.items.find(
          (item) => item.productId === productId
        );
        return `${product?.productName || productId}: ${count} boxes`;
      })
      .join(", ");

    doc.text(`Box Distribution:   `, MARGIN + 4, yPos + 22, {
      maxWidth: 130,
    });

    yPos += 34;
  }

  // Items table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Order Items to Process:", MARGIN, yPos);

  yPos += 2;

  // Modified table headers - includes instructions column
  // const tableHeaders = [
  //   { header: 'Product Name', dataKey: 'description' },
  //   { header: 'Qty', dataKey: 'quantity' },
  //   { header: 'Instructions', dataKey: 'instructions' }
  // ];

  const tableHeaders = options.palletData
    ? ["Product Name", "Qty", "Boxes", "Instructions"]
    : ["Item ID", "Qty", "Instructions"];

  const tableRows = order.items.map((item) => {
    const row = [
      item.productName,
      `${item.quantity}${
        item.pricingType && item.pricingType !== "box"
          ? " " + (item.pricingType === "unit" ? "LB" : item.pricingType)
          : ""
      }`,
    ];

    if (options.palletData) {
      row.push(
        options.palletData.boxesPerPallet[item.productId]?.toString() || "0"
      );
    }

    row.push(options.itemInstructions?.[item.productId] || "");

    return row;
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  const colCount = tableHeaders.length;
  const colWidth = contentWidth / colCount;

  const columnStyles = {};
  for (let i = 0; i < colCount; i++) {
    columnStyles[i] = { cellWidth: colWidth };
  }

  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      lineWidth: 0.1,
      fontSize: 8,
    },
    bodyStyles: {
         lineWidth: 0.4,          
  lineColor: [50, 50, 50], 
      textColor: [0, 0, 0],
      fontSize: 8,
      fontStyle: "bold",
    },
    
    columnStyles: columnStyles, // ← dynamically calculated
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
  });

  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    yPos = doc.lastAutoTable.finalY + 10;
  } else {
    yPos += 100;
  }

  // Special instructions
  if (false && options.specialInstructions) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Special Instructions:", MARGIN, yPos);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setFillColor(245, 245, 245);
    doc.rect(MARGIN, yPos + 4, CONTENT_WIDTH, 30, "F");
    doc.text(options.specialInstructions, MARGIN + 4, yPos + 12, {
      maxWidth: CONTENT_WIDTH - 8,
    });

    yPos += 40;
  }

  // Calculate total quantity
  const totalQuantity = order.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  // Move to new line

  // Display total quantity on the left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`Total Box: ${totalQuantity}`, MARGIN, yPos);

  // Signature section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  yPos += 20;
  doc.text("Completion Signatures:", MARGIN, yPos);
  yPos += 5;

  // Create signature boxes
  const signatureWidth = CONTENT_WIDTH / 2 - 5;

  // Box 1: Completed By
  doc.setLineWidth(0.1);
  doc.rect(MARGIN, yPos, signatureWidth, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Completed By:", MARGIN + 4, yPos + 6);
  doc.line(MARGIN + 4, yPos + 16, MARGIN + signatureWidth - 4, yPos + 16);
  doc.text("Signature", MARGIN + 4, yPos + 22);
  doc.text("Date: ________________", MARGIN + signatureWidth - 50, yPos + 22);

  // Box 2: Approved By
  doc.rect(MARGIN + signatureWidth + 10, yPos, signatureWidth, 25);
  doc.text("Approved By:", MARGIN + signatureWidth + 14, yPos + 6);
  doc.line(
    MARGIN + signatureWidth + 14,
    yPos + 16,
    MARGIN + 2 * signatureWidth + 6,
    yPos + 16
  );
  doc.text("Signature", MARGIN + signatureWidth + 14, yPos + 22);
  doc.text(
    "Date: ________________",
    MARGIN + 2 * signatureWidth - 40,
    yPos + 22
  );

  // Footer
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text(
    "This work order is based on Order #" +
      order.id +
      ". Complete all tasks according to company procedures.",
    PAGE_WIDTH / 2,
    footerY,
    { align: "center" }
  );

  // If in preview mode, return the document without saving
  if (isPreview) {
    return doc;
  }

  doc.save(`${options.workOrderNumber} ${order.clientName}.pdf`);

  return doc;
};
