import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  ChartBar,
  ChartPie,
  ChartLine,
  Download,
  Calendar,
  Filter,
  ArrowDownUp,
  RefreshCw
} from 'lucide-react';
import { orders, products, clients, formatCurrency } from '@/lib/data';

const Analytics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Product category sales distribution data
  const categorySalesData = [
    { name: 'Vegetables', value: 43, color: '#4ade80' },
    { name: 'Fruits', value: 32, color: '#f97316' },
    { name: 'Herbs', value: 15, color: '#8b5cf6' },
    { name: 'Organics', value: 10, color: '#ec4899' }
  ];

  // Monthly revenue data
  const revenueData = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 49000 },
    { month: 'Mar', revenue: 53000 },
    { month: 'Apr', revenue: 57000 },
    { month: 'May', revenue: 62000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 72000 },
    { month: 'Aug', revenue: 78000 },
    { month: 'Sep', revenue: 83000 },
    { month: 'Oct', revenue: 87000 },
    { month: 'Nov', revenue: 92000 },
    { month: 'Dec', revenue: null }
  ];

  // Client acquisition data
  const clientAcquisitionData = [
    { month: 'Jan', newClients: 5, churn: 1 },
    { month: 'Feb', newClients: 7, churn: 2 },
    { month: 'Mar', newClients: 8, churn: 1 },
    { month: 'Apr', newClients: 12, churn: 3 },
    { month: 'May', newClients: 10, churn: 2 },
    { month: 'Jun', newClients: 14, churn: 4 },
    { month: 'Jul', newClients: 16, churn: 3 },
    { month: 'Aug', newClients: 18, churn: 5 },
    { month: 'Sep', newClients: 15, churn: 4 },
    { month: 'Oct', newClients: 21, churn: 6 },
    { month: 'Nov', newClients: 24, churn: 5 }
  ];

  // Top selling products
  const topSellingProducts = products
    .map(product => ({
      ...product,
      salesVolume: Math.floor(Math.random() * 500) + 100,
      revenue: (Math.floor(Math.random() * 500) + 100) * product.price
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Order fulfillment time over months
  const fulfillmentTimeData = [
    { month: 'Jan', time: 2.4 },
    { month: 'Feb', time: 2.2 },
    { month: 'Mar', time: 2.0 },
    { month: 'Apr', time: 1.9 },
    { month: 'May', time: 1.7 },
    { month: 'Jun', time: 1.6 },
    { month: 'Jul', time: 1.5 },
    { month: 'Aug', time: 1.3 },
    { month: 'Sep', time: 1.2 },
    { month: 'Oct', time: 1.1 },
    { month: 'Nov', time: 1.0 }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <PageHeader 
              title="Analytics Dashboard" 
              description="Advanced metrics and business intelligence"
            >
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar size={14} className="mr-1.5" />
                  {dateRange === 'month' ? 'Last 30 days' : dateRange === 'quarter' ? 'Last Quarter' : 'Last Year'}
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-1.5" />
                  Export
                </Button>
                <Button size="sm">
                  <RefreshCw size={14} className="mr-1.5" />
                  Refresh
                </Button>
              </div>
            </PageHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-slide-down">
              <Card>
                <CardContent className="py-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Total Revenue</span>
                    <span className="text-2xl font-bold mt-1">{formatCurrency(875400)}</span>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <span className="text-green-500">+12.5%</span>
                      <span className="text-muted-foreground">vs previous period</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="py-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Average Order Value</span>
                    <span className="text-2xl font-bold mt-1">{formatCurrency(453)}</span>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <span className="text-green-500">+5.7%</span>
                      <span className="text-muted-foreground">vs previous period</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="py-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Client Retention Rate</span>
                    <span className="text-2xl font-bold mt-1">87.2%</span>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <span className="text-red-500">-2.3%</span>
                      <span className="text-muted-foreground">vs previous period</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="sales" className="mb-6 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="sales" className="flex items-center gap-1.5">
                    <ChartBar size={14} />
                    <span>Sales</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center gap-1.5">
                    <ChartPie size={14} />
                    <span>Products</span>
                  </TabsTrigger>
                  <TabsTrigger value="clients" className="flex items-center gap-1.5">
                    <ChartLine size={14} />
                    <span>Clients</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter size={14} className="mr-1.5" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownUp size={14} className="mr-1.5" />
                    Sort
                  </Button>
                </div>
              </div>
              
              <TabsContent value="sales" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `$${value / 1000}k`}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                            name="Revenue"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                      <CardDescription>Sales by product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categorySalesData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {categorySalesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Category Share']}
                              labelFormatter={(label) => `Category: ${label}`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Processing Efficiency</CardTitle>
                      <CardDescription>Average fulfillment time (days)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={fulfillmentTimeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis 
                              domain={[0, 'dataMax + 0.5']}
                              tickFormatter={(value) => `${value} days`}
                            />
                            <Tooltip 
                              formatter={(value) => [`${value} days`, 'Fulfillment Time']}
                              labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="time" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              name="Fulfillment Time"
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>Products with highest revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topSellingProducts} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={100}
                            tickLine={false}
                          />
                          <Tooltip 
                            formatter={(value, name) => [
                              name === 'revenue' ? formatCurrency(value as number) : value, 
                              name === 'revenue' ? 'Revenue' : 'Units Sold'
                            ]}
                          />
                          <Legend />
                          <Bar 
                            dataKey="salesVolume" 
                            name="Units Sold" 
                            fill="#8884d8"
                            barSize={20}
                          />
                          <Bar 
                            dataKey="revenue" 
                            name="Revenue" 
                            fill="#82ca9d" 
                            barSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Turnover Rate</CardTitle>
                      <CardDescription>How quickly products are sold and replaced</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categories}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis 
                              tickFormatter={(value) => `${value}x`}
                            />
                            <Tooltip 
                              formatter={(value) => [`${value}x`, 'Turnover Rate']}
                            />
                            <Legend />
                            <Bar 
                              dataKey="turnover" 
                              name="Turnover Rate" 
                              fill="#3b82f6" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Seasonal Products Performance</CardTitle>
                      <CardDescription>Quarterly sales by product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="fruits" name="Fruits" stackId="a" fill="#f97316" />
                            <Bar dataKey="vegetables" name="Vegetables" stackId="a" fill="#4ade80" />
                            <Bar dataKey="herbs" name="Herbs" stackId="a" fill="#8b5cf6" />
                            <Bar dataKey="organics" name="Organics" stackId="a" fill="#ec4899" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="clients" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Acquisition and Churn</CardTitle>
                    <CardDescription>New clients vs churned clients over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clientAcquisitionData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="newClients" 
                            name="New Clients" 
                            fill="#4ade80" 
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="churn" 
                            name="Churned Clients" 
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Segments</CardTitle>
                      <CardDescription>Distribution by business size</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={clientSegments}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={100}
                              fill="#8884d8"
                              paddingAngle={0}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {clientSegments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Market Share']}
                              labelFormatter={(label) => `Segment: ${label}`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Satisfaction</CardTitle>
                      <CardDescription>Average ratings over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={satisfactionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis 
                              domain={[3, 5]}
                              tickFormatter={(value) => `${value}★`}
                            />
                            <Tooltip 
                              formatter={(value) => [`${value}★`, 'Satisfaction Rating']}
                              labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="rating" 
                              stroke="#f59e0b" 
                              strokeWidth={2}
                              name="Satisfaction Rating"
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Growth Projections</CardTitle>
                  <CardDescription>Estimated revenue growth for next 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthProjections}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis 
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Projected Revenue']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="projected" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Projected Revenue"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Actual Revenue"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Market Share Analysis</CardTitle>
                  <CardDescription>Estimated share in local produce market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketShareData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {marketShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Market Distribution']}
                          labelFormatter={(label) => `Category: ${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Additional data for the charts
const categories = [
  { name: 'Vegetables', turnover: 12.3 },
  { name: 'Fruits', turnover: 10.8 },
  { name: 'Herbs', turnover: 8.5 },
  { name: 'Organics', turnover: 6.2 }
];

const seasonalData = [
  { quarter: 'Q1', fruits: 25, vegetables: 40, herbs: 15, organics: 20 },
  { quarter: 'Q2', fruits: 30, vegetables: 45, herbs: 20, organics: 25 },
  { quarter: 'Q3', fruits: 45, vegetables: 30, herbs: 25, organics: 20 },
  { quarter: 'Q4', fruits: 20, vegetables: 35, herbs: 15, organics: 15 }
];

const clientSegments = [
  { name: 'Small', value: 45, color: '#3b82f6' },
  { name: 'Medium', value: 30, color: '#8b5cf6' },
  { name: 'Large', value: 25, color: '#10b981' }
];

const satisfactionData = [
  { month: 'Jan', rating: 4.2 },
  { month: 'Feb', rating: 4.3 },
  { month: 'Mar', rating: 4.1 },
  { month: 'Apr', rating: 4.4 },
  { month: 'May', rating: 4.5 },
  { month: 'Jun', rating: 4.6 },
  { month: 'Jul', rating: 4.7 },
  { month: 'Aug', rating: 4.6 },
  { month: 'Sep', rating: 4.8 },
  { month: 'Oct', rating: 4.9 },
  { month: 'Nov', rating: 4.7 }
];

const growthProjections = [
  { month: 'Dec', actual: 92000, projected: 92000 },
  { month: 'Jan', actual: 97000, projected: 96000 },
  { month: 'Feb', actual: null, projected: 101000 },
  { month: 'Mar', actual: null, projected: 105000 },
  { month: 'Apr', actual: null, projected: 110000 },
  { month: 'May', actual: null, projected: 116000 },
  { month: 'Jun', actual: null, projected: 123000 }
];

const marketShareData = [
  { name: 'Your Business', value: 23, color: '#3b82f6' },
  { name: 'Competitor A', value: 32, color: '#10b981' },
  { name: 'Competitor B', value: 27, color: '#f59e0b' },
  { name: 'Others', value: 18, color: '#8b5cf6' }
];

export default Analytics;
