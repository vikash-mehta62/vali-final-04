
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, TrendingUp, BarChart2, Wallet, ChevronUp, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

interface MetricCardProps {
  title: string;
  value: number;
  target?: number;
  percentage?: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  target,
  percentage,
  icon,
  trend,
  description
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 rounded-full bg-muted/80">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{formatCurrency(value)}</span>
            {percentage !== undefined && (
              <div className={`flex items-center ml-2 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-xs font-medium">{percentage}%</span>
              </div>
            )}
          </div>
          <CardDescription>{description}</CardDescription>
          
          {target && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round((value / target) * 100)}% of {formatCurrency(target)}</span>
              </div>
              <Progress value={(value / target) * 100} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Weekly profit/loss data
const weeklyProfitLossData = [
  { week: 'Week 1', profit: 12580, loss: 8670, balance: 3910 },
  { week: 'Week 2', profit: 14260, loss: 9450, balance: 4810 },
  { week: 'Week 3', profit: 13890, loss: 10210, balance: 3680 },
  { week: 'Week 4', profit: 15720, loss: 11350, balance: 4370 },
  { week: 'Week 5', profit: 16450, loss: 10980, balance: 5470 },
  { week: 'Week 6', profit: 15230, loss: 9870, balance: 5360 }
];

const WeeklyProfitLossChart: React.FC = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Weekly Profit & Loss</CardTitle>
        <CardDescription>Performance over the past 6 weeks</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyProfitLossData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend />
            <Bar dataKey="profit" name="Weekly Revenue" fill="#10b981" />
            <Bar dataKey="loss" name="Weekly Expenses" fill="#ef4444" />
            <Bar dataKey="balance" name="Net Profit/Loss" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const WeeklyMetricCard: React.FC<{
  title: string;
  thisWeek: number;
  lastWeek: number;
  icon: React.ReactNode;
  type: 'profit' | 'loss' | 'balance';
}> = ({ title, thisWeek, lastWeek, icon, type }) => {
  const change = thisWeek - lastWeek;
  const percentChange = lastWeek !== 0 ? (change / lastWeek * 100) : 0;
  const trend = change >= 0 ? 'up' : 'down';
  
  const getColorClass = () => {
    if (type === 'profit' || type === 'balance') {
      return trend === 'up' ? 'text-green-500' : 'text-red-500';
    } else if (type === 'loss') {
      return trend === 'up' ? 'text-red-500' : 'text-green-500';
    }
    return '';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 rounded-full bg-muted/80">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{formatCurrency(thisWeek)}</span>
            <div className={`flex items-center ml-2 ${getColorClass()}`}>
              {trend === 'up' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="text-xs font-medium">{Math.abs(percentChange).toFixed(1)}%</span>
            </div>
          </div>
          <CardDescription>
            {trend === 'up' ? 'Increased' : 'Decreased'} from {formatCurrency(lastWeek)} last week
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

const PurchaseSalesMetrics: React.FC = () => {
  // Sample data - in a real app, this would come from your API or state
  const metrics = [
    {
      title: 'Total Purchases',
      value: 215680.50,
      target: 250000,
      percentage: 9.3,
      icon: <Wallet className="h-4 w-4 text-indigo-500" />,
      trend: 'up' as const,
      description: 'Total value of inventory purchases'
    },
    {
      title: 'Net Sales',
      value: 172450.30,
      target: 200000,
      percentage: 15.7,
      icon: <BarChart2 className="h-4 w-4 text-teal-500" />,
      trend: 'up' as const,
      description: 'Total sales minus returns and discounts'
    },
    {
      title: 'Average Order Value',
      value: 485.75,
      percentage: 3.2,
      icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
      trend: 'up' as const,
      description: 'Average value per order'
    },
    {
      title: 'Profit Margin',
      value: 68970.20,
      percentage: 6.5,
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      trend: 'up' as const,
      description: 'Net profit after all expenses'
    }
  ];

  // Weekly metrics for current and previous weeks
  const weeklyMetrics = {
    profit: { thisWeek: 16450, lastWeek: 15720 },
    loss: { thisWeek: 10980, lastWeek: 11350 },
    balance: { thisWeek: 5470, lastWeek: 4370 }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            target={metric.target}
            percentage={metric.percentage}
            icon={metric.icon}
            trend={metric.trend}
            description={metric.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeeklyMetricCard
          title="Weekly Revenue"
          thisWeek={weeklyMetrics.profit.thisWeek}
          lastWeek={weeklyMetrics.profit.lastWeek}
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
          type="profit"
        />
        <WeeklyMetricCard
          title="Weekly Expenses"
          thisWeek={weeklyMetrics.loss.thisWeek}
          lastWeek={weeklyMetrics.loss.lastWeek}
          icon={<DollarSign className="h-4 w-4 text-red-500" />}
          type="loss"
        />
        <WeeklyMetricCard
          title="Weekly Net Profit"
          thisWeek={weeklyMetrics.balance.thisWeek}
          lastWeek={weeklyMetrics.balance.lastWeek}
          icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
          type="balance"
        />
      </div>

      <WeeklyProfitLossChart />
    </div>
  );
};

export default PurchaseSalesMetrics;
