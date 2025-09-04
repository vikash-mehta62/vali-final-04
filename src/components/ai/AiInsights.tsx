
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle,
  Zap,
  Lock
} from 'lucide-react';
import { AiInsight } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AiInsightsProps {
  insights: AiInsight[];
  className?: string;
  isPro?: boolean;
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights, className, isPro = false }) => {
  // This function gets the icon for each insight type
  const getInsightIcon = (type: string, impact: string) => {
    switch (type) {
      case 'inventory':
        return <Package size={18} />;
      case 'client':
        return <Users size={18} />;
      case 'sales':
        return <TrendingUp size={18} />;
      case 'general':
      default:
        return <Lightbulb size={18} />;
    }
  };
  
  // This function determines the color based on impact level
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

  // For demo purposes, show only 3 insights if not Pro
  const displayInsights = isPro ? insights : insights.slice(0, 3);
  const hasHiddenInsights = !isPro && insights.length > 3;

  return (
    <div className={cn("glass-card p-5 animate-slide-up", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">AI Insights</h3>
        <div className="bg-primary/10 text-primary rounded-full p-1.5">
          {isPro ? <Zap size={18} /> : <Lightbulb size={18} />}
        </div>
      </div>
      
      <div className="space-y-4">
        {displayInsights.map((insight) => (
          <div 
            key={insight.id} 
            className="rounded-lg border bg-card p-4 transition-all hover:shadow-soft"
          >
            <div className="flex gap-3">
              <div className={cn(
                "flex-shrink-0 rounded-full p-2",
                getImpactColor(insight.impact)
              )}>
                {getInsightIcon(insight.type, insight.impact)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <div className={cn(
                    "text-xs rounded-full px-2 py-0.5",
                    insight.impact === 'high' && "bg-red-100 text-red-700",
                    insight.impact === 'medium' && "bg-amber-100 text-amber-700",
                    insight.impact === 'low' && "bg-blue-100 text-blue-700"
                  )}>
                    {insight.impact} impact
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                
                {/* Pro feature: action buttons */}
                {isPro && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="default">Take Action</Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Show upgrade banner if not Pro and there are hidden insights */}
        {hasHiddenInsights && (
          <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-full p-2 bg-primary/10 text-primary">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Upgrade to see {insights.length - 3} more insights</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get unlimited AI insights with our Pro plan.
                </p>
                <Link to="/store">
                  <Button size="sm" className="gap-1.5">
                    <Zap size={14} />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsights;
