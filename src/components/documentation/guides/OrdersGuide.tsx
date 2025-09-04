
import React from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Package, 
  Map, 
  MergeIcon, 
  AlertTriangle 
} from 'lucide-react';

const OrdersGuide = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        The Order Management system allows you to create, track, and fulfill customer orders efficiently.
        It includes various tools for order processing, shipment tracking, and delivery optimization.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Main Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <h4 className="font-medium text-indigo-700 flex items-center mb-2">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Order List & Details
            </h4>
            <p className="text-indigo-600 text-sm">
              View all orders in a sortable, filterable list. Click on any order to view detailed information
              including customer details, order items, payment status, and fulfillment status.
            </p>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <h4 className="font-medium text-indigo-700 flex items-center mb-2">
              <Package className="h-4 w-4 mr-2" />
              Creating New Orders
            </h4>
            <p className="text-indigo-600 text-sm">
              Create new orders manually by clicking the "New Order" button. You can select products,
              specify quantities, add customer information, and set shipping details all in one interface.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Advanced Order Management</h3>
        <p className="text-muted-foreground">
          Our system includes powerful tools for optimizing delivery routes, managing truck weights,
          suggesting order merges, and tracking orders in real-time.
        </p>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium flex items-center">
              <Map className="h-4 w-4 mr-2 text-blue-500" />
              Route Optimization
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              The Route Optimization tool helps you plan the most efficient delivery routes for your orders.
              Enter your starting location and click "Optimize Routes" to generate efficient delivery paths
              that minimize distance, time, and fuel consumption.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium flex items-center">
              <Truck className="h-4 w-4 mr-2 text-green-500" />
              Truck Weight Management
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage the weight distribution across your delivery vehicles. This tool ensures
              you're maximizing capacity while adhering to weight restrictions and regulations.
              Use the rebalance feature to redistribute loads optimally across your fleet.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium flex items-center">
              <MergeIcon className="h-4 w-4 mr-2 text-purple-500" />
              Order Merge Suggestions
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              The system intelligently identifies orders that can be combined for more efficient delivery.
              These suggestions are based on delivery location proximity, customer preferences, and order
              timing to optimize your fulfillment process.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mt-6">
        <h4 className="font-medium text-amber-800 flex items-center mb-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Best Practices
        </h4>
        <ul className="text-amber-700 text-sm space-y-1.5">
          <li>Review your order list at the beginning of each day to prioritize fulfillment</li>
          <li>Use the route optimization tools before dispatching delivery vehicles</li>
          <li>Regularly check for order merge opportunities to save on shipping costs</li>
          <li>Update order status promptly to maintain accurate tracking information</li>
          <li>Use the filtering options to quickly find orders that need attention</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Order Workflow</h3>
        <ol className="space-y-2 list-decimal pl-6">
          <li className="text-muted-foreground">
            <span className="font-medium text-foreground">Order Creation</span> - Create a new order manually or receive it from your online store
          </li>
          <li className="text-muted-foreground">
            <span className="font-medium text-foreground">Processing</span> - Review order details, verify inventory, and process payment
          </li>
          <li className="text-muted-foreground">
            <span className="font-medium text-foreground">Fulfillment</span> - Pick, pack, and prepare the order for shipping
          </li>
          <li className="text-muted-foreground">
            <span className="font-medium text-foreground">Shipment</span> - Assign to a delivery route and mark as shipped
          </li>
          <li className="text-muted-foreground">
            <span className="font-medium text-foreground">Delivery</span> - Track the order until it's delivered to the customer
          </li>
          <li className="text-muted-foreground">
            <span className="font-medium text-foreground">Completion</span> - Mark the order as delivered and complete
          </li>
        </ol>
      </div>
    </div>
  );
};

export default OrdersGuide;
