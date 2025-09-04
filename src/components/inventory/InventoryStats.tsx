
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, formatCurrency } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface InventoryStatsProps {
  products: Product[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const InventoryStats: React.FC<InventoryStatsProps> = ({ products }) => {
  // Calculate inventory statistics
  const stats = useMemo(() => {
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockItems = products.filter(product => product.quantity <= product.threshold);
    
    return { totalItems, totalValue, lowStockItems };
  }, [products]);
  
  // Prepare data for category distribution chart
  const categoryData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    const categoryValues: Record<string, number> = {};
    
    products.forEach(product => {
      if (!categoryCounts[product.category]) {
        categoryCounts[product.category] = 0;
        categoryValues[product.category] = 0;
      }
      categoryCounts[product.category] += product.quantity;
      categoryValues[product.category] += product.price * product.quantity;
    });
    
    return {
      counts: Object.entries(categoryCounts).map(([category, value]) => ({
        name: category,
        value
      })),
      values: Object.entries(categoryValues).map(([category, value]) => ({
        name: category,
        value
      }))
    };
  }, [products]);
  
  // Prepare data for the product value chart
  const productValueData = useMemo(() => {
    return products
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5)
      .map(product => ({
        name: product.name.length > 15 ? product.name.substring(0, 12) + '...' : product.name,
        value: product.price * product.quantity
      }));
  }, [products]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 text-primary flex-shrink-0">
              <TrendingUp size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalItems} total items in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 text-primary flex-shrink-0">
              <TrendingUp size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average value per product: {formatCurrency(stats.totalValue / products.length)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <div className="rounded-full bg-amber-500/10 p-1.5 sm:p-2 text-amber-500 flex-shrink-0">
              <AlertTriangle size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(stats.lowStockItems.length / products.length * 100).toFixed(1)}% of products
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of items across categories</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData.counts}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} items`, 'Quantity']} />
                  <Legend />
                  <Bar dataKey="value" name="Quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value</CardTitle>
            <CardDescription>Distribution of inventory value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.values}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.values.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Value</CardTitle>
          <CardDescription>Highest value items in your inventory</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productValueData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                <Legend />
                <Bar dataKey="value" name="Value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;
