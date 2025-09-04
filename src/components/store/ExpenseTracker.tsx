import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from '@/utils/formatters';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TruckIcon, 
  DollarSign, 
  Users, 
  Wallet, 
  Building, 
  ShoppingCart, 
  Wrench, 
  FilePlus, 
  Download,
  FileText
} from 'lucide-react';
import { Expense, ExpenseCategory, WeeklyFinancialData } from '@/types';
import { exportExpenseReportToPDF, exportFinancialReportToPDF } from '@/utils/pdf';

// Sample expense data - would be fetched from an API in a real app
const sampleExpenses: Expense[] = [
  {
    id: 'exp1',
    category: 'shipping',
    amount: 1250.75,
    description: 'Monthly shipping costs for West Coast deliveries',
    date: '2023-05-01',
    payee: 'FastShip Logistics'
  },
  {
    id: 'exp2',
    category: 'salary',
    amount: 4500,
    description: 'Warehouse staff payroll',
    date: '2023-05-02',
    payee: 'Internal Payroll'
  },
  {
    id: 'exp3',
    category: 'utilities',
    amount: 850.25,
    description: 'Electricity and water for warehouse',
    date: '2023-05-05',
    payee: 'City Utilities'
  },
  {
    id: 'exp4',
    category: 'shipping',
    amount: 950.40,
    description: 'Express delivery fees',
    date: '2023-05-08',
    payee: 'QuickShip Inc.'
  },
  {
    id: 'exp5',
    category: 'salary',
    amount: 3800,
    description: 'Office staff payroll',
    date: '2023-05-10',
    payee: 'Internal Payroll'
  },
  {
    id: 'exp6',
    category: 'rent',
    amount: 2500,
    description: 'Warehouse monthly rent',
    date: '2023-05-15',
    payee: 'Commercial Properties Ltd.'
  },
  {
    id: 'exp7',
    category: 'supplies',
    amount: 420.30,
    description: 'Office supplies',
    date: '2023-05-18',
    payee: 'OfficeMax'
  },
  {
    id: 'exp8',
    category: 'maintenance',
    amount: 750,
    description: 'Forklift maintenance',
    date: '2023-05-20',
    payee: 'Equipment Repairs LLC'
  },
];

// Sample weekly financial data
const sampleWeeklyData: WeeklyFinancialData[] = [
  {
    week: 'Week 1',
    revenue: 28760.50,
    expenses: 16180.75,
    profit: 12579.75,
    margin: 43.7,
    expenseBreakdown: {
      shipping: 3750.25,
      salary: 8300,
      other: 4130.50
    }
  },
  {
    week: 'Week 2',
    revenue: 31450.80,
    expenses: 17190.30,
    profit: 14260.50,
    margin: 45.3,
    expenseBreakdown: {
      shipping: 4200.60,
      salary: 8300,
      other: 4689.70
    }
  },
  {
    week: 'Week 3',
    revenue: 29870.40,
    expenses: 15980.60,
    profit: 13889.80,
    margin: 46.5,
    expenseBreakdown: {
      shipping: 3590.10,
      salary: 8300,
      other: 4090.50
    }
  },
  {
    week: 'Week 4',
    revenue: 33580.60,
    expenses: 17860.20,
    profit: 15720.40,
    margin: 46.8,
    expenseBreakdown: {
      shipping: 4860.20,
      salary: 8300,
      other: 4700.00
    }
  },
  {
    week: 'Week 5',
    revenue: 34780.30,
    expenses: 18330.60,
    profit: 16449.70,
    margin: 47.3,
    expenseBreakdown: {
      shipping: 5230.60,
      salary: 8300,
      other: 4800.00
    }
  },
  {
    week: 'Week 6',
    revenue: 32500.40,
    expenses: 17270.20,
    profit: 15230.20,
    margin: 46.9,
    expenseBreakdown: {
      shipping: 4670.20,
      salary: 8300,
      other: 4300.00
    }
  }
];

// Get the category icon
const getCategoryIcon = (category: ExpenseCategory) => {
  switch (category) {
    case 'shipping':
      return <TruckIcon className="h-5 w-5" />;
    case 'salary':
      return <Users className="h-5 w-5" />;
    case 'utilities':
      return <Building className="h-5 w-5" />;
    case 'rent':
      return <Wallet className="h-5 w-5" />;
    case 'supplies':
      return <ShoppingCart className="h-5 w-5" />;
    case 'maintenance':
      return <Wrench className="h-5 w-5" />;
    default:
      return <DollarSign className="h-5 w-5" />;
  }
};

// Category selector component
const CategorySelector = ({ value, onChange }: { value: ExpenseCategory; onChange: (value: ExpenseCategory) => void }) => {
  return (
    <Select value={value} onValueChange={(value) => onChange(value as ExpenseCategory)}>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="shipping">Shipping</SelectItem>
        <SelectItem value="salary">Salary</SelectItem>
        <SelectItem value="utilities">Utilities</SelectItem>
        <SelectItem value="rent">Rent</SelectItem>
        <SelectItem value="supplies">Supplies</SelectItem>
        <SelectItem value="maintenance">Maintenance</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  );
};

// Add Expense Form Dialog
const AddExpenseDialog = ({ onAddExpense }: { onAddExpense: (expense: Expense) => void }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('shipping');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [payee, setPayee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurring, setRecurring] = useState(false);
  const [reference, setReference] = useState('');
  
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (!amount || !description || !date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newExpense: Expense = {
      id: `exp${Math.floor(Math.random() * 10000)}`,
      category,
      amount: parseFloat(amount),
      description,
      date,
      payee: payee || undefined,
      recurring,
      reference: reference || undefined
    };
    
    onAddExpense(newExpense);
    
    // Reset form and close dialog
    setCategory('shipping');
    setAmount('');
    setDescription('');
    setPayee('');
    setDate(new Date().toISOString().split('T')[0]);
    setRecurring(false);
    setReference('');
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <FilePlus className="mr-2 h-4 w-4" />
          Add New Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense with all relevant details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <CategorySelector value={category} onChange={setCategory} />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3">
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <div className="col-span-3">
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expense description"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payee" className="text-right">
              Payee
            </Label>
            <div className="col-span-3">
              <Input
                id="payee"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                placeholder="Who was paid"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reference" className="text-right">
              Reference
            </Label>
            <div className="col-span-3">
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Invoice or receipt number"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurring" className="text-right">
              Recurring
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={recurring}
                onCheckedChange={setRecurring}
              />
              <Label htmlFor="recurring">This is a recurring expense</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Expense table component
const ExpenseTable = ({ expenses, onDeleteExpense }: { 
  expenses: Expense[]; 
  onDeleteExpense: (id: string) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Payee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No expenses recorded yet. Add your first expense to get started.
            </TableCell>
          </TableRow>
        ) : (
          expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="flex items-center gap-2">
                {getCategoryIcon(expense.category)}
                <span className="capitalize">{expense.category}</span>
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.payee || '-'}</TableCell>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onDeleteExpense(expense.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

// Expense summary component
const ExpenseSummary = ({ expenses }: { expenses: Expense[] }) => {
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });
  
  // Prepare data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B8E23'];
  
  // Handle export to PDF
  const handleExportPDF = () => {
    exportExpenseReportToPDF(expenses, {
      title: 'Expense Report',
      includeCompanyDetails: true,
      includeSummary: true,
      categorizeExpenses: true,
      includeWeeklyBreakdown: true
    });
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <CardDescription>{expenses.length} expense records</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Biggest Category</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(expensesByCategory).length > 0 ? (
              <>
                <div className="text-2xl font-bold capitalize">
                  {Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0][0]}
                </div>
                <CardDescription>
                  {formatCurrency(Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0][1])}
                </CardDescription>
              </>
            ) : (
              <CardDescription>No data available</CardDescription>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalExpenses / 30)} {/* Simplified - assuming 30 days */}
                </div>
                <CardDescription>Based on monthly data</CardDescription>
              </>
            ) : (
              <CardDescription>No data available</CardDescription>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available to display chart
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Detailed expense by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(expensesByCategory).length > 0 ? (
              Object.entries(expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getCategoryIcon(category as ExpenseCategory)}
                        <span className="ml-2 capitalize">{category}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{((amount / totalExpenses) * 100).toFixed(1)}% of total</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(amount / totalExpenses) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No expense data available
              </div>
            )}
          </CardContent>
          <div className="px-6 pb-6">
            <Button variant="outline" className="w-full" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export Expense Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Weekly financial report component
const WeeklyFinancialReport = ({ weeklyData }: { weeklyData: WeeklyFinancialData[] }) => {
  // Handle export to PDF
  const handleExportPDF = () => {
    exportFinancialReportToPDF(weeklyData, {
      title: 'Weekly Financial Report',
      includeCompanyDetails: true,
      includeCharts: true
    });
  };
  
  // Calculate totals
  const totalRevenue = weeklyData.reduce((sum, week) => sum + week.revenue, 0);
  const totalExpenses = weeklyData.reduce((sum, week) => sum + week.expenses, 0);
  const totalProfit = weeklyData.reduce((sum, week) => sum + week.profit, 0);
  const averageMargin = totalProfit / totalRevenue * 100;
  
  // Calculate expense totals by category
  const totalShipping = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.shipping || 0), 0);
  const totalSalary = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.salary || 0), 0);
  const totalOther = weeklyData.reduce((sum, week) => sum + (week.expenseBreakdown?.other || 0), 0);
  
  // Pie chart data for expense breakdown
  const expenseBreakdownData = [
    { name: 'Shipping', value: totalShipping },
    { name: 'Salary', value: totalSalary },
    { name: 'Other', value: totalOther }
  ];
  
  // Colors for the pie chart
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166'];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <CardDescription>Across all weeks</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <CardDescription>Across all weeks</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            <CardDescription>Across all weeks</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
            <CardDescription>Profit margin percentage</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Financial Data</CardTitle>
            <CardDescription>Revenue, expenses, and profit by week</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyData.map((week) => (
                  <TableRow key={week.week}>
                    <TableCell>{week.week}</TableCell>
                    <TableCell className="text-right">{formatCurrency(week.revenue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(week.expenses)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(week.profit)}</TableCell>
                    <TableCell className="text-right">{week.margin.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Categories of expenses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Weekly Expense Breakdown</CardTitle>
          <CardDescription>Shipping, salary, and other expenses by week</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead className="text-right">Shipping</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-right">Other</TableHead>
                <TableHead className="text-right">Total Expenses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyData.map((week) => (
                <TableRow key={week.week}>
                  <TableCell>{week.week}</TableCell>
                  <TableCell className="text-right">{formatCurrency(week.expenseBreakdown?.shipping || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(week.expenseBreakdown?.salary || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(week.expenseBreakdown?.other || 0)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(week.expenses)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="px-6 pb-6">
          <Button variant="outline" className="w-full" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export Financial Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Main ExpenseTracker component
const ExpenseTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const { toast } = useToast();
  
  // Handle adding a new expense
  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };
  
  // Handle deleting an expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Expense deleted",
      description: "The expense has been removed successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Management</h2>
          <p className="text-muted-foreground">
            Track expenses, analyze financial data, and generate reports.
          </p>
        </div>
        <AddExpenseDialog onAddExpense={handleAddExpense} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expense Tracking</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>
                View and manage all your business expenses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseTable expenses={expenses} onDeleteExpense={handleDeleteExpense} />
            </CardContent>
          </Card>
          
          <Separator />
          
          <ExpenseSummary expenses={expenses} />
        </TabsContent>
        
        <TabsContent value="reports">
          <WeeklyFinancialReport weeklyData={sampleWeeklyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseTracker;
