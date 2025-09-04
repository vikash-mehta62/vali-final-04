
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WebsiteStyleEditorProps {
  websiteStyle: any;
  onStyleChange: (colorType: string, value: string) => void;
  onFontChange: (value: string) => void;
}

const WebsiteStyleEditor: React.FC<WebsiteStyleEditorProps> = ({ 
  websiteStyle, 
  onStyleChange, 
  onFontChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select 
          value={websiteStyle?.fontFamily || 'system-ui'} 
          onValueChange={(value) => onFontChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system-ui, sans-serif">System Default</SelectItem>
            <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
            <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
            <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
            <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
            <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <div className="flex gap-2">
          <Input 
            id="primaryColor"
            type="color" 
            value={websiteStyle?.primaryColor || '#4f46e5'} 
            onChange={(e) => onStyleChange('primaryColor', e.target.value)}
            className="w-12 p-1 h-10"
          />
          <Input 
            type="text"
            value={websiteStyle?.primaryColor || '#4f46e5'} 
            onChange={(e) => onStyleChange('primaryColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="secondaryColor">Secondary Color</Label>
        <div className="flex gap-2">
          <Input 
            id="secondaryColor"
            type="color" 
            value={websiteStyle?.secondaryColor || '#f9fafb'} 
            onChange={(e) => onStyleChange('secondaryColor', e.target.value)}
            className="w-12 p-1 h-10"
          />
          <Input 
            type="text"
            value={websiteStyle?.secondaryColor || '#f9fafb'} 
            onChange={(e) => onStyleChange('secondaryColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2">
          <Input 
            id="backgroundColor"
            type="color" 
            value={websiteStyle?.backgroundColor || '#ffffff'} 
            onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
            className="w-12 p-1 h-10"
          />
          <Input 
            type="text"
            value={websiteStyle?.backgroundColor || '#ffffff'} 
            onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteStyleEditor;
