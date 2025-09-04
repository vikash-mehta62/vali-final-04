import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, CreditCard, Building, Clock, CheckCircle2, 
  ArrowUpCircle, ArrowDownCircle, Calendar, Filter, 
  Wallet, BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const PaymentsOverview = () => {
  const [timeFrame, setTimeFrame] = useState('year');

  // Sample data for charts and statistics
  const paymentStats = [
    { title: 'Total Payments', value: '$158,245.80', icon: <DollarSign className="h-8 w-8 text-green-500" />, trend: '+12.5%', color: 'bg-green-50' },
    { title: 'Pending Payments', value: '$12,850.40', icon: <Clock className="h-8 w-8 text-orange-500" />, trend: '-3.2%', color: 'bg-orange-50' },
    { title: 'Credit Card Payments', value: '$98,320.50', icon: <CreditCard className="h-8 w-8 text-blue-500" />, trend: '+8.7%', color: 'bg-blue-50' },
    { title: 'ACH Transfers', value: '$47,075.30', icon: <Building className="h-8 w-8 text-purple-500" />, trend: '+15.3%', color: 'bg-purple-50' },
  ];

  // New financial metrics for total purchases and net sales
  const financialMetrics = [
    { 
      title: 'Total Purchases Value', 
      value: '$215,680.50', 
      icon: <Wallet className="h-8 w-8 text-indigo-500" />, 
      trend: '+9.3%', 
      color: 'bg-indigo-50',
      description: 'Total value of inventory purchases'
    },
    { 
      title: 'Net Sales Value', 
      value: '$172,450.30', 
      icon: <BarChart2 className="h-8 w-8 text-teal-500" />, 
      trend: '+15.7%', 
      color: 'bg-teal-50',
      description: 'Total sales minus returns and discounts'
    },
  ];

  // Different data based on selected timeframe
  const monthlyData = {
    year: [
      { name: 'Jan', value: 12500 },
      { name: 'Feb', value: 14800 },
      { name: 'Mar', value: 13200 },
      { name: 'Apr', value: 15900 },
      { name: 'May', value: 17500 },
      { name: 'Jun', value: 19200 },
      { name: 'Jul', value: 18400 },
      { name: 'Aug', value: 21300 },
      { name: 'Sep', value: 23500 },
      { name: 'Oct', value: 24800 },
      { name: 'Nov', value: 23700 },
      { name: 'Dec', value: 25600 },
    ],
    quarter: [
      { name: 'Week 1', value: 5200 },
      { name: 'Week 2', value: 6100 },
      { name: 'Week 3', value: 7300 },
      { name: 'Week 4', value: 6800 },
      { name: 'Week 5', value: 7500 },
      { name: 'Week 6', value: 8200 },
      { name: 'Week 7', value: 7800 },
      { name: 'Week 8', value: 8900 },
      { name: 'Week 9', value: 9300 },
      { name: 'Week 10', value: 9800 },
      { name: 'Week 11', value: 10200 },
      { name: 'Week 12', value: 11500 },
    ],
    month: [
      { name: 'Day 1', value: 820 },
      { name: 'Day 3', value: 930 },
      { name: 'Day 6', value: 1050 },
      { name: 'Day 9', value: 980 },
      { name: 'Day 12', value: 1120 },
      { name: 'Day 15', value: 1280 },
      { name: 'Day 18', value: 1370 },
      { name: 'Day 21', value: 1460 },
      { name: 'Day 24', value: 1520 },
      { name: 'Day 27', value: 1610 },
      { name: 'Day 30', value: 1740 },
    ],
    week: [
      { name: 'Mon', value: 1220 },
      { name: 'Tue', value: 1410 },
      { name: 'Wed', value: 1350 },
      { name: 'Thu', value: 1590 },
      { name: 'Fri', value: 1730 },
      { name: 'Sat', value: 890 },
      { name: 'Sun', value: 680 },
    ]
  };

  // New datasets for purchases and net sales
  const purchasesData = {
    year: [
      { name: 'Jan', value: 18200 },
      { name: 'Feb', value: 16900 },
      { name: 'Mar', value: 15800 },
      { name: 'Apr', value: 19300 },
      { name: 'May', value: 18700 },
      { name: 'Jun', value: 20500 },
      { name: 'Jul', value: 19600 },
      { name: 'Aug', value: 17900 },
      { name: 'Sep', value: 21200 },
      { name: 'Oct', value: 22500 },
      { name: 'Nov', value: 21900 },
      { name: 'Dec', value: 23100 },
    ],
  };

  const netSalesData = {
    year: [
      { name: 'Jan', value: 10200 },
      { name: 'Feb', value: 12500 },
      { name: 'Mar', value: 11900 },
      { name: 'Apr', value: 13400 },
      { name: 'May', value: 14800 },
      { name: 'Jun', value: 16200 },
      { name: 'Jul', value: 15700 },
      { name: 'Aug', value: 18900 },
      { name: 'Sep', value: 20100 },
      { name: 'Oct', value: 21300 },
      { name: 'Nov', value: 20500 },
      { name: 'Dec', value: 21900 },
    ],
  };

  const monthlyPaymentsData = monthlyData[timeFrame as keyof typeof monthlyData];
  const yearlyPurchasesData = purchasesData.year;
  const yearlyNetSalesData = netSalesData.year;

  const paymentMethodsData = [
    { name: 'Credit Card', value: 62 },
    { name: 'ACH Transfer', value: 28 },
    { name: 'Manual Payment', value: 10 },
  ];

  const COLORS = ['#4263EB', '#7950F2', '#F59E0B'];

  const recentActivity = [
    { id: 'TXN-001', customer: 'John Smith', amount: '$1,245.80', method: 'Credit Card', status: 'completed', date: '2023-10-15' },
    { id: 'TXN-002', customer: 'Sarah Johnson', amount: '$850.40', method: 'ACH Transfer', status: 'processing', date: '2023-10-14' },
    { id: 'TXN-003', customer: 'Michael Brown', amount: '$2,320.50', method: 'Manual Payment', status: 'completed', date: '2023-10-13' },
    { id: 'TXN-004', customer: 'Emily Davis', amount: '$475.30', method: 'Credit Card', status: 'pending', date: '2023-10-12' },
  ];

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'pending':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <ArrowUpCircle className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <ArrowDownCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentStats.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-none`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <div className="flex items-center mt-1 text-xs">
                    {stat.trend.startsWith('+') ? (
                      <ArrowUpCircle className="h-3 w-3 mr-1 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3 mr-1 text-red-600" />
                    )}
                    <span className={stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {stat.trend} from last month
                    </span>
                  </div>
                </div>
                <div className="rounded-full p-3 bg-white/80 shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Metrics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Financial Metrics</CardTitle>
          <CardDescription>Overview of purchases and sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financialMetrics.map((metric, index) => (
              <div key={index} className={`${metric.color} rounded-lg p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <h3 className="text-3xl font-bold mt-1">{metric.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                    <div className="flex items-center mt-2 text-sm">
                      {metric.trend.startsWith('+') ? (
                        <ArrowUpCircle className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 mr-1 text-red-600" />
                      )}
                      <span className={metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {metric.trend} from previous period
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full p-4 bg-white/80 shadow-sm">
                    {metric.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase vs Sales Comparison */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Purchases vs Net Sales</CardTitle>
            <CardDescription>Comparison of purchases and net sales over time</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" allowDuplicatedCategory={false} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`]} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  data={yearlyPurchasesData}
                  name="Purchases" 
                  stroke="#6366F1" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  data={yearlyNetSalesData}
                  name="Net Sales" 
                  stroke="#14B8A6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Payment Volume</CardTitle>
              <CardDescription>Payment volume over time</CardDescription>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last quarter</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPaymentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'Payment Volume']} />
                  <Line type="monotone" dataKey="value" stroke="#4263EB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {paymentMethodsData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Payment Activity</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter size={14} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium">{activity.id}</td>
                    <td className="py-3 px-4 text-sm">{activity.customer}</td>
                    <td className="py-3 px-4 text-sm font-medium">{activity.amount}</td>
                    <td className="py-3 px-4 text-sm">{activity.method}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        {getStatusIcon(activity.status)}
                        <span className={`ml-1.5 capitalize ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsOverview;
