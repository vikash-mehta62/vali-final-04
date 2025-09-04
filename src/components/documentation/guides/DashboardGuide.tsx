
import React from 'react';
import { 
  BarChart2, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  PieChart,
  Lightbulb
} from 'lucide-react';

const DashboardGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <p className="text-muted-foreground">
        The dashboard provides a comprehensive overview of your business at a glance. It displays
        key metrics, recent activity, and actionable insights to help you make informed decisions.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Key Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders & Sales
            </h4>
            <p className="text-blue-600 text-sm">
              Displays the total number of orders, recent order activity, and sales trends over time.
              Use this to track your sales performance and identify patterns.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
            <h4 className="font-medium text-purple-700 flex items-center mb-2">
              <BarChart2 className="h-4 w-4 mr-2" />
              Performance Charts
            </h4>
            <p className="text-purple-600 text-sm">
              Visual representations of your sales data, order status distribution, and other key
              performance indicators to help you understand business trends.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md border border-green-100">
            <h4 className="font-medium text-green-700 flex items-center mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Overview
            </h4>
            <p className="text-green-600 text-sm">
              Shows your total inventory value, revenue metrics, and financial performance indicators
              to help you monitor the financial health of your business.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
            <h4 className="font-medium text-amber-700 flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts & Notifications
            </h4>
            <p className="text-amber-600 text-sm">
              Highlights important alerts such as low stock items, pending orders, and other
              actionable notifications that require your attention.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Charts & Visualizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-primary" />
              Order Status Distribution
            </h4>
            <p className="text-sm text-muted-foreground">
              The pie chart shows the distribution of orders by status (pending, processing, shipped, 
              delivered, cancelled). This helps you understand your order fulfillment pipeline at a glance.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-primary" />
              Monthly Sales Trend
            </h4>
            <p className="text-sm text-muted-foreground">
              The line chart displays your sales performance over time, allowing you to identify
              seasonal patterns, growth trends, and potential areas for improvement.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">AI Insights</h3>
        <p className="text-muted-foreground">
          The AI Insights section uses advanced analytics to provide intelligent recommendations
          and observations about your business performance.
        </p>
        
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-700 flex items-center mb-2">
            <Lightbulb className="h-4 w-4 mr-2" />
            How to Use AI Insights
          </h4>
          <ul className="text-blue-600 text-sm space-y-2">
            <li>Review insights regularly to identify new opportunities</li>
            <li>Click on any insight card to see more detailed information</li>
            <li>Use the recommendations to inform your business decisions</li>
            <li>Look for patterns in the insights to understand broader trends</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-8">
        <h3 className="text-lg font-medium mb-2">Dashboard Customization</h3>
        <p className="text-muted-foreground text-sm">
          You can customize your dashboard view by adjusting the date ranges for charts and
          metrics. Click on the date selector in the top right of each card to change the time period.
        </p>
      </div>
    </div>
  );
};

export default DashboardGuide;
