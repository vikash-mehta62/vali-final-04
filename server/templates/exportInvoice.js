
const { jsPDF } = require('jspdf');
require('jspdf-autotable'); // This is the correct import for Node.js
const sharp = require('sharp');
const fs = require("fs")
const path = require("path")

 const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

exports.exportInvoiceToPDFBackend = async(
  order,
  
) => {
  const 
    includeHeader = true,
    includeCompanyDetails = true,
    includePaymentTerms = true,
    includeLogo = true,
    includeSignature = false,
    dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoiceTemplate = 'standard'
  

  const doc = new jsPDF();

  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 12; // Reduced margin
  const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN);
  const centerX = PAGE_WIDTH / 2;
  const rightX = PAGE_WIDTH - MARGIN;
  const leftX = MARGIN;


  let yPos = 15; // Reduced top margin
//   if (includeLogo) {
//     const logoUrl = "/logg.png";
//     const logoHeight = 23;
//     const logoWidth = 0; // Assuming square logo. You can adjust this as per your actual image ratio.
  
//     // Center the logo horizontally
//     const centerX = PAGE_WIDTH / 2;
//     doc.addImage(logoUrl, "PNG", centerX - 23 / 2, 5, logoWidth, logoHeight);
//   }
  

      const logoPath = path.join(__dirname, "../images/logo.webp");
      if (!fs.existsSync(logoPath)) {
        console.error("Image file not found:", logoPath);
        return;
      }
  
      // Convert WEBP to PNG base64
      const logoBuffer = await sharp(logoPath)
        .resize(150)  // Resize if needed
        .toFormat('png')
        .toBuffer();
  
      const logoBase64 = logoBuffer.toString('base64');
  
      const logoHeight = 23;
      const logoWidth = 0;  // Assuming square logo. Adjust as needed.
   
  
      // Center the logo horizontally
      doc.addImage(logoBase64, 'PNG',centerX - 23 / 2, 5,  logoWidth, logoHeight);
  
  


  // MARGIN - 8, 0, 0, 23

  
  // ----------- LEFT SIDE: INVOICE DETAILS -----------
  if (order) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(invoiceTemplate === 'professional' ? 41 : 0, 98, 255);
    doc.text('INVOICE', leftX, yPos + 2);
  
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Invoice #: ${order.id}`, leftX, yPos + 7);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, leftX, yPos + 11);
  
    if (false && includePaymentTerms && dueDate) {
      const dueDateObj = new Date(dueDate);
      doc.text(`Due Date: ${dueDateObj.toLocaleDateString()}`, leftX, yPos + 15);
    }
  }
  
  // ----------- RIGHT SIDE: COMPANY DETAILS -----------
  if (includeCompanyDetails) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 98, 255);
    doc.text('Vali Produce', rightX, yPos + 2, { align: 'right' });
  
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('4300 Pleasantdale Rd,', rightX, yPos + 7, { align: 'right' });
    doc.text('Atlanta, GA 30340, USA', rightX, yPos + 11, { align: 'right' });
    doc.text('order@valiproduce.shop', rightX, yPos + 15, { align: 'right' });
  }
  
  // Update yPos for next content
  yPos += 25;
  
  
  
 
  // ----------- INVOICE DETAILS UNDERNEATH -----------







  // Client info section - more compact
  doc.setFillColor(245, 245, 245);
  if (invoiceTemplate === 'professional') {
    doc.setFillColor(240, 247, 255);
  }
 // Bill To Box
 const boxHeight = 40;
 doc.roundedRect(MARGIN, yPos, CONTENT_WIDTH, boxHeight, 2, 2, 'F'); 
 
 // Font settings
 doc.setFontSize(9);
 doc.setTextColor(50, 50, 50);
 
 // ---------- BILL TO ----------
 let billToX = MARGIN + 4;
 let billToY = yPos + 6;
 

 // ---------- SOLD TO ----------
doc.setFont('helvetica', 'bold');
doc.text('Sold To:', billToX, billToY);

doc.setFont('helvetica', 'bold');
doc.text(order?.billingAddress?.name || 'N/A', billToX, billToY + 6);
doc.text(order?.billingAddress?.address || 'N/A', billToX, billToY + 11);
doc.text(`${order?.billingAddress?.city || ''}, ${order?.billingAddress?.state || ''} ${order?.billingAddress?.postalCode || ''}`, billToX, billToY + 16);
doc.text(`Phone: ${order?.billingAddress?.phone || 'N/A'}`, billToX, billToY + 21);

// ---------- SHIP TO ----------
let shipToX = PAGE_WIDTH / 2 + 4;
let shipToY = yPos + 6;

doc.setFont('helvetica', 'bold');
doc.text('Ship To:', shipToX, shipToY);

doc.setFont('helvetica', 'bold');
doc.text(order?.shippingAddress?.name || 'N/A', shipToX, shipToY + 6);
doc.text(order?.shippingAddress?.address || 'N/A', shipToX, shipToY + 11);
doc.text(`${order?.shippingAddress?.city || ''}, ${order?.shippingAddress?.state || ''} ${order?.shippingAddress?.postalCode || ''}`, shipToX, shipToY + 16);
doc.text(`Phone: ${order?.shippingAddress?.phone  || 'N/A'}`, shipToX, shipToY + 21);

 // Move yPos below box
 yPos += boxHeight + 5;
 
// yPos ko update kiya taki agla content overlap na ho



  const tableHeaders = [
    { header: 'Item', dataKey: 'item' },
    { header: 'Qty', dataKey: 'quantity' }, // Shortened header
    { header: 'Price', dataKey: 'unitPrice' }, // Shortened header
    { header: 'Amount', dataKey: 'amount' }
  ];

  const tableRows = order.items.map(item => [
    item.name || item.productName,
   `${item.quantity}${item.pricingType && item.pricingType !== "box" ? " " + (item.pricingType === "unit" ? "LB" : item.pricingType) : ""}`,
    formatCurrency(item.unitPrice || item.price),
    formatCurrency(item.quantity * (item.unitPrice || item.price))
  ]);
  
  

  let headerStyles = {
    fillColor: [245, 245, 245],
    textColor: [70, 70, 70],
    fontStyle: 'bold' ,
       lineWidth: 0.4,          
  lineColor: [50, 50, 50],  
    fontSize: 8 // Smaller font size for table headers
  };

  if (invoiceTemplate === 'professional') {
    headerStyles.fillColor = [41, 98, 255];
    headerStyles.textColor = [255, 255, 255];
  } else if (invoiceTemplate === 'minimal') {
    headerStyles.fillColor = [255, 255, 255];
    headerStyles.textColor = [50, 50, 50];
  }

  doc.autoTable( {
    startY: yPos,
    head: [tableHeaders.map(col => col.header)],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: headerStyles,
    bodyStyles: {
      lineWidth: 0.4,          
  lineColor: [50, 50, 50],  
      fontSize: 10, // Smaller font size for table body
      fontStyle: 'bold' // Make body text bold
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: invoiceTemplate === 'minimal' ? [255, 255, 255] : [250, 250, 250]
    },
    didDrawPage: function () {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, doc.internal.pageSize.height - 8, { align: 'right' });
      }
    }
  });
  

  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    yPos = doc.lastAutoTable.finalY + 8; // Reduced spacing
  } else {
    yPos += 50;
  }

  const subTotal = order.total - order.shippinCost ;
  const ShippingCost = order.shippinCost;
  const allTotal = subTotal+ ShippingCost
  // const taxRate = includePaymentTerms ? 0.085 : 0;
  const taxRate = includePaymentTerms ? 0 : 0;
  const taxAmount = subTotal * taxRate;
  const totalAmount = subTotal ;

  doc.setFontSize(9);

  doc.text('Subtotal:', PAGE_WIDTH - MARGIN - 60, yPos);
  doc.text(formatCurrency(subTotal), PAGE_WIDTH - MARGIN, yPos, { align: 'right' });
  yPos += 5;
  doc.text('Shipping Cost:', PAGE_WIDTH - MARGIN - 60, yPos);
  doc.text(formatCurrency(ShippingCost), PAGE_WIDTH - MARGIN, yPos, { align: 'right' });
  yPos += 5;

  // if (includePaymentTerms) {
  //   doc.text('Tax (8.5%):', PAGE_WIDTH - MARGIN - 60, yPos);
  //   doc.text(formatCurrency(taxAmount), PAGE_WIDTH - MARGIN, yPos, { align: 'right' });
  //   yPos += 5;
  // }

// Draw total line and amount first
doc.setLineWidth(0.5);
doc.line(PAGE_WIDTH - MARGIN - 60, yPos - 2, PAGE_WIDTH - MARGIN, yPos - 2);

doc.setFont('helvetica', 'bold');
doc.text('Total:', PAGE_WIDTH - MARGIN - 60, yPos + 4);
doc.text(formatCurrency(allTotal), PAGE_WIDTH - MARGIN, yPos + 4, { align: 'right' });

// // Show payment status on the right side (same line as Total)
// const paymentStatusText = order.paymentStatus === 'paid' ? 'Paid' : 'Pending';

// // Set text color based on status
// if (order.paymentStatus === 'paid') {
//   doc.setTextColor(0, 128, 0); // Green
// } else {
//   doc.setTextColor(255, 0, 0); // Red
// }

// doc.setFont('helvetica', 'bold');
// doc.text(`Payment Status: ${paymentStatusText}`, PAGE_WIDTH - MARGIN, yPos + 4 + 6, { align: 'right' });

// yPos += 12;

// // Reset text color for other content
// doc.setTextColor(0, 0, 0); 

// // Now display payment details
// if (order.paymentStatus === 'paid' && order.paymentDetails) {
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(40, 40, 120); // Navy Blue for section title
//   doc.text('Payment Details:', PAGE_WIDTH - MARGIN - 60, yPos + 4);
//   yPos += 6;

//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(0, 0, 0); // Back to black

//   // Method
//   doc.text(`Method: ${order.paymentDetails.method}`, PAGE_WIDTH - MARGIN - 60, yPos + 4);
//   yPos += 6;

//   // If cash, show notes
//   if (order.paymentDetails.method === 'cash' && order.paymentDetails.notes) {
//     doc.setTextColor(80, 80, 80); // Dark gray for notes
//     doc.text(`Notes: ${order.paymentDetails.notes}`, PAGE_WIDTH - MARGIN - 60, yPos + 4);
//     yPos += 6;
//   }

//   // If creditcard, show transaction ID
//   if (order.paymentDetails.method === 'creditcard' && order.paymentDetails.transactionId) {
//     doc.setTextColor(0, 0, 0); // Reset for transaction ID
//     doc.text(`Transaction ID: ${order.paymentDetails.transactionId}`, PAGE_WIDTH - MARGIN - 60, yPos + 4);
//     yPos += 6;
//   }
// }


  // if (includePaymentTerms) {
  //   yPos += 15;
  //   doc.setFontSize(8);
  //   doc.setFont('helvetica', 'normal');
  //   doc.setTextColor(100, 100, 100);
  //   doc.text('Thank you for your business! Payment is due within 30 days of invoice date.', PAGE_WIDTH / 2, yPos, { align: 'center' });
  // }

  if (includeSignature) {
    yPos += 15;
    doc.setLineWidth(0.1);
    doc.line(PAGE_WIDTH - MARGIN - 60, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += 4;
    doc.setFontSize(7);
    doc.text('Authorized Signature', PAGE_WIDTH - MARGIN - 30, yPos, { align: 'center' });
  }

  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated document. No signature is required.', PAGE_WIDTH / 2, footerY, { align: 'center' });

//   doc.save(`fgfjgf-${order.id}.pdf`);


  const pdfBase64 = doc.output("datauristring").split(",")[1]
     return pdfBase64
};
