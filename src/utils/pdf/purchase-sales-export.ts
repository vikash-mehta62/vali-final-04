import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/utils/formatters';
import { Expense, WeeklyFinancialData } from '@/types';

interface PurchaseData {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  supplier?: string;
  date: string;
}

interface SalesData {
  id: string;
  orderId: string;
  clientName: string;
  totalSales: number;
  netSales: number;
  discounts?: number;
  date: string;
}

export const exportPurchaseReportToPDF = (
  purchases: PurchaseData[],
  options: {
    title?: string;
    dateRange?: { start: string; end: string };
    includeCompanyDetails?: boolean;
    includeSummary?: boolean;
    includeWeeklyBreakdown?: boolean;
  } = {}
) => {
  const {
    title = 'Purchase Report',
    dateRange,
    includeCompanyDetails = true,
    includeSummary = true,
    includeWeeklyBreakdown = false
  } = options;
  
  const doc = new jsPDF();
  
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 15;
  
  let yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 10;
  
  if (dateRange) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateText = `${dateRange.start} to ${dateRange.end}`;
    doc.text(dateText, PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 10;
  }
  
  if (includeCompanyDetails) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Vali Produce', MARGIN, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('4300 Pleasantdale Rd, Atlanta, GA 30340, United States', MARGIN, yPos + 5);
    doc.text('contact@freshproduce.co', MARGIN, yPos + 10);
    yPos += 20;
  }
  
  const tableHeaders = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Product', dataKey: 'productName' },
    { header: 'Qty', dataKey: 'quantity' },
    { header: 'Unit Price', dataKey: 'unitPrice' },
    { header: 'Total Cost', dataKey: 'totalCost' },
    { header: 'Supplier', dataKey: 'supplier' },
    { header: 'Date', dataKey: 'date' }
  ];
  
  const tableRows = purchases.map(purchase => [
    purchase.id,
    purchase.productName,
    purchase.quantity.toString(),
    formatCurrency(purchase.unitPrice),
    formatCurrency(purchase.totalCost),
    purchase.supplier || '-',
    purchase.date
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders.map(col => col.header)],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 25 },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  });
  
  if (includeSummary && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    const totalCost = purchases.reduce((sum, item) => sum + item.totalCost, 0);
    const totalQuantity = purchases.reduce((sum, item) => sum + item.quantity, 0);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Summary', MARGIN, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Purchases: ${purchases.length}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Quantity: ${totalQuantity}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Cost: ${formatCurrency(totalCost)}`, MARGIN, yPos);
  }
  
  if (includeWeeklyBreakdown && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Breakdown', MARGIN, yPos);
    yPos += 10;
    
    const weeklyData = [
      { week: 'Week 1', purchases: 34250.75, profit: 12580, expenses: 8670 },
      { week: 'Week 2', purchases: 41320.40, profit: 14260, expenses: 9450 },
      { week: 'Week 3', purchases: 38760.90, profit: 13890, expenses: 10210 },
      { week: 'Week 4', purchases: 45980.20, profit: 15720, expenses: 11350 }
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Week', 'Total Purchases', 'Gross Profit', 'Expenses', 'Net Profit']],
      body: weeklyData.map(week => [
        week.week,
        formatCurrency(week.purchases),
        formatCurrency(week.profit),
        formatCurrency(week.expenses),
        formatCurrency(week.profit - week.expenses)
      ]),
      margin: { left: MARGIN, right: MARGIN },
      headStyles: {
        fillColor: [41, 98, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });
  }
  
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text('Generated on ' + new Date().toLocaleDateString(), MARGIN, footerY);
  doc.text('Page 1 of 1', PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  
  return doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportSalesReportToPDF = (
  sales: SalesData[],
  options: {
    title?: string;
    dateRange?: { start: string; end: string };
    includeCompanyDetails?: boolean;
    includeSummary?: boolean;
    includeWeeklyBreakdown?: boolean;
  } = {}
) => {
  const {
    title = 'Sales Report',
    dateRange,
    includeCompanyDetails = true,
    includeSummary = true,
    includeWeeklyBreakdown = false
  } = options;
  
  const doc = new jsPDF();
  
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 15;
  
  let yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 10;
  
  if (dateRange) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateText = `${dateRange.start} to ${dateRange.end}`;
    doc.text(dateText, PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 10;
  }
  
  if (includeCompanyDetails) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Vali Produce', MARGIN, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('4300 Pleasantdale Rd, Atlanta, GA 30340, United States', MARGIN, yPos + 5);
    doc.text('order@freshproduce.co', MARGIN, yPos + 10);
    yPos += 20;
  }
  
  const tableHeaders = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Order ID', dataKey: 'orderId' },
    { header: 'Client', dataKey: 'clientName' },
    { header: 'Total Sales', dataKey: 'totalSales' },
    { header: 'Discounts', dataKey: 'discounts' },
    { header: 'Net Sales', dataKey: 'netSales' },
    { header: 'Date', dataKey: 'date' }
  ];
  
  const tableRows = sales.map(sale => [
    sale.id,
    sale.orderId,
    sale.clientName,
    formatCurrency(sale.totalSales),
    formatCurrency(sale.discounts || 0),
    formatCurrency(sale.netSales),
    sale.date
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders.map(col => col.header)],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [20, 184, 166],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 25 },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    }
  });
  
  if (includeSummary && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    const totalSales = sales.reduce((sum, item) => sum + item.totalSales, 0);
    const totalDiscounts = sales.reduce((sum, item) => sum + (item.discounts || 0), 0);
    const netSales = sales.reduce((sum, item) => sum + item.netSales, 0);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Summary', MARGIN, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Transactions: ${sales.length}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Gross Sales: ${formatCurrency(totalSales)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Discounts: ${formatCurrency(totalDiscounts)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Net Sales: ${formatCurrency(netSales)}`, MARGIN, yPos);
  }
  
  if (includeWeeklyBreakdown && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Profit & Loss', MARGIN, yPos);
    yPos += 10;
    
    const weeklyData = [
      { week: 'Week 1', sales: 28760.50, costs: 16180.75, profit: 12579.75 },
      { week: 'Week 2', sales: 31450.80, costs: 17190.30, profit: 14260.50 },
      { week: 'Week 3', sales: 29870.40, costs: 15980.60, profit: 13889.80 },
      { week: 'Week 4', sales: 33580.60, costs: 17860.20, profit: 15720.40 }
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Week', 'Total Sales', 'Costs', 'Profit', 'Margin %']],
      body: weeklyData.map(week => [
        week.week,
        formatCurrency(week.sales),
        formatCurrency(week.costs),
        formatCurrency(week.profit),
        `${((week.profit / week.sales) * 100).toFixed(1)}%`
      ]),
      margin: { left: MARGIN, right: MARGIN },
      headStyles: {
        fillColor: [20, 184, 166],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'center' }
      }
    });
  }
  
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text('Generated on ' + new Date().toLocaleDateString(), MARGIN, footerY);
  doc.text('Page 1 of 1', PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  
  return doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportWeeklyProfitLossToPDF = (
  weeklyData: Array<{
    week: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
  }>,
  options: {
    title?: string;
    dateRange?: { start: string; end: string };
    includeCompanyDetails?: boolean;
  } = {}
) => {
  const {
    title = 'Weekly Profit & Loss Report',
    dateRange,
    includeCompanyDetails = true
  } = options;
  
  const doc = new jsPDF();
  
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 15;
  
  let yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 10;
  
  if (dateRange) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateText = `${dateRange.start} to ${dateRange.end}`;
    doc.text(dateText, PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 10;
  }
  
  if (includeCompanyDetails) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Vali Produce', MARGIN, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('123 Harvest Lane, Farmington, CA 94123', MARGIN, yPos + 5);
    doc.text('contact@freshproduce.co', MARGIN, yPos + 10);
    yPos += 20;
  }
  
  autoTable(doc, {
    startY: yPos,
    head: [['Week', 'Revenue', 'Expenses', 'Profit', 'Margin %']],
    body: weeklyData.map(week => [
      week.week,
      formatCurrency(week.revenue),
      formatCurrency(week.expenses),
      formatCurrency(week.profit),
      `${week.margin.toFixed(1)}%`
    ]),
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [66, 135, 245],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' }
    }
  });
  
  if (doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    const totalRevenue = weeklyData.reduce((sum, week) => sum + week.revenue, 0);
    const totalExpenses = weeklyData.reduce((sum, week) => sum + week.expenses, 0);
    const totalProfit = weeklyData.reduce((sum, week) => sum + week.profit, 0);
    const averageMargin = totalProfit / totalRevenue * 100;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', MARGIN, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Profit: ${formatCurrency(totalProfit)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Average Profit Margin: ${averageMargin.toFixed(1)}%`, MARGIN, yPos);
  }
  
  if (doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 30;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Performance Visualization', MARGIN, yPos);
    yPos += 10;
    
    const chartWidth = PAGE_WIDTH - (MARGIN * 2);
    const chartHeight = 60;
    const barWidth = chartWidth / weeklyData.length - 5;
    
    const maxValue = Math.max(...weeklyData.map(week => Math.max(week.revenue, week.expenses)));
    
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, yPos, MARGIN, yPos + chartHeight);
    doc.line(MARGIN, yPos + chartHeight, MARGIN + chartWidth, yPos + chartHeight);
    
    weeklyData.forEach((week, index) => {
      const x = MARGIN + (index * (barWidth + 5));
      
      const revenueHeight = (week.revenue / maxValue) * chartHeight;
      doc.setFillColor(65, 105, 225);
      doc.rect(x, yPos + chartHeight - revenueHeight, barWidth / 2, revenueHeight, 'F');
      
      const expensesHeight = (week.expenses / maxValue) * chartHeight;
      doc.setFillColor(220, 20, 60);
      doc.rect(x + (barWidth / 2), yPos + chartHeight - expensesHeight, barWidth / 2, expensesHeight, 'F');
      
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text(week.week, x + (barWidth / 2), yPos + chartHeight + 5, { align: 'center' });
    });
    
    doc.setFillColor(65, 105, 225);
    doc.rect(MARGIN, yPos, 5, 5, 'F');
    doc.text('Revenue', MARGIN + 10, yPos + 4);
    
    doc.setFillColor(220, 20, 60);
    doc.rect(MARGIN + 60, yPos, 5, 5, 'F');
    doc.text('Expenses', MARGIN + 70, yPos + 4);
  }
  
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
 const now = new Date();
doc.text(`Generated on ${formattedDate}`, MARGIN, footerY);

  doc.text('Page 1 of 1', PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  
  return doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportExpenseReportToPDF = (
  expenses: Expense[],
  options: {
    title?: string;
    dateRange?: { start: string; end: string };
    includeCompanyDetails?: boolean;
    includeSummary?: boolean;
    includeWeeklyBreakdown?: boolean;
    categorizeExpenses?: boolean;
  } = {}
) => {
  const {
    title = 'Expense Report',
    dateRange,
    includeCompanyDetails = true,
    includeSummary = true,
    includeWeeklyBreakdown = false,
    categorizeExpenses = true
  } = options;
  
  const doc = new jsPDF();
  
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 15;
  
  let yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 10;
  
  if (dateRange) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateText = `${dateRange.start} to ${dateRange.end}`;
    doc.text(dateText, PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 10;
  }
  
  if (includeCompanyDetails) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Vali Produce', MARGIN, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('123 Harvest Lane, Farmington, CA 94123', MARGIN, yPos + 5);
    doc.text('contact@freshproduce.co', MARGIN, yPos + 10);
    yPos += 20;
  }
  
  const tableHeaders = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Category', dataKey: 'category' },
    { header: 'Description', dataKey: 'description' },
    { header: 'Amount', dataKey: 'amount' },
    { header: 'Payee', dataKey: 'payee' },
    { header: 'Date', dataKey: 'date' },
    { header: 'Reference', dataKey: 'reference' }
  ];
  
  const tableRows = expenses.map(expense => [
    expense.id,
    expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
    expense.description,
    formatCurrency(expense.amount),
    expense.payee || '-',
    expense.date,
    expense.reference || '-'
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders.map(col => col.header)],
    body: tableRows,
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [156, 39, 176],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 25 },
      3: { halign: 'right' }
    }
  });
  
  if (includeSummary && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    const expensesByCategory: Record<string, number> = {};
    if (categorizeExpenses) {
      expenses.forEach(expense => {
        if (!expensesByCategory[expense.category]) {
          expensesByCategory[expense.category] = 0;
        }
        expensesByCategory[expense.category] += expense.amount;
      });
    }
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Summary', MARGIN, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Number of Expense Records: ${expenses.length}`, MARGIN, yPos);
    yPos += 10;
    
    if (categorizeExpenses && Object.keys(expensesByCategory).length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Expenses by Category:', MARGIN, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      Object.entries(expensesByCategory).forEach(([category, amount]) => {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        doc.text(`${formattedCategory}: ${formatCurrency(amount)} (${((amount / totalExpenses) * 100).toFixed(1)}%)`, MARGIN, yPos);
        yPos += 5;
      });
    }
  }
  
  if (includeWeeklyBreakdown && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    const expensesByWeek: Record<string, number> = {};
    expenses.forEach(expense => {
      const weekStart = new Date(expense.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!expensesByWeek[weekKey]) {
        expensesByWeek[weekKey] = 0;
      }
      expensesByWeek[weekKey] += expense.amount;
    });
    
    const weeklyData = Object.entries(expensesByWeek).map(([week, amount]) => {
      const weekDate = new Date(week);
      const weekEnd = new Date(weekDate);
      weekEnd.setDate(weekDate.getDate() + 6);
      
     const formatDate = (date) => {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
};

const weekLabel = `${formatDate(weekDate)} - ${formatDate(weekEnd)}`;

      return { week: weekLabel, amount };
    }).sort((a, b) => a.week.localeCompare(b.week));
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Expense Breakdown', MARGIN, yPos);
    yPos += 10;
    
    if (weeklyData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Week', 'Total Expenses']],
        body: weeklyData.map(week => [
          week.week,
          formatCurrency(week.amount)
        ]),
        margin: { left: MARGIN, right: MARGIN },
        headStyles: {
          fillColor: [156, 39, 176],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        columnStyles: {
          1: { halign: 'right' }
        }
      });
    } else {
      doc.setFont('helvetica', 'italic');
      doc.text('No weekly data available.', MARGIN, yPos);
    }
  }
  
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
 const now = new Date();
const formattedNow = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
doc.text(`Generated on ${formattedNow}`, MARGIN, footerY);
143
  doc.text('Page 1 of 1', PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  
  return doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportFinancialReportToPDF = (
  weeklyData: WeeklyFinancialData[],
  options: {
    title?: string;
    dateRange?: { start: string; end: string };
    includeCompanyDetails?: boolean;
    includeCharts?: boolean;
  } = {}
) => {
  const {
    title = 'Financial Report',
    dateRange,
    includeCompanyDetails = true,
    includeCharts = true
  } = options;
  
  const doc = new jsPDF();
  
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const MARGIN = 15;
  
  let yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 10;
  
  if (dateRange) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateText = `${dateRange.start} to ${dateRange.end}`;
    doc.text(dateText, PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 10;
  }
  
  if (includeCompanyDetails) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Vali Produce', MARGIN, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('123 Harvest Lane, Farmington, CA 94123', MARGIN, yPos + 5);
    doc.text('contact@freshproduce.co', MARGIN, yPos + 10);
    yPos += 20;
  }
  
  autoTable(doc, {
    startY: yPos,
    head: [['Week', 'Revenue', 'Expenses', 'Profit', 'Margin %', 'Shipping', 'Salary', 'Other Expenses']],
    body: weeklyData.map(week => [
      week.week,
      formatCurrency(week.revenue),
      formatCurrency(week.expenses),
      formatCurrency(week.profit),
      `${week.margin.toFixed(1)}%`,
      formatCurrency(week.expenseBreakdown?.shipping || 0),
      formatCurrency(week.expenseBreakdown?.salary || 0),
      formatCurrency(week.expenseBreakdown?.other || 0)
    ]),
    margin: { left: MARGIN, right: MARGIN },
    headStyles: {
      fillColor: [66, 135, 245],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' }
    }
  });
  
  if (doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    const totalRevenue = weeklyData.reduce((sum, week) => sum + week.revenue, 0);
    const totalExpenses = weeklyData.reduce((sum, week) => sum + week.expenses, 0);
    const totalProfit = weeklyData.reduce((sum, week) => sum + week.profit, 0);
    const averageMargin = totalProfit / totalRevenue * 100;
    
    const totalShipping = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.shipping || 0), 0);
    const totalSalary = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.salary || 0), 0);
    const totalOtherExpenses = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.other || 0), 0);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Summary', MARGIN, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Total Profit: ${formatCurrency(totalProfit)}`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Average Profit Margin: ${averageMargin.toFixed(1)}%`, MARGIN, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Breakdown:', MARGIN, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Shipping: ${formatCurrency(totalShipping)} (${((totalShipping / totalExpenses) * 100).toFixed(1)}%)`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Salary: ${formatCurrency(totalSalary)} (${((totalSalary / totalExpenses) * 100).toFixed(1)}%)`, MARGIN, yPos);
    yPos += 5;
    
    doc.text(`Other Expenses: ${formatCurrency(totalOtherExpenses)} (${((totalOtherExpenses / totalExpenses) * 100).toFixed(1)}%)`, MARGIN, yPos);
  }
  
  if (includeCharts && doc.lastAutoTable) {
    yPos = doc.lastAutoTable.finalY + 30;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Performance Visualization', MARGIN, yPos);
    yPos += 10;
    
    const chartWidth = PAGE_WIDTH - (MARGIN * 2);
    const chartHeight = 60;
    const barWidth = chartWidth / weeklyData.length - 5;
    
    const maxValue = Math.max(...weeklyData.map(week => Math.max(week.revenue, week.expenses)));
    
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, yPos, MARGIN, yPos + chartHeight);
    doc.line(MARGIN, yPos + chartHeight, MARGIN + chartWidth, yPos + chartHeight);
    
    weeklyData.forEach((week, index) => {
      const x = MARGIN + (index * (barWidth + 5));
      
      const revenueHeight = (week.revenue / maxValue) * chartHeight;
      doc.setFillColor(65, 105, 225);
      doc.rect(x, yPos + chartHeight - revenueHeight, barWidth / 3, revenueHeight, 'F');
      
      const expensesHeight = (week.expenses / maxValue) * chartHeight;
      doc.setFillColor(220, 20, 60);
      doc.rect(x + (barWidth / 3), yPos + chartHeight - expensesHeight, barWidth / 3, expensesHeight, 'F');
      
      const profitHeight = (week.profit / maxValue) * chartHeight;
      doc.setFillColor(46, 204, 113);
      doc.rect(x + (barWidth * 2/3), yPos + chartHeight - profitHeight, barWidth / 3, profitHeight, 'F');
      
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text(week.week, x + (barWidth / 2), yPos + chartHeight + 5, { align: 'center' });
    });
    
    doc.setFillColor(65, 105, 225);
    doc.rect(MARGIN, yPos, 5, 5, 'F');
    doc.text('Revenue', MARGIN + 10, yPos + 4);
    
    doc.setFillColor(220, 20, 60);
    doc.rect(MARGIN + 60, yPos, 5, 5, 'F');
    doc.text('Expenses', MARGIN + 70, yPos + 4);
    
    doc.setFillColor(46, 204, 113);
    doc.rect(MARGIN + 130, yPos, 5, 5, 'F');
    doc.text('Profit', MARGIN + 140, yPos + 4);
  }
  
  if (includeCharts && doc.lastAutoTable) {
    yPos += 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Categories Breakdown', MARGIN, yPos);
    yPos += 10;
    
    const totalShipping = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.shipping || 0), 0);
    const totalSalary = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.salary || 0), 0);
    const totalOtherExpenses = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.other || 0), 0);
    const totalExpenses = totalShipping + totalSalary + totalOtherExpenses;
    
    const centerX = MARGIN + 60;
    const centerY = yPos + 40;
    const radius = 40;
    
    const shippingAngle = (totalShipping / totalExpenses) * 360;
    const salaryAngle = (totalSalary / totalExpenses) * 360;
    const otherAngle = (totalOtherExpenses / totalExpenses) * 360;
    
    let currentAngle = 0;
    
    doc.setFillColor(255, 99, 132);
    drawPieSlice(doc, centerX, centerY, radius, currentAngle, currentAngle + shippingAngle);
    currentAngle += shippingAngle;
    
    doc.setFillColor(54, 162, 235);
    drawPieSlice(doc, centerX, centerY, radius, currentAngle, currentAngle + salaryAngle);
    currentAngle += salaryAngle;
    
    doc.setFillColor(255, 206, 86);
    drawPieSlice(doc, centerX, centerY, radius, currentAngle, currentAngle + otherAngle);
    
    doc.setFontSize(8);
    const legendX = centerX + radius + 20;
    let legendY = centerY - 20;
    
    doc.setFillColor(255, 99, 132);
    doc.rect(legendX, legendY, 5, 5, 'F');
    doc.text(`Shipping: ${((totalShipping / totalExpenses) * 100).toFixed(1)}%`, legendX + 10, legendY + 4);
    legendY += 15;
    
    doc.setFillColor(54, 162, 235);
    doc.rect(legendX, legendY, 5, 5, 'F');
    doc.text(`Salary: ${((totalSalary / totalExpenses) * 100).toFixed(1)}%`, legendX + 10, legendY + 4);
    legendY += 15;
    
    doc.setFillColor(255, 206, 86);
    doc.rect(legendX, legendY, 5, 5, 'F');
    doc.text(`Other: ${((totalOtherExpenses / totalExpenses) * 100).toFixed(1)}%`, legendX + 10, legendY + 4);
  }
  
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
 const now = new Date();
const formattedNow = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
doc.text(`Generated on ${formattedNow}`, MARGIN, footerY);

  doc.text('Page 1 of 1', PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  
  return doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

function drawPieSlice(doc: jsPDF, centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  
  const startX = centerX + radius * Math.cos(startRad);
  const startY = centerY + radius * Math.sin(startRad);
  const endX = centerX + radius * Math.cos(endRad);
  const endY = centerY + radius * Math.sin(endRad);
  
  doc.setLineWidth(0.1);
  doc.setDrawColor(0);
  
  // Draw a simple pie slice using lines and arcs
  // Move to center
  doc.moveTo(centerX, centerY);
  // Line to start of arc
  doc.lineTo(startX, startY);
  
  // Draw an arc from start to end
  const arcDegrees = endAngle - startAngle;
  const arcPoints = 20; // Number of points to approximate the arc
  
  for (let i = 0; i <= arcPoints; i++) {
    const angle = startRad + (i / arcPoints) * (endRad - startRad);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    doc.lineTo(x, y);
  }
  
  // Line back to center
  doc.lineTo(centerX, centerY);
  
  // Fill the path
  doc.fill();
}
