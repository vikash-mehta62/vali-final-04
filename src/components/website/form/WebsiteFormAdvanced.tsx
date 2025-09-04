
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { websiteTemplates } from '../websiteTemplates';

interface WebsiteFormAdvancedProps {
  businessName: string;
  setBusinessName: (value: string) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  template: string;
  setTemplate: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const WebsiteFormAdvanced: React.FC<WebsiteFormAdvancedProps> = ({
  businessName,
  setBusinessName,
  prompt,
  setPrompt,
  template,
  setTemplate,
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="business-name-adv">Business Name</Label>
        <Input 
          id="business-name-adv" 
          value={businessName} 
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter your business name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="prompt">Describe your business</Label>
        <Textarea 
          id="prompt" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your business, products/services, target audience, and any specific features you want on your website."
          className="min-h-[150px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-adv">Template</Label>
        <Select value={template} onValueChange={setTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(websiteTemplates).map(([key, template]) => (
              <SelectItem key={key} value={key}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating} 
        className="mt-6 w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Website
          </>
        )}
      </Button>
    </div>
  );
};

export default WebsiteFormAdvanced;
