
import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, Package, Users, AlertCircle } from 'lucide-react';
import { type Activity, formatDateTime } from '@/lib/data';

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, className }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={16} className="text-blue-500" />;
      case 'inventory':
        return <Package size={16} className="text-amber-500" />;
      case 'client':
        return <Users size={16} className="text-green-500" />;
      case 'system':
        return <AlertCircle size={16} className="text-purple-500" />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div className={cn("glass-card p-5 animate-slide-up", className)}>
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 pb-3 last:pb-0 last:border-b-0 border-b border-border/30"
          >
            <div className="flex-shrink-0 rounded-full bg-background p-1.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-primary font-medium hover:underline w-full text-center">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;
