
import React from 'react';
import { Package, AlertTriangle, BarChart2, RefreshCw } from 'lucide-react';

const InventoryGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      <p className="text-muted-foreground">
        The Inventory Management system helps you track product stock levels, manage suppliers,
        set reorder points, and analyze inventory performance.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-teal-50 rounded-md border border-teal-100">
            <h4 className="font-medium text-teal-700 flex items-center mb-2">
              <Package className="h-4 w-4 mr-2" />
              Product Catalog
            </h4>
            <p className="text-teal-600 text-sm">
              Maintain a comprehensive database of all your products with detailed information
              including SKUs, descriptions, pricing, dimensions, and categories.
            </p>
          </div>
          
          <div className="p-4 bg-teal-50 rounded-md border border-teal-100">
            <h4 className="font-medium text-teal-700 flex items-center mb-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Stock Management
            </h4>
            <p className="text-teal-600 text-sm">
              Track current stock levels, set minimum thresholds, receive low stock alerts,
              and manage product availability across multiple locations.
            </p>
          </div>
          
          <div className="p-4 bg-teal-50 rounded-md border border-teal-100">
            <h4 className="font-medium text-teal-700 flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts & Notifications
            </h4>
            <p className="text-teal-600 text-sm">
              Receive automated alerts when products reach their reorder thresholds or when
              inventory discrepancies are detected after stock takes.
            </p>
          </div>
          
          <div className="p-4 bg-teal-50 rounded-md border border-teal-100">
            <h4 className="font-medium text-teal-700 flex items-center mb-2">
              <BarChart2 className="h-4 w-4 mr-2" />
              Inventory Analytics
            </h4>
            <p className="text-teal-600 text-sm">
              Analyze inventory turnover rates, identify slow-moving items, track value by category,
              and optimize stock levels based on sales data.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Inventory Workflow</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium">Receiving Inventory</h4>
            <p className="text-sm text-muted-foreground mt-1">
              When new inventory arrives, use the "Receive Inventory" function to record the new stock.
              Enter the purchase order number, product details, quantities, and supplier information.
              The system will automatically update stock levels and maintain a record of the transaction.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium">Stock Adjustments</h4>
            <p className="text-sm text-muted-foreground mt-1">
              If you need to adjust inventory due to damage, loss, or discrepancies, use the "Stock Adjustment"
              feature. Provide the reason for the adjustment and the quantity change, and the system will
              update the inventory levels accordingly.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium">Inventory Counts</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Regular inventory counts help maintain accuracy. Use the "Inventory Count" feature to record
              actual quantities on hand. The system will compare these with expected levels and highlight
              any discrepancies for review.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mt-6">
        <h4 className="font-medium text-amber-800 flex items-center mb-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Inventory Best Practices
        </h4>
        <ul className="text-amber-700 text-sm space-y-1.5">
          <li>Conduct regular inventory counts to ensure system accuracy</li>
          <li>Review and adjust reorder points based on sales velocity</li>
          <li>Analyze slow-moving inventory regularly and consider promotions or discounts</li>
          <li>Monitor inventory value to optimize capital allocation</li>
          <li>Set up email alerts for low stock levels to prevent stockouts</li>
          <li>Use batch/lot tracking for products where applicable</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Adding New Products</h3>
        <p className="text-muted-foreground">
          To add a new product to your inventory:
        </p>
        <ol className="list-decimal pl-6 mt-2 space-y-1 text-muted-foreground">
          <li>Navigate to the Inventory section and click "Add Product"</li>
          <li>Fill in the product details including name, SKU, description, and category</li>
          <li>Set pricing information (cost, retail price, wholesale price)</li>
          <li>Enter physical attributes (weight, dimensions) if applicable</li>
          <li>Define inventory parameters (reorder point, preferred supplier)</li>
          <li>Upload product images if available</li>
          <li>Save the product to add it to your catalog</li>
        </ol>
        <p className="text-muted-foreground mt-2">
          Once added, the product will be available for orders and inventory management.
        </p>
      </div>
    </div>
  );
};

export default InventoryGuide;
