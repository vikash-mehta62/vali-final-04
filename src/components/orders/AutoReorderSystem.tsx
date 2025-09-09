import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Zap, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Package,
  Bot,
  Bell,
  Calendar
} from 'lucide-react';

interface AutoReorderRule {
  id: string;
  productId: string;
  productName: string;
  enabled: boolean;
  minStockLevel: number;
  reorderQuantity: number;
  reorderPoint: number;
  leadTimeDays: number;
  safetyStock: number;
  lastTriggered?: string;
  nextCheck?: string;
  status: 'active' | 'triggered' | 'disabled';
}

interface ReorderAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedStockoutDate: string;
  autoOrderEnabled: boolean;
}

const AutoReorderSystem: React.FC = () => {
  const [reorderRules, setReorderRules] = useState<AutoReorderRule[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [globalSettings, setGlobalSettings] = useState({
    autoReorderEnabled: true,
    emailNotifications: true,
    slackNotifications: false,
    checkFrequency: 'daily', // daily, hourly, weekly
    defaultLeadTime: 7,
    defaultSafetyStock: 20
  });

  // Simulate fetching reorder rules and alerts
  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockRules: AutoReorderRule[] = [
      {
        id: '1',
        productId: 'prod1',
        productName: 'Organic Bananas 40lb',
        enabled: true,
        minStockLevel: 50,
        reorderQuantity: 200,
        reorderPoint: 75,
        leadTimeDays: 3,
        safetyStock: 25,
        lastTriggered: '2025-01-15',
        nextCheck: '2025-01-18',
        status: 'active'
      },
      {
        id: '2',
        productId: 'prod2',
        productName: 'Fresh Apples 35lb',
        enabled: true,
        minStockLevel: 30,
        reorderQuantity: 150,
        reorderPoint: 45,
        leadTimeDays: 2,
        safetyStock: 15,
        status: 'triggered'
      },
      {
        id: '3',
        productId: 'prod3',
        productName: 'Carrots 25lb',
        enabled: false,
        minStockLevel: 40,
        reorderQuantity: 100,
        reorderPoint: 60,
        leadTimeDays: 4,
        safetyStock: 20,
        status: 'disabled'
      }
    ];

    const mockAlerts: ReorderAlert[] = [
      {
        id: '1',
        productId: 'prod2',
        productName: 'Fresh Apples 35lb',
        currentStock: 42,
        reorderPoint: 45,
        suggestedQuantity: 150,
        urgency: 'high',
        estimatedStockoutDate: '2025-01-20',
        autoOrderEnabled: true
      },
      {
        id: '2',
        productId: 'prod4',
        productName: 'Lettuce 24ct',
        currentStock: 8,
        reorderPoint: 20,
        suggestedQuantity: 80,
        urgency: 'critical',
        estimatedStockoutDate: '2025-01-17',
        autoOrderEnabled: false
      },
      {
        id: '3',
        productId: 'prod5',
        productName: 'Tomatoes 25lb',
        currentStock: 35,
        reorderPoint: 40,
        suggestedQuantity: 120,
        urgency: 'medium',
        estimatedStockoutDate: '2025-01-22',
        autoOrderEnabled: true
      }
    ];

    setReorderRules(mockRules);
    setReorderAlerts(mockAlerts);
  }, []);

  const handleRuleToggle = (ruleId: string) => {
    setReorderRules(rules => 
      rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled, status: !rule.enabled ? 'active' : 'disabled' }
          : rule
      )
    );
  };

  const handleAutoOrder = (alertId: string) => {
    // Simulate creating an auto order
    console.log('Creating auto order for alert:', alertId);
    setReorderAlerts(alerts => 
      alerts.filter(alert => alert.id !== alertId)
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'triggered': return 'text-orange-600';
      case 'disabled': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Auto-Reorder System
          </h2>
          <p className="text-muted-foreground">
            Intelligent inventory management with automated reordering
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          System Settings
        </Button>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-reorder">Auto-Reorder Enabled</Label>
                <Switch 
                  id="auto-reorder"
                  checked={globalSettings.autoReorderEnabled}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, autoReorderEnabled: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch 
                  id="email-notifications"
                  checked={globalSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="slack-notifications">Slack Notifications</Label>
                <Switch 
                  id="slack-notifications"
                  checked={globalSettings.slackNotifications}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, slackNotifications: checked }))
                  }
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="check-frequency">Check Frequency</Label>
                <select 
                  id="check-frequency"
                  className="w-full mt-1 p-2 border rounded"
                  value={globalSettings.checkFrequency}
                  onChange={(e) => 
                    setGlobalSettings(prev => ({ ...prev, checkFrequency: e.target.value }))
                  }
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <Label htmlFor="default-lead-time">Default Lead Time (days)</Label>
                <Input 
                  id="default-lead-time"
                  type="number"
                  value={globalSettings.defaultLeadTime}
                  onChange={(e) => 
                    setGlobalSettings(prev => ({ ...prev, defaultLeadTime: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="default-safety-stock">Default Safety Stock (%)</Label>
                <Input 
                  id="default-safety-stock"
                  type="number"
                  value={globalSettings.defaultSafetyStock}
                  onChange={(e) => 
                    setGlobalSettings(prev => ({ ...prev, defaultSafetyStock: parseInt(e.target.value) }))
                  }
                />
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm font-medium text-blue-800">System Status</div>
                <div className="text-xs text-blue-600">
                  {globalSettings.autoReorderEnabled ? 'Active' : 'Disabled'} • 
                  Last check: 5 minutes ago
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reorder Alerts ({reorderAlerts.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Products that need immediate attention
          </p>
        </CardHeader>
        <CardContent>
          {reorderAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No reorder alerts at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reorderAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.productName}</h4>
                      <Badge variant={getUrgencyColor(alert.urgency)}>
                        {alert.urgency}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: {alert.currentStock} • Reorder Point: {alert.reorderPoint} • 
                      Stockout: {new Date(alert.estimatedStockoutDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <div className="font-medium">Suggested: {alert.suggestedQuantity}</div>
                      <div className="text-xs text-muted-foreground">
                        Auto: {alert.autoOrderEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    {alert.autoOrderEnabled ? (
                      <Button 
                        onClick={() => handleAutoOrder(alert.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Auto Order
                      </Button>
                    ) : (
                      <Button variant="outline">
                        Manual Order
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reorder Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Reorder Rules ({reorderRules.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure automatic reordering for your products
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-right p-2">Min Stock</th>
                  <th className="text-right p-2">Reorder Point</th>
                  <th className="text-right p-2">Reorder Qty</th>
                  <th className="text-right p-2">Lead Time</th>
                  <th className="text-right p-2">Safety Stock</th>
                  <th className="text-center p-2">Enabled</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reorderRules.map((rule) => (
                  <tr key={rule.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{rule.productName}</div>
                        {rule.lastTriggered && (
                          <div className="text-xs text-muted-foreground">
                            Last: {new Date(rule.lastTriggered).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <span className={`text-xs font-medium ${getStatusColor(rule.status)}`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="text-right p-2">{rule.minStockLevel}</td>
                    <td className="text-right p-2">{rule.reorderPoint}</td>
                    <td className="text-right p-2 font-medium">{rule.reorderQuantity}</td>
                    <td className="text-right p-2">{rule.leadTimeDays}d</td>
                    <td className="text-right p-2">{rule.safetyStock}</td>
                    <td className="text-center p-2">
                      <Switch 
                        checked={rule.enabled}
                        onCheckedChange={() => handleRuleToggle(rule.id)}
                      />
                    </td>
                    <td className="text-center p-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Orders This Month</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockouts Prevented</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">
              From alert to order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$2,340</div>
            <p className="text-xs text-muted-foreground">
              Emergency order savings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoReorderSystem;