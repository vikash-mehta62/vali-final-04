
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Clock, 
  Calendar, 
  Mail 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DealSummary {
  stage: string;
  count: number;
  value: number;
  change: number;
}

interface WeeklyDealsSummaryProps {
  weekRange: string;
  totalDeals: number;
  totalValue: number;
  weeklyChange: number;
  stageBreakdown: DealSummary[];
  onSendWeeklySummary: () => void;
}

const WeeklyDealsSummary: React.FC<WeeklyDealsSummaryProps> = ({
  weekRange,
  totalDeals,
  totalValue,
  weeklyChange,
  stageBreakdown,
  onSendWeeklySummary
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Weekly Deals Summary</CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{weekRange}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onSendWeeklySummary}
        >
          <Mail className="h-4 w-4" />
          <span>Send Summary</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">Total Deals</div>
            <div className="text-2xl font-bold">{totalDeals}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">Weekly Change</div>
            <div className={`text-2xl font-bold flex items-center ${
              weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {weeklyChange >= 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              {weeklyChange}%
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Deal Stage Breakdown
          </h3>
          
          <div className="space-y-4">
            {stageBreakdown.map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{stage.stage}</div>
                  <div className="text-sm text-muted-foreground">
                    {stage.count} deals · {formatCurrency(stage.value)}
                  </div>
                </div>
                <Progress value={(stage.count / totalDeals) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center text-amber-600 gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Last updated 2 hours ago</span>
          </div>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <span>View Detailed Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyDealsSummary;
