
/**
 * DEPRECATED - Use modular PDF exports instead
 * This file is maintained for backward compatibility but will be removed in a future update.
 * 
 * For new development, please use the modular PDF export utilities from src/utils/pdf/ instead.
 * Example:
 *   import { exportInvoiceToPDF } from './utils/pdf';
 */

import { 
  exportPriceListToPDF, 
  exportInvoiceToPDF, 
  exportTransportationReceiptToPDF, 
  exportBillOfLadingToPDF 
} from './pdf';

// Log deprecation warning when imported
console.warn('Warning: pdfExport.ts is deprecated. Please use the modular PDF export utilities from src/utils/pdf/ instead.');

export {
  exportPriceListToPDF,
  exportInvoiceToPDF,
  exportTransportationReceiptToPDF,
  exportBillOfLadingToPDF
};
