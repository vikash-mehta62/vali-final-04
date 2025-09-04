
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WebsiteBasicInfoProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

const WebsiteBasicInfo: React.FC<WebsiteBasicInfoProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Website Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="websiteName">Website Name</Label>
        <Input 
          id="websiteName"
          value={name} 
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your website name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="websiteDescription">Website Description</Label>
        <Textarea 
          id="websiteDescription"
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your website"
          rows={3}
        />
      </div>
    </div>
  );
};

export default WebsiteBasicInfo;
