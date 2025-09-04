
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  PhoneCall, 
  CheckSquare, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ListChecks,
  BarChart2,
  LineChart as LineChartIcon
} from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';

// Sample data
const weeklyPerformanceData = [
  { name: 'Mon', tasks: 5, calls: 3, meetings: 1 },
  { name: 'Tue', tasks: 7, calls: 4, meetings: 2 },
  { name: 'Wed', tasks: 3, calls: 6, meetings: 0 },
  { name: 'Thu', tasks: 8, calls: 2, meetings: 3 },
  { name: 'Fri', tasks: 4, calls: 5, meetings: 1 },
];

const memberPerformanceData = [
  { name: 'John D.', tasks: 25, calls: 18, meetings: 5 },
  { name: 'Maria R.', tasks: 32, calls: 27, meetings: 8 },
  { name: 'Robert K.', tasks: 18, calls: 12, meetings: 4 },
  { name: 'Sarah J.', tasks: 22, calls: 9, meetings: 6 },
  { name: 'David C.', tasks: 14, calls: 21, meetings: 3 },
];

const activityData = [
  { id: 1, employee: 'John Davis', activityType: 'Call', client: 'Acme Corp', date: '2023-08-18', status: 'Completed', duration: '35 min' },
  { id: 2, employee: 'Maria Rodriguez', activityType: 'Task', client: 'Tech Innovations', date: '2023-08-17', status: 'Completed', duration: '2 hrs' },
  { id: 3, employee: 'Robert Kim', activityType: 'Call', client: 'Global Solutions', date: '2023-08-16', status: 'Completed', duration: '28 min' },
  { id: 4, employee: 'Sarah Johnson', activityType: 'Meeting', client: 'City Retail Group', date: '2023-08-16', status: 'Completed', duration: '1 hr' },
  { id: 5, employee: 'Maria Rodriguez', activityType: 'Call', client: 'Acme Corp', date: '2023-08-15', status: 'Completed', duration: '15 min' },
];

const TeamPerformanceMetrics = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [chartType, setChartType] = useState('line');
  
  // Activity summary calculations
  const totalCalls = activityData.filter(item => item.activityType === 'Call').length;
  const totalTasks = activityData.filter(item => item.activityType === 'Task').length;
  const totalMeetings = activityData.filter(item => item.activityType === 'Meeting').length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-semibold">Team Performance Dashboard</h2>
          <p className="text-muted-foreground">Monitor tasks, calls, and activities from your team members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={timeRange === 'daily' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === 'weekly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
        </div>
      </div>

      {/* Activity Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Calls Made"
          value={totalCalls}
          icon={<PhoneCall className="h-5 w-5" />}
          change={{ value: 12, isPositive: true }}
          subtitle="vs last period"
        />
        <MetricsCard
          title="Tasks Completed"
          value={totalTasks}
          icon={<CheckSquare className="h-5 w-5" />}
          change={{ value: 5, isPositive: true }}
          subtitle="vs last period"
        />
        <MetricsCard
          title="Meetings Conducted"
          value={totalMeetings}
          icon={<Calendar className="h-5 w-5" />}
          change={{ value: 2, isPositive: false }}
          subtitle="vs last period"
        />
        <MetricsCard
          title="Avg Call Duration"
          value="26 min"
          icon={<PhoneCall className="h-5 w-5" />}
          change={{ value: 8, isPositive: true }}
          subtitle="vs last period"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trends */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Activity Trends</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant={chartType === 'line' ? 'secondary' : 'outline'} 
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setChartType('line')}
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'secondary' : 'outline'} 
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {chartType === 'line' ? (
                <LineChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tasks" stroke="#8884d8" activeDot={{ r: 8 }} name="Tasks" />
                  <Line type="monotone" dataKey="calls" stroke="#82ca9d" name="Calls" />
                  <Line type="monotone" dataKey="meetings" stroke="#ffc658" name="Meetings" />
                </LineChart>
              ) : (
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tasks" fill="#8884d8" name="Tasks" />
                  <Bar dataKey="calls" fill="#82ca9d" name="Calls" />
                  <Bar dataKey="meetings" fill="#ffc658" name="Meetings" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Member Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Member Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={memberPerformanceData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8" name="Tasks" />
                <Bar dataKey="calls" fill="#82ca9d" name="Calls" />
                <Bar dataKey="meetings" fill="#ffc658" name="Meetings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Employee</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Activity Type</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Client</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Date</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((activity) => (
                  <tr key={activity.id} className="border-b">
                    <td className="px-4 py-3">{activity.employee}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {activity.activityType === 'Call' && <PhoneCall size={14} className="mr-1 text-blue-500" />}
                        {activity.activityType === 'Task' && <CheckSquare size={14} className="mr-1 text-green-500" />}
                        {activity.activityType === 'Meeting' && <Calendar size={14} className="mr-1 text-amber-500" />}
                        {activity.activityType}
                      </div>
                    </td>
                    <td className="px-4 py-3">{activity.client}</td>
                    <td className="px-4 py-3">{activity.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{activity.duration}</td>
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

export default TeamPerformanceMetrics;
