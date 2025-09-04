
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon,
  children 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-slide-down">
      <div className="flex items-center gap-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 mt-2 sm:mt-0">{children}</div>
      )}
    </div>
  );
};

export default PageHeader;
