
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  subtitle,
  className,
}) => {
  return (
    <div className={cn(
      "glass-card p-4 sm:p-5 flex flex-col animate-slide-up transition-all duration-300 hover:shadow-hover border border-border/30",
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 text-primary flex-shrink-0">
          {icon}
        </div>
      </div>
      <div className="mt-1">
        <div className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{value}</div>
        {(change || subtitle) && (
          <div className="flex items-center mt-1 flex-wrap">
            {change && (
              <div className={cn(
                "flex items-center text-xs font-medium",
                change.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {change.isPositive ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                {Math.abs(change.value)}%
              </div>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground ml-2">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
