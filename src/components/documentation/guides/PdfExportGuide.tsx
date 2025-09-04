
import React from 'react';
import { FileText, Download, List, Box, Settings } from 'lucide-react';

const PdfExportGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">PDF Export Tools</h2>
      <p className="text-muted-foreground">
        Our PDF export tools enable you to generate professional business documents including price lists,
        invoices, transportation receipts, and bills of lading. These documents can be customized, branded,
        and shared with clients or partners.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Available PDF Exports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <h4 className="font-medium text-slate-700 flex items-center mb-2">
              <List className="h-4 w-4 mr-2" />
              Price Lists
            </h4>
            <p className="text-slate-600 text-sm">
              Generate comprehensive price lists of your products, organized by category and including
              details such as pricing tiers, SKUs, descriptions, and availability status.
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <h4 className="font-medium text-slate-700 flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Invoices
            </h4>
            <p className="text-slate-600 text-sm">
              Create professional invoices with customer information, itemized product lists, pricing,
              taxes, payment terms, and your company details. Includes support for different currencies.
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <h4 className="font-medium text-slate-700 flex items-center mb-2">
              <Box className="h-4 w-4 mr-2" />
              Transportation Receipts
            </h4>
            <p className="text-slate-600 text-sm">
              Generate transportation receipts with shipment details, carrier information, delivery
              addresses, package counts, weights, and tracking numbers for shipping documentation.
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <h4 className="font-medium text-slate-700 flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Bills of Lading
            </h4>
            <p className="text-slate-600 text-sm">
              Create bills of lading with detailed shipment information including shipper and consignee
              details, item descriptions, quantities, weights, and special handling instructions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">PDF Export Options</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-sky-500 pl-4">
            <h4 className="font-medium">Customization</h4>
            <p className="text-sm text-muted-foreground mt-1">
              All PDF exports can be customized with your company branding, including logos, color schemes,
              and custom fonts. You can also add custom headers, footers, and additional notes or terms
              to each document type.
            </p>
          </div>
          
          <div className="border-l-4 border-sky-500 pl-4">
            <h4 className="font-medium">Export Settings</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Configure export options such as paper size (A4, Letter, Legal), orientation (portrait or landscape),
              compression settings for smaller file sizes, and password protection for sensitive documents.
              You can also add automatic watermarks to PDFs for draft or confidential documents.
            </p>
          </div>
          
          <div className="border-l-4 border-sky-500 pl-4">
            <h4 className="font-medium">File Naming & Organization</h4>
            <p className="text-sm text-muted-foreground mt-1">
              The system automatically generates standardized filenames including document types, dates,
              and reference numbers. You can customize the filename format through settings or manually
              rename files before export.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-md border border-blue-200 mt-6">
        <h4 className="font-medium text-blue-700 flex items-center mb-2">
          <Download className="h-4 w-4 mr-2" />
          Exporting PDFs
        </h4>
        <p className="text-blue-600 text-sm">
          To export a PDF document:
        </p>
        <ol className="text-blue-600 text-sm list-decimal pl-6 mt-2 space-y-1">
          <li>Navigate to the relevant section (e.g., Orders, Inventory, etc.)</li>
          <li>Select the specific item you want to generate a document for</li>
          <li>Click the "Export" or "Generate PDF" button</li>
          <li>Select the document type from the dropdown menu</li>
          <li>Configure any document-specific options</li>
          <li>Click "Generate" to create the PDF</li>
          <li>You can then download, print, or email the document directly</li>
        </ol>
      </div>
      
      <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200 mt-6">
        <h4 className="font-medium text-emerald-700 flex items-center mb-2">
          <Settings className="h-4 w-4 mr-2" />
          PDF Export Configuration
        </h4>
        <p className="text-emerald-600 text-sm">
          You can configure global settings for PDF exports in the Settings → Documents section:
        </p>
        <ul className="text-emerald-600 text-sm list-disc pl-6 mt-2 space-y-1">
          <li>Upload your company logo for all documents</li>
          <li>Configure default paper sizes and orientations</li>
          <li>Set up default headers and footers</li>
          <li>Define standard terms and conditions text</li>
          <li>Configure automatic email templates for sending documents</li>
          <li>Set up document numbering formats and sequences</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Batch PDF Generation</h3>
        <p className="text-muted-foreground">
          For efficiency, you can generate multiple PDF documents at once:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
          <li>Select multiple items in a list (e.g., multiple orders)</li>
          <li>Use the "Batch Export" option from the actions menu</li>
          <li>Choose the document type to generate for all selected items</li>
          <li>Configure any common options</li>
          <li>Generate all documents at once, which will be provided as a ZIP file</li>
        </ul>
        <p className="text-muted-foreground mt-2">
          This feature is particularly useful for generating invoices for multiple orders or price lists for different product categories.
        </p>
      </div>
    </div>
  );
};

export default PdfExportGuide;
