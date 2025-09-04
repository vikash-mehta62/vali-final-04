
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Package,
  Filter,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiInsights } from '@/lib/data';
import AiInsights from '@/components/ai/AiInsights';
import { Link } from 'react-router-dom';

const Insights = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  // This is a placeholder - in a real app, this would come from auth state
  const isPro = false;
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const filteredInsights = filter 
    ? aiInsights.filter(insight => insight.type === filter) 
    : aiInsights;
  
  const getInsightIcon = (type: string, impact: string) => {
    switch (type) {
      case 'inventory':
        return <Package size={20} />;
      case 'client':
        return <Users size={20} />;
      case 'sales':
        return <TrendingUp size={20} />;
      case 'general':
      default:
        return <Lightbulb size={20} />;
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return "text-red-500 bg-red-50";
      case 'medium':
        return "text-amber-500 bg-amber-50";
      case 'low':
      default:
        return "text-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <PageHeader 
                title="AI Insights" 
                description="AI-powered recommendations and insights for your business"
              >
                <div className="flex gap-2">
                  <Button variant="outline">
                    <RefreshCw size={16} className="mr-2" />
                    Refresh Insights
                  </Button>
                  {!isPro && (
                    <Link to="/store">
                      <Button className="gap-1.5">
                        <Zap size={16} />
                        Upgrade to Pro
                      </Button>
                    </Link>
                  )}
                </div>
              </PageHeader>
            </div>
            
            {!isPro && (
              <Card className="mb-6 border-primary/40 bg-primary/5">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-shrink-0 rounded-full p-2.5 bg-primary/20 text-primary">
                    <Zap size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">You're limited to 3 insights on the Free plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Pro for unlimited insights, advanced filtering, and actionable recommendations.
                    </p>
                  </div>
                  <Link to="/store" className="flex-shrink-0 mt-2 sm:mt-0">
                    <Button size="sm">Upgrade Now</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-slide-down">
              <Button 
                variant={filter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(null)}
              >
                All
              </Button>
              <Button 
                variant={filter === 'inventory' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('inventory')}
              >
                <Package size={14} className="mr-1.5" />
                Inventory
              </Button>
              <Button 
                variant={filter === 'client' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('client')}
              >
                <Users size={14} className="mr-1.5" />
                Clients
              </Button>
              <Button 
                variant={filter === 'sales' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('sales')}
              >
                <TrendingUp size={14} className="mr-1.5" />
                Sales
              </Button>
              <Button 
                variant={filter === 'general' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('general')}
              >
                <Lightbulb size={14} className="mr-1.5" />
                General
              </Button>
            </div>
            
            <AiInsights insights={filteredInsights} isPro={isPro} />
            
            {filteredInsights.length === 0 && (
              <div className="text-center py-12">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No insights available</h3>
                <p className="text-muted-foreground">
                  There are no insights for the selected filter.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Insights;
