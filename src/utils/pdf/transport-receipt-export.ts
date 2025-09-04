
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/lib/data';

export const exportTransportationReceiptToPDF = (
  order: Order, 
  transportData: {
    driverName: string;
    vehicleId: string;
    departureDate: string;
    estimatedArrival: string;
    notes?: string;
    signature: string;
    transportCompany?: string;
    deliveryLocation?: string;
    routeNumber?: string;
    packagingType?: string;
    temperatureRequirements?: string;
  },
  receiptType: 'standard' | 'detailed' | 'qr' = 'standard'
) => {
  const doc = new jsPDF();
  
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 12; // Reduced margin
  const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN);
  
  let yPos = 15; // Reduced top margin
  
  const logoUrl = "/logg.png"; // Yahan apna actual path dalen
  doc.addImage(logoUrl, "PNG", MARGIN - 8, 0, 0, 23); // Shifted 5 units more to the left

yPos = yPos +10
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TRANSPORTATION RECEIPT', 40, 15);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Order #${order.id}${transportData.routeNumber ? ` • Route #${transportData.routeNumber}` : ''}`, MARGIN, yPos );
  
  const orderDate = new Date(order.date);
const dateObj = new Date(orderDate);
const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
doc.text(`Date: ${formattedDate}`, MARGIN, yPos + 5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 98, 255);
  doc.text('Valli Produce ', PAGE_WIDTH - MARGIN, yPos - 10, { align: 'right' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('4300 Pleasantdale Rd', PAGE_WIDTH - MARGIN, yPos -5 , { align: 'right' });
  doc.text('Atlanta, GA 30340, USA', PAGE_WIDTH - MARGIN, yPos , { align: 'right' });
  

  

  yPos += 10;
  
  // More compact transport and client details
  const columnWidth = CONTENT_WIDTH / 2 - 2;
  
  // Transport details box
  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN, yPos, columnWidth, 36, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 70, 70);
  doc.text('Transport Details', MARGIN + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  // Compact 2-column layout for transport details
  doc.text(`Driver: ${transportData.driverName}`, MARGIN + 4, yPos + 14);
  doc.text(`Vehicle: ${transportData.vehicleId}`, MARGIN + columnWidth/2, yPos + 14);
const departureDateObj = new Date(transportData.departureDate);
const estimatedArrivalObj = new Date(transportData.estimatedArrival);

const formattedDeparture = `${String(departureDateObj.getMonth() + 1).padStart(2, '0')}/${String(departureDateObj.getDate()).padStart(2, '0')}/${departureDateObj.getFullYear()}`;
const formattedArrival = `${String(estimatedArrivalObj.getMonth() + 1).padStart(2, '0')}/${String(estimatedArrivalObj.getDate()).padStart(2, '0')}/${estimatedArrivalObj.getFullYear()}`;

doc.text(`Departure: ${formattedDeparture}`, MARGIN + 4, yPos + 21);
doc.text(`Est. Arrival: ${formattedArrival}`, MARGIN + columnWidth / 2, yPos + 21);

  if (receiptType === 'detailed' && transportData.temperatureRequirements) {
    doc.text(`Temp Req: ${transportData.temperatureRequirements}`, MARGIN + 4, yPos + 28);
  }
  
  // Client details box
  doc.setFillColor(245, 245, 245);
  doc.rect(MARGIN + columnWidth + 4, yPos, columnWidth, 36, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 70, 70);
  doc.text('Client Details', MARGIN + columnWidth + 8, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  // Compact 2-column layout for client details
  doc.text(`Name: ${order.clientName}`, MARGIN + columnWidth + 8, yPos + 14);
  doc.text(`ID: ${order.store._id}`, MARGIN + columnWidth + columnWidth/2, yPos + 14);
const orderDateObj = new Date(order.date);
const formattedOrderDate = `${String(orderDateObj.getMonth() + 1).padStart(2, '0')}/${String(orderDateObj.getDate()).padStart(2, '0')}/${orderDateObj.getFullYear()}`;
doc.text(`Order Date: ${formattedOrderDate}`, MARGIN + columnWidth + 8, yPos + 21);

  doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, MARGIN + columnWidth + columnWidth/2, yPos + 21);
  
  if (transportData.deliveryLocation) {
    doc.text(`Location: ${transportData.deliveryLocation}`, MARGIN + columnWidth + 8, yPos + 28);
  }
  
  yPos += 38;
  
  const tableHeaders = [
    { header: 'Item', dataKey: 'item' },
    { header: 'Qty', dataKey: 'quantity' }
  ];
  
  if (receiptType === 'detailed') {
    tableHeaders.push(
      { header: 'Weight', dataKey: 'weight' },
      { header: 'Package', dataKey: 'packageType' }
    );
  }
  
  const tableRows = order.items.map(item => {
    const row = [
      item.productName,
      item.quantity.toString()
    ];
    
    if (receiptType === 'detailed') {
      row.push(
        `~${item.quantity * 2} lbs`,
        transportData.packagingType || 'Standard'
      );
    }
    
    return row;
  });
  
  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders.map(col => col.header)],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255],
      fontStyle: 'bold' as 'bold',
      lineWidth: 0.1,
      fontSize: 8
    },
    bodyStyles: {
      lineWidth: 0.1,
      fontSize: 8
    },
    columnStyles: receiptType === 'detailed' ? {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'center' }
    } : {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    yPos = doc.lastAutoTable.finalY + 6;
  } else {
    yPos += 50;
  }
  
  if (transportData.notes) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Special Instructions:', MARGIN, yPos);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(245, 245, 245);
    doc.rect(MARGIN, yPos + 4, CONTENT_WIDTH, 12, 'F');
    doc.text(transportData.notes, MARGIN + 4, yPos + 11);
    
    yPos += 20;
  }
  
  // Signature and status section - more compact
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Confirmed By:', MARGIN, yPos);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(transportData.signature, MARGIN + 35, yPos);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Digital signature', MARGIN + 35, yPos + 5);
  
  // doc.setFontSize(11);
  // doc.setFont('helvetica', 'bold');
  // doc.setTextColor(46, 158, 46);
  // doc.text('DELIVERED', PAGE_WIDTH - MARGIN, yPos, { align: 'right' });
  
  if (receiptType === 'qr') {
    // QR code would be added here in a real implementation
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(MARGIN, yPos + 10, 35, 35, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('QR Code for tracking', MARGIN + 17.5, yPos + 50, { align: 'center' });
  }
  
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text('This document serves as proof of delivery. Please retain for your records.', PAGE_WIDTH / 2, footerY, { align: 'center' });
  
  doc.save(`transportation-receipt-${order.id}.pdf`);
  
  return doc;
};
