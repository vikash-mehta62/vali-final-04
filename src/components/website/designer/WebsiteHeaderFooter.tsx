
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WebsiteHeaderFooterProps {
  websiteStyle: any;
  onStyleChange: (colorType: string, value: string) => void;
}

const WebsiteHeaderFooter: React.FC<WebsiteHeaderFooterProps> = ({
  websiteStyle,
  onStyleChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Header Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="headerTextColor">Header Text Color</Label>
          <div className="flex gap-2">
            <Input 
              id="headerTextColor"
              type="color" 
              value={websiteStyle?.headerTextColor || '#ffffff'} 
              onChange={(e) => onStyleChange('headerTextColor', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input 
              type="text"
              value={websiteStyle?.headerTextColor || '#ffffff'} 
              onChange={(e) => onStyleChange('headerTextColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Footer Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="footerColor">Footer Background Color</Label>
          <div className="flex gap-2">
            <Input 
              id="footerColor"
              type="color" 
              value={websiteStyle?.footerColor || '#1f2937'} 
              onChange={(e) => onStyleChange('footerColor', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input 
              type="text"
              value={websiteStyle?.footerColor || '#1f2937'} 
              onChange={(e) => onStyleChange('footerColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footerTextColor">Footer Text Color</Label>
          <div className="flex gap-2">
            <Input 
              id="footerTextColor"
              type="color" 
              value={websiteStyle?.footerTextColor || '#ffffff'} 
              onChange={(e) => onStyleChange('footerTextColor', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input 
              type="text"
              value={websiteStyle?.footerTextColor || '#ffffff'} 
              onChange={(e) => onStyleChange('footerTextColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteHeaderFooter;
