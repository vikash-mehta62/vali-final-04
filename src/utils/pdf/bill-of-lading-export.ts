import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "@/lib/data";
import { PalletData } from "@/components/orders/PalletTrackingForm";

export const exportBillOfLadingToPDF = (
  order: Order,
  data: {
    bolNumber: string;
    shipperName: string;
    shipperAddress: string;
    shipperCity: string;
    shipperState: string;
    shipperZip: string;
    consigneeName: string;
    consigneeAddress: string;
    consigneeCity: string;
    consigneePhone?: string;
    consigneeState: string;
    consigneeZip: string;
    carrierName: string;
    trailerNumber: string;
    sealNumber?: string;
    freightTerms: "Prepaid" | "Collect" | "Third Party";
    specialInstructions?: string;
    hazardousMaterials: boolean;
    signatureShipper: string;
    totalQuantity?: string;
    serviceLevel: "Standard" | "Expedited" | "Same Day";
    palletData?: PalletData; // Added pallet data
    palletCharges?: {
      chargePerPallet: number;
      totalCharge: number;
    };
  }
) => {
  const doc = new jsPDF();
const PAGE_WIDTH = doc.internal.pageSize.width;
const PAGE_HEIGHT = doc.internal.pageSize.height;
const MARGIN = 8;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
let yPos = 15;

const addPageIfNeeded = (extraHeight = 30) => {
  if (yPos + extraHeight >= PAGE_HEIGHT - 15) {
    doc.addPage();
    yPos = 15;
  }
};

const logoUrl = "/logg.png";
const logoWidth = 23;
const logoHeight = 23;
const xCenter = (PAGE_WIDTH / 2.5) - (logoWidth / 2.5);
doc.addImage(logoUrl, "PNG", xCenter, 0, 0, 23);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BILL OF LADING", MARGIN + CONTENT_WIDTH - 10, 15, {
    align: "right",
  });
  yPos += 1;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `B/L #: ${data.bolNumber} • Date: ${new Date(
      order.date
    ).toLocaleDateString()}`,
    MARGIN + CONTENT_WIDTH - 10,
    yPos + 4,
    { align: "right" }
  );
  yPos += 12;

  const columnWidth = CONTENT_WIDTH / 2 - 2;

  addPageIfNeeded(36);

  // Shipper box
  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN, yPos, columnWidth, 30, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("SHIPPER", MARGIN + 4, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(data.shipperName, MARGIN + 4, yPos + 12);
  doc.text(data.shipperAddress, MARGIN + 4, yPos + 18);
  doc.text(
    `${data.shipperCity}, ${data.shipperState} ${data.shipperZip}`,
    MARGIN + 4,
    yPos + 24
  );

  // Consignee box
  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN + columnWidth + 4, yPos, columnWidth, 30, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("CONSIGNEE", MARGIN + columnWidth + 8, yPos + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(data.consigneeName, MARGIN + columnWidth + 8, yPos + 12);
  doc.text(data.consigneeAddress, MARGIN + columnWidth + 8, yPos + 18);
  doc.text(
    `${data.consigneeCity}, ${data.consigneeState} ${data.consigneeZip}`,
    MARGIN + columnWidth + 8,
    yPos + 24
  );
  doc.text(data?.consigneePhone, MARGIN + columnWidth + 8, yPos + 28);

  yPos += 36;
  addPageIfNeeded(28);

  // Carrier Information
  doc.setFillColor(230, 240, 255);
  doc.rect(MARGIN, yPos, CONTENT_WIDTH, 22, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  // doc.text('CARRIER INFORMATION', MARGIN + 4, yPos + 6);

  // doc.setFont('helvetica', 'normal');
  // doc.setFontSize(8);
  // doc.text(`Carrier: ${data.carrierName}`, MARGIN + 4, yPos + 14);
  // doc.text(`Trailer #: ${data.trailerNumber}`, MARGIN + CONTENT_WIDTH / 3, yPos + 14);
  // doc.text(`Service: ${data.serviceLevel}`, MARGIN + (CONTENT_WIDTH / 3) * 2, yPos + 14);

  // yPos += 28;

  // Add pallet information if available
  if (data.palletData) {
    doc.setFillColor(230, 255, 240);
    doc.rect(MARGIN, yPos, CONTENT_WIDTH, 22, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("PALLET INFORMATION", MARGIN + 4, yPos + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    // Display pallet info
    doc.text(`Pallets: ${data.palletData.palletCount}`, MARGIN + 4, yPos + 14);
    doc.text(
      `Total Boxes: ${data.palletData.totalBoxes}`,
      MARGIN + CONTENT_WIDTH / 3,
      yPos + 14
    );

    if (data.palletCharges) {
      doc.text(
        `Charge Per Pallet: $${data.palletCharges.chargePerPallet.toFixed(2)}`,
        MARGIN + (CONTENT_WIDTH / 3) * 1.5,
        yPos + 14
      );
      doc.text(
        `Total Charges: $${data.palletCharges.totalCharge.toFixed(2)}`,
        MARGIN + (CONTENT_WIDTH / 3) * 2.3,
        yPos + 14
      );
    }

    yPos += 28;
  }

  // Commodity Table
  const tableHeaders = [
    { header: "Quantity", dataKey: "pieces" },
    { header: "Description", dataKey: "description" },
    // { header: 'Weight', dataKey: 'weight' },
    // { header: 'NMFC', dataKey: 'nmfc' },
    // { header: 'Class', dataKey: 'class' },
    // { header: 'HM', dataKey: 'hazardous' }
  ];

  const tableRows = order.items.map((item) => {
    // Get box count from pallet data if available
    const boxCount =
      data.palletData?.boxesPerPallet[item.productId] ||
      item.quantity.toString();

    return [
      boxCount.toString(),
      item.productName,
      `${Math.round(item.quantity * 2)} lbs`,
      "157250",
      "50",
      data.hazardousMaterials ? "X" : "",
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders.map((col) => col.header)],
    body: tableRows,
    styles: {
      lineColor: [0, 0, 0], // RGB for black color

      lineWidth: 0.1,
    },
    foot: [[`${data.totalQuantity}`, "Total", "", "", "", ""]],
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontSize: 9,
      fontStyle: "bold",
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 9,
      fontStyle: "bold",
      textColor: [0, 0, 0],
      fillColor: false, // removes the gray background
      cellPadding: 1,
    },
    footStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "center" },
      4: { cellWidth: 25, halign: "center" },
      5: { cellWidth: 20, halign: "center" },
    },
  });

  yPos = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : yPos + 50;
  addPageIfNeeded(30);

  // Special Instructions
  if (data.specialInstructions) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("SPECIAL INSTRUCTIONS:", MARGIN, yPos);

    doc.setFont("helvetica", "bold");
    doc.setFillColor(245, 245, 245);
    doc.rect(MARGIN, yPos + 3, CONTENT_WIDTH, 12, "F");
    doc.text(data.specialInstructions, MARGIN + 3, yPos + 10);
    yPos += 20;
  }

  addPageIfNeeded(30);

  // Signature and Date
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setFont("helvetica", "italic");
  // doc.text(data.signatureShipper, MARGIN + 4, yPos + 10);
  // doc.setFont("helvetica", "bold");
  // doc.text(`Date: ${new Date().toLocaleDateString()}`, MARGIN + 100, yPos + 10);

  // Footer
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text(
    "BOL is subject to terms and conditions of the carrier. This is a computer-generated document.",
    PAGE_WIDTH / 2,
    footerY,
    { align: "center" }
  );

  // Page Numbers
  const totalPagesCount = doc.getNumberOfPages();
  for (let i = 1; i <= totalPagesCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPagesCount}`, PAGE_WIDTH - MARGIN, 7, {
      align: "right",
    });
  }

  doc.save(`bill-of-lading-${order.id} ${data.consigneeName}.pdf`);

  return doc;
};
